# Plan: Ubah tombol orderNow di setiap menu → WhatsApp + sembunyikan Modal

> Dibuat: 2026-11-11 22:13 WIB | Branch: perf/static-layout | Repo: ksmfood (Next.js 16 + React 19)

## Goal
Ubah perilaku tombol `orderNow` pada kartu menu (aqiqah, bento, ricebox, prasmanan, snackBox, tumpeng, wedding) agar menekan tombol langsung membuka tautan `https://wa.me/<nomor>?text=<template>` sesuai menu yang dipilih, sekaligus menyembunyikan/Menghilangkan modal order yang tadinya dibuka oleh tombol tersebut. Untuk sesi ini modal disembunyikan (hidup kembali nanti via render block).

## Current context / assumptions
- Tech: Next.js 16 (app router, `"use client"`), React 19, TypeScript, Tailwind 4, next-intl.
- Nomor WhatsApp + helper di `const/whatsapp.tsx`:
  - `whatsappNumber = "6281371790122"`
  - `createWhatsappLink(message): string` (menghasilkan `https://wa.me/<no>?text=<encoded>`)
- 7 komponen menu berisi tombol `orderNow`:
  1. `components/landing/services/aqiqah/menu.tsx` → `PackageSection` + `AqiqahOrderModal`
  2. `components/landing/services/bento/menu.tsx` → `OrderModal`
  3. `components/landing/services/ricebox/menu.tsx` → `OrderModal`
  4. `components/landing/services/prasmanan/menu.tsx` → `OrderModalPrasmanan`
  5. `components/landing/services/snackBox/menu.tsx` → `SnackOrderModal`
  6. `components/landing/services/tumpeng/menu.tsx` → `TumpengOrderModal`
  7. `components/landing/services/wedding/menu.tsx` → `OrderModalPrasmanan`
- Setiap tombol `orderNow` saat ini memanggil `setSelectedCard(card)`, yang merender modal. Modal yang dituju adalah yang "lauk lauk" (order details).
- Template pesan belum ditentukan isinya — direncanakan template dasar bahasa Indonesia, dapat disesuaikan sejak fase 2.

## Architecture / proposed approach
1. Tambah helper baru di `const/whatsapp.tsx`:
   - `createOrderMessage(serviceName, title, subTitle?, price?)` → string template pesan Indonesia.
2. Di ke-7 `menu.tsx`, ubah `onClick` tombol kartu dari `setSelectedCard(card)` menjadi:
   ```ts
   window.open(createWhatsappLink(createOrderMessage(serviceName, card.title, card.subTitle, card.price)), "_blank");
   ```
   (aplikasi client component, `window` aman di browser).
3. Sembunyikan modal: hapus blok render `{selectedCard && <OrderModal .../>}` dari ke-7 `menu.tsx`, dan hapus import komponen modal yang tidak terpakai (tipe `PackageCard`/`...PackageCard` tetap dipakai di `useState`).
4. Modal component files (aqiqah/OrderModal.tsx, OrderModal.tsx, OrderModalPrasmanan.tsx, SnackOrderModal.tsx, TumpengOrderModal.tsx) dibiarkan ada (dead code sementara) agar회복 cepat; baris tidak di-render.
5. Verifikasi: `npm run lint` → harus 0 error; `npm run build` → exit 0.

## Step-by-step tasks
### Task 1 — Tambah helper pesan WhatsApp (DRY)
File: `const/whatsapp.tsx`
Ganti isi file dari (sekarang 9 baris):
```ts
export const whatsappNumber = "6281371790122";

export function createWhatsappLink(message: string) {
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export const whatsappLink = createWhatsappLink(
  "Halo KSM Katering, saya ingin bertanya.",
);
```
menjadi:
```ts
export const whatsappNumber = "6281371790122";

export function createWhatsappLink(message: string) {
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export function createOrderMessage(
  serviceName: string,
  title: string,
  subTitle?: string,
  price?: string,
): string {
  const packageName = [title, subTitle].filter(Boolean).join(" ");
  const pricePart = price ? ` - ${price}` : "";
  return `Halo, saya ingin memesan ${serviceName} ${packageName}${pricePart}. Mohon konfirmasi detail pesanan dan cara pembayaran.`;
}

export const whatsappLink = createWhatsappLink(
  "Halo KSM Katering, saya ingin bertanya.",
);
```

### Task 2 — `components/landing/services/aqiqah/menu.tsx`
File: `components/landing/services/aqiqah/menu.tsx`
1) Import (ganti baris pertama):
```tsx
import { createWhatsappLink, createOrderMessage } from "@/const/whatsapp";
import { LuAward, LuCheck, LuPackageOpen } from "react-icons/lu";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import type { AqiqahPackageCard } from "./OrderModal";
```
Hapus baris lama `import { AqiqahOrderModal, type AqiqahPackageCard } from "./OrderModal";` → sisa `import type { AqiqahPackageCard } from "./OrderModal";`.
2) Ganti tombol kartu (baris ≈204-209):
LIHAT OLD:
```tsx
<Button
  onClick={() => onOrder(card, serviceName)}
  className="mt-4 h-11 rounded-lg bg-[#9F0404] font-bold text-white hover:bg-[#870000]"
>
  Pesan Sekarang
</Button>
```
GANTI MENJADI:
```tsx
<Button
  onClick={() => {
    const link = createWhatsappLink(createOrderMessage(serviceName, card.title, card.subTitle, card.price));
    window.open(link, "_blank");
  }}
  className="mt-4 h-11 rounded-lg bg-[#9F0404] font-bold text-white hover:bg-[#870000]"
>
  Pesan Sekarang
</Button>
```
3) Sembunyikan modal (hapus blok):
LIHAT OLD:
```tsx
      {selectedCard && (
        <AqiqahOrderModal
          card={selectedCard}
          serviceName={selectedService}
          onClose={() => {
            setSelectedCard(null);
            setSelectedService("");
          }}
        />
      )}
```
GANTI MENJADI (hapus, sisakan komentar):
```tsx
      {/* Modal di-hide sementara — akan dihidupkan kembali saat fasa berikutnya. */}
```

### Task 3 — `components/landing/services/bento/menu.tsx`
File: `components/landing/services/bento/menu.tsx`
1) Import (ganti):
```tsx
import { createWhatsappLink, createOrderMessage } from "@/const/whatsapp";
import { OrderModal, type PackageCard } from "./OrderModal";
```
Hapus `OrderModal` yang tidak terpakai; sisakan `import type { PackageCard } from "./OrderModal";`.
2) Tombol kartu (baris ≈125-130):
LIHAT OLD:
```tsx
<Button
  onClick={() => setSelectedCard(card)}
  className="mt-3 h-11 w-full bg-red-800 text-white hover:bg-red-900"
>
  {t("orderNow")}
</Button>
```
GANTI MENJADI:
```tsx
<Button
  onClick={() => {
    window.open(createWhatsappLink(createOrderMessage(serviceName, card.title, card.price)), "_blank");
  }}
  className="mt-3 h-11 w-full bg-red-800 text-white hover:bg-red-900"
>
  {t("orderNow")}
</Button>
```
3) Sembunyikan modal: hapus blok `{selectedCard && <OrderModal card={selectedCard} serviceName={serviceName} onClose={() => setSelectedCard(null)} />}`; sisakan komentar.

### Task 4 — `components/landing/services/ricebox/menu.tsx`
File: `components/landing/services/ricebox/menu.tsx`
1) Import (ganti):
```tsx
import { createWhatsappLink, createOrderMessage } from "@/const/whatsapp";
import { OrderModal, type PackageCard } from "./OrderModal";
```
Sisa: `import type { PackageCard } from "./OrderModal";`.
2) Tombol kartu (baris ≈208-213):
LIHAT OLD:
```tsx
<Button
  onClick={() => setSelectedCard(card as PackageCard)}
  className="mt-3 h-11 w-full bg-red-800 text-white hover:bg-red-900"
>
  {t("orderNow")}
</Button>
```
GANTI MENJADI:
```tsx
<Button
  onClick={() => {
    window.open(createWhatsappLink(createOrderMessage(serviceName, card.title, card.subTitle, card.price)), "_blank");
  }}
  className="mt-3 h-11 w-full bg-red-800 text-white hover:bg-red-900"
>
  {t("orderNow")}
</Button>
```
(Kartu ricebox punya `subTitle`, mis. "(Menu Ayam/Ikan)" — teruskan.)
3) Sembunyikan modal: hapus blok `selectedCard && <OrderModal .../>`.

### Task 5 — `components/landing/services/prasmanan/menu.tsx`
File: `components/landing/services/prasmanan/menu.tsx`
1) Import (ganti):
```tsx
import { createWhatsappLink, createOrderMessage } from "@/const/whatsapp";
import { OrderModal } from "./OrderModal";
import type { PackageCard } from "./OrderModal";
```
Sisa: `import type { PackageCard } from "./OrderModal";`.
2) Tombol kartu (baris ≈232-237):
LIHAT OLD:
```tsx
<Button
  onClick={() => setSelectedCard(card)}
  className="mt-4 h-11 rounded-lg bg-[#9F0404] font-bold text-white hover:bg-[#870000]"
>
  {commonT("orderNowShort")}
</Button>
```
GANTI MENJADI:
```tsx
<Button
  onClick={() => {
    window.open(createWhatsappLink(createOrderMessage(serviceName, card.title, card.price)), "_blank");
  }}
  className="mt-4 h-11 rounded-lg bg-[#9F0404] font-bold text-white hover:bg-[#870000]"
>
  {commonT("orderNowShort")}
</Button>
```
3) Sembunyikan modal: hapus blok `selectedCard && <OrderModalPrasmanan .../>`.

### Task 6 — `components/landing/services/snackBox/menu.tsx`
File: `components/landing/services/snackBox/menu.tsx`
1) Import (ganti):
```tsx
import { createWhatsappLink, createOrderMessage } from "@/const/whatsapp";
import { SnackOrderModal, type SnackPackageCard } from "./OrderModal";
```
Sisa: `import type { SnackPackageCard } from "./OrderModal";`.
2) Tombol kartu (baris ≈111-116):
LIHAT OLD:
```tsx
<Button
  onClick={() => setSelectedCard(card)}
  className="mt-3 h-11 w-full bg-red-800 text-white hover:bg-red-900"
>
  {t("orderNow")}
</Button>
```
GANTI MENJADI:
```tsx
<Button
  onClick={() => {
    window.open(createWhatsappLink(createOrderMessage(serviceName, card.title, card.price)), "_blank");
  }}
  className="mt-3 h-11 w-full bg-red-800 text-white hover:bg-red-900"
>
  {t("orderNow")}
</Button>
```
3) Sembunyikan modal: hapus blok `selectedCard && <SnackOrderModal .../>`.

### Task 7 — `components/landing/services/tumpeng/menu.tsx`
File: `components/landing/services/tumpeng/menu.tsx`
1) Import (ganti):
```tsx
import { createWhatsappLink, createOrderMessage } from "@/const/whatsapp";
import { TumpengOrderModal, type TumpengPackageCard } from "./OrderModal";
```
Sisa: `import type { TumpengPackageCard } from "./OrderModal";`.
2) Tombol kartu (baris ≈131-136):
LIHAT OLD:
```tsx
<Button
  onClick={() => setSelectedCard(card)}
  className="mt-3 h-11 w-full bg-red-800 text-white hover:bg-red-900"
>
  {t("orderNow")}
</Button>
```
GANTI MENJADI:
```tsx
<Button
  onClick={() => {
    window.open(createWhatsappLink(createOrderMessage(serviceName, card.title, card.price)), "_blank");
  }}
  className="mt-3 h-11 w-full bg-red-800 text-white hover:bg-red-900"
>
  {t("orderNow")}
</Button>
```
3) Sembunyikan modal: hapus blok `selectedCard && <TumpengOrderModal .../>`.

### Task 8 — `components/landing/services/wedding/menu.tsx`
File: `components/landing/services/wedding/menu.tsx`
1) Import (ganti):
```tsx
import { createWhatsappLink, createOrderMessage } from "@/const/whatsapp";
import { OrderModalPrasmanan as OrderModal, type PackageCard } from "./OrderModal";
```
Sisa: `import type { PackageCard } from "./OrderModal";`.
2) Tombol kartu (baris ≈234-239):
LIHAT OLD:
```tsx
<Button
  onClick={() => setSelectedCard(card)}
  className="mt-4 h-11 rounded-lg bg-[#9F0404] font-bold text-white hover:bg-[#870000]"
>
  {commonT("orderNowShort")}
</Button>
```
GANTI MENJADI:
```tsx
<Button
  onClick={() => {
    window.open(createWhatsappLink(createOrderMessage(serviceName, card.title, card.price)), "_blank");
  }}
  className="mt-4 h-11 rounded-lg bg-[#9F0404] font-bold text-white hover:bg-[#870000]"
>
  {commonT("orderNowShort")}
</Button>
```
3) Sembunyikan modal: hapus blok `selectedCard && <OrderModal .../>`.

### Task 9 — Verifikasi
- Jalankan: `npm run lint` → expect exit 0, no lint errors.
- Jalankan: `npm run build` (menggunakan `NODE_OPTIONS=--max-old-space-size=3072 && next build`) → expect "Compiled successfully" / exit 0.
- Spot-check template (contoh kartu AQIQAH):
  - Service: `Aqiqah Kambing Betina`, card `BETINA 20KG` / subTitle `Prasmanan` / price `Rp 3.400.000`
  - Expected URL (decode):
    `https://wa.me/6281371790122?text=Halo%2C%20saya%20ingin%20memesan%20Aqiqah%20Kambing%20Betina%20BETINA%2020KG%20Prasmanan%20-%
20Rp%203.400.000.%20Mohon%20konfirmasi%20detail%20pesanan%20dan%20cara%20pembayaran.`
- Periksa bahwa tombol kartu di halaman tidak lagi me-render modal (dom tidak ada `fixed inset-0 z-[70]`).

## Tests / validation
- Tidak ada unit test khusus (frontend UI). Jest/tests belum ada di repo (lihat `package.json`).
- Ganti TDD ke "lint + build": setiap task berakhir dengan `npm run lint` & `npm run build` hijau.
- Bandingkan hasil build lewat `git diff --stat` agar hanya 8 file yang berubah (1 helper + 7 menu).

## Risks, tradeoffs, open questions
- **Template pesan sementara**: isi template `Halo, saya ingin memesan ...` masih placeholder. Bisa disesuaikan setelah produksi/QA. Luas: serviceName + nama paket + harga, cukup informatif untuk konversi.
- **Perilaku popup**: `window.open(..., "_blank")` memicu kanvas/navigator baru terlebih dahulu (user gesture). Di beberapa browser popup dapat diblokir bila tidak murni dari gesture. Alternatif lebih bersih: ganti `<Button>` jadi `<Button asChild><Link href={link} target="_blank">`. Dipilih `window.open` untuk perubahan minimal yang tetap mempertahankan `Button`.
- **Modal di-remove vs di-hide**: disembunyikan dengan menghapus render block sekaligus import modal yang tak terpakai. Component modal tetap ada untuk restore cepat (fasa 2).
- **CTA yang sudah ada** (`cta.tsx`, `faq.tsx`, footer, `app/page.tsx`) sudah `Link` ke wa.me dengan template generik — OUT OF SCOPE (perintah hanya untuk tombol orderNow di menu kartu).
- **Halaman selain 7 menu**: `app/services/aqiqah/page.tsx` hanya me-render `Menu` default dari `aqiqah/menu.tsx` — tidak ada yang lain perlu diubah.
