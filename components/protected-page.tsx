"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/components/auth-provider";

export function ProtectedPage({
  adminOnly = false,
  children
}: {
  adminOnly?: boolean;
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const pathname = usePathname();

  if (loading) {
    return <div className="grid min-h-screen place-items-center px-6 text-lg font-bold">Loading meal magic...</div>;
  }

  if (!user) {
    return (
      <main className="grid min-h-screen place-items-center px-6">
        <div className="max-w-sm rounded-[2rem] bg-white p-6 text-center shadow-soft">
          <p className="text-5xl">🔒</p>
          <h1 className="mt-4 text-2xl font-black">Sign in first</h1>
          <p className="mt-2 text-sm text-slate-600">Spin Bite saves your picks, plans, and tiny victories.</p>
          <Link
            href={`/login?next=${encodeURIComponent(pathname)}`}
            className="mt-5 inline-flex rounded-full bg-slate-950 px-5 py-3 font-bold text-white"
          >
            Go to login
          </Link>
        </div>
      </main>
    );
  }

  if (adminOnly && user.role !== "admin") {
    return (
      <main className="grid min-h-screen place-items-center px-6">
        <div className="max-w-sm rounded-[2rem] bg-white p-6 text-center shadow-soft">
          <p className="text-5xl">🛡️</p>
          <h1 className="mt-4 text-2xl font-black">Admin only</h1>
          <p className="mt-2 text-sm text-slate-600">Use the demo admin login to explore the dashboard.</p>
          <Link href="/dashboard" className="mt-5 inline-flex rounded-full bg-emerald-500 px-5 py-3 font-bold text-white">
            Back home
          </Link>
        </div>
      </main>
    );
  }

  return <>{children}</>;
}
