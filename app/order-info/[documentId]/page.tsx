"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
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

type OrderMenuRow = {
  id?: number | string;
  documentId?: string;
  rice?: string | null;
  main_dish?: string | null;
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
  menu: OrderMenuRow;
  detail: OrderDetailRow;
};

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
  if (details.length === 1) {
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

  return Array.from({ length: rowCount }, (_, index) => {
    const menu = menus[index] ?? {};
    const detail = details[index] ?? {};
    const quantity = parseAmount(detail.qty) || 1;
    const unitPrice = parseAmount(detail.selling_price);
    const total =
      parseAmount(detail.total_amount ?? detail.amount) || quantity * unitPrice;

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
      return parsed.map((item) => ({
        id: item?.id ?? String(Math.random()).slice(2),
        label: item?.name ?? item?.addressLine ?? item?.address ?? "Alamat",
        addressName: item?.name ?? item?.addressLine ?? item?.address ?? "",
        addressLine: item?.addressLine ?? item?.address ?? "",
        subdistrict: customerSubdistrict ?? "",
        pinpoint: item?.pinpoint ?? "",
        recipientName: item?.recipientName ?? "",
        recipientPhone: item?.recipientPhone ?? "",
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
      }));
    }
  } catch {
    return [
      {
        id: "customer-address",
        label: raw,
        addressName: raw,
        addressLine: raw,
        subdistrict: "",
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
        subdistrict: "",
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
  const [addressPickerOpen, setAddressPickerOpen] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    null,
  );
  const [orderId, setOrderId] = useState<number | string | null>(null);
  const [orderMenus, setOrderMenus] = useState<OrderMenuRow[]>([]);
  const [orderDetails, setOrderDetails] = useState<OrderDetailRow[]>([]);
  const [isOrderLoading, setIsOrderLoading] = useState(true);

  const savedAddresses = useMemo(
    () =>
      parseSavedAddresses(
        user?.customer?.address,
        user?.customer?.latitude,
        user?.customer?.longitude,
        user?.customer?.subdistrict,
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

  const orderItems = useMemo(
    () => toOrderDisplayItems(orderMenus, orderDetails),
    [orderDetails, orderMenus],
  );
  const itemCount = useMemo(
    () => orderItems.reduce((sum, item) => sum + item.quantity, 0),
    [orderItems],
  );
  const orderTotal = useMemo(
    () => orderItems.reduce((sum, item) => sum + item.total, 0),
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
              : "Gagal memuat detail pesanan.",
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
              : "Gagal memuat detail pesanan.",
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
  }, [documentId]);

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
      delivery_address: addressLine || undefined,
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
    setSubmitError("Alamat lengkap wajib diisi.");
    return;
  }
  if (!subdistrict) {
    setSubmitError("Kelurahan wajib dipilih.");
    return;
  }
  if (!recipientName.trim()) {
    setSubmitError("Nama penerima wajib diisi.");
    return;
  }
  if (!recipientPhone.trim()) {
    setSubmitError("Telepon penerima wajib diisi.");
    return;
  }

  // Validasi tanggal minimal H+2
  if (!date) {
    setSubmitError("Tanggal pengiriman wajib diisi.");
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
      `Tanggal pengiriman minimal ${minDate.toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })}.`,
    );
    return;
  }

  setIsSubmitting(true);

  try {
    if (!documentId) {
      throw new Error("ID pesanan tidak valid.");
    }

    if (!orderItems.length) {
      throw new Error("Detail pesanan belum tersedia.");
    }

    const response = await fetch(`/api/orders/${documentId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderPayload),
    });

    const result = await response.json();

    if (!response.ok || !result?.success) {
      const message =
        typeof result?.error === "string"
          ? result.error
          : "Gagal menyimpan pesanan. Coba lagi.";
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
      recipientPhone,
      notes,
      items: orderItems.map((item) => ({
        id: item.id,
        productId: item.id,
        name: item.name,
        image: "",
        basePrice: item.unitPrice,
        addOns: item.addOnLabels
          ? item.addOnLabels.split(", ").map((label) => ({
              label,
              value: label,
              price: 0,
            }))
          : [],
        quantity: item.quantity,
        slug: "",
        category: "Pesanan",
      })),
      totals: { subtotal: orderTotal },
    };

    if (typeof window !== "undefined") {
      window.sessionStorage.setItem(
        "ksm_order_summary",
        JSON.stringify(summaryData),
      );
    }

    if (!orderDocumentId) {
      throw new Error("Gagal mendapatkan ID pesanan dari server.");
    }

    router.push(`/order-info/${orderDocumentId}/summary`);
  } catch (error) {
    setSubmitError(
      error instanceof Error
        ? error.message
        : "Gagal menyimpan pesanan. Coba lagi.",
    );
  } finally {
    setIsSubmitting(false);
  }
}

  function updateOrderQuantity(index: number, quantity: number) {
    if (quantity <= 0) return;

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

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="text-2xl font-bold text-tertiary-900 mb-6 text-center">
        Informasi Pesanan <span className="text-red-800">& Pengiriman</span>
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
                Informasi Pesanan & Pengiriman
              </p>
            </div>

            <div className="relative flex flex-col items-center gap-3 text-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 bg-white text-secondary-500 text-sm font-bold">
                2
              </div>
              <p className="text-sm text-secondary-500">Ringkasan Pesanan</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left column - form */}
        <div className="col-span-2">
          <div className="rounded-lg border border-secondary-300 bg-white p-5">
            <h2 className="mb-4 text-lg font-semibold">Informasi Pengiriman</h2>

            <div className="flex flex-col gap-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Tanggal
                </label>
                <InputGroup>
                  <InputGroupInput
                    id="date-required"
                    value={value}
                    placeholder="June 01, 2025"
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
                          aria-label="Select date"
                        >
                          <CalendarIcon />
                          <span className="sr-only">Select date</span>
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
                  Jam Sampai
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
                  Alamat Lengkap <span className="text-red-600">*</span>
                </label>
                <textarea
                  value={addressLine}
                  onChange={(e) => setAddressLine(e.target.value)}
                  placeholder="Peumahan GMP Blok N"
                  rows={3}
                  className="w-full rounded-lg border px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Kelurahan <span className="text-red-600">*</span>
                </label>
                <select
                  value={subdistrict}
                  onChange={(e) => setSubdistrict(e.target.value)}
                  className="w-full rounded-lg border px-3 py-2"
                >
                  <option value="">Pilih Kelurahan</option>
                  {kelurahanOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Pinpoint Lokasi <span className="text-red-600">*</span>
                </label>
                <div className="rounded-2xl border border-secondary-300 bg-white p-3">
                  <div className="mb-3 rounded-lg border border-secondary-200 bg-gray-50 px-3 py-2">
                    <input
                      type="text"
                      value={pinpoint}
                      onChange={(e) => setPinpoint(e.target.value)}
                      placeholder="Cari lokasi / ketik nama tempat"
                      className="w-full bg-transparent text-sm outline-none"
                    />
                  </div>
                  <div className="overflow-hidden rounded-xl border border-secondary-300 bg-gray-100">
                    <div
                      ref={mapRef}
                      className="h-72 w-full"
                      aria-label="Peta lokasi pengiriman"
                    />
                  </div>
                  <p className="mt-2 text-sm text-secondary-600">
                    Klik peta untuk menandai lokasi dan simpan
                    latitude/longitude.
                  </p>
                  {latitude !== null && longitude !== null && (
                    <p className="mt-2 text-sm text-secondary-700">
                      Koordinat: {latitude.toFixed(6)}, {longitude.toFixed(6)}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Nama Penerima <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  placeholder="Nama penerima"
                  className="w-full rounded-lg border px-3 py-2"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Telepon Penerima <span className="text-red-600">*</span>
                </label>
                <input
                  type="tel"
                  value={recipientPhone}
                  onChange={(e) => setRecipientPhone(e.target.value)}
                  placeholder="081234567890"
                  className="w-full rounded-lg border px-3 py-2"
                />
              </div>

              <div className="mt-6 flex items-center justify-between gap-4">
                <p className="text-sm text-secondary-600">
                  Jika sudah pernah menyimpan alamat di akun, alamat akan
                  terpilih otomatis.
                </p>
                <button
                  type="button"
                  onClick={() => setAddressPickerOpen(true)}
                  className="rounded-full border border-primary-500 bg-primary-50 px-4 py-2 text-sm font-semibold text-primary-700 transition hover:bg-primary-100"
                >
                  Pilih Alamat
                </button>
              </div>

            {addressPickerOpen && (
              <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-4 py-6">
                <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-xl">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">
                      Lokasi Pengiriman
                    </h3>
                    <button
                      type="button"
                      onClick={() => setAddressPickerOpen(false)}
                      className="text-secondary-600 hover:text-tertiary-900"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="mt-5 space-y-4">
                    <select
                      value={selectedAddressId ?? ""}
                      onChange={(e) => setSelectedAddressId(e.target.value)}
                      className="w-full rounded-lg border px-3 py-2"
                    >
                      <option value="">-- Pilih Alamat --</option>
                      {savedAddresses.map((address) => (
                        <option key={address.id} value={address.id}>
                          {address.label}
                        </option>
                      ))}
                    </select>

                    <button
                      type="button"
                      disabled={!selectedAddressId}
                      onClick={() => {
                        const address = savedAddresses.find(
                          (item) => item.id === selectedAddressId,
                        );
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
                        setAddressPickerOpen(false);
                      }}
                      className="w-full rounded-xl bg-primary-500 py-3 text-sm font-bold text-white hover:bg-primary-600 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Konfirmasi Pilihan
                    </button>
                  </div>
                </div>
              </div>
            )}

              <div className="mt-6">
                <label className="mb-2 block font-semibold">
                  Catatan Pengiriman (Opsional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Silahkan isi catatan untuk kurir, jika ada"
                  className="w-full rounded-lg border px-3 py-2 text-sm"
                  rows={3}
                />
              </div>

              <div className="mt-6 rounded-2xl border border-secondary-200 bg-gray-50 p-4">
                <p className="text-sm font-semibold text-tertiary-900">
                  Metode Pengiriman
                </p>
                <p className="mt-2 text-sm text-secondary-700">
                  Pesanan akan diantar oleh KSM dengan gratis ongkir.
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
                <h3 className="text-lg font-semibold">Detail Pesanan</h3>
                <p className="text-sm text-secondary-600">
                  {itemCount} kotak dari {orderItems.length} item
                </p>
              </div>
            </div>

            {isOrderLoading ? (
              <div className="rounded-xl border border-dashed border-secondary-300 bg-gray-50 p-4 text-sm text-secondary-600">
                Memuat detail pesanan...
              </div>
            ) : orderItems.length === 0 ? (
              <div className="rounded-xl border border-dashed border-secondary-300 bg-gray-50 p-4 text-sm text-secondary-600">
                Detail pesanan belum tersedia.
              </div>
            ) : (
              <div className="space-y-4">
                {orderItems.map((item, index) => {
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
                            {formatRupiah(item.unitPrice)} / kotak
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
                          <div>Total</div>
                          <div>{formatRupiah(item.total)}</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="mt-5 border-t border-secondary-200 pt-4 space-y-3 text-sm text-secondary-700">
              <div className="flex items-center justify-between">
                <span>Sub Total Pesanan</span>
                <span>{formatRupiah(orderTotal)}</span>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-secondary-200 pt-4">
              <span className="text-lg font-bold">Total</span>
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
              {isSubmitting ? "Menyimpan..." : "Lanjut Ringkasan"}
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
