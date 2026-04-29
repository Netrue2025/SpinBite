"use client";

import { BadgeDollarSign, CalendarPlus, MapPin, Salad, Zap } from "lucide-react";
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
  const previewMeal = meals.find((meal) => meal.country === country) ?? meals[0];

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
        <section className="grid gap-3 lg:grid-cols-[.72fr_1.28fr] lg:gap-6">
          <div className="order-2 rounded-[1.5rem] bg-white p-4 shadow-soft md:rounded-[1.75rem] md:p-5 lg:order-1">
            <p className="text-xs font-black uppercase tracking-wide text-rose-500 md:text-sm">Spin meal</p>
            <h1 className="mt-1 text-2xl font-black leading-tight md:mt-2 md:text-4xl">What would you like to eat today?</h1>

            <div className="mt-4 grid grid-cols-4 gap-2 md:grid-cols-2">
              {tagOptions.map((option) => {
                const Icon = tagIcons[option.id];
                return (
                  <button
                    type="button"
                    key={option.id}
                    onClick={() => setTag(option.id)}
                    className={`grid place-items-center gap-1 rounded-2xl px-2 py-3 text-xs font-black transition md:flex md:justify-center md:gap-2 md:px-3 md:py-4 md:text-sm ${
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

            {message ? (
              <p className="mt-3 flex items-center gap-2 rounded-2xl bg-emerald-50 px-3 py-2 text-xs font-black text-emerald-800 md:mt-4 md:px-4 md:py-3 md:text-sm">
                <CalendarPlus size={17} />
                {message}
              </p>
            ) : null}
          </div>

          <div className="order-1 grid gap-3 lg:order-2">
            {result ? (
              <div>
                <MealCard meal={result} onTryAgain={spin} onAddToPlan={openPlanPicker} addedToPlan={addedMealId === result.id} />
              </div>
            ) : previewMeal ? (
              <div className="overflow-hidden rounded-[1.5rem] bg-slate-950 text-white shadow-soft md:rounded-[1.75rem]">
                <div className="relative h-72 md:h-[28rem]">
                  <img src={previewMeal.imageUrl} alt={previewMeal.name} className="h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/25 to-transparent" />
                  <div className="absolute left-4 right-4 top-4 flex items-center justify-between gap-3">
                    <span className="rounded-full bg-white/95 px-3 py-2 text-xs font-black text-slate-950">{previewMeal.country}</span>
                    <span className="rounded-full bg-amber-300 px-3 py-2 text-xs font-black text-slate-950">{spinning ? "Spinning..." : "Tap the wheel"}</span>
                  </div>
                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <p className="text-sm font-black uppercase tracking-wide text-amber-200">Ready for a pick</p>
                    <h2 className="mt-1 text-3xl font-black leading-tight md:text-5xl">{previewMeal.name}</h2>
                    <p className="mt-2 max-w-xl text-sm font-semibold leading-6 text-white/85 md:text-base">
                      Spin the wheel to choose your next meal.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-[1.5rem] bg-white p-5 text-center shadow-soft md:rounded-[1.75rem]">
                <h2 className="text-2xl font-black">Your meal card will land here.</h2>
              </div>
            )}
            <div className="rounded-[1.5rem] bg-white p-3 shadow-soft md:rounded-[1.75rem] md:p-4">
              <SpinWheel spinning={spinning} onSpin={spin} />
            </div>
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
