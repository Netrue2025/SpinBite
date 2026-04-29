"use client";

import { BadgeDollarSign, CalendarDays, MapPin, Salad, Sparkles, Zap, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { ProtectedPage } from "@/components/protected-page";
import { useAuth } from "@/components/auth-provider";
import { countries } from "@/lib/constants";
import { initialMeals } from "@/lib/meals";
import { hasSupabaseConfig } from "@/lib/supabase";
import { loadMeals } from "@/lib/supabase-data";
import type { Country, Meal, MealTag } from "@/lib/types";

const quickPicks: Array<{ id: MealTag; label: string; icon: LucideIcon }> = [
  { id: "quick", label: "Quick", icon: Zap },
  { id: "healthy", label: "Healthy", icon: Salad },
  { id: "cheap", label: "Cheap", icon: BadgeDollarSign },
  { id: "local", label: "Local", icon: MapPin }
];

function spinHref(country: Country, tag: MealTag) {
  return `/spin?country=${encodeURIComponent(country)}&tag=${encodeURIComponent(tag)}`;
}

function choosePreview(meals: Meal[], country: Country, tag: MealTag) {
  return meals.find((meal) => meal.country === country && meal.tags.includes(tag)) ?? meals.find((meal) => meal.country === country) ?? meals[0] ?? null;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [meals, setMeals] = useState<Meal[]>(hasSupabaseConfig ? [] : initialMeals);
  const [country, setCountry] = useState<Country>(user?.preferredCountry ?? "Nigeria");
  const [tag, setTag] = useState<MealTag>("quick");

  useEffect(() => {
    let mounted = true;

    loadMeals()
      .then((items) => {
        if (mounted) {
          setMeals(items);
        }
      })
      .catch(() => {
        if (mounted && !hasSupabaseConfig) {
          setMeals(initialMeals);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (user?.preferredCountry) {
      setCountry(user.preferredCountry);
    }
  }, [user?.preferredCountry]);

  const featuredMeal = useMemo(() => choosePreview(meals, country, tag), [country, meals, tag]);
  const selectedTag = quickPicks.find((item) => item.id === tag)?.label ?? "Quick";

  return (
    <ProtectedPage>
      <AppShell>
        <section className="grid gap-4 md:grid-cols-[.82fr_1.18fr] md:items-start md:gap-6">
          <div className="rounded-[1.5rem] bg-white p-4 shadow-soft md:rounded-[1.75rem] md:p-5">
            <p className="text-xs font-black uppercase tracking-wide text-rose-500 md:text-sm">Hi {user?.name ?? "there"}</p>
            <h1 className="mt-2 text-balance text-3xl font-black leading-tight md:text-4xl">
              What would you like to eat today?
            </h1>

            <div className="mt-4 grid grid-cols-4 gap-2 md:grid-cols-2">
              {quickPicks.map((option) => {
                const Icon = option.icon;
                const active = tag === option.id;

                return (
                  <button
                    type="button"
                    key={option.id}
                    onClick={() => setTag(option.id)}
                    className={`grid place-items-center gap-1 rounded-2xl px-2 py-3 text-center text-xs font-black shadow-sm transition hover:-translate-y-1 md:px-3 md:py-4 md:text-sm ${
                      active ? "bg-slate-950 text-white" : "bg-amber-100 text-slate-950 hover:bg-amber-300"
                    }`}
                  >
                    <Icon size={18} />
                    {option.label}
                  </button>
                );
              })}
            </div>

            <label className="mt-4 block">
              <span className="text-xs font-black text-slate-700 md:text-sm">Country / cuisine</span>
              <select
                value={country}
                onChange={(event) => setCountry(event.target.value as Country)}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-3 py-3 text-sm font-bold outline-none focus:border-emerald-500"
              >
                {countries.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>

            <p className="mt-3 rounded-2xl bg-emerald-50 px-3 py-2 text-xs font-black text-emerald-800">
              Selected: {country === "Other" ? "Any cuisine" : country} with {selectedTag}
            </p>
          </div>

          <div className="grid gap-3">
            <Link href={spinHref(country, tag)} className="group overflow-hidden rounded-[1.5rem] bg-slate-950 text-white shadow-soft md:rounded-[1.75rem]">
              <div className="relative h-64 md:h-[26rem]">
                {featuredMeal ? (
                  <>
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
                      <span className="rounded-full bg-emerald-400 px-3 py-2 text-xs font-black text-slate-950">{country}</span>
                    </div>
                    <div className="absolute inset-x-0 bottom-0 p-5">
                      <p className="text-sm font-black uppercase tracking-wide text-amber-200">10-second meal picker</p>
                      <h2 className="mt-1 text-3xl font-black leading-tight md:text-5xl">{featuredMeal.name}</h2>
                      <p className="mt-2 max-w-xl text-sm font-semibold leading-6 text-white/85 md:text-base">{featuredMeal.description}</p>
                      <span className="mt-3 inline-flex rounded-full bg-white/95 px-4 py-2 text-xs font-black text-slate-950">
                        Spin this filter
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="grid h-full place-items-center p-6 text-center">
                    <div>
                      <Sparkles className="mx-auto text-amber-200" size={34} />
                      <h2 className="mt-4 text-3xl font-black">No Supabase meals yet</h2>
                      <p className="mt-2 text-sm font-semibold text-white/75">Run the seed SQL or add meals from the admin page.</p>
                    </div>
                  </div>
                )}
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
