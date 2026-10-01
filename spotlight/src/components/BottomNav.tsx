"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ArrowLeftRight, Grid2x2, HelpCircle, User } from "lucide-react";
import { cn } from "@/lib/utils";

const TABS = [
  { href: "/home", label: "Home", icon: Home },
  { href: "/payments", label: "Payments", icon: ArrowLeftRight },
  { href: "/products", label: "Products", icon: Grid2x2 },
  { href: "/support", label: "Support", icon: HelpCircle },
  { href: "/account", label: "Account", icon: User },
] as const;

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="sticky bottom-0 bg-white border-t border-slate-200 px-2 pt-2 pb-3 flex justify-between">
      {TABS.map(({ href, label, icon: Icon }) => {
        const active = pathname === href || (href === "/home" && pathname === "/");
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex-1 flex flex-col items-center gap-1 text-[11px] font-medium",
              active ? "text-blue-600" : "text-slate-500"
            )}
          >
            <Icon size={20} strokeWidth={2.2} />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
