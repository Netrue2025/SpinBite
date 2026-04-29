"use client";

import { ImagePlus, Pencil, Plus, Save, Shield, Trash2, UsersRound } from "lucide-react";
import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { ProtectedPage } from "@/components/protected-page";
import { countries, mealTypes, tagOptions } from "@/lib/constants";
import { loadMeals, loadPlans, loadRatings, loadUsers, removeMeal, saveMeal } from "@/lib/supabase-data";
import { hasSupabaseConfig, supabase } from "@/lib/supabase";
import type { AppUser, Country, Difficulty, Meal, MealPlan, MealRating, MealTag, MealType } from "@/lib/types";

type MealForm = {
  id?: string;
  name: string;
  description: string;
  country: Country;
  mealType: MealType;
  imageUrl: string;
  videoUrl: string;
  ingredients: string;
  cookingSteps: string;
  cookingTime: string;
  difficulty: Difficulty;
  tags: MealTag[];
};

const emptyForm: MealForm = {
  name: "",
  description: "",
  country: "Nigeria",
  mealType: "breakfast",
  imageUrl: "",
  videoUrl: "",
  ingredients: "",
  cookingSteps: "",
  cookingTime: "15 min",
  difficulty: "Easy",
  tags: ["quick"]
};

export default function AdminPage() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [form, setForm] = useState<MealForm>(emptyForm);
  const [users, setUsers] = useState<AppUser[]>([]);
  const [ratings, setRatings] = useState<MealRating[]>([]);
  const [plans, setPlans] = useState<MealPlan[]>([]);
  const [imageStatus, setImageStatus] = useState("");
  const [dataStatus, setDataStatus] = useState("");

  useEffect(() => {
    let mounted = true;

    Promise.all([loadMeals(), loadUsers(), loadRatings(), loadPlans()])
      .then(([mealItems, userItems, ratingItems, planItems]) => {
        if (mounted) {
          setMeals(mealItems);
          setUsers(userItems);
          setRatings(ratingItems);
          setPlans(planItems);
        }
      })
      .catch((error) => {
        if (mounted) {
          setDataStatus(error instanceof Error ? error.message : "Could not load admin data from Supabase.");
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  const mostSelected = useMemo(() => {
    return meals
      .map((meal) => ({
        meal,
        count: plans.filter((plan) => plan.mealId === meal.id).length
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);
  }, [meals, plans]);

  function updateForm<K extends keyof MealForm>(key: K, value: MealForm[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function toggleTag(tag: MealTag) {
    setForm((current) => ({
      ...current,
      tags: current.tags.includes(tag) ? current.tags.filter((item) => item !== tag) : [...current.tags, tag]
    }));
  }

  function editMeal(meal: Meal) {
    setForm({
      id: meal.id,
      name: meal.name,
      description: meal.description,
      country: meal.country,
      mealType: meal.mealType,
      imageUrl: meal.imageUrl,
      videoUrl: meal.videoUrl,
      ingredients: meal.ingredients.join("\n"),
      cookingSteps: meal.cookingSteps.join("\n"),
      cookingTime: meal.cookingTime,
      difficulty: meal.difficulty,
      tags: meal.tags
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function deleteMeal(id: string) {
    try {
      await removeMeal(id);
      setMeals((current) => current.filter((meal) => meal.id !== id));
      setDataStatus("");
    } catch (error) {
      setDataStatus(error instanceof Error ? error.message : "Could not delete meal from Supabase.");
    }
  }

  async function onImageUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    if (hasSupabaseConfig && supabase) {
      setImageStatus("Uploading...");
      const path = `meals/${Date.now()}-${file.name}`;
      const { error } = await supabase.storage.from("meal-images").upload(path, file, { upsert: true });

      if (!error) {
        const { data } = supabase.storage.from("meal-images").getPublicUrl(path);
        updateForm("imageUrl", data.publicUrl);
        setImageStatus("Uploaded to Supabase Storage.");
        return;
      }

      setImageStatus("Storage upload failed, using local preview.");
    }

    const reader = new FileReader();
    reader.onload = () => {
      updateForm("imageUrl", String(reader.result));
    };
    reader.readAsDataURL(file);
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const meal: Meal = {
      id: form.id ?? `meal-${Date.now()}`,
      name: form.name,
      description: form.description,
      country: form.country,
      mealType: form.mealType,
      imageUrl: form.imageUrl,
      videoUrl: form.videoUrl,
      ingredients: form.ingredients.split("\n").map((item) => item.trim()).filter(Boolean),
      cookingSteps: form.cookingSteps.split("\n").map((item) => item.trim()).filter(Boolean),
      cookingTime: form.cookingTime,
      difficulty: form.difficulty,
      tags: form.tags.length ? form.tags : ["quick"],
      createdAt: new Date().toISOString()
    };

    try {
      const savedMeal = await saveMeal(meal);
      setMeals((current) =>
        current.some((item) => item.id === savedMeal.id)
          ? current.map((item) => (item.id === savedMeal.id ? savedMeal : item))
          : [savedMeal, ...current]
      );
      setForm(emptyForm);
      setDataStatus("");
    } catch (error) {
      setDataStatus(error instanceof Error ? error.message : "Could not save meal to Supabase.");
    }
  }

  return (
    <ProtectedPage adminOnly>
      <AppShell>
        <section className="space-y-6">
          <div className="rounded-[2rem] bg-slate-950 p-6 text-white shadow-soft">
            <div className="flex items-center gap-3">
              <Shield className="text-amber-300" />
              <div>
                <p className="text-sm font-black uppercase tracking-wide text-amber-300">Secure admin</p>
                <h1 className="text-4xl font-black">Spin Bite Control Room</h1>
              </div>
            </div>
          </div>
          {dataStatus ? <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm font-black text-rose-700">{dataStatus}</p> : null}

          <div className="grid gap-6 xl:grid-cols-[.9fr_1.1fr]">
            <form onSubmit={submit} className="space-y-4 rounded-[2rem] bg-white p-5 shadow-soft">
              <h2 className="text-2xl font-black">{form.id ? "Edit meal" : "Add new meal"}</h2>
              <input
                required
                value={form.name}
                onChange={(event) => updateForm("name", event.target.value)}
                placeholder="Food name"
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500"
              />
              <textarea
                required
                value={form.description}
                onChange={(event) => updateForm("description", event.target.value)}
                placeholder="Short description"
                className="min-h-24 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500"
              />
              <div className="grid gap-3 sm:grid-cols-2">
                <select
                  value={form.country}
                  onChange={(event) => updateForm("country", event.target.value as Country)}
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-3 font-bold outline-none"
                >
                  {countries.map((country) => (
                    <option key={country}>{country}</option>
                  ))}
                </select>
                <select
                  value={form.mealType}
                  onChange={(event) => updateForm("mealType", event.target.value as MealType)}
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-3 font-bold capitalize outline-none"
                >
                  {mealTypes.map((mealType) => (
                    <option key={mealType}>{mealType}</option>
                  ))}
                </select>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <input
                  required
                  value={form.imageUrl}
                  onChange={(event) => updateForm("imageUrl", event.target.value)}
                  placeholder="Food image URL"
                  className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500"
                />
                <label className="flex cursor-pointer items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-300 px-4 py-3 font-black">
                  <ImagePlus size={18} />
                  Upload image
                  <input type="file" accept="image/*" onChange={onImageUpload} className="hidden" />
                </label>
              </div>
              {imageStatus ? <p className="text-sm font-bold text-emerald-700">{imageStatus}</p> : null}
              <input
                required
                value={form.videoUrl}
                onChange={(event) => updateForm("videoUrl", event.target.value)}
                placeholder="Embedded video URL"
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500"
              />
              <div className="grid gap-3 sm:grid-cols-2">
                <input
                  value={form.cookingTime}
                  onChange={(event) => updateForm("cookingTime", event.target.value)}
                  placeholder="Cooking time"
                  className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500"
                />
                <select
                  value={form.difficulty}
                  onChange={(event) => updateForm("difficulty", event.target.value as Difficulty)}
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-3 font-bold outline-none"
                >
                  {["Easy", "Medium", "Bold"].map((difficulty) => (
                    <option key={difficulty}>{difficulty}</option>
                  ))}
                </select>
              </div>
              <textarea
                required
                value={form.ingredients}
                onChange={(event) => updateForm("ingredients", event.target.value)}
                placeholder="Ingredients, one per line"
                className="min-h-28 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500"
              />
              <textarea
                required
                value={form.cookingSteps}
                onChange={(event) => updateForm("cookingSteps", event.target.value)}
                placeholder="Cooking steps, one per line"
                className="min-h-28 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500"
              />
              <div className="grid grid-cols-2 gap-2">
                {tagOptions.map((option) => (
                  <label
                    key={option.id}
                    className={`rounded-2xl px-4 py-3 font-black ${
                      form.tags.includes(option.id) ? "bg-slate-950 text-white" : "bg-slate-100 text-slate-800"
                    }`}
                  >
                    <input type="checkbox" checked={form.tags.includes(option.id)} onChange={() => toggleTag(option.id)} className="sr-only" />
                    {option.icon} {option.label}
                  </label>
                ))}
              </div>
              <button className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-emerald-500 px-6 py-4 font-black text-white">
                {form.id ? <Save size={18} /> : <Plus size={18} />}
                {form.id ? "Save meal" : "Add meal"}
              </button>
            </form>

            <div className="space-y-5">
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-[1.5rem] bg-white p-5 shadow-soft">
                  <p className="text-sm font-black text-slate-500">Meals</p>
                  <p className="text-4xl font-black">{meals.length}</p>
                </div>
                <div className="rounded-[1.5rem] bg-white p-5 shadow-soft">
                  <p className="text-sm font-black text-slate-500">Users</p>
                  <p className="text-4xl font-black">{users.length}</p>
                </div>
                <div className="rounded-[1.5rem] bg-white p-5 shadow-soft">
                  <p className="text-sm font-black text-slate-500">Ratings</p>
                  <p className="text-4xl font-black">{ratings.length}</p>
                </div>
              </div>

              <div className="rounded-[2rem] bg-white p-5 shadow-soft">
                <h2 className="mb-4 text-2xl font-black">All meals</h2>
                <div className="max-h-[32rem] space-y-3 overflow-auto pr-1">
                  {meals.map((meal) => (
                    <article key={meal.id} className="grid grid-cols-[5rem_1fr_auto] gap-3 rounded-2xl bg-slate-50 p-3">
                      <img src={meal.imageUrl} alt={meal.name} className="h-20 w-20 rounded-2xl object-cover" />
                      <div>
                        <p className="font-black">{meal.name}</p>
                        <p className="text-sm font-bold capitalize text-slate-500">
                          {meal.country} · {meal.mealType}
                        </p>
                        <p className="mt-1 text-xs font-bold text-slate-500">{meal.tags.join(", ")}</p>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => editMeal(meal)} className="grid h-10 w-10 place-items-center rounded-full bg-white shadow-sm" title="Edit meal">
                          <Pencil size={16} />
                        </button>
                        <button onClick={() => deleteMeal(meal.id)} className="grid h-10 w-10 place-items-center rounded-full bg-rose-100 text-rose-700" title="Delete meal">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="rounded-[2rem] bg-white p-5 shadow-soft">
              <h2 className="inline-flex items-center gap-2 text-2xl font-black">
                <UsersRound size={22} />
                Users
              </h2>
              <div className="mt-4 space-y-2">
                {users.map((user) => (
                  <div key={user.id} className="rounded-2xl bg-slate-50 p-3">
                    <p className="font-black">{user.name}</p>
                    <p className="text-sm font-bold text-slate-500">{user.email}</p>
                    <p className="text-xs font-black uppercase text-emerald-700">{user.role}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] bg-white p-5 shadow-soft">
              <h2 className="text-2xl font-black">Meal ratings</h2>
              <div className="mt-4 space-y-2">
                {ratings.length ? (
                  ratings.map((rating) => {
                    const meal = meals.find((item) => item.id === rating.mealId);
                    return (
                      <div key={rating.id} className="rounded-2xl bg-slate-50 p-3">
                        <p className="font-black">{meal?.name ?? rating.mealId}</p>
                        <p className="text-sm font-bold text-slate-500">{rating.rating.replaceAll("_", " ")}</p>
                      </div>
                    );
                  })
                ) : (
                  <p className="rounded-2xl bg-amber-50 p-4 font-bold text-amber-900">No ratings yet.</p>
                )}
              </div>
            </div>

            <div className="rounded-[2rem] bg-white p-5 shadow-soft">
              <h2 className="text-2xl font-black">Most selected</h2>
              <div className="mt-4 space-y-2">
                {mostSelected.map(({ meal, count }) => (
                  <div key={meal.id} className="flex items-center justify-between gap-3 rounded-2xl bg-slate-50 p-3">
                    <span className="font-black">{meal.name}</span>
                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-black text-emerald-900">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </AppShell>
    </ProtectedPage>
  );
}
