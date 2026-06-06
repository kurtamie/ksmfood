// Quickreplies.tsx
// Quick reply template untuk KSM Catering Chatbot
// Support bilingual: ID & EN
// Flow-based: welcome → jalur → layanan → detail

export interface QuickReply {
  label: string;
  value: string;
  variant?: "default" | "green" | "orange" | "blue" | "purple";
}

export interface QuickReplyGroup {
  id: string;
  replies: QuickReply[];
}

// ─────────────────────────────────────────────
// BAHASA INDONESIA
// ─────────────────────────────────────────────

export const QUICK_REPLY_GROUPS_ID: Record<string, QuickReplyGroup> = {
  // Step 0 — Welcome: pilih jalur utama
  welcome: {
    id: "welcome",
    replies: [
      {
        label: "✅ Pesan Paket FIX",
        value: "Saya ingin memesan paket catering KSM",
        variant: "default",
      },
      {
        label: "⚙️ Pesan CUSTOM / Khusus",
        value: "Saya ingin memesan dengan kebutuhan custom atau khusus",
        variant: "orange",
      },
      {
        label: "🎯 Minta Dipilihkan Vika",
        value: "Saya minta Vika pilihkan paket terbaik untuk saya",
        variant: "green",
      },
      {
        label: "ℹ️ Info & FAQ",
        value: "Saya ingin tahu informasi umum dan FAQ tentang KSM Catering",
        variant: "blue",
      },
    ],
  },

  // Step 1 — Pilih Layanan (setelah pilih jalur FIX atau DIPILIHKAN)
  pilihLayanan: {
    id: "pilihLayanan",
    replies: [
      { label: "🍱 Nasi Kotak", value: "Saya ingin pesan nasi kotak" },
      { label: "🍽️ Prasmanan", value: "Saya ingin pesan prasmanan" },
      {
        label: "💒 Prasmanan Pernikahan",
        value: "Saya ingin pesan prasmanan untuk pernikahan",
      },
      { label: "🐑 Aqiqah", value: "Saya ingin pesan paket aqiqah" },
      { label: "🧁 Snack Kotak", value: "Saya ingin pesan snack kotak" },
      {
        label: "🏢 Katering Korporat",
        value: "Saya ingin konsultasi katering korporat",
        variant: "blue",
      },
    ],
  },

  // Step 2 — Paket Nasi Kotak
  paketNasiKotak: {
    id: "paketNasiKotak",
    replies: [
      {
        label: "Paket A — Ayam/Ikan (Rp 27.000)",
        value: "Saya pilih Paket A Ayam atau Ikan untuk nasi kotak",
      },
      {
        label: "Paket A — Daging/Seafood ⭐ (Rp 28.500)",
        value: "Saya pilih Paket A Daging atau Seafood untuk nasi kotak",
      },
      {
        label: "Paket B — 2 Lauk (Rp 34.500)",
        value: "Saya pilih Paket B nasi kotak dengan 2 lauk utama",
      },
      {
        label: "Paket C — 3 Lauk (Rp 42.500)",
        value: "Saya pilih Paket C nasi kotak dengan 3 lauk utama",
      },
      {
        label: "Paket Plus (+Puding & Air 330ml)",
        value:
          "Saya ingin tahu tentang paket plus untuk nasi kotak, ada puding dan air 330ml",
      },
      {
        label: "💰 Estimasi harga dulu",
        value: "Saya ingin estimasi total harga nasi kotak terlebih dahulu",
        variant: "orange",
      },
    ],
  },

  // Step 2 — Paket Prasmanan
  paketPrasmanan: {
    id: "paketPrasmanan",
    replies: [
      {
        label: "Paket A — 1 Lauk ⭐ (Rp 34.000)",
        value: "Saya pilih Paket A prasmanan",
      },
      {
        label: "Paket B — 2 Lauk (Rp 42.000)",
        value: "Saya pilih Paket B prasmanan dengan 2 lauk utama",
      },
      {
        label: "Paket C — 3 Lauk (Rp 50.000)",
        value: "Saya pilih Paket C prasmanan dengan 3 lauk utama",
      },
      {
        label: "Paket Plus (+Sup & Puding)",
        value:
          "Saya ingin tahu tentang paket plus prasmanan yang ada sup dan puding",
      },
      {
        label: "👨‍🍳 Ada pramusaji?",
        value:
          "Apakah prasmanan KSM menggunakan pramusaji dan mulai berapa porsi?",
      },
      {
        label: "💰 Estimasi harga dulu",
        value: "Saya ingin estimasi total harga prasmanan terlebih dahulu",
        variant: "orange",
      },
    ],
  },

  // Step 2 — Paket Wedding
  paketWedding: {
    id: "paketWedding",
    replies: [
      {
        label: "Paket & Harga Wedding",
        value: "Apa saja pilihan paket dan harga prasmanan pernikahan KSM?",
      },
      {
        label: "🏮 Tambah Pondokan?",
        value:
          "Apakah ada layanan pondokan atau food stall untuk pernikahan di KSM?",
      },
      {
        label: "👥 Apa saja yang included?",
        value:
          "Apa saja yang sudah termasuk dalam paket prasmanan pernikahan KSM?",
      },
      {
        label: "🎁 Bonus testfood?",
        value: "Apakah ada bonus testfood untuk paket pernikahan KSM?",
      },
      {
        label: "📅 Minimal booking H berapa?",
        value:
          "Minimal berapa hari sebelum acara untuk booking prasmanan pernikahan?",
      },
    ],
  },

  // Step 2 — Paket Aqiqah
  paketAqiqah: {
    id: "paketAqiqah",
    replies: [
      {
        label: "🐑 Kambing Betina 20KG",
        value: "Berapa harga dan isi paket aqiqah kambing betina 20kg?",
      },
      {
        label: "🐐 Kambing Jantan 20KG",
        value: "Berapa harga dan isi paket aqiqah kambing jantan 20kg?",
      },
      {
        label: "🎁 Bonus apa saja?",
        value:
          "Apa saja bonus yang didapat dari paket aqiqah KSM seperti sertifikat?",
      },
      {
        label: "📅 Minimal booking H berapa?",
        value: "Minimal berapa hari sebelumnya untuk pesan paket aqiqah KSM?",
      },
    ],
  },

  // Step 2 — Paket Snack Kotak
  paketSnackKotak: {
    id: "paketSnackKotak",
    replies: [
      {
        label: "Paket A (Rp 13.000) — 2 Kue + Air",
        value: "Jelaskan paket snack kotak A harga 13000",
      },
      {
        label: "Paket B ⭐ (Rp 16.000) — 2 Kue + Teh",
        value: "Jelaskan paket snack kotak B harga 16000, yang paling populer",
      },
      {
        label: "Paket C–F (Rp 17.000–23.000)",
        value: "Jelaskan pilihan paket snack kotak C sampai F",
      },
      {
        label: "💰 Estimasi harga dulu",
        value: "Saya ingin estimasi total harga snack kotak",
        variant: "orange",
      },
    ],
  },

  // Step 3 — Pilih menu/lauk (setelah pilih paket)
  tanyaMenu: {
    id: "tanyaMenu",
    replies: [
      {
        label: "🍖 Pilihan lauk ayam",
        value: "Apa saja pilihan lauk utama ayam di KSM Catering?",
      },
      {
        label: "🥩 Pilihan lauk daging",
        value: "Apa saja pilihan lauk utama daging di KSM Catering?",
      },
      {
        label: "🐟 Pilihan lauk ikan/seafood",
        value: "Apa saja pilihan lauk ikan dan seafood di KSM Catering?",
      },
      {
        label: "🥦 Pilihan sayur",
        value: "Apa saja pilihan sayur di KSM Catering?",
      },
      {
        label: "🌶️ Pilihan sambal",
        value: "Apa saja pilihan sambal di KSM Catering?",
      },
      {
        label: "⭐ Rekomendasikan menu",
        value: "Rekomendasikan kombinasi menu terbaik di KSM Catering",
        variant: "green",
      },
    ],
  },

  // Step 3 — Estimasi harga
  tanyaHarga: {
    id: "tanyaHarga",
    replies: [
      {
        label: "🍱 Nasi kotak 50 kotak",
        value: "Berapa total harga nasi kotak untuk 50 kotak?",
      },
      {
        label: "🍱 Nasi kotak 100 kotak",
        value: "Berapa total harga nasi kotak untuk 100 kotak?",
      },
      {
        label: "🍽️ Prasmanan 100 porsi",
        value: "Berapa estimasi harga prasmanan untuk 100 porsi?",
      },
      {
        label: "🍽️ Prasmanan 200 porsi",
        value: "Berapa estimasi harga prasmanan untuk 200 porsi?",
      },
      {
        label: "💒 Wedding 150 porsi",
        value: "Berapa estimasi harga prasmanan pernikahan untuk 150 porsi?",
      },
      {
        label: "🧁 Snack kotak 100 kotak",
        value: "Berapa total harga snack kotak untuk 100 kotak?",
      },
    ],
  },

  // Info & FAQ
  infoFaq: {
    id: "infoFaq",
    replies: [
      {
        label: "✅ Sertifikat Halal",
        value: "Apakah KSM Catering bersertifikat halal?",
      },
      {
        label: "🚚 Area pengiriman",
        value: "KSM Catering bisa antar ke area mana saja di Batam?",
      },
      {
        label: "💳 Cara pembayaran",
        value: "Bagaimana cara pembayaran di KSM Catering? Ada DP?",
      },
      {
        label: "📍 Lokasi dapur KSM",
        value: "Di mana lokasi dapur KSM Catering?",
      },
      {
        label: "📅 Minimal H berapa?",
        value: "Minimal berapa hari sebelum acara pesanan harus masuk?",
      },
      {
        label: "🏠 Kembali ke menu utama",
        value: "Tampilkan menu utama / layanan KSM Catering",
        variant: "green",
      },
    ],
  },

  // Custom / setelah flow selesai
  custom: {
    id: "custom",
    replies: [
      {
        label: "📉 Jumlah di bawah minimal",
        value: "Saya butuh jumlah pesanan di bawah minimal KSM Catering",
      },
      {
        label: "🍴 Lauk / menu khusus",
        value: "Saya ingin menu atau lauk yang tidak ada di daftar standar KSM",
      },
      {
        label: "⚡ Acara mendadak",
        value:
          "Saya butuh katering untuk acara mendadak kurang dari batas minimum hari",
      },
      {
        label: "📦 Pesanan besar / negosiasi",
        value: "Saya punya pesanan besar dan ingin negosiasi harga dengan KSM",
        variant: "orange",
      },
    ],
  },

  // Setelah konfirmasi / akhir flow
  afterBooking: {
    id: "afterBooking",
    replies: [
      {
        label: "💬 Hubungi Sales via WhatsApp",
        value: "Saya ingin dihubungkan ke sales KSM via WhatsApp",
        variant: "green",
      },
      {
        label: "🔄 Pesan lagi dari awal",
        value: "Saya ingin mulai percakapan dari awal untuk pesanan baru",
      },
      {
        label: "❓ Ada pertanyaan lain",
        value: "Saya masih punya pertanyaan lain tentang KSM Catering",
      },
    ],
  },
};

// ─────────────────────────────────────────────
// ENGLISH
// ─────────────────────────────────────────────

export const QUICK_REPLY_GROUPS_EN: Record<string, QuickReplyGroup> = {
  welcome: {
    id: "welcome",
    replies: [
      {
        label: "✅ Order Fixed Package",
        value: "I want to order a fixed catering package from KSM",
        variant: "default",
      },
      {
        label: "⚙️ Custom Order",
        value: "I need a custom or special catering order",
        variant: "orange",
      },
      {
        label: "🎯 Let Vika Choose",
        value: "I want Vika to recommend the best package for me",
        variant: "green",
      },
      {
        label: "ℹ️ Info & FAQ",
        value: "I want to know general information and FAQs about KSM Catering",
        variant: "blue",
      },
    ],
  },

  pilihLayanan: {
    id: "pilihLayanan",
    replies: [
      { label: "🍱 Rice Box", value: "I want to order rice box" },
      { label: "🍽️ Buffet", value: "I want to order buffet catering" },
      {
        label: "💒 Wedding Buffet",
        value: "I want to order buffet for a wedding",
      },
      { label: "🐑 Aqiqah", value: "I want to order an aqiqah package" },
      { label: "🧁 Snack Box", value: "I want to order snack boxes" },
      {
        label: "🏢 Corporate Catering",
        value: "I want to consult about corporate catering",
        variant: "blue",
      },
    ],
  },

  paketNasiKotak: {
    id: "paketNasiKotak",
    replies: [
      {
        label: "Package A — Chicken/Fish (Rp 27,000)",
        value: "I choose Package A Chicken or Fish for rice box",
      },
      {
        label: "Package A — Beef/Seafood ⭐ (Rp 28,500)",
        value: "I choose Package A Beef or Seafood for rice box",
      },
      {
        label: "Package B — 2 Dishes (Rp 34,500)",
        value: "I choose Package B rice box with 2 main dishes",
      },
      {
        label: "Package C — 3 Dishes (Rp 42,500)",
        value: "I choose Package C rice box with 3 main dishes",
      },
      {
        label: "Plus Package (+Pudding & 330ml Water)",
        value: "I want to know about the plus package for rice box",
      },
      {
        label: "💰 Estimate price first",
        value: "I want to estimate the total price for rice box first",
        variant: "orange",
      },
    ],
  },

  paketPrasmanan: {
    id: "paketPrasmanan",
    replies: [
      {
        label: "Package A — 1 Dish ⭐ (Rp 34,000)",
        value: "I choose Package A buffet",
      },
      {
        label: "Package B — 2 Dishes (Rp 42,000)",
        value: "I choose Package B buffet with 2 main dishes",
      },
      {
        label: "Package C — 3 Dishes (Rp 50,000)",
        value: "I choose Package C buffet with 3 main dishes",
      },
      {
        label: "Plus Package (+Soup & Pudding)",
        value:
          "I want to know about the plus buffet package with soup and pudding",
      },
      {
        label: "👨‍🍳 Is there waitstaff?",
        value: "Does KSM buffet include waitstaff and from how many portions?",
      },
      {
        label: "💰 Estimate price first",
        value: "I want to estimate the total price for buffet first",
        variant: "orange",
      },
    ],
  },

  paketWedding: {
    id: "paketWedding",
    replies: [
      {
        label: "Wedding Packages & Prices",
        value: "What are the wedding buffet package options and prices at KSM?",
      },
      {
        label: "🏮 Add Food Stall?",
        value: "Are there food stall options available for the wedding at KSM?",
      },
      {
        label: "👥 What's included?",
        value: "What is included in the KSM wedding buffet package?",
      },
      {
        label: "🎁 Test food bonus?",
        value: "Is there a test food bonus for the wedding package at KSM?",
      },
      {
        label: "📅 How many days in advance?",
        value:
          "How many days in advance do I need to book a wedding buffet at KSM?",
      },
    ],
  },

  paketAqiqah: {
    id: "paketAqiqah",
    replies: [
      {
        label: "🐑 Female Goat 20KG Package",
        value:
          "What is the price and content of the female goat aqiqah package 20kg?",
      },
      {
        label: "🐐 Male Goat 20KG Package",
        value:
          "What is the price and content of the male goat aqiqah package 20kg?",
      },
      {
        label: "🎁 What bonuses are included?",
        value:
          "What bonuses like certificates are included with the KSM aqiqah package?",
      },
      {
        label: "📅 How many days in advance?",
        value:
          "How many days in advance do I need to book an aqiqah package at KSM?",
      },
    ],
  },

  paketSnackKotak: {
    id: "paketSnackKotak",
    replies: [
      {
        label: "Package A (Rp 13,000) — 2 Pastries + Water",
        value: "Explain snack box package A at Rp 13,000",
      },
      {
        label: "Package B ⭐ (Rp 16,000) — 2 Pastries + Tea",
        value: "Explain snack box package B at Rp 16,000, the most popular",
      },
      {
        label: "Package C–F (Rp 17,000–23,000)",
        value: "Explain snack box packages C through F",
      },
      {
        label: "💰 Estimate price first",
        value: "I want to estimate the total price for snack boxes first",
        variant: "orange",
      },
    ],
  },

  tanyaMenu: {
    id: "tanyaMenu",
    replies: [
      {
        label: "🍖 Chicken dish options",
        value: "What are the chicken main dish options at KSM Catering?",
      },
      {
        label: "🥩 Beef dish options",
        value: "What are the beef main dish options at KSM Catering?",
      },
      {
        label: "🐟 Fish / Seafood options",
        value: "What are the fish and seafood options at KSM Catering?",
      },
      {
        label: "🥦 Vegetable options",
        value: "What are the vegetable side options at KSM Catering?",
      },
      {
        label: "🌶️ Sambal options",
        value: "What sambal options are available at KSM Catering?",
      },
      {
        label: "⭐ Recommend a menu",
        value: "Recommend the best menu combination at KSM Catering",
        variant: "green",
      },
    ],
  },

  tanyaHarga: {
    id: "tanyaHarga",
    replies: [
      {
        label: "🍱 Rice box 50 boxes",
        value: "What is the total price for 50 rice boxes?",
      },
      {
        label: "🍱 Rice box 100 boxes",
        value: "What is the total price for 100 rice boxes?",
      },
      {
        label: "🍽️ Buffet 100 portions",
        value: "What is the estimated price for buffet for 100 portions?",
      },
      {
        label: "🍽️ Buffet 200 portions",
        value: "What is the estimated price for buffet for 200 portions?",
      },
      {
        label: "💒 Wedding 150 portions",
        value:
          "What is the estimated price for wedding buffet for 150 portions?",
      },
      {
        label: "🧁 Snack box 100 boxes",
        value: "What is the total price for 100 snack boxes?",
      },
    ],
  },

  infoFaq: {
    id: "infoFaq",
    replies: [
      {
        label: "✅ Halal Certificate",
        value: "Is KSM Catering halal certified?",
      },
      {
        label: "🚚 Delivery area",
        value: "Which areas in Batam does KSM Catering deliver to?",
      },
      {
        label: "💳 Payment methods",
        value:
          "What are the payment methods at KSM Catering? Is there a deposit?",
      },
      {
        label: "📍 Kitchen location",
        value: "Where is the KSM Catering kitchen located?",
      },
      {
        label: "📅 How early to order?",
        value: "How many days in advance should I place an order at KSM?",
      },
      {
        label: "🏠 Back to main menu",
        value: "Show me the main menu and services of KSM Catering",
        variant: "green",
      },
    ],
  },

  custom: {
    id: "custom",
    replies: [
      {
        label: "📉 Below minimum quantity",
        value: "I need a quantity below KSM Catering's minimum order",
      },
      {
        label: "🍴 Special menu / dishes",
        value: "I want a menu or dish not in KSM's standard list",
      },
      {
        label: "⚡ Last-minute event",
        value:
          "I need catering for a last-minute event below minimum booking days",
      },
      {
        label: "📦 Large order / price negotiation",
        value: "I have a large order and want to negotiate pricing with KSM",
        variant: "orange",
      },
    ],
  },

  afterBooking: {
    id: "afterBooking",
    replies: [
      {
        label: "💬 Contact Sales via WhatsApp",
        value: "I want to be connected to KSM sales via WhatsApp",
        variant: "green",
      },
      {
        label: "🔄 Start a new order",
        value: "I want to start from the beginning for a new order",
      },
      {
        label: "❓ More questions",
        value: "I still have other questions about KSM Catering",
      },
    ],
  },
};

// ─────────────────────────────────────────────
// HELPER: ambil group berdasarkan lang
// ─────────────────────────────────────────────

export function getGroups(lang: "id" | "en") {
  return lang === "en" ? QUICK_REPLY_GROUPS_EN : QUICK_REPLY_GROUPS_ID;
}

export const QUICK_REPLY_GROUPS = QUICK_REPLY_GROUPS_ID;

// ─────────────────────────────────────────────
// DETEKSI GROUP DARI ISI PESAN BOT
// ─────────────────────────────────────────────
// Urutan deteksi: dari yang paling spesifik ke umum.
// Tambah: deteksi jalur custom, afterBooking, pilihLayanan.

export function detectQuickReplyGroup(
  botMessage: string,
  lang: "id" | "en" = "id",
): QuickReplyGroup | null {
  const msg = botMessage.toLowerCase();
  const groups = getGroups(lang);

  // ── After booking / konfirmasi selesai ──
  if (
    msg.includes("pesanan siap dikirim") ||
    msg.includes("order is ready") ||
    msg.includes("konfirmasi & kirim") ||
    msg.includes("confirm & send") ||
    msg.includes("kirim ke admin") ||
    msg.includes("send to admin") ||
    (msg.includes("selamat") && msg.includes("pesanan")) ||
    (msg.includes("congratulations") && msg.includes("order"))
  )
    return groups.afterBooking;

  // ── Custom / khusus ──
  if (
    (msg.includes("custom") ||
      msg.includes("khusus") ||
      msg.includes("special")) &&
    (msg.includes("pilih") ||
      msg.includes("opsi") ||
      msg.includes("option") ||
      msg.includes("mendadak") ||
      msg.includes("last-minute") ||
      msg.includes("minimal") ||
      msg.includes("minimum") ||
      msg.includes("negosiasi") ||
      msg.includes("negotiate"))
  )
    return groups.custom;

  // ── Nasi kotak / rice box: paket ──
  if (
    (msg.includes("nasi kotak") ||
      msg.includes("rice box") ||
      msg.includes("ricebox")) &&
    (msg.includes("paket") ||
      msg.includes("package") ||
      msg.includes("harga") ||
      msg.includes("price") ||
      msg.includes("rp"))
  )
    return groups.paketNasiKotak;

  // ── Snack kotak / snack box: paket ──
  if (
    (msg.includes("snack kotak") ||
      msg.includes("snack box") ||
      msg.includes("kue") ||
      msg.includes("pastry")) &&
    (msg.includes("paket") ||
      msg.includes("package") ||
      msg.includes("harga") ||
      msg.includes("price") ||
      msg.includes("rp"))
  )
    return groups.paketSnackKotak;

  // ── Wedding: paket (cek lebih dulu dari prasmanan) ──
  if (
    msg.includes("pernikahan") ||
    msg.includes("wedding") ||
    msg.includes("resepsi") ||
    (msg.includes("prasmanan") &&
      (msg.includes("nikah") ||
        msg.includes("pondokan") ||
        msg.includes("testfood"))) ||
    (msg.includes("buffet") &&
      (msg.includes("wedding") || msg.includes("reception")))
  )
    return groups.paketWedding;

  // ── Prasmanan / buffet: paket ──
  if (
    (msg.includes("prasmanan") || msg.includes("buffet")) &&
    (msg.includes("paket") ||
      msg.includes("package") ||
      msg.includes("harga") ||
      msg.includes("price") ||
      msg.includes("porsi") ||
      msg.includes("portion") ||
      msg.includes("rp"))
  )
    return groups.paketPrasmanan;

  // ── Aqiqah: paket ──
  if (
    msg.includes("aqiqah") &&
    (msg.includes("paket") ||
      msg.includes("package") ||
      msg.includes("harga") ||
      msg.includes("price") ||
      msg.includes("kambing") ||
      msg.includes("goat") ||
      msg.includes("betina") ||
      msg.includes("jantan") ||
      msg.includes("female") ||
      msg.includes("male"))
  )
    return groups.paketAqiqah;

  // ── Menu / lauk ──
  if (
    (msg.includes("lauk") ||
      msg.includes("menu") ||
      msg.includes("sayur") ||
      msg.includes("vegetable") ||
      msg.includes("sambal") ||
      msg.includes("dish")) &&
    (msg.includes("pilihan") ||
      msg.includes("option") ||
      msg.includes("tersedia") ||
      msg.includes("available") ||
      msg.includes("apa saja") ||
      msg.includes("what") ||
      msg.includes("rekomend") ||
      msg.includes("recommend"))
  )
    return groups.tanyaMenu;

  // ── Harga / estimasi ──
  if (
    (msg.includes("harga") ||
      msg.includes("price") ||
      msg.includes("estimasi") ||
      msg.includes("estimate") ||
      msg.includes("total") ||
      msg.includes("biaya") ||
      msg.includes("cost")) &&
    (msg.includes("rp") ||
      msg.includes("ribu") ||
      msg.includes("porsi") ||
      msg.includes("portion") ||
      msg.includes("kotak") ||
      msg.includes("box"))
  )
    return groups.tanyaHarga;

  // ── FAQ / info ──
  if (
    msg.includes("halal") ||
    msg.includes("pengiriman") ||
    msg.includes("delivery") ||
    msg.includes("pembayaran") ||
    msg.includes("payment") ||
    msg.includes("dp") ||
    msg.includes("deposit") ||
    msg.includes("lokasi") ||
    msg.includes("location") ||
    msg.includes("sertifikat") ||
    msg.includes("certificate") ||
    (msg.includes("layanan") && msg.includes("tersedia")) ||
    (msg.includes("service") && msg.includes("available"))
  )
    return groups.infoFaq;

  // ── Pilih layanan (setelah pilih jalur fix/dipilihkan) ──
  if (
    msg.includes("pilih layanan") ||
    msg.includes("jenis layanan") ||
    msg.includes("pilih jenis") ||
    msg.includes("choose service") ||
    msg.includes("select service") ||
    msg.includes("apa yang ingin") ||
    (msg.includes("layanan") &&
      (msg.includes("nasi") ||
        msg.includes("prasmanan") ||
        msg.includes("snack")))
  )
    return groups.pilihLayanan;

  // ── Welcome / menu utama ──
  if (
    msg.includes("ada yang bisa") ||
    msg.includes("what can") ||
    msg.includes("selamat datang") ||
    msg.includes("welcome") ||
    msg.includes("menu utama") ||
    msg.includes("main menu") ||
    msg.includes("dari awal") ||
    msg.includes("start over") ||
    msg.includes("hi!") ||
    msg.includes("halo!") ||
    msg.includes("vika siap") ||
    msg.includes("vika is ready")
  )
    return groups.welcome;

  return null;
}
