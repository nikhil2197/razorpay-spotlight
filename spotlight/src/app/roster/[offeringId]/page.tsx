"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Check, X, ShieldAlert, ExternalLink, Pencil, MessageSquareHeart, CalendarX } from "lucide-react";
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
  const { merchant, getOffering, rosterFor, setAttendance, requestReview, cancelAndRefundAll, cancelBatchNextSession } =
    useSpotlight();
  const router = useRouter();
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [confirmCancelBatchId, setConfirmCancelBatchId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const offering = getOffering(offeringId);
  const records = rosterFor(offeringId);

  if (!merchant || !offering) {
    return <div className="flex-1 flex items-center justify-center text-sm text-slate-400">Offering not found.</div>;
  }

  const totalCapacity = offering.schedule.batches.reduce((s, b) => s + b.capacity, 0);
  // Derived from the actual roster, never a separately maintained counter.
  const totalFilled = records.filter((r) => r.operations.bookingStatus === "ATTENDING").length;
  const isRecurring = offering.offeringType === "recurring_batch";
  const fullLink = typeof window !== "undefined" ? `${window.location.origin}/p/${merchant.merchantId}/${offering.slug}` : "";

  function handleRequestReview(bookingId: string, studentName: string) {
    requestReview(bookingId);
    setToast(`WhatsApp review request sent to ${studentName}`);
    setTimeout(() => setToast(null), 2200);
  }

  return (
    <div className="flex-1 flex flex-col">
      <div className="px-5 pt-4 pb-2 flex items-center gap-2">
        <button onClick={() => router.push("/home")} className="text-slate-500">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-lg font-bold text-slate-900 truncate">{offering.internalLabel ?? offering.title}</h1>
      </div>

      <div className="px-5 grid grid-cols-2 gap-2 mb-3">
        <Button
          variant="outline"
          className="w-full flex items-center justify-center gap-1.5 !py-2"
          onClick={() => window.open(fullLink, "_blank", "noopener,noreferrer")}
        >
          <ExternalLink size={14} /> View Link
        </Button>
        <Button
          variant="secondary"
          className="w-full flex items-center justify-center gap-1.5 !py-2"
          onClick={() => router.push(`/create/preview?id=${offeringId}`)}
        >
          <Pencil size={14} /> Edit Link
        </Button>
      </div>

      <div className="px-5">
        <Card className="flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-slate-900">{offering.internalLabel ?? offering.title}</p>
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
                  <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                    <Badge tone={canceled ? "red" : "green"}>
                      {canceled ? "Canceled (Auto-Refunded)" : `Paid via ${r.payment.method}`}
                    </Badge>
                    {!canceled && renewal.label && <Badge tone={renewal.tone}>{renewal.label}</Badge>}
                    {!canceled && (
                      <Badge tone={r.operations.attendance === "PRESENT" ? "green" : r.operations.attendance === "ABSENT" ? "red" : "neutral"}>
                        {r.operations.attendance === "UNMARKED" ? "Attending" : r.operations.attendance}
                      </Badge>
                    )}
                    {!canceled && r.operations.reviewRequested && <Badge tone="blue">Review requested</Badge>}
                  </div>
                </div>
              </div>
              {!canceled && (
                <div className="grid grid-cols-3 gap-1.5 mt-3">
                  <Button
                    variant={r.operations.attendance === "PRESENT" ? "primary" : "secondary"}
                    className="flex items-center justify-center gap-1 !py-1.5 !px-1.5 text-[12px]"
                    onClick={() => setAttendance(r.bookingId, "PRESENT")}
                  >
                    <Check size={13} /> Present
                  </Button>
                  <Button
                    variant={r.operations.attendance === "ABSENT" ? "danger" : "secondary"}
                    className="flex items-center justify-center gap-1 !py-1.5 !px-1.5 text-[12px]"
                    onClick={() => setAttendance(r.bookingId, "ABSENT")}
                  >
                    <X size={13} /> Absent
                  </Button>
                  <Button
                    variant="secondary"
                    disabled={r.operations.reviewRequested}
                    className="flex items-center justify-center gap-1 !py-1.5 !px-1.5 text-[12px]"
                    onClick={() => handleRequestReview(r.bookingId, r.studentName)}
                  >
                    <MessageSquareHeart size={13} /> {r.operations.reviewRequested ? "Requested" : "Review"}
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

      <div className="px-5 pb-6 pt-4 mt-auto flex flex-col gap-2">
        {isRecurring ? (
          offering.schedule.batches.map((b) =>
            confirmCancelBatchId === b.id ? (
              <Card key={b.id} className="border-red-200">
                <p className="text-sm font-semibold text-slate-900">Cancel {b.label}&apos;s next session?</p>
                <p className="text-xs text-slate-500 mt-1">
                  Only {b.nextSessionLabel ?? "the next upcoming"} session is canceled — the monthly cohort continues after that.
                  Attending students for this batch will be automatically refunded for that session via Razorpay.
                </p>
                <div className="flex gap-2 mt-3">
                  <Button variant="secondary" className="flex-1" onClick={() => setConfirmCancelBatchId(null)}>
                    Keep it
                  </Button>
                  <Button
                    variant="danger"
                    className="flex-1"
                    onClick={() => {
                      cancelBatchNextSession(offeringId, b.id);
                      setConfirmCancelBatchId(null);
                    }}
                  >
                    Confirm & refund
                  </Button>
                </div>
              </Card>
            ) : (
              <button
                key={b.id}
                onClick={() => setConfirmCancelBatchId(b.id)}
                className="w-full flex items-center gap-3 rounded-full border border-red-300 bg-white px-4 py-2.5 text-left hover:bg-red-50 transition-colors"
              >
                <CalendarX size={18} className="text-red-600 shrink-0" />
                <span className="min-w-0">
                  <span className="block text-sm font-semibold text-red-600 truncate">Cancel next session</span>
                  <span className="block text-xs text-red-400 truncate">
                    {b.label}{b.nextSessionLabel ? ` · ${b.nextSessionLabel}` : ""}
                  </span>
                </span>
              </button>
            )
          )
        ) : !confirmCancel ? (
          <Button variant="danger" className="w-full flex items-center justify-center gap-2" onClick={() => setConfirmCancel(true)}>
            <ShieldAlert size={16} /> Cancel Session & Refund All
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

      {toast && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs font-semibold px-4 py-2.5 rounded-full shadow-lg z-50">
          {toast}
        </div>
      )}
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
