"use client";

import { useEffect, useMemo, useState } from "react";
import type { CategoryType, Dish, DishType, ServiceType } from "@/types/dish";

const dishTypes: DishType[] = [
  "rice",
  "main_dish",
  "additional_dish",
  "vegetable",
  "sauce",
  "chip",
  "fruit",
  "mineral_water",
  "box",
  "snack",
];

const mainDishCategories = ["ikan", "ayam", "seafood", "daging"] as const;
const snackCategories = ["manis", "asin", "pudding", "roti"] as const;

export const mainDishGroupLabels: Record<string, string> = {
  ikan: "Ikan",
  ayam: "Ayam",
  seafood: "Seafood",
  daging: "Daging",
};

export const snackGroupLabels: Record<string, string> = {
  manis: "Manis",
  asin: "Asin",
  pudding: "Pudding",
  roti: "Roti",
};

const createEmptyOptions = () =>
  dishTypes.reduce(
    (acc, type) => {
      acc[type] = [];
      return acc;
    },
    {} as Record<DishType, string[]>,
  );

const createEmptyGroups = (categories: readonly string[]): Record<string, string[]> =>
  categories.reduce(
    (acc, category) => {
      acc[category] = [];
      return acc;
    },
    {} as Record<string, string[]>,
  );

const normalizeDishes = (payload: unknown): Dish[] => {
  if (Array.isArray(payload)) return payload as Dish[];

  if (
    payload &&
    typeof payload === "object" &&
    "data" in payload &&
    Array.isArray((payload as { data?: unknown }).data)
  ) {
    return (payload as { data: Dish[] }).data;
  }

  return [];
};

const inferMainDishGroup = (name: string) => {
  const value = name.toLowerCase();

  if (value.includes("ayam")) return "ayam";
  if (value.includes("ikan")) return "ikan";
  if (value.includes("udang") || value.includes("cumi") || value.includes("seafood")) {
    return "seafood";
  }
  if (value.includes("daging") || value.includes("sapi")) return "daging";

  return null;
};

const normalizeCategory = (category: CategoryType | null) => {
  if (category === "puding") return "pudding";
  return category;
};

export function useServiceDishes(service: ServiceType) {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadDishes = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch("/api/dishes");
        if (!response.ok) {
          throw new Error(`Failed to fetch dishes: ${response.status}`);
        }

        const payload = await response.json();
        if (isMounted) {
          setDishes(normalizeDishes(payload));
        }
      } catch (err) {
        if (isMounted) {
          setDishes([]);
          setError(err instanceof Error ? err : new Error("Failed to fetch dishes"));
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadDishes();

    return () => {
      isMounted = false;
    };
  }, []);

  const serviceDishes = useMemo(
    () => dishes.filter((dish) => dish.service === service || dish.service === null),
    [dishes, service],
  );

  const optionsByType = useMemo(() => {
    const options = createEmptyOptions();

    serviceDishes.forEach((dish) => {
      if (!options[dish.type].includes(dish.name)) {
        options[dish.type].push(dish.name);
      }
    });

    return options;
  }, [serviceDishes]);

  const mainDishGroups = useMemo(() => {
    const groups = createEmptyGroups(mainDishCategories);

    serviceDishes
      .filter((dish) => dish.type === "main_dish")
      .forEach((dish) => {
        const group = normalizeCategory(dish.category) ?? inferMainDishGroup(dish.name);

        if (group && group in groups && !groups[group].includes(dish.name)) {
          groups[group].push(dish.name);
        }
      });

    return groups;
  }, [serviceDishes]);

  const snackGroups = useMemo(() => {
    const groups = createEmptyGroups(snackCategories);

    serviceDishes
      .filter((dish) => dish.type === "snack")
      .forEach((dish) => {
        const group = normalizeCategory(dish.category);

        if (group && group in groups && !groups[group].includes(dish.name)) {
          groups[group].push(dish.name);
        }
      });

    return groups;
  }, [serviceDishes]);

  return {
    dishes: serviceDishes,
    optionsByType,
    mainDishGroups,
    snackGroups,
    isLoading,
    error,
  };
}
