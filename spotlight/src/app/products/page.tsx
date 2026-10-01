"use client";

import Link from "next/link";
import { Sparkles, Link2, QrCode, FileText, Repeat, ReceiptText } from "lucide-react";
import { MobileShell } from "@/components/MobileShell";
import { BottomNav } from "@/components/BottomNav";
import { RequireMerchant } from "@/components/RequireMerchant";
import { TopBar, SectionLabel, Card } from "@/components/ui";

const SHARE_AND_COLLECT = [
  { icon: Link2, title: "Payment links", desc: "Collect payments instantly by sharing a simple link" },
  { icon: QrCode, title: "QR codes", desc: "Collect payments with a QR code" },
  { icon: FileText, title: "Payment pages", desc: "Create a custom branded page to collect payments online" },
  { icon: Repeat, title: "Subscriptions", desc: "Set up recurring payments and automate billing" },
  { icon: ReceiptText, title: "Invoices", desc: "Send professional invoices and get paid faster" },
];

function ProductsContent() {
  return (
    <>
      <div className="flex-1">
        <TopBar title="Products" />
        <div className="px-5">
          <SectionLabel>Share and collect</SectionLabel>

          <Link
            href="/create"
            className="block bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-4 mb-3 active:scale-[0.99] transition-transform"
          >
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-white/15 flex items-center justify-center">
                <Sparkles className="text-white" size={20} />
              </div>
              <div>
                <p className="text-white font-bold text-[15px]">Spotlight</p>
                <p className="text-blue-100 text-xs">Turn an offering into a bookable, paid slot</p>
              </div>
            </div>
          </Link>

          <div className="grid grid-cols-2 gap-3">
            {SHARE_AND_COLLECT.map(({ icon: Icon, title, desc }) => (
              <Card key={title}>
                <div className="h-9 w-9 rounded-full bg-slate-100 flex items-center justify-center mb-3">
                  <Icon size={16} className="text-slate-700" />
                </div>
                <p className="font-bold text-slate-900 text-[14px]">{title}</p>
                <p className="text-xs text-slate-500 mt-1">{desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>
      <BottomNav />
    </>
  );
}

export default function ProductsPage() {
  return (
    <MobileShell>
      <RequireMerchant>
        <ProductsContent />
      </RequireMerchant>
    </MobileShell>
  );
}
