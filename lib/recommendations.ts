import type { Country, Meal, MealTag, MealType } from "@/lib/types";

export type SpinFilters = {
  country: Country;
  tag: MealTag;
  mealType?: MealType;
  previousMealId?: string;
};

export function findMeal(meals: Meal[], filters: SpinFilters) {
  const mealType = filters.mealType ?? "breakfast";
  let pool = meals.filter(
    (meal) =>
      meal.mealType === mealType &&
      meal.country === filters.country &&
      meal.tags.includes(filters.tag) &&
      meal.id !== filters.previousMealId
  );

  if (!pool.length) {
    pool = meals.filter(
      (meal) =>
        meal.mealType === mealType &&
        meal.country === filters.country &&
        meal.id !== filters.previousMealId
    );
  }

  if (!pool.length) {
    pool = meals.filter(
      (meal) =>
        meal.mealType === mealType &&
        meal.tags.includes(filters.tag) &&
        meal.id !== filters.previousMealId
    );
  }

  if (!pool.length) {
    pool = meals.filter((meal) => meal.mealType === mealType);
  }

  return pool[Math.floor(Math.random() * pool.length)];
}

export function tagLabel(tag: MealTag) {
  return tag.charAt(0).toUpperCase() + tag.slice(1);
}
