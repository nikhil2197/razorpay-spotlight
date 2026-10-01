"use client";

import { useRouter } from "next/navigation";
import { Landmark, Globe, CreditCard, FileBadge, Bell, LogOut } from "lucide-react";
import { MobileShell } from "@/components/MobileShell";
import { BottomNav } from "@/components/BottomNav";
import { RequireMerchant } from "@/components/RequireMerchant";
import { TopBar, Card } from "@/components/ui";
import { useSpotlight } from "@/lib/store";

const SETTINGS = [
  { icon: Landmark, title: "Bank accounts and settlements", desc: "Bank account, Settlement cycle" },
  { icon: Globe, title: "Website and app", desc: "Website/App details, API keys, Webhooks" },
  { icon: CreditCard, title: "Payments and refunds", desc: "Balances, Credits, Fee bearer, Refund settings" },
  { icon: FileBadge, title: "Business details and GST", desc: "Business details, GST, Manage team" },
  { icon: Bell, title: "Notification", desc: "Email, SMS, WhatsApp" },
];

function AccountContent() {
  const { merchant, selectMerchant } = useSpotlight();
  const router = useRouter();
  if (!merchant) return null;

  return (
    <>
      <div className="flex-1">
        <TopBar title="Account and settings" />
        <div className="px-5">
          <Card className="flex items-center gap-3 mb-4">
            <div className="h-12 w-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
              {merchant.avatarInitials}
            </div>
            <div>
              <p className="font-bold text-slate-900">{merchant.name}</p>
              <p className="text-xs text-slate-500">Owner</p>
            </div>
          </Card>

          <div className="flex flex-col gap-2 mb-4">
            {SETTINGS.map(({ icon: Icon, title, desc }) => (
              <Card key={title} className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                  <Icon size={16} className="text-slate-700" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{title}</p>
                  <p className="text-xs text-slate-500">{desc}</p>
                </div>
              </Card>
            ))}
          </div>

          <button
            onClick={() => {
              selectMerchant("");
              router.replace("/");
            }}
            className="w-full flex items-center justify-center gap-2 text-red-600 font-semibold text-sm bg-white rounded-xl border border-slate-200 py-3"
          >
            <LogOut size={16} /> Switch merchant
          </button>

          <p className="text-center text-[11px] text-slate-400 mt-4">Made with ❤️ in Bengaluru 🇮🇳 · Spotlight prototype</p>
        </div>
      </div>
      <BottomNav />
    </>
  );
}

export default function AccountPage() {
  return (
    <MobileShell>
      <RequireMerchant>
        <AccountContent />
      </RequireMerchant>
    </MobileShell>
  );
}
