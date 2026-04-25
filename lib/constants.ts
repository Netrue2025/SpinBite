import type { Country, MealTag, MealType } from "@/lib/types";

export const countries: Country[] = [
  "Nigeria",
  "United Kingdom",
  "Brazil",
  "United States",
  "India",
  "Ghana",
  "Other"
];

export const mealTypes: MealType[] = ["breakfast", "lunch", "dinner"];

export const tagOptions: Array<{ id: MealTag; label: string; icon: string }> = [
  { id: "quick", label: "Quick", icon: "⚡" },
  { id: "healthy", label: "Healthy", icon: "🥗" },
  { id: "cheap", label: "Cheap", icon: "💸" },
  { id: "local", label: "Local", icon: "🌍" }
];

export const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
