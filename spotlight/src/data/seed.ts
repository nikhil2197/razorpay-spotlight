import type { Merchant, SpotlightOffering, RosterRecord, Review } from "@/lib/types";

export const MERCHANTS: Merchant[] = [
  {
    merchantId: "manjunath-tennis",
    name: "Manjunath Tennis Academy",
    facility: "KSLTA Tennis Stadium, Cubbon Park",
    city: "Bengaluru",
    isVerified: true,
    upiVpa: "kslta.manjunath@razorpay",
    category: "sports_academy",
    handle: "kslta",
    avatarInitials: "MT",
    rating: 4.8,
    eventsHosted: 62,
    refundRate: 1.2,
  },
  {
    merchantId: "the-works-mma",
    name: "The Works MMA Gym",
    facility: "Magrath Road",
    city: "Bengaluru",
    isVerified: true,
    upiVpa: "theworks.mma@razorpay",
    category: "combat_sports",
    handle: "theworksmma",
    avatarInitials: "TW",
    rating: 4.9,
    eventsHosted: 34,
    refundRate: 0.8,
  },
];

/** The only offerings shown in the Home "Your Spotlights" list for this prototype — see USER_RESEARCH.md / readme for why newly created ones don't appear there yet. */
export const SEED_OFFERING_IDS = ["spotlight-tennis-nov", "spotlight-mma-intro"];

/**
 * Bump this whenever MERCHANTS/OFFERINGS/ROSTER content below changes.
 * The store compares this against what's saved in localStorage and discards
 * stale persisted state on a mismatch — otherwise a browser that already has
 * any saved session silently never sees new seed content again, since the
 * persisted copy always wins once it exists.
 */
export const SEED_VERSION = 7;

export const OFFERINGS: SpotlightOffering[] = [
  {
    offeringId: "spotlight-tennis-nov",
    merchantId: "manjunath-tennis",
    slug: "tennis-nov",
    title: "Adult Beginners Tennis Cohort",
    internalLabel: "October Batch",
    offeringType: "recurring_batch",
    status: "published",
    pricing: { amount: 3000, currency: "INR", cadence: "monthly", unitLabel: "/ month" },
    schedule: {
      days: ["Monday", "Wednesday", "Friday", "Tuesday", "Thursday", "Saturday"],
      batches: [
        { id: "b1", label: "Morning Batch", timing: "06:30 - 08:00 AM", capacity: 4, nextSessionLabel: "Mon, Oct 6" },
        { id: "b2", label: "Evening Batch", timing: "07:00 - 08:30 PM", capacity: 4, nextSessionLabel: "Wed, Oct 8" },
      ],
    },
    logistics: {
      equipmentPolicy:
        "Balls are provided for every session — just bring water and non-marking court shoes. No racket? Borrow one free for your first class, then get hands-on help picking (and a discount on) your own before class two.",
      amenities: ["Floodlights", "Locker Rooms", "Parking"],
    },
    syllabus: [
      "10-minute warm-up — footwork ladders and dynamic stretching so you're moving well before the first ball drops.",
      "Forehand & backhand fundamentals — grip, stance, and swing path broken down stroke by stroke, not just \"hit more balls.\"",
      "Rally consistency drills — live-ball reps with your coach until a 10+ shot rally feels normal, not lucky.",
      "Cool-down & gear guidance — a short stretch, plus honest, no-pressure feedback on whether (and which) racket to buy next.",
    ],
    policy: {
      refundTerms:
        "Full refund if you cancel at least 24 hours before your cohort's start date — processed automatically to your original payment method, no follow-up needed.",
      rescheduleTerms:
        "Miss a session? One make-up class per month is included, subject to court availability — just message your coach to slot it in.",
    },
    media: {
      heroImages: ["/offerings/tennis-1.svg", "/offerings/tennis-2.svg"],
    },
    copy: {
      tagline: "Beginner tennis coaching at KSLTA — small groups, real technique, zero pressure.",
      longDescription:
        "Never picked up a racket? Perfect. Groups capped at 4 mean real coaching, not crowd drills — from your first serve to a steady rally. Floodlit courts, on-site parking, and a racket on loan for class one. Morning and evening batches run 3 days a week, and a seat is only yours once it's paid for — so the slot you want may not wait.",
    },
  },
  {
    offeringId: "spotlight-mma-intro",
    merchantId: "the-works-mma",
    slug: "intro-jiu-jitsu",
    title: "Intro to Jiu Jitsu",
    internalLabel: "Tuesday, Oct 07",
    offeringType: "single_event",
    status: "published",
    pricing: { amount: 1000, currency: "INR", cadence: "one_time", unitLabel: "/ person" },
    schedule: {
      days: [],
      date: "Tuesday, Oct 7 | 7:30 - 9:30 PM",
      batches: [{ id: "b1", label: "Single Session", timing: "7:30 - 9:30 PM", capacity: 12 }],
    },
    logistics: {
      equipmentPolicy:
        "All training equipment — gloves, shin guards, and a clean gi — is provided and sanitized between sessions. Just wear something you can move in and bring a water bottle; no gear of your own required.",
      amenities: ["Showers", "Water Station", "Parking"],
    },
    syllabus: [
      "Fundamental movement patterns — shrimping, bridging, and hip escapes, the base vocabulary every technique builds on.",
      "Core positions & submissions — mount, guard, and side control, plus your first submission and how to escape it.",
      "Defensive awareness — how to stay safe, tap early, and protect yourself on the ground before anything else.",
      "Safety protocols, then live play — a quick rules refresher, then light positional sparring so it actually sinks in.",
    ],
    policy: {
      refundTerms:
        "Full refund if you cancel at least 12 hours before the session — refunded automatically to your original payment method.",
      rescheduleTerms: "Can't make it after booking? You get one free reschedule to the next scheduled intro session, no questions asked.",
    },
    media: {
      heroImages: ["/offerings/mma-sparring.jpg", "/offerings/mma-group.jpg", "/offerings/mma-gloves.jpg"],
    },
    copy: {
      tagline: "One session. Zero experience needed. Real jiu jitsu, taught right.",
      longDescription:
        "You don't need to be fit, flexible, or fearless — just curious. In this 2-hour intro, coaches who actually compete walk you through real positions, submissions, and defensive fundamentals, in a room built on respect, not ego. Gi and all equipment provided. Just 12 spots for Tuesday, Oct 7 — once they're booked, they're booked.",
    },
  },
];

export const ROSTER: RosterRecord[] = [
  {
    bookingId: "bk_982341",
    offeringId: "spotlight-tennis-nov",
    batchId: "b1",
    studentName: "Arjun Rao",
    studentPhone: "+91 98450 12345",
    payment: { status: "PAID", method: "UPI", vpaApp: "GooglePay", paidAt: "2026-09-28T08:30:00Z" },
    operations: { attendance: "PRESENT", bookingStatus: "ATTENDING", renewalStatus: "DUE_IN_7_DAYS", reviewRequested: false },
  },
  {
    bookingId: "bk_982342",
    offeringId: "spotlight-tennis-nov",
    batchId: "b1",
    studentName: "Priya Nair",
    studentPhone: "+91 98450 22345",
    payment: { status: "PAID", method: "UPI", vpaApp: "PhonePe", paidAt: "2026-09-27T09:10:00Z" },
    operations: { attendance: "ABSENT", bookingStatus: "ATTENDING", renewalStatus: "NOT_APPLICABLE", reviewRequested: false },
  },
  {
    bookingId: "bk_982343",
    offeringId: "spotlight-tennis-nov",
    batchId: "b1",
    studentName: "Devika Shetty",
    studentPhone: "+91 98450 32345",
    payment: { status: "PAID", method: "UPI", vpaApp: "Paytm", paidAt: "2026-09-26T07:40:00Z" },
    operations: { attendance: "UNMARKED", bookingStatus: "ATTENDING", renewalStatus: "RENEWED", reviewRequested: true },
  },
  {
    bookingId: "bk_982346",
    offeringId: "spotlight-tennis-nov",
    batchId: "b1",
    studentName: "Meera Pillai",
    studentPhone: "+91 98450 62345",
    payment: { status: "REFUNDED", method: "UPI", vpaApp: "GooglePay", paidAt: "2026-09-24T07:00:00Z" },
    operations: { attendance: "UNMARKED", bookingStatus: "CANCELED", renewalStatus: "NOT_APPLICABLE", reviewRequested: false },
  },
  {
    bookingId: "bk_982344",
    offeringId: "spotlight-tennis-nov",
    batchId: "b2",
    studentName: "Karthik Iyer",
    studentPhone: "+91 98450 42345",
    payment: { status: "PAID", method: "UPI", vpaApp: "GooglePay", paidAt: "2026-09-25T18:20:00Z" },
    operations: { attendance: "UNMARKED", bookingStatus: "ATTENDING", renewalStatus: "DUE_IN_7_DAYS", reviewRequested: false },
  },
  {
    bookingId: "bk_982345",
    offeringId: "spotlight-tennis-nov",
    batchId: "b2",
    studentName: "Ishita Bhat",
    studentPhone: "+91 98450 52345",
    payment: { status: "PAID", method: "UPI", vpaApp: "PhonePe", paidAt: "2026-09-25T18:40:00Z" },
    operations: { attendance: "UNMARKED", bookingStatus: "ATTENDING", renewalStatus: "NOT_APPLICABLE", reviewRequested: false },
  },
  {
    bookingId: "bk_771201",
    offeringId: "spotlight-mma-intro",
    batchId: "b1",
    studentName: "Rohan Mehta",
    studentPhone: "+91 99000 11223",
    payment: { status: "PAID", method: "UPI", vpaApp: "GooglePay", paidAt: "2026-09-29T11:05:00Z" },
    operations: { attendance: "UNMARKED", bookingStatus: "ATTENDING", renewalStatus: "NOT_APPLICABLE", reviewRequested: false },
  },
  {
    bookingId: "bk_771202",
    offeringId: "spotlight-mma-intro",
    batchId: "b1",
    studentName: "Sana Khan",
    studentPhone: "+91 99000 22334",
    payment: { status: "PAID", method: "UPI", vpaApp: "Paytm", paidAt: "2026-09-29T12:15:00Z" },
    operations: { attendance: "PRESENT", bookingStatus: "ATTENDING", renewalStatus: "NOT_APPLICABLE", reviewRequested: true },
  },
  {
    bookingId: "bk_771203",
    offeringId: "spotlight-mma-intro",
    batchId: "b1",
    studentName: "Priyanka Das",
    studentPhone: "+91 99000 33445",
    payment: { status: "REFUNDED", method: "UPI", vpaApp: "PhonePe", paidAt: "2026-09-28T10:00:00Z" },
    operations: { attendance: "UNMARKED", bookingStatus: "CANCELED", renewalStatus: "NOT_APPLICABLE", reviewRequested: false },
  },
];

export const REVIEWS: Review[] = [
  {
    id: "rev_t1",
    merchantId: "manjunath-tennis",
    author: "Arjun Rao",
    rating: 5,
    text: "Joined with zero experience — by the second week I was actually rallying. Groups are small enough that you get real correction, not just drills.",
    relativeDate: "3 weeks ago",
    verifiedBooking: true,
  },
  {
    id: "rev_t2",
    merchantId: "manjunath-tennis",
    author: "Priya Nair",
    rating: 5,
    text: "The evening batch after work is perfect — floodlit courts, and the coaching is patient without being slow.",
    relativeDate: "1 month ago",
    verifiedBooking: true,
  },
  {
    id: "rev_t3",
    merchantId: "manjunath-tennis",
    author: "Devika Shetty",
    rating: 4,
    text: "Great coaching, just wish there were more evening slots — they genuinely fill up since the spot is only yours once you've paid.",
    relativeDate: "1 month ago",
    verifiedBooking: true,
  },
  {
    id: "rev_m1",
    merchantId: "the-works-mma",
    author: "Rohan Mehta",
    rating: 5,
    text: "Walked in with zero experience and left actually understanding positions, not just throwing punches. Coaches clearly compete themselves.",
    relativeDate: "2 weeks ago",
    verifiedBooking: true,
  },
  {
    id: "rev_m2",
    merchantId: "the-works-mma",
    author: "Sana Khan",
    rating: 5,
    text: "Loved the emphasis on respect in the room — never felt intimidated as a first-timer, and the gi provided was clean and ready.",
    relativeDate: "3 weeks ago",
    verifiedBooking: true,
  },
  {
    id: "rev_m3",
    merchantId: "the-works-mma",
    author: "Vikram Pillai",
    rating: 5,
    text: "Had to cancel last minute and the refund was instant, no back-and-forth. Made it an easy first booking.",
    relativeDate: "1 month ago",
    verifiedBooking: true,
  },
];

export const TENNIS_SCRIPT =
  "New tennis batch from November for adult beginners (no experience) for Rs 3000 per month in group setting at KSLTA court. 3 days a week MWF & TThSat, 2 batches per day - morning 6:30 - 8:00 and evening 7:00 - 8:30, Maximum 4 people per group, balls provided, racket available for first class but will help students select good rackets after the first class on a discount. All intro covered - warm up, forehand, back hand, drills rally cool down - no focus on matchplay at this level.";

export const MMA_SCRIPT =
  "Intro to Jiu Jitsu Lesson on Tuesday 7th October between 7:30 - 9:30 PM for 1000 Rs. Learn from real jiu jitsu fighters - no prior experience needed, all equipment provided. Grappling isn't just about fighting; it's about how we treat the room, our partners, and ourselves. What to expect: fundamental body movements, understanding basic positions and submissions, defensive awareness, safety protocols, fun and play.";
