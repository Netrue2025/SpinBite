import { initialMeals } from "@/lib/meals";
import type { AppUser, Meal, MealPlan, MealRating } from "@/lib/types";

const mealsKey = "meal-spin-meals";
const plansKey = "meal-spin-plans";
const ratingsKey = "meal-spin-ratings";
const usersKey = "meal-spin-users";

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") {
    return fallback;
  }

  try {
    const value = window.localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(key, JSON.stringify(value));
  }
}

export function getStoredMeals() {
  return read<Meal[]>(mealsKey, initialMeals);
}

export function saveStoredMeals(meals: Meal[]) {
  write(mealsKey, meals);
}

export function getStoredPlans() {
  return read<MealPlan[]>(plansKey, []);
}

export function saveStoredPlans(plans: MealPlan[]) {
  write(plansKey, plans);
}

export function getStoredRatings() {
  return read<MealRating[]>(ratingsKey, []);
}

export function saveStoredRatings(ratings: MealRating[]) {
  write(ratingsKey, ratings);
}

export function getStoredUsers(currentUser?: AppUser | null) {
  const demoUsers: AppUser[] = [
    {
      id: "demo-user",
      name: "Demo Foodie",
      email: "foodie@mealspin.app",
      role: "user",
      preferredCountry: "Nigeria",
      createdAt: "2026-01-01T00:00:00.000Z"
    },
    {
      id: "demo-admin",
      name: "Meal Admin",
      email: "admin@mealspin.app",
      role: "admin",
      preferredCountry: "United Kingdom",
      createdAt: "2026-01-01T00:00:00.000Z"
    }
  ];
  const users = read<AppUser[]>(usersKey, demoUsers);

  if (currentUser && !users.some((user) => user.id === currentUser.id)) {
    const nextUsers = [currentUser, ...users];
    write(usersKey, nextUsers);
    return nextUsers;
  }

  return users;
}

export function saveStoredUsers(users: AppUser[]) {
  write(usersKey, users);
}
