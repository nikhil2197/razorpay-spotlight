export type Merchant = {
  merchantId: string;
  name: string;
  facility: string;
  city: string;
  isVerified: boolean;
  upiVpa: string;
  category: string;
  handle: string;
  avatarInitials: string;
  rating: number;
  eventsHosted: number;
  refundRate: number;
};

export type Review = {
  id: string;
  merchantId: string;
  author: string;
  rating: number;
  text: string;
  relativeDate: string;
  verifiedBooking: boolean;
};

export type Batch = {
  id: string;
  label: string;
  timing: string;
  capacity: number;
  /** Next upcoming occurrence of this batch, e.g. "Mon, Oct 6" — only meaningful for recurring batches. */
  nextSessionLabel?: string;
};

export type OfferingType = "recurring_batch" | "single_event";

export type OfferingStatus = "draft" | "published";

export type SpotlightOffering = {
  offeringId: string;
  merchantId: string;
  slug: string;
  title: string;
  offeringType: OfferingType;
  status: OfferingStatus;
  /** Merchant-facing shorthand for Home/Roster headings (e.g. "October Batch", "01/10 batch") — distinct from `title`, which is the customer-facing name shown on the public booking page. Falls back to `title` when unset. */
  internalLabel?: string;
  pricing: {
    amount: number;
    currency: string;
    cadence: "monthly" | "one_time";
    unitLabel: string;
  };
  schedule: {
    days: string[];
    date?: string;
    batches: Batch[];
  };
  logistics: {
    equipmentPolicy: string;
    amenities: string[];
  };
  syllabus: string[];
  policy: {
    refundTerms: string;
    rescheduleTerms: string;
  };
  /**
   * Content hand-off contract: anything rendering the public booking page
   * (Screen 4 / the Luma-style page) reads ONLY from media + copy + the
   * fields above. A future offering JSON (real merchant content/images)
   * can be dropped in as long as it matches this shape.
   */
  media: {
    heroImages: string[];
    logoUrl?: string;
  };
  copy: {
    tagline: string;
    longDescription: string;
  };
};

export type PaymentStatus = "PAID" | "PENDING" | "REFUNDED";

export type AttendanceStatus = "PRESENT" | "ABSENT" | "UNMARKED";

export type BookingStatus = "ATTENDING" | "CANCELED";

export type RenewalStatus = "DUE_IN_7_DAYS" | "RENEWED" | "NOT_APPLICABLE";

export type RosterRecord = {
  bookingId: string;
  offeringId: string;
  batchId?: string;
  studentName: string;
  studentPhone: string;
  payment: {
    status: PaymentStatus;
    method: string;
    vpaApp?: string;
    paidAt?: string;
  };
  operations: {
    attendance: AttendanceStatus;
    bookingStatus: BookingStatus;
    renewalStatus: RenewalStatus;
    reviewRequested: boolean;
  };
};

export type ParsedDraft = {
  offering: SpotlightOffering;
  flags: string[];
};
