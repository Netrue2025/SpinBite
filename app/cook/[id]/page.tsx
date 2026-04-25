"use client";

import { CalendarPlus, Clock, Flame, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { useAuth } from "@/components/auth-provider";
import { PlanPickerModal, type PlanSlot } from "@/components/plan-picker-modal";
import { ProtectedPage } from "@/components/protected-page";
import { firstAvailablePlanSlot, isMealSlotPast, upsertPlan } from "@/lib/planner-utils";
import { getStoredMeals, getStoredPlans, getStoredRatings, saveStoredPlans, saveStoredRatings } from "@/lib/storage";
import type { Meal, MealRating } from "@/lib/types";

const ratings: Array<{ id: MealRating["rating"]; label: string }> = [
  { id: "loved", label: "Loved it" },
  { id: "good", label: "Good" },
  { id: "okay", label: "Okay" },
  { id: "not_for_me", label: "Not for me" }
];

export default function CookingGuidePage({ params }: { params: { id: string } }) {
  const { user } = useAuth();
  const [meal, setMeal] = useState<Meal | null>(null);
  const [selectedRating, setSelectedRating] = useState<MealRating["rating"] | null>(null);
  const [planPickerOpen, setPlanPickerOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<PlanSlot>(() => firstAvailablePlanSlot());
  const [message, setMessage] = useState("");

  useEffect(() => {
    const meals = getStoredMeals();
    setMeal(meals.find((item) => item.id === params.id) ?? null);

    if (user) {
      const savedRating = getStoredRatings().find((rating) => rating.userId === user.id && rating.mealId === params.id);
      setSelectedRating(savedRating?.rating ?? null);
    }
  }, [params.id, user]);

  function saveRating(rating: MealRating["rating"]) {
    if (!user || !meal) {
      return;
    }

    const allRatings = getStoredRatings();
    const nextRatings = [
      ...allRatings.filter((item) => !(item.userId === user.id && item.mealId === meal.id)),
      {
        id: `rating-${Date.now()}`,
        userId: user.id,
        mealId: meal.id,
        rating,
        createdAt: new Date().toISOString()
      }
    ];

    saveStoredRatings(nextRatings);
    setSelectedRating(rating);
    setMessage("Rating saved.");
  }

  function openPlanPicker() {
    if (!user || !meal) {
      setMessage("Sign in and choose a meal first.");
      return;
    }

    setSelectedSlot(firstAvailablePlanSlot());
    setPlanPickerOpen(true);
  }

  function savePlanSlot() {
    if (!user || !meal || isMealSlotPast(selectedSlot.date, selectedSlot.mealType)) {
      return;
    }

    const nextPlans = upsertPlan(getStoredPlans(), {
      id: `plan-${Date.now()}`,
      userId: user.id,
      mealId: meal.id,
      date: selectedSlot.date,
      mealType: selectedSlot.mealType,
      createdAt: new Date().toISOString()
    });

    saveStoredPlans(nextPlans);
    setPlanPickerOpen(false);
    setMessage(`${meal.name} was added to ${selectedSlot.date} ${selectedSlot.mealType}.`);
  }

  return (
    <ProtectedPage>
      <AppShell>
        {!meal ? (
          <div className="rounded-[2rem] bg-white p-8 text-center shadow-soft">
            <p className="text-5xl">Meal</p>
            <h1 className="mt-3 text-2xl font-black">Meal not found</h1>
          </div>
        ) : (
          <section className="grid gap-6 lg:grid-cols-[.9fr_1.1fr]">
            <div className="space-y-5">
              <div className="overflow-hidden rounded-[2rem] bg-white shadow-soft">
                <img src={meal.imageUrl} alt={meal.name} className="h-80 w-full object-cover" />
                <div className="p-5">
                  <p className="text-sm font-black uppercase tracking-wide text-rose-500">{meal.country}</p>
                  <h1 className="mt-2 text-4xl font-black">{meal.name}</h1>
                  <p className="mt-2 leading-7 text-slate-600">{meal.description}</p>
                  <div className="mt-4 grid grid-cols-2 gap-2 text-sm font-bold">
                    <span className="inline-flex items-center gap-2 rounded-2xl bg-emerald-50 px-3 py-2 text-emerald-900">
                      <Clock size={16} />
                      {meal.cookingTime}
                    </span>
                    <span className="inline-flex items-center gap-2 rounded-2xl bg-rose-50 px-3 py-2 text-rose-900">
                      <Flame size={16} />
                      {meal.difficulty}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={openPlanPicker}
                    className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-emerald-500 px-5 py-4 font-black text-white"
                  >
                    <CalendarPlus size={18} />
                    Add to plan
                  </button>
                </div>
              </div>

              <div className="overflow-hidden rounded-[2rem] bg-slate-950 p-3 shadow-soft">
                <iframe
                  className="aspect-video w-full rounded-[1.5rem]"
                  src={meal.videoUrl}
                  title={`${meal.name} cooking video`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>

            <div className="space-y-5">
              <div className="rounded-[2rem] bg-white p-6 shadow-soft">
                <h2 className="text-2xl font-black">Ingredients</h2>
                <ul className="mt-4 grid gap-2">
                  {meal.ingredients.map((ingredient) => (
                    <li key={ingredient} className="rounded-2xl bg-amber-50 px-4 py-3 font-bold text-amber-950">
                      {ingredient}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-[2rem] bg-white p-6 shadow-soft">
                <h2 className="text-2xl font-black">Steps</h2>
                <ol className="mt-4 space-y-3">
                  {meal.cookingSteps.map((step, index) => (
                    <li key={step} className="flex gap-3 rounded-2xl bg-slate-50 p-4 font-semibold leading-6">
                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-slate-950 text-sm font-black text-white">
                        {index + 1}
                      </span>
                      {step}
                    </li>
                  ))}
                </ol>
              </div>

              <div className="rounded-[2rem] bg-white p-6 shadow-soft">
                <h2 className="inline-flex items-center gap-2 text-2xl font-black">
                  <Star className="text-amber-500" />
                  Rate it
                </h2>
                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  {ratings.map((rating) => (
                    <button
                      type="button"
                      key={rating.id}
                      onClick={() => saveRating(rating.id)}
                      className={`rounded-2xl px-4 py-3 text-left font-black ${
                        selectedRating === rating.id ? "bg-slate-950 text-white" : "bg-slate-100 text-slate-900"
                      }`}
                    >
                      {rating.label}
                    </button>
                  ))}
                </div>
                {message ? <p className="mt-3 text-sm font-black text-emerald-700">{message}</p> : null}
              </div>
            </div>
          </section>
        )}

        <PlanPickerModal
          meal={meal}
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
