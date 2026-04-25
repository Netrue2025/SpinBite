import type { Meal, MealPlan, MealType } from "@/lib/types";

export const planCookieName = "meal-spin-plans";

export function dateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function weekDates(baseDate = new Date()) {
  const monday = new Date(baseDate);
  const day = baseDate.getDay() || 7;
  monday.setHours(0, 0, 0, 0);
  monday.setDate(baseDate.getDate() - day + 1);

  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + index);
    return dateKey(date);
  });
}

export function currentMealType(now = new Date()): MealType {
  const minutes = now.getHours() * 60 + now.getMinutes();

  if (minutes < 11 * 60 + 30) {
    return "breakfast";
  }

  if (minutes < 17 * 60) {
    return "lunch";
  }

  return "dinner";
}

export function isMealSlotPast(date: string, mealType: MealType, now = new Date()) {
  const today = dateKey(now);

  if (date < today) {
    return true;
  }

  if (date > today) {
    return false;
  }

  const minutes = now.getHours() * 60 + now.getMinutes();

  if (mealType === "breakfast") {
    return minutes >= 11 * 60 + 30;
  }

  if (mealType === "lunch") {
    return minutes >= 17 * 60;
  }

  return false;
}

export function firstAvailablePlanSlot(now = new Date()) {
  const dates = weekDates(now);
  const preferred = { date: dateKey(now), mealType: currentMealType(now) };

  if (!isMealSlotPast(preferred.date, preferred.mealType, now)) {
    return preferred;
  }

  for (const date of dates) {
    for (const mealType of ["breakfast", "lunch", "dinner"] as const) {
      if (!isMealSlotPast(date, mealType, now)) {
        return { date, mealType };
      }
    }
  }

  return { date: dates[dates.length - 1], mealType: "dinner" as const };
}

export function upsertPlan(plans: MealPlan[], plan: MealPlan) {
  return [
    ...plans.filter((item) => !(item.userId === plan.userId && item.date === plan.date && item.mealType === plan.mealType)),
    plan
  ];
}

export function encodePlansCookie(plans: MealPlan[]) {
  return encodeURIComponent(JSON.stringify(plans));
}

export function decodePlansCookie(value?: string) {
  if (!value) {
    return [];
  }

  try {
    return JSON.parse(decodeURIComponent(value)) as MealPlan[];
  } catch {
    return [];
  }
}

export function writePlansCookie(plans: MealPlan[]) {
  if (typeof document === "undefined") {
    return;
  }

  document.cookie = `${planCookieName}=${encodePlansCookie(plans)}; Path=/; Max-Age=2592000; SameSite=Lax`;
}

export function plannedMealForNow(plans: MealPlan[], meals: Meal[], now = new Date()) {
  const plan = plans.find((item) => item.date === dateKey(now) && item.mealType === currentMealType(now));
  return plan ? meals.find((meal) => meal.id === plan.mealId) ?? null : null;
}
