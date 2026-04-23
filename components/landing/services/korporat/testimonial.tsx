const reasons = [
  {
    title: "Halal",
    description:
      "KSM Katering telah terdaftar dan tersertifikasi halal MUI serta memiliki sertifikat laik higienis dari Kemenkes RI, sehingga menjamin kehalalan dan kebersihan setiap hidangan.",
  },
  {
    title: "Bahan Baku Berkualitas",
    description:
      "Kami memilih bahan baku berkualitas tinggi dan mengolahnya dengan proses terbaik untuk menjaga cita rasa serta kehigienisan setiap hidangan.",
  },
  {
    title: "Kapasitas Produksi",
    description:
      "Kami memiliki dapur dengan kapasitas produksi hingga 8.000 porsi per hari, siap memenuhi kebutuhan katering dalam skala besar dengan kualitas yang konsisten.",
  },
  {
    title: "Menu Variatif dan Sehat",
    description:
      "Beragam pilihan menu yang dirancang untuk memenuhi kebutuhan gizi dan selera, cocok untuk kebutuhan harian maupun acara perusahaan.",
  },
  {
    title: "Pengiriman Tepat Waktu",
    description:
      "Layanan pengiriman yang andal dan tepat waktu untuk memastikan kebutuhan konsumsi perusahaan tiba sesuai jadwal.",
  },
  {
    title: "Fleksibilitas dan Kemudahan Pemesanan",
    description:
      "Penyesuaian menu, jumlah pesanan, dan harga sesuai anggaran serta kebutuhan perusahaan agar proses pemesanan lebih praktis.",
  },
];

function Testimonial() {
  return (
    <div className="w-full bg-[#9D0000] py-14 text-white sm:py-16 lg:py-20">
      <div className="mx-auto flex w-full max-w-7xl flex-col px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold leading-tight sm:text-4xl lg:text-6xl">
            Mengapa Memilih KSM Katering?
          </h2>
        </div>

        <div className="mt-10 grid w-full grid-cols-1 gap-5 sm:mt-12 sm:grid-cols-2 lg:grid-cols-3 lg:gap-7">
          {reasons.map((reason) => (
            <article
              key={reason.title}
              className="flex min-h-55 flex-col items-center rounded-[20px] bg-white px-5 py-8 text-center text-[#262626] shadow-[0_12px_30px_rgba(0,0,0,0.12)] sm:min-h-60 sm:px-6"
            >
              <div className="flex h-12 items-center justify-center">
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  className="size-8 text-[#9D0000]"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              </div>

              <h3 className="mt-2 text-xl font-bold leading-snug text-[#9D0000] sm:text-2xl">
                {reason.title}
              </h3>

              <p className="mt-4 max-w-[32ch] text-sm leading-6 sm:text-base sm:leading-7">
                {reason.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Testimonial;
