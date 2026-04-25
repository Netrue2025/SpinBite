"use client";

import { ChefHat, Mail, Shield, Sparkles } from "lucide-react";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { useAuth } from "@/components/auth-provider";

export default function LoginPage() {
  const { signInWithGoogle, signInWithEmail, demoLogin, isSupabaseReady } = useAuth();
  const [email, setEmail] = useState("foodie@mealspin.app");
  const [password, setPassword] = useState("mealspin123");
  const [name, setName] = useState("Demo Foodie");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");

    try {
      await signInWithEmail(email, password, name);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not sign in.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="grid min-h-screen place-items-center px-4 py-8">
      <section className="grid w-full max-w-5xl overflow-hidden rounded-[2.5rem] bg-white shadow-soft md:grid-cols-[.9fr_1.1fr]">
        <div className="flex flex-col justify-between bg-slate-950 p-7 text-white">
          <div>
            <Link href="/" className="inline-flex items-center gap-2 font-black">
              <span className="grid h-10 w-10 place-items-center rounded-2xl bg-rose-500">
                <ChefHat size={20} />
              </span>
              Meal Spin
            </Link>
            <h1 className="mt-10 text-4xl font-black leading-tight">Get in. Spin food. Smile.</h1>
          </div>
          <p className="mt-10 rounded-3xl bg-white/10 p-4 text-sm leading-6 text-white/80">
            {isSupabaseReady
              ? "Supabase is configured. Google and email auth will use your project."
              : "Demo mode is on because Supabase keys are not set yet."}
          </p>
        </div>

        <div className="space-y-5 p-6 md:p-8">
          <button
            onClick={signInWithGoogle}
            className="flex w-full items-center justify-center gap-3 rounded-full bg-amber-400 px-5 py-4 font-black text-slate-950 transition hover:-translate-y-0.5"
          >
            <Sparkles size={19} />
            Continue with Google
          </button>

          <form onSubmit={submit} className="space-y-3">
            <label className="block">
              <span className="text-sm font-black text-slate-700">Name</span>
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500"
              />
            </label>
            <label className="block">
              <span className="text-sm font-black text-slate-700">Email</span>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500"
              />
            </label>
            <label className="block">
              <span className="text-sm font-black text-slate-700">Password</span>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500"
              />
            </label>
            {error ? <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700">{error}</p> : null}
            <button
              disabled={busy}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-slate-950 px-5 py-4 font-black text-white disabled:opacity-60"
            >
              <Mail size={18} />
              {busy ? "Signing in..." : "Sign in / Sign up"}
            </button>
          </form>

          <button
            onClick={() => demoLogin("admin")}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-emerald-500 px-5 py-4 font-black text-white"
          >
            <Shield size={18} />
            Demo admin
          </button>
        </div>
      </section>
    </main>
  );
}
