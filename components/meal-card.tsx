"use client";

import { Clock, Flame, PlusCircle, RotateCcw } from "lucide-react";
import Link from "next/link";
import type { Meal } from "@/lib/types";
import { tagLabel } from "@/lib/recommendations";

export function MealCard({
  meal,
  onTryAgain,
  onAddToPlan,
  addedToPlan = false
}: {
  meal: Meal;
  onTryAgain?: () => void;
  onAddToPlan?: () => void;
  addedToPlan?: boolean;
}) {
  return (
    <article className="animate-pop overflow-hidden rounded-[2rem] bg-white shadow-soft">
      <div className="relative h-60">
        <img src={meal.imageUrl} alt={meal.name} className="h-full w-full object-cover" />
        <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-sm font-black">{meal.country}</div>
      </div>
      <div className="space-y-4 p-5">
        <div>
          <h2 className="text-2xl font-black">{meal.name}</h2>
          <p className="mt-1 text-sm leading-6 text-slate-600">{meal.description}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {meal.tags.map((tag) => (
            <span key={tag} className="rounded-full bg-amber-100 px-3 py-1 text-xs font-black text-amber-900">
              {tagLabel(tag)}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-2 text-sm font-bold">
          <span className="inline-flex items-center gap-2 rounded-2xl bg-emerald-50 px-3 py-2 text-emerald-900">
            <Clock size={16} />
            {meal.cookingTime}
          </span>
          <span className="inline-flex items-center gap-2 rounded-2xl bg-rose-50 px-3 py-2 text-rose-900">
            <Flame size={16} />
            {meal.difficulty}
          </span>
        </div>

        <div className="grid gap-2 sm:grid-cols-3">
          {onTryAgain ? (
            <button
              type="button"
              onClick={onTryAgain}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-100 px-4 py-3 font-black"
            >
              <RotateCcw size={17} />
              Try Again
            </button>
          ) : null}
          {onAddToPlan ? (
            <button
              type="button"
              onClick={onAddToPlan}
              className={`inline-flex items-center justify-center gap-2 rounded-full px-4 py-3 font-black text-white transition ${
                addedToPlan ? "bg-emerald-700" : "bg-emerald-500 hover:bg-emerald-600"
              }`}
            >
              <PlusCircle size={17} />
              {addedToPlan ? "Added" : "Add Plan"}
            </button>
          ) : null}
          <Link href={`/cook/${meal.id}`} className="inline-flex items-center justify-center rounded-full bg-slate-950 px-4 py-3 font-black text-white">
            Cook Now
          </Link>
        </div>
      </div>
    </article>
  );
}
