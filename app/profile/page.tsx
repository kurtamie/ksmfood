"use client";

import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/context/authContext";
import type { User } from "@/types/users";

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

function toCoordinate(value: unknown): number | null {
  if (typeof value !== "string" && typeof value !== "number") return null;
  const coordinate = Number(value);
  return Number.isFinite(coordinate) ? coordinate : null;
}

export default function AccountPage() {
  const { user } = useAuth();
  const currentUser = user as User | null;

  const [customerName, setCustomerName] = useState<string>(() => {
    try {
      if (typeof window === "undefined") return "";
      const raw = localStorage.getItem("ksm_customer");
      if (!raw) return "";
      const parsed = JSON.parse(raw);
      return parsed.name || "";
    } catch {
      return "";
    }
  });

  const [phone, setPhone] = useState<string>(() => {
    try {
      if (typeof window === "undefined") return "";
      const raw = localStorage.getItem("ksm_customer");
      if (!raw) return "";
      const parsed = JSON.parse(raw);
      return parsed.phone || "";
    } catch {
      return "";
    }
  });

  const [addressLine, setAddressLine] = useState<string>(() => {
    try {
      if (typeof window === "undefined") return "";
      return localStorage.getItem("ksm_customer_address") || "";
    } catch {
      return "";
    }
  });
  const [subdistrict, setSubdistrict] = useState("");
  const [pinpoint, setPinpoint] = useState("");
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [initialName, setInitialName] = useState<string>(customerName);
  const [initialPhone, setInitialPhone] = useState<string>(phone);
  const [initialAddress, setInitialAddress] = useState<string>(addressLine);
  const [initialSubdistrict, setInitialSubdistrict] = useState("");
  const [initialLatitude, setInitialLatitude] = useState<number | null>(null);
  const [initialLongitude, setInitialLongitude] = useState<number | null>(null);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVisible, setToastVisible] = useState(false);
  const initialLoadedRef = useRef(false);
  const mapRef = useRef<HTMLDivElement | null>(null);
  const leafletLoadedRef = useRef(false);
  const toastTimeoutRef = useRef<number | null>(null);

  type LeafletMap = {
    setView: (center: [number, number], zoom: number) => void;
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
  const mapInstanceRef = useRef<LeafletMap | null>(null);
  const markerRef = useRef<MarkerType | null>(null);

  const hasSavedAddress = addressLine.trim().length > 0;
  const hasChanges =
    customerName !== initialName ||
    phone !== initialPhone ||
    addressLine !== initialAddress ||
    subdistrict !== initialSubdistrict ||
    latitude !== initialLatitude ||
    longitude !== initialLongitude;

  function showToast(message: string) {
    setToastMessage(message);
    setToastVisible(true);
    if (toastTimeoutRef.current) {
      window.clearTimeout(toastTimeoutRef.current);
    }
    toastTimeoutRef.current = window.setTimeout(
      () => setToastVisible(false),
      3000,
    );
  }

  useEffect(() => {
    if (!currentUser || initialLoadedRef.current) return;

    const nextName = currentUser.username ?? "";
    const nextPhone = currentUser.phone_no ?? "";
    const nextAddress = currentUser.customer?.address ?? "";
    const nextSubdistrict = currentUser.customer?.subdistrict ?? "";
    const nextLatitude = toCoordinate(currentUser.customer?.latitude);
    const nextLongitude = toCoordinate(currentUser.customer?.longitude);

    setCustomerName(nextName);
    setPhone(nextPhone);
    setAddressLine(nextAddress);
    setSubdistrict(nextSubdistrict);
    setLatitude(nextLatitude);
    setLongitude(nextLongitude);
    if (nextLatitude !== null && nextLongitude !== null) {
      setPinpoint(`${nextLatitude.toFixed(6)}, ${nextLongitude.toFixed(6)}`);
    }

    setInitialName(nextName);
    setInitialPhone(nextPhone);
    setInitialAddress(nextAddress);
    setInitialSubdistrict(nextSubdistrict);
    setInitialLatitude(nextLatitude);
    setInitialLongitude(nextLongitude);
    localStorage.setItem("ksm_customer_address", nextAddress);
    initialLoadedRef.current = true;
  }, [currentUser]);

  function buildProfilePayload() {
    const payload: {
      name?: string;
      phone?: string;
      address?: string;
      subdistrict?: string;
      latitude?: number | null;
      longitude?: number | null;
    } = {};

    if (customerName !== initialName) payload.name = customerName;
    if (phone !== initialPhone) payload.phone = phone;
    if (addressLine !== initialAddress) payload.address = addressLine;
    if (subdistrict !== initialSubdistrict) payload.subdistrict = subdistrict;
    if (latitude !== initialLatitude) payload.latitude = latitude;
    if (longitude !== initialLongitude) payload.longitude = longitude;

    return payload;
  }

  async function persistProfile(successMessage: string) {
    const payload = buildProfilePayload();
    if (Object.keys(payload).length === 0) {
      showToast("Tidak ada perubahan");
      return true;
    }

    try {
      setIsSaving(true);
      localStorage.setItem(
        "ksm_customer",
        JSON.stringify({ name: customerName, phone }),
      );
      localStorage.setItem("ksm_customer_address", addressLine);

      const response = await fetch("/api/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Profile update error:", errorText);
        showToast("Gagal menyimpan profil");
        return false;
      }

      setInitialName(customerName);
      setInitialPhone(phone);
      setInitialAddress(addressLine);
      setInitialSubdistrict(subdistrict);
      setInitialLatitude(latitude);
      setInitialLongitude(longitude);
      showToast(successMessage);
      return true;
    } catch (error) {
      console.error(error);
      showToast("Gagal menyimpan profil");
      return false;
    } finally {
      setIsSaving(false);
    }
  }

  async function saveProfile() {
    await persistProfile("Profil berhasil diperbarui");
  }

  function openAddressModal() {
    if (latitude !== null && longitude !== null && !pinpoint) {
      setPinpoint(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
    }
    setShowModal(true);
  }

  async function saveAddress() {
    if (!addressLine.trim()) {
      showToast("Alamat lengkap wajib diisi");
      return;
    }
    if (latitude === null || longitude === null) {
      showToast("Pinpoint lokasi wajib dipilih");
      return;
    }

    const saved = await persistProfile("Alamat berhasil disimpan");
    if (saved) setShowModal(false);
  }

  useEffect(() => {
    if (!showModal || !mapRef.current || typeof window === "undefined") {
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

      if (cancelled || mapInstanceRef.current) return;

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
        const center: [number, number] =
          latitude !== null && longitude !== null
            ? [latitude, longitude]
            : [1.1265, 104.0236];

        map.setView(center, latitude !== null && longitude !== null ? 15 : 13);
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: "&copy; OpenStreetMap contributors",
        }).addTo(map);

        if (latitude !== null && longitude !== null) {
          markerRef.current = L.marker([latitude, longitude]).addTo(map);
        }

        map.on("click", (event) => {
          const { lat, lng } = event.latlng;
          setLatitude(lat);
          setLongitude(lng);
          setPinpoint(`${lat.toFixed(6)}, ${lng.toFixed(6)}`);
          if (markerRef.current) map.removeLayer(markerRef.current);
          markerRef.current = L.marker([lat, lng]).addTo(map);
        });

        mapInstanceRef.current = map;
        leafletLoadedRef.current = true;
      } catch (error) {
        console.error("Leaflet init error", error);
      }
    };

    void loadLeaflet();

    return () => {
      cancelled = true;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markerRef.current = null;
        leafletLoadedRef.current = false;
      }
    };
  }, [showModal]);

  useEffect(() => {
    if (!showModal || !leafletLoadedRef.current || !mapInstanceRef.current) {
      return;
    }

    const query = pinpoint || subdistrict;
    if (!query) return;

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
        .then((response) => response.json())
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
          if (markerRef.current) map.removeLayer(markerRef.current);
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
  }, [pinpoint, subdistrict, showModal]);

  useEffect(() => {
    if (!showModal || !leafletLoadedRef.current || !mapInstanceRef.current) {
      return;
    }
    if (latitude === null || longitude === null) return;

    const map = mapInstanceRef.current;
    map.setView([latitude, longitude], 15);
    type LeafletGlobal = {
      marker: (coords: [number, number]) => MarkerType;
    };
    const L = (window as unknown as { L: LeafletGlobal }).L;
    if (markerRef.current) map.removeLayer(markerRef.current);
    markerRef.current = L.marker([latitude, longitude]).addTo(map);
  }, [latitude, longitude, showModal]);

  return (
    <div className="relative mx-auto max-w-5xl px-6 py-10">
      {toastVisible && (
        <div className="fixed inset-x-0 top-6 z-80 flex justify-center px-4">
          <div className="rounded-full bg-black/90 px-4 py-2 text-sm text-white shadow-lg">
            {toastMessage}
          </div>
        </div>
      )}

      <h1 className="mb-6 text-2xl font-semibold text-tertiary-900">
        Pengaturan dan Alamat
      </h1>

      <div className="grid grid-cols-1 gap-6">
        <div>
          <label className="mb-1 block text-sm">Nama Customer</label>
          <input
            value={customerName}
            onChange={(event) => setCustomerName(event.target.value)}
            className="w-full rounded-md border px-3 py-2"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm">Nomor Handphone</label>
          <input
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            className="w-full rounded-md border px-3 py-2"
          />
        </div>

        <div>
          <button
            onClick={saveProfile}
            disabled={!hasChanges || isSaving}
            className="rounded-md bg-red-600 px-4 py-2 text-white disabled:opacity-50"
          >
            {isSaving ? "Menyimpan..." : "Simpan"}
          </button>
        </div>

        <div className="mt-6 flex items-center justify-between gap-4">
          <h2 className="text-xl font-semibold">Alamat Pengiriman</h2>
          <button
            type="button"
            onClick={openAddressModal}
            className="rounded-md bg-red-600 px-4 py-2 text-white"
          >
            {hasSavedAddress ? "Ubah Alamat" : "Tambah Alamat Baru"}
          </button>
        </div>

        {hasSavedAddress ? (
          <div className="rounded-md border bg-white p-4">
            <p className="text-sm text-secondary-600">{addressLine}</p>
            <p className="mt-1 text-sm text-secondary-600">
              Kelurahan: {subdistrict}
            </p>
            {latitude !== null && longitude !== null && (
              <p className="mt-2 text-sm text-secondary-700">
                Koordinat: {latitude.toFixed(6)}, {longitude.toFixed(6)}
              </p>
            )}
          </div>
        ) : (
          <p className="text-sm text-secondary-600">
            Belum ada alamat tersimpan.
          </p>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-70 flex items-start justify-center overflow-auto bg-black/40 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-auto rounded-md bg-white p-6">
            <h3 className="mb-4 text-lg font-semibold">
              {hasSavedAddress ? "UBAH ALAMAT" : "TAMBAH ALAMAT"}
            </h3>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="mb-1 block text-sm">Alamat Lengkap *</label>
                <textarea
                  value={addressLine}
                  onChange={(event) => setAddressLine(event.target.value)}
                  rows={3}
                  className="w-full rounded-md border px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm">Kelurahan *</label>
                <select
                  value={subdistrict}
                  onChange={(event) => setSubdistrict(event.target.value)}
                  className="w-full rounded-md border px-3 py-2"
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
                <label className="mb-1 block text-sm">Pinpoint Lokasi *</label>
                <div className="rounded-md border bg-white p-3">
                  <div className="mb-3 rounded-md border bg-gray-50 px-3 py-2">
                    <input
                      type="text"
                      value={pinpoint}
                      onChange={(event) => setPinpoint(event.target.value)}
                      placeholder="Cari lokasi / ketik nama tempat"
                      className="w-full bg-transparent text-sm outline-none"
                    />
                  </div>
                  <div className="overflow-hidden rounded-md border bg-gray-100">
                    <div
                      ref={mapRef}
                      className="h-72 w-full"
                      aria-label="Peta alamat customer"
                    />
                  </div>
                  <p className="mt-2 text-xs text-secondary-500">
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

              <div className="mt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-md border px-4 py-2"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={saveAddress}
                  disabled={isSaving}
                  className="rounded-md bg-red-600 px-4 py-2 text-white disabled:opacity-50"
                >
                  {isSaving ? "Menyimpan..." : "Simpan"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
