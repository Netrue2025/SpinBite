import type { Country, Meal, MealTag, MealType } from "@/lib/types";

export type SpinFilters = {
  country: Country;
  tag: MealTag;
  mealType?: MealType;
  previousMealId?: string;
};

export function findMeal(meals: Meal[], filters: SpinFilters) {
  const matchesMealType = (meal: Meal) => (filters.mealType ? meal.mealType === filters.mealType : true);
  const isNotPrevious = (meal: Meal) => meal.id !== filters.previousMealId;

  let pool = meals.filter(
    (meal) => matchesMealType(meal) && meal.country === filters.country && meal.tags.includes(filters.tag) && isNotPrevious(meal)
  );

  if (!pool.length) {
    pool = meals.filter((meal) => matchesMealType(meal) && meal.country === filters.country && meal.tags.includes(filters.tag));
  }

  if (pool.length < 2) {
    const countryPool = meals.filter((meal) => matchesMealType(meal) && meal.country === filters.country && isNotPrevious(meal));
    if (countryPool.length > pool.length) {
      pool = countryPool;
    }
  }

  if (!pool.length) {
    pool = meals.filter((meal) => matchesMealType(meal) && meal.tags.includes(filters.tag) && isNotPrevious(meal));
  }

  if (!pool.length) {
    pool = meals.filter((meal) => matchesMealType(meal));
  }

  return pool[Math.floor(Math.random() * pool.length)];
}

export function tagLabel(tag: MealTag) {
  return tag.charAt(0).toUpperCase() + tag.slice(1);
}
