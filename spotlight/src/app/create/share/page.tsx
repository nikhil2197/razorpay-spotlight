"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2, Copy, MessageCircle, Camera, Check, ExternalLink, Home } from "lucide-react";
import { MobileShell } from "@/components/MobileShell";
import { RequireMerchant } from "@/components/RequireMerchant";
import { Button, Card } from "@/components/ui";
import { useSpotlight } from "@/lib/store";

function ShareContent() {
  const params = useSearchParams();
  const id = params.get("id") ?? "";
  const { merchant, getOffering } = useSpotlight();
  const router = useRouter();
  const [copied, setCopied] = useState(false);

  const offering = getOffering(id);
  if (!merchant || !offering) {
    return <div className="flex-1 flex items-center justify-center text-sm text-slate-400">Offering not found.</div>;
  }

  const link = `razorpay.me/@${merchant.handle}/${offering.slug}`;
  const fullLink = typeof window !== "undefined" ? `${window.location.origin}/p/${merchant.merchantId}/${offering.slug}` : "";
  const shareText = `${offering.title} — ${offering.copy.tagline} Book your slot: ${fullLink}`;

  function copyLink() {
    navigator.clipboard?.writeText(fullLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="flex-1 flex flex-col">
      <div className="px-5 pt-8 flex flex-col items-center text-center">
        <CheckCircle2 className="text-emerald-500" size={48} />
        <h1 className="text-xl font-bold text-slate-900 mt-3">Spotlight is live</h1>
        <p className="text-sm text-slate-500 mt-1">Share this link on Instagram or WhatsApp to start taking bookings.</p>
      </div>

      <div className="px-5 mt-5">
        <Card className="flex items-center justify-between gap-2">
          <p className="text-sm font-semibold text-blue-700 truncate">{link}</p>
          <button onClick={copyLink} className="shrink-0 flex items-center gap-1 text-xs font-semibold text-slate-600 bg-slate-100 rounded-full px-3 py-1.5">
            {copied ? <Check size={13} /> : <Copy size={13} />} {copied ? "Copied" : "Copy"}
          </button>
        </Card>

        <div className="grid grid-cols-2 gap-3 mt-3">
          <a
            href={`https://wa.me/?text=${encodeURIComponent(shareText)}`}
            target="_blank"
            rel="noreferrer"
            className="bg-emerald-50 rounded-xl p-4 flex flex-col items-center gap-2"
          >
            <MessageCircle className="text-emerald-600" size={22} />
            <span className="text-xs font-semibold text-slate-900">Share to WhatsApp</span>
          </a>
          <button
            onClick={copyLink}
            className="bg-pink-50 rounded-xl p-4 flex flex-col items-center gap-2"
          >
            <Camera className="text-pink-600" size={22} />
            <span className="text-xs font-semibold text-slate-900">Copy for Instagram bio</span>
          </button>
        </div>
      </div>

      <div className="px-5 pb-6 pt-4 mt-auto sticky bottom-0 bg-[#f4f5f7] flex flex-col gap-3">
        <Button
          variant="outline"
          className="w-full flex items-center justify-center gap-1.5"
          onClick={() => window.open(fullLink, "_blank", "noopener,noreferrer")}
        >
          <ExternalLink size={15} /> Preview customer side
        </Button>
        <Button variant="primary" className="w-full flex items-center justify-center gap-1.5" onClick={() => router.push("/home")}>
          <Home size={15} /> Return to home
        </Button>
      </div>
    </div>
  );
}

export default function SharePage() {
  return (
    <MobileShell>
      <RequireMerchant>
        <Suspense fallback={null}>
          <ShareContent />
        </Suspense>
      </RequireMerchant>
    </MobileShell>
  );
}
