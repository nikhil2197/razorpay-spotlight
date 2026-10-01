import type { ReactNode } from "react";

export function MobileShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-200/60 flex justify-center py-6 px-2">
      <div className="w-full max-w-[420px] min-h-[840px] bg-[#f4f5f7] rounded-[2.5rem] shadow-2xl border border-slate-300 overflow-hidden flex flex-col">
        <StatusBar />
        <div className="flex-1 flex flex-col overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}

function StatusBar() {
  return (
    <div className="flex items-center justify-between px-6 pt-3 pb-1 text-[13px] font-semibold text-slate-900 bg-[#f4f5f7]">
      <span>9:41</span>
      <div className="flex items-center gap-1 text-[11px]">
        <span>●●●●</span>
        <span>Wi-Fi</span>
      </div>
    </div>
  );
}
