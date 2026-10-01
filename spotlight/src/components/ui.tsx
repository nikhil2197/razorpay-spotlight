import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("bg-white rounded-xl border border-slate-200 p-4", className)}>
      {children}
    </div>
  );
}

export function SectionLabel({ children }: { children: ReactNode }) {
  return <p className="text-[11px] font-semibold tracking-wide text-slate-500 uppercase mb-2">{children}</p>;
}

export function Badge({ children, tone = "neutral" }: { children: ReactNode; tone?: "neutral" | "green" | "blue" | "red" | "amber" }) {
  const tones: Record<string, string> = {
    neutral: "bg-slate-100 text-slate-700",
    green: "bg-emerald-100 text-emerald-700",
    blue: "bg-blue-100 text-blue-700",
    red: "bg-red-100 text-red-700",
    amber: "bg-amber-100 text-amber-700",
  };
  return <span className={cn("inline-block px-2 py-0.5 rounded-full text-[11px] font-semibold", tones[tone])}>{children}</span>;
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger" | "ghost";
};

export function Button({ variant = "primary", className, ...props }: ButtonProps) {
  const variants: Record<string, string> = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 disabled:bg-slate-300",
    secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200",
    danger: "bg-white text-red-600 border border-red-300 hover:bg-red-50",
    ghost: "bg-transparent text-blue-600 hover:bg-blue-50",
  };
  return (
    <button
      className={cn(
        "rounded-full px-4 py-2.5 text-sm font-semibold transition-colors disabled:cursor-not-allowed",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}

export function TopBar({ title, right }: { title: string; right?: ReactNode }) {
  return (
    <div className="flex items-center justify-between px-5 py-3">
      <h1 className="text-[22px] font-bold text-slate-900">{title}</h1>
      {right}
    </div>
  );
}
