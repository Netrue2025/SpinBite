"use client";

import { Clock, Utensils } from "lucide-react";
import { useEffect, useState } from "react";
import { initialMeals } from "@/lib/meals";
import { currentMealType, decodePlansCookie, plannedMealForNow, planCookieName } from "@/lib/planner-utils";
import { loadMeals } from "@/lib/supabase-data";
import type { Meal } from "@/lib/types";

function cookieValue(name: string) {
  if (typeof document === "undefined") {
    return "";
  }

  return (
    document.cookie
      .split("; ")
      .find((item) => item.startsWith(`${name}=`))
      ?.split("=")[1] ?? ""
  );
}

function randomMeal(meals: Meal[], previousId?: string) {
  const pool = meals.length > 1 ? meals.filter((meal) => meal.id !== previousId) : meals;
  return pool[Math.floor(Math.random() * pool.length)] ?? initialMeals[0];
}

export function LandingMealHero() {
  const [meals, setMeals] = useState<Meal[]>(initialMeals);
  const [meal, setMeal] = useState<Meal>(initialMeals[0]);
  const [isPlanned, setIsPlanned] = useState(false);
  const [slot, setSlot] = useState(currentMealType());

  useEffect(() => {
    let activeMeals = initialMeals;
    let mounted = true;

    function updateMeal() {
      const now = new Date();
      const plans = decodePlansCookie(cookieValue(planCookieName));
      const planned = plannedMealForNow(plans, activeMeals, now);

      setSlot(currentMealType(now));

      if (planned) {
        setMeal(planned);
        setIsPlanned(true);
        return;
      }

      setIsPlanned(false);
      setMeal((current) => randomMeal(activeMeals, current.id));
    }

    loadMeals()
      .then((loadedMeals) => {
        if (!mounted || !loadedMeals.length) {
          return;
        }

        activeMeals = loadedMeals;
        setMeals(loadedMeals);
        updateMeal();
      })
      .catch(() => {
        activeMeals = initialMeals;
        updateMeal();
      });

    const timer = window.setInterval(updateMeal, 20000);

    return () => {
      mounted = false;
      window.clearInterval(timer);
    };
  }, []);

  return (
    <div className="relative">
      <div className="absolute -left-4 top-8 z-10 animate-floaty rounded-3xl bg-white px-4 py-3 font-black shadow-soft">
        {isPlanned ? `${slot} planned` : "Fresh pick"}
      </div>
      <div className="overflow-hidden rounded-[2rem] bg-white shadow-soft">
        <img src={meal.imageUrl} alt={meal.name} className="h-80 w-full object-cover md:h-[32rem]" />
        <div className="space-y-3 p-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-2xl font-black">{meal.name}</h2>
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-black text-emerald-900">{meal.country}</span>
          </div>
          <p className="text-sm leading-6 text-slate-600">{meal.description}</p>
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="flex items-center gap-2 rounded-3xl bg-amber-100 p-3 font-black text-amber-950">
              <Utensils size={18} />
              {isPlanned ? "From your plan" : "Rotates every 20s"}
            </div>
            <div className="flex items-center gap-2 rounded-3xl bg-slate-100 p-3 font-black text-slate-900">
              <Clock size={18} />
              {slot}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
