# AI Build Log

This log covers AI usage across the full lifecycle of this submission — problem identification, user research, solution definition, and build — not just the final coding session. Each phase names the tool, what it was used for, how it accelerated the work, and where the key decisions were made by hand.

## 1. Problem identification & user research

**Tool used:** an LLM assistant (ChatGPT), used as a thinking partner, not a researcher.

**What it did:** Four independent, human-gathered inputs fed this phase — a conversation with the owner of a community/events business about Razorpay's product gaps, a conversation with a combat-sports gym owner about formalizing his operations, the author's own experience as a paying customer of a sports coach, and the author's own experience repeatedly standing up throwaway Unbounce/Framer pages to run weekly events. The AI's role was to help synthesize these into a structured problem statement and stress-test scope: analyzing where a typical multi-step funnel (social post → chat → Unbounce/Framer page → generic payment link) breaks down, and sounding-boarding which adjacent opportunities (a Shopify-style storefront, logistics via Shiprocket, AI accounting) to explicitly exclude so the submission stayed focused on one merchant job.

**Where the human decided:** Which sources to talk to, what they actually said, which single problem ("no Razorpay product treats a slot as the unit of sale") to commit to, and the decision to scope out the bigger platform vision rather than chase it. See [`USER_RESEARCH.md`](./USER_RESEARCH.md) for the full sourcing — the anonymized public version of this synthesis.

## 2. Solution definition & impact metrics

**Tool used:** an LLM assistant, for drafting and structuring.

**What it did:** Helped turn the research findings into the one-page product note — the "Describe → Confirm → Share → Customer books → Run the day" flow, the build-vs-exclude table, and the controllable metrics framework (adoption, experience, impact, retention, guardrail). It also helped draft a first, more elaborate PRD and technical architecture (now in `prototype_foundation_docs/`), including an initial, more ambitious system design — a two-tier concept pairing generative extraction with a separate deterministic policy/risk layer for refund classification and trust scoring.

**Where the human decided:** The actual product note content, the five success metrics and what each one guards against, and — critically — the call to **not** build the more elaborate two-tier architecture as originally drafted. That concept assumed a live transcription API (e.g. Whisper) and a bespoke risk-classification layer; reviewing it against the actual goal (a reliable, zero-latency demo a judge can watch) led to deliberately simplifying it down to one deterministic client-side classifier before any code was written. See [`Razorpay_Spotlight_Product_Note_v2.pdf`](./Razorpay_Spotlight_Product_Note_v2.pdf) and the superseded draft in `../prototype_foundation_docs/`.

## 3. Build

**Tool used:** Claude Code (Claude Sonnet 5), as the sole build partner across one continuous agentic session — no separate design tool, no v0, no Cursor/Copilot. Every file, commit, and deploy step in `spotlight/` came out of this one conversational session.

**What it did:**
- Rewrote the rough `prototype_foundation_docs/` drafts into build-ready specs (`PRD.md`, `TECH_ARCHITECTURE.md`), resolving the Docker-vs-Vercel ambiguity and generalizing the offering schema into one JSON-driven renderer rather than two hardcoded personas.
- Scaffolded and built the full Next.js 16 app: all 6 PRD screens (persona switcher, merchant home, voice/text intake studio, draft preview/edit, distribution hub, roster & operations dashboard) plus the public customer booking page — matched to the real Razorpay merchant app's visual language from the reference screenshots.
- Implemented the actual parsing engine as a deterministic keyword/regex classifier bound to a structured offering schema, using the browser's native Web Speech API with a "paste transcript" fallback — the simplified, demo-reliable version of the earlier two-tier concept, not a live LLM call.
- Built the state layer: React Context + `localStorage`, including a seed-versioning fix added mid-build after a real bug surfaced — stale browser state was silently overriding every subsequent content edit.
- Iterated UI/UX directly from screenshots of the running app: fixed an enrollment-count bug (a hand-authored "filled" number had drifted from the real roster — 7/12 shown against only 2 actual bookings), an awkward button text-wrap, an ambiguous "Review" icon/label, and reworked the Share screen's CTAs and the roster's cancel semantics to differ by offering type.
- Wrote and rewrote on-page copy (taglines, syllabus steps, policy text) using performance-marketing fundamentals — lead with the benefit, address the objection, use real numbers already in the schema instead of invented urgency.
- Flagged three separate privacy exposures before they reached the public repo — a colleague's real name and Instagram handle in the research write-up, screenshots revealing a real business's internal dashboard, and a group photo that included a child — in each case pausing to ask rather than publishing by default.
- Handled git/GitHub/Vercel end-to-end: repo init, commits, a history rewrite to scrub the privacy-sensitive content above, and deployment troubleshooting.

**Where the human decided:** Every product-journey call in the build was explicit user direction, usually after Claude Code surfaced a tradeoff and asked — Docker vs. Vercel, generic renderer vs. two hardcoded personas, capping the Home offering list vs. letting it grow unbounded, what "Request Review" should actually do, how cancellation should differ between a recurring batch and a one-off event, which real photos to use and which to exclude, and public vs. private repo handling for sensitive content. Final copy tone, naming (internal batch labels vs. customer-facing titles), and visual layout were directed and approved at each step, not auto-generated and shipped unreviewed.

## Summary: the full lifecycle

| Phase | Primary tool | AI's role | Where the human decided |
|---|---|---|---|
| Problem identification & user research | LLM assistant (thinking partner) | Synthesize four research sources into a structured problem | Which sources, what they said, which single problem to commit to |
| Solution definition & metrics | LLM assistant (drafting) | Draft the product note, PRD, and an initial technical architecture | The actual scope, the 5 metrics, and simplifying the architecture before building |
| Build | Claude Code (Claude Sonnet 5) | Build, debug, and deploy the entire working prototype | Every product/UX tradeoff, all privacy calls, all copy and design approval |
