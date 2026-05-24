"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/authContext";
import { useCart, type CartItem } from "@/components/CartContext";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import type {
  CreateOrderDetailInput,
  CreateOrderInput,
  CreateOrderMenuInput,
} from "@/types/orders";

function formatRupiah(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}

function getItemTotalPrice(item: CartItem) {
  const addOnTotal = item.addOns.reduce((sum, a) => sum + a.price, 0);
  return (item.basePrice + addOnTotal) * item.quantity;
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

function getLeaveTime(arriveTime: string) {
  const [hourPart, minutePart] = arriveTime.split(":").slice(0, 2);
  const hour = Number(hourPart);
  const minute = Number(minutePart);
  if (Number.isNaN(hour) || Number.isNaN(minute)) return "";

  const date = new Date();
  date.setHours(hour, minute, 0, 0);
  date.setHours(date.getHours() - 1);
  return date.toTimeString().slice(0, 8);
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

function parseSavedAddresses(raw?: string | null): SavedAddress[] {
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);

    if (Array.isArray(parsed)) {
      return parsed.map((item) => ({
        id: item?.id ?? String(Math.random()).slice(2),
        label: item?.name ?? item?.addressLine ?? item?.address ?? "Alamat",
        addressName: item?.name ?? item?.addressLine ?? item?.address ?? "",
        addressLine: item?.addressLine ?? item?.address ?? "",
        subdistrict: item?.kelurahan ?? "",
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
    // Ignore parse errors.
  }

  return [];
}

export default function OrderInfoPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { state, totalPrice, updateQuantity } = useCart();
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
  const [customerId, setCustomerId] = useState<number | null>(
    () => user?.customer?.id ?? null,
  );
  const [customerDocumentId, setCustomerDocumentId] = useState<string | null>(
    () => user?.customer?.documentId ?? null,
  );
  const [addressPickerOpen, setAddressPickerOpen] = useState(false);
  const [creatingAddress, setCreatingAddress] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);

  const savedAddresses = useMemo(
    () => parseSavedAddresses(user?.customer?.address),
    [user?.customer?.address],
  );

  useEffect(() => {
    if (user?.customer?.id) {
      setCustomerId(user.customer.id);
      if (user.customer.documentId) {
        setCustomerDocumentId(user.customer.documentId);
      }
      return;
    }

    if (!user?.id || customerId != null) return;

    let cancelled = false;

    async function loadCustomer() {
      try {
        const res = await fetch("/api/customers/mine", {
          cache: "no-store",
          credentials: "include",
        });
        const json = await res.json();
        if (!cancelled && res.ok && json?.success && json.data?.id) {
          setCustomerId(Number(json.data.id));
          if (json.data.documentId) {
            setCustomerDocumentId(String(json.data.documentId));
          }
        }
      } catch {
        // Customer akan di-resolve di server saat POST order.
      }
    }

    void loadCustomer();

    return () => {
      cancelled = true;
    };
  }, [customerId, user?.id, user?.customer?.id, user?.customer?.documentId]);

  type LeafletMap = {
    setView: (coords: [number, number], zoom: number) => void;
    on: (event: string, callback: (e: { latlng: { lat: number; lng: number } }) => void) => void;
    removeLayer: (layer: MarkerType) => void;
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

  const itemCount = useMemo(
    () => state.items.reduce((sum, item) => sum + item.quantity, 0),
    [state.items],
  );

  useEffect(() => {
    if (!date) return;
    setDeliveryDate(date.toISOString().slice(0, 10));
  }, [date]);

  useEffect(() => {
    if (!mapRef.current || leafletLoadedRef.current || typeof window === "undefined") {
      return;
    }

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
  }, []);

  useEffect(() => {
    if (!leafletLoadedRef.current || !mapInstanceRef.current) {
      return;
    }

    const query = pinpoint || subdistrict || "Batam, Kepulauan Riau";
    if (!query) {
      return;
    }

    const coordinateMatch = query.match(/^[\s]*([+-]?\d+(?:\.\d+)?)[,\s]+([+-]?\d+(?:\.\d+)?)[\s]*$/);
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

  function parseCartItemToOrderMenu(item: CartItem): CreateOrderMenuInput {
    const riceAddon = item.addOns.find((a) => /^nasi_/i.test(a.value));
    const mainDishAddons = item.addOns.filter(
      (a) => /^lauk_[0-9]+_/i.test(a.value) && !/^lauk_tambahan_/i.test(a.value),
    );
    const additionalAddon = item.addOns.find((a) =>
      /^lauk_tambahan_/i.test(a.value),
    );
    const vegetableAddon = item.addOns.find((a) => /^sayur_/i.test(a.value));
    const sauceAddon = item.addOns.find((a) => /^sambal_/i.test(a.value));
    const mineralWaterAddon = item.addOns.find((a) => /^minuman_/i.test(a.value));
    const fruitAddon = item.addOns.find((a) => /(Pisang|Jeruk)/i.test(a.label));
    const chipAddon = item.addOns.find((a) => /kerupuk/i.test(a.label));

    return {
      rice: riceAddon?.label ?? undefined,
      main_dish:
        mainDishAddons.length > 0
          ? mainDishAddons.map((a) => a.label).join(", ")
          : undefined,
      additional_dish: additionalAddon?.label ?? undefined,
      vegetable: vegetableAddon?.label ?? undefined,
      sauce: sauceAddon?.label ?? undefined,
      mineral_water: mineralWaterAddon?.label ?? undefined,
      fruit: fruitAddon?.label ?? undefined,
      chip: chipAddon ? "kerupuk" : undefined,
    };
  }

  function parseCartItemToOrderDetail(item: CartItem): CreateOrderDetailInput {
    const qty = item.quantity;
    const sellingPrice = item.basePrice;
    const amount = qty * sellingPrice;
    const amountString = String(amount);

    return {
      qty: String(qty),
      selling_price: String(sellingPrice),
      amount: amountString,
      total_amount: amountString,
    };
  }

  const orderPayload = useMemo<CreateOrderInput>(
    () => ({
      customer_id: customerId ?? undefined,
      delivery_date: deliveryDate || undefined,
      arrive_time: deliveryTime || undefined,
      leave: deliveryTime ? getLeaveTime(deliveryTime) : undefined,
      delivery_address: addressLine || undefined,
      latitude: latitude !== null ? String(latitude) : undefined,
      longitude: longitude !== null ? String(longitude) : undefined,
      recipient_name: recipientName || undefined,
      recipient_phone_no: recipientPhone || undefined,
      delivery_note: notes || undefined,
      order_menus: state.items.map(parseCartItemToOrderMenu),
      order_details: state.items.map(parseCartItemToOrderDetail),
    }),
    [
      customerId,
      deliveryDate,
      deliveryTime,
      addressLine,
      latitude,
      longitude,
      recipientName,
      recipientPhone,
      notes,
      state.items,
    ],
  );

  async function resolveCustomerForOrder(): Promise<{
    id: number;
    documentId?: string;
  }> {
    if (customerId != null) {
      return {
        id: customerId,
        documentId: customerDocumentId ?? undefined,
      };
    }

    const res = await fetch("/api/customers/mine", { cache: "no-store" });
    const json = await res.json();

    if (res.ok && json?.success && json.data?.id) {
      const id = Number(json.data.id);
      if (Number.isFinite(id)) {
        setCustomerId(id);
        if (json.data.documentId) {
          setCustomerDocumentId(String(json.data.documentId));
        }
        return {
          id,
          documentId: json.data.documentId
            ? String(json.data.documentId)
            : undefined,
        };
      }
    }

    throw new Error(
      "Data customer tidak ditemukan. Silakan login ulang atau lengkapi profil terlebih dahulu.",
    );
  }

  async function handleSaveAndContinue() {
    setSubmitError(null);
    setIsSubmitting(true);

    try {
      if (!state.items.length) {
        throw new Error("Keranjang kosong. Tambahkan pesanan terlebih dahulu.");
      }

      const resolvedCustomer = await resolveCustomerForOrder();

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...orderPayload,
          customer_id: resolvedCustomer.id,
          customer_document_id: resolvedCustomer.documentId,
        }),
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
      const orderId = orderRecord?.id ?? result.data?.id ?? result.id ?? null;
      const orderDocumentId =
        orderRecord?.documentId ?? (orderId != null ? String(orderId) : null);
      const summaryData = {
        orderId,
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
        items: state.items,
        totals: { subtotal: totalPrice },
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

  const orderTotal = totalPrice;

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="text-2xl font-bold text-tertiary-900 mb-6 text-center">
        Informasi Pesanan <span className="text-red-800">& Pengiriman</span>
      </h1>

      <div className="mb-8">
        <div className="relative">
          <div className="absolute inset-x-6 top-1/2 h-px bg-gray-200" />
          <div className="grid grid-cols-3 gap-4">
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

            <div className="relative flex flex-col items-center gap-3 text-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 bg-white text-secondary-500 text-sm font-bold">
                3
              </div>
              <p className="text-sm text-secondary-500">Pembayaran</p>
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
                        const date = new Date(e.target.value)
                        setValue(e.target.value)
                        if (isValidDate(date)) {
                          setDate(date)
                          setMonth(date)
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "ArrowDown") {
                          e.preventDefault()
                          setOpen(true)
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
                      Klik peta untuk menandai lokasi dan simpan latitude/longitude.
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
                  Jika sudah pernah menyimpan alamat di akun, alamat akan terpilih
                  otomatis.
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
                      <h3 className="text-lg font-semibold">Lokasi Pengiriman</h3>
                      <button
                        type="button"
                        onClick={() => {
                          setAddressPickerOpen(false);
                          setCreatingAddress(false);
                        }}
                        className="text-secondary-600 hover:text-tertiary-900"
                      >
                        ✕
                      </button>
                    </div>

                    {!creatingAddress ? (
                      <div className="mt-5 space-y-4">
                        <select
                          value={selectedAddressId ?? ""}
                          onChange={(e) => {
                            const next = e.target.value;
                            setSelectedAddressId(next);
                            const address = savedAddresses.find(
                              (item) => item.id === next,
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
                          }}
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
                          onClick={() => setCreatingAddress(true)}
                          className="w-full rounded-xl bg-primary-500 py-3 text-sm font-bold text-white hover:bg-primary-600"
                        >
                          Buat Alamat Baru
                        </button>
                      </div>
                    ) : (
                      <div className="mt-5 space-y-4">
                        <div>
                          <label className="mb-1 block text-sm font-medium text-gray-700">
                            Nama Alamat
                          </label>
                          <input
                            type="text"
                            value={addressName}
                            onChange={(e) => setAddressName(e.target.value)}
                            className="w-full rounded-lg border px-3 py-2"
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-sm font-medium text-gray-700">
                            Alamat Lengkap
                          </label>
                          <textarea
                            value={addressLine}
                            onChange={(e) => setAddressLine(e.target.value)}
                            rows={3}
                            className="w-full rounded-lg border px-3 py-2 text-sm"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setCreatingAddress(false);
                          }}
                          className="w-full rounded-xl bg-secondary-100 py-3 text-sm font-semibold text-secondary-800"
                        >
                          Kembali
                        </button>
                      </div>
                    )}
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
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold">Detail Pesanan</h3>
                <p className="text-sm text-secondary-600">
                  {itemCount} kotak dari {state.items.length} item
                </p>
              </div>
              <button
                onClick={() => router.push("/")}
                className="rounded-full border border-primary-500 bg-primary-50 px-3 py-1.5 text-xs font-semibold text-primary-700 transition hover:bg-primary-100"
              >
                Tambah Pesanan
              </button>
            </div>

            {state.items.length === 0 ? (
              <div className="rounded-xl border border-dashed border-secondary-300 bg-gray-50 p-4 text-sm text-secondary-600">
                Keranjang kosong. Tambahkan pesanan terlebih dahulu.
              </div>
            ) : (
              <div className="space-y-4">
                {state.items.map((item) => {
                  const addOnLabels = item.addOns
                    .map((a) => a.label)
                    .join(", ");
                  const unitPrice =
                    item.basePrice +
                    item.addOns.reduce((sum, a) => sum + a.price, 0);
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
                          {addOnLabels && (
                            <p className="mt-2 text-xs text-secondary-600 leading-relaxed">
                              {addOnLabels}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-secondary-600">
                            {formatRupiah(unitPrice)} / kotak
                          </p>
                        </div>
                      </div>
                      <div className="mt-4 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2 rounded-full border border-secondary-300 bg-white px-2 py-1">
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
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
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            className="h-8 w-8 rounded-full text-sm font-bold text-tertiary-900 transition hover:bg-secondary-100"
                          >
                            +
                          </button>
                        </div>
                        <div className="text-right text-sm font-semibold text-tertiary-900">
                          <div>Total</div>
                          <div>{formatRupiah(getItemTotalPrice(item))}</div>
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
                <span>{formatRupiah(totalPrice)}</span>
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
              disabled={state.items.length === 0 || isSubmitting}
              className="mt-5 w-full rounded-lg bg-primary-500 py-3 text-sm font-bold text-white transition hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? "Menyimpan..." : "Lanjut Pembayaran"}
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
