# Razorpay Spotlight

Prototype for the **Razorpay AI x PM Build Challenge (ISB)**, Track 1 — "Razorpay in Your Pocket" / Full Stack Builder.

**One line:** turn a merchant's offering into a bookable, paid slot — describe it once, publish a trusted booking page, get paid by UPI, run the day from one roster.

## Repo layout

```
RZP/
├── product_note/                   # Finalized product + tech specs
│   ├── Razorpay_Spotlight_Product_Note_v2.pdf   # 1-page submission product note
│   ├── RazorpayxISB_BuildChallenge.docx (1).pdf # Official challenge brief
│   ├── PRD.md                      # Screen-by-screen product requirements
│   ├── TECH_ARCHITECTURE.md        # Stack, schemas, subsystem workflows
│   ├── USER_RESEARCH.md            # Sources & findings behind the problem framing
│   └── AI_BUILD_LOG.md             # AI usage across the full lifecycle: research → solution → build
├── prototype_foundation_docs/      # Original rough drafts (superseded by product_note/*.md)
├── product_images/                 # Real Razorpay merchant app screenshots (visual reference)
└── spotlight/                      # The Next.js prototype
```

## The prototype (`spotlight/`)

Next.js 16 (App Router, TypeScript, Tailwind) app, client-only — no database, no custom backend. State lives in React Context + `localStorage`; speech-to-text runs on-device via the Web Speech API with a deterministic "paste transcript" fallback for reliable demos.

**Screens implemented** (see `product_note/PRD.md` for full specs):
1. Merchant/persona switcher (`/`)
2. Merchant home, styled on the real Razorpay app (`/home`)
3. Voice/text intake studio (`/create`)
4. Draft booking page preview + confirm + publish (`/create/preview`)
5. Distribution hub — copy link, WhatsApp share (`/create/share`)
6. Roster & attendance dashboard (`/roster/[offeringId]`)
7. Public customer-facing booking page + simulated UPI payment (`/p/[merchantId]/[slug]`)

The booking page renderer (`src/components/OfferingView.tsx`) is **generic and JSON-driven** — it reads only from the `SpotlightOffering` schema (see `TECH_ARCHITECTURE.md` §4.2), so a real merchant's content/images can be dropped in later as a JSON object without touching the renderer.

### Run locally

```bash
cd spotlight
npm install
npm run dev
```

Open `http://localhost:3000`, pick a seeded merchant (Manjunath Tennis Academy or The Works MMA Gym), and walk the flow: Create Spotlight → paste the preset transcript → review & publish → share → open in a new tab as `/p/...` to book as a customer → back in Roster to mark attendance / cancel & refund.

### Deploy

No Docker, no environment variables. Push to GitHub, import the repo in [Vercel](https://vercel.com/new), done.

## Build status

- [x] Product note (submission-ready)
- [x] PRD + tech architecture finalized (`product_note/*.md`)
- [x] Prototype: all 6 PRD screens + public booking flow, seeded with two personas
- [x] Pushed to GitHub / deployed to Vercel
- [x] Real Luma-page content/images dropped into the offering schema (tennis + MMA)
- [x] AI build log (`product_note/AI_BUILD_LOG.md`)
- [ ] 90-second demo video
