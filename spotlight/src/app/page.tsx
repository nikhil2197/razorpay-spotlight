"use client";

import { useRouter } from "next/navigation";
import { MobileShell } from "@/components/MobileShell";
import { useSpotlight } from "@/lib/store";
import { Badge } from "@/components/ui";
import { ShieldCheck, MapPin } from "lucide-react";

export default function PersonaSwitcherPage() {
  const { merchants, selectMerchant, hydrated } = useSpotlight();
  const router = useRouter();

  function handleSelect(id: string) {
    selectMerchant(id);
    router.push("/home");
  }

  return (
    <MobileShell>
      <div className="px-5 pt-6 pb-4">
        <p className="text-sm font-semibold text-blue-600 mb-1">Razorpay</p>
        <h1 className="text-2xl font-bold text-slate-900">Pick a merchant account</h1>
        <p className="text-sm text-slate-500 mt-1">
          Evaluator context switcher — select a seeded merchant to try the Spotlight flow.
        </p>
      </div>

      <div className="px-5 flex flex-col gap-3">
        {hydrated &&
          merchants.map((m) => (
            <button
              key={m.merchantId}
              onClick={() => handleSelect(m.merchantId)}
              className="text-left bg-white rounded-xl border border-slate-200 p-4 active:scale-[0.99] transition-transform"
            >
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                  {m.avatarInitials}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-slate-900 text-[15px]">{m.name}</p>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                    <MapPin size={12} /> {m.facility}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-3">
                {m.isVerified && (
                  <Badge tone="blue">
                    <span className="inline-flex items-center gap-1">
                      <ShieldCheck size={12} /> Verified
                    </span>
                  </Badge>
                )}
                <Badge>{m.category.replace("_", " ")}</Badge>
                <Badge tone="green">{m.rating}★ · {m.eventsHosted} events</Badge>
              </div>
            </button>
          ))}
      </div>
    </MobileShell>
  );
}
