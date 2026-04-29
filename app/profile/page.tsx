"use client";

import { Save, Shield, UserRound } from "lucide-react";
import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { useAuth } from "@/components/auth-provider";
import { ProtectedPage } from "@/components/protected-page";
import { countries } from "@/lib/constants";
import type { Country } from "@/lib/types";

export default function ProfilePage() {
  const { user, updateProfile, isSupabaseReady } = useAuth();
  const [name, setName] = useState("");
  const [preferredCountry, setPreferredCountry] = useState<Country>("Nigeria");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setPreferredCountry(user.preferredCountry);
    }
  }, [user]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      await updateProfile({ name, preferredCountry });
      setSaved(true);
    } catch {
      setSaved(false);
    }
  }

  return (
    <ProtectedPage>
      <AppShell>
        <section className="mx-auto max-w-2xl rounded-[2rem] bg-white p-6 shadow-soft">
          <div className="flex items-center gap-3">
            <span className="grid h-14 w-14 place-items-center rounded-2xl bg-amber-300">
              <UserRound size={25} />
            </span>
            <div>
              <p className="text-sm font-black uppercase tracking-wide text-rose-500">Profile</p>
              <h1 className="text-3xl font-black">Preferences</h1>
            </div>
          </div>

          <form onSubmit={submit} className="mt-6 space-y-4">
            {user?.role === "admin" ? (
              <Link
                href="/admin"
                className="flex items-center justify-between gap-3 rounded-3xl bg-slate-950 p-4 font-black text-white shadow-soft"
              >
                <span className="inline-flex items-center gap-2">
                  <Shield size={19} />
                  Admin dashboard
                </span>
                <span className="text-sm text-white/70">Open</span>
              </Link>
            ) : null}

            <label className="block">
              <span className="text-sm font-black text-slate-700">Name</span>
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500"
              />
            </label>
            <label className="block">
              <span className="text-sm font-black text-slate-700">Favorite country / cuisine</span>
              <select
                value={preferredCountry}
                onChange={(event) => setPreferredCountry(event.target.value as Country)}
                className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-emerald-500"
              >
                {countries.map((country) => (
                  <option key={country}>{country}</option>
                ))}
              </select>
            </label>
            <div className="rounded-2xl bg-slate-50 p-4 text-sm font-bold text-slate-600">
              Auth mode: {isSupabaseReady ? "Supabase" : "Local demo"}
            </div>
            <button className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-slate-950 px-6 py-4 font-black text-white">
              <Save size={18} />
              Save preferences
            </button>
            {saved ? <p className="text-sm font-black text-emerald-700">Saved.</p> : null}
          </form>
        </section>
      </AppShell>
    </ProtectedPage>
  );
}
