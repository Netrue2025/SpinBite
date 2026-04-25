import { ArrowRight, ChefHat, Sparkles, Utensils } from "lucide-react";
import Link from "next/link";
import { initialMeals } from "@/lib/meals";

export default function LandingPage() {
  const heroMeal = initialMeals.find((meal) => meal.id === "nigeria-akara-pap") ?? initialMeals[0];

  return (
    <main className="min-h-screen">
      <section className="mx-auto grid min-h-screen max-w-6xl content-center gap-8 px-4 py-8 md:grid-cols-[1fr_.9fr] md:items-center">
        <div className="space-y-6">
          <Link href="/" className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 font-black shadow-sm">
            <ChefHat size={20} className="text-rose-500" />
            Meal Spin
          </Link>
          <div className="space-y-4">
            <h1 className="max-w-xl text-balance text-5xl font-black leading-tight text-slate-950 md:text-7xl">
              Meal Spin
            </h1>
            <p className="max-w-lg text-lg font-semibold leading-8 text-slate-700">
              Decide what to eat today in 10 seconds. Pick a vibe, spin the wheel, cook the winner.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-6 py-4 font-black text-white shadow-soft transition hover:-translate-y-0.5"
            >
              Start spinning
              <ArrowRight size={19} />
            </Link>
            <Link href="/spin" className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-4 font-black shadow-sm">
              Try demo
              <Sparkles size={18} className="text-amber-500" />
            </Link>
          </div>
          <div className="grid max-w-xl grid-cols-3 gap-3 pt-4">
            {["⚡ Quick", "🥗 Healthy", "💸 Cheap"].map((item) => (
              <div key={item} className="rounded-3xl bg-white/80 p-4 text-center text-sm font-black shadow-sm">
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="absolute -left-4 top-8 z-10 animate-floaty rounded-3xl bg-white px-4 py-3 font-black shadow-soft">
            Breakfast found
          </div>
          <div className="overflow-hidden rounded-[2.5rem] bg-white shadow-soft">
            <img src={heroMeal.imageUrl} alt={heroMeal.name} className="h-80 w-full object-cover md:h-[32rem]" />
            <div className="space-y-3 p-5">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-2xl font-black">{heroMeal.name}</h2>
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-black text-emerald-900">Nigeria</span>
              </div>
              <p className="text-sm leading-6 text-slate-600">{heroMeal.description}</p>
              <div className="flex items-center gap-2 rounded-3xl bg-amber-100 p-3 font-black text-amber-950">
                <Utensils size={18} />
                Spin. Pick. Eat.
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
