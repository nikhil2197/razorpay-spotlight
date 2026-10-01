# Razorpay Spotlight — Technical Architecture

## 1. Architectural Principles & Constraints

To guarantee high performance, rapid iteration, and zero infrastructure overhead during evaluation:

- **Zero database server** — no Postgres, MongoDB, or DynamoDB instance to provision or manage.
- **Zero persistent compute backend** — no custom Node/Python API server. (No Docker, either — see note below.)
- **Deterministic presentation engine** — client-side keyword/regex extraction backed by a structured schema, eliminating external LLM latency, token failures, or rate limits during a live, judged demo.
- **Single-engine web stack** — Next.js (App Router) deployed on Vercel.

> **Deployment note:** an earlier draft of this doc considered a local Docker environment. That's been dropped — the app has no backend, database, or stateful service to containerize, so Docker only adds orchestration risk (DNS/SSL/cold-boot) with no benefit. The actual path is: `npm run dev` locally for iteration, `git push` to GitHub, import the repo in Vercel for a judge-ready HTTPS URL.

## 2. High-Level System Architecture

```
┌─────────────────────────────── CLIENT BROWSER ───────────────────────────────┐
│                                                                                │
│   ┌────────────────────────────┐        ┌────────────────────────────────┐   │
│   │   UI Layer (Next.js)        │        │   Audio & Parser Engine        │   │
│   │   - Tailwind CSS            │◄──────►│   - Web Speech API (STT)       │   │
│   │   - Mobile viewport frame   │        │   - Keyword/regex classifier   │   │
│   │   - lucide-react icons      │        │   - Deterministic fallback     │   │
│   └──────────────┬───────────────┘        └───────────────┬────────────────┘   │
│                  │                                         │                  │
│                  ▼                                         ▼                  │
│   ┌────────────────────────────────────────────────────────────────────┐     │
│   │                     Client State Management                        │     │
│   │   - React Context (SpotlightProvider / session store)              │     │
│   │   - window.localStorage (offerings, roster, attendance, session)   │     │
│   └────────────────────────────────────────────────────────────────────┘     │
└──────────────────────────────────┬────────────────────────────────────────────┘
                                    ▼
┌────────────────────────────────────────────────────────────────────────────┐
│                          HOSTING & DISTRIBUTION                             │
│   - Vercel (Git-connected, instant HTTPS, global CDN)                      │
│   - Zero backend dependencies, zero API key exposure                       │
└────────────────────────────────────────────────────────────────────────────┘
```

## 3. Technology Stack

| Layer | Selected Technology | Rationale |
|---|---|---|
| Framework | Next.js 16 (App Router), TypeScript | Fast local iteration, serverless-ready, trivial Vercel deploy |
| Styling & Icons | Tailwind CSS v4 + lucide-react | Native-feeling mobile UI, compact bundle |
| Speech-to-Text | `webkitSpeechRecognition` / `SpeechRecognition` (en-IN) | Runs on-device in Chrome/Safari — zero API tokens, zero network latency |
| State & persistence | React Context + `window.localStorage` | No DB needed; roster/attendance state survives refresh in-browser |
| Hosting | Vercel | One `git push`, live HTTPS URL for judges |

## 4. Core Data Schemas

### 4.1 Merchant Schema (`src/lib/types.ts` → `Merchant`)

```json
{
  "merchantId": "manjunath-tennis",
  "name": "Manjunath Tennis Academy",
  "facility": "KSLTA Tennis Stadium, Cubbon Park",
  "city": "Bengaluru",
  "isVerified": true,
  "upiVpa": "kslta.manjunath@razorpay",
  "category": "sports_academy",
  "handle": "kslta",
  "avatarInitials": "MT",
  "rating": 4.8,
  "eventsHosted": 62,
  "refundRate": 1.2
}
```

### 4.2 Spotlight Offering Schema — the content hand-off contract

This is the schema that the **public booking page renderer** (`src/components/OfferingView.tsx`, used by both the merchant preview and the public `/p/[merchantId]/[slug]` page) reads from. It is deliberately generic: any JSON matching this shape — including a real merchant's future content/images — renders correctly with no code changes.

A batch deliberately has no `filled`/enrolled count of its own — that's always derived at render time from the actual roster records (`roster.filter(r => r.offeringId === ... && r.batchId === ... && r.operations.bookingStatus === "ATTENDING").length`, see `store.enrolledCount`). An early version stored enrollment as a separate hand-authored number on the batch, which silently drifted from the real roster count — a UI showing "7/12 enrolled" next to only 2 actual bookings. Never reintroduce a stored enrollment counter; always derive it from roster.

```json
{
  "offeringId": "spotlight-tennis-nov",
  "merchantId": "manjunath-tennis",
  "slug": "tennis-nov",
  "title": "Adult Beginners Tennis Cohort",
  "offeringType": "recurring_batch",
  "status": "published",
  "pricing": { "amount": 3000, "currency": "INR", "cadence": "monthly", "unitLabel": "/ month" },
  "schedule": {
    "days": ["Monday", "Wednesday", "Friday", "Tuesday", "Thursday", "Saturday"],
    "batches": [
      { "id": "b1", "label": "Morning Batch", "timing": "06:30 - 08:00 AM", "capacity": 4, "nextSessionLabel": "Mon, Oct 6" },
      { "id": "b2", "label": "Evening Batch", "timing": "07:00 - 08:30 PM", "capacity": 4, "nextSessionLabel": "Wed, Oct 8" }
    ]
  },
  "logistics": {
    "equipmentPolicy": "Balls provided. Racket available for class 1; discounted purchase support thereafter.",
    "amenities": ["Floodlights", "Locker Rooms", "Parking"]
  },
  "syllabus": [
    "Warm-up & footwork fundamentals",
    "Forehand and backhand stroke mechanics",
    "Rally consistency drills",
    "Cool-down & equipment guidance"
  ],
  "policy": {
    "refundTerms": "Full refund if canceled 24 hours prior to cohort start.",
    "rescheduleTerms": "Make-up sessions permitted within the calendar month subject to court availability."
  },
  "media": {
    "heroImages": ["/offerings/tennis-1.svg", "/offerings/tennis-2.svg"],
    "logoUrl": null
  },
  "copy": {
    "tagline": "Group tennis coaching for adult beginners, 3 days a week at KSLTA.",
    "longDescription": "No experience needed. Small groups of up to 4, full warm-up to rally-ready progression, with floodlit courts and parking on-site."
  }
}
```

`media` and `copy` are the two blocks added beyond the original offering schema specifically so a future hand-off (real photos + written copy for the Luma-style page) drops in without a renderer rewrite.

### 4.3 Roster Record Schema

```json
{
  "bookingId": "bk_982341",
  "offeringId": "spotlight-tennis-nov",
  "batchId": "b1",
  "studentName": "Arjun Rao",
  "studentPhone": "+91 98450 12345",
  "payment": { "status": "PAID", "method": "UPI", "vpaApp": "GooglePay", "paidAt": "2026-10-01T08:30:00Z" },
  "operations": { "attendance": "PRESENT", "bookingStatus": "ATTENDING", "renewalStatus": "DUE_IN_7_DAYS" }
}
```

## 5. Subsystem Workflows

### 5.1 Voice Transcription & Parsing Engine (`src/lib/parser.ts`)

1. **Audio capture** — client invokes `webkitSpeechRecognition` with locale `en-IN`.
2. **Streaming feedback** — recognized tokens stream live into a transcript textarea.
3. **Extraction & normalization** — a deterministic keyword classifier matches anchor terms (`tennis`, `kslta`, `jiu jitsu`, `mma`, price patterns like `₹3000` / `3000 Rs`, capacity patterns like `max 4` / `4 people`) and binds the transcript to the closest offering template, flagging any fields it couldn't confidently extract.
4. **Deterministic fallback** — "Paste preset transcript" injects the canonical script directly, guaranteeing a reliable demo regardless of mic/ambient noise.
5. **Enrichment** — pre-structured metadata (syllabus, amenities, refund policy) is merged into the draft offering object.

### 5.2 Published Page Generation

1. The structured offering is committed to client state under a unique slug (`/p/[merchantId]/[slug]`).
2. The UI renders the Luma-style template purely from the offering JSON via `OfferingView`.
3. Trust badges (Razorpay Verified, rating, events hosted) render from the merchant profile.

### 5.3 Roster & Attendance Engine

1. **Manage Rosters** reads the offering + its roster records from the Spotlight store.
2. **Mark Present / Mark Absent** updates the record's `attendance` field in `localStorage`.
3. **Cancel Session & Batch-Refund All** flips every attending record's `bookingStatus` to `CANCELED` and `payment.status` to `REFUNDED`.

## 6. Implementation & Deployment

1. **Mobile shell** — the UI is locked inside a `max-w-[420px]` frame (`MobileShell`) so the experience reads as a native mobile app regardless of the judge's screen size.
2. **State hydration** — `SpotlightProvider` seeds from `src/data/seed.ts` on first load, then reads/writes `localStorage` on every mutation (attendance, cancellations, newly published offerings, new bookings).
3. **Deployment** — push to GitHub, import the repo in Vercel, zero environment variables or third-party API keys required. The production URL is the deliverable for evaluators.
