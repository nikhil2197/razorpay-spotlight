"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Check, X, ShieldAlert } from "lucide-react";
import { MobileShell } from "@/components/MobileShell";
import { RequireMerchant } from "@/components/RequireMerchant";
import { Button, Card, Badge } from "@/components/ui";
import { useSpotlight } from "@/lib/store";

const RENEWAL_LABEL: Record<string, { label: string; tone: "amber" | "green" | "neutral" }> = {
  DUE_IN_7_DAYS: { label: "Renewal due in 7 days", tone: "amber" },
  RENEWED: { label: "Renewed", tone: "green" },
  NOT_APPLICABLE: { label: "", tone: "neutral" },
};

function RosterContent({ offeringId }: { offeringId: string }) {
  const { merchant, getOffering, rosterFor, setAttendance, cancelAndRefundAll } = useSpotlight();
  const router = useRouter();
  const [confirmCancel, setConfirmCancel] = useState(false);

  const offering = getOffering(offeringId);
  const records = rosterFor(offeringId);

  if (!merchant || !offering) {
    return <div className="flex-1 flex items-center justify-center text-sm text-slate-400">Offering not found.</div>;
  }

  const totalCapacity = offering.schedule.batches.reduce((s, b) => s + b.capacity, 0);
  const totalFilled = offering.schedule.batches.reduce((s, b) => s + b.filled, 0);

  return (
    <div className="flex-1 flex flex-col">
      <div className="px-5 pt-4 pb-2 flex items-center gap-2">
        <button onClick={() => router.push("/home")} className="text-slate-500">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-lg font-bold text-slate-900 truncate">{offering.title}</h1>
      </div>

      <div className="px-5">
        <Card className="flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-slate-900">{offering.title}</p>
            <p className="text-xs text-slate-500">
              {offering.schedule.date ?? offering.schedule.batches.map((b) => b.timing).join(" · ")}
            </p>
          </div>
          <Badge tone="blue">{totalFilled} / {totalCapacity} Enrolled</Badge>
        </Card>
      </div>

      <div className="px-5 mt-4 flex flex-col gap-2">
        {records.map((r) => {
          const batch = offering.schedule.batches.find((b) => b.id === r.batchId);
          const renewal = RENEWAL_LABEL[r.operations.renewalStatus];
          const canceled = r.operations.bookingStatus === "CANCELED";
          return (
            <Card key={r.bookingId} className={canceled ? "opacity-60" : undefined}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-900">{r.studentName}</p>
                  <p className="text-[11px] text-slate-500">{r.bookingId} {batch ? `· ${batch.label}` : ""}</p>
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <Badge tone={canceled ? "red" : "green"}>
                      {canceled ? "Canceled (Auto-Refunded)" : `Paid via ${r.payment.method}`}
                    </Badge>
                    {!canceled && renewal.label && <Badge tone={renewal.tone}>{renewal.label}</Badge>}
                    {!canceled && (
                      <Badge tone={r.operations.attendance === "PRESENT" ? "green" : r.operations.attendance === "ABSENT" ? "red" : "neutral"}>
                        {r.operations.attendance === "UNMARKED" ? "Attending" : r.operations.attendance}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              {!canceled && (
                <div className="flex gap-2 mt-3">
                  <Button
                    variant={r.operations.attendance === "PRESENT" ? "primary" : "secondary"}
                    className="flex-1 flex items-center justify-center gap-1 !py-1.5"
                    onClick={() => setAttendance(r.bookingId, "PRESENT")}
                  >
                    <Check size={14} /> Present
                  </Button>
                  <Button
                    variant={r.operations.attendance === "ABSENT" ? "danger" : "secondary"}
                    className="flex-1 flex items-center justify-center gap-1 !py-1.5"
                    onClick={() => setAttendance(r.bookingId, "ABSENT")}
                  >
                    <X size={14} /> Absent
                  </Button>
                </div>
              )}
            </Card>
          );
        })}
        {records.length === 0 && (
          <p className="text-sm text-slate-400 text-center mt-6">No bookings yet — share your Spotlight link to get your first one.</p>
        )}
      </div>

      <div className="px-5 pb-6 pt-4 mt-auto">
        {!confirmCancel ? (
          <Button variant="danger" className="w-full flex items-center justify-center gap-2" onClick={() => setConfirmCancel(true)}>
            <ShieldAlert size={16} /> Cancel Session & Batch-Refund All
          </Button>
        ) : (
          <Card className="border-red-200">
            <p className="text-sm font-semibold text-slate-900">Cancel this session?</p>
            <p className="text-xs text-slate-500 mt-1">All {records.filter((r) => r.operations.bookingStatus === "ATTENDING").length} attending students will be automatically refunded via Razorpay.</p>
            <div className="flex gap-2 mt-3">
              <Button variant="secondary" className="flex-1" onClick={() => setConfirmCancel(false)}>
                Keep session
              </Button>
              <Button
                variant="danger"
                className="flex-1"
                onClick={() => {
                  cancelAndRefundAll(offeringId);
                  setConfirmCancel(false);
                }}
              >
                Confirm & refund
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}

export default function RosterPage({ params }: { params: Promise<{ offeringId: string }> }) {
  const { offeringId } = use(params);
  return (
    <MobileShell>
      <RequireMerchant>
        <RosterContent offeringId={offeringId} />
      </RequireMerchant>
    </MobileShell>
  );
}
