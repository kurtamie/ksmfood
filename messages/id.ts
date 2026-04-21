const serviceItems = {
  aqiqah: {
    label: "Aqiqah",
    description:
      "Layanan aqiqah praktis dengan menu yang terjaga kualitas rasa, kebersihan, dan kehalalannya.",
  },
  "nasi-kotak": {
    label: "Nasi Kotak",
    description:
      "Paket nasi kotak untuk rapat, acara kantor, sekolah, dan berbagai kebutuhan harian maupun event khusus.",
  },
  prasmanan: {
    label: "Prasmanan",
    description:
      "Sajian prasmanan lengkap untuk acara keluarga, gathering, dan kebutuhan katering skala besar.",
  },
  "prasmanan-pernikahan": {
    label: "Prasmanan Pernikahan",
    description:
      "Sajian prasmanan lengkap untuk acara keluarga, gathering, dan kebutuhan katering skala besar.",
  },
  bento: {
    label: "Bento",
    description:
      "Paket bento rapi dan praktis untuk kebutuhan kantor, sekolah, dan acara spesial.",
  },
  "rendang-kemasan": {
    label: "Rendang Kemasan",
    description:
      "Rendang kemasan siap santap dengan rasa khas Minang untuk oleh-oleh dan stok praktis.",
  },
  "snack-kotak": {
    label: "Snack Kotak",
    description:
      "Pilihan snack kotak untuk meeting, seminar, pelatihan, dan acara formal maupun informal.",
  },
  tumpeng: {
    label: "Tumpeng",
    description:
      "Tumpeng untuk syukuran, ulang tahun, dan acara seremonial dengan tampilan rapi dan istimewa.",
  },
  "katering-korporat": {
    label: "Katering Korporat",
    description:
      "Solusi katering korporat untuk perusahaan, instansi, dan kebutuhan operasional dengan standar layanan profesional.",
  },
};

const messages = {
  common: {
    orderNow: "Mulai Pesan",
    contactUs: "Hubungi Kami",
    downloadMenu: "Unduh Menu",
    consultNow: "Konsultasi Sekarang",
    orderNowShort: "Pesan Sekarang",
    free: "Gratis",
  },
  languages: {
    trigger: "Bahasa Indonesia",
    label: "Bahasa",
    id: "Bahasa Indonesia",
    en: "English",
    min: "Minang (Padang)",
  },
  header: {
    home: "Beranda",
    services: "Layanan",
    gallery: "Galeri",
    about: "Tentang Kami",
    contact: "Kontak",
    openMenu: "Buka menu",
    closeMenu: "Tutup menu",
  },
  navigation: {
    gallery: {
      event: "Acara",
      menu: "Menu",
      video: "Video",
    },
    about: {
      ksm: "Tentang KSM",
      contact: "Kontak",
    },
  },
  footer: {
    company: "PT Katering Sukses Mandiri",
    servicesTitle: "Layanan",
    galleryTitle: "Galeri",
    aboutTitle: "Tentang KSM",
    locationTitle: "Lokasi Kami",
    openMaps: "Buka di Google Maps",
    copyright: "Copyright © 2026 KSM Katering. All rights reserved.",
    serviceLinks: [
      "Prasmanan Pernikahan",
      "Prasmanan",
      "Nasi Kotak",
      "Bento",
      "Rendang Kemasan",
      "Snack Kotak",
      "Snack Tampah",
      "Tumpeng",
    ],
    aboutLinks: ["Tentang KSM", "Hubungi Kami"],
  },
  services: {
    items: serviceItems,
  },
  home: {
    hero: {
      title: "Layanan Katering Untuk",
      words: ["Pernikahan", "Aqiqah", "Perusahaan", "Pertemuan"],
      tagline: "Katering ku, ya KSM Katering",
      primaryCta: "Lihat Paket",
      secondaryCta: "Hubungi Kami",
    },
    about: {
      titleLead: "Tentang",
      titleBrand: "KSM Katering",
      paragraph1:
        "KSM Katering berdiri sejak tahun 2007 sebagai penyedia layanan katering halal yang menghadirkan sajian lezat, sehat, dan higienis. Kami telah melayani berbagai kebutuhan dari perusahaan, rumah sakit, sekolah, instansi pemerintahan, kementerian, perbankan, hingga maskapai penerbangan di Batam.",
      paragraph2:
        "Kami juga melayani berbagai jenis acara seperti pernikahan, pertemuan, ibadah haji, dan acara lainnya.",
      paragraph3:
        "Dengan pengalaman lebih dari 17 tahun, KSM Katering siap menjadi solusi katering terbaik untuk berbagai jenis acara Anda.",
      cta: "Lihat Lebih Banyak",
    },
    servicesSection: {
      titleLead: "Layanan",
      titleBrand: "KSM Katering",
    },
    whyChooseSection: {
      titleLead: "Mengapa Memilih",
      titleBrand: "KSM?",
    },
    clientsSection: {
      title: "Dipercaya Oleh Klien Kami",
    },
    testimonialsSection: {
      title: "Biarkan Pelanggan Kami yang Bercerita",
    },
    faqSection: {
      title: "Yang Sering Ditanyakan",
    },
    legalSection: {
      title: "Legalitas Yang Terjamin",
    },
    contactSection: {
      title: "Siap Menyediakan Katering untuk Acara Anda",
      description:
        "Diskusikan kebutuhan acara Anda bersama kami dan dapatkan solusi katering yang sesuai.",
      primaryCta: "Mulai Pesan",
      secondaryCta: "Konsultasi Sekarang",
    },
  },
  homeMenu: {
    viewPackage: "Lihat Paket",
    downloadMenu: "Unduh Menu",
    cards: [
      {
        id: 1,
        title: "Prasmanan Pernikahan",
        price: "Mulai dari Rp:32.000/porsi",
      },
      { id: 2, title: "Prasmanan", price: "Mulai dari Rp:32.000/porsi" },
      { id: 3, title: "Nasi Kotak", price: "Mulai dari Rp:25.000/kotak" },
      { id: 4, title: "Bento", price: "Mulai dari Rp:56.000/kotak" },
      {
        id: 5,
        title: "Rendang Kemasan",
        price: "Mulai dari Rp:80.000/kemasan",
      },
      { id: 6, title: "Snack Kotak", price: "Mulai dari Rp:13.000" },
      { id: 7, title: "Aqiqah", price: "Harga disesuaikan" },
      { id: 8, title: "Tumpeng", price: "Mulai dari Rp:700.000" },
      { id: 9, title: "Katering Korporat", price: "Harga disesuaikan" },
    ],
  },
  whyChoose: {
    reasons: [
      {
        id: 1,
        title: "Katering Penerbangan",
        description:
          "KSM merupakan satu-satunya katering di Batam yang dipercaya melayani kebutuhan katering maskapai Garuda Indonesia.",
      },
      {
        id: 2,
        title: "Berpengalaman",
        description:
          "KSM memiliki pengalaman 17 tahun dalam melayani berbagai jenis acara dan kebutuhan kantin perusahaan industri di Batam.",
      },
      {
        id: 3,
        title: "Pilihan Masakan",
        description:
          "Menyediakan beragam menu masakan Nusantara yang dapat dipilih sesuai dengan selera Anda.",
      },
      {
        id: 4,
        title: "Cita Rasa",
        description:
          "Menghadirkan cita rasa masakan Nusantara dengan racikan bumbu rempah yang khas.",
      },
      {
        id: 5,
        title: "Tim Berpengalaman",
        description:
          "Didukung tim yang terbiasa menangani berbagai skala acara dengan pelayanan profesional.",
      },
    ],
  },
  faq: {
    items: [
      {
        id: "type",
        question: "Apakah KSM Katering melayani berbagai jenis acara?",
        answer:
          "Ya, kami melayani berbagai jenis acara seperti pernikahan, aqiqah, acara kantor, dan kebutuhan lainnya.",
      },
      {
        id: "minimal",
        question: "Berapa minimal pemesanan katering?",
        answer:
          "Minimal pemesanan katering kami adalah 20 porsi untuk setiap jenis acara.",
      },
      {
        id: "support",
        question: "Bagaimana cara menghubungi layanan pelanggan?",
        answer:
          "Anda dapat menghubungi kami melalui email, obrolan langsung, atau telepon. Kami akan merespons dalam waktu 24 jam pada hari kerja.",
      },
      {
        id: "price",
        question: "Apakah harga sudah termasuk perlengkapan dan pelayanan?",
        answer:
          "Ya, harga yang kami tawarkan sudah termasuk perlengkapan dan pelayanan.",
      },
      {
        id: "order",
        question: "Bagaimana cara melakukan pemesanan?",
        answer:
          "Anda dapat melakukan pemesanan melalui email, obrolan langsung, atau telepon. Kami akan merespons dalam waktu 24 jam pada hari kerja.",
      },
    ],
    title: "Masih Memiliki Pertanyaan?",
    cta: "Konsultasi Sekarang",
  },
  legal: {
    primary: ["Sertifikat Halal MUI", "Sertifikat Laik Higiene Sanitasi"],
    secondary: ["Sertifikat Ahli Gizi", "Surat Izin Usaha", "NPWP"],
  },
  testimonials: {
    sliderLabel: "Slider testimonial",
    items: [
      {
        id: 1,
        name: "Rina Maharani",
        text: "Pesanan untuk acara keluarga datang tepat waktu, tampilannya rapi, dan rasanya konsisten enak dari awal sampai akhir.",
      },
      {
        id: 2,
        name: "Fajar Nugroho",
        text: "Tim KSM sangat mudah diajak koordinasi. Menu prasmanannya lengkap dan tamu kantor kami banyak yang minta rekomendasinya.",
      },
      {
        id: 3,
        name: "Dewi Lestari",
        text: "Saya suka karena porsinya pas, bumbunya terasa, dan penyajiannya bikin acara lamaran kami terlihat lebih berkelas.",
      },
      {
        id: 4,
        name: "Aldo Pratama",
        text: "Snack box dan makan siangnya sama-sama memuaskan. Packaging bersih dan semua pesanan diterima sesuai permintaan.",
      },
      {
        id: 5,
        name: "Nadia Permata",
        text: "Pilihan menunya fleksibel dan rasanya cocok untuk tamu dari berbagai usia. Ini sangat membantu saat acara besar keluarga.",
      },
      {
        id: 6,
        name: "Rizky Ananda",
        text: "Pelayanannya cepat saat kami butuh revisi jumlah porsi. Respons admin juga jelas dan tidak bertele-tele.",
      },
    ],
  },
  portfolio: {
    title: "Momen Bersama KSM Katering",
    cta: "Lihat Galeri Lengkap",
    slide: "Slide {number}",
  },
  sectionRoutes: {
    ricebox: [
      { href: "#tentang", label: "Tentang" },
      { href: "#layanan", label: "Paket" },
      { href: "#minimum-order", label: "Minimum Order" },
      { href: "#pilihan-menu", label: "Pilihan Menu" },
      { href: "#hubungi-kami", label: "Hubungi" },
    ],
    prasmanan: [
      { href: "#tentang", label: "Tentang" },
      { href: "#layanan", label: "Paket" },
      { href: "#informasi-pemesanan", label: "Info Pesan" },
      { href: "#pilihan-menu", label: "Pilihan Menu" },
      { href: "#hubungi-kami", label: "Hubungi" },
    ],
    aqiqah: [
      { href: "#tentang", label: "Tentang" },
      { href: "#menu", label: "Paket" },
      { href: "#bonus", label: "Bonus" },
      { href: "#hubungi-kami", label: "Hubungi" },
    ],
  },
  riceboxPage: {
    hero: {
      eyebrow: "Nasi Kotak",
      title: "Praktis, higienis dengan menu bervariasi",
      cta: "Unduh Menu",
    },
    about: {
      titleHighlight: "Paling populer",
      titleBody: "dengan cita rasa yang",
      titleAccent: "tak terlupakan",
      paragraph1:
        "KSM Katering dikenal akan kualitas dan cita rasa masakannya yang lezat karena menggunakan bahan-bahan segar dan berkualitas tinggi untuk menyajikan hidangan yang lezat dan bergizi.",
      paragraph2:
        "Nasi kotak KSM Katering merupakan salah satu pilihan yang populer dan praktis untuk menikmati makanan di berbagai acara atau kegiatan.",
    },
    packages: {
      titleLead: "Paket",
      titleBrand: "Nasi Kotak",
    },
    minimumOrder:
      "Minimum order 50 kotak diantar, di bawah 50 kotak dijemput ke dapur kami.",
    menuSection: {
      titleLead: "Pilihan",
      titleBrand: "Menu",
    },
  },
  riceboxMenu: {
    popular: "Paling Populer",
    orderNow: "Pesan Sekarang",
  },
  riceboxMenuServices: {
    mainTitle: "Lauk Utama",
    sideTitle: "Pendamping",
  },
  riceboxCta: {
    title: "Siap memesan nasi kotak untuk acara Anda?",
    description: "Praktis, lezat, dan terpercaya untuk setiap momen Anda.",
    orderLink:
      "https://wa.me/628111171713?text=Halo%2C%20saya%20ingin%20pesan%20nasi%20kotak.",
    consultLink:
      "https://wa.me/628111171713?text=Halo%2C%20saya%20ingin%20konsultasi%20nasi%20kotak.",
  },
  aqiqahPage: {
    hero: {
      eyebrow: "Aqiqah",
      title: "Syar'i dan praktis bersama KSM Katering",
      cta: "Unduh Menu",
    },
    about: {
      titleLead: "Praktis",
      titleAccent: "& Syar'i",
      paragraph1:
        "KSM Katering hadir untuk memudahkan keluarga dalam menyelenggarakan acara aqiqah.",
      paragraph2:
        "Kami menyediakan beragam pilihan menu olahan daging yang lezat seperti sate, gulai, dan hidangan lainnya.",
      paragraph3:
        "Anda juga mendapatkan bonus video undangan aqiqah dan sertifikat aqiqah secara gratis.",
    },
    bonus: {
      badge: "Bonus Eksklusif",
      titleLead: "Video Undangan",
      titleBrand: "& Sertifikat Aqiqah",
    },
  },
  aqiqahMenu: {
    package: "Paket",
    femaleTitle: "Kambing Betina",
    maleTitle: "Kambing Jantan",
    popular: "Paling Populer",
    orderNow: "Pesan Sekarang",
  },
  aqiqahBonus: {
    invitationTitle: "Video Undangan Aqiqah",
    certificateTitle: "Sertifikat Aqiqah",
  },
  aqiqahCta: {
    title: "Siap memesan paket aqiqah untuk keluarga Anda?",
    description: "Praktis, syar'i, dan lezat untuk momen penuh syukur.",
    orderLink:
      "https://wa.me/628111171713?text=Halo%2C%20saya%20ingin%20pesan%20paket%20aqiqah.",
    consultLink:
      "https://wa.me/628111171713?text=Halo%2C%20saya%20ingin%20konsultasi%20paket%20aqiqah.",
  },
  prasmananPage: {
    hero: {
      eyebrow: "Prasmanan",
      title: "Cita rasa tak terlupakan, pengalaman yang mengesankan",
      cta: "Unduh Menu",
    },
    about: {
      titleLead: "Praktis, Bersih",
      titleAccent: "dan Berkualitas",
      paragraph1:
        "Prasmanan adalah solusi yang praktis dan populer bagi banyak orang untuk menyajikan hidangan lezat dan bervariasi dalam berbagai acara khusus, mulai dari pertemuan bisnis hingga perayaan pribadi.",
      paragraph2:
        "Prasmanan dari KSM Katering adalah pilihan yang cerdas bagi Anda yang ingin memanjakan lidah para tamu undangan dengan berbagai macam hidangan khas nusantara. Kami juga menyediakan layanan pramusaji untuk melayani tamu undangan.",
    },
    packages: {
      titleLead: "Paket",
      titleBrand: "Prasmanan",
    },
    orderingInfo: {
      titleLead: "Informasi",
      titleAccent: "Pemesanan",
      deliveryTitle: "Gratis Pengiriman",
      deliveryDescription: "Tersedia",
      equipmentTitle: "Peralatan Prasmanan Tersedia",
      equipmentDescription: "Disertai layanan penataan tempat.",
      serviceTitle: "Layanan Pramusaji",
      serviceDescription: "Minimal pemesanan 100 porsi",
      minimumTitle: "Minimum Order",
      minimumDescription: "50 Porsi",
    },
    menuSection: {
      titleLead: "Pilihan",
      titleBrand: "Menu",
    },
  },
  prasmananMenu: {
    popular: "Paling Populer",
  },
  prasmananMenuServices: {
    mainTitle: "Lauk Utama",
    sideTitle: "Pendamping",
  },
  prasmananCta: {
    title: "Prasmanan Praktis, Momen Berkesan",
    description:
      "Bukan hanya hidangan yang berkualitas, tapi juga kenangan yang bisa dibagikan dan disimpan selamanya.",
    orderLink:
      "https://wa.me/628111171713?text=Halo%2C%20saya%20ingin%20pesan%20prasmanan.",
    consultLink:
      "https://wa.me/628111171713?text=Halo%2C%20saya%20ingin%20konsultasi%20prasmanan.",
  },
  weddingPage: {
    hero: {
      eyebrow: "Prasmanan Pernikahan",
      title: "Harmoni dalam pelayanan dan sajian yang terbaik",
      cta: "Unduh Menu Prasmanan Pernikahan",
      cta2: "Unduh Menu Katering Pondokan",
    },
    about: {
      titleLead: "Layanan Terbaik, ",
      titleAccent: "dari yang Terbaik",
      paragraph1:
        "Nikmati layanan penuh dari KSM Katering untuk acara pernikahan Anda. Kami menyediakan layanan prasmanan dengan beragam pilihan menu yang nikmat, serta didukung oleh tim pelayan yang siap melayani tamu undangan Anda dengan sigap.",
    },
    packages: {
      titleLead: "Paket",
      titleBrand: "Prasmanan Pernikahan",
    },
    orderingInfo: {
      titleLead: "Informasi",
      titleAccent: "Pemesanan",
      deliveryTitle: "Gratis Pengiriman",
      deliveryDescription: "Tersedia",
      equipmentTitle: "Peralatan Prasmanan Tersedia",
      equipmentDescription: "Untuk pelayanan stan dan kebersihan",
      serviceTitle: "Layanan Pramusaji",
      serviceDescription: "Minimal pemesanan 100 porsi",
      toolsTitle: "Peralatan Makan",
      toolsDescription: "Disediakan lengkap dan bersih",
      minimumTitle: "Minimum Order",
      minimumDescription: "150 Porsi",
    },
    menuSection: {
      titleLead: "Pilihan",
      titleBrand: "Menu",
    },
  },
  weddingMenu: {
    popular: "Paling Populer",
  },
  weddingMenuServices: {
    mainTitle: "Lauk Utama",
    sideTitle: "Pendamping",
  },
  weddingStand: {
    mainTitle: "Katering Pondokan",
    cards: [
      {
        id: 1,
        title: "Batagor",
      },
      { id: 2, title: "Pempek Palembang" },
      { id: 3, title: "Siomay" },
      { id: 4, title: "Bakso" },
      {
        id: 5,
        title: "Soto",
      },
      { id: 6, title: "Sate Ayam + Lontong" },
      { id: 7, title: "Dimsum" },
      { id: 8, title: "Surabi" },
      { id: 9, title: "Ketan Srikaya" },
      { id: 10, title: "Ketan Durian" },
      { id: 11, title: "Bubur Sumsum" },
      { id: 12, title: "Salad Buah" },
      { id: 13, title: "Bubur Candil" },
    ],
  },
  weddingCta: {
    title: "Sajian Terbaik untuk Hari Istimewa Anda",
    description:
      "Nikmati layanan prasmanan lengkap dengan cita rasa istimewa dan tim profesional yang siap melayani setiap detail acara Anda.",
    orderLink:
      "https://wa.me/628111171713?text=Halo%2C%20saya%20ingin%20pesan%prasmanan%20pernikahan.",
    consultLink:
      "https://wa.me/628111171713?text=Halo%2C%20saya%20ingin%20konsultasi%20prasmanan%20pernikahan.",
  },
  serviceDetail: {
    eyebrow: "Layanan KSM Katering",
    primaryCta: "Hubungi Kami",
    secondaryCta: "Kembali ke Layanan",
    items: serviceItems,
  },
  sectionPage: {
    primaryCta: "Hubungi Kami",
    secondaryCta: "Kembali ke Beranda",
  },
  galleryPages: {
    event: {
      eyebrow: "Galeri Acara",
      title: "Dokumentasi acara bersama KSM Katering",
      description:
        "Halaman ini disiapkan untuk menampilkan momen pelayanan KSM Katering di berbagai acara. Konten lengkap dapat ditambahkan pada route file `/gallery/event`.",
    },
    menu: {
      eyebrow: "Galeri Menu",
      title: "Pilihan menu andalan KSM Katering",
      description:
        "Halaman ini disiapkan untuk menampilkan koleksi menu unggulan KSM Katering. Konten lengkap dapat dikembangkan pada route file `/gallery/menu`.",
    },
    video: {
      eyebrow: "Galeri Video",
      title: "Video layanan dan momen KSM Katering",
      description:
        "Halaman ini disiapkan untuk menampilkan video promosi, dokumentasi acara, dan konten visual KSM Katering.",
    },
  },
  aboutKsmPage: {
    hero: {
      eyebrow: "Tentang KSM Katering",
      title:
        "Berdiri sejak 2007, KSM Katering merupakan katering halal yang berdedikasi dalam memberikan pelayanan dan kualitas makanan terbaik. Dengan fasilitas dapur berstandar kebersihan tinggi dan kapasitas produksi hingga 8.000 porsi per hari, didukung oleh peralatan canggih dan modern, kami juga dipercaya untuk melayani katering maskapai Garuda Indonesia di Batam.",
    },
    vision: {
      titleLead: "Visi & Misi",
      visionTitle: "Visi",
      visionDescription:
        "Menjadi perusahaan jasa boga berkualitas untuk acara, industri, instansi swasta, dan pemerintahan di seluruh Indonesia.",
      missionTitle: "Misi",
      missionDescription:
        "Menerapkan Cara Produksi yang Baik (CPB) dalam mencapai kepuasan pelanggan.",
    },
    strategy: {
      titleLead: "Strategi",
      subtitle: "Meningkatkan kepuasan pelanggan melalui:",
      items: [
        "Membangun dan memperbaiki sistem untuk menjamin kualitas produk dan layanan tetap terjaga sesuai standar yang ditetapkan.",
        "Meningkatkan pelayanan dengan menjaga kualitas produk dan layanan yang diberikan.",
        "Mengembangkan sumber daya manusia.",
        "Menciptakan lingkungan kerja yang kondusif, harmonis, dan manusiawi.",
      ],
    },
    contactSection: {
      title: "Siap Menyediakan Katering untuk Acara Anda",
      description:
        "Diskusikan kebutuhan acara Anda bersama kami dan dapatkan solusi katering yang sesuai.",
      primaryCta: "Mulai Pesan",
      secondaryCta: "Konsultasi Sekarang",
    },
  },
  aboutPages: {
    contact: {
      eyebrow: "Kontak KSM",
      title: "Hubungi tim KSM Katering",
      description:
        "Halaman ini disiapkan untuk memudahkan calon pelanggan menghubungi tim KSM Katering untuk konsultasi maupun pemesanan.",
    },
  },
} as const;

export default messages;
