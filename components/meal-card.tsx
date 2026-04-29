"use client";

import { Clock, Flame, PlusCircle, RotateCcw } from "lucide-react";
import Link from "next/link";
import type { Meal } from "@/lib/types";
import { tagLabel } from "@/lib/recommendations";

export function MealCard({
  meal,
  onTryAgain,
  onAddToPlan,
  addedToPlan = false,
  compact = false
}: {
  meal: Meal;
  onTryAgain?: () => void;
  onAddToPlan?: () => void;
  addedToPlan?: boolean;
  compact?: boolean;
}) {
  return (
    <article className={`animate-pop overflow-hidden bg-white shadow-soft ${compact ? "rounded-[1.35rem] md:rounded-[2rem]" : "rounded-[2rem]"}`}>
      <div className={compact ? "grid grid-cols-[6.75rem_1fr] md:block" : ""}>
        <div className={`relative ${compact ? "min-h-[10.75rem] md:h-60" : "h-60"}`}>
          <img src={meal.imageUrl} alt={meal.name} className="h-full w-full object-cover" />
          <div className={`absolute rounded-full bg-white/90 font-black ${compact ? "left-2 top-2 px-2 py-1 text-[10px] md:left-4 md:top-4 md:px-3 md:text-sm" : "left-4 top-4 px-3 py-1 text-sm"}`}>
            {meal.country}
          </div>
        </div>
        <div className={compact ? "space-y-2 p-3 md:space-y-4 md:p-5" : "space-y-4 p-5"}>
          <div>
            <h2 className={compact ? "text-lg font-black leading-tight md:text-2xl" : "text-2xl font-black"}>{meal.name}</h2>
            <p className={compact ? "mt-1 hidden text-sm leading-6 text-slate-600 md:block" : "mt-1 text-sm leading-6 text-slate-600"}>
              {meal.description}
            </p>
          </div>

          <div className={compact ? "hidden flex-wrap gap-2 md:flex" : "flex flex-wrap gap-2"}>
            {meal.tags.map((tag) => (
              <span key={tag} className="rounded-full bg-amber-100 px-3 py-1 text-xs font-black text-amber-900">
                {tagLabel(tag)}
              </span>
            ))}
          </div>

          <div className={compact ? "grid grid-cols-2 gap-2 text-xs font-bold md:text-sm" : "grid grid-cols-2 gap-2 text-sm font-bold"}>
            <span className="inline-flex items-center gap-1.5 rounded-2xl bg-emerald-50 px-2 py-2 text-emerald-900 md:gap-2 md:px-3">
              <Clock size={compact ? 14 : 16} />
              {meal.cookingTime}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-2xl bg-rose-50 px-2 py-2 text-rose-900 md:gap-2 md:px-3">
              <Flame size={compact ? 14 : 16} />
              {meal.difficulty}
            </span>
          </div>

          <div className={compact ? "grid grid-cols-3 gap-1.5 text-xs md:gap-2 md:text-base" : "grid gap-2 sm:grid-cols-3"}>
            {onTryAgain ? (
              <button
                type="button"
                onClick={onTryAgain}
                className="inline-flex items-center justify-center gap-1.5 rounded-full bg-slate-100 px-2 py-2 font-black md:gap-2 md:px-4 md:py-3"
              >
                <RotateCcw size={compact ? 14 : 17} />
                {compact ? "Again" : "Try Again"}
              </button>
            ) : null}
            {onAddToPlan ? (
              <button
                type="button"
                onClick={onAddToPlan}
                className={`inline-flex items-center justify-center gap-1.5 rounded-full px-2 py-2 font-black text-white transition md:gap-2 md:px-4 md:py-3 ${
                  addedToPlan ? "bg-emerald-700" : "bg-emerald-500 hover:bg-emerald-600"
                }`}
              >
                <PlusCircle size={compact ? 14 : 17} />
                {addedToPlan ? "Added" : compact ? "Plan" : "Add Plan"}
              </button>
            ) : null}
            <Link href={`/cook/${meal.id}`} className="inline-flex items-center justify-center rounded-full bg-slate-950 px-2 py-2 font-black text-white md:px-4 md:py-3">
              {compact ? "Cook" : "Cook Now"}
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
