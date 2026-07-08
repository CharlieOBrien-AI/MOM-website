#====================================================================================================
# START - Testing Protocol - DO NOT EDIT OR REMOVE THIS SECTION
#====================================================================================================

# THIS SECTION CONTAINS CRITICAL TESTING INSTRUCTIONS FOR BOTH AGENTS
# BOTH MAIN_AGENT AND TESTING_AGENT MUST PRESERVE THIS ENTIRE BLOCK

# Communication Protocol:
# If the `testing_agent` is available, main agent should delegate all testing tasks to it.
#
# You have access to a file called `test_result.md`. This file contains the complete testing state
# and history, and is the primary means of communication between main and the testing agent.
#
# Main and testing agents must follow this exact format to maintain testing data. 
# The testing data must be entered in yaml format Below is the data structure:
# 
## user_problem_statement: {problem_statement}
## backend:
##   - task: "Task name"
##     implemented: true
##     working: true  # or false or "NA"
##     file: "file_path.py"
##     stuck_count: 0
##     priority: "high"  # or "medium" or "low"
##     needs_retesting: false
##     status_history:
##         -working: true  # or false or "NA"
##         -agent: "main"  # or "testing" or "user"
##         -comment: "Detailed comment about status"
##
## frontend:
##   - task: "Task name"
##     implemented: true
##     working: true  # or false or "NA"
##     file: "file_path.js"
##     stuck_count: 0
##     priority: "high"  # or "medium" or "low"
##     needs_retesting: false
##     status_history:
##         -working: true  # or false or "NA"
##         -agent: "main"  # or "testing" or "user"
##         -comment: "Detailed comment about status"
##
## metadata:
##   created_by: "main_agent"
##   version: "1.0"
##   test_sequence: 0
##   run_ui: false
##
## test_plan:
##   current_focus:
##     - "Task name 1"
##     - "Task name 2"
##   stuck_tasks:
##     - "Task name with persistent issues"
##   test_all: false
##   test_priority: "high_first"  # or "sequential" or "stuck_first"
##
## agent_communication:
##     -agent: "main"  # or "testing" or "user"
##     -message: "Communication message between agents"

# Protocol Guidelines for Main agent
#
# 1. Update Test Result File Before Testing:
#    - Main agent must always update the `test_result.md` file before calling the testing agent
#    - Add implementation details to the status_history
#    - Set `needs_retesting` to true for tasks that need testing
#    - Update the `test_plan` section to guide testing priorities
#    - Add a message to `agent_communication` explaining what you've done
#
# 2. Incorporate User Feedback:
#    - When a user provides feedback that something is or isn't working, add this information to the relevant task's status_history
#    - Update the working status based on user feedback
#    - If a user reports an issue with a task that was marked as working, increment the stuck_count
#    - Whenever user reports issue in the app, if we have testing agent and task_result.md file so find the appropriate task for that and append in status_history of that task to contain the user concern and problem as well 
#
# 3. Track Stuck Tasks:
#    - Monitor which tasks have high stuck_count values or where you are fixing same issue again and again, analyze that when you read task_result.md
#    - For persistent issues, use websearch tool to find solutions
#    - Pay special attention to tasks in the stuck_tasks list
#    - When you fix an issue with a stuck task, don't reset the stuck_count until the testing agent confirms it's working
#
# 4. Provide Context to Testing Agent:
#    - When calling the testing agent, provide clear instructions about:
#      - Which tasks need testing (reference the test_plan)
#      - Any authentication details or configuration needed
#      - Specific test scenarios to focus on
#      - Any known issues or edge cases to verify
#
# 5. Call the testing agent with specific instructions referring to test_result.md
#
# IMPORTANT: Main agent must ALWAYS update test_result.md BEFORE calling the testing agent, as it relies on this file to understand what to test next.

#====================================================================================================
# END - Testing Protocol - DO NOT EDIT OR REMOVE THIS SECTION
#====================================================================================================



#====================================================================================================
# Testing Data - Main Agent and testing sub agent both should log testing data below this section
#====================================================================================================

user_problem_statement: "Iteration 4: (1) Fix Windows/Mac video quality complaints — hero scrub video was picking 720p WebM over 1080p MP4; (2) Remove leaves background on Stats section; (3) Rewrite all section eyebrow headings with better copy; (4) Replace Push/Pull scrub video with new user-supplied 4K video (re-encoded 2560x1430 all-intra H.264 + 1920 VP9 WebM fallback), same scrub logic; (5) Move How-it-works section before Recent-work; (6) Approach copy overhaul: new static headline 'Most brands push content, ignoring what pulls audiences.' (push muted italic, pulls purple italic), toggle captions deleted, small card reduced to a single metaphor line per mode ('Like a crowd gathering around a great performer.' / 'Like handing flyers to strangers.'), layout/toggle/monitor untouched."

frontend:
  - task: "Hero scrub video uses high-quality 1080p MP4 first (Windows/Mac quality fix)"
    implemented: true
    working: true
    file: "/app/frontend/src/components/site/HeroScrubVideo.jsx"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
      - working: true
        agent: "main"
        comment: "Source order flipped: MP4 (1920x1080 H.264) now listed before the 720p VP9 WebM, so Chrome/Edge/Firefox on Windows and Safari on Mac pick the high-quality file. Verified via screenshot — hero renders. NOTE: this sandbox's headless Chromium has no H.264, so it falls back to the WebM here; real browsers pick the MP4."

  - task: "New Push/Pull workspace video wired in with same scrub logic (night=Pull, day=Push)"
    implemented: true
    working: true
    file: "/app/frontend/src/components/site/Approach.jsx"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
      - working: true
        agent: "main"
        comment: "User's new 4K video transcoded to 2560x1430 all-intra H.264 (owl-workspace.mp4, CRF19) + 1920x1072 VP9 WebM fallback (owl-workspace.webm). Poster regenerated from frame 0. Wrapper aspectRatio updated to 2560/1430 (natural aspect, zero crop). Verified in browser: video decodes (duration 5.042s), Push scrubs 0 -> 5.042 (night to day), Pull default parks at 0. Examples card re-anchored to the new video's monitor screen (left 47.35%, top 28.9%, width 32.4%, height 39.1%) — DOM measurement matches exactly; screenshot confirms pixel-perfect placement on the day-scene monitor."

  - task: "Approach copy overhaul (new headline, no toggle captions, metaphor-only small card)"
    implemented: true
    working: true
    file: "/app/frontend/src/components/site/Approach.jsx"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
      - working: true
        agent: "main"
        comment: "Headline now static: 'Most brands push content, ignoring what pulls audiences.' with push in var(--mo-mute) italic and pulls in var(--mo-accent) italic. Toggle caption lines (THE OWL AWAKE/ASLEEP) deleted. Small glass card shows ONLY the metaphor line per mode with generous padding (px-8 py-9): Pull='Like a crowd gathering around a great performer.', Push='Like handing flyers to strangers.'. Layout, toggle, monitor, Examples card all unchanged. Verified via screenshots in both modes."

  - task: "Stats section: leaves background removed, heading '// The results speak'"
    implemented: true
    working: true
    file: "/app/frontend/src/components/site/Stats.jsx"
    stuck_count: 0
    priority: "medium"
    needs_retesting: false
    status_history:
      - working: true
        agent: "main"
        comment: "Background image div + readability overlay removed; section now transparent over the site-wide orb backdrop. Eyebrow replaced. Verified via screenshot + DOM check (0 background images in section)."

  - task: "Section order swap (How it works before Recent work) + eyebrow heading rewrites + Safari webkit backdrop prefixes"
    implemented: true
    working: true
    file: "/app/frontend/src/pages/Home.jsx"
    stuck_count: 0
    priority: "medium"
    needs_retesting: false
    status_history:
      - working: true
        agent: "main"
        comment: "Home.jsx order now Hero, Stats, Approach, HowItWorks, Work, Voices, Contact, FAQ (verified via DOM: ['top','stats-section','approach','process-section','work',...]). Eyebrows rewritten: Hero '// The storytelling studio for founders', Stats '// The results speak', Approach '// Why pull wins', HowItWorks '// Simple by design', Work '// Proof in the wild', Voices '// Earned, not bought', FAQ '// Before you ask'. WebkitBackdropFilter added beside backdropFilter inline styles in Nav, Footer, Work, PremiumToggle for older Safari. Unused night-to-day/day-to-night videos (~55MB) deleted."

metadata:
  created_by: "main_agent"
  version: "1.3"
  test_sequence: 4
  run_ui: true

test_plan:
  current_focus:
    - "New Push/Pull workspace video wired in with same scrub logic (night=Pull, day=Push)"
    - "Approach copy overhaul (new headline, no toggle captions, metaphor-only small card)"
  stuck_tasks: []
  test_all: false
  test_priority: "high_first"

agent_communication:
  - agent: "main"
    message: "Iteration 4 complete, self-verified via screenshots. Files changed: Approach.jsx, Stats.jsx, Home.jsx, HeroScrubVideo.jsx, Nav.jsx, Footer.jsx, Work.jsx, HowItWorks.jsx, Voices.jsx, FAQ.jsx, Hero.jsx, PremiumToggle.jsx + assets (owl-workspace.mp4 replaced with 2560x1430 all-intra, owl-workspace.webm added, poster regenerated, old transition videos deleted). TESTING NOTES: (1) This sandbox's headless Chromium lacks H.264 — the Approach video now has a VP9 WebM fallback so it DOES decode here and the night/day scrub is fully verifiable (duration 5.042s). (2) Toggle buttons use data-testid 'toggle-push'/'toggle-pull'; two instances exist (desktop + mobile) — use .first/:visible. (3) Examples card testid 'approach-caption', anchored at left 47.35% / top 28.9% / width 32.4% / height 39.1% of the video box, visible only in Push mode."
