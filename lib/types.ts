export type Country =
  | "Nigeria"
  | "United Kingdom"
  | "Brazil"
  | "United States"
  | "India"
  | "Ghana"
  | "Other";

export type MealType = "breakfast" | "lunch" | "dinner";

export type MealTag = "quick" | "healthy" | "cheap" | "local";

export type Difficulty = "Easy" | "Medium" | "Bold";

export type Meal = {
  id: string;
  name: string;
  description: string;
  country: Country;
  mealType: MealType;
  imageUrl: string;
  videoUrl: string;
  ingredients: string[];
  cookingSteps: string[];
  cookingTime: string;
  difficulty: Difficulty;
  tags: MealTag[];
  createdAt: string;
};

export type AppUser = {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  preferredCountry: Country;
  createdAt: string;
};

export type MealRating = {
  id: string;
  userId: string;
  mealId: string;
  rating: "loved" | "good" | "okay" | "not_for_me";
  createdAt: string;
};

export type MealPlan = {
  id: string;
  userId: string;
  mealId: string;
  date: string;
  mealType: MealType;
  createdAt: string;
};
