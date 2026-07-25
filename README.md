# KSMFood — Website Pemesanan Pelanggan KSM Katering Batam

Platform pemesanan katering digital untuk **KSM Food**, memungkinkan pelanggan melihat dan memesan menu makan siang, nasi kotak, dan layanan katering lainnya secara online dengan mudah dan cepat.

---

## 🗂️ Struktur Repository

Project ini terdiri dari **3 repository** yang saling terhubung:

| Repository | Deskripsi | Link |
|------------|-----------|------|
| 🗄️ **Backend (Strapi)** | REST API & manajemen konten berbasis Strapi CMS | https://github.com/kurtamie/ksm_katering_backend.git |
| 🌐 **Frontend Pelanggan** *(repo ini)* | Website publik untuk pelanggan melakukan pemesanan | — |
| 🖥️ **Frontend Internal** | Dashboard admin & operasional internal KSM Food | https://github.com/kurtamie/ksm_katering.git |

---

## 🚀 Tech Stack

| Kategori | Teknologi |
|----------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 + Shadcn/UI |
| Animation | Motion.js + GSAP |
| Auth | JWT via HttpOnly Cookie |
| i18n | next-intl |
| AI Chat | OpenAI |
| Payment | Midtrans |
| CMS / Backend | Strapi (repository terpisah) |

---

## ⚙️ Instalasi & Menjalankan Aplikasi

### Prasyarat

- **Node.js** v20 atau lebih baru
- **npm** v10 atau lebih baru
- Backend Strapi sudah berjalan (lihat repository backend)

### Langkah Instalasi

**1. Clone repository**
```bash
git clone <url-repo-ini>
cd ksmfood
```

**2. Install dependencies**
```bash
npm install
```

**3. Konfigurasi environment variables**

Salin file contoh environment dan sesuaikan isinya:
```bash
cp .env.example .env.local
```

**4. Jalankan development server**
```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

### Perintah Lainnya

```bash
npm run build   # Build untuk production
npm run start   # Jalankan production server
npm run lint    # Cek kualitas kode
```

---

## 📁 Struktur Folder

```
ksmfood/
├── app/                    # Next.js App Router
│   ├── api/                # API Route Handlers
│   ├── data/
│   │   ├── actions/        # Server Actions
│   │   └── services/       # Service layer (fetch ke backend)
│   └── [pages]/            # Halaman aplikasi
├── components/             # Komponen UI
│   ├── auth/               # Komponen autentikasi
│   ├── landing/            # Komponen halaman utama
│   ├── layout/             # Navbar, Footer, dsb
│   └── shared/             # Komponen reusable
├── context/                # React Context (auth state)
├── lib/                    # Utility & helper functions
├── types/                  # TypeScript type definitions
├── i18n/                   # Konfigurasi internasionalisasi
└── messages/               # File terjemahan (i18n)
```

---

## 👥 Kontributor

| Nama | Peran |
|------|-------|
| Kurtamie | Full-stack Developer |


