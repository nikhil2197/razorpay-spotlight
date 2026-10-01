"use client";

import { MobileShell } from "@/components/MobileShell";
import { BottomNav } from "@/components/BottomNav";
import { RequireMerchant } from "@/components/RequireMerchant";
import { TopBar, Card } from "@/components/ui";
import { useSpotlight } from "@/lib/store";
import { formatRupees } from "@/lib/utils";

function PaymentsContent() {
  const { merchant, roster, offerings } = useSpotlight();
  if (!merchant) return null;
  const myOfferingIds = offerings.filter((o) => o.merchantId === merchant.merchantId).map((o) => o.offeringId);
  const payments = roster.filter((r) => myOfferingIds.includes(r.offeringId));

  return (
    <>
      <div className="flex-1">
        <TopBar title="Payments" />
        <div className="px-5 flex flex-col gap-2">
          {payments.map((p) => {
            const offering = offerings.find((o) => o.offeringId === p.offeringId);
            return (
              <Card key={p.bookingId} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-900">{p.studentName}</p>
                  <p className="text-xs text-slate-500">{offering?.title} · {p.payment.vpaApp}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-slate-900">{formatRupees(offering?.pricing.amount ?? 0)}</p>
                  <p className={`text-[11px] font-semibold ${p.payment.status === "PAID" ? "text-emerald-600" : "text-red-500"}`}>
                    {p.payment.status}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
      <BottomNav />
    </>
  );
}

export default function PaymentsPage() {
  return (
    <MobileShell>
      <RequireMerchant>
        <PaymentsContent />
      </RequireMerchant>
    </MobileShell>
  );
}
