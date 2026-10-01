"use client";

import { use, useState } from "react";
import { CalendarCheck, MapPin, CheckCircle2 } from "lucide-react";
import { MobileShell } from "@/components/MobileShell";
import { OfferingView } from "@/components/OfferingView";
import { Button, Badge } from "@/components/ui";
import { useSpotlight } from "@/lib/store";
import { formatRupees } from "@/lib/utils";
import { cn } from "@/lib/utils";

function BookingFlow({ merchantId, slug }: { merchantId: string; slug: string }) {
  const { merchants, offerings, bookSlot } = useSpotlight();
  const merchant = merchants.find((m) => m.merchantId === merchantId);
  const offering = offerings.find((o) => o.merchantId === merchantId && o.slug === slug);

  const [selectedBatch, setSelectedBatch] = useState(offering?.schedule.batches[0]?.id);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [booking, setBooking] = useState<ReturnType<typeof bookSlot> | null>(null);
  const [paying, setPaying] = useState(false);

  if (!merchant || !offering) {
    return <div className="flex-1 flex items-center justify-center text-sm text-slate-400 px-6 text-center">This Spotlight link doesn&apos;t exist (yet).</div>;
  }

  const batch = offering.schedule.batches.find((b) => b.id === selectedBatch);
  const full = !!batch && batch.filled >= batch.capacity;

  function handlePay() {
    if (!name.trim() || !phone.trim() || full) return;
    setPaying(true);
    setTimeout(() => {
      const record = bookSlot(offering!.offeringId, selectedBatch, name.trim(), phone.trim());
      setBooking(record);
      setPaying(false);
    }, 1200);
  }

  if (booking) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <CheckCircle2 className="text-emerald-500" size={56} />
        <h1 className="text-xl font-bold text-slate-900 mt-4">You&apos;re booked!</h1>
        <p className="text-sm text-slate-500 mt-1">Booking ID {booking.bookingId}</p>

        <div className="w-full bg-white rounded-xl border border-slate-200 p-4 mt-5 text-left">
          <p className="text-sm font-bold text-slate-900">{offering.title}</p>
          <p className="text-xs text-slate-500 mt-1">{batch?.label} · {batch?.timing}</p>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-2">
            <MapPin size={12} /> {merchant.facility}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
            <CalendarCheck size={12} /> Added to your calendar
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500">Paid via UPI</span>
            <span className="text-sm font-bold text-emerald-600">{formatRupees(offering.pricing.amount)}</span>
          </div>
        </div>
        <p className="text-[11px] text-slate-400 mt-4">{offering.policy.refundTerms}</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      <OfferingView offering={offering} merchant={merchant}>
        <div className="mt-4">
          <p className="text-[11px] font-semibold text-slate-500 mb-1.5">Select a slot</p>
          {offering.offeringType === "recurring_batch" ? (
            <div className="flex gap-2 flex-wrap">
              {offering.schedule.batches.map((b) => {
                const isFull = b.filled >= b.capacity;
                return (
                  <button
                    key={b.id}
                    disabled={isFull}
                    onClick={() => setSelectedBatch(b.id)}
                    className={cn(
                      "px-3 py-2 rounded-full text-xs font-semibold border",
                      selectedBatch === b.id ? "bg-blue-600 text-white border-blue-600" : "bg-white text-slate-700 border-slate-200",
                      isFull && "opacity-40 line-through"
                    )}
                  >
                    {b.label} · {b.timing}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-800">
              {offering.schedule.date}
            </div>
          )}
          {batch && <Badge tone={full ? "red" : "neutral"}>{batch.filled}/{batch.capacity} booked{full ? " · Full" : ""}</Badge>}
        </div>

        <div className="mt-4 grid grid-cols-1 gap-2">
          <input
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm"
          />
          <input
            placeholder="Phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm"
          />
        </div>
      </OfferingView>

      <div className="px-5 pb-6 pt-2 bg-[#f4f5f7] sticky bottom-0">
        <Button className="w-full" disabled={!name.trim() || !phone.trim() || full || paying} onClick={handlePay}>
          {paying ? "Processing UPI payment…" : full ? "Slot full" : `Pay ${formatRupees(offering.pricing.amount)} with UPI`}
        </Button>
      </div>
    </div>
  );
}

export default function PublicOfferingPage({ params }: { params: Promise<{ merchantId: string; slug: string }> }) {
  const { merchantId, slug } = use(params);
  return (
    <MobileShell>
      <BookingFlow merchantId={merchantId} slug={slug} />
    </MobileShell>
  );
}
