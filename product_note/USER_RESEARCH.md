# User Research — Sources & Findings

Spotlight's problem framing is grounded in four independent sources, not a single interview. One was gathered specifically for this build challenge; the other three are prior, independent experience that happened to surface the same friction. Names and handles are withheld here out of respect for the people involved — a private version with full attribution exists for the author's own records.

## Sources

| # | Source | Relationship to this build |
|---|---|---|
| 1 | Owner of a community/events business on Razorpay | Direct input for this challenge — provided real Razorpay merchant-app screenshots (used in `product_images/`) and a written note on Razorpay's product gaps and expansion opportunities (below). |
| 2 | Owner of a combat-sports gym | A conversation about formalizing his business operations, held independently of this challenge. Basis for the single-event workshop persona in the prototype. |
| 3 | The author's own sports coach | First-hand experience as a paying customer booking and renewing coaching slots. Identity and location are withheld; the prototype's persona uses a fictionalized name and a well-known public venue rather than the coach's actual one. Basis for the recurring-cohort persona. |
| 4 | Author's own experience running weekly events ("Openhouse") | Direct operator experience: every week's event required standing up a new throwaway Unbounce or Framer landing page, because no existing tool treated a *slot* as the unit of sale. This is the origin of the "Inform" friction row in the product note's current-journey table. |

## Findings from Source 1 (community/events merchant)

### Strategic framing offered
The broader question raised: *can Razorpay evolve from a payment gateway into an end-to-end commerce and financial platform* — a Shopify-alternative storefront, a Shiprocket-style logistics plugin, business-subscription tracking, AI-assisted accounting/reconciliation, and data-driven working-capital loans, all inside the Razorpay ecosystem.

**Relevance to Spotlight:** this is a Track-2-shaped, platform-wide vision — explicitly out of scope for a focused Track 1 build. It's kept here as context for *why* a narrow, vertical wedge (one bookable slot, one payment, one roster) is the right entry point rather than a competing reason to broaden scope: Spotlight is the kind of single-job product that could justify the larger platform bet later, without trying to be it now.

### Concrete blockers using Razorpay today
These are specific, operator-reported gaps, each mapped to how Spotlight's scope responds:

| Blocker reported | Spotlight's response |
|---|---|
| Onboarding requires a "digital presence" (website/app/social profile with pricing, policy, T&Cs) that not every SMB has or meets cleanly. | Out of scope for the prototype (KYC/onboarding is assumed complete) — noted here as a real upstream funnel risk worth flagging, not solved by this build. |
| On Razorpay Payment Pages, a cancelled/refunded order requires **manually** restoring inventory from the backend. | Core to Spotlight's design: payment *locks* a slot, and `cancelAndRefundAll` / per-booking cancellation automatically returns that slot to the available pool — no manual backend step. |
| The Payment Page dashboard gives no snapshot view across pages — hard to see how offerings are performing at a glance. | Spotlight's merchant Home surfaces "Collected today" and per-offering status directly; the Roster dashboard gives a live capacity meter (e.g. "3/4 Enrolled") per offering rather than requiring a manual roll-up. |
| Post-booking comms are limited to a bare payment receipt — no WhatsApp integration for richer updates. | Explicitly flagged as **out of scope** in the PRD, with the same resolution path called out in the product note: a future WhatsApp/SMS layer belongs to Razorpay Engage, not rebuilt inside Spotlight. |
| No way to generate sorted attendance/roster lists from booking data (e.g. by time slot, age, or other custom fields) — forces manual list-building. | Directly solved by Screen 6 (Roster & Operations Dashboard): bookings are already structured per batch/slot, with attendance state (`Mark Present` / `Mark Absent`) tracked per student rather than reconstructed from raw export data. |

## Findings from Source 2 (combat-sports gym owner)

Independent conversation about formalizing a growing gym's operations: moving from word-of-mouth/DM-based sign-ups for one-off intro sessions to something trackable and refundable without manual tracking. This shaped the **single-event, finite-capacity** offering type in the schema (`offeringType: "single_event"`) — distinct from the recurring-batch model — and the emphasis on a simple, no-experience-needed trust narrative on the booking page (verified merchant badge, clear refund terms) for first-time customers who've never paid this business before.

## Findings from Source 3 (own sports coach)

As a customer, the renewal and rescheduling loop was entirely manual: slot availability lived in WhatsApp chat history, payment was a personal UPI transfer disconnected from any specific class or month, and renewal reminders depended on the coach remembering to message each student individually. This is the direct source of the recurring-cohort persona's requirements: batch-based scheduling, a `DUE_IN_7_DAYS` renewal status surfaced to the coach (not chased manually), and capacity caps enforced by the system rather than tracked in the coach's head.

## Findings from Source 4 (Openhouse events)

Running a weekly event series meant rebuilding a landing page from scratch — in Unbounce or Framer — every single week, each one manually wired to a generic payment link with no relationship between "page" and "inventory." This is the clearest first-hand validation of the product note's core "Inform" and "Pay" friction rows: *pages take setup effort and aren't linked to availability or payment*, and *no slot is attached to payment*. It's also the reason Spotlight's "Describe → Confirm → Share" loop is scoped to under two minutes — the bar it needed to clear was "faster than standing up another one-off landing page."

## How this strengthens the submission

The challenge brief's evaluation criteria include "depth of understanding of the merchant and their current behaviour." This research base covers three distinct merchant shapes (community/events host, combat-sports gym, solo sports coach) plus the author's own operator experience — not a single assumed persona — which is why the prototype seeds two structurally different offering types (recurring batch vs. single event) rather than one.
