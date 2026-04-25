import { ArrowRight, ChefHat } from "lucide-react";
import Link from "next/link";
import { LandingMealHero } from "@/components/landing-meal-hero";

export default function LandingPage() {
  return (
    <main className="min-h-screen">
      <section className="mx-auto grid min-h-screen max-w-6xl content-center gap-8 px-4 py-8 md:grid-cols-[1fr_.9fr] md:items-center">
        <div className="space-y-6">
          <Link href="/" className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 font-black shadow-sm">
            <ChefHat size={20} className="text-rose-500" />
            Spin Bite
          </Link>
          <div className="space-y-4">
            <h1 className="max-w-xl text-balance text-5xl font-black leading-tight text-slate-950 md:text-7xl">Spin Bite</h1>
            <p className="max-w-lg text-lg font-semibold leading-8 text-slate-700">
              Decide what to eat today in 10 seconds.
            </p>
          </div>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-6 py-4 font-black text-white shadow-soft transition hover:-translate-y-0.5"
          >
            Start spinning
            <ArrowRight size={19} />
          </Link>
        </div>

        <LandingMealHero />
      </section>
    </main>
  );
}
