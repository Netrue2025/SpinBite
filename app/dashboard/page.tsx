"use client";

import { BadgeDollarSign, CalendarDays, MapPin, Salad, Sparkles, Zap } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { ProtectedPage } from "@/components/protected-page";
import { useAuth } from "@/components/auth-provider";
import { initialMeals } from "@/lib/meals";
import { loadMeals } from "@/lib/supabase-data";
import type { Meal } from "@/lib/types";

const quickPicks = [
  { label: "Quick", icon: Zap },
  { label: "Healthy", icon: Salad },
  { label: "Cheap", icon: BadgeDollarSign },
  { label: "Local", icon: MapPin }
];

export default function DashboardPage() {
  const { user } = useAuth();
  const [featuredMeal, setFeaturedMeal] = useState<Meal>(initialMeals[1]);

  useEffect(() => {
    let mounted = true;

    loadMeals()
      .then((meals) => {
        if (mounted && meals.length) {
          const preferred = meals.find((meal) => meal.country === user?.preferredCountry);
          setFeaturedMeal(preferred ?? meals[0]);
        }
      })
      .catch(() => {
        if (mounted) {
          setFeaturedMeal(initialMeals[1]);
        }
      });

    return () => {
      mounted = false;
    };
  }, [user?.preferredCountry]);

  return (
    <ProtectedPage>
      <AppShell>
        <section className="grid gap-4 md:grid-cols-[.82fr_1.18fr] md:items-start md:gap-6">
          <div className="rounded-[1.5rem] bg-white p-4 shadow-soft md:rounded-[1.75rem] md:p-5">
            <p className="text-xs font-black uppercase tracking-wide text-rose-500 md:text-sm">Hi {user?.name}</p>
            <h1 className="mt-2 text-balance text-3xl font-black leading-tight md:text-4xl">
              What would you like to eat today?
            </h1>
            <div className="mt-4 grid grid-cols-4 gap-2 md:grid-cols-2">
              {quickPicks.map((option) => {
                const Icon = option.icon;

                return (
                  <Link
                    key={option.label}
                    href="/spin"
                    className="grid place-items-center gap-1 rounded-2xl bg-amber-100 px-2 py-3 text-center text-xs font-black shadow-sm transition hover:-translate-y-1 hover:bg-amber-300 md:px-3 md:py-4 md:text-sm"
                  >
                    <Icon size={18} />
                    {option.label}
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="grid gap-3">
            <Link href="/spin" className="group overflow-hidden rounded-[1.5rem] bg-slate-950 text-white shadow-soft md:rounded-[1.75rem]">
              <div className="relative h-64 md:h-[26rem]">
                <img
                  src={featuredMeal.imageUrl}
                  alt={featuredMeal.name}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/25 to-transparent" />
                <div className="absolute left-4 right-4 top-4 flex items-center justify-between gap-3">
                  <span className="inline-flex items-center gap-2 rounded-full bg-white/95 px-3 py-2 text-xs font-black text-slate-950">
                    <Sparkles size={15} />
                    Pick next meal
                  </span>
                  <span className="rounded-full bg-emerald-400 px-3 py-2 text-xs font-black text-slate-950">{featuredMeal.country}</span>
                </div>
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <p className="text-sm font-black uppercase tracking-wide text-amber-200">10-second meal picker</p>
                  <h2 className="mt-1 text-3xl font-black leading-tight md:text-5xl">{featuredMeal.name}</h2>
                  <p className="mt-2 max-w-xl text-sm font-semibold leading-6 text-white/85 md:text-base">{featuredMeal.description}</p>
                </div>
              </div>
            </Link>
            <Link
              href="/planner"
              className="flex items-center justify-between gap-3 rounded-[1.5rem] bg-emerald-500 p-4 font-black text-white shadow-soft md:rounded-[1.75rem] md:p-5"
            >
              <span className="inline-flex items-center gap-3">
                <CalendarDays size={24} />
                <span className="text-xl leading-tight md:text-2xl">Plan the whole week</span>
              </span>
              <span className="rounded-full bg-white/20 px-3 py-1 text-xs">Open</span>
            </Link>
          </div>
        </section>
      </AppShell>
    </ProtectedPage>
  );
}
