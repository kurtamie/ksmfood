"use client";

import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/context/authContext";
import type { User } from "@/types/users";

type Address = {
  id: string;
  name: string;
  addressLine: string;
  kelurahan?: string;
  latitude?: number;
  longitude?: number;
  recipientName?: string;
  recipientPhone?: string;
};

function generateAddressId() {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }
  return String(Math.random()).slice(2);
}

function parseCustomerAddress(raw?: string | null): Address[] {
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);

    if (Array.isArray(parsed)) {
      return parsed.map((item) => ({
        id: item?.id ?? generateAddressId(),
        name: item?.name ?? "Alamat",
        addressLine: item?.addressLine ?? item?.address ?? "",
        kelurahan: item?.kelurahan,
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
        recipientName: item?.recipientName,
        recipientPhone: item?.recipientPhone,
      }));
    }

    if (typeof parsed === "string") {
      return [
        {
          id: generateAddressId(),
          name: "Alamat",
          addressLine: parsed,
        },
      ];
    }
  } catch {
    // If parsing fails, ignore and return empty array
  }

  return [];
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

  const [addresses, setAddresses] = useState<Address[]>(() => {
    try {
      if (typeof window === "undefined") return [];
      const raw = localStorage.getItem("ksm_addresses");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
  const [showModal, setShowModal] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [initialName, setInitialName] = useState<string>(customerName);
  const [initialPhone, setInitialPhone] = useState<string>(phone);
  const [initialAddresses, setInitialAddresses] = useState<Address[]>(addresses);
  const initialLoadedRef = useRef(false);

  // modal fields
  const [aName, setAName] = useState("");
  const [aLine, setALine] = useState("");
  const [aKel, setAKel] = useState("");
  const [aRecipient, setARecipient] = useState("");
  const [aPhone, setAPhone] = useState("");
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVisible, setToastVisible] = useState(false);
  const mapRef = useRef<HTMLDivElement | null>(null);
  const leafletLoadedRef = useRef(false);
  type LeafletMap = {
    setView: (center: [number, number], zoom: number) => void;
    on: (
      event: string,
      callback: (e: { latlng: { lat: number; lng: number } }) => void,
    ) => void;
    removeLayer: (layer: MarkerType) => void;
  };
  type MarkerType = {
    addTo: (map: LeafletMap) => MarkerType;
  };
  const mapInstanceRef = useRef<LeafletMap | null>(null);
  const markerRef = useRef<MarkerType | null>(null);
  const toastTimeoutRef = useRef<number | null>(null);

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
    if (!currentUser) return;
    setCustomerName(currentUser.username ?? "");
    setPhone(currentUser.phone_no ?? "");
  }, [currentUser]);

  useEffect(() => {
    if (addresses.length > 0) return;
    if (!currentUser?.customer?.address) return;

    const parsed = parseCustomerAddress(currentUser.customer.address);
    if (parsed.length > 0) {
      setAddresses(parsed);
      localStorage.setItem("ksm_addresses", JSON.stringify(parsed));
    }
  }, [currentUser?.customer?.address, addresses.length]);

  useEffect(() => {
    if (!currentUser || initialLoadedRef.current) return;
    if (currentUser.customer?.address && addresses.length === 0) return;

    setInitialName(currentUser.username ?? "");
    setInitialPhone(currentUser.phone_no ?? "");
    setInitialAddresses(addresses);
    initialLoadedRef.current = true;
  }, [currentUser, addresses]);

  const hasChanges =
    customerName !== initialName ||
    phone !== initialPhone ||
    JSON.stringify(addresses) !== JSON.stringify(initialAddresses);

  async function saveProfile() {
    try {
      setIsSaving(true);
      localStorage.setItem(
        "ksm_customer",
        JSON.stringify({ name: customerName, phone }),
      );

      const response = await fetch("/api/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: customerName,
          phone,
          addresses,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Profile update error:", errorText);
        showToast("Gagal menyimpan profil");
        return;
      }

      showToast("Profil berhasil diperbarui");
    } catch (error) {
      console.error(error);
      showToast("Gagal menyimpan profil");
    } finally {
      setIsSaving(false);
    }
  }

  function openAdd() {
    setAName("");
    setALine("");
    setAKel("");
    setARecipient("");
    setAPhone("");
    setShowModal(true);
  }

  function saveAddress() {
    const id = generateAddressId();
    const newAddr: Address = {
      id,
      name: aName || "Alamat",
      addressLine: aLine,
      kelurahan: aKel,
      recipientName: aRecipient,
      recipientPhone: aPhone,
      latitude: latitude ?? undefined,
      longitude: longitude ?? undefined,
    };
    const next = [newAddr, ...addresses];
    setAddresses(next);
    localStorage.setItem("ksm_addresses", JSON.stringify(next));
    setShowModal(false);
    showToast("Alamat tersimpan");
  }

  function removeAddress(id: string) {
    const next = addresses.filter((a) => a.id !== id);
    setAddresses(next);
    localStorage.setItem("ksm_addresses", JSON.stringify(next));
    showToast("Alamat dihapus");
    setPendingDeleteId(null);
  }

  function confirmDeleteAddress(id: string) {
    setPendingDeleteId(id);
  }

  function cancelDelete() {
    setPendingDeleteId(null);
  }

  useEffect(() => {
    // dynamically load Leaflet CSS & JS when modal opens
    if (!mapRef.current || leafletLoadedRef.current) return;
    if (typeof window === "undefined") return;

    const loadLeaflet = async () => {
      // load CSS
      const linkId = "leaflet-css";
      if (!document.getElementById(linkId)) {
        const l = document.createElement("link");
        l.id = linkId;
        l.rel = "stylesheet";
        l.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        document.head.appendChild(l);
      }

      // load script
      if (!(window as unknown as { L?: unknown }).L) {
        await new Promise<void>((resolve, reject) => {
          const s = document.createElement("script");
          s.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
          s.async = true;
          s.onload = () => resolve();
          s.onerror = () => reject(new Error("Failed to load Leaflet"));
          document.body.appendChild(s);
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
        map.setView([1.1265, 104.0236], 13); // Batam center
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: "&copy; OpenStreetMap contributors",
        }).addTo(map);

        mapInstanceRef.current = map;
        markerRef.current = null;
        map.on("click", function (e) {
          const { lat, lng } = e.latlng;
          setLatitude(lat);
          setLongitude(lng);
          if (markerRef.current) map.removeLayer(markerRef.current);
          markerRef.current = L.marker([lat, lng]).addTo(map);
        });

        leafletLoadedRef.current = true;
      } catch (err) {
        console.error("Leaflet init error", err);
      }
    };

    // only load when modal shown
    if (showModal) loadLeaflet();
  }, [showModal]);

  useEffect(() => {
    if (!showModal || !aKel) return;
    if (!leafletLoadedRef.current || !mapInstanceRef.current) return;

    const query = `${aKel}, Batam`;
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`;
    fetch(url)
      .then((r) => r.json())
      .then((data) => {
        if (!data || data.length === 0) return;
        const loc = data[0];
        const lat = parseFloat(loc.lat);
        const lon = parseFloat(loc.lon);
        const map = mapInstanceRef.current;
        if (!map) return;
        map.setView([lat, lon], 15);
        type LeafletGlobal = {
          marker: (coords: [number, number]) => MarkerType;
        };
        const L = (window as unknown as { L: LeafletGlobal }).L;
        if (markerRef.current) map.removeLayer(markerRef.current);
        markerRef.current = L.marker([lat, lon]).addTo(map);
        setLatitude(lat);
        setLongitude(lon);
      })
      .catch((e) => console.error("Geocode error", e));
  }, [aKel, showModal]);

  return (
    <div className="mx-auto max-w-5xl px-6 py-10 relative">
      {toastVisible && (
        <div className="fixed inset-x-0 top-6 z-80 flex justify-center px-4">
          <div className="rounded-full bg-black/90 px-4 py-2 text-sm text-white shadow-lg">
            {toastMessage}
          </div>
        </div>
      )}
      <h1 className="text-2xl font-semibold text-tertiary-900 mb-6">
        Pengaturan dan Daftar Alamat
      </h1>

      <div className="grid grid-cols-1 gap-6">
        <div>
          <label className="block text-sm mb-1">Nama Customer</label>
          <input
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="w-full rounded-md border px-3 py-2"
          />
        </div>

        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm mb-1">Nomor Handphone</label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded-md border px-3 py-2"
            />
          </div>
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

        <div className="mt-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Alamat Pengiriman</h2>
          <button
            onClick={openAdd}
            className="rounded-md bg-red-600 px-4 py-2 text-white"
          >
            Tambah Alamat Baru
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.length === 0 && (
            <p className="text-sm text-secondary-600">
              Belum ada alamat tersimpan.
            </p>
          )}
          {addresses.map((addr) => (
            <div key={addr.id} className="rounded-md border p-4 bg-white">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold">{addr.name}</p>
                  <p className="text-sm text-secondary-600">
                    {addr.addressLine}
                  </p>
                  <p className="text-sm text-secondary-600">{addr.kelurahan}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => confirmDeleteAddress(addr.id)}
                    title="Hapus"
                    className="text-sm text-red-600"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-70 flex items-start justify-center overflow-auto bg-black/40 p-4">
          <div className="w-full max-w-2xl rounded-md bg-white p-6 max-h-[90vh] overflow-auto">
            <h3 className="text-lg font-semibold mb-4">TAMBAH ALAMAT</h3>
            <div className="grid grid-cols-1 gap-3">
              <div>
                <label className="block text-sm mb-1">Nama Alamat *</label>
                <input
                  value={aName}
                  onChange={(e) => setAName(e.target.value)}
                  className="w-full rounded-md border px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Alamat Lengkap *</label>
                <input
                  value={aLine}
                  onChange={(e) => setALine(e.target.value)}
                  className="w-full rounded-md border px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Kelurahan *</label>
                <select
                  value={aKel}
                  onChange={(e) => setAKel(e.target.value)}
                  className="w-full rounded-md border px-3 py-2"
                >
                  <option value="">Pilih Kelurahan</option>
                  <option value="Nagoya">Nagoya</option>
                  <option value="Batam Kota">Batam Kota</option>
                  <option value="Lubuk Baja">Lubuk Baja</option>
                  <option value="Lubuk Baja Kota">Lubuk Baja Kota</option>
                  <option value="Batu Ampar">Batu Ampar</option>
                  <option value="Batu Aji">Batu Aji</option>
                  <option value="Bengkong">Bengkong</option>
                  <option value="Sagulung">Sagulung</option>
                  <option value="Nongsa">Nongsa</option>
                  <option value="Sei Beduk">Sei Beduk</option>
                  <option value="Sungai Panas">Sungai Panas</option>
                  <option value="Belakang Padang">Belakang Padang</option>
                  <option value="Sekupang">Sekupang</option>
                  <option value="Galang">Galang</option>
                  <option value="Bulang">Bulang</option>
                  <option value="Tanjung Riau">Tanjung Riau</option>
                  <option value="Sekupang Timur">Sekupang Timur</option>
                  <option value="Lubuk Baja Baru">Lubuk Baja Baru</option>
                </select>
              </div>

              <div>
                <label className="block text-sm mb-1">Pinpoin Lokasi</label>
                <div
                  ref={mapRef}
                  id="add-address-map"
                  className="h-48 w-full rounded-md border bg-gray-100 text-sm"
                />
                <p className="mt-2 text-xs text-secondary-500">
                  Klik peta untuk memilih titik (lat/lng akan tersimpan).
                </p>
              </div>

              <div>
                <label className="block text-sm mb-1">Nama Penerima</label>
                <input
                  value={aRecipient}
                  onChange={(e) => setARecipient(e.target.value)}
                  className="w-full rounded-md border px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Telepon Penerima *</label>
                <input
                  value={aPhone}
                  onChange={(e) => setAPhone(e.target.value)}
                  className="w-full rounded-md border px-3 py-2"
                />
              </div>

              <div className="mt-4 flex justify-end gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="rounded-md border px-4 py-2"
                >
                  Batal
                </button>
                <button
                  onClick={saveAddress}
                  className="rounded-md bg-red-600 px-4 py-2 text-white"
                >
                  Simpan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {pendingDeleteId && (
        <div className="fixed inset-0 z-80 flex items-center justify-center bg-black/40 px-4 py-8">
          <div className="w-full max-w-md rounded-md bg-white p-6 shadow-xl">
            <h3 className="text-lg font-semibold mb-4">Konfirmasi Hapus</h3>
            <p className="mb-6 text-sm text-secondary-700">
              Apakah Anda yakin ingin menghapus alamat ini?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={cancelDelete}
                className="rounded-md border px-4 py-2"
              >
                Batal
              </button>
              <button
                onClick={() => removeAddress(pendingDeleteId)}
                className="rounded-md bg-red-600 px-4 py-2 text-white"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
