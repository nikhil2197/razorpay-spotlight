"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSpotlight } from "@/lib/store";

export function RequireMerchant({ children }: { children: React.ReactNode }) {
  const { hydrated, merchant } = useSpotlight();
  const router = useRouter();

  useEffect(() => {
    if (hydrated && !merchant) {
      router.replace("/");
    }
  }, [hydrated, merchant, router]);

  if (!hydrated || !merchant) {
    return <div className="flex-1 flex items-center justify-center text-sm text-slate-400">Loading…</div>;
  }

  return <>{children}</>;
}
