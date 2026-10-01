"use client";

import { useState } from "react";
import Image from "next/image";
import { ShieldCheck, MapPin, Star, PackageCheck, RotateCcw, BadgeCheck, Landmark, RefreshCcw, MessageSquareQuote } from "lucide-react";
import type { Merchant, SpotlightOffering } from "@/lib/types";
import { formatRupees } from "@/lib/utils";
import { Badge, BottomSheet } from "@/components/ui";
import { REVIEWS } from "@/data/seed";

export function OfferingView({
  offering,
  merchant,
  children,
}: {
  offering: SpotlightOffering;
  merchant: Merchant;
  /** Slot of page-specific controls (slot selector + CTA for public, edit fields for preview) */
  children?: React.ReactNode;
}) {
  const [showVerifiedInfo, setShowVerifiedInfo] = useState(false);
  const [showReviews, setShowReviews] = useState(false);
  const reviews = REVIEWS.filter((r) => r.merchantId === merchant.merchantId);

  return (
    <div className="flex-1">
      <div className="relative h-44 w-full bg-slate-900">
        <Image src={offering.media.heroImages[0]} alt={offering.title} fill className="object-cover" unoptimized />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute bottom-3 left-4 right-4 flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center text-xs font-bold text-blue-700">
            {merchant.avatarInitials}
          </div>
          <div>
            <p className="text-white text-[13px] font-semibold leading-none">{merchant.name}</p>
            <p className="text-white/80 text-[11px] flex items-center gap-1 mt-0.5">
              <MapPin size={10} /> {merchant.facility}
            </p>
          </div>
        </div>
      </div>

      <div className="px-5 pt-4">
        <div className="flex items-center gap-2 mb-2">
          {merchant.isVerified && (
            <button onClick={() => setShowVerifiedInfo(true)} className="active:scale-95 transition-transform">
              <Badge tone="blue">
                <span className="inline-flex items-center gap-1">
                  <ShieldCheck size={11} /> Razorpay Verified
                </span>
              </Badge>
            </button>
          )}
          <button onClick={() => setShowReviews(true)} className="active:scale-95 transition-transform">
            <Badge tone="green">
              <span className="inline-flex items-center gap-1">
                <Star size={11} /> {merchant.rating} · {reviews.length} reviews
              </span>
            </Badge>
          </button>
        </div>

        <h1 className="text-xl font-bold text-slate-900 leading-snug">{offering.title}</h1>
        <p className="text-sm text-slate-600 mt-1">{offering.copy.tagline}</p>
        <p className="text-2xl font-bold text-blue-700 mt-3">
          {formatRupees(offering.pricing.amount)}
          <span className="text-sm font-semibold text-slate-500"> {offering.pricing.unitLabel}</span>
        </p>

        {children}

        <div className="mt-5">
          <p className="text-sm font-bold text-slate-900 mb-2">What you&apos;ll learn</p>
          <div className="flex flex-col gap-1.5">
            {offering.syllabus.map((s, i) => (
              <div key={i} className="flex items-start gap-2 text-sm text-slate-700">
                <span className="h-5 w-5 shrink-0 rounded-full bg-blue-100 text-blue-700 text-[11px] font-bold flex items-center justify-center mt-0.5">
                  {i + 1}
                </span>
                {s}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-5">
          <p className="text-sm font-bold text-slate-900 mb-2">Logistics</p>
          <p className="text-sm text-slate-600 mb-2">{offering.logistics.equipmentPolicy}</p>
          <div className="flex flex-wrap gap-1.5">
            {offering.logistics.amenities.map((a) => (
              <Badge key={a}>
                <span className="inline-flex items-center gap-1">
                  <PackageCheck size={11} /> {a}
                </span>
              </Badge>
            ))}
          </div>
        </div>

        <div className="mt-5 bg-slate-50 rounded-xl p-3.5">
          <p className="text-sm font-bold text-slate-900 mb-1.5 flex items-center gap-1.5">
            <RotateCcw size={14} /> Cancellation & refunds
          </p>
          <p className="text-xs text-slate-600">{offering.policy.refundTerms}</p>
          <p className="text-xs text-slate-600 mt-1">{offering.policy.rescheduleTerms}</p>
        </div>
      </div>

      {showVerifiedInfo && (
        <BottomSheet
          onClose={() => setShowVerifiedInfo(false)}
          icon={<ShieldCheck size={18} />}
          title="Razorpay Verified"
          subtitle="What this badge means"
        >
          <p className="text-sm text-slate-700 mb-4">
            {merchant.name} has completed Razorpay&apos;s business verification — this isn&apos;t a self-declared badge.
            Here&apos;s what was checked and what it means for you as a customer.
          </p>

          <div className="flex flex-col gap-3">
            <div className="flex items-start gap-2.5">
              <BadgeCheck size={16} className="text-blue-600 mt-0.5 shrink-0" />
              <p className="text-xs text-slate-600">
                <span className="font-semibold text-slate-900">KYC &amp; business details verified</span> — PAN, bank
                account, and business identity were checked by Razorpay before this merchant could accept payments.
              </p>
            </div>
            <div className="flex items-start gap-2.5">
              <Landmark size={16} className="text-blue-600 mt-0.5 shrink-0" />
              <p className="text-xs text-slate-600">
                <span className="font-semibold text-slate-900">Funds settle to a verified bank account</span> — your
                payment doesn&apos;t go to a personal UPI ID; it&apos;s processed and settled through Razorpay.
              </p>
            </div>
            <div className="flex items-start gap-2.5">
              <RefreshCcw size={16} className="text-blue-600 mt-0.5 shrink-0" />
              <p className="text-xs text-slate-600">
                <span className="font-semibold text-slate-900">Refund rate: {merchant.refundRate}%</span> across{" "}
                {merchant.eventsHosted} events hosted — if this booking is canceled within policy, the refund is
                automatic, not something you have to chase.
              </p>
            </div>
          </div>
        </BottomSheet>
      )}

      {showReviews && (
        <BottomSheet
          onClose={() => setShowReviews(false)}
          icon={<MessageSquareQuote size={18} />}
          title={`${merchant.rating}★ · ${reviews.length} reviews`}
          subtitle="From customers who booked through Spotlight"
        >
          <div className="flex flex-col gap-3">
            {reviews.map((r) => (
              <div key={r.id} className="border-b border-slate-100 pb-3 last:border-0 last:pb-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-slate-900">{r.author}</p>
                  <span className="text-[11px] text-slate-400">{r.relativeDate}</span>
                </div>
                <div className="flex items-center gap-0.5 my-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={12}
                      className={i < r.rating ? "text-amber-400 fill-amber-400" : "text-slate-200 fill-slate-200"}
                    />
                  ))}
                  {r.verifiedBooking && (
                    <span className="ml-1.5 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-full">
                      Verified booking
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-600">{r.text}</p>
              </div>
            ))}
            {reviews.length === 0 && <p className="text-sm text-slate-400">No reviews yet.</p>}
          </div>
        </BottomSheet>
      )}
    </div>
  );
}
