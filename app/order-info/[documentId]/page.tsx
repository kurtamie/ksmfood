"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useAuth } from "@/context/authContext";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { getLeaveTime } from "@/lib/cart-order-payload";
import { getMinimumOrderQuantity } from "@/lib/order-minimums";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

function formatRupiah(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}

function formatDate(date: Date | undefined) {
  if (!date) {
    return "";
  }
  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function parseAmount(value: string | number | null | undefined): number {
  if (value == null || value === "") return 0;
  if (typeof value === "number") return Number.isFinite(value) ? value : 0;
  const parsed = Number(String(value).replace(/[^\d.-]/g, ""));
  return Number.isFinite(parsed) ? parsed : 0;
}

function normalizePhoneInput(value: string): string {
  return value.replace(/\D/g, "").slice(0, 15);
}

function isValidRecipientPhone(value: string): boolean {
  return /^(62|08)\d{8,13}$/.test(value);
}

type OrderMenuRow = {
  id?: number | string;
  documentId?: string;
  rice?: string | null;
  main_dish?: string | null;
  main_dish2?: string | null;
  main_dish3?: string | null;
  additional_dish?: string | null;
  vegetable?: string | null;
  sauce?: string | null;
  chip?: string | null;
  fruit?: string | null;
  mineral_water?: string | null;
  box?: string | null;
  pudding?: string | null;
  snack?: string | null;
};

type OrderDetailRow = {
  id?: number | string;
  documentId?: string;
  qty?: string | null;
  selling_price?: string | null;
  amount?: string | null;
  total_amount?: string | null;
};

type OrderDisplayItem = {
  id: string;
  name: string;
  addOnLabels: string;
  quantity: number;
  unitPrice: number;
  total: number;
  basePrice?: number;
  menu: OrderMenuRow;
  detail: OrderDetailRow;
};

type SessionAddOn = {
  label: string;
  value: string;
  price: number;
};

type SessionItem = {
  id: string;
  name: string;
  basePrice: number;
  addOns: SessionAddOn[];
  quantity: number;
  slug?: string;
  category?: string;
  unitLabel?: string;
};

function getAddOnTotal(addOns: SessionAddOn[] | undefined): number {
  return (addOns ?? []).reduce((sum, addOn) => sum + addOn.price, 0);
}

function getSessionUnitPrice(item: SessionItem): number {
  return item.basePrice + getAddOnTotal(item.addOns);
}

function unwrapEntity<T extends object>(row: unknown): T | null {
  if (!row || typeof row !== "object") return null;
  const record = row as Record<string, unknown>;
  if (record.attributes && typeof record.attributes === "object") {
    return {
      ...(record.attributes as T),
      id: record.id,
      documentId: record.documentId,
    };
  }
  return record as T;
}

function getRelationRows<T extends object>(value: unknown): T[] {
  if (Array.isArray(value)) {
    return value
      .map((row) => unwrapEntity<T>(row))
      .filter((row): row is T => row != null);
  }

  if (
    value &&
    typeof value === "object" &&
    Array.isArray((value as { data?: unknown }).data)
  ) {
    return (value as { data: unknown[] }).data
      .map((row) => unwrapEntity<T>(row))
      .filter((row): row is T => row != null);
  }

  return [];
}

function buildMenuLabels(menu: OrderMenuRow): string {
  return [
    menu.rice,
    menu.main_dish,
    menu.main_dish2,
    menu.main_dish3,
    menu.additional_dish,
    menu.vegetable,
    menu.sauce,
    menu.chip,
    menu.fruit,
    menu.mineral_water,
    menu.box,
    menu.pudding,
    menu.snack,
  ]
    .filter(Boolean)
    .join(", ");
}

function toOrderDisplayItems(
  menus: OrderMenuRow[],
  details: OrderDetailRow[],
): OrderDisplayItem[] {
  if (details.length === 1 && menus.length <= 1) {
    const detail = details[0];
    const quantity = parseAmount(detail.qty) || 1;
    const unitPrice = parseAmount(detail.selling_price);
    const total =
      parseAmount(detail.total_amount ?? detail.amount) || quantity * unitPrice;

    return [
      {
        id: String(detail.documentId ?? detail.id ?? "order-detail"),
        name: "Menu Pesanan",
        addOnLabels: menus.map(buildMenuLabels).filter(Boolean).join(" | "),
        quantity,
        unitPrice,
        total,
        menu: menus[0] ?? {},
        detail,
      },
    ];
  }

  const rowCount = Math.max(menus.length, details.length);
  const aggregateDetail = details.length === 1 ? details[0] : null;
  const aggregateQuantity = aggregateDetail ? parseAmount(aggregateDetail.qty) : 0;
  const aggregateUnitPrice = aggregateDetail
    ? parseAmount(aggregateDetail.selling_price)
    : 0;
  const splitQuantity =
    aggregateDetail && rowCount > 0
      ? Math.max(1, Math.floor(aggregateQuantity / rowCount))
      : 1;

  return Array.from({ length: rowCount }, (_, index) => {
    const menu = menus[index] ?? {};
    const detail = details[index] ?? aggregateDetail ?? {};
    const quantity =
      details.length === 1 && menus.length > 1
        ? splitQuantity
        : parseAmount(detail.qty) || 1;
    const unitPrice = parseAmount(detail.selling_price) || aggregateUnitPrice;
    const total =
      details.length === 1 && menus.length > 1
        ? quantity * unitPrice
        : parseAmount(detail.total_amount ?? detail.amount) ||
        quantity * unitPrice;

    return {
      id: String(
        detail.documentId ?? detail.id ?? menu.documentId ?? menu.id ?? index,
      ),
      name: `Menu Pesanan ${index + 1}`,
      addOnLabels: buildMenuLabels(menu),
      quantity,
      unitPrice,
      total,
      menu,
      detail,
    };
  });
}

type SavedAddress = {
  id: string;
  label: string;
  addressName: string;
  addressLine: string;
  subdistrict: string;
  pinpoint: string;
  recipientName: string;
  recipientPhone: string;
  latitude?: number;
  longitude?: number;
};

function normalizeText(value: unknown): string {
  if (typeof value !== "string") return "";
  return value.trim();
}

function parseSavedAddresses(
  raw?: string | null,
  customerLatitude?: string | number | null,
  customerLongitude?: string | number | null,
  customerSubdistrict?: string | null,
): SavedAddress[] {
  if (!raw) return [];

  const latitude =
    typeof customerLatitude === "number"
      ? customerLatitude
      : customerLatitude
        ? Number(customerLatitude)
        : undefined;
  const longitude =
    typeof customerLongitude === "number"
      ? customerLongitude
      : customerLongitude
        ? Number(customerLongitude)
        : undefined;
  const validLatitude =
    latitude !== undefined && Number.isFinite(latitude) ? latitude : undefined;
  const validLongitude =
    longitude !== undefined && Number.isFinite(longitude)
      ? longitude
      : undefined;
  const pinpoint =
    validLatitude !== undefined && validLongitude !== undefined
      ? `${validLatitude.toFixed(6)}, ${validLongitude.toFixed(6)}`
      : "";

  try {
    const parsed = JSON.parse(raw);

    if (Array.isArray(parsed)) {
      return parsed.map((item) => {
        const itemSubdistrict = normalizeText(
          item?.subdistrict ?? item?.kelurahan ?? customerSubdistrict,
        );

        return {
          id: item?.id ?? String(Math.random()).slice(2),
          label:
            normalizeText(item?.name) ||
            normalizeText(item?.addressLine) ||
            normalizeText(item?.address) ||
            "Alamat",
          addressName:
            normalizeText(item?.name) ||
            normalizeText(item?.addressLine) ||
            normalizeText(item?.address) ||
            "",
          addressLine:
            normalizeText(item?.addressLine) ||
            normalizeText(item?.address) ||
            "",
          subdistrict: itemSubdistrict,
          pinpoint: normalizeText(item?.pinpoint) || pinpoint,
          recipientName: normalizeText(item?.recipientName),
          recipientPhone: normalizeText(item?.recipientPhone),
          latitude:
            typeof item?.latitude === "number"
              ? item.latitude
              : item?.latitude
                ? Number(item.latitude)
                : undefined,
          longitude:
            typeof item?.longitude === "number"
              ? item.longitude
              : item?.longitude
                ? Number(item.longitude)
                : undefined,
        };
      });
    }
  } catch {
    return [
      {
        id: "customer-address",
        label: raw,
        addressName: raw,
        addressLine: raw,
        subdistrict: normalizeText(customerSubdistrict),
        pinpoint,
        recipientName: "",
        recipientPhone: "",
        latitude: validLatitude,
        longitude: validLongitude,
      },
    ];
  }

  if (typeof raw === "string") {
    return [
      {
        id: "customer-address",
        label: raw,
        addressName: raw,
        addressLine: raw,
        subdistrict: normalizeText(customerSubdistrict),
        pinpoint,
        recipientName: "",
        recipientPhone: "",
        latitude: validLatitude,
        longitude: validLongitude,
      },
    ];
  }

  return [];
}

export default function OrderInfoPage() {
  const t = useTranslations("orderInfo");
  const locale = useLocale();
  const router = useRouter();
  const params = useParams<{ documentId?: string }>();
  const documentId = params?.documentId;
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [month, setMonth] = useState<Date | undefined>(date);
  const [value, setValue] = useState(formatDate(date));
  const [deliveryDate, setDeliveryDate] = useState(
    date ? date.toISOString().slice(0, 10) : "",
  );
  const [deliveryTime, setDeliveryTime] = useState("10:30:00");
  const [addressName, setAddressName] = useState("");
  const [addressLine, setAddressLine] = useState("");
  const [subdistrict, setSubdistrict] = useState("");
  const [pinpoint, setPinpoint] = useState("");
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [recipientName, setRecipientName] = useState("");
  const [recipientPhone, setRecipientPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [orderId, setOrderId] = useState<number | string | null>(null);
  const [orderMenus, setOrderMenus] = useState<OrderMenuRow[]>([]);
  const [orderDetails, setOrderDetails] = useState<OrderDetailRow[]>([]);
  const [isOrderLoading, setIsOrderLoading] = useState(true);
  const [sessionItems, setSessionItems] = useState<SessionItem[]>([]);
  const [draftOrderDocumentId, setDraftOrderDocumentId] = useState<
    string | null
  >(null);
  const [leaveDialogOpen, setLeaveDialogOpen] = useState(false);
  const [pendingNavigationHref, setPendingNavigationHref] = useState<
    string | null
  >(null);
  const [isDeletingDraftOrder, setIsDeletingDraftOrder] = useState(false);
  const allowNavigationRef = useRef(false);

  const savedAddresses = useMemo(
    () =>
      parseSavedAddresses(
        user?.customer?.address ?? localStorage.getItem("ksm_customer_address"),
        user?.customer?.latitude ?? localStorage.getItem("ksm_customer_latitude"),
        user?.customer?.longitude ?? localStorage.getItem("ksm_customer_longitude"),
        user?.customer?.subdistrict ?? localStorage.getItem("ksm_customer_subdistrict"),
      ),
    [
      user?.customer?.address,
      user?.customer?.latitude,
      user?.customer?.longitude,
      user?.customer?.subdistrict,
    ],
  );

  type LeafletMap = {
    setView: (coords: [number, number], zoom: number) => void;
    on: (
      event: string,
      callback: (e: { latlng: { lat: number; lng: number } }) => void,
    ) => void;
    removeLayer: (layer: MarkerType) => void;
    remove: () => void;
  };

  type MarkerType = {
    addTo: (map: LeafletMap) => MarkerType;
  };

  const mapRef = useRef<HTMLDivElement | null>(null);
  const leafletLoadedRef = useRef(false);
  const mapInstanceRef = useRef<LeafletMap | null>(null);
  const markerRef = useRef<MarkerType | null>(null);

  function isValidDate(date: Date | undefined) {
    if (!date) {
      return false;
    }
    return !isNaN(date.getTime());
  }

  const kelurahanOptions = [
    { label: "Nagoya", value: "Nagoya, Batam" },
    { label: "Batam Kota", value: "Batam Kota, Batam" },
    { label: "Lubuk Baja", value: "Lubuk Baja, Batam" },
    { label: "Lubuk Baja Kota", value: "Lubuk Baja Kota, Batam" },
    { label: "Batu Ampar", value: "Batu Ampar, Batam" },
    { label: "Batu Aji", value: "Batu Aji, Batam" },
    { label: "Bengkong", value: "Bengkong, Batam" },
    { label: "Sagulung", value: "Sagulung, Batam" },
    { label: "Nongsa", value: "Nongsa, Batam" },
    { label: "Sei Beduk", value: "Sei Beduk, Batam" },
    { label: "Sungai Panas", value: "Sungai Panas, Batam" },
    { label: "Belakang Padang", value: "Belakang Padang, Batam" },
    { label: "Sekupang", value: "Sekupang, Batam" },
    { label: "Galang", value: "Galang, Batam" },
    { label: "Bulang", value: "Bulang, Batam" },
    { label: "Tanjung Riau", value: "Tanjung Riau, Batam" },
    { label: "Sekupang Timur", value: "Sekupang Timur, Batam" },
    { label: "Lubuk Baja Baru", value: "Lubuk Baja Baru, Batam" },
  ];

  const orderItems = useMemo(() => {
    if (orderDetails.length === 0 && sessionItems.length === 0) return [];

    if (orderDetails.length > 0) {
      const apiItems = toOrderDisplayItems(orderMenus, orderDetails);
      return apiItems.map((item, index) => {
        const session = sessionItems[index];
        const addOns = session?.addOns ?? [];
        const basePrice = session?.basePrice ?? item.unitPrice;
        const unitPrice = session
          ? getSessionUnitPrice(session)
          : item.unitPrice;
        const fallbackName =
          item.name === "Menu Pesanan"
            ? t("fallbackMenuName")
            : item.name.replace(
              /^Menu Pesanan\s+/,
              `${t("fallbackMenuName")} `,
            );
        return {
          ...item,
          name: session?.name ?? fallbackName,
          basePrice,
          addOns,
          addOnLabels: addOns.map((a: SessionAddOn) => a.label).join(", "),
          unitPrice,
          total: unitPrice * item.quantity,
        };
      });
    }

    return sessionItems.map((item) => ({
      id: item.id,
      name: item.name,
      basePrice: item.basePrice,
      addOns: item.addOns,
      addOnLabels: item.addOns.map((a) => a.label).join(", "),
      quantity: item.quantity,
      unitPrice: getSessionUnitPrice(item),
      total: getSessionUnitPrice(item) * item.quantity,
      menu: {} as OrderMenuRow,
      detail: {} as OrderDetailRow,
    }));
  }, [orderDetails, orderMenus, sessionItems, t]);

  const itemCount = useMemo(
    () => orderItems.reduce((sum, item) => sum + item.quantity, 0),
    [orderItems],
  );
  const orderSubtotal = useMemo(
    () =>
      orderItems.reduce(
        (sum, item) =>
          sum + (item.basePrice ?? item.unitPrice) * item.quantity,
        0,
      ),
    [orderItems],
  );
  const orderTotal = useMemo(
    () => orderItems.reduce((sum, item) => sum + item.total, 0),
    [orderItems],
  );
  const extraChargeRows = useMemo(
    () =>
      orderItems.flatMap((item) =>
        item.addOns
          .filter((addOn) => addOn.price > 0)
          .map((addOn) => ({
            key: `${item.id}-${addOn.value}`,
            label: addOn.label,
            quantity: item.quantity,
            unitPrice: addOn.price,
            total: addOn.price * item.quantity,
          })),
      ),
    [orderItems],
  );

  useEffect(() => {
    if (!date) return;
    setDeliveryDate(date.toISOString().slice(0, 10));
  }, [date]);

  useEffect(() => {
    if (!documentId) {
      setIsOrderLoading(false);
      return;
    }

    let cancelled = false;

    async function loadOrder() {
      setIsOrderLoading(true);
      setSubmitError(null);

      try {
        const res = await fetch(
          `/api/orders/${documentId}?populate[order_details]=true&populate[order_menus]=true&populate[invoices]=true`,
          {
            cache: "no-store",
            credentials: "include",
          },
        );
        const json = await res.json();

        if (!res.ok || !json?.success) {
          throw new Error(
            typeof json?.error === "string"
              ? json.error
              : t("errors.loadOrderDetailsFailed"),
          );
        }

        const order = unwrapEntity<Record<string, unknown>>(
          json.data?.data ?? json.data,
        );
        if (!order || cancelled) return;

        setOrderId(
          typeof order.id === "number" || typeof order.id === "string"
            ? order.id
            : null,
        );
        setOrderMenus(getRelationRows<OrderMenuRow>(order.order_menus));
        setOrderDetails(getRelationRows<OrderDetailRow>(order.order_details));

        if (typeof order.delivery_date === "string") {
          setDeliveryDate(order.delivery_date);
          const nextDate = new Date(order.delivery_date);
          if (!Number.isNaN(nextDate.getTime())) {
            setDate(nextDate);
            setMonth(nextDate);
            setValue(formatDate(nextDate));
          }
        }
        if (typeof order.arrive_time === "string") {
          setDeliveryTime(order.arrive_time);
        }
        if (typeof order.delivery_address === "string") {
          setAddressLine(order.delivery_address);
        }
        if (
          typeof order.latitude === "string" ||
          typeof order.latitude === "number"
        ) {
          const nextLatitude = Number(order.latitude);
          if (Number.isFinite(nextLatitude)) setLatitude(nextLatitude);
        }
        if (
          typeof order.longitude === "string" ||
          typeof order.longitude === "number"
        ) {
          const nextLongitude = Number(order.longitude);
          if (Number.isFinite(nextLongitude)) setLongitude(nextLongitude);
        }
        if (typeof order.recipient_name === "string") {
          setRecipientName(order.recipient_name);
        }
        if (typeof order.recipient_phone_no === "string") {
          setRecipientPhone(order.recipient_phone_no);
        }
        if (typeof order.delivery_note === "string") {
          setNotes(order.delivery_note);
        }
      } catch (error) {
        if (!cancelled) {
          setSubmitError(
            error instanceof Error
              ? error.message
              : t("errors.loadOrderDetailsFailed"),
          );
        }
      } finally {
        if (!cancelled) setIsOrderLoading(false);
      }
    }

    void loadOrder();

    return () => {
      cancelled = true;
    };
  }, [documentId, t]);

  useEffect(() => {
    try {
      const raw = window.sessionStorage.getItem("ksm_order_summary");
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (
        typeof parsed?.documentId === "string" &&
        parsed.documentId === documentId
      ) {
        setDraftOrderDocumentId(parsed.documentId);
      }
      if (Array.isArray(parsed?.items)) {
        setSessionItems(parsed.items);
      }
    } catch {
      // ignore
    }
  }, [documentId]);

  const shouldConfirmBeforeLeaving =
    !!documentId &&
    draftOrderDocumentId === documentId &&
    !allowNavigationRef.current;

  useEffect(() => {
    if (!shouldConfirmBeforeLeaving || typeof window === "undefined") {
      return;
    }

    const currentHref = window.location.href;
    window.history.pushState({ ksmOrderGuard: true }, "", currentHref);

    const handleDocumentClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const target = event.target;
      if (!(target instanceof Element)) return;

      const anchor = target.closest("a[href]");
      if (!(anchor instanceof HTMLAnchorElement)) return;
      if (anchor.target && anchor.target !== "_self") return;
      if (anchor.hasAttribute("download")) return;

      const nextUrl = new URL(anchor.href, window.location.href);
      const currentUrl = new URL(window.location.href);
      const summaryPath = `/order-info/${encodeURIComponent(documentId)}/summary`;
      const isSamePageHashNavigation =
        nextUrl.pathname === currentUrl.pathname &&
        nextUrl.search === currentUrl.search &&
        nextUrl.hash !== currentUrl.hash;

      if (
        isSamePageHashNavigation ||
        nextUrl.pathname === currentUrl.pathname ||
        nextUrl.pathname === summaryPath
      ) {
        return;
      }

      event.preventDefault();
      setPendingNavigationHref(nextUrl.href);
      setLeaveDialogOpen(true);
    };

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };

    const handlePopState = () => {
      if (allowNavigationRef.current) return;
      const nextHref = window.location.href;
      window.history.pushState({ ksmOrderGuard: true }, "", currentHref);
      setPendingNavigationHref(nextHref);
      setLeaveDialogOpen(true);
    };

    document.addEventListener("click", handleDocumentClick, true);
    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("popstate", handlePopState);

    return () => {
      document.removeEventListener("click", handleDocumentClick, true);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", handlePopState);
    };
  }, [documentId, shouldConfirmBeforeLeaving]);

  useEffect(() => {
    if (
      !mapRef.current ||
      leafletLoadedRef.current ||
      typeof window === "undefined"
    ) {
      return;
    }

    let cancelled = false;

    const loadLeaflet = async () => {
      const linkId = "leaflet-css";
      if (!document.getElementById(linkId)) {
        const link = document.createElement("link");
        link.id = linkId;
        link.rel = "stylesheet";
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        document.head.appendChild(link);
      }

      if (!(window as unknown as { L?: unknown }).L) {
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement("script");
          script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
          script.async = true;
          script.onload = () => resolve();
          script.onerror = () => reject(new Error("Failed to load Leaflet"));
          document.body.appendChild(script);
        });
      }

      if (cancelled || mapInstanceRef.current) {
        return;
      }

      try {
        type LeafletGlobal = {
          map: (el: HTMLDivElement | null) => LeafletMap;
          tileLayer: (
            url: string,
            opts: { attribution: string },
          ) => { addTo: (map: LeafletMap) => void };
          marker: (coords: [number, number]) => MarkerType;
        };

        const L = (window as unknown as { L: LeafletGlobal }).L;
        if (
          (mapRef.current as unknown as { _leaflet_id?: number })?._leaflet_id
        ) {
          return;
        }
        const map = L.map(mapRef.current);
        map.setView([1.1265, 104.0236], 13);
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: "&copy; OpenStreetMap contributors",
        }).addTo(map);

        map.on("click", (event) => {
          const { lat, lng } = event.latlng;
          setLatitude(lat);
          setLongitude(lng);
          setPinpoint(`${lat.toFixed(6)}, ${lng.toFixed(6)}`);
          if (markerRef.current) {
            map.removeLayer(markerRef.current);
          }
          markerRef.current = L.marker([lat, lng]).addTo(map);
        });

        mapInstanceRef.current = map;
        leafletLoadedRef.current = true;
      } catch (error) {
        console.error("Leaflet init error", error);
      }
    };

    loadLeaflet();

    return () => {
      cancelled = true;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markerRef.current = null;
        leafletLoadedRef.current = false;
      }
    };
  }, []);

  useEffect(() => {
    if (!leafletLoadedRef.current || !mapInstanceRef.current) {
      return;
    }

    const query = pinpoint || subdistrict || "Batam, Kepulauan Riau";
    if (!query) {
      return;
    }

    const coordinateMatch = query.match(
      /^[\s]*([+-]?\d+(?:\.\d+)?)[,\s]+([+-]?\d+(?:\.\d+)?)[\s]*$/,
    );
    if (coordinateMatch) {
      const lat = Number(coordinateMatch[1]);
      const lng = Number(coordinateMatch[2]);
      if (!Number.isNaN(lat) && !Number.isNaN(lng)) {
        setLatitude(lat);
        setLongitude(lng);
        return;
      }
    }

    const controller = new AbortController();
    const timer = window.setTimeout(() => {
      fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query,
        )}&limit=1`,
        { signal: controller.signal },
      )
        .then((res) => res.json())
        .then((results) => {
          if (!results || results.length === 0) return;
          const first = results[0];
          const lat = Number(first.lat);
          const lng = Number(first.lon);
          if (Number.isNaN(lat) || Number.isNaN(lng)) return;
          setLatitude(lat);
          setLongitude(lng);
          const map = mapInstanceRef.current;
          if (!map) return;
          type LeafletGlobal = {
            marker: (coords: [number, number]) => MarkerType;
          };
          const L = (window as unknown as { L: LeafletGlobal }).L;
          if (markerRef.current) {
            map.removeLayer(markerRef.current);
          }
          markerRef.current = L.marker([lat, lng]).addTo(map);
          map.setView([lat, lng], 15);
        })
        .catch((error) => {
          if (error.name !== "AbortError") {
            console.error("Geocode error", error);
          }
        });
    }, 400);

    return () => {
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [pinpoint, subdistrict]);

  useEffect(() => {
    if (!leafletLoadedRef.current || !mapInstanceRef.current) {
      return;
    }
    if (latitude === null || longitude === null) {
      return;
    }

    const map = mapInstanceRef.current;
    map.setView([latitude, longitude], 15);
    type LeafletGlobal = {
      marker: (coords: [number, number]) => MarkerType;
    };
    const L = (window as unknown as { L: LeafletGlobal }).L;
    if (markerRef.current) {
      map.removeLayer(markerRef.current);
    }
    markerRef.current = L.marker([latitude, longitude]).addTo(map);
  }, [latitude, longitude]);

  const orderPayload = useMemo(
    () => ({
      delivery_date: deliveryDate || undefined,
      arrive_time: deliveryTime || undefined,
      leave: deliveryTime ? getLeaveTime(deliveryTime) : undefined,
      delivery_address: [addressLine.trim(), subdistrict].filter(Boolean).join(", ") ||
        undefined,
      latitude: latitude !== null ? String(latitude) : undefined,
      longitude: longitude !== null ? String(longitude) : undefined,
      recipient_name: recipientName || undefined,
      recipient_phone_no: recipientPhone || undefined,
      delivery_note: notes || undefined,
    }),
    [
      deliveryDate,
      deliveryTime,
      addressLine,
      subdistrict,
      latitude,
      longitude,
      recipientName,
      recipientPhone,
      notes,
    ],
  );

  async function handleSaveAndContinue() {
    setSubmitError(null);

    // Validasi field wajib
    if (!addressLine.trim()) {
      setSubmitError(t("errors.addressRequired"));
      return;
    }
    if (!subdistrict) {
      setSubmitError(t("errors.subdistrictRequired"));
      return;
    }
    if (!recipientName.trim()) {
      setSubmitError(t("errors.recipientNameRequired"));
      return;
    }
    const normalizedRecipientPhone = normalizePhoneInput(recipientPhone);
    if (!normalizedRecipientPhone) {
      setSubmitError(t("errors.recipientPhoneRequired"));
      return;
    }
    if (!isValidRecipientPhone(normalizedRecipientPhone)) {
      setSubmitError(t("errors.recipientPhoneInvalid"));
      return;
    }
    if (recipientPhone !== normalizedRecipientPhone) {
      setRecipientPhone(normalizedRecipientPhone);
    }

    // Validasi tanggal minimal H+2
    if (!date) {
      setSubmitError(t("errors.deliveryDateRequired"));
      return;
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const minDate = new Date(today);
    minDate.setDate(today.getDate() + 2);
    const selectedDate = new Date(date);
    selectedDate.setHours(0, 0, 0, 0);
    if (selectedDate < minDate) {
      setSubmitError(
        t("errors.deliveryDateMin", {
          date: minDate.toLocaleDateString(locale, {
            day: "2-digit",
            month: "long",
            year: "numeric",
          }),
        }),
      );
      return;
    }

    setIsSubmitting(true);

    try {
      if (!documentId) {
        throw new Error(t("errors.invalidOrderId"));
      }

      if (!orderItems.length) {
        throw new Error(t("errors.orderDetailUnavailable"));
      }

      const response = await fetch(`/api/orders/${documentId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...orderPayload,
          recipient_phone_no: normalizedRecipientPhone,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result?.success) {
        const message =
          typeof result?.error === "string"
            ? result.error
            : t("errors.saveOrderFailed");
        throw new Error(message);
      }

      const orderRecord = result.data?.data ?? result.data ?? null;
      const existingSummary = (() => {
        try {
          if (typeof window === "undefined") return null;
          const raw = window.sessionStorage.getItem("ksm_order_summary");
          return raw ? JSON.parse(raw) : null;
        } catch {
          return null;
        }
      })();
      const savedOrderId =
        orderRecord?.id ??
        existingSummary?.orderId ??
        result.data?.id ??
        orderId ??
        null;
      const orderDocumentId =
        orderRecord?.documentId ??
        existingSummary?.documentId ??
        documentId ??
        (savedOrderId != null ? String(savedOrderId) : null);
      const summaryData = {
        ...existingSummary,
        orderId: savedOrderId,
        documentId: orderDocumentId,
        deliveryDate,
        deliveryTime,
        addressName,
        addressLine,
        subdistrict,
        pinpoint,
        latitude,
        longitude,
        recipientName,
        recipientPhone: normalizedRecipientPhone,
        notes,
        items: orderItems.map((item) => ({
          id: item.id,
          productId: item.id,
          name: item.name,
          image: "",
          basePrice:
            item.basePrice ?? item.unitPrice - getAddOnTotal(item.addOns),
          addOns: item.addOns,
          quantity: item.quantity,
          slug: "",
          category: "Pesanan",
        })),
      };

      if (typeof window !== "undefined") {
        window.sessionStorage.setItem(
          "ksm_order_summary",
          JSON.stringify(summaryData),
        );
      }

      if (!orderDocumentId) {
        throw new Error(t("errors.orderIdUnavailable"));
      }

      allowNavigationRef.current = true;
      router.push(`/order-info/${orderDocumentId}/summary`);
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : t("errors.saveOrderFailed"),
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  function updateOrderQuantity(index: number, quantity: number) {
    const sourceItem = sessionItems[index];
    const minimumQuantity = sourceItem
      ? getMinimumOrderQuantity({
        slug: sourceItem.slug ?? "",
        category: sourceItem.category ?? "",
        name: sourceItem.name,
      })
      : 1;
    if (quantity < minimumQuantity) {
      setSubmitError(t("errors.minimumQuantity", { count: minimumQuantity }));
      return;
    }
    setSubmitError(null);
    // Update via sessionItems kalau ada
    if (sessionItems.length > index) {
      const session = sessionItems[index];
      const unitPrice = getSessionUnitPrice(session);
      setSessionItems((current) =>
        current.map((item, i) => (i === index ? { ...item, quantity } : item)),
      );
      // Sync ke orderDetails juga kalau ada
      setOrderDetails((current) =>
        current.map((detail, i) => {
          if (i !== index) return detail;
          return {
            ...detail,
            qty: String(quantity),
            amount: String(quantity * unitPrice),
            total_amount: String(quantity * unitPrice),
          };
        }),
      );
      return;
    }

    // Fallback pakai selling_price dari API
    setOrderDetails((current) =>
      current.map((detail, detailIndex) => {
        if (detailIndex !== index) return detail;
        const unitPrice = parseAmount(detail.selling_price);
        const total = quantity * unitPrice;
        return {
          ...detail,
          qty: String(quantity),
          amount: String(total),
          total_amount: String(total),
        };
      }),
    );
  }

  async function handleConfirmLeavePage() {
    if (!documentId || !pendingNavigationHref) return;

    setIsDeletingDraftOrder(true);
    setSubmitError(null);

    try {
      const response = await fetch(`/api/orders/${documentId}`, {
        method: "DELETE",
        credentials: "include",
      });
      const result = await response.json().catch(() => null);

      if (!response.ok || !result?.success) {
        throw new Error(
          typeof result?.error === "string"
            ? result.error
            : "Gagal menghapus pesanan. Coba lagi.",
        );
      }

      window.sessionStorage.removeItem("ksm_order_summary");
      allowNavigationRef.current = true;
      setLeaveDialogOpen(false);

      const nextUrl = new URL(pendingNavigationHref);
      if (nextUrl.origin === window.location.origin) {
        router.push(`${nextUrl.pathname}${nextUrl.search}${nextUrl.hash}`);
      } else {
        window.location.assign(nextUrl.href);
      }
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Gagal menghapus pesanan. Coba lagi.",
      );
    } finally {
      setIsDeletingDraftOrder(false);
    }
  }

  return (
    <>
      <div className="mx-auto max-w-6xl px-6 py-10">
        <h1 className="text-2xl font-bold text-tertiary-900 mb-6 text-center">
          {t("title")} <span className="text-red-800">{t("titleAccent")}</span>
        </h1>

        <div className="mb-8">
          <div className="relative">
            <div className="absolute inset-x-6 top-1/2 h-px bg-gray-200" />
            <div className="grid grid-cols-2 gap-4">
              <div className="relative flex flex-col items-center gap-3 text-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-primary-500 bg-primary-500 text-white text-sm font-bold">
                  1
                </div>
                <p className="text-sm font-semibold text-tertiary-900">
                  {t("steps.info")}
                </p>
              </div>

              <div className="relative flex flex-col items-center gap-3 text-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 bg-white text-secondary-500 text-sm font-bold">
                  2
                </div>
                <p className="text-sm text-secondary-500">
                  {t("steps.summary")}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left column - form */}
          <div className="col-span-2">
            <div className="rounded-lg border border-secondary-300 bg-white p-5">
              <h2 className="mb-4 text-lg font-semibold">
                {t("deliveryInfo")}
              </h2>

              <div className="flex flex-col gap-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    {t("fields.date")}
                  </label>
                  <InputGroup>
                    <InputGroupInput
                      id="date-required"
                      value={value}
                      placeholder={t("placeholders.date")}
                      onChange={(e) => {
                        const date = new Date(e.target.value);
                        setValue(e.target.value);
                        if (isValidDate(date)) {
                          setDate(date);
                          setMonth(date);
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "ArrowDown") {
                          e.preventDefault();
                          setOpen(true);
                        }
                      }}
                    />
                    <InputGroupAddon align="inline-end">
                      <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                          <InputGroupButton
                            id="date-picker"
                            variant="ghost"
                            size="icon-xs"
                            aria-label={t("actions.selectDate")}
                          >
                            <CalendarIcon />
                            <span className="sr-only">
                              {t("actions.selectDate")}
                            </span>
                          </InputGroupButton>
                        </PopoverTrigger>
                        <PopoverContent
                          className="w-auto overflow-hidden p-0"
                          align="end"
                          alignOffset={-8}
                          sideOffset={10}
                        >
                          <Calendar
                            mode="single"
                            selected={date}
                            month={month}
                            onMonthChange={setMonth}
                            onSelect={(date) => {
                              setDate(date);
                              setValue(formatDate(date));
                              setOpen(false);
                            }}
                          />
                        </PopoverContent>
                      </Popover>
                    </InputGroupAddon>
                  </InputGroup>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    {t("fields.arrivalTime")}
                  </label>
                  <Input
                    type="time"
                    id="time-picker-optional"
                    step="1"
                    value={deliveryTime}
                    onChange={(e) => setDeliveryTime(e.target.value)}
                    className="appearance-none bg-background [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    {t("fields.fullAddress")}{" "}
                    <span className="text-red-600">*</span>
                  </label>
                  <textarea
                    value={addressLine}
                    onChange={(e) => setAddressLine(e.target.value)}
                    placeholder={t("placeholders.fullAddress")}
                    rows={3}
                    className="w-full rounded-lg border px-3 py-2 text-sm"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    {t("fields.subdistrict")}{" "}
                    <span className="text-red-600">*</span>
                  </label>
                  <select
                    value={subdistrict}
                    onChange={(e) => setSubdistrict(e.target.value)}
                    className="w-full rounded-lg border px-3 py-2"
                  >
                    <option value="">{t("placeholders.subdistrict")}</option>
                    {subdistrict &&
                      !kelurahanOptions.some(
                        (option) => option.value === subdistrict,
                      ) && <option value={subdistrict}>{subdistrict}</option>}
                    {kelurahanOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    {t("fields.pinpoint")}{" "}
                    <span className="text-red-600">*</span>
                  </label>
                  <div className="rounded-2xl border border-secondary-300 bg-white p-3">
                    <div className="mb-3 rounded-lg border border-secondary-200 bg-gray-50 px-3 py-2">
                      <input
                        type="text"
                        value={pinpoint}
                        onChange={(e) => setPinpoint(e.target.value)}
                        placeholder={t("placeholders.pinpoint")}
                        className="w-full bg-transparent text-sm outline-none"
                      />
                    </div>
                    <div className="overflow-hidden rounded-xl border border-secondary-300 bg-gray-100">
                      <div
                        ref={mapRef}
                        className="h-72 w-full"
                        aria-label={t("mapAriaLabel")}
                      />
                    </div>
                    <p className="mt-2 text-sm text-secondary-600">
                      {t("mapHelp")}
                    </p>
                    {latitude !== null && longitude !== null && (
                      <p className="mt-2 text-sm text-secondary-700">
                        {t("coordinates")}: {latitude.toFixed(6)},{" "}
                        {longitude.toFixed(6)}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    {t("fields.recipientName")}{" "}
                    <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    placeholder={t("placeholders.recipientName")}
                    className="w-full rounded-lg border px-3 py-2"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    {t("fields.recipientPhone")}{" "}
                    <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="tel"
                    value={recipientPhone}
                    onChange={(e) =>
                      setRecipientPhone(normalizePhoneInput(e.target.value))
                    }
                    placeholder="081234567890"
                    inputMode="numeric"
                    pattern="(62|08)[0-9]{8,13}"
                    minLength={10}
                    maxLength={15}
                    aria-describedby="recipient-phone-help"
                    className="w-full rounded-lg border px-3 py-2"
                  />
                  <p
                    id="recipient-phone-help"
                    className="mt-1 text-xs text-secondary-500"
                  >
                    {t("phoneHelp")}
                  </p>
                </div>

                <div className="mt-6 flex items-center justify-between gap-4">
                  <p className="text-sm text-secondary-600">
                    {t("savedAddressHelp")}
                  </p>
                  <button
                    type="button"
                    disabled={savedAddresses.length === 0}
                    onClick={() => {
                      const address = savedAddresses[0];
                      if (address) {
                        setAddressName(address.addressName);
                        setAddressLine(address.addressLine);
                        setSubdistrict(address.subdistrict);
                        setPinpoint(address.pinpoint);
                        setRecipientName(address.recipientName);
                        setRecipientPhone(address.recipientPhone);
                        setLatitude(address.latitude ?? null);
                        setLongitude(address.longitude ?? null);
                      }
                    }}
                    className="rounded-full border border-primary-500 bg-primary-50 px-4 py-2 text-sm font-semibold text-primary-700 transition hover:bg-primary-100 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {t("actions.chooseAddress")}
                  </button>
                </div>

                <div className="mt-6">
                  <label className="mb-2 block font-semibold">
                    {t("fields.notes")}
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder={t("placeholders.notes")}
                    className="w-full rounded-lg border px-3 py-2 text-sm"
                    rows={3}
                  />
                </div>

                <div className="mt-6 rounded-2xl border border-secondary-200 bg-gray-50 p-4">
                  <p className="text-sm font-semibold text-tertiary-900">
                    {t("deliveryMethod.title")}
                  </p>
                  <p className="mt-2 text-sm text-secondary-700">
                    {t("deliveryMethod.description")}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right column - summary */}
          <aside className="sticky top-24">
            <div className="rounded-lg border border-secondary-300 bg-white p-5">
              <div className="mb-5">
                <div>
                  <h3 className="text-lg font-semibold">
                    {t("orderInfoTitle")}
                  </h3>
                  <p className="text-sm text-secondary-600">
                    {t("itemCount", {
                      count: itemCount,
                      items: orderItems.length,
                    })}
                  </p>
                </div>
              </div>

              {isOrderLoading ? (
                <div className="rounded-xl border border-dashed border-secondary-300 bg-gray-50 p-4 text-sm text-secondary-600">
                  {t("loadingOrderDetails")}
                </div>
              ) : orderItems.length === 0 ? (
                <div className="rounded-xl border border-dashed border-secondary-300 bg-gray-50 p-4 text-sm text-secondary-600">
                  {t("emptyOrderDetails")}
                </div>
              ) : (
                <div className="space-y-4">
                  {orderItems.map((item, index) => {
                    const minimumQuantity = sessionItems[index]
                      ? getMinimumOrderQuantity({
                        slug: sessionItems[index].slug ?? "",
                        category: sessionItems[index].category ?? "",
                        name: sessionItems[index].name,
                      })
                      : 1;
                    return (
                      <div
                        key={item.id}
                        className="rounded-2xl border border-secondary-200 bg-gray-50 p-4"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-tertiary-900 line-clamp-2">
                              {item.name}
                            </p>
                            {item.addOnLabels && (
                              <p className="mt-2 text-xs text-secondary-600 leading-relaxed">
                                {item.addOnLabels}
                              </p>
                            )}
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-secondary-600">
                              {formatRupiah(item.unitPrice)} / {t("unit")}
                            </p>
                          </div>
                        </div>
                        <div className="mt-4 flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2 rounded-full border border-secondary-300 bg-white px-2 py-1">
                            <button
                              type="button"
                              onClick={() =>
                                updateOrderQuantity(index, item.quantity - 1)
                              }
                              disabled={item.quantity <= minimumQuantity}
                              className="h-8 w-8 rounded-full text-sm font-bold text-tertiary-900 transition hover:bg-secondary-100"
                            >
                              −
                            </button>
                            <span className="min-w-[2rem] text-center text-sm font-semibold text-tertiary-900">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                updateOrderQuantity(index, item.quantity + 1)
                              }
                              className="h-8 w-8 rounded-full text-sm font-bold text-tertiary-900 transition hover:bg-secondary-100"
                            >
                              +
                            </button>
                          </div>
                          <div className="text-right text-sm font-semibold text-tertiary-900">
                            <div>{t("total")}</div>
                            <div>{formatRupiah(orderSubtotal)}</div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="mt-5 border-t border-secondary-200 pt-4 text-sm text-secondary-700">
                <div className="flex justify-between">
                  <span>{t("subtotal")}</span>
                  <span>{formatRupiah(orderSubtotal)}</span>
                </div>
                {extraChargeRows.length > 0 && (
                  <div className="mt-3 space-y-3">
                    {extraChargeRows.map((row) => (
                      <div
                        key={row.key}
                        className="flex items-start justify-between gap-3 text-xs text-secondary-600"
                      >
                        <span className="min-w-0">
                          {t("extraCharge")}: {row.label}
                          <span className="block text-secondary-500">
                            {row.quantity} x {formatRupiah(row.unitPrice)}
                          </span>
                        </span>
                        <span className="shrink-0">{formatRupiah(row.total)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-secondary-200 pt-4">
                <span className="text-lg font-bold">{t("total")}</span>
                <span className="text-xl font-bold">
                  {formatRupiah(orderTotal)}
                </span>
              </div>

              {submitError && (
                <p className="mt-3 text-sm text-red-600">{submitError}</p>
              )}

              <button
                onClick={handleSaveAndContinue}
                disabled={
                  orderItems.length === 0 || isOrderLoading || isSubmitting
                }
                className="mt-5 w-full rounded-lg bg-primary-500 py-3 text-sm font-bold text-white transition hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting
                  ? t("actions.saving")
                  : t("actions.continueSummary")}
              </button>
            </div>
          </aside>
        </div>
      </div>
      <AlertDialog open={leaveDialogOpen} onOpenChange={setLeaveDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("leaveConfirm.title")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("leaveConfirm.description")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeletingDraftOrder}>
              {t("leaveConfirm.cancel")}
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={isDeletingDraftOrder}
              onClick={(event) => {
                event.preventDefault();
                void handleConfirmLeavePage();
              }}
              className="bg-[#8D0000] text-white hover:bg-[#6f0000]"
            >
              {isDeletingDraftOrder
                ? t("leaveConfirm.deleting")
                : t("leaveConfirm.confirm")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}