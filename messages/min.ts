const serviceItems = {
  aqiqah: {
    label: "Aqiqah",
    description:
      "Layanan aqiqah nan praktih jo kualitas raso, kabersihan, jo ka halalannyo tatap tajago.",
  },
  "nasi-kotak": {
    label: "Nasi Kotak",
    description:
      "Paket nasi kotak untuak rapek, acara kantor, sakola, jo kabutuahan harian ataupun acara khusus.",
  },
  prasmanan: {
    label: "Prasmanan",
    description:
      "Hidangan prasmanan langkok untuak acara keluarga, gathering, jo kabutuahan katering skala gadang.",
  },
  "prasmanan-pernikahan": {
    label: "Prasmanan Pernikahan",
    description:
      "Hidangan prasmanan langkok untuak pesta nikah jo acara keluarga nan istimewa.",
  },
  "katering-pondokan": {
    label: "Katering Pondokan",
    description:
      "Pilihan menu pondokan untuak malangkok-i pesta nikah, acara keluarga, jo jamuan istimewa.",
  },
  bento: {
    label: "Bento",
    description:
      "Paket bento nan rapi jo praktih untuak kantor, sakola, jo acara istimewa.",
  },
  "rendang-kemasan": {
    label: "Rendang Kemasan",
    description:
      "Rendang siap santap jo raso khas Minang untuak oleh-oleh jo stok nan praktih.",
  },
  "snack-kotak": {
    label: "Snack Kotak",
    description:
      "Pilihan snack kotak untuak meeting, seminar, pelatihan, jo acara formal ataupun santai.",
  },
  tumpeng: {
    label: "Tumpeng",
    description:
      "Tumpeng untuak syukuran, ulang tahun, jo acara seremonial jo tampilan nan rapi.",
  },
  "katering-korporat": {
    label: "Katering Korporat",
    description:
      "Solusi katering korporat untuak perusahaan jo instansi jo standar layanan nan profesional.",
  },
};

const messages = {
  common: {
    orderNow: "Mulai Pasan",
    contactUs: "Hubungi Kami",
    downloadMenu: "Unduah Menu",
    consultNow: "Konsultasi Kini",
    orderNowShort: "Pasan Kini",
    free: "Gratis",
  },
  cart: {
    title: "Keranjang",
    ariaLabel: "Keranjang balanja",
    clear: "Kosongkan",
    close: "Tutuik keranjang",
    removeItem: "Hapuih item",
    decrease: "Kurangi",
    emptyTitle: "Keranjang masih kosong",
    emptyDescription: "Tambahkan pasan dari halaman layanan kami",
    total: "Total Pasanan",
    checkout: "Lanjuik ka Checkout",
    processing: "Mamproses...",
    checkoutError: "Gagal mambuek pasanan. Cubo lai.",
  },
  cartConfirm: {
    thanks: "Tarimo kasih, pasanan angku",
    close: "Tutuik modal",
    ready: "Pasanan siap ditambahkan ka keranjang",
    addMore: "Tambah Menu Lainnyo",
    checkout: "Pasan kini",
    processing: "Mamproses...",
    checkoutError: "Gagal mambuek pasanan. Cubo lai.",
  },
  orderModal: {
    checkout: "Pasan Kini",
    fields: {
      rice: "Nasi",
      mainDish: "Lauk Utama",
      additionalDish: "Lauk Tambahan",
      vegetable: "Sayur",
      sauce: "Sambal",
      cracker: "Kerupuk",
      fruit: "Buah",
      drink: "Minuman",
      pudding: "Puding",
      soup: "Sup Sayuran",
      snack: "Kue",
      pricePerPackage: "Harga / Paket",
      packageContents: "Isi Paket",
      quantity: "Jumlah",
      subtotal: "Subtotal Pasanan",
      extraCharge: "Biaya Tambahan",
      total: "Total",
      qty: "Jumlah",
    },
    placeholders: {
      rice: "Pilih Nasi",
      category: "Pilih Kategori",
      menu: "Pilih Menu",
      additionalDish: "Pilih Lauk Tambahan",
      vegetable: "Pilih Sayur",
      sauce: "Pilih Sambal",
      snack: "Pilih Kue",
    },
    units: {
      box: "Kotak",
      portion: "Porsi",
      package: "Paket",
      tumpeng: "Tumpeng",
    },
    messages: {
      includedDetails: "Detail paket alah tamasuak samuo item di bawah.",
      minimum: "Jumlah pasanan indak bisa di bawah {count}. Untuak pasanan labiah ketek, silakan hubungi tim kami.",
      minimumPackage: "Jumlah pasanan minimal {count} {unit}.",
      pondokanMinimum: "Jumlah minimal {count} porsi.",
      surcharge: "Pilihan kue tertentu dikenakan tambahan biaya",
    },
  },
  accountMenu: {
    signedInAs: "Masuak sabagai",
    myAccount: "Akun Ambo",
    orderHistory: "Riwayat Pamesanan",
    logout: "Kalua",
    login: "Masuak",
  },
  logoutConfirm: {
    title: "Kalua dari akun?",
    description:
      "Angku akan kalua dari akun KSM Katering. Keranjang untuak sesi iko akan dikosongkan dan halaman nan paralu login indak dapek diakses sampai masuak baliak.",
    cancel: "Batal",
    confirm: "Iyo, Kalua",
    loading: "Kalua...",
  },
  profile: {
    title: "Pangaturan jo Alamat",
    fields: {
      customerName: "Namo Customer",
      phone: "Nomor Handphone",
      fullAddress: "Alamat Langkok",
      subdistrict: "Kelurahan",
      pinpoint: "Pinpoint Lokasi",
      coordinates: "Koordinat",
    },
    placeholders: {
      subdistrict: "Pilih Kelurahan",
      pinpoint: "Cari lokasi / ketik namo tampek",
      otpCode: "Masukkan kode OTP 6 digit",
    },
    address: {
      title: "Alamat Pengiriman",
      empty: "Alun ado alamat tasimpan.",
      editTitle: "UBAH ALAMAT",
      addTitle: "TAMBAH ALAMAT",
    },
    actions: {
      save: "Simpan",
      saving: "Manyimpan...",
      sending: "Nyang ngirim...",
      cancel: "Batal",
      editAddress: "Ubah Alamat",
      addAddress: "Tambah Alamat Baru",
      sendOtp: "Kirim Kode OTP",
      verifyOtp: "Verifikasi OTP",
      verifyingOtp: "Nyang verifikasi...",
      resendOtp: "Indak manang kode? Kirim ulang kode",
    },
    messages: {
      noChanges: "Indak ado perubahan",
      saveProfileFailed: "Gagal manyimpan profil",
      profileUpdated: "Profil berhasil dipabarui",
      otpSent: "Kode OTP sudah dikirim ke nomor baru.",
      otpVerified: "Nomor telepon alah berhasil diverifikasi. Kini bisa manyimpan parubahan profil.",
      verifyPhoneFirst: "Verifikasi nomor baru dulu.",
      otpSendFailed: "Gagal ngirim OTP. Cobak deui.",
      otpVerifyFailed: "Kode OTP indak valid atau kaedaluwarsa.",
      otpCodeRequired: "Isikan 6 digit kode OTP.",
      phoneAlreadyUsed: "Nomor telepon sudah dipakai akun lain.",
      phoneVerificationHint: "Nomor baru kudu diverifikasi make kode OTP.",
      addressRequired: "Alamat langkok wajib diisi",
      pinpointRequired: "Pinpoint lokasi wajib dipilih",
      addressSaved: "Alamat berhasil disimpan",
    },
    mapAriaLabel: "Peta alamat customer",
    mapHelp:
      "Klik peta untuak manandai lokasi dan simpan latitude/longitude.",
  },
  orderHistory: {
    title: "Riwayat Pamesanan",
    description:
      "Liek samuo pasanan terakhir, status pambayaran, jo detail pasanan.",
    loading: "Mamuik pasanan...",
    empty: "Alun ado pasanan. Mulai pasan dari halaman layanan kami.",
    orderStatus: "Status Pasanan",
    paymentStatuses: {
      paid: "Dibayar",
      unpaid: "Alun Dibayar",
      overdue: "Jatuh Tempo",
      expired: "Jatuh Tempo",
    },
    actions: {
      viewDetail: "Liek Detail",
    },
    steps: {
      waiting_payment: "Manunggu Pambayaran",
      packing: "Sadang Dikameh",
      send: "Pengiriman",
      success: "Ditarimo",
      expired: "Pambayaran Kedaluwarsa",
    },
    errors: {
      loadFailed: "Gagal mamuik riwayat pasanan.",
    },
  },
  orderDetail: {
    title: "Detail Pasanan",
    loading: "Mamuik detail pasanan...",
    notFound: "Pasanan indak basuo.",
    paymentStatus: "Status Pambayaran",
    paymentStatuses: {
      paid: "Dibayar",
      unpaid: "Alun Dibayar",
      overdue: "Jatuh Tempo",
      expired: "Jatuh Tempo",
    },
    orderStatus: "Status Pasanan",
    orderedAt: "Tanggal Pamesanan",
    invoiceNo: "Nomor Tagihan",
    deliveryInfo: "Informasi Pengiriman",
    recipientName: "Namo Penerima",
    phoneNo: "No. Telepon",
    deliveryMethod: "Metode Pengiriman",
    deliveryByKsm: "Diantakan dek KSM Katering",
    deliveryDate: "Tanggal Kirim",
    address: "Alamat",
    notes: "Catatan",
    orderItems: "Detail Pasanan",
    qty: "Jumlah",
    unit: "kotak",
    emptyItems: "Detail item alun tersedia.",
    paymentDetails: "Rincian Pambayaran",
    subtotal: "Subtotal",
    total: "Total Pasanan",
    actions: {
      backToHistory: "Baliak ka Riwayat",
      createNewOrder: "Buek Pasanan Baru",
      openingPayment: "Mambuka pambayaran...",
      resumePayment: "Lanjuikkan Pambayaran",
    },
    expiredBanner: {
      title: "Pasanan iko indak dapek diproses",
      description:
        "Pambayaran untuak pasanan iko alah jatuh tempo sahinggo pasanan indak dapek dilanjuikkan. Silakan buek pasanan baru.",
    },
    steps: {
      waiting_payment: "Manunggu Pambayaran",
      packing: "Pasanan sadang dikameh",
      send: "Dalam pengiriman",
      success: "Pasanan Ditarimo",
    },
  },
  orderStepper: {
    steps: {
      waiting_payment: {
        label: "Manunggu Pambayaran",
        sublabel: "Tagihan alun dibayar",
      },
      packing: {
        label: "Packing",
        sublabel: "Pasanan sadang disiapkan",
      },
      send: {
        label: "Pengiriman",
        sublabel: "Dalam perjalanan",
      },
      success: {
        label: "Ditarimo",
        sublabel: "Pasanan salasai",
      },
      expired: {
        label: "Pambayaran Kedaluwarsa",
        sublabel: "Tagihan alah kedaluwarsa",
      },
    },
    banner: {
      waiting_payment:
        "Pasanan alah dibuek dan manunggu pambayaran sabalun mulai diproses.",
      packing:
        "Pasanan angku sadang dikameh jo teliti. Mohon manunggu.",
      send:
        "Pasanan sadang dalam perjalanan ka alamat angku. Harap siap untuak manarimo.",
      success:
        "Pasanan alah ditarimo. Tarimo kasih alah mamasan di KSM Katering.",
      expired:
        "Pambayaran untuak pasanan iko alah kedaluwarsa. Pasanan indak dapek diproses labiah lanjut.",
    },
  },
  contactPage: {
    hero: {
      eyebrow: "Hubungi KSM Katering",
      title:
        "Kami siap mambantu angku. Untuak informasi labiah lanjut tantang layanan jo penawaran terbaik, silakan hubungi tim kami.",
    },
    team: {
      titleLead: "Tim Kami Siap",
      titleAccent: "Mambantu Angku",
    },
    location: {
      titleLead: "Lokasi",
      titleAccent: "Kami",
      mapTitle: "Lokasi KSM Katering",
      hoursLabel: "Jam Operasional",
      hoursValue: "Senin - Minggu, 08.00 - 17.00",
    },
  },
  languages: {
    trigger: "Minang (Padang)",
    label: "Bahaso",
    id: "Bahasa Indonesia",
    en: "English",
    min: "Minang (Padang)",
  },
  header: {
    home: "Barando",
    services: "Layanan",
    gallery: "Galeri",
    about: "Tentang Kami",
    contact: "Kontak",
    openMenu: "Bukak menu",
    closeMenu: "Tutuik menu",
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
    copyright: "Copyright © 2026 KSM Katering. Hak cipta dilinduangi.",
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
      title: "Layanan Katering Untuak",
      words: ["Pernikahan", "Aqiqah", "Perusahaan", "Pataruangan"],
      tagline: "Kalau urusan katering, yo KSM Katering",
      primaryCta: "Liek Paket",
      secondaryCta: "Hubungi Kami",
    },
    about: {
      titleLead: "Tentang",
      titleBrand: "KSM Katering",
      paragraph1:
        "KSM Katering alah berdiri dari tahun 2007 sabagai panyadia katering halal nan manyajikan makanan nan lamak, sehat, jo higienis. Kami alah malayani baragam kabutuahan dari perusahaan, rumah sakik, sakola, instansi pamarintah, kementerian, perbankan, sampai maskapai di Batam.",
      paragraph2:
        "Kami juo malayani macam-macam acara sarupo pesta nikah, pataruangan, ibadah haji, jo acara lainnyo.",
      paragraph3:
        "Jo pangalaman labiah dari 17 tahun, KSM Katering siap manjadi solusi katering terbaik untuak macam-macam acara angku.",
      cta: "Liek Labiah Banyak",
    },
    servicesSection: {
      titleLead: "Layanan",
      titleBrand: "KSM Katering",
    },
    whyChooseSection: {
      titleLead: "Apo Alasan Miliah",
      titleBrand: "KSM?",
    },
    clientsSection: {
      title: "Diparcayo dek Klien Kami",
    },
    testimonialsSection: {
      title: "Biakan Palanggan Kami nan Bacerito",
    },
    faqSection: {
      title: "Nan Sering Ditanyoan",
    },
    legalSection: {
      title: "Legalitas Nan Tajamin",
    },
    contactSection: {
      title: "Siap Manyadiakan Katering untuak Acara Angku",
      description:
        "Diskusikan kabutuahan acara angku jo kami lalu dapek solusi katering nan pas.",
      primaryCta: "Mulai Pasan",
      secondaryCta: "Konsultasi Kini",
    },
  },
  homeMenu: {
    viewPackage: "Liek Paket",
    downloadMenu: "Unduah Menu",
    cards: [
      {
        id: 1,
        title: "Prasmanan Pernikahan",
        price: "Mulai dari Rp 32.000/porsi",
      },
      { id: 2, title: "Prasmanan", price: "Mulai dari Rp 32.000/porsi" },
      { id: 3, title: "Nasi Kotak", price: "Mulai dari Rp 25.000/kotak" },
      { id: 4, title: "Bento", price: "Mulai dari Rp 56.000/kotak" },
      {
        id: 5,
        title: "Rendang Kemasan",
        price: "Mulai dari Rp 80.000/kemasan",
      },
      { id: 6, title: "Snack Kotak", price: "Mulai dari Rp 13.000" },
      { id: 7, title: "Aqiqah", price: "Harga disasuaikan" },
      { id: 8, title: "Tumpeng", price: "Mulai dari Rp 700.000" },
      { id: 9, title: "Katering Korporat", price: "Harga disasuaikan" },
    ],
  },
  whyChoose: {
    reasons: [
      {
        id: 1,
        title: "Katering Penerbangan",
        description:
          "KSM adolah satu-satunyo katering di Batam nan diparcayo malayani kabutuahan katering Garuda Indonesia.",
      },
      {
        id: 2,
        title: "Bapangalaman",
        description:
          "KSM punyo pangalaman 17 tahun malayani macam acara jo kantin perusahaan industri di Batam.",
      },
      {
        id: 3,
        title: "Pilihan Masakan",
        description:
          "Menyadiakan baragam menu masakan Nusantara nan bisa dipilih sasuai selera angku.",
      },
      {
        id: 4,
        title: "Cita Rasa",
        description:
          "Mambao cita raso masakan Nusantara jo racikan bumbu rempah nan khas.",
      },
      {
        id: 5,
        title: "Tim Bapangalaman",
        description:
          "Didukung tim nan alah biaso manangani acara baragam skala jo pelayanan profesional.",
      },
    ],
  },
  faq: {
    items: [
      {
        id: "type",
        question: "Apokah KSM Katering malayani macam-macam acara?",
        answer:
          "Iyo, kami malayani macam-macam acara sarupo pernikahan, aqiqah, acara kantor, jo kabutuahan lainnyo.",
      },
      {
        id: "minimal",
        question: "Barapo minimal pasanan katering?",
        answer:
          "Minimal pasanan katering kami 20 porsi untuak satiok jenis acara.",
      },
      {
        id: "support",
        question: "Bagaimano caro manghubungi layanan pelanggan?",
        answer:
          "Angku dapek manghubungi kami malalui email, chat langsung, atau telepon. Kami bakal maraspons dalam 24 jam di hari karajo.",
      },
      {
        id: "price",
        question: "Apokah harga alah tamasuak perlengkapan jo pelayanan?",
        answer:
          "Iyo, harga nan kami tawarkan alah tamasuak perlengkapan jo pelayanan.",
      },
      {
        id: "order",
        question: "Bagaimano caro mambuek pasanan?",
        answer:
          "Angku dapek mambuek pasanan malalui email, chat langsung, atau telepon. Kami bakal maraspons dalam 24 jam di hari karajo.",
      },
    ],
    title: "Masiah Punya Patanyaan?",
    cta: "Konsultasi Kini",
  },
  legal: {
    primary: ["Sertifikat Halal MUI", "Sertifikat Laik Higiene Sanitasi"],
    secondary: ["Sertifikat Ahli Gizi", "Surat Izin Usaha", "NPWP"],
  },
  testimonials: {
    sliderLabel: "Slider testimoni",
    items: [
      {
        id: 1,
        name: "Rina Maharani",
        text: "Pasanan untuak acara keluarga tibo tepat wakatu, tampilannyo rapi, jo rasanyo konsisten lamak dari awal sampai akhir.",
      },
      {
        id: 2,
        name: "Fajar Nugroho",
        text: "Tim KSM gampang diajak koordinasi. Menu prasmanannyo langkok jo banyak tamu kantor kami minta rekomendasi.",
      },
      {
        id: 3,
        name: "Dewi Lestari",
        text: "Ambo suka karano porsinyo pas, bumbunyo taraso, jo panyajiannyo mambuek acara lamaran kami talihat labiah rancak.",
      },
      {
        id: 4,
        name: "Aldo Pratama",
        text: "Snack box jo makan siangnyo duo-duonyo mamuaskan. Packaging basiah jo pasanan tibo sasuai permintaan.",
      },
      {
        id: 5,
        name: "Nadia Permata",
        text: "Pilihan menunyo fleksibel jo rasanyo cocok untuak tamu dari baragam usia. Ko sangat mambantu di acara keluarga gadang.",
      },
      {
        id: 6,
        name: "Rizky Ananda",
        text: "Palayanannyo capek waktu kami butuh ubahan jumlah porsi. Respons admin juo jelas jo ndak baputiah-panjang.",
      },
    ],
  },
  portfolio: {
    title: "Momen Basamo KSM Katering",
    cta: "Liek Galeri Lengkap",
    slide: "Slide {number}",
  },
  sectionRoutes: {
    ricebox: [
      { href: "#tentang", label: "Tentang" },
      { href: "#layanan", label: "Paket" },
      { href: "#minimum-order", label: "Minimum Order" },
      { href: "#galeri-bento", label: "Galeri" },
      { href: "#pilihan-menu", label: "Pilihan Menu" },
      { href: "#hubungi-kami", label: "Hubungi" },
    ],
    prasmanan: [
      { href: "#tentang", label: "Tentang" },
      { href: "#layanan", label: "Paket" },
      { href: "#informasi-pemesanan", label: "Info Pasanan" },
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
      title: "Praktih, higienis, jo pilihan menu nan baragam",
      cta: "Unduah Menu",
    },
    about: {
      titleHighlight: "Paling diminati",
      titleBody: "jo cita raso nan",
      titleAccent: "indak talupoan",
      paragraph1:
        "KSM Katering dikenal jo kualitas jo cita raso masakannyo nan lamak karano mamakai bahan-bahan segar jo bakualitas tinggi.",
      paragraph2:
        "Nasi kotak KSM Katering jadi salah satu pilihan nan populerr jo praktih untuak macam-macam acara.",
    },
    packages: {
      titleLead: "Paket",
      titleBrand: "Nasi Kotak",
    },
    minimumOrder:
      "Minimum order 50 kotak bisa dianta, di bawah 50 kotak bisa dijapuik ka dapur kami.",
    gallerySection: {
      title: "Pilihan Bento Kami",
    },
    menuSection: {
      titleLead: "Pilihan",
      titleBrand: "Menu",
    },
  },
  riceboxMenu: {
    popular: "Paling Populer",
    orderNow: "Pasan Kini",
  },
  riceboxMenuServices: {
    mainTitle: "Lauk Utamo",
    sideTitle: "Pendamping",
  },
  riceboxCta: {
    title: "Siap mamasan nasi kotak untuak acara angku?",
    description: "Praktih, lamak, jo taparcayo untuak satiok momen.",
    orderLink:
      "https://wa.me/628111171713?text=Halo%2C%20sayo%20indaknyo%20mamasan%20nasi%20kotak.",
    consultLink:
      "https://wa.me/628111171713?text=Halo%2C%20sayo%20indaknyo%20konsultasi%20nasi%20kotak.",
  },
  aqiqahPage: {
    hero: {
      eyebrow: "Aqiqah",
      title: "Syar'i jo praktih basamo KSM Katering",
      cta: "Unduah Menu",
    },
    about: {
      titleLead: "Praktih",
      titleAccent: "& Syar'i",
      paragraph1:
        "KSM Katering hadir untuak mamaramahkan keluarga dalam manyalanggara acara aqiqah.",
      paragraph2:
        "Kami manyadiakan macam pilihan menu olahan daging nan lamak sarupo sate, gulai, jo hidangan lainnyo.",
      paragraph3:
        "Angku juo mandapek bonus video undangan aqiqah jo sertifikat aqiqah sacara gratis.",
    },
    bonus: {
      badge: "Bonus Eksklusif",
      titleLead: "Video Undangan",
      titleBrand: "& Sertifikat Aqiqah",
    },
  },
  aqiqahMenu: {
    package: "Paket",
    femaleTitle: "Kambing Batino",
    maleTitle: "Kambing Jantan",
    popular: "Paling Populer",
    orderNow: "Pasan Kini",
  },
  aqiqahBonus: {
    invitationTitle: "Video Undangan Aqiqah",
    certificateTitle: "Sertifikat Aqiqah",
  },
  aqiqahCta: {
    title: "Siap mamasan paket aqiqah untuak keluarga angku?",
    description: "Praktih, syar'i, jo lamak untuak momen syukur.",
    orderLink:
      "https://wa.me/628111171713?text=Halo%2C%20sayo%20indaknyo%20mamasan%20paket%20aqiqah.",
    consultLink:
      "https://wa.me/628111171713?text=Halo%2C%20sayo%20indaknyo%20konsultasi%20paket%20aqiqah.",
  },
  prasmananPage: {
    hero: {
      eyebrow: "Prasmanan",
      title: "Cita raso nan indak talupoan, pangalaman nan mangesankan",
      cta: "Unduah Menu",
    },
    about: {
      titleLead: "Praktih, Barasiah",
      titleAccent: "jo Bakualitas",
      paragraph1:
        "Prasmanan adolah solusi nan praktih jo populerr untuak manyajiakan hidangan nan lamak jo baragam di macam acara, dari patamuoan bisnis sampai acara pribadi.",
      paragraph2:
        "Prasmanan dari KSM Katering jadi pilihan nan cadiak untuak manjamu tamu jo macam hidangan khas nusantara. Kami juo manyadiakan layanan pramusaji untuak malayani tamu undangan.",
    },
    packages: {
      titleLead: "Paket",
      titleBrand: "Prasmanan",
    },
    orderingInfo: {
      titleLead: "Informasi",
      titleAccent: "Pasanan",
      deliveryTitle: "Gratis Pengiriman",
      deliveryDescription: "Tarsadio",
      equipmentTitle: "Paralatan Prasmanan Tarsadio",
      equipmentDescription: "Disarato layanan panataan tampek.",
      serviceTitle: "Layanan Pramusaji",
      serviceDescription: "Minimal pasanan 100 porsi",
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
    mainTitle: "Lauk Utamo",
    sideTitle: "Sides",
  },
  prasmananCta: {
    title: "Prasmanan Praktih, Momen Bakasan",
    description:
      "Bukan cuman hidangan nan bakualitas, tapi juo kenangan nan bisa dibagi jo disimpan salamo-lamo.",
    orderLink:
      "https://wa.me/628111171713?text=Halo%2C%20sayo%20indaknyo%20mamasan%20prasmanan.",
    consultLink:
      "https://wa.me/628111171713?text=Halo%2C%20sayo%20indaknyo%20konsultasi%20prasmanan.",
  },
  serviceDetail: {
    eyebrow: "Layanan KSM Katering",
    primaryCta: "Hubungi Kami",
    secondaryCta: "Kembali ka Layanan",
    items: serviceItems,
  },
  sectionPage: {
    primaryCta: "Hubungi Kami",
    secondaryCta: "Kembali ka Barando",
  },
  galleryPages: {
    event: {
      eyebrow: "Galeri Acara",
      title: "Dokumentasi acara basamo KSM Katering",
      description:
        "Halaman ko disiapkan untuak manampilkan momen layanan KSM Katering di macam-macam acara. Konten lengkapnyo bisa ditambah di route file `/gallery/event`.",
    },
    menu: {
      eyebrow: "Galeri Menu",
      title: "Pilihan menu andalan KSM Katering",
      description:
        "Halaman ko disiapkan untuak manampilkan koleksi menu unggulan KSM Katering. Konten lengkapnyo bisa dikembangkan di route file `/gallery/menu`.",
    },
    video: {
      eyebrow: "Galeri Video",
      title: "Video layanan jo momen KSM Katering",
      description:
        "Halaman ko disiapkan untuak manampilkan video promosi, dokumentasi acara, jo konten visual KSM Katering.",
    },
  },
  aboutPages: {
    ksm: {
      eyebrow: "Tentang KSM",
      title: "Profil singkek KSM Katering",
      description:
        "Halaman ko disiapkan untuak manampilkan profil perusahaan, sejarah, jo nilai utama KSM Katering sacara labiah lengkap.",
    },
    contact: {
      eyebrow: "Kontak KSM",
      title: "Hubungi tim KSM Katering",
      description:
        "Halaman ko disiapkan untuak mamuadahkan calon palanggan manghubungi tim KSM Katering untuak konsultasi jo pasanan.",
    },
  },
  aboutKsmPage: {
    hero: {
      eyebrow: "Tentang KSM Katering",
      title:
        "Berdiri dari tahun 2007, KSM Katering adolah katering halal nan bardedikasi dalam mambarikan pelayanan jo kualitas makanan terbaik. Jo fasilitas dapur barstandar kabersihan tinggi jo kapasitas produksi sampai 8.000 porsi saban hari, didukung alat nan canggih jo modern, kami juo diparcayo malayani katering maskapai Garuda Indonesia di Batam.",
    },
    vision: {
      titleLead: "Visi & Misi",
      visionTitle: "Visi",
      visionDescription:
        "Manjadi perusahaan jasa boga bakualitas untuak acara, industri, instansi swasta, jo pamarintahan di saluruah Indonesia.",
      missionTitle: "Misi",
      missionDescription:
        "Manarapkan Cara Produksi nan Baik untuak mancapaian kapuasan palanggan.",
    },
    strategy: {
      titleLead: "Strategi",
      subtitle: "Meningkekkan kapuasan palanggan malalui:",
      items: [
        "Mambangun jo mamperbaiki sistem untuak manjamin kualitas produk jo layanan tatap tajago sasuai standar nan ditatapkan.",
        "Meningkekkan pelayanan jo manjago kualitas produk jo layanan nan dibarikan.",
        "Mangambangkan sumber daya manusia.",
        "Manciptakan lingkungan karajo nan kondusif, harmonis, jo manusiawi.",
      ],
    },
  },
} as const;

export default messages;
