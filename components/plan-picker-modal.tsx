"use client";

import { CalendarPlus, X } from "lucide-react";
import { mealTypes, weekdays } from "@/lib/constants";
import { isMealSlotPast, weekDates } from "@/lib/planner-utils";
import type { Meal, MealType } from "@/lib/types";

export type PlanSlot = {
  date: string;
  mealType: MealType;
};

export function PlanPickerModal({
  meal,
  open,
  selected,
  onSelect,
  onClose,
  onSave
}: {
  meal: Meal | null;
  open: boolean;
  selected: PlanSlot;
  onSelect: (slot: PlanSlot) => void;
  onClose: () => void;
  onSave: () => void;
}) {
  if (!open || !meal) {
    return null;
  }

  const dates = weekDates();
  const selectedPast = isMealSlotPast(selected.date, selected.mealType);

  return (
    <div className="fixed inset-0 z-50 grid place-items-end bg-slate-950/45 p-0 backdrop-blur-sm md:place-items-center md:p-6">
      <section className="max-h-[92vh] w-full max-w-3xl overflow-auto rounded-t-[2rem] bg-white p-5 shadow-soft md:rounded-[2rem] md:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-black uppercase tracking-wide text-rose-500">Add to plan</p>
            <h2 className="mt-1 text-2xl font-black">{meal.name}</h2>
            <p className="mt-1 text-sm font-bold text-slate-500">Lunch starts at 11:30am.</p>
          </div>
          <button type="button" onClick={onClose} className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-slate-100">
            <X size={18} />
          </button>
        </div>

        <div className="mt-5 grid gap-3">
          {dates.map((date, index) => (
            <div key={date} className="rounded-3xl bg-slate-50 p-3">
              <p className="mb-2 font-black">
                {weekdays[index]} <span className="text-sm text-slate-500">{date}</span>
              </p>
              <div className="grid grid-cols-3 gap-2">
                {mealTypes.map((mealType) => {
                  const disabled = isMealSlotPast(date, mealType);
                  const active = selected.date === date && selected.mealType === mealType;

                  return (
                    <button
                      type="button"
                      key={mealType}
                      disabled={disabled}
                      onClick={() => onSelect({ date, mealType })}
                      className={`rounded-2xl px-3 py-3 text-sm font-black capitalize transition ${
                        active
                          ? "bg-slate-950 text-white"
                          : disabled
                            ? "cursor-not-allowed bg-slate-200 text-slate-400"
                            : "bg-white text-slate-900 hover:bg-amber-100"
                      }`}
                    >
                      {mealType}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {selectedPast ? (
          <p className="mt-4 rounded-2xl bg-rose-50 px-4 py-3 text-sm font-black text-rose-700">
            Pick a future slot. Past dates and meal times are locked.
          </p>
        ) : null}

        <div className="mt-5 grid gap-2 sm:grid-cols-[1fr_auto]">
          <button type="button" onClick={onClose} className="rounded-full bg-slate-100 px-5 py-4 font-black">
            Cancel
          </button>
          <button
            type="button"
            onClick={onSave}
            disabled={selectedPast}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-500 px-6 py-4 font-black text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            <CalendarPlus size={18} />
            Add meal
          </button>
        </div>
      </section>
    </div>
  );
}
