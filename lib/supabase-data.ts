import { hasSupabaseConfig, supabase } from "@/lib/supabase";
import { resolveMealImageUrl } from "@/lib/meal-image-overrides";
import {
  getStoredMeals,
  getStoredPlans,
  getStoredRatings,
  getStoredUsers,
  saveStoredMeals,
  saveStoredPlans,
  saveStoredRatings
} from "@/lib/storage";
import type { AppUser, Country, Difficulty, Meal, MealPlan, MealRating, MealTag, MealType } from "@/lib/types";

type MealRow = {
  id: string;
  name: string;
  description: string;
  country: Country;
  meal_type: MealType;
  image_url: string;
  video_url: string;
  ingredients: string[];
  cooking_steps: string[];
  cooking_time: string;
  difficulty: Difficulty;
  tags: MealTag[];
  created_at: string;
};

type PlanRow = {
  id: string;
  user_id: string;
  meal_id: string;
  date: string;
  meal_type: MealType;
  created_at: string;
};

type RatingRow = {
  id: string;
  user_id: string;
  meal_id: string;
  rating: MealRating["rating"];
  created_at: string;
};

type UserRow = {
  id: string;
  name: string;
  email: string;
  role: AppUser["role"];
  preferred_country: Country;
  created_at: string;
};

function requireSupabase() {
  if (!hasSupabaseConfig || !supabase) {
    return null;
  }

  return supabase;
}

function toMeal(row: MealRow): Meal {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    country: row.country,
    mealType: row.meal_type,
    imageUrl: resolveMealImageUrl(row.id, row.image_url),
    videoUrl: row.video_url,
    ingredients: row.ingredients,
    cookingSteps: row.cooking_steps,
    cookingTime: row.cooking_time,
    difficulty: row.difficulty,
    tags: row.tags,
    createdAt: row.created_at
  };
}

function fromMeal(meal: Meal) {
  return {
    id: meal.id,
    name: meal.name,
    description: meal.description,
    country: meal.country,
    meal_type: meal.mealType,
    image_url: meal.imageUrl,
    video_url: meal.videoUrl,
    ingredients: meal.ingredients,
    cooking_steps: meal.cookingSteps,
    cooking_time: meal.cookingTime,
    difficulty: meal.difficulty,
    tags: meal.tags
  };
}

function toPlan(row: PlanRow): MealPlan {
  return {
    id: row.id,
    userId: row.user_id,
    mealId: row.meal_id,
    date: row.date,
    mealType: row.meal_type,
    createdAt: row.created_at
  };
}

function toRating(row: RatingRow): MealRating {
  return {
    id: row.id,
    userId: row.user_id,
    mealId: row.meal_id,
    rating: row.rating,
    createdAt: row.created_at
  };
}

function toUser(row: UserRow): AppUser {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    role: row.role,
    preferredCountry: row.preferred_country,
    createdAt: row.created_at
  };
}

export async function loadMeals() {
  const client = requireSupabase();
  if (!client) {
    return getStoredMeals();
  }

  const { data, error } = await client.from("meals").select("*").order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return (data as MealRow[]).map(toMeal);
}

export async function loadMeal(id: string) {
  const client = requireSupabase();
  if (!client) {
    return getStoredMeals().find((meal) => meal.id === id) ?? null;
  }

  const { data, error } = await client.from("meals").select("*").eq("id", id).maybeSingle();

  if (error) {
    throw error;
  }

  return data ? toMeal(data as MealRow) : null;
}

export async function saveMeal(meal: Meal) {
  const client = requireSupabase();
  if (!client) {
    const current = getStoredMeals();
    const next = current.some((item) => item.id === meal.id)
      ? current.map((item) => (item.id === meal.id ? meal : item))
      : [meal, ...current];
    saveStoredMeals(next);
    return meal;
  }

  const { data, error } = await client.from("meals").upsert(fromMeal(meal), { onConflict: "id" }).select("*").single();

  if (error) {
    throw error;
  }

  return toMeal(data as MealRow);
}

export async function removeMeal(id: string) {
  const client = requireSupabase();
  if (!client) {
    saveStoredMeals(getStoredMeals().filter((meal) => meal.id !== id));
    return;
  }

  const { error } = await client.from("meals").delete().eq("id", id);

  if (error) {
    throw error;
  }
}

export async function loadPlans(userId?: string) {
  const client = requireSupabase();
  if (!client) {
    const plans = getStoredPlans();
    return userId ? plans.filter((plan) => plan.userId === userId) : plans;
  }

  let query = client.from("meal_plans").select("*").order("date", { ascending: true });
  if (userId) {
    query = query.eq("user_id", userId);
  }

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  return (data as PlanRow[]).map(toPlan);
}

export async function savePlan(plan: MealPlan) {
  const client = requireSupabase();
  if (!client) {
    const nextPlans = [
      ...getStoredPlans().filter((item) => !(item.userId === plan.userId && item.date === plan.date && item.mealType === plan.mealType)),
      plan
    ];
    saveStoredPlans(nextPlans);
    return plan;
  }

  const { data, error } = await client
    .from("meal_plans")
    .upsert(
      {
        user_id: plan.userId,
        meal_id: plan.mealId,
        date: plan.date,
        meal_type: plan.mealType
      },
      { onConflict: "user_id,date,meal_type" }
    )
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return toPlan(data as PlanRow);
}

export async function loadRatings(userId?: string) {
  const client = requireSupabase();
  if (!client) {
    const ratings = getStoredRatings();
    return userId ? ratings.filter((rating) => rating.userId === userId) : ratings;
  }

  let query = client.from("meal_ratings").select("*").order("created_at", { ascending: false });
  if (userId) {
    query = query.eq("user_id", userId);
  }

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  return (data as RatingRow[]).map(toRating);
}

export async function saveRating(rating: MealRating) {
  const client = requireSupabase();
  if (!client) {
    const nextRatings = [
      ...getStoredRatings().filter((item) => !(item.userId === rating.userId && item.mealId === rating.mealId)),
      rating
    ];
    saveStoredRatings(nextRatings);
    return rating;
  }

  const { data, error } = await client
    .from("meal_ratings")
    .upsert(
      {
        user_id: rating.userId,
        meal_id: rating.mealId,
        rating: rating.rating
      },
      { onConflict: "user_id,meal_id" }
    )
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return toRating(data as RatingRow);
}

export async function loadUsers(currentUser?: AppUser | null) {
  const client = requireSupabase();
  if (!client) {
    return getStoredUsers(currentUser);
  }

  const { data, error } = await client.from("users").select("*").order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return (data as UserRow[]).map(toUser);
}
