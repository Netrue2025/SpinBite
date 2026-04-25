"use client";

import { ArrowRight, CalendarDays, Sparkles } from "lucide-react";
import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { ProtectedPage } from "@/components/protected-page";
import { useAuth } from "@/components/auth-provider";

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <ProtectedPage>
      <AppShell>
        <section className="grid gap-6 md:grid-cols-[1.2fr_.8fr] md:items-center">
          <div className="rounded-[2rem] bg-white p-6 shadow-soft md:p-8">
            <p className="text-sm font-black uppercase tracking-wide text-rose-500">Hi {user?.name}</p>
            <h1 className="mt-3 text-balance text-4xl font-black leading-tight md:text-6xl">
              What would you like to eat today?
            </h1>
            <div className="mt-6 grid grid-cols-2 gap-3">
              {["⚡ Quick", "🥗 Healthy", "💸 Cheap", "🌍 Local"].map((option) => (
                <Link
                  key={option}
                  href="/spin"
                  className="rounded-[1.5rem] bg-amber-100 px-4 py-6 text-center text-xl font-black shadow-sm transition hover:-translate-y-1 hover:bg-amber-300"
                >
                  {option}
                </Link>
              ))}
            </div>
            <Link
              href="/spin"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-slate-950 px-6 py-4 font-black text-white"
            >
              Spin Meal
              <ArrowRight size={18} />
            </Link>
          </div>

          <div className="grid gap-4">
            <Link href="/spin" className="rounded-[2rem] bg-rose-500 p-6 font-black text-white shadow-soft">
              <Sparkles size={28} />
              <span className="mt-6 block text-3xl">10-second meal picker</span>
            </Link>
            <Link href="/planner" className="rounded-[2rem] bg-emerald-500 p-6 font-black text-white shadow-soft">
              <CalendarDays size={28} />
              <span className="mt-6 block text-3xl">Plan the whole week</span>
            </Link>
          </div>
        </section>
      </AppShell>
    </ProtectedPage>
  );
}
