import { NextRequest, NextResponse } from "next/server";

interface Message {
  role: "user" | "assistant" | "system";
  content: string;
}

interface OpenAIResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
}

interface OpenAIError {
  error?: {
    message?: string;
  };
}

const KSM_DATA_ID = `
DATA PRODUK KSM CATERING:

PROFIL PERUSAHAAN:
- Nama: PT Katering Sukses Mandiri (KSM Katering)
- Berpengalaman sejak 2007, katering halal di Batam
- Kapasitas 8.000 porsi per hari
- Satu-satunya katering di Batam yang dipercaya melayani katering maskapai Garuda Indonesia
- Telah melayani Wedding, Event Pemerintah & Kementerian, Bank, Rumah Sakit, dan Perusahaan besar di Batam
- Lokasi: Jl. S.Parman, Komp. Ruko Nusa Indah Blok M 16, Mangsang, Kec. Sei Beduk, Kota Batam, Kepulauan Riau 29433
- Rekening: Mandiri a/n PT Katering Sukses Mandiri (012345678910)
- Sertifikat Halal MUI, Sertifikat Laik Higiene Sanitasi, Sertifikat Ahli Gizi, Surat Izin Usaha, NPWP

LAYANAN TERSEDIA:
1. Nasi Kotak - mulai Rp 27.000/kotak
2. Prasmanan - mulai Rp 34.000/porsi
3. Prasmanan Pernikahan - mulai Rp 34.000/porsi
4. Bento - mulai Rp 58.000/kotak
5. Snack Kotak - mulai Rp 13.000
6. Aqiqah - mulai Rp 3.400.000
7. Tumpeng - mulai Rp 700.000
8. Rendang Kemasan - mulai Rp 80.000/kemasan
9. Katering Korporat - harga disesuaikan

1. NASI KOTAK (Ricebox):
   Minimal order 50 kotak, Harga sudah termasuk gratis pengantaran se-Batam., di bawah 50 kotak silahkan hubungi Tim KSM dan nantinya dijemput ke dapur kami. 
   - Paket A Ayam: Nasi, 1 Lauk Utama (kategori ayam/ikan), Sayur, Sambal, Kerupuk, Buah, Air Mineral Gelas.
   - Paket A Daging: Nasi, 1 Lauk Utama (kategori daging/seafood), Sayur, Sambal, Kerupuk, Buah, Air Mineral Gelas.
   - Paket B: Sama seperti Paket A tapi 2 Lauk Utama (bebas semua kategori).
   - Paket C: Sama seperti Paket A tapi 3 Lauk Utama (bebas semua kategori).
   - Paket Plus (A+/B+/C+): Semua isi paket reguler + upgrade minuman ke Air Mineral 330ml + Puding.

2. PRASMANAN:
   - Menggunakan pramusaji profesional (bukan self-service).
   - Paket A/B/C: Sama seperti nasi kotak.
   - Paket Plus: Tambahan Puding dan Sup Sayur. Peralatan prasmanan  dan setting tempat sudah termasuk dalam harga
   - Minimal order: 50 porsi. Layanan pramusaji minimal 100 porsi namun jika minimal order menyesuaikan, hubungi Tim KSM untuk detail.
   - Free ongkir tersedia

3. PRASMANAN PERNIKAHAN:
  - Full service dengan tim lengkap: petugas stall, penjaga lauk, runner distribusi, petugas buah, tim kebersihan
  - Keluarga tidak perlu terlibat mengurus catering saat acara
  - KSM siagakan tim dapur & bahan baku selama acara (antisipasi lonjakan tamu)
  - Peralatan makan (piring, sendok, garpu) disediakan sesuai jumlah tamu, tidak dicuci di lokasi
  - Peralatan prasmanan sudah termasuk dalam harga paket
  - Minimal order: 150 porsi. 
  - Katering pondokan tersedia: Batagor, Pempek Palembang, Siomay, Bakso, Soto, Sate Ayam + Lontong, Dimsum, Surabi, Ketan Srikaya, Ketan Durian, Bubur Sumsum, Salad Buah, Bubur Candil

4. BEMTO
  - Nasi kotak premium dengan kemasan kotak premium
  - Cocok untuk makan siang, meeting, gathering, fun day, tamu dan relasi spesial
  - Minimal order: 25 kotak (ambil di dapur). 50 kotak ke atas gratis antar

5. SNACK KOTAK:
  - Untuk meeting, seminar, pelatihan, acara formal maupun informal
  - Minimal order: 50 kotak (diantar). Di bawah 50 kotak dijemput ke dapur

6. AQIQAH:
  - Menu olahan daging: sate, gulai, dan hidangan lainnya
  - Tersedia paket kambing betina dan kambing jantan
  - Bonus gratis: video undangan aqiqah dan sertifikat aqiqah
  - Syar'i dan praktis

7. TUMPENG:
  - Untuk syukuran, ulang tahun, acara seremonial
  - Minimal order: 50 kotak diantar. Di bawah 50 dijemput ke dapur

8. KATERING KORPORAT:
  - Untuk perusahaan, instansi, kebutuhan operasional harian
  - Menerapkan standar CPB (Cara Produksi yang Baik)
  - Kapasitas hingga 10.000 porsi/hari
  - Harga disesuaikan dengan kebutuhan

9. LAUK SATUAN:
   - Bisa beli lauk saja tanpa paket, minimal 100 pcs.

PILIHAN MENU:

Nasi: Nasi Putih, Nasi Kuning (tambah Rp 2.000), Nasi Lemak (tambah Rp 2.000)

Lauk Utama Ayam: Ayam Goreng Kalasan, Ayam Bakar Kecap, Ayam Rendang, Ayam Kremes
Lauk Utama Ikan: Ikan Balado, Ikan Bakar Kecap, Ikan Rica-rica, Ikan Asam Pedas, Fillet Asam Manis
Lauk Utama Daging: Rendang Daging, Daging Semur, Daging Bumbu Bali, Krengseng Daging, Lada Hitam
Lauk Utama Seafood: Udang Goreng Tepung, Udang Masak Cabe, Sotong Goreng Tepung, Sotong Pedas

Lauk Tambahan: Perkedel, Tempe/Tahu, Bakwan Jagung, Sambal Goreng Kentang Hati, Serut Kentang

Sayur: Urap Sayuran, Pecel Sayuran, Sup Sayuran, Tumis Buncis, Tumis Toge Teri, Sayur Lodeh, Gulai Labu Siam, Tumis Kacang Panjang, Lalapan, Cah Sawi Putih, Capcay (tambah Rp 2.000), Sayur Asem (tambah Rp 2.000)

Sambal (order 50-99 kotak): Sambal Ijo, Sambal Terasi
Sambal (order 100+ kotak): Sambal Ijo, Sambal Terasi, Sambal Mangga, Sambal Bajak

Kerupuk: sudah termasuk dalam paket
Buah: Pisang atau Jeruk (sudah termasuk)
Minuman: Air Mineral Gelas (reguler), Air Mineral 330ml (paket plus)
Puding: hanya tersedia di paket plus

REKOMENDASI MENU:
- Daging: Lada Hitam, Rendang Daging, Bumbu Bali
- Ayam: Rendang Ayam, Bakar Kecap, Kremes
- Ikan: Fillet Asam Manis, Rica-Rica
- Seafood: Udang Goreng Tepung, Sotong Goreng Tepung
- Sayur: Tumis Buncis (Orak-arik Buncis), Tumis Kacang Panjang
- Lauk Tambahan: Sambal Goreng Kentang Hati, Serut Kentang
- Sambal: Sambal Ijo

KETENTUAN PENTING:
- Pesanan harus seragam, tidak bisa pecah-pecah (contoh: tidak bisa 50 kotak dengan 10 ayam dan 40 daging)
- Minimal order nasi kotak/prasmanan: 50 porsi
- Minimal lauk satuan: 100 porsi
- Pesanan harus seragam, tidak bisa pecah-pecah (contoh: tidak bisa 50 kotak dengan 10 ayam dan 40 daging)
- Bisa minta tingkat kepedasan, berlaku untuk seluruh pesanan
- Komponen paket sesuai paket yang dipilih, tidak bisa tambah lauk di luar ketentuan paket
- Tidak ada diskon, harga sudah termasuk free ongkir se-Batam
- Menu di luar daftar bisa di-diskusikan ke Tim KSM
- Order di bawah 50 porsi: nantinya pesanan dijemput sendiri di lokasi dan untuk cara pesannya silahkan hubungi tim KSM tidak bisa melalui website
- Pembayaran cicilan, DP, atau kustomisasi budget pelanggan, atau pelanggan minta penyesuaian harga karena tidak ada yang sesuai di websiteen: hubungi Tim KSM
- Untuk kebutuhan khusus lainnya, bisa ditambahkan di kolom catatan  saat memesan
`;

const KSM_DATA_EN = `
KSM CATERING PRODUCT & SERVICE DATA (ENGLISH):

COMPANY PROFILE:
- Name: PT Katering Sukses Mandiri (KSM Katering)
- Established 2007, halal catering in Batam
- Capacity up to 8,000-10,000 portions per day
- The only caterer in Batam trusted to handle Garuda Indonesia airline catering
- Has served Weddings, Government Events, Banks, Hospitals, and major companies in Batam
- Location: Muka Kuning, Batam (Shophouse Block D1 No. 19)
- Bank Account: Mandiri a/n PT Katering Sukses Mandiri (012345678910)
- MUI Halal Certificate, Hygiene & Sanitation Certificate, Nutritionist Certificate, Business License, Tax ID

AVAILABLE SERVICES:
1. Rice Box (Nasi Kotak) - starting from Rp 27,000/box
2. Buffet (Prasmanan) - starting from Rp 34,000/portion
3. Wedding Buffet - starting from Rp 34,000/portion
4. Bento - starting from Rp 58,000/box
5. Snack Box - starting from Rp 13,000
6. Aqiqah - starting from Rp 3,400,000
7. Tumpeng - starting from Rp 700,000
8. Packaged Rendang - starting from Rp 80,000/package
9. Corporate Catering - flexible pricing

RICE BOX:
- Package A Chicken: Rice, 1 Main Dish (chicken/fish), Vegetable, Sambal, Crackers, Fruit, Mineral Water Cup
- Package A Meat: Rice, 1 Main Dish (beef/seafood), Vegetable, Sambal, Crackers, Fruit, Mineral Water Cup
- Package B: Same as A but 2 Main Dishes (any category)
- Package C: Same as A but 3 Main Dishes (any category)
- Plus Package (A+/B+/C+): All regular contents + upgraded drink to Mineral Water 330ml + Pudding
- Minimum order: 50 boxes (delivered). Below 50 boxes, pickup from our kitchen
- Price includes free delivery across Batam

BUFFET (PRASMANAN):
- Uses professional waitstaff (not self-service)
- Package A/B/C: Same as rice box
- Plus Package: Additional Pudding and Vegetable Soup. Free equipment and venue setup
- Minimum order: 50 portions. Waitstaff service requires minimum 100 portions
- Buffet equipment, tables, chafing dishes included in price

WEDDING BUFFET:
- Full service with complete team: stall staff, food handlers, distribution runners, fruit handlers, cleaning team
- Family does not need to manage catering during the event
- KSM keeps kitchen team and ingredients on standby throughout event
- Tableware (plates, spoons, forks) provided per guest count, not washed on-site
- All buffet equipment included in package price
- Minimum order: 150 portions
- Food stalls available: Batagor, Pempek Palembang, Siomay, Bakso, Soto, Chicken Satay + Lontong, Dimsum, Surabi, Ketan Srikaya, Ketan Durian, Bubur Sumsum, Fruit Salad, Bubur Candil

BENTO:
- Premium rice box with premium packaging
- Suitable for lunch, meetings, gatherings, fun days, special guests
- Minimum order: 25 boxes (pickup). 50 boxes and above get free delivery

SNACK BOX:
- For meetings, seminars, training, formal or casual events
- Minimum order: 50 boxes (delivered). Below 50, pickup from kitchen

AQIQAH:
- Meat-based menus: satay, gulai, and other dishes
- Available for female and male goat packages
- Free bonus: aqiqah invitation video and aqiqah certificate
- Sharia-compliant and practical

TUMPENG:
- For thanksgiving, birthdays, ceremonial events
- Minimum order: 50 boxes delivered. Below 50, pickup from kitchen

CORPORATE CATERING:
- For companies, institutions, daily operational needs
- Implements Good Manufacturing Practices (GMP)
- Capacity up to 10,000 portions/day
- Flexible pricing

INDIVIDUAL DISHES (LAUK SATUAN):
- Can order dishes only without a package, minimum 100 pcs

MENU OPTIONS:
Rice: White Rice, Yellow Rice (+Rp 2,000), Nasi Lemak (+Rp 2,000)
Chicken Dishes: Fried Chicken Kalasan, Grilled Chicken Kecap, Chicken Rendang, Crispy Chicken Kremes
Fish Dishes: Ikan Balado, Grilled Fish Kecap, Ikan Rica-rica, Sweet Sour Fish Fillet
Beef Dishes: Beef Rendang, Beef Semur, Beef Bumbu Bali, Krengseng Beef, Black Pepper Beef
Seafood: Fried Shrimp, Spicy Shrimp, Fried Squid, Spicy Squid
Side Dishes: Perkedel, Tempe/Tofu, Corn Fritter, Potato & Liver Sambal Goreng, Shredded Potato
Vegetables: Urap, Pecel, Vegetable Soup, Stir-fried Green Beans, Stir-fried Bean Sprouts with Anchovy, Sayur Lodeh, Labu Siam Gulai, Stir-fried Long Beans, Fresh Veggies, Stir-fried Cabbage, Capcay (+Rp 2,000), Sayur Asem (+Rp 2,000)
Sambal (50-99 boxes): Sambal Ijo, Sambal Terasi
Sambal (100+ boxes): Sambal Ijo, Sambal Terasi, Sambal Mangga, Sambal Bajak
Fruit: Banana or Orange (included)
Drink: Mineral Water Cup (regular), Mineral Water 330ml (plus package)
Pudding: plus package only

RECOMMENDATIONS:
- Beef: Black Pepper, Beef Rendang, Bumbu Bali
- Chicken: Chicken Rendang, Grilled Kecap, Kremes
- Fish: Sweet Sour Fish Fillet, Rica-Rica
- Seafood: Fried Shrimp, Fried Squid
- Vegetables: Stir-fried Green Beans, Stir-fried Long Beans
- Side Dishes: Potato & Liver Sambal Goreng, Shredded Potato
- Sambal: Sambal Ijo

IMPORTANT RULES:
- Orders must be uniform — no splitting (e.g. cannot order 50 boxes with 10 chicken and 40 beef)
- Can request spicier flavor, applies to entire order
- Package components follow chosen package — cannot add extra dishes outside package
- No discounts, but price already includes free delivery across Batam
- Menu not on the list can be requested to sales
- Installment payment, down payment, or custom budget: contact sales
- For detailed pricing: contact sales
`;

const SYSTEM_PROMPT = `You are Vika, KSM Katering's Virtual Assistant.

IDENTITY:
- Never use "saya", "aku", "I", or "me". Always use "Vika" instead.

FORMATTING RULES:
- CRITICAL: Never use asterisks (*) in any form. No bold, no italic, no bullet asterisks.
- For lists, always use numbers (1. 2. 3.) or hyphens (-).

RESPONSE RULES:
- Do not fabricate information not in the data.
- For pricing, DP, cicilan, budget custom, menu di luar daftar: arahkan user ke tombol WhatsApp hijau di pojok kanan atas chat.
- Never write WhatsApp links or phone numbers.
- For any customization requests (spiciness, specific preferences, special notes): always direct the user to add their request in the "Catatan" (notes) field when filling out the order form on the website. Do not offer to record or process any customization directly.
- Untuk semua permintaan kustomisasi (tingkat kepedasan, preferensi khusus, catatan tambahan): selalu arahkan pengguna untuk menambahkan permintaan tersebut di kolom Catatan saat mengisi form informasi pemesanan di website. Jangan menawarkan untuk mencatat atau memproses permintaan apapun secara langsung.
- For orders 50 boxes and above (Indonesian): sampaikan untuk memesan langsung melalui website dengan menekan tombol Pesan Sekarang di paket yang diinginkan.
- For orders 50 boxes and above (English): let the user know they can place an order directly on the website by clicking the Order Now button on their desired package.
- For orders below 50 (Indonesian): sampaikan bahwa untuk pesanan di bawah 50, silahkan hubungi Tim KSM dengan menekan tombol Hubungi Kami, dan pengambilan dilakukan sendiri ke dapur kami.
- For orders below 50 (English): let the user know that for orders below 50, they can contact the KSM team by pressing the Contact Us button, and pickup is done directly at our kitchen.`;

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const messages: Message[] = body.messages;
    const lang: string = body.lang ?? "id";

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Messages harus berupa array" },
        { status: 400 },
      );
    }

    const langInstruction =
      lang === "en"
        ? `The user selected English. Always respond in English. Use this data: ${KSM_DATA_EN}`
        : `Pengguna memilih Bahasa Indonesia. Selalu gunakan Bahasa Indonesia. Gunakan data ini: ${KSM_DATA_ID}`;

    const fullSystemPrompt = `${langInstruction}\n\n${SYSTEM_PROMPT}`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "system", content: fullSystemPrompt }, ...messages],
        max_tokens: 1000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData: OpenAIError = await response.json();
      console.error("OpenAI Error:", errorData);
      return NextResponse.json(
        { error: errorData.error?.message || "OpenAI API error" },
        { status: response.status },
      );
    }

    const data: OpenAIResponse = await response.json();
    const reply = data.choices[0]?.message?.content ?? "";

    function sanitizeReply(text: string): string {
      if (!text) return text;
      let s = String(text);
      // Convert lines starting with '*' or '•' to '- '
      s = s.replace(/^\s*[\*•]\s+/gm, "- ");
      // Remove bold/italic markers using asterisks or underscores
      s = s.replace(/\*\*([\s\S]*?)\*\*/g, "$1");
      s = s.replace(/\*([\s\S]*?)\*/g, "$1");
      s = s.replace(/_([\s\S]*?)_/g, "$1");
      // Collapse repeated hyphens from list conversions (optional cleanup)
      s = s.replace(/^-\s+-\s+/gm, "- ");
      return s;
    }

    const sanitized = sanitizeReply(reply);

    return NextResponse.json({ reply: sanitized });
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
