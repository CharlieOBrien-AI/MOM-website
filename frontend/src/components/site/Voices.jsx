import { ThumbsUp, ThumbsDown, Heart, MoreVertical, ChevronDown, BadgeCheck } from "lucide-react";
import GlassSurface from "@/components/glass/GlassSurface";
import Reveal from "./Reveal";
import { VOICES } from "@/constants/testIds";

// Real comments, replicated faithfully (usernames, likes, hearts, replies).
const comments = [
  {
    platform: "youtube",
    avatarBg: "#2e7d4f",
    avatarText: "G",
    user: "@GangisDankus",
    time: "1 month ago",
    lines: ["Story gave me chills bruh, cheers man!"],
    likes: "1",
    creatorHeart: true,
    heartOutline: false,
  },
  {
    platform: "youtube",
    avatarBg: "#3d6a7a",
    avatarText: "S",
    user: "@ShooterMacgavin",
    time: "1 month ago",
    lines: [
      "Just found your channel and have to say thanks for educating the masses on the biggest paradigm shift since the Internet. Most aren't aware just how scary this tech is. Malevolent/ Benevolent.  I've been in tech for 25 years and still shocked they released this kind of power to GenPop that's usually reserved for the NSA's of the world.",
      "I'm going through every vid because it's great backstory expressed short enough for today's brains to absorb.  Keep em coming!",
    ],
    showLess: true,
    likes: null,
    creatorHeart: false,
    heartOutline: true,
    replies: 1,
  },
  {
    platform: "youtube",
    avatarBg: "#4a5568",
    avatarText: "J",
    user: "@JayJames-kw8er",
    time: "2 months ago",
    lines: ["Great channel awesome content! Subscribed! Keep em coming bro!"],
    likes: null,
    creatorHeart: false,
    heartOutline: true,
  },
  {
    platform: "youtube",
    avatarBg: "#b3231b",
    avatarText: "33",
    user: "@shantanu_shanbhag",
    time: "5 months ago",
    lines: [
      "charlie deserves to be a bigger youtuber man his content is honesty much better than the people who are unnecessarily famous",
    ],
    likes: "2",
    creatorHeart: true,
    heartOutline: false,
  },
  {
    platform: "instagram",
    avatarImage: "/images/avatars/allstarsteven.jpg",
    user: "allstarsteven",
    verified: true,
    lines: ["Your content quality is 🔥"],
    meta: "4w",
    viewReplies: 1,
  },
  {
    platform: "instagram",
    avatarBg: "#3b3b40",
    avatarText: "S",
    user: "samuelbryan268",
    lines: ["Your page & content is in the top 1% , great work . Keep pushing 🔥"],
    meta: "9w",
    likesLabel: "7 likes",
    viewReplies: 1,
  },
  {
    platform: "instagram",
    avatarBg: "#6b4450",
    avatarText: "A",
    user: "angelin1769",
    lines: ["Followed ! This page deserve more credit in my opinion 🥹"],
    meta: "6w",
    likesLabel: "1 like",
    viewReplies: 1,
  },
  {
    platform: "instagram",
    avatarBg: "#54503e",
    avatarText: "V",
    user: "vinaydembla",
    lines: [
      '"Don\'t stop learning" must be the motto of this account, because indeed one never stops learning here.',
    ],
    meta: "17w",
    likesLabel: "2 likes",
    viewReplies: 1,
  },
];

const ytFont = "Roboto, 'Helvetica Neue', Arial, sans-serif";

function CreatorHeart() {
  return (
    <span className="relative inline-block h-[22px] w-[22px]" aria-label="Hearted by creator">
      <img
        src="/images/avatars/charlie.jpg"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full rounded-full object-cover"
        style={{
          background: "linear-gradient(135deg, #6d3fb0, #2b1b4d)",
        }}
      />
      <Heart
        size={11}
        className="absolute -bottom-[3px] -right-[3px]"
        fill="#ff0033"
        color="#ff0033"
      />
    </span>
  );
}

function YouTubeComment({ c }) {
  return (
    <div className="flex gap-3.5" style={{ fontFamily: ytFont }}>
      {/* Avatar */}
      <div
        className="grid h-10 w-10 flex-none place-items-center rounded-full text-[15px] font-medium text-white"
        style={{ background: c.avatarBg, letterSpacing: c.avatarText.length > 1 ? "-0.03em" : 0 }}
      >
        {c.avatarText}
      </div>

      <div className="min-w-0 flex-1">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-wrap items-baseline gap-2">
            <span className="text-[13px] font-semibold text-white">{c.user}</span>
            <span className="text-[12px]" style={{ color: "#aaaaaa" }}>
              {c.time}
            </span>
          </div>
          <MoreVertical size={16} color="#aaaaaa" className="flex-none" aria-hidden="true" />
        </div>

        {/* Text */}
        <div className="mt-1 space-y-1">
          {c.lines.map((l, i) => (
            <p key={i} className="text-[14px] leading-[1.45] text-white">
              {l}
            </p>
          ))}
        </div>
        {c.showLess && (
          <div className="mt-2 text-[13px] font-medium" style={{ color: "#aaaaaa" }}>
            Show less
          </div>
        )}

        {/* Action row */}
        <div className="mt-3 flex items-center gap-5">
          <span className="flex items-center gap-2">
            <ThumbsUp size={16} color="#f1f1f1" strokeWidth={1.7} />
            {c.likes && (
              <span className="text-[12px]" style={{ color: "#aaaaaa" }}>
                {c.likes}
              </span>
            )}
          </span>
          <ThumbsDown size={16} color="#f1f1f1" strokeWidth={1.7} />
          {c.creatorHeart && <CreatorHeart />}
          {c.heartOutline && <Heart size={16} color="#f1f1f1" strokeWidth={1.7} />}
          <span className="text-[12px] font-medium text-white">Reply</span>
        </div>

        {/* Replies row */}
        {c.replies ? (
          <div className="mt-4 flex items-center gap-2.5">
            <span
              className="grid h-6 w-6 place-items-center rounded-full text-[9px] font-medium text-white"
              style={{ background: "linear-gradient(135deg, #6d3fb0, #2b1b4d)" }}
            >
              C
            </span>
            <span className="text-[13px] font-medium" style={{ color: "#3ea6ff" }}>
              • {c.replies} reply
            </span>
            <ChevronDown size={16} color="#3ea6ff" />
          </div>
        ) : null}
      </div>
    </div>
  );
}

function InstagramComment({ c }) {
  return (
    <div className="flex gap-3.5" style={{ fontFamily: ytFont }}>
      {c.avatarImage ? (
        <img
          src={c.avatarImage}
          alt={c.user}
          className="h-9 w-9 flex-none rounded-full object-cover"
          style={{ display: "block" }}
        />
      ) : (
        <div
          className="grid h-9 w-9 flex-none place-items-center rounded-full text-[14px] font-medium text-white"
          style={{ background: c.avatarBg }}
        >
          {c.avatarText}
        </div>
      )}

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-4">
          <p className="text-[14px] leading-[1.5] text-white">
            <span className="font-semibold">{c.user}</span>
            {c.verified ? (
              <BadgeCheck
                size={14}
                className="ml-1 inline-block align-[-2px] flex-none"
                fill="#3897f0"
                color="#000"
                strokeWidth={2.2}
                aria-label="Verified"
              />
            ) : null}{" "}
            {c.lines[0]}
          </p>
          <Heart size={16} color="#f1f1f1" strokeWidth={1.7} className="mt-1 flex-none" />
        </div>

        <div className="mt-2 flex items-center gap-4 text-[13px]" style={{ color: "#a8a8a8" }}>
          <span>{c.meta}</span>
          {c.likesLabel ? <span className="font-medium">{c.likesLabel}</span> : null}
          <span className="font-medium">Reply</span>
        </div>

        {c.viewReplies ? (
          <div className="mt-3.5 flex items-center gap-4 text-[13px]" style={{ color: "#a8a8a8" }}>
            <span aria-hidden="true" className="inline-block h-px w-8" style={{ background: "#555" }} />
            <span className="font-medium">View replies ({c.viewReplies})</span>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default function Voices() {
  return (
    <section
      data-testid={VOICES.root}
      className="relative overflow-hidden"
      style={{ background: "transparent" }}
    >
      {/* Background is provided by the site-wide <SiteBackground /> parallax
          layer mounted on Home.jsx — this section is fully transparent so it
          floats over that single continuous nightscape. */}
      <div className="relative mx-auto max-w-[1240px] section-px py-[70px] text-center">
        <Reveal>
          <div className="mono-eyebrow mb-4">
            <span style={{ color: "var(--mo-accent)" }}>//</span> What people say
          </div>
          <h2
            className="mx-auto max-w-[720px] text-white"
            style={{
              fontFamily: "Instrument Serif, serif",
              fontSize: "clamp(36px, 5vw, 68px)",
              lineHeight: 1.02,
              letterSpacing: "-0.015em",
            }}
          >
            {"People can buy followers."}
            <br />
            {"They can't buy"}{" "}
            <span style={{ color: "var(--mo-accent)", fontStyle: "italic" }}>
              this.
            </span>
          </h2>
        </Reveal>

        {/* Mobile: horizontal snap-carousel (comments scroll sideways
            instead of stacking one below the other). Desktop keeps the
            masonry column layout unchanged. items-start prevents flex
            from stretching cards to the tallest sibling's height. */}
        <div
          className="mt-10 -mx-4 flex snap-x snap-mandatory items-start gap-4 overflow-x-auto px-4 pb-4 md:hidden"
          style={{
            scrollbarWidth: "none",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {comments.map((c, i) => (
            <div
              key={`m-${c.user}`}
              className="snap-start shrink-0"
              style={{ width: "82vw", maxWidth: 380 }}
            >
              <GlassSurface
                data-testid={`voice-comment-m-${i}`}
                className="rounded-2xl p-5"
                tilt={0}
                style={{ background: "rgba(15,15,15,0.62)" }}
              >
                {c.platform === "youtube" ? (
                  <YouTubeComment c={c} />
                ) : (
                  <InstagramComment c={c} />
                )}
              </GlassSurface>
            </div>
          ))}
          {/* Trailing spacer so the last card can snap fully into view */}
          <div className="shrink-0" style={{ width: "1px" }} aria-hidden="true" />
        </div>

        {/* Desktop: original CSS columns masonry — unchanged. */}
        <div className="mt-12 hidden gap-5 text-left md:columns-2 lg:columns-3 md:block">
          {comments.map((c, i) => (
            <Reveal key={c.user} delay={(i % 3) * 110} className="mb-5 break-inside-avoid">
              <GlassSurface
                data-testid={`voice-comment-${i}`}
                className="rounded-2xl p-5 sm:p-6"
                tilt={2.5}
                style={{ background: "rgba(15,15,15,0.55)" }}
              >
                {c.platform === "youtube" ? (
                  <YouTubeComment c={c} />
                ) : (
                  <InstagramComment c={c} />
                )}
              </GlassSurface>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
