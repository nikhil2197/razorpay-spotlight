import { MERCHANTS, OFFERINGS } from "@/data/seed";
import type { SpotlightOffering, ParsedDraft } from "@/lib/types";

/**
 * Deterministic keyword classifier.
 *
 * A real build would hand the transcript to an LLM for structured
 * extraction. For a live/judged demo, free-form speech recognition is a
 * reliability risk, so this engine matches on anchor keywords (as specified
 * in the tech architecture doc) and binds the transcript to a known offering
 * template. This keeps the "Describe -> Confirm" loop deterministic while
 * still feeling like the merchant's own words were understood.
 */
export function parseTranscript(transcript: string): ParsedDraft {
  const text = transcript.toLowerCase();
  const flags: string[] = [];

  const isTennis = /tennis|kslta|racket|forehand/.test(text);
  const isMma = /jiu jitsu|mma|grappling|jiujitsu|martial/.test(text);

  let template: SpotlightOffering;

  if (isTennis) {
    template = OFFERINGS.find((o) => o.offeringId === "spotlight-tennis-nov")!;
  } else if (isMma) {
    template = OFFERINGS.find((o) => o.offeringId === "spotlight-mma-intro")!;
  } else {
    template = OFFERINGS[0];
    flags.push("Couldn't confidently match a category — defaulted to closest template. Please review every field.");
  }

  const draft: SpotlightOffering = JSON.parse(JSON.stringify(template));
  draft.status = "draft";
  // Enrollment is derived from actual roster records (see store.enrolledCount),
  // not stored on the batch, so a freshly cloned draft naturally starts at
  // zero bookings without needing to reset anything here.

  const priceMatch =
    text.match(/(?:rs\.?|₹|inr)\s?(\d{3,6})/) ?? text.match(/(\d{3,6})\s?(?:rs\.?|₹|inr)/);
  if (priceMatch) {
    const amount = parseInt(priceMatch[1], 10);
    if (amount !== draft.pricing.amount) {
      flags.push(`Heard price as ₹${amount} — confirm before publishing.`);
      draft.pricing.amount = amount;
    }
  } else {
    flags.push("Price wasn't clearly heard — confirm the amount below.");
  }

  const capacityMatch = text.match(/max(?:imum)?\s(\d{1,2})|(\d{1,2})\s(?:people|person|per group)/);
  if (capacityMatch) {
    const capacity = parseInt(capacityMatch[1] || capacityMatch[2], 10);
    draft.schedule.batches = draft.schedule.batches.map((b) => ({ ...b, capacity }));
  }

  if (!/refund|cancel/.test(text)) {
    flags.push("No cancellation policy heard — using the default refund window below.");
  }

  const merchant = MERCHANTS.find((m) => m.merchantId === draft.merchantId)!;

  return { offering: draft, flags: flags.length ? flags : [`Matched ${merchant.name}'s offering cleanly — review and publish.`] };
}
