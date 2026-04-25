"use client";

import { ChefHat, LogIn, Mail, Sparkles, UserPlus } from "lucide-react";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { useAuth } from "@/components/auth-provider";

type AuthMode = "login" | "signup";

export default function LoginPage() {
  const { signInWithGoogle, signInWithEmail, signUpWithEmail, isSupabaseReady } = useAuth();
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");

    try {
      if (mode === "login") {
        await signInWithEmail(email, password);
      } else {
        await signUpWithEmail(name, email, password);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not continue.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="grid min-h-screen place-items-center px-4 py-8">
      <section className="grid w-full max-w-4xl overflow-hidden rounded-[2rem] bg-white shadow-soft md:grid-cols-[.85fr_1.15fr]">
        <div className="flex flex-col justify-between bg-slate-950 p-7 text-white">
          <div>
            <Link href="/" className="inline-flex items-center gap-2 font-black">
              <span className="grid h-10 w-10 place-items-center rounded-2xl bg-rose-500">
                <ChefHat size={20} />
              </span>
              Meal Spin
            </Link>
            <h1 className="mt-10 text-4xl font-black leading-tight">{mode === "login" ? "Welcome back." : "Create your plate."}</h1>
          </div>
          <p className="mt-10 rounded-3xl bg-white/10 p-4 text-sm leading-6 text-white/80">
            {isSupabaseReady ? "Use Google or email to continue." : "Local demo mode is active until Supabase keys are added."}
          </p>
        </div>

        <div className="space-y-5 p-6 md:p-8">
          <button
            type="button"
            onClick={signInWithGoogle}
            className="flex w-full items-center justify-center gap-3 rounded-full bg-amber-400 px-5 py-4 font-black text-slate-950 transition hover:-translate-y-0.5"
          >
            <Sparkles size={19} />
            Continue with Google
          </button>

          <div className="grid grid-cols-2 rounded-full bg-slate-100 p-1">
            {(["login", "signup"] as AuthMode[]).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => {
                  setMode(item);
                  setError("");
                }}
                className={`rounded-full px-4 py-3 text-sm font-black capitalize transition ${
                  mode === item ? "bg-slate-950 text-white" : "text-slate-600"
                }`}
              >
                {item === "login" ? "Log in" : "Sign up"}
              </button>
            ))}
          </div>

          <form onSubmit={submit} className="space-y-3">
            {mode === "signup" ? (
              <label className="block">
                <span className="text-sm font-black text-slate-700">Name</span>
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500"
                  autoComplete="name"
                />
              </label>
            ) : null}
            <label className="block">
              <span className="text-sm font-black text-slate-700">Email</span>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500"
                autoComplete="email"
              />
            </label>
            <label className="block">
              <span className="text-sm font-black text-slate-700">Password</span>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500"
                autoComplete={mode === "login" ? "current-password" : "new-password"}
              />
            </label>
            {error ? <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700">{error}</p> : null}
            <button
              disabled={busy}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-slate-950 px-5 py-4 font-black text-white disabled:opacity-60"
            >
              {mode === "login" ? <LogIn size={18} /> : <UserPlus size={18} />}
              {busy ? "Working..." : mode === "login" ? "Log in" : "Create account"}
            </button>
          </form>

          <button
            type="button"
            onClick={signInWithGoogle}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-emerald-500 px-5 py-4 font-black text-white"
          >
            <Mail size={18} />
            Use Google instead
          </button>
        </div>
      </section>
    </main>
  );
}
