"use client";

import { ChefHat, LayoutDashboard, LogOut, Shield, Sparkles, UserRound, Utensils } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/components/auth-provider";

const navItems = [
  { href: "/dashboard", label: "Home", icon: LayoutDashboard },
  { href: "/spin", label: "Spin", icon: Sparkles },
  { href: "/planner", label: "Plan", icon: Utensils },
  { href: "/profile", label: "You", icon: UserRound }
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, signOut } = useAuth();

  return (
    <div className="min-h-screen pb-24 md:pb-0">
      <header className="sticky top-0 z-30 border-b border-white/60 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link href="/dashboard" className="flex items-center gap-2 font-black">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-rose-500 text-xl text-white shadow-soft">
              <ChefHat size={21} />
            </span>
            <span>Spin Bite</span>
          </Link>

          <nav className="hidden items-center gap-2 md:flex">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold transition ${
                    active ? "bg-slate-950 text-white" : "hover:bg-white"
                  }`}
                >
                  <Icon size={17} />
                  {item.label}
                </Link>
              );
            })}
            {user?.role === "admin" ? (
              <Link
                href="/admin"
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold transition ${
                  pathname === "/admin" ? "bg-slate-950 text-white" : "hover:bg-white"
                }`}
              >
                <Shield size={17} />
                Admin
              </Link>
            ) : null}
          </nav>

          <button
            onClick={signOut}
            className="grid h-10 w-10 place-items-center rounded-full bg-white text-slate-700 shadow-sm transition hover:bg-slate-950 hover:text-white"
            title="Sign out"
          >
            <LogOut size={18} />
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 md:py-9">{children}</main>

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-white/70 bg-white/90 px-3 py-2 backdrop-blur md:hidden">
        <div className="mx-auto grid max-w-md grid-cols-4 gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`grid place-items-center rounded-2xl px-2 py-2 text-xs font-black ${
                  active ? "bg-slate-950 text-white" : "text-slate-600"
                }`}
              >
                <Icon size={19} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
