from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import asyncio
import httpx
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")  # Ignore MongoDB's _id field
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str


class BriefCreate(BaseModel):
    """Incoming payload from the /brief page form.

    All fields optional so partial submissions don't 422 in the client — the
    validation UI on the frontend enforces required fields before submitting.
    """
    model_config = ConfigDict(extra="ignore")

    name: str = ""
    phone: str = ""
    email: str = ""
    company: str = ""
    website: str = ""
    services: List[str] = Field(default_factory=list)
    projectDetails: str = ""


class Brief(BaseModel):
    model_config = ConfigDict(extra="ignore")

    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    phone: str
    email: str
    company: str
    website: str
    services: List[str]
    projectDetails: str
    submittedAt: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    forwardedToSheet: bool = False


# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "Hello World"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.model_dump()
    status_obj = StatusCheck(**status_dict)
    
    # Convert to dict and serialize datetime to ISO string for MongoDB
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    
    _ = await db.status_checks.insert_one(doc)
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    # Exclude MongoDB's _id field from the query results
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    
    # Convert ISO string timestamps back to datetime objects
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    
    return status_checks


async def _forward_brief_to_sheet(payload: dict) -> bool:
    """Best-effort fan-out to a Google Apps Script Web App webhook.

    Returns True on 2xx, False otherwise. Never raises — the primary storage
    is MongoDB; Sheet forwarding is a nice-to-have and must not block or
    fail the user submission.
    """
    sheet_url = os.environ.get('GOOGLE_SHEET_WEBHOOK_URL', '').strip()
    if not sheet_url:
        return False
    try:
        # Apps Script `/exec` runs doPost on the initial POST (that's when the
        # row is appended), then responds with a 302 to
        # `script.googleusercontent.com/macros/echo?...` which must be
        # fetched with GET to receive the JSON result. So: POST once, then
        # follow any 3xx chain with GET.
        async with httpx.AsyncClient(timeout=12.0, follow_redirects=False) as http:
            r = await http.post(sheet_url, json=payload)
            hops = 0
            while r.status_code in (301, 302, 303, 307, 308) and hops < 5:
                loc = r.headers.get("location")
                if not loc:
                    break
                r = await http.get(loc)
                hops += 1
            if not (200 <= r.status_code < 300):
                logger.warning("Sheet webhook non-2xx: %s %s", r.status_code, (r.text or "")[:200])
                return False
            # Apps Script returns 200 even for script errors, with an HTML error
            # page. Treat HTML responses as failures so `forwardedToSheet` reflects
            # reality. A healthy script returns JSON like {"ok": true}.
            ct = (r.headers.get("content-type") or "").lower()
            body = (r.text or "").strip()
            if "text/html" in ct or body.startswith("<"):
                logger.warning("Sheet webhook returned HTML (likely Apps Script error): %s", body[:300])
                return False
            try:
                j = r.json()
                if isinstance(j, dict) and j.get("ok") is False:
                    logger.warning("Sheet webhook reported failure: %s", body[:300])
                    return False
            except Exception:
                pass  # non-JSON but non-HTML — accept
            return True
    except Exception as exc:  # noqa: BLE001 — swallow, never break the submit
        logger.warning("Sheet webhook forward failed: %s", exc)
        return False


@api_router.post("/brief", response_model=Brief)
async def submit_brief(input: BriefCreate):
    """Accept a project brief from the /brief page.

    Flow: validate → persist to MongoDB → (optional) fan out to a Google
    Sheet via Apps Script webhook. Sheet forwarding is intentionally
    fire-and-return so a slow/broken sheet doesn't slow the user down.
    """
    brief = Brief(
        name=input.name.strip(),
        phone=input.phone.strip(),
        email=input.email.strip(),
        company=input.company.strip(),
        website=input.website.strip(),
        services=[s.strip() for s in input.services if s and s.strip()],
        projectDetails=input.projectDetails.strip(),
    )

    doc = brief.model_dump()
    doc['submittedAt'] = doc['submittedAt'].isoformat()
    await db.briefs.insert_one(doc)

    # motor mutates `doc` in-place by adding a Mongo `_id: ObjectId(...)`,
    # which is not JSON-serializable. Build a clean, JSON-safe payload for
    # the outbound webhook from the pydantic model instead.
    outbound = brief.model_dump()
    outbound['submittedAt'] = doc['submittedAt']

    # Fan out to Google Sheet (best-effort, awaited so we can update the
    # forwardedToSheet flag on the returned object).
    forwarded = await _forward_brief_to_sheet(outbound)
    if forwarded:
        await db.briefs.update_one({"id": brief.id}, {"$set": {"forwardedToSheet": True}})
        brief.forwardedToSheet = True

    return brief


@api_router.get("/brief", response_model=List[Brief])
async def list_briefs(limit: int = 100):
    """Small admin endpoint to review submissions from the DB.

    Not linked from the UI — intentional. Query via the API URL directly.
    """
    rows = await db.briefs.find({}, {"_id": 0}).sort("submittedAt", -1).to_list(min(max(limit, 1), 500))
    for r in rows:
        if isinstance(r.get('submittedAt'), str):
            r['submittedAt'] = datetime.fromisoformat(r['submittedAt'])
    return rows

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()