"use client";

import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { useAuth } from "@/context/authContext";
import { clampToMinimumOrderQuantity, getMinimumOrderQuantity } from "@/lib/order-minimums";

export interface CartAddOn {
  label: string;
  value: string;
  price: number;
}

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  image: string;
  basePrice: number;
  addOns: CartAddOn[];
  quantity: number;
  slug: string;
  category: string;
  packageName?: string;
  unitLabel?: string;
}

export interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

type CartAction =
  | { type: "ADD_ITEM"; payload: Omit<CartItem, "id"> }
  | { type: "REMOVE_ITEM"; payload: { id: string } }
  | { type: "UPDATE_QUANTITY"; payload: { id: string; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "TOGGLE_CART" }
  | { type: "OPEN_CART" }
  | { type: "CLOSE_CART" }
  | { type: "HYDRATE"; payload: CartItem[] };

function generateCartItemId(productId: string, addOns: CartAddOn[]): string {
  const addOnKey = addOns
    .map((a) => a.value)
    .sort()
    .join("_");
  return `${productId}__${addOnKey || "default"}`;
}

export function getItemTotalPrice(item: CartItem): number {
  const addOnTotal = item.addOns.reduce((sum, a) => sum + a.price, 0);
  return (item.basePrice + addOnTotal) * item.quantity;
}

export function getCartTotalPrice(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + getItemTotalPrice(item), 0);
}

export function getCartTotalQuantity(items: CartItem[]): number {
  return items.length;
}

const INITIAL_STATE: CartState = { items: [], isOpen: false };

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "HYDRATE":
      return { ...state, items: action.payload };
    case "ADD_ITEM": {
      const payload = clampToMinimumOrderQuantity(action.payload);
      const id = generateCartItemId(
        payload.productId,
        payload.addOns,
      );
      const existing = state.items.find((i) => i.id === id);
      if (existing) {
        return {
          ...state,
          items: state.items.map((i) =>
            i.id === id
              ? { ...i, quantity: i.quantity + payload.quantity }
              : i,
          ),
        };
      }
      return { ...state, items: [...state.items, { ...payload, id }] };
    }
    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter((i) => i.id !== action.payload.id),
      };
    case "UPDATE_QUANTITY": {
      const existingItem = state.items.find((i) => i.id === action.payload.id);
      if (!existingItem) return state;
      const minimumQuantity = getMinimumOrderQuantity(existingItem);
      if (action.payload.quantity < minimumQuantity) {
        return {
          ...state,
          items: state.items.map((i) =>
            i.id === action.payload.id ? { ...i, quantity: minimumQuantity } : i,
          ),
        };
      }
      return {
        ...state,
        items: state.items.map((i) =>
          i.id === action.payload.id
            ? { ...i, quantity: action.payload.quantity }
            : i,
        ),
      };
    }
    case "CLEAR_CART":
      return { ...state, items: [] };
    case "TOGGLE_CART":
      return { ...state, isOpen: !state.isOpen };
    case "OPEN_CART":
      return { ...state, isOpen: true };
    case "CLOSE_CART":
      return { ...state, isOpen: false };
    default:
      return state;
  }
}

interface CartContextValue {
  state: CartState;
  addItem: (item: Omit<CartItem, "id">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  totalPrice: number;
  totalQuantity: number;
  isEmpty: boolean;
}

const CartContext = createContext<CartContextValue | null>(null);

const LEGACY_STORAGE_KEY = "ksmfood_cart";

function getCartStorageKey(userId: number | null | undefined): string {
  if (userId) return `ksmfood_cart_user_${userId}`;
  return "ksmfood_cart_guest";
}

function readCartFromStorage(key: string): CartItem[] {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const parsed: CartItem[] = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const { user, isLoggedIn, isLoading: authLoading } = useAuth();
  const [state, dispatch] = useReducer(cartReducer, INITIAL_STATE);
  const [storageKey, setStorageKey] = useState("ksmfood_cart_guest");
  const [cartReady, setCartReady] = useState(false);

  useEffect(() => {
    if (authLoading) return;

    const key = getCartStorageKey(isLoggedIn ? user?.id : null);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStorageKey(key);

    let items = readCartFromStorage(key);

    if (items.length === 0 && key === "ksmfood_cart_guest") {
      const legacy = readCartFromStorage(LEGACY_STORAGE_KEY);
      if (legacy.length > 0) {
        items = legacy;
        localStorage.setItem(key, JSON.stringify(legacy));
        localStorage.removeItem(LEGACY_STORAGE_KEY);
      }
    }

    dispatch({ type: "HYDRATE", payload: items });
    setCartReady(true);
  }, [authLoading, isLoggedIn, user?.id]);

  useEffect(() => {
    if (!cartReady) return;
    try {
      localStorage.setItem(storageKey, JSON.stringify(state.items));
    } catch {
      // Abaikan quota error.
    }
  }, [cartReady, state.items, storageKey]);

  const addItem = useCallback(
    (item: Omit<CartItem, "id">) =>
      dispatch({ type: "ADD_ITEM", payload: item }),
    [],
  );
  const removeItem = useCallback(
    (id: string) => dispatch({ type: "REMOVE_ITEM", payload: { id } }),
    [],
  );
  const updateQuantity = useCallback(
    (id: string, quantity: number) =>
      dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } }),
    [],
  );
  const clearCart = useCallback(() => dispatch({ type: "CLEAR_CART" }), []);
  const toggleCart = useCallback(() => dispatch({ type: "TOGGLE_CART" }), []);
  const openCart = useCallback(() => dispatch({ type: "OPEN_CART" }), []);
  const closeCart = useCallback(() => dispatch({ type: "CLOSE_CART" }), []);

  return (
    <CartContext.Provider
      value={{
        state,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        toggleCart,
        openCart,
        closeCart,
        totalPrice: getCartTotalPrice(state.items),
        totalQuantity: getCartTotalQuantity(state.items),
        isEmpty: state.items.length === 0,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart harus dipakai di dalam <CartProvider>");
  return ctx;
}
