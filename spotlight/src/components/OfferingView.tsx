"use client";

import { useState } from "react";
import Image from "next/image";
import { ShieldCheck, MapPin, Star, PackageCheck, RotateCcw, X, BadgeCheck, Landmark, RefreshCcw } from "lucide-react";
import type { Merchant, SpotlightOffering } from "@/lib/types";
import { formatRupees } from "@/lib/utils";
import { Badge } from "@/components/ui";

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
          <Badge tone="green">
            <span className="inline-flex items-center gap-1">
              <Star size={11} /> {merchant.rating} · {merchant.eventsHosted} events
            </span>
          </Badge>
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
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40" onClick={() => setShowVerifiedInfo(false)}>
          <div
            className="w-full max-w-[420px] bg-white rounded-t-2xl p-5 pb-7"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="h-9 w-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center">
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <p className="font-bold text-slate-900 text-[15px]">Razorpay Verified</p>
                  <p className="text-xs text-slate-500">What this badge means</p>
                </div>
              </div>
              <button onClick={() => setShowVerifiedInfo(false)} className="text-slate-400">
                <X size={20} />
              </button>
            </div>

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

            <button
              onClick={() => setShowVerifiedInfo(false)}
              className="w-full mt-5 bg-slate-900 text-white rounded-full py-2.5 text-sm font-semibold"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
