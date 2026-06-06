export type DishType =
  | "rice"
  | "main_dish"
  | "additional_dish"
  | "vegetable"
  | "sauce"
  | "chip"
  | "fruit"
  | "mineral_water"
  | "box"
  | "snack";

export type ServiceType =
  | "ricebox"
  | "prasmanan"
  | "prasmanan_wedding"
  | "bento"
  | "snackbox";

export type CategoryType =
  | "ikan"
  | "ayam"
  | "seafood"
  | "daging"
  | "manis"
  | "asin"
  | "puding"
  | "pudding"
  | "roti";

export interface Dish {
  id: number;
  name: string;
  type: DishType;
  service: ServiceType | null;
  category: CategoryType | null;
}
