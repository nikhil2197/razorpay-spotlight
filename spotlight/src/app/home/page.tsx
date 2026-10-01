"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronDown, Link2, Sparkles, ClipboardList, Share2, Settings } from "lucide-react";
import { MobileShell } from "@/components/MobileShell";
import { BottomNav } from "@/components/BottomNav";
import { RequireMerchant } from "@/components/RequireMerchant";
import { useSpotlight } from "@/lib/store";
import { formatRupees } from "@/lib/utils";
import { SEED_OFFERING_IDS } from "@/data/seed";

function HomeContent() {
  const { merchant, offerings, roster } = useSpotlight();
  const router = useRouter();
  if (!merchant) return null;

  // Home shows only the two seeded Spotlights for now — every demo run of the
  // Create flow would otherwise append another "Adult Beginners Tennis Cohort"
  // card here. Real per-batch naming (e.g. "Oct MWF Evening Batch") is a
  // later problem once offerings are meant to accumulate for real.
  const myOfferings = offerings.filter((o) => o.merchantId === merchant.merchantId && SEED_OFFERING_IDS.includes(o.offeringId));
  const myOfferingIds = myOfferings.map((o) => o.offeringId);
  // Derived from actual roster records, never a separately maintained
  // counter — those can (and did) drift from reality.
  const paidRecords = roster.filter((r) => myOfferingIds.includes(r.offeringId) && r.payment.status === "PAID");
  const todayCollected = paidRecords.reduce((sum, r) => {
    const offering = myOfferings.find((o) => o.offeringId === r.offeringId);
    return sum + (offering?.pricing.amount ?? 0);
  }, 0);

  return (
    <>
      <div className="flex-1">
        <div className="px-5 pt-4 pb-2 flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
            {merchant.avatarInitials}
          </div>
          <div>
            <p className="text-xs text-slate-500">Good morning</p>
            <p className="text-[17px] font-bold text-slate-900">{merchant.name}</p>
          </div>
        </div>

        <div className="mx-5 mt-3 bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-xs text-slate-500 text-center">Collected today</p>
          <p className="text-3xl font-bold text-slate-900 text-center mt-1">{formatRupees(todayCollected)}</p>
          <button className="mx-auto mt-3 flex items-center gap-1 bg-slate-100 rounded-full px-4 py-2 text-xs font-semibold text-slate-700">
            View breakdown ({paidRecords.length} payments)
            <ChevronDown size={14} />
          </button>
          <div className="flex mt-4 pt-3 border-t border-slate-100">
            <div className="flex-1 text-center border-r border-slate-100">
              <p className="text-xs text-slate-500">Next settlement</p>
              <p className="text-sm font-bold text-slate-900 mt-1">Tomorrow, 10 AM</p>
            </div>
            <div className="flex-1 text-center">
              <p className="text-xs text-slate-500">Account balance</p>
              <p className="text-sm font-bold text-slate-900 mt-1">{formatRupees(todayCollected)}</p>
            </div>
          </div>
        </div>

        <div className="mx-5 mt-4 bg-blue-50 rounded-xl p-4">
          <p className="font-bold text-slate-900 mb-3">Spotlight</p>
          <div className="bg-slate-900 rounded-lg px-4 py-3 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[11px] text-slate-300">Get paid on your branded Spotlight link</p>
              <p className="text-white font-semibold text-sm truncate">razorpay.me/@{merchant.handle}</p>
            </div>
            <Link2 size={16} className="text-white shrink-0" />
          </div>

          <div className="grid grid-cols-2 gap-3 mt-3">
            <Link
              href="/create"
              className="bg-white rounded-lg p-4 flex flex-col items-center gap-2 text-center active:scale-[0.98] transition-transform"
            >
              <Sparkles className="text-blue-600" size={22} />
              <span className="text-xs font-semibold text-slate-900">Create Spotlight</span>
            </Link>
            <Link
              href={myOfferings[0] ? `/roster/${myOfferings[0].offeringId}` : "/products"}
              className="bg-white rounded-lg p-4 flex flex-col items-center gap-2 text-center active:scale-[0.98] transition-transform"
            >
              <ClipboardList className="text-blue-600" size={22} />
              <span className="text-xs font-semibold text-slate-900">Manage Rosters</span>
            </Link>
          </div>
        </div>

        <div className="px-5 mt-5">
          <p className="font-bold text-slate-900 mb-2">Your Spotlights</p>
          <div className="flex flex-col gap-2">
            {myOfferings.map((o) => (
              <div
                key={o.offeringId}
                onClick={() => router.push(`/roster/${o.offeringId}`)}
                className="bg-white rounded-xl border border-slate-200 p-3 cursor-pointer active:scale-[0.99] transition-transform"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{o.internalLabel ?? o.title}</p>
                    <p className="text-xs text-slate-500">{formatRupees(o.pricing.amount)} {o.pricing.unitLabel}</p>
                  </div>
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full shrink-0">
                    {o.status}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/create/share?id=${o.offeringId}`);
                    }}
                    className="flex items-center justify-center gap-1.5 text-xs font-semibold text-slate-700 bg-slate-100 rounded-full py-2"
                  >
                    <Share2 size={13} /> Share
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/roster/${o.offeringId}`);
                    }}
                    className="flex items-center justify-center gap-1.5 text-xs font-semibold text-white bg-blue-600 rounded-full py-2"
                  >
                    <Settings size={13} /> Manage
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <BottomNav />
    </>
  );
}

export default function HomePage() {
  return (
    <MobileShell>
      <RequireMerchant>
        <HomeContent />
      </RequireMerchant>
    </MobileShell>
  );
}
