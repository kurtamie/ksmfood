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

const KSM_DATA = `
DATA PRODUK KSM CATERING:

1. NASI KOTAK:
   - Paket A (Ayam/Daging): Nasi, 1 Lauk Utama, 1 Lauk Tambahan, Sayur, Sambal, Kerupuk, Buah, Sanford Gelas.
   - Paket B: (Sama dengan A tapi 2 Lauk Utama).
   - Paket C: (Sama dengan A tapi 3 Lauk Utama).
   - Paket A+/B+/C+: Upgrade air ke Sanford 330ml dan Tambahan Puding.

2. PRASMANAN:
   - Paket A/B/C: (Sama dengan Nasi Kotak).
   - Paket A+/B+/C+: Tambahan Puding & Soup Sayur. Gratis peralatan & setting tempat.

PILIHAN MENU:
   - Lauk Utama: Ayam (Kalasan, Rendang, Bakar, dll), Daging (Lada Hitam, Rendang, Dendeng), Ikan (Asam Manis, Rica-rica), Seafood (Sotong/Udang Goreng Tepung).
   - Lauk Tambahan: Perkedel, Tempe/Tahu, Bakwan Jagung, Sambal Goreng Kentang Hati.
   - Sayur: Urap, Capcay, Sup Sayuran, Tumis-tumisan.

KETENTUAN & INFO PENTING:
   - Lokasi: Muka Kuning, Batam (Shophouse Blok D1 No. 19).
   - Pembayaran: Mandiri A/n PT Katering Sukses Mandiri (012345678910).
   - Minimal Order: 50 porsi (Nasi Kotak & Prasmanan).
   - Ongkir: Gratis se-Batam (Min 50 porsi). Dibawah 50 porsi charge 50rb atau jemput di lokasi.
   - Kontak Sales (Yuni): https://wa.me/6281371790122
   - Keunggulan: Berpengalaman sejak 2007, Kapasitas 8000 porsi, Sertifikat Halal & Higiene.
`;

const SYSTEM_PROMPT = `Kamu adalah asisten virtual KSM Catering yang ramah dan profesional.
Tugasmu adalah membantu pelanggan mendapatkan informasi lengkap seputar produk, menu, paket, dan ketentuan pemesanan KSM Catering.

Berikut adalah data lengkap produk dan layanan KSM Catering yang harus kamu gunakan sebagai acuan:
${KSM_DATA}

PANDUAN MENJAWAB:
- Jawab dalam Bahasa Indonesia yang ramah dan sopan.
- Jika pelanggan menanyakan harga, sampaikan bahwa harga dapat dikonfirmasi langsung ke sales kami (Yuni) via WhatsApp: https://wa.me/6281371790122
- Jika pelanggan ingin pesan atau butuh detail lebih lanjut, arahkan ke kontak Yuni.
- Jika ada pertanyaan di luar data yang kamu miliki, sampaikan dengan jujur dan arahkan ke kontak sales.
- Jangan mengarang informasi yang tidak ada di data di atas.`;

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const messages: Message[] = body.messages;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Messages harus berupa array" },
        { status: 400 }
      );
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages,
        ],
        max_tokens: 1000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData: OpenAIError = await response.json();
      console.error("OpenAI Error:", errorData);
      return NextResponse.json(
        { error: errorData.error?.message || "OpenAI API error" },
        { status: response.status }
      );
    }

    const data: OpenAIResponse = await response.json();
    const reply = data.choices[0]?.message?.content ?? "";

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}