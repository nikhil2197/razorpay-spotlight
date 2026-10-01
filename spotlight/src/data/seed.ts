import type { Merchant, SpotlightOffering, RosterRecord } from "@/lib/types";

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

export const OFFERINGS: SpotlightOffering[] = [
  {
    offeringId: "spotlight-tennis-nov",
    merchantId: "manjunath-tennis",
    slug: "tennis-nov",
    title: "Adult Beginners Tennis Cohort",
    offeringType: "recurring_batch",
    status: "published",
    pricing: { amount: 3000, currency: "INR", cadence: "monthly", unitLabel: "/ month" },
    schedule: {
      days: ["Monday", "Wednesday", "Friday", "Tuesday", "Thursday", "Saturday"],
      batches: [
        { id: "b1", label: "Morning Batch", timing: "06:30 - 08:00 AM", capacity: 4, filled: 3 },
        { id: "b2", label: "Evening Batch", timing: "07:00 - 08:30 PM", capacity: 4, filled: 2 },
      ],
    },
    logistics: {
      equipmentPolicy:
        "Balls provided. Racket available for class 1; discounted purchase support thereafter.",
      amenities: ["Floodlights", "Locker Rooms", "Parking"],
    },
    syllabus: [
      "Warm-up & footwork fundamentals",
      "Forehand and backhand stroke mechanics",
      "Rally consistency drills",
      "Cool-down & equipment guidance",
    ],
    policy: {
      refundTerms: "Full refund if canceled 24 hours prior to cohort start.",
      rescheduleTerms: "Make-up sessions permitted within the calendar month subject to court availability.",
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
    offeringType: "single_event",
    status: "published",
    pricing: { amount: 1000, currency: "INR", cadence: "one_time", unitLabel: "/ person" },
    schedule: {
      days: [],
      date: "Tuesday, Oct 7 | 7:30 - 9:30 PM",
      batches: [{ id: "b1", label: "Single Session", timing: "7:30 - 9:30 PM", capacity: 12, filled: 7 }],
    },
    logistics: {
      equipmentPolicy: "All equipment provided. Clean gi provided, no prior experience needed.",
      amenities: ["Showers", "Water Station", "Parking"],
    },
    syllabus: [
      "Fundamental body movements",
      "Basic positions and submissions",
      "Defensive awareness",
      "Safety protocols, fun and play",
    ],
    policy: {
      refundTerms: "Full refund if canceled 12 hours prior to session start.",
      rescheduleTerms: "One free reschedule to the next scheduled intro session.",
    },
    media: {
      heroImages: ["/offerings/mma-1.svg", "/offerings/mma-2.svg"],
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
    operations: { attendance: "PRESENT", bookingStatus: "ATTENDING", renewalStatus: "DUE_IN_7_DAYS" },
  },
  {
    bookingId: "bk_982342",
    offeringId: "spotlight-tennis-nov",
    batchId: "b1",
    studentName: "Priya Nair",
    studentPhone: "+91 98450 22345",
    payment: { status: "PAID", method: "UPI", vpaApp: "PhonePe", paidAt: "2026-09-27T09:10:00Z" },
    operations: { attendance: "UNMARKED", bookingStatus: "ATTENDING", renewalStatus: "NOT_APPLICABLE" },
  },
  {
    bookingId: "bk_982343",
    offeringId: "spotlight-tennis-nov",
    batchId: "b1",
    studentName: "Devika Shetty",
    studentPhone: "+91 98450 32345",
    payment: { status: "PAID", method: "UPI", vpaApp: "Paytm", paidAt: "2026-09-26T07:40:00Z" },
    operations: { attendance: "UNMARKED", bookingStatus: "ATTENDING", renewalStatus: "RENEWED" },
  },
  {
    bookingId: "bk_982344",
    offeringId: "spotlight-tennis-nov",
    batchId: "b2",
    studentName: "Karthik Iyer",
    studentPhone: "+91 98450 42345",
    payment: { status: "PAID", method: "UPI", vpaApp: "GooglePay", paidAt: "2026-09-25T18:20:00Z" },
    operations: { attendance: "UNMARKED", bookingStatus: "ATTENDING", renewalStatus: "DUE_IN_7_DAYS" },
  },
  {
    bookingId: "bk_982345",
    offeringId: "spotlight-tennis-nov",
    batchId: "b2",
    studentName: "Ishita Bhat",
    studentPhone: "+91 98450 52345",
    payment: { status: "PAID", method: "UPI", vpaApp: "PhonePe", paidAt: "2026-09-25T18:40:00Z" },
    operations: { attendance: "UNMARKED", bookingStatus: "ATTENDING", renewalStatus: "NOT_APPLICABLE" },
  },
  {
    bookingId: "bk_771201",
    offeringId: "spotlight-mma-intro",
    batchId: "b1",
    studentName: "Rohan Mehta",
    studentPhone: "+91 99000 11223",
    payment: { status: "PAID", method: "UPI", vpaApp: "GooglePay", paidAt: "2026-09-29T11:05:00Z" },
    operations: { attendance: "UNMARKED", bookingStatus: "ATTENDING", renewalStatus: "NOT_APPLICABLE" },
  },
  {
    bookingId: "bk_771202",
    offeringId: "spotlight-mma-intro",
    batchId: "b1",
    studentName: "Sana Khan",
    studentPhone: "+91 99000 22334",
    payment: { status: "PAID", method: "UPI", vpaApp: "Paytm", paidAt: "2026-09-29T12:15:00Z" },
    operations: { attendance: "UNMARKED", bookingStatus: "ATTENDING", renewalStatus: "NOT_APPLICABLE" },
  },
];

export const TENNIS_SCRIPT =
  "New tennis batch from November for adult beginners (no experience) for Rs 3000 per month in group setting at KSLTA court. 3 days a week MWF & TThSat, 2 batches per day - morning 6:30 - 8:00 and evening 7:00 - 8:30, Maximum 4 people per group, balls provided, racket available for first class but will help students select good rackets after the first class on a discount. All intro covered - warm up, forehand, back hand, drills rally cool down - no focus on matchplay at this level.";

export const MMA_SCRIPT =
  "Intro to Jiu Jitsu Lesson on Tuesday 7th October between 7:30 - 9:30 PM for 1000 Rs. Learn from real jiu jitsu fighters - no prior experience needed, all equipment provided. Grappling isn't just about fighting; it's about how we treat the room, our partners, and ourselves. What to expect: fundamental body movements, understanding basic positions and submissions, defensive awareness, safety protocols, fun and play.";
