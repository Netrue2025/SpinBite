"use client";

import { CalendarDays, RefreshCcw, Wand2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { useAuth } from "@/components/auth-provider";
import { ProtectedPage } from "@/components/protected-page";
import { mealTypes, weekdays } from "@/lib/constants";
import { findMeal } from "@/lib/recommendations";
import { getStoredMeals, getStoredPlans, saveStoredPlans } from "@/lib/storage";
import type { Meal, MealPlan, MealType } from "@/lib/types";

function dateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function weekDates() {
  const today = new Date();
  const monday = new Date(today);
  const day = today.getDay() || 7;
  monday.setDate(today.getDate() - day + 1);

  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + index);
    return dateKey(date);
  });
}

export default function PlannerPage() {
  const { user } = useAuth();
  const [meals, setMeals] = useState<Meal[]>([]);
  const [plans, setPlans] = useState<MealPlan[]>([]);

  const dates = useMemo(() => weekDates(), []);

  useEffect(() => {
    setMeals(getStoredMeals());
    setPlans(getStoredPlans());
  }, []);

  function mealFor(plan?: MealPlan) {
    return plan ? meals.find((meal) => meal.id === plan.mealId) : undefined;
  }

  function replaceMeal(date: string, mealType: MealType) {
    if (!user) {
      return;
    }

    const picked = findMeal(meals, {
      country: user.preferredCountry,
      tag: mealType === "breakfast" ? "quick" : mealType === "lunch" ? "healthy" : "cheap",
      mealType
    });

    if (!picked) {
      return;
    }

    const nextPlans = [
      ...plans.filter((plan) => !(plan.userId === user.id && plan.date === date && plan.mealType === mealType)),
      {
        id: `plan-${Date.now()}-${date}-${mealType}`,
        userId: user.id,
        mealId: picked.id,
        date,
        mealType,
        createdAt: new Date().toISOString()
      }
    ];

    setPlans(nextPlans);
    saveStoredPlans(nextPlans);
  }

  function fillWeek() {
    if (!user) {
      return;
    }

    const freshPlans = plans.filter(
      (plan) => !(plan.userId === user.id && dates.includes(plan.date) && mealTypes.includes(plan.mealType))
    );
    const generated = dates.flatMap((date) =>
      mealTypes.map((mealType) => {
        const picked = findMeal(meals, {
          country: user.preferredCountry,
          tag: mealType === "breakfast" ? "quick" : mealType === "lunch" ? "healthy" : "cheap",
          mealType
        });

        return {
          id: `plan-${Date.now()}-${date}-${mealType}`,
          userId: user.id,
          mealId: picked.id,
          date,
          mealType,
          createdAt: new Date().toISOString()
        };
      })
    );
    const nextPlans = [...freshPlans, ...generated];
    setPlans(nextPlans);
    saveStoredPlans(nextPlans);
  }

  return (
    <ProtectedPage>
      <AppShell>
        <section className="space-y-6">
          <div className="flex flex-col gap-4 rounded-[2rem] bg-white p-6 shadow-soft md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-wide text-rose-500">Meal planner</p>
              <h1 className="mt-2 text-4xl font-black">Breakfast, lunch, dinner</h1>
            </div>
            <button onClick={fillWeek} className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-6 py-4 font-black text-white">
              <Wand2 size={18} />
              Plan week
            </button>
          </div>

          <div className="grid gap-4">
            {dates.map((date, index) => (
              <article key={date} className="rounded-[2rem] bg-white p-4 shadow-soft">
                <div className="mb-3 flex items-center gap-2 font-black">
                  <CalendarDays size={18} className="text-emerald-600" />
                  {weekdays[index]} <span className="text-sm text-slate-500">{date}</span>
                </div>
                <div className="grid gap-3 md:grid-cols-3">
                  {mealTypes.map((mealType) => {
                    const plan = plans.find((item) => item.userId === user?.id && item.date === date && item.mealType === mealType);
                    const plannedMeal = mealFor(plan);

                    return (
                      <div key={mealType} className="rounded-[1.5rem] bg-slate-50 p-3">
                        <div className="mb-2 flex items-center justify-between gap-2">
                          <p className="font-black capitalize">{mealType}</p>
                          <button
                            onClick={() => replaceMeal(date, mealType)}
                            className="grid h-9 w-9 place-items-center rounded-full bg-white text-slate-800 shadow-sm"
                            title="Replace meal"
                          >
                            <RefreshCcw size={16} />
                          </button>
                        </div>
                        {plannedMeal ? (
                          <Link href={`/cook/${plannedMeal.id}`} className="block overflow-hidden rounded-2xl bg-white">
                            <img src={plannedMeal.imageUrl} alt={plannedMeal.name} className="h-28 w-full object-cover" />
                            <div className="p-3">
                              <p className="font-black">{plannedMeal.name}</p>
                              <p className="text-xs font-bold text-slate-500">{plannedMeal.country}</p>
                            </div>
                          </Link>
                        ) : (
                          <button
                            onClick={() => replaceMeal(date, mealType)}
                            className="grid h-40 w-full place-items-center rounded-2xl border-2 border-dashed border-slate-200 bg-white text-center text-sm font-black text-slate-500"
                          >
                            Add suggestion
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </article>
            ))}
          </div>
        </section>
      </AppShell>
    </ProtectedPage>
  );
}
