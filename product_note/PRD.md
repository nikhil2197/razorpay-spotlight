# Razorpay Spotlight — Product Requirements Document

> Grounded in four independent sources — see [`USER_RESEARCH.md`](./USER_RESEARCH.md) for full sourcing and attribution.

## 1. Problem Statement & Opportunity

Solo coaches, sports academies, and boutique workshop hosts run their customer acquisition and scheduling manually over WhatsApp and Instagram direct messages. The standard workflow today suffers from four critical points of friction:

- **Unstructured scheduling** — every prospective lead triggers a manual chat negotiation over available days and timings.
- **Detached payments** — merchants paste personal UPI IDs or standalone payment links without binding payment to an actual inventory slot, risking double-booking or slot-holding dropouts.
- **Manual reconciliation** — coaches maintain offline paper registers or notes apps to track payments, attendance, and cancellations.
- **Trust deficit** — first-time students hesitate to transfer upfront funds to unverified personal UPI IDs without clear cancellation terms.

**Spotlight solution:** an in-app, mobile-first utility that lets a merchant describe their offering in under 45 seconds (voice or text). The platform parses this into a structured scheduling package, publishes a high-converting hosted booking page with Razorpay trust signals, locks slot inventory on UPI payment, and populates an automated merchant operating roster.

## 2. Target Personas & Core Use Cases

| Attribute | Persona 1: Recurring Cohorts | Persona 2: Single-Session Workshop |
|---|---|---|
| Merchant | Manjunath Tennis Academy (KSLTA) | The Works MMA Gym (Magrath Road) |
| Category | Sports Academy / Recurring Training | Combat Sports / Weekend Workshop |
| Offering Model | Recurring multi-day batch (e.g., MWF, monthly renewals) | Single fixed-date event (finite seat capacity) |
| Ticket Size | ₹3,000 / month | ₹1,000 / attendee |
| Operational Need | Batch tracking, attendance logging, monthly renewal prompts | Single-event capacity lock, automated refund handling |

## 3. End-to-End User Flow

```
Merchant Login / Persona Selection
        │
        ▼
Razorpay Merchant App Home
   ├── Manage Rosters
   └── Create Spotlight (Voice / Text Studio)
        │
        ▼
Speech-to-Text Studio + Evaluator Overlay
   ├── Live Dictation via Microphone
   └── Structured Data Extraction
        │
        ▼
Draft Booking Page Preview (Luma-style)
   ├── AI-Enriched Syllabus, Logistics, Trust Seal
   └── "Publish Offering"
        │
        ▼
Distribution Hub
   ├── Shareable URL (razorpay.me/@handle/offering)
   ├── 1-Tap WhatsApp Broadcast
   └── Instagram Link-in-Bio shortcut
        │
        ▼
Operational Roster Dashboard
   ├── Live Attendance (Mark Present / Absent)
   ├── Renewal Tracking (Due in 7 Days / Renewed)
   └── Cancel & Auto-Refund All
```

## 4. Detailed Screen Specifications

### Screen 1 — Merchant Profile Switcher
Evaluator-only context switcher. Two selectable persona cards (Tennis Academy, MMA Gym), pre-seeded with facility, verified KYC status, and category tags. Selecting a card initializes the merchant session (logo, business name, UPI VPA, trust tier).

### Screen 2 — Razorpay Merchant Mobile Home
Anchors Spotlight inside the native Razorpay merchant app surface: "Collected today" card, next settlement / account balance split, a Spotlight panel with primary CTA **"Create Spotlight"** and secondary CTA **"Manage Rosters"**, matching the real app's Home layout (see `product_images/`).

### Screen 3 — Guided Speech-to-Text Intake Studio
- Collapsible evaluator script overlay showing the exact test script to read aloud, so any evaluator can demo reliably.
- Pulsing mic button (Web Speech API), live transcript feed.
- **Deterministic fallback**: "Paste preset transcript" button — guarantees a flawless walkthrough in noisy rooms or unsupported browsers.
- Processing-state bottom sheet ("Structuring schedule… formatting syllabus… applying cancellation policies").

### Screen 4 — Draft Booking Page Preview (hosted customer surface)
Shows the merchant exactly what the customer will see: header banner, Razorpay Verified badge + rating, optimized title/tagline/price, slot selector (pill batches for recurring offerings, single date card for one-off events), AI-structured syllabus, logistics/equipment badges, cancellation & refund policy block, and a persistent **"Publish Offering"** CTA. Editable summary fields (price, capacity) sit inline — nothing publishes without merchant approval.

**This screen is a pure function of the offering JSON** (see Tech Architecture §4.2) — it does not hardcode persona content, so a new offering (including a real merchant's future content/images) renders correctly without code changes.

### Screen 5 — Distribution & Confirmation Hub
Success banner, generated public link (`razorpay.me/@handle/offering`) with 1-tap copy, **Share to WhatsApp** (prefilled text + link), **Share to Instagram** (copy for bio/story), and a nav link to **Open Roster**.

### Screen 6 — Coach Roster & Operations Dashboard
Session header with capacity meter (e.g. "3/4 Enrolled"), student cards (name, booking ID, "Paid via UPI" tag), **Mark Present / Mark Absent** actions, status tags (Attending / Canceled (Auto-Refunded) / Renewal Due in 7 Days), and a master **"Cancel Session & Batch-Refund All"** action with confirmation modal.

## 5. Deliberate Product Exclusions (Out of Scope for Prototype)

- No drag-and-drop page builder or rich text styling editor.
- No dedicated mobile app download required for the customer (pure web checkout).
- No complex CRM or custom marketing automation (relies on native WhatsApp/Instagram sharing).
- No multi-tier discount engine or coupon configuration.
- No real payment gateway integration — UPI payment is simulated client-side for the demo.

## 6. Success Metrics (from the product note)

- **Adoption** — First-link publish rate: % of merchants who start setup and publish in the same session.
- **Experience** — Time to publish: app open → live link copied.
- **Impact** — Page-to-payment conversion vs. the merchant's current multi-redirect funnel.
- **Retention** — Repeat publishing: recurring hosts refresh slots in weeks 4 and 6; one-time hosts publish a second event within 45 days.
- **Guardrail** — Refunds and disputes per 100 bookings.
