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
  "katering-pondokan": {
    label: "Katering Pondokan",
    description:
      "Pilihan menu pondokan untuk melengkapi acara pernikahan, keluarga, dan kebutuhan jamuan spesial.",
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
  cart: {
    title: "Keranjang",
    ariaLabel: "Keranjang belanja",
    clear: "Kosongkan",
    close: "Tutup keranjang",
    removeItem: "Hapus item",
    decrease: "Kurangi",
    emptyTitle: "Keranjang masih kosong",
    emptyDescription: "Tambahkan pesanan dari halaman layanan kami",
    total: "Total Pesanan",
    checkout: "Lanjut ke Checkout",
    processing: "Memproses...",
    checkoutError: "Gagal membuat pesanan. Coba lagi.",
  },
  cartConfirm: {
    thanks: "Terima kasih, pesanan anda",
    close: "Tutup modal",
    ready: "Pesanan siap ditambahkan ke keranjang",
    addMore: "Tambah Menu Lainnya",
    checkout: "Pesan sekarang",
    processing: "Memproses...",
    checkoutError: "Gagal membuat pesanan. Coba lagi.",
  },
  orderModal: {
    checkout: "Pesan Sekarang",
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
      subtotal: "Subtotal Pesanan",
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
      includedDetails: "Detail paket sudah termasuk semua item di bawah.",
      minimum: "Jumlah pesanan tidak bisa di bawah {count}. Untuk pesanan lebih sedikit, silahkan hubungi tim kami.",
      minimumPackage: "Jumlah pesanan minimal {count} {unit}.",
      pondokanMinimum: "Jumlah minimal {count} porsi.",
      surcharge: "Pilihan kue tertentu dikenakan tambahan biaya",
    },
  },
  accountMenu: {
    signedInAs: "Masuk sebagai",
    myAccount: "Akun Saya",
    orderHistory: "Riwayat Pemesanan",
    logout: "Keluar",
    login: "Masuk",
  },
  logoutConfirm: {
    title: "Keluar dari akun?",
    description:
      "Anda akan keluar dari akun KSM Katering. Anda perlu masuk kembali untuk mengakses fitur yang memerlukan login.",
    cancel: "Batal",
    confirm: "Ya, Keluar",
    loading: "Keluar...",
  },
  profile: {
    title: "Pengaturan Akun dan Alamat",
    fields: {
      customerName: "Nama Pelanggan",
      phone: "Nomor Handphone",
      fullAddress: "Alamat Lengkap",
      subdistrict: "Kelurahan",
      pinpoint: "Pinpoint Lokasi",
      coordinates: "Koordinat",
    },
    placeholders: {
      subdistrict: "Pilih Kelurahan",
      pinpoint: "Cari lokasi / ketik nama tempat",
      otpCode: "Masukkan 6 digit kode OTP Anda",
    },
    address: {
      title: "Alamat Pengiriman",
      empty: "Belum ada alamat tersimpan.",
      editTitle: "UBAH ALAMAT",
      addTitle: "TAMBAH ALAMAT",
    },
    actions: {
      save: "Simpan",
      saving: "Menyimpan...",
      sending: "Mengirim...",
      cancel: "Batal",
      editProfile: "Ubah Profil",
      editAddress: "Ubah Alamat",
      addAddress: "Tambah Alamat Baru",
      sendOtp: "Kirim Kode OTP",
      verifyOtp: "Verifikasi OTP",
      verifyingOtp: "Memverifikasi...",
      resendOtp: "Tidak menerima kode? Kirim ulang kode",
    },
    messages: {
      noChanges: "Tidak ada perubahan",
      saveProfileFailed: "Gagal menyimpan profil",
      profileUpdated: "Profil berhasil diperbarui",
      otpSent: "Kode OTP telah dikirim ke nomor baru.",
      otpVerified: "Nomor telepon berhasil diverifikasi. Anda bisa lanjut menyimpan perubahan profil.",
      verifyPhoneFirst: "Verifikasi nomor baru terlebih dahulu.",
      otpSendFailed: "Gagal mengirim OTP. Coba lagi.",
      otpVerifyFailed: "Kode OTP tidak valid atau sudah kadaluarsa.",
      otpCodeRequired: "Masukkan 6 digit kode OTP.",
      phoneAlreadyUsed: "Nomor telepon sudah digunakan oleh akun lain.",
      phoneVerificationHint: "Nomor baru harus diverifikasi dengan kode OTP.",
      addressRequired: "Alamat lengkap wajib diisi",
      pinpointRequired: "Pinpoint lokasi wajib dipilih",
      addressSaved: "Alamat berhasil disimpan",
    },
    mapAriaLabel: "Peta alamat customer",
    mapHelp:
      "Klik peta untuk menandai lokasi dan simpan latitude/longitude.",
  },
  orderHistory: {
    title: "Riwayat Pemesanan",
    description:
      "Lihat semua pesanan terakhir kamu, status pembayaran, dan detail pesanan.",
    loading: "Memuat pesanan...",
    empty: "Belum ada pesanan. Mulai pesan dari halaman layanan kami.",
    orderStatus: "Status Pesanan",
    paymentStatuses: {
      paid: "Dibayar",
      unpaid: "Belum Dibayar",
      overdue: "Jatuh Tempo",
      expired: "Jatuh Tempo",
    },
    actions: {
      viewDetail: "Lihat Detail",
    },
    steps: {
      waiting_payment: "Menunggu Pembayaran",
      packing: "Dikemas",
      send: "Pengiriman",
      success: "Diterima",
      expired: "Pembayaran Kedaluwarsa",
    },
    errors: {
      loadFailed: "Gagal memuat riwayat pesanan.",
    },
  },
  orderDetail: {
    title: "Detail Pesanan",
    loading: "Memuat detail pesanan...",
    notFound: "Pesanan tidak ditemukan.",
    paymentStatus: "Status Pembayaran",
    paymentStatuses: {
      paid: "Dibayar",
      unpaid: "Belum Dibayar",
      overdue: "Jatuh Tempo",
      expired: "Jatuh Tempo",
    },
    orderStatus: "Status Pesanan",
    orderedAt: "Tanggal Pemesanan",
    invoiceNo: "Nomor Tagihan",
    deliveryInfo: "Informasi Pengiriman",
    recipientName: "Nama Penerima",
    phoneNo: "Nomor Telepon",
    deliveryMethod: "Metode Pengiriman",
    deliveryByKsm: "Pengantaran oleh KSM Katering",
    deliveryDate: "Tanggal Pengiriman",
    address: "Alamat Pengiriman",
    notes: "Catatan Pengiriman",
    orderItems: "Detail Pesanan",
    qty: "Jumlah",
    unit: "kotak",
    emptyItems: "Detail item belum tersedia.",
    paymentDetails: "Rincian Pembayaran",
    subtotal: "Subtotal",
    extraCharge: "Biaya Tambahan",
    total: "Total Pesanan",
    proofLink: "Lihat bukti",
    proofImageAlt: "Bukti penerimaan pesanan",
    actions: {
      backToHistory: "Kembali ke Riwayat",
      createNewOrder: "Buat Pesanan Baru",
      openingPayment: "Membuka pembayaran...",
      resumePayment: "Lanjutkan Pembayaran",
    },
    expiredBanner: {
      title: "Pesanan ini tidak dapat diproses",
      description:
        "Pembayaran untuk pesanan ini sudah jatuh tempo sehingga pesanan tidak dapat dilanjutkan. Silakan buat pesanan baru untuk melakukan pemesanan ulang.",
    },
    steps: {
      waiting_payment: "Menunggu Pembayaran",
      packing: "Pesanan sedang dikemas",
      send: "Dalam pengiriman",
      success: "Pesanan Diterima",
    },
  },
  orderStepper: {
    steps: {
      waiting_payment: {
        label: "Menunggu Pembayaran",
        sublabel: "Tagihan belum dibayar",
      },
      packing: {
        label: "Dikemas",
        sublabel: "Pesanan sedang disiapkan",
      },
      send: {
        label: "Pengiriman",
        sublabel: "Dalam perjalanan",
      },
      success: {
        label: "Diterima",
        sublabel: "Pesanan selesai",
      },
      expired: {
        label: "Pembayaran Kedaluwarsa",
        sublabel: "Tagihan sudah kedaluwarsa",
      },
    },
    banner: {
      waiting_payment:
        "Pesanan sudah dibuat dan menunggu pembayaran sebelum mulai diproses.",
      packing:
        "Pesanan kamu sedang dikemas dengan teliti. Mohon menunggu ya!",
      send:
        "Pesanan sedang dalam perjalanan menuju alamatmu. Harap siapkan diri untuk menerima.",
      success:
        "Pesanan sudah diterima! Terima kasih telah memesan dari KSM Katering.",
      expired:
        "Pembayaran untuk pesanan ini sudah kedaluwarsa. Pesanan tidak dapat diproses lebih lanjut.",
    },
  },
  languages: {
    trigger: "Bahasa Indonesia",
    label: "Bahasa",
    id: "Bahasa Indonesia",
    en: "English",
    min: "Minang (Padang)",
  },
  orderInfo: {
    title: "Informasi Pesanan",
    titleAccent: "& Pengiriman",
    deliveryInfo: "Informasi Pengiriman",
    orderInfoTitle: "Informasi Pesanan",
    orderDetails: "Detail Pesanan",
    fallbackMenuName: "Menu Pesanan",
    loadingOrderDetails: "Memuat detail pesanan...",
    emptyOrderDetails: "Detail pesanan belum tersedia.",
    loadingSummary: "Memuat ringkasan pesanan...",
    itemCount: "{count} kotak dari {items} item",
    unit: "kotak",
    total: "Total",
    subtotal: "Sub Total Pesanan",
    extraCharge: "Biaya Tambahan",
    payableTotal: "Total yang harus dibayar",
    shippingAddress: "Alamat Pengiriman",
    deliverySchedule: "Jadwal Pengiriman",
    deliveryDateLabel: "Tanggal pengiriman",
    notesLabel: "Catatan",
    mapAriaLabel: "Peta lokasi pengiriman",
    mapHelp:
      "Klik peta untuk menandai lokasi dan simpan latitude/longitude.",
    coordinates: "Koordinat",
    phoneHelp:
      "Nomor telepon harus 10-15 digit dan diawali 62 atau 08.",
    savedAddressHelp:
      "Klik tombol 'Pilih Alamat' untuk menggunakan alamat yang tersimpan",
    steps: {
      info: "Informasi Pesanan & Pengiriman",
      summary: "Ringkasan Pesanan",
    },
    fields: {
      date: "Tanggal",
      arrivalTime: "Jam Sampai",
      fullAddress: "Alamat Lengkap",
      subdistrict: "Kelurahan",
      pinpoint: "Pinpoint Lokasi",
      recipientName: "Nama Penerima",
      recipientPhone: "Telepon Penerima",
      notes: "Catatan Pengiriman (Opsional)",
    },
    placeholders: {
      date: "June 01, 2025",
      fullAddress: "Perumahan GMP Blok N",
      subdistrict: "Pilih Kelurahan",
      pinpoint: "Cari lokasi / ketik nama tempat",
      recipientName: "Nama penerima",
      notes: "Silahkan isi catatan untuk kurir, jika ada",
    },
    deliveryMethod: {
      title: "Metode Pengiriman",
      description: "Pesanan akan diantar oleh KSM dengan gratis ongkir.",
    },
    addressPicker: {
      title: "Lokasi Pengiriman",
      placeholder: "-- Pilih Alamat --",
    },
    actions: {
      selectDate: "Pilih tanggal",
      chooseAddress: "Pilih Alamat",
      confirmChoice: "Konfirmasi Pilihan",
      saving: "Menyimpan...",
      continueSummary: "Lanjut Ringkasan",
      openingPayment: "Membuka pembayaran...",
      payNow: "Bayar Sekarang",
    },
    errors: {
      addressRequired: "Alamat lengkap wajib diisi.",
      subdistrictRequired: "Kelurahan wajib dipilih.",
      recipientNameRequired: "Nama penerima wajib diisi.",
      recipientPhoneRequired: "Telepon penerima wajib diisi.",
      recipientPhoneInvalid:
        "Telepon penerima harus 10-15 digit dan diawali 62 atau 08.",
      deliveryDateRequired: "Tanggal pengiriman wajib diisi.",
      deliveryDateMin: "Tanggal pengiriman minimal {date}.",
      minimumQuantity: "Jumlah pesanan minimal {count}.",
      invalidOrderId: "ID pesanan tidak valid.",
      orderIdUnavailable: "Gagal mendapatkan ID pesanan dari server.",
      orderDetailUnavailable: "Detail pesanan belum tersedia.",
      loadOrderDetailsFailed: "Gagal memuat detail pesanan.",
      saveOrderFailed: "Gagal menyimpan pesanan. Coba lagi.",
      updateInvoiceFailed: "Gagal memperbarui status invoice.",
      paymentTotalUnavailable: "Total pembayaran belum tersedia.",
      midtransClientKeyMissing: "Midtrans client key belum dikonfigurasi.",
      paymentPageUnavailable:
        "Halaman pembayaran gagal dimuat. Silakan muat ulang halaman untuk melanjutkan pembayaran.",
      openPaymentFailed: "Gagal membuka pembayaran Midtrans.",
      midtransDataUnavailable: "Data pembayaran Midtrans tidak tersedia.",
      startPaymentFailed: "Gagal memulai pembayaran Midtrans.",
    },
    payment: {
      success: "Pembayaran berhasil. Status invoice telah diperbarui.",
      successPendingSync:
        "Pembayaran berhasil. Status invoice akan diperbarui via notifikasi Midtrans.",
      pending:
        "Pembayaran menunggu konfirmasi. Status akan diperbarui setelah selesai.",
      error: "Pembayaran gagal atau dibatalkan.",
    },
    leaveConfirm: {
      title: "Tinggalkan halaman pesanan?",
      description:
        "Pesanan ini belum dilanjutkan ke ringkasan. Jika keluar dari halaman ini, pesanan akan dibatalkan dan dihapus dari database.",
      cancel: "Batal",
      confirm: "Ya, Setuju",
      deleting: "Menghapus...",
    },
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
      testimonial: "Testimoni",
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
        "KSM Katering adalah penyedia layanan katering halal di Batam sejak 2007, dengan pengalaman melayani berbagai klien dan acara berskala tinggi dengan kapasitas hingga 8000 porsi/hari.",
      paragraph2:
        "Kami terus menerus melakukan penyempurnaan layanan untuk selalu menyajikan sajian berkelas, citarasa istimewa, tampilan elegan dan standar higienis yang terjaga untuk menyempurnakan setiap moment acara anda.",
      paragraph3:
        "Dengan pengalaman lebih dari 19 tahun, kami telah melayani berbagai kebutuhan katering mulai dari Pernikahan, Acara Pemerintah & Kementerian, Bank, Rumah Sakit, dan Perusahaan-Perusahaan besar di Batam.",
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
      cta: "Lihat Lebih Banyak Testimoni Asli",
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
        price: "Mulai dari Rp 34.000/porsi",
      },
      { id: 2, title: "Prasmanan", price: "Mulai dari Rp 34.000/porsi" },
      { id: 3, title: "Nasi Kotak", price: "Mulai dari Rp 27.000/kotak" },
      { id: 4, title: "Bento", price: "Mulai dari Rp 58.000/kotak" },
      {
        id: 5,
        title: "Rendang Kemasan",
        price: "Mulai dari Rp 80.000/kemasan",
      },
      { id: 6, title: "Snack Kotak", price: "Mulai dari Rp 13.000" },
      { id: 7, title: "Aqiqah", price: "Mulai dari Rp 3.400.000" },
      { id: 8, title: "Tumpeng", price: "Mulai dari Rp 700.000" },
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
          "KSM memiliki pengalaman 19 tahun dalam melayani berbagai jenis acara dan kebutuhan kantin perusahaan industri di Batam.",
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
          "Minimal pemesanan adalah 50 porsi. Untuk prasmanan minimal 100 porsi, katering pondokan pada prasmanan pernikahan minimal 150 porsi, dan untuk bento minimal 25 kotak.",
      },
      {
        id: "support",
        question: "Apakah menu bisa disesuaikan dengan kebutuhan acara?",
        answer:
          "Anda dapat memilih menu sesuai dengan pilihan yang tersedia di website kami. Jika memiliki kebutuhan khusus, silakan klik tombol “Konsultasi Sekarang” dan isi formulir yang tersedia. Tim kami akan segera menghubungi Anda.",
      },
      {
        id: "price",
        question: "Apakah harga sudah termasuk perlengkapan dan pelayanan?",
        answer:
          "Untuk layanan prasmanan, harga sudah termasuk perlengkapan prasmanan, peralatan makan, serta layanan pramusaji.",
      },
      {
        id: "order",
        question: "Bagaimana cara melakukan pemesanan?",
        answer:
          "Anda dapat melakukan pemesanan dengan menghubungi tim kami melalui tombol “Pesan Sekarang”.",
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
        name: "Nurlela0900 Joenjklelha 97",
        text: "Suka kali pesan di disini, makananan nya enak fast respon, ramah. Solusi sih kalau ada acara mendadak",
      },
      {
        id: 2,
        name: "my doni",
        text: "Kemaren aku pesan untuk acara syukuran kata tetangga makanan nya enak, next acara aku mau pesan di catering ini lagi 😄",
      },
      {
        id: 3,
        name: "Cahaya Butarbutar",
        text: "Saya senang pesan catering di ksm dilayani dengan baik saat pesta langsung gercep tim nya, terimakasih ksm atas pelayanan nya🥰",
      },
      {
        id: 4,
        name: "Maulya Safa",
        text: "Catering mantap rasa nyaa enak dan worth it, abang2 di lapangan pada baik2, mantapp",
      },
      {
        id: 5,
        name: "Darwinto Winto",
        text: "Nasi kotak murah dan worth it enak masakannya ges",
      },
      {
        id: 6,
        name: "Riski Gulo",
        text: "Rekomendasi untuk acara rumahan enakk",
      },
      {
        id: 7,
        name: "Thienna San",
        text: "pelayanan nya bagus",
      },
      {
        id: 8,
        name: "Andra Yunisa",
        text: "enak lengkap🌸",
      },
      {
        id: 9,
        name: "virlo sitorus",
        text: "Ksm mantap👍",
      },
      {
        id: 10,
        name: "Marta Endarwati",
        text: "Great company",
      },
    ],
    cta: "Lihat Lebih Banyak Testimoni Asli",
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
    wedding: [
      { href: "#tentang", label: "Tentang" },
      { href: "#layanan", label: "Paket" },
      { href: "#informasi-pemesanan", label: "Info Pesan" },
      { href: "#pilihan-menu", label: "Pilihan Menu" },
      { href: "#stand", label: "Pondokan" },
      { href: "#faq", label: "Faq" },
      { href: "#hubungi-kami", label: "Hubungi" },
    ],
    aqiqah: [
      { href: "#tentang", label: "Tentang" },
      { href: "#menu", label: "Paket" },
      { href: "#bonus", label: "Bonus" },
      { href: "#hubungi-kami", label: "Hubungi" },
    ],
    snackBox: [
      { href: "#tentang", label: "Tentang" },
      { href: "#layanan", label: "Paket" },
      { href: "#pilihan-menu", label: "Pilihan Menu" },
      { href: "#hubungi-kami", label: "Hubungi" },
    ],
    bento: [
      { href: "#tentang", label: "Tentang" },
      { href: "#layanan", label: "Paket" },
      { href: "#informasi-pemesanan", label: "Info Pesan" },
      { href: "#pilihan-menu", label: "Pilihan Menu" },
      { href: "#galeri", label: "Galeri" },
      { href: "#hubungi-kami", label: "Hubungi" },
    ],
    tumpeng: [
      { href: "#tentang", label: "Tentang" },
      { href: "#layanan", label: "Paket" },
      { href: "#hubungi-kami", label: "Hubungi" },
    ],
    korporat: [
      { href: "#tentang", label: "Tentang" },
      { href: "#layanan", label: "Paket" },
      { href: "testimonial", label: "Testimoni" },
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
      "https://wa.me/6281371790122?text=Halo%2C%20saya%20ingin%20pesan%20nasi%20kotak.",
    consultLink:
      "https://wa.me/6282288175957?text=Halo%2C%20saya%20ingin%20konsultasi%20nasi%20kotak.",
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
      titleBrand: "Sertifikat Aqiqah",
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
      "https://wa.me/6281371790122?text=Halo%2C%20saya%20ingin%20pesan%20paket%20aqiqah.",
    consultLink:
      "https://wa.me/6282288175957?text=Halo%2C%20saya%20ingin%20konsultasi%20paket%20aqiqah.",
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
      "https://wa.me/6281371790122?text=Halo%2C%20saya%20ingin%20pesan%20prasmanan.",
    consultLink:
      "https://wa.me/6282288175957?text=Halo%2C%20saya%20ingin%20konsultasi%20prasmanan.",
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
    orderNow: "Pesan Sekarang",
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
      "https://wa.me/6281371790122?text=Halo%2C%20saya%20ingin%20pesan%prasmanan%20pernikahan.",
    consultLink:
      "https://wa.me/6282288175957?text=Halo%2C%20saya%20ingin%20konsultasi%20prasmanan%20pernikahan.",
  },
  weddingFaq: {
    items: [
      {
        id: "service",
        question: "Apakah KSM menyediakan layanan full service untuk wedding?",
        answer:
          "Ya. KSM menghadirkan layanan full service dengan jumlah tim yang disesuaikan dengan skala acara. Untuk acara dengan jumlah tamu besar, kami menyiapkan tim yang lengkap dan terstruktur guna memastikan seluruh operasional berjalan dengan optimal. Setiap tim terdiri dari petugas stall, penjaga lauk, runner distribusi makanan, petugas buah, hingga tim kebersihan yang bekerja secara terkoordinasi. Dengan sistem ini, seluruh alur katering tertangani dengan baik, sehingga Anda dapat menikmati momen pernikahan tanpa perlu mengkhawatirkan detail di lapangan.",
      },
      {
        id: "family",
        question:
          "Apakah pihak keluarga perlu terlibat dalam pengelolaan katering saat acara?",
        answer:
          "Tidak perlu. Seluruh alur katering—mulai dari penyajian, pengisian ulang makanan, hingga kebersihan area—ditangani sepenuhnya oleh tim KSM. Anda dan keluarga bisa fokus menikmati momen tanpa distraksi.",
      },
      {
        id: "empty",
        question: "Bagaimana jika makanan hampir habis saat acara berlangsung?",
        answer:
          "Anda tidak perlu khawatir kehabisan hidangan di momen penting. KSM menyiagakan tim dapur beserta ketersediaan bahan baku selama acara berlangsung sebagai langkah antisipasi. Jika terjadi lonjakan tamu atau kebutuhan tambahan, hidangan dapat segera diproses dan dikirim ke lokasi acara dalam waktu cepat. Dengan sistem ini, kelancaran jamuan tetap terjaga dan Anda dapat menikmati acara dengan tenang.",
      },
      {
        id: "wash",
        question: "Apakah KSM mencuci peralatan makan di lokasi acara?",
        answer:
          "Tidak. Untuk menjaga efisiensi dan kebersihan area acara, seluruh peralatan makan tidak dicuci di lokasi. Kami menyiapkan jumlah peralatan sesuai dengan total tamu, sehingga alur pelayanan tetap lancar tanpa mengganggu jalannya acara.",
      },
      {
        id: "total",
        question: "Apakah jumlah peralatan makan mencukupi untuk semua tamu?",
        answer:
          "Ya. KSM menyediakan piring, sendok, dan garpu sesuai dengan jumlah pesanan tamu. Hal ini memastikan setiap tamu mendapatkan pengalaman makan yang nyaman tanpa harus menunggu giliran peralatan.",
      },
      {
        id: "price",
        question: "Apakah harga sudah termasuk peralatan prasmanan?",
        answer:
          "Ya. Seluruh paket sudah termasuk perlengkapan prasmanan seperti meja buffet, chafing dish, dan peralatan pendukung lainnya. Anda tidak perlu menyediakan peralatan tambahan—semuanya telah kami siapkan secara lengkap dan profesional.",
      },
    ],
    title: "Masih Memiliki Pertanyaan?",
    cta: "Konsultasi Sekarang",
  },
  bentoPage: {
    hero: {
      eyebrow: "Bento",
      title: "Praktis, Higienis dengan menu bervariasi",
      cta: "Unduh Menu",
    },
    about: {
      titleHighlight: "Nasi Kotak",
      titleBody: "Premium",
      paragraph1:
        "Nasi kotak Bento cocok untuk anda yang ingin menyajikan nasi kotak dengan pilihan menu masakan dan kemasan kotak premium untuk para tamu dan relasi spesial.",
      paragraph2:
        "Cocok dihidang untuk makan siang, pertemuan, rapat, acara gathering, fun day dan event lainnya.",
    },
    packages: {
      titleLead: "Paket",
      titleBrand: "Bento",
    },
    minimumOrder: "Minimal pemesanan 25 kotak (diambil di dapur kami).",
    minimumOrder2:
      "Pemesanan 50 kotak atau lebih mendapatkan layanan antar gratis.",
    gallerySection: {
      title: "Pilihan Bento Kami",
    },
    menuSection: {
      titleLead: "Pilihan",
      titleBrand: "Menu",
    },
  },
  bentoMenu: {
    popular: "Paling Populer",
    orderNow: "Pesan Sekarang",
  },
  bentoMenuServices: {
    mainTitle: "Lauk Utama",
    sideTitle: "Pendamping",
  },
  bentoCta: {
    title: "Bento Berkualitas, Temani Setiap Acara",
    description:
      "Hidangan praktis, higienis, dan penuh rasa untuk pengalaman yang tak terlupakan.",
    orderLink:
      "https://wa.me/6281371790122?text=Halo%2C%20saya%20ingin%20pesan%20Bento.",
    consultLink:
      "https://wa.me/6282288175957?text=Halo%2C%20saya%20ingin%20konsultasi%20Bento.",
  },
  snackBoxPage: {
    hero: {
      eyebrow: "Snack Kotak",
      title: "Lengkapi momen spesial dengan kelezatan",
      cta: "Unduh Menu",
    },
    about: {
      titleHighlight: "Lezat dalam",
      titleBody: "setiap kotak",
      paragraph1:
        "Lengkapi momen spesial anda dengan kelezatan yang tak terlupakan. Snack kotak KSM Katering dirancang khusus untuk memberikan cita rasa istimewa dalam setiap gigitan, menjadikan setiap acara lebih berkesan.",
      paragraph2:
        "Dengan pilihan menu yang variatif dan berkualitas, kami siap memanjakan lidah para tamu Anda. Sempurnakan kebersamaan dan buat setiap momen lebih berarti dengan sajian praktis yang penuh kenikmatan.",
    },
    packages: {
      titleLead: "Paket",
      titleBrand: "Snack Kotak",
    },
    minimumOrder:
      "Minimum order 50 kotak diantar, di bawah 50 kotak dijemput ke dapur kami.",
    gallerySection: {
      title: "Pilihan Bento Kami",
    },
    menuSection: {
      titleLead: "Pilihan",
      titleBrand: "Menu",
    },
  },
  snackBoxMenu: {
    popular: "Paling Populer",
    orderNow: "Pesan Sekarang",
  },
  snackBoxMenuServices: {
    mainTitle: "Pilihan Snack",
    sideTitle: "Pendamping",
  },
  snackBoxCta: {
    title: "Snack Kotak Praktis untuk Berbagai Acara",
    description:
      "lezat dan higienis yang siap melengkapi setiap acara Anda, dari rapat hingga kegiatan spesial.",
    orderLink:
      "https://wa.me/6281371790122?text=Halo%2C%20saya%20ingin%20pesan%20Snack%20Box.",
    consultLink:
      "https://wa.me/6282288175957?text=Halo%2C%20saya%20ingin%20konsultasi%20Snack%20Box.",
  },
  tumpengPage: {
    hero: {
      eyebrow: "Tumpeng",
      title: " Lebih dari sekadar nasi kuning, lebih dari sekadar perayaan",
      cta: "Unduh Menu",
    },
    about: {
      titleHighlight: "Tumpeng lezat,",
      titleBody: "Doa dan Harapan yang Hangat",
      paragraph1:
        "Lebih dari sekadar nasi kuning, tumpeng katering kami menghadirkan makna mendalam dalam setiap perayaan. Dengan susunan lauk yang menggugah selera dan cita rasa autentik, kami tidak hanya menyajikan hidangan, tetapi juga menyampaikan harapan dan doa untuk kebahagiaan serta kesuksesan.",
      paragraph2:
        "Setiap elemen dalam tumpeng kami dipilih dengan cermat untuk melengkapi makna simbolis yang terkandung di dalamnya. Jadikan momen spesial Anda lebih berkesan dengan tumpeng yang penuh arti dan kelezatan.",
    },
    packages: {
      titleLead: "Paket",
      titleBrand: "Tumpeng",
    },
    minimumOrder:
      "Minimum order 50 kotak diantar, di bawah 50 kotak dijemput ke dapur kami.",
    gallerySection: {
      title: "Pilihan Bento Kami",
    },
    menuSection: {
      titleLead: "Pilihan",
      titleBrand: "Menu",
    },
  },
  tumpengMenu: {
    popular: "Paling Populer",
    orderNow: "Pesan Sekarang",
  },
  tumpengCta: {
    title: "Tumpeng untuk Setiap Momen Bermakna",
    description:
      "Disajikan dengan penuh kehangatan dan cita rasa autentik untuk merayakan kebersamaan Anda.",
    orderLink:
      "https://wa.me/6281371790122?text=Halo%2C%20saya%20ingin%20pesan%20Tumpeng.",
    consultLink:
      "https://wa.me/6282288175957?text=Halo%2C%20saya%20ingin%20konsultasi%20Tumpeng.",
  },
  korporatPage: {
    hero: {
      eyebrow: "Katering Korporat",
      title: "Produktivitas Lebih Tinggi dengan Sajian Berkualitas",
      cta: "Unduh Menu",
    },
    about: {
      titleHighlight: "Solusi Katering Terbaik untuk Perusahaan Anda.",
      paragraph1:
        "Terlahir dari katering korporat di tahun 2007, KSM Katering menjadi katering terbesar di Batam dengan kapasitas hingga 10.000 porsi setiap hari melayani berbagai Perusahaan besar di Batam.",
      paragraph2:
        "Dengan standar mutu yang tinggi, menerapkan standar CPB (Cara Produksi yang Baik) dengan skala yang besar, menjadikan KSM Katering menjadi katering yang dipercaya!",
    },
    clientsSection: {
      title: "Dipercaya Oleh Klien Kami",
    },
    packages: {
      titleLead: "Paket",
      titleBrand: "Katering Korporat",
    },
    minimumOrder:
      "Minimum order 50 kotak diantar, di bawah 50 kotak dijemput ke dapur kami.",
    gallerySection: {
      title: "Pilihan Bento Kami",
    },
    menuSection: {
      titleLead: "Pilihan",
      titleBrand: "Menu",
    },
  },
  korporatMenu: {
    popular: "Paling Populer",
    orderNow: "Pesan Sekarang",
  },
  korporatCta: {
    title: "Solusi Katering Profesional untuk Kebutuhan Perusahaan Anda",
    description:
      "Dukung setiap kegiatan perusahaan dengan layanan katering berkualitas, menu beragam, dan pelayanan yang terpercaya.",
    orderLink:
      "https://wa.me/6281371790122?text=Halo%2C%20saya%20ingin%20pesan%Katering%20Korporat.",
    consultLink:
      "https://wa.me/6282288175957?text=Halo%2C%20saya%20ingin%20konsultasi%Katering%20Korporat.",
    consultEmail: "Untuk pemesanan melalui email, hubungi:",
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
  contactPage: {
    hero: {
      eyebrow: "Hubungi KSM Katering",
      title:
        "Kami siap membantu kebuKami siap membantu Anda. Untuk informasi lebih lanjut mengenai layanan dan penawaran terbaik dari kami, silakan hubungi tim kami. Kami berkomitmen memberikan pelayanan yang cepat, responsif, dan profesional untuk memenuhi kebutuhan Anda.tuhan katering Anda.",
    },
    team: {
      titleLead: "Tim Kami Siap",
      titleAccent: "Membantu Anda",
    },
    location: {
      titleLead: "Lokasi",
      titleAccent: "Kami",
      mapTitle: "Lokasi KSM Katering",
      hoursLabel: "Jam Operasional",
      hoursValue: "Senin - Minggu, 08.00 - 17.00",
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
