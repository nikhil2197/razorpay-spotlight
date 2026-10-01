"use client";

import { MobileShell } from "@/components/MobileShell";
import { BottomNav } from "@/components/BottomNav";
import { RequireMerchant } from "@/components/RequireMerchant";
import { TopBar, Card } from "@/components/ui";

const TOPICS = [
  { title: "Activations", desc: "Issues regarding new account activation / API generation" },
  { title: "Account related assistance", desc: "Queries regarding Account configuration, funds and disputes" },
  { title: "Transaction & Settlement Related", desc: "Issues regarding refund payment settlement and daily transactions" },
  { title: "Spotlight", desc: "Queries regarding bookable offerings, slot inventory and refunds" },
];

function SupportContent() {
  return (
    <>
      <div className="flex-1">
        <TopBar title="Support" />
        <div className="px-5 flex flex-col gap-2">
          {TOPICS.map((t) => (
            <Card key={t.title}>
              <p className="font-bold text-slate-900 text-[14px]">{t.title}</p>
              <p className="text-xs text-slate-500 mt-1">{t.desc}</p>
            </Card>
          ))}
        </div>
      </div>
      <BottomNav />
    </>
  );
}

export default function SupportPage() {
  return (
    <MobileShell>
      <RequireMerchant>
        <SupportContent />
      </RequireMerchant>
    </MobileShell>
  );
}
