"use client";

import { CalendarPlus, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { useAuth } from "@/components/auth-provider";
import { MealCard } from "@/components/meal-card";
import { PlanPickerModal, type PlanSlot } from "@/components/plan-picker-modal";
import { ProtectedPage } from "@/components/protected-page";
import { SpinWheel } from "@/components/spin-wheel";
import { countries, tagOptions } from "@/lib/constants";
import { currentMealType, dateKey, isMealSlotPast, upsertPlan, weekDates } from "@/lib/planner-utils";
import { findMeal } from "@/lib/recommendations";
import { getStoredMeals, getStoredPlans, saveStoredPlans } from "@/lib/storage";
import type { Country, Meal, MealTag } from "@/lib/types";

function firstAvailableSlot(): PlanSlot {
  const dates = weekDates();
  const preferred: PlanSlot = { date: dateKey(new Date()), mealType: currentMealType() };

  if (!isMealSlotPast(preferred.date, preferred.mealType)) {
    return preferred;
  }

  for (const date of dates) {
    for (const mealType of ["breakfast", "lunch", "dinner"] as const) {
      if (!isMealSlotPast(date, mealType)) {
        return { date, mealType };
      }
    }
  }

  return { date: dates[dates.length - 1], mealType: "dinner" };
}

export default function SpinPage() {
  const { user } = useAuth();
  const [meals, setMeals] = useState<Meal[]>([]);
  const [country, setCountry] = useState<Country>("Nigeria");
  const [tag, setTag] = useState<MealTag>("quick");
  const [result, setResult] = useState<Meal | null>(null);
  const [spinning, setSpinning] = useState(false);
  const [addedMealId, setAddedMealId] = useState<string | null>(null);
  const [planPickerOpen, setPlanPickerOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<PlanSlot>(() => firstAvailableSlot());
  const [message, setMessage] = useState("");

  useEffect(() => {
    setMeals(getStoredMeals());
  }, []);

  useEffect(() => {
    if (user?.preferredCountry) {
      setCountry(user.preferredCountry);
    }
  }, [user?.preferredCountry]);

  function spin() {
    if (!meals.length || spinning) {
      return;
    }

    setSpinning(true);
    setAddedMealId(null);
    setMessage("");

    window.setTimeout(() => {
      const meal = findMeal(meals, { country, tag, mealType: "breakfast", previousMealId: result?.id });
      setResult(meal);
      setSpinning(false);
    }, 1500);
  }

  function openPlanPicker() {
    if (!result || !user) {
      setMessage("Sign in and spin a meal first.");
      return;
    }

    setSelectedSlot(firstAvailableSlot());
    setPlanPickerOpen(true);
  }

  function savePlanSlot() {
    if (!result || !user || isMealSlotPast(selectedSlot.date, selectedSlot.mealType)) {
      return;
    }

    const nextPlans = upsertPlan(getStoredPlans(), {
      id: `plan-${Date.now()}`,
      userId: user.id,
      mealId: result.id,
      date: selectedSlot.date,
      mealType: selectedSlot.mealType,
      createdAt: new Date().toISOString()
    });

    saveStoredPlans(nextPlans);
    setAddedMealId(result.id);
    setPlanPickerOpen(false);
    setMessage(`${result.name} was added to ${selectedSlot.date} ${selectedSlot.mealType}.`);
  }

  return (
    <ProtectedPage>
      <AppShell>
        <section className="grid gap-6 lg:grid-cols-[.95fr_1.05fr]">
          <div className="rounded-[2rem] bg-white p-5 shadow-soft md:p-7">
            <p className="text-sm font-black uppercase tracking-wide text-rose-500">Spin meal</p>
            <h1 className="mt-2 text-3xl font-black md:text-5xl">What would you like to eat today?</h1>

            <div className="mt-6 grid grid-cols-2 gap-3">
              {tagOptions.map((option) => (
                <button
                  type="button"
                  key={option.id}
                  onClick={() => setTag(option.id)}
                  className={`rounded-[1.5rem] px-4 py-5 text-xl font-black transition ${
                    tag === option.id ? "bg-slate-950 text-white shadow-soft" : "bg-amber-100 text-slate-950 hover:bg-amber-300"
                  }`}
                >
                  {option.icon} {option.label}
                </button>
              ))}
            </div>

            <label className="mt-5 block">
              <span className="text-sm font-black text-slate-700">Country / cuisine</span>
              <select
                value={country}
                onChange={(event) => setCountry(event.target.value as Country)}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 font-bold outline-none focus:border-emerald-500"
              >
                {countries.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>

            <button
              type="button"
              onClick={spin}
              disabled={spinning}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-rose-500 px-6 py-4 text-lg font-black text-white shadow-soft disabled:opacity-70"
            >
              <Sparkles size={20} />
              {spinning ? "Spinning..." : "Spin Meal"}
            </button>

            {message ? (
              <p className="mt-4 flex items-center gap-2 rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-black text-emerald-800">
                <CalendarPlus size={17} />
                {message}
              </p>
            ) : null}
          </div>

          <div className="space-y-5">
            <div className="rounded-[2rem] bg-white p-6 shadow-soft">
              <SpinWheel spinning={spinning} onSpin={spin} />
            </div>
            {result ? (
              <MealCard meal={result} onTryAgain={spin} onAddToPlan={openPlanPicker} addedToPlan={addedMealId === result.id} />
            ) : (
              <div className="rounded-[2rem] bg-white p-6 text-center shadow-soft">
                <p className="text-5xl">Meal</p>
                <h2 className="mt-3 text-2xl font-black">Your breakfast card will land here.</h2>
              </div>
            )}
          </div>
        </section>

        <PlanPickerModal
          meal={result}
          open={planPickerOpen}
          selected={selectedSlot}
          onSelect={setSelectedSlot}
          onClose={() => setPlanPickerOpen(false)}
          onSave={savePlanSlot}
        />
      </AppShell>
    </ProtectedPage>
  );
}
