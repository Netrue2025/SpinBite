"use client";

import { Sparkles } from "lucide-react";

export function SpinWheel({ spinning, onSpin }: { spinning: boolean; onSpin?: () => void }) {
  return (
    <div className="relative mx-auto grid h-44 w-44 place-items-center sm:h-56 sm:w-56 md:h-80 md:w-80">
      <div className="absolute -top-1 z-10 h-0 w-0 border-x-[10px] border-t-[20px] border-x-transparent border-t-slate-950 md:border-x-[14px] md:border-t-[28px]" />
      <div
        className={`meal-wheel grid h-full w-full place-items-center rounded-full border-[8px] border-white shadow-soft md:border-[12px] ${
          spinning ? "animate-wheel-spin" : ""
        }`}
      >
        <button
          type="button"
          onClick={onSpin}
          disabled={spinning}
          className="grid h-16 w-16 place-items-center rounded-full bg-white text-slate-950 shadow-soft transition hover:scale-105 disabled:cursor-wait disabled:opacity-80 md:h-24 md:w-24"
          aria-label={spinning ? "Spinning meal wheel" : "Spin meal wheel"}
        >
          <Sparkles className="h-6 w-6 md:h-[34px] md:w-[34px]" />
        </button>
      </div>
    </div>
  );
}
