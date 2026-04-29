"use client";

import { BadgeDollarSign, CalendarPlus, MapPin, Salad, Sparkles, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { useAuth } from "@/components/auth-provider";
import { MealCard } from "@/components/meal-card";
import { PlanPickerModal, type PlanSlot } from "@/components/plan-picker-modal";
import { ProtectedPage } from "@/components/protected-page";
import { SpinWheel } from "@/components/spin-wheel";
import { countries, tagOptions } from "@/lib/constants";
import { firstAvailablePlanSlot, isMealSlotPast } from "@/lib/planner-utils";
import { findMeal } from "@/lib/recommendations";
import { loadMeals, savePlan } from "@/lib/supabase-data";
import type { Country, Meal, MealTag } from "@/lib/types";
import { playWheelSound } from "@/lib/wheel-sound";

const tagIcons = {
  quick: Zap,
  healthy: Salad,
  cheap: BadgeDollarSign,
  local: MapPin
};

export default function SpinPage() {
  const { user } = useAuth();
  const [meals, setMeals] = useState<Meal[]>([]);
  const [country, setCountry] = useState<Country>("Nigeria");
  const [tag, setTag] = useState<MealTag>("quick");
  const [result, setResult] = useState<Meal | null>(null);
  const [spinning, setSpinning] = useState(false);
  const [addedMealId, setAddedMealId] = useState<string | null>(null);
  const [planPickerOpen, setPlanPickerOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<PlanSlot>(() => firstAvailablePlanSlot());
  const [message, setMessage] = useState("");

  useEffect(() => {
    let mounted = true;

    loadMeals()
      .then((items) => {
        if (mounted) {
          setMeals(items);
          setMessage(items.length ? "" : "No meals were found in Supabase. Add meals from the admin page or run the seed SQL.");
        }
      })
      .catch((error) => {
        if (mounted) {
          setMessage(error instanceof Error ? error.message : "Could not load meals from Supabase.");
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

  function spin() {
    if (!meals.length || spinning) {
      return;
    }

    setSpinning(true);
    setAddedMealId(null);
    setMessage("");
    playWheelSound();

    window.setTimeout(() => {
      const meal = findMeal(meals, { country, tag, previousMealId: result?.id });
      setResult(meal);
      setSpinning(false);
    }, 1500);
  }

  function openPlanPicker() {
    if (!result || !user) {
      setMessage("Sign in and spin a meal first.");
      return;
    }

    setSelectedSlot(firstAvailablePlanSlot());
    setPlanPickerOpen(true);
  }

  async function savePlanSlot() {
    if (!result || !user || isMealSlotPast(selectedSlot.date, selectedSlot.mealType)) {
      return;
    }

    try {
      await savePlan({
        id: `plan-${Date.now()}`,
        userId: user.id,
        mealId: result.id,
        date: selectedSlot.date,
        mealType: selectedSlot.mealType,
        createdAt: new Date().toISOString()
      });

      setAddedMealId(result.id);
      setPlanPickerOpen(false);
      setMessage(`${result.name} was added to ${selectedSlot.date} ${selectedSlot.mealType}.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not save your plan.");
    }
  }

  return (
    <ProtectedPage>
      <AppShell>
        <section className="grid gap-3 lg:grid-cols-[.95fr_1.05fr] lg:gap-6">
          <div className="order-2 rounded-[1.5rem] bg-white p-4 shadow-soft md:rounded-[2rem] md:p-7 lg:order-1">
            <p className="text-xs font-black uppercase tracking-wide text-rose-500 md:text-sm">Spin meal</p>
            <h1 className="mt-1 text-2xl font-black leading-tight md:mt-2 md:text-5xl">What would you like to eat today?</h1>

            <div className="mt-4 grid grid-cols-4 gap-2 md:mt-6 md:grid-cols-2 md:gap-3">
              {tagOptions.map((option) => {
                const Icon = tagIcons[option.id];
                return (
                  <button
                    type="button"
                    key={option.id}
                    onClick={() => setTag(option.id)}
                    className={`grid place-items-center gap-1 rounded-2xl px-2 py-3 text-xs font-black transition md:flex md:justify-center md:gap-2 md:rounded-[1.5rem] md:px-4 md:py-5 md:text-xl ${
                      tag === option.id ? "bg-slate-950 text-white shadow-soft" : "bg-amber-100 text-slate-950 hover:bg-amber-300"
                    }`}
                  >
                    <Icon size={18} />
                    {option.label}
                  </button>
                );
              })}
            </div>

            <label className="mt-4 block md:mt-5">
              <span className="text-xs font-black text-slate-700 md:text-sm">Country / cuisine</span>
              <select
                value={country}
                onChange={(event) => setCountry(event.target.value as Country)}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-3 py-3 text-sm font-bold outline-none focus:border-emerald-500 md:px-4 md:py-4 md:text-base"
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
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-rose-500 px-5 py-3 text-base font-black text-white shadow-soft disabled:opacity-70 md:mt-5 md:px-6 md:py-4 md:text-lg"
            >
              <Sparkles size={20} />
              {spinning ? "Spinning..." : "Spin Meal"}
            </button>

            {message ? (
              <p className="mt-3 flex items-center gap-2 rounded-2xl bg-emerald-50 px-3 py-2 text-xs font-black text-emerald-800 md:mt-4 md:px-4 md:py-3 md:text-sm">
                <CalendarPlus size={17} />
                {message}
              </p>
            ) : null}
          </div>

          <div className="order-1 grid gap-3 lg:order-2 lg:gap-5">
            <div className="order-2 rounded-[1.5rem] bg-white p-3 shadow-soft md:rounded-[2rem] md:p-6 lg:order-1">
              <SpinWheel spinning={spinning} onSpin={spin} />
            </div>
            {result ? (
              <div className="order-1 lg:order-2">
                <MealCard meal={result} onTryAgain={spin} onAddToPlan={openPlanPicker} addedToPlan={addedMealId === result.id} compact />
              </div>
            ) : (
              <div className="order-1 rounded-[1.5rem] bg-white p-4 text-center shadow-soft md:rounded-[2rem] md:p-6 lg:order-2">
                <p className="text-3xl md:text-5xl">Meal</p>
                <h2 className="mt-2 text-xl font-black md:mt-3 md:text-2xl">Your meal card will land here.</h2>
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
