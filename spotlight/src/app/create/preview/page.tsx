"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { MobileShell } from "@/components/MobileShell";
import { RequireMerchant } from "@/components/RequireMerchant";
import { OfferingView } from "@/components/OfferingView";
import { Button, Badge } from "@/components/ui";
import { useSpotlight } from "@/lib/store";
import { formatRupees } from "@/lib/utils";

function PreviewContent() {
  const params = useSearchParams();
  const id = params.get("id") ?? "";
  const { merchant, getOffering, upsertOffering, enrolledCount } = useSpotlight();
  const router = useRouter();
  const [flags, setFlags] = useState<string[]>([]);

  const offering = getOffering(id);

  // Hydrating client-only state (sessionStorage isn't available during SSR).
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const raw = sessionStorage.getItem(`flags_${id}`);
    if (raw) setFlags(JSON.parse(raw));
  }, [id]);
  /* eslint-enable react-hooks/set-state-in-effect */

  if (!merchant || !offering) {
    return <div className="flex-1 flex items-center justify-center text-sm text-slate-400">Draft not found.</div>;
  }

  function updatePrice(amount: number) {
    if (!offering) return;
    upsertOffering({ ...offering, pricing: { ...offering.pricing, amount } });
  }

  function updateCapacity(capacity: number) {
    if (!offering) return;
    upsertOffering({
      ...offering,
      schedule: { ...offering.schedule, batches: offering.schedule.batches.map((b) => ({ ...b, capacity })) },
    });
  }

  const isEditingPublished = offering?.status === "published";

  function handlePublish() {
    if (!offering) return;
    if (isEditingPublished) {
      upsertOffering(offering);
      router.push(`/roster/${offering.offeringId}`);
      return;
    }
    upsertOffering({ ...offering, status: "published" });
    router.push(`/create/share?id=${offering.offeringId}`);
  }

  return (
    <div className="flex-1 flex flex-col">
      <div className="px-5 pt-4 pb-1 flex items-center gap-2">
        <button
          onClick={() => router.push(isEditingPublished ? `/roster/${offering.offeringId}` : "/create")}
          className="text-slate-500"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-lg font-bold text-slate-900">{isEditingPublished ? "Edit Spotlight" : "Review & confirm"}</h1>
        <Badge tone={isEditingPublished ? "green" : "amber"}>{isEditingPublished ? "Published" : "Draft"}</Badge>
      </div>

      {flags.length > 0 && (
        <div className="mx-5 mb-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
          {flags.map((f, i) => (
            <p key={i} className="text-xs text-amber-800 flex items-start gap-1.5">
              <AlertCircle size={13} className="shrink-0 mt-0.5" /> {f}
            </p>
          ))}
        </div>
      )}

      <OfferingView offering={offering} merchant={merchant}>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <label className="block">
            <span className="text-[11px] font-semibold text-slate-500">Price ({offering.pricing.unitLabel.trim()})</span>
            <input
              type="number"
              value={offering.pricing.amount}
              onChange={(e) => updatePrice(Number(e.target.value))}
              className="w-full mt-1 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold"
            />
          </label>
          <label className="block">
            <span className="text-[11px] font-semibold text-slate-500">Max per slot</span>
            <input
              type="number"
              value={offering.schedule.batches[0]?.capacity ?? 0}
              onChange={(e) => updateCapacity(Number(e.target.value))}
              className="w-full mt-1 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold"
            />
          </label>
        </div>

        <div className="mt-4">
          <p className="text-[11px] font-semibold text-slate-500 mb-1.5">Slots</p>
          <div className="flex flex-col gap-1.5">
            {offering.schedule.batches.map((b) => (
              <div key={b.id} className="flex items-center justify-between bg-slate-50 rounded-lg px-3 py-2 text-xs">
                <span className="font-semibold text-slate-700">{b.label} · {b.timing}</span>
                <span className="text-slate-500">{enrolledCount(offering.offeringId, b.id)}/{b.capacity} filled</span>
              </div>
            ))}
          </div>
        </div>
      </OfferingView>

      <div className="px-5 pb-6 pt-2 bg-[#f4f5f7] sticky bottom-0">
        <p className="text-[11px] text-slate-500 text-center mb-2">
          {isEditingPublished
            ? "Changes go live immediately for anyone with the link."
            : `This is exactly what ${formatRupees(offering.pricing.amount)} buyers will see. Nothing publishes without your approval.`}
        </p>
        <Button className="w-full" onClick={handlePublish}>
          {isEditingPublished ? "Save changes" : "Publish Offering"}
        </Button>
      </div>
    </div>
  );
}

export default function PreviewPage() {
  return (
    <MobileShell>
      <RequireMerchant>
        <Suspense fallback={null}>
          <PreviewContent />
        </Suspense>
      </RequireMerchant>
    </MobileShell>
  );
}
