"use client";

import { useEffect, useMemo, useState } from "react";
import type { Dish, DishType, ServiceType } from "@/types/dish";

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

export const mainDishGroupLabels: Record<string, string> = {
  ayam: "Ayam",
  ikan: "Ikan",
};

const createEmptyOptions = () =>
  dishTypes.reduce(
    (acc, type) => {
      acc[type] = [];
      return acc;
    },
    {} as Record<DishType, string[]>,
  );

const createEmptyMainDishGroups = (): Record<string, string[]> => ({
  ayam: [],
  ikan: [],
});

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

  return null;
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
    const groups = createEmptyMainDishGroups();

    optionsByType.main_dish.forEach((name) => {
      const group = inferMainDishGroup(name);

      if (group) {
        groups[group].push(name);
        return;
      }

      groups.ayam.push(name);
      groups.ikan.push(name);
    });

    return groups;
  }, [optionsByType.main_dish]);

  return {
    dishes: serviceDishes,
    optionsByType,
    mainDishGroups,
    isLoading,
    error,
  };
}
