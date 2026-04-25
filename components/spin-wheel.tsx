"use client";

import { Sparkles } from "lucide-react";

export function SpinWheel({ spinning, onSpin }: { spinning: boolean; onSpin?: () => void }) {
  return (
    <div className="relative mx-auto grid h-64 w-64 place-items-center md:h-80 md:w-80">
      <div className="absolute -top-1 z-10 h-0 w-0 border-x-[14px] border-t-[28px] border-x-transparent border-t-slate-950" />
      <div
        className={`meal-wheel grid h-full w-full place-items-center rounded-full border-[12px] border-white shadow-soft ${
          spinning ? "animate-wheel-spin" : ""
        }`}
      >
        <button
          type="button"
          onClick={onSpin}
          disabled={spinning}
          className="grid h-24 w-24 place-items-center rounded-full bg-white text-slate-950 shadow-soft transition hover:scale-105 disabled:cursor-wait disabled:opacity-80"
          aria-label={spinning ? "Spinning meal wheel" : "Spin meal wheel"}
        >
          <Sparkles size={34} />
        </button>
      </div>
    </div>
  );
}
