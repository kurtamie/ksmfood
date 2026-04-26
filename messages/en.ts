const serviceItems = {
  aqiqah: {
    label: "Aqiqah",
    description:
      "Practical aqiqah service with menu quality, cleanliness, and halal preparation that stay consistent.",
  },
  "nasi-kotak": {
    label: "Rice Box",
    description:
      "Rice box packages for meetings, office events, schools, and daily or special event catering needs.",
  },
  prasmanan: {
    label: "Buffet",
    description:
      "Complete buffet service for family events, gatherings, and large-scale catering needs.",
  },
  "prasmanan-pernikahan": {
    label: "Wedding Buffet",
    description:
      "Complete buffet spreads for weddings and special family celebrations.",
  },
  bento: {
    label: "Bento",
    description:
      "Neat and practical bento packages for offices, schools, and special occasions.",
  },
  "rendang-kemasan": {
    label: "Packaged Rendang",
    description:
      "Ready-to-eat rendang with authentic Minang flavor for gifts and convenient stock.",
  },
  "snack-kotak": {
    label: "Snack Box",
    description:
      "Snack box options for meetings, seminars, training sessions, and formal or casual events.",
  },
  tumpeng: {
    label: "Tumpeng",
    description:
      "Tumpeng for thanksgiving, birthdays, and ceremonial events with a polished presentation.",
  },
  "katering-korporat": {
    label: "Corporate Catering",
    description:
      "Corporate catering solutions for companies and institutions with professional service standards.",
  },
};

const messages = {
  common: {
    orderNow: "Order Now",
    contactUs: "Contact Us",
    downloadMenu: "Download Menu",
    consultNow: "Consult Now",
    orderNowShort: "Order Now",
    free: "Free",
  },
  languages: {
    trigger: "English",
    label: "Language",
    id: "Bahasa Indonesia",
    en: "English",
    min: "Minang (Padang)",
  },
  header: {
    home: "Home",
    services: "Services",
    gallery: "Gallery",
    about: "About Us",
    contact: "Contact",
    openMenu: "Open menu",
    closeMenu: "Close menu",
  },
  navigation: {
    gallery: {
      event: "Events",
      menu: "Menu",
      testimonial: "Testimonial",
      video: "Video",
    },
    about: {
      ksm: "About KSM",
      contact: "Contact",
    },
  },
  footer: {
    company: "PT Katering Sukses Mandiri",
    servicesTitle: "Services",
    galleryTitle: "Gallery",
    aboutTitle: "About KSM",
    locationTitle: "Our Location",
    openMaps: "Open in Google Maps",
    copyright: "Copyright © 2026 KSM Katering. All rights reserved.",
    serviceLinks: [
      "Wedding Buffet",
      "Buffet",
      "Rice Box",
      "Bento",
      "Packaged Rendang",
      "Snack Box",
      "Snack Tray",
      "Tumpeng",
    ],
    aboutLinks: ["About KSM", "Contact Us"],
  },
  services: {
    items: serviceItems,
  },
  home: {
    hero: {
      title: "Catering Services For",
      words: ["Weddings", "Aqiqah", "Companies", "Meetings"],
      tagline: "When it comes to catering, choose KSM Katering",
      primaryCta: "View Packages",
      secondaryCta: "Contact Us",
    },
    about: {
      titleLead: "About",
      titleBrand: "KSM Katering",
      paragraph1:
        "KSM Catering is a halal catering service provider in Batam since 2007, with experience serving various clients and high-scale events with a capacity of up to 8000 portions/day.",
      paragraph2:
        "We continuously improve our services to always present classy dishes, special taste, elegant appearance and maintained hygienic standards to perfect every moment of your event.",
      paragraph3:
        "With over 19 years of experience, we have served various catering needs ranging from Weddings, Government & Ministry Events, Banks, Hospitals, and large companies in Batam.",
      cta: "See More",
    },
    servicesSection: {
      titleLead: "KSM",
      titleBrand: "Services",
    },
    whyChooseSection: {
      titleLead: "Why Choose",
      titleBrand: "KSM?",
    },
    clientsSection: {
      title: "Trusted By Our Clients",
    },
    testimonialsSection: {
      title: "Hear It From Our Customers",
      cta: "See Another Real Testimonials",
    },
    faqSection: {
      title: "Frequently Asked Questions",
    },
    legalSection: {
      title: "Verified Legal Documents",
    },
    contactSection: {
      title: "Ready to Cater Your Event",
      description:
        "Discuss your event needs with us and get a catering solution that fits.",
      primaryCta: "Start Ordering",
      secondaryCta: "Consult Now",
    },
  },
  homeMenu: {
    viewPackage: "View Package",
    downloadMenu: "Download Menu",
    cards: [
      {
        id: 1,
        title: "Wedding Buffet",
        price: "Starting from Rp 32.000/portion",
      },
      { id: 2, title: "Buffet", price: "Starting from Rp 32.000/portion" },
      { id: 3, title: "Rice Box", price: "Starting from Rp 25.000/box" },
      { id: 4, title: "Bento", price: "Starting from Rp 56.000/box" },
      {
        id: 5,
        title: "Packaged Rendang",
        price: "Starting from Rp 80.000/package",
      },
      { id: 6, title: "Snack Box", price: "Starting from Rp 13.000" },
      { id: 7, title: "Aqiqah", price: "Flexible pricing" },
      { id: 8, title: "Tumpeng", price: "Starting from Rp 700.000" },
      { id: 9, title: "Corporate Catering", price: "Flexible pricing" },
    ],
  },
  whyChoose: {
    reasons: [
      {
        id: 1,
        title: "Airline Catering",
        description:
          "KSM is the only Batam caterer trusted to handle Garuda Indonesia airline catering needs.",
      },
      {
        id: 2,
        title: "Experienced",
        description:
          "KSM has 19 years of experience serving many event types and industrial company canteen operations in Batam.",
      },
      {
        id: 3,
        title: "Menu Variety",
        description:
          "We provide a wide selection of Indonesian dishes that can be matched to your taste.",
      },
      {
        id: 4,
        title: "Signature Taste",
        description:
          "We bring Indonesian flavors with carefully blended spice recipes.",
      },
      {
        id: 5,
        title: "Skilled Team",
        description:
          "Supported by a team accustomed to handling events of many scales with professional service.",
      },
    ],
  },
  faq: {
    items: [
      {
        id: "type",
        question: "Does KSM Katering serve different kinds of events?",
        answer:
          "Yes, we serve many event types such as weddings, aqiqah, office events, and more.",
      },
      {
        id: "minimal",
        question: "What is the minimum catering order?",
        answer:
          "The minimum order is 50 portions. For buffets, the minimum is 100 portions; for food stalls at wedding buffets, the minimum is 150 portions; and for bento, the minimum is 25 boxes.",
      },
      {
        id: "support",
        question: "Can the menu be customized to the event's needs?",
        answer:
          "You can choose a menu according to the options available on our website. If you have special requirements, please click the “Consult Now” button and fill out the provided form. Our team will contact you shortly.",
      },
      {
        id: "price",
        question: "Does the price include equipment and service?",
        answer:
          "For buffet services, the price includes buffet equipment, cutlery, and waiter service.",
      },
      {
        id: "order",
        question: "How do I place an order?",
        answer:
          "You can place an order by contacting our team via the “Order Now” button.",
      },
    ],
    title: "Still Have Questions?",
    cta: "Consult Now",
  },
  legal: {
    primary: [
      "MUI Halal Certificate",
      "Hygiene and Sanitation Feasibility Certificate",
    ],
    secondary: ["Nutritionist Certificate", "Business License", "Tax ID"],
  },
  testimonials: {
    sliderLabel: "Testimonial slider",
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
    cta: "See Another Real Testimonial",
  },
  portfolio: {
    title: "Moments With KSM Katering",
    cta: "View Full Gallery",
    slide: "Slide {number}",
  },
  sectionRoutes: {
    ricebox: [
      { href: "#tentang", label: "About" },
      { href: "#layanan", label: "Packages" },
      { href: "#minimum-order", label: "Minimum Order" },
      { href: "#pilihan-menu", label: "Menu Choices" },
      { href: "#hubungi-kami", label: "Contact" },
    ],
    prasmanan: [
      { href: "#tentang", label: "About" },
      { href: "#layanan", label: "Packages" },
      { href: "#informasi-pemesanan", label: "Ordering Info" },
      { href: "#pilihan-menu", label: "Menu Choices" },
      { href: "#hubungi-kami", label: "Contact" },
    ],
    wedding: [
      { href: "#tentang", label: "About" },
      { href: "#layanan", label: "Packages" },
      { href: "#informasi-pemesanan", label: "Ordering Info" },
      { href: "#pilihan-menu", label: "Menu Choices" },
      { href: "#stand", label: "Food Stalls" },
      { href: "#faq", label: "Faq" },
      { href: "#hubungi-kami", label: "Contact" },
    ],
    aqiqah: [
      { href: "#tentang", label: "About" },
      { href: "#menu", label: "Packages" },
      { href: "#bonus", label: "Bonus" },
      { href: "#hubungi-kami", label: "Contact" },
    ],
    snackBox: [
      { href: "#tentang", label: "About" },
      { href: "#layanan", label: "Packages" },
      { href: "#pilihan-menu", label: "Menu Choices" },
      { href: "#hubungi-kami", label: "Contact" },
    ],
    bento: [
      { href: "#tentang", label: "About" },
      { href: "#layanan", label: "Packages" },
      { href: "#informasi-pemesanan", label: "Ordering Info" },
      { href: "#pilihan-menu", label: "Menu Choices" },
      { href: "#galeri", label: "Gallery" },
      { href: "#hubungi-kami", label: "Contact" },
    ],
    tumpeng: [
      { href: "#tentang", label: "About" },
      { href: "#layanan", label: "Packages" },
      { href: "#hubungi-kami", label: "Contact" },
    ],
    korporat: [
      { href: "#tentang", label: "About" },
      { href: "#layanan", label: "Packages" },
      { href: "testimonial", label: "Testimonials" },
      { href: "#hubungi-kami", label: "Contact" },
    ],
  },
  riceboxPage: {
    hero: {
      eyebrow: "Rice Box",
      title: "Practical and hygienic with varied menu options",
      cta: "Download Menu",
    },
    about: {
      titleHighlight: "Most popular",
      titleBody: "with flavors that are",
      titleAccent: "hard to forget",
      paragraph1:
        "KSM Katering is known for delicious food quality and taste because we use fresh, high-quality ingredients to serve flavorful and nutritious dishes.",
      paragraph2:
        "KSM Katering rice boxes are a popular and practical option for meals at many events and activities.",
    },
    packages: {
      titleLead: "Rice Box",
      titleBrand: "Packages",
    },
    minimumOrder:
      "Minimum delivery order is 50 boxes. Orders below 50 boxes can be picked up from our kitchen.",
    menuSection: {
      titleLead: "Menu",
      titleBrand: "Choices",
    },
  },
  riceboxMenu: {
    popular: "Most Popular",
    orderNow: "Order Now",
  },
  riceboxMenuServices: {
    mainTitle: "Main Dishes",
    sideTitle: "Sides",
  },
  riceboxCta: {
    title: "Ready to order rice boxes for your event?",
    description: "Practical, tasty, and dependable for every moment.",
    orderLink:
      "https://wa.me/628111171713?text=Hello%2C%20I%20want%20to%20order%20rice%20boxes.",
    consultLink:
      "https://wa.me/628111171713?text=Hello%2C%20I%20want%20to%20consult%20about%20rice%20boxes.",
  },
  aqiqahPage: {
    hero: {
      eyebrow: "Aqiqah",
      title: "Sharia-compliant and practical with KSM Katering",
      cta: "Download Menu",
    },
    about: {
      titleLead: "Practical",
      titleAccent: "& Sharia-compliant",
      paragraph1:
        "KSM Katering helps families organize aqiqah events more easily.",
      paragraph2:
        "We provide a range of delicious meat-based menus such as satay, gulai, and other dishes.",
      paragraph3:
        "You also get a free aqiqah invitation video and aqiqah certificate.",
    },
    bonus: {
      badge: "Exclusive Bonus",
      titleLead: "Invitation Video",
      titleBrand: "& Aqiqah Certificate",
    },
  },
  aqiqahMenu: {
    package: "Package",
    femaleTitle: "Female Goat",
    maleTitle: "Male Goat",
    popular: "Most Popular",
    orderNow: "Order Now",
  },
  aqiqahBonus: {
    invitationTitle: "Aqiqah Invitation Video",
    certificateTitle: "Aqiqah Certificate",
  },
  aqiqahCta: {
    title: "Ready to order an aqiqah package for your family?",
    description:
      "Practical, sharia-compliant, and delicious for a grateful moment.",
    orderLink:
      "https://wa.me/628111171713?text=Hello%2C%20I%20want%20to%20order%20an%20aqiqah%20package.",
    consultLink:
      "https://wa.me/628111171713?text=Hello%2C%20I%20want%20to%20consult%20about%20an%20aqiqah%20package.",
  },
  prasmananPage: {
    hero: {
      eyebrow: "Prasmanan",
      title: "Memorable flavors, impressive dining experience",
      cta: "Download Menu",
    },
    about: {
      titleLead: "Practical, Clean",
      titleAccent: "and High Quality",
      paragraph1:
        "Buffet catering is a practical and popular way to serve delicious and varied dishes across special events, from business gatherings to private celebrations.",
      paragraph2:
        "KSM Katering buffet service is a smart choice for hosts who want to spoil their guests with a wide selection of Indonesian dishes. We also provide serving staff for your event.",
    },
    packages: {
      titleLead: "Prasmanan",
      titleBrand: "Packages",
    },
    orderingInfo: {
      titleLead: "Ordering",
      titleAccent: "Information",
      deliveryTitle: "Free Delivery",
      deliveryDescription: "Available",
      equipmentTitle: "Buffet Equipment Available",
      equipmentDescription: "Including table setup assistance.",
      serviceTitle: "Serving Staff",
      serviceDescription: "Minimum order 100 portions",
      minimumTitle: "Minimum Order",
      minimumDescription: "50 Portions",
    },
    menuSection: {
      titleLead: "Menu",
      titleBrand: "Choices",
    },
  },
  prasmananMenu: {
    popular: "Most Popular",
  },
  prasmananMenuServices: {
    mainTitle: "Main Dishes",
    sideTitle: "Side Dishes",
  },
  prasmananCta: {
    title: "Practical Buffet, Memorable Moments",
    description:
      "More than quality dishes, it is also a dining memory worth sharing and remembering.",
    orderLink:
      "https://wa.me/628111171713?text=Hello%2C%20I%20want%20to%20order%20buffet%20catering.",
    consultLink:
      "https://wa.me/628111171713?text=Hello%2C%20I%20want%20to%20consult%20about%20buffet%20catering.",
  },
  weddingPage: {
    hero: {
      eyebrow: "Wedding Catering",
      title: "Harmony in service and exceptional dishes",
      cta: "Download Wedding Buffet Menu",
      cta2: "Download Food Stall Menu",
    },
    about: {
      titleLead: "The Best Service, ",
      titleAccent: "from the Best",
      paragraph1:
        "Enjoy full-service catering from KSM Katering for your wedding. We provide buffet service with a variety of delicious menu options, supported by a service team ready to attend to your guests promptly.",
    },
    packages: {
      titleLead: "Wedding Buffet",
      titleBrand: "Packages",
    },
    orderingInfo: {
      titleLead: "Ordering",
      titleAccent: "Information",
      deliveryTitle: "Free Delivery",
      deliveryDescription: "Available",
      equipmentTitle: "Buffet Equipment Available",
      equipmentDescription: "For stall service and cleanliness.",
      serviceTitle: "Serving Staff",
      serviceDescription: "Minimum order 100 portions",
      toolsTitle: "Tableware",
      toolsDescription: "Provided complete and clean",
      minimumTitle: "Minimum Order",
      minimumDescription: "150 Portions",
    },
    menuSection: {
      titleLead: "Menu",
      titleBrand: "Choices",
    },
  },
  weddingMenu: {
    popular: "Most Popular",
  },
  weddingMenuServices: {
    mainTitle: "Main Dishes",
    sideTitle: "Sides",
  },
  weddingStand: {
    mainTitle: "Food Stall Catering",
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
    title: "The Best Dishes for Your Special Day",
    description:
      "Enjoy complete buffet service with special flavors and a professional team ready to handle every detail of your event.",
    orderLink:
      "https://wa.me/628111171713?text=Hello%2C%20I%20want%20to%20order%20wedding%20buffet%20catering.",
    consultLink:
      "https://wa.me/628111171713?text=Hello%2C%20I%20want%20to%20consult%20about%20wedding%20buffet%20catering.",
  },
  weddingFaq: {
    items: [
      {
        id: "service",
        question: "Does KSM provide full-service weddings?",
        answer:
          "Yes. KSM offers full-service weddings with a team size tailored to the scale of the event. For events with large guest numbers, we deploy a complete and structured team to ensure optimal operation. Each team consists of stall staff, food handlers, food distribution runners, fruit handlers, and a cleaning team who work in a coordinated manner. With this system, the entire catering process is well-managed, so you can enjoy your wedding without having to worry about the details on the ground.",
      },
      {
        id: "family",
        question:
          "Does the family need to be involved in managing the catering during the event?",
        answer:
          "No. The entire catering process—from serving and refilling food to cleaning the area—is handled entirely by the KSM team. You and your family can focus on enjoying the moment without distractions.",
      },
      {
        id: "empty",
        question: "What if the food runs out during the event?",
        answer:
          "You don't have to worry about running out of dishes at a crucial moment. KSM keeps a dedicated kitchen team and ingredients on standby throughout the event as a precaution. If there's a surge in guests or additional needs, dishes can be processed and delivered to the event location quickly. This system ensures the event runs smoothly, allowing you to enjoy your event with peace of mind.",
      },
      {
        id: "wash",
        question: "Does KSM wash tableware on-site?",
        answer:
          "No. To maintain efficiency and cleanliness of the event area, all tableware is not washed on-site. We prepare the number of utensils according to the total number of guests, ensuring smooth service without disrupting the event.",
      },
      {
        id: "total",
        question: "Is there enough tableware for all guests?",
        answer:
          "Yes. KSM provides plates, spoons, and forks according to the number of guests ordered. This ensures each guest has a comfortable dining experience without having to wait for their turn.",
      },
      {
        id: "price",
        question: "Does the price include buffet equipment?",
        answer:
          "Yes. The entire package includes buffet equipment such as buffet tables, chafing dishes, and other supporting equipment. You don't need to provide additional equipment—we have everything completely and professionally prepared.",
      },
    ],
    title: "Still Have Questions?",
    cta: "Consult Now",
  },
  bentoPage: {
    hero: {
      eyebrow: "Bento",
      title: "Practical and hygienic with varied menu options",
      cta: "Download Menu",
    },
    about: {
      titleHighlight: "Premium",
      titleBody: "Premium",
      paragraph1:
        "Bento rice boxes are ideal when you want to serve rice boxes with varied dish choices and premium packaging for special guests and relations.",
      paragraph2:
        "Suitable for lunch, meetings, gatherings, fun days, and other events.",
    },
    packages: {
      titleLead: "Bento",
      titleBrand: "Packages",
    },
    minimumOrder:
      "Minimum order is 25 boxes for pickup from our kitchen. Orders of 50 boxes or more include free delivery.",
    gallerySection: {
      title: "Our Bento Selection",
    },
    menuSection: {
      titleLead: "Menu",
      titleBrand: "Choices",
    },
  },
  bentoMenu: {
    popular: "Most Popular",
    orderNow: "Order Now",
  },
  bentoMenuServices: {
    mainTitle: "Main Dishes",
    sideTitle: "Sides",
  },
  bentoCta: {
    title: "Quality Bento for Every Event",
    description:
      "Practical, hygienic, and flavorful meals for a memorable experience.",
    orderLink:
      "https://wa.me/628111171713?text=Hello%2C%20I%20want%20to%20order%20Bento.",
    consultLink:
      "https://wa.me/628111171713?text=Hello%2C%20I%20want%20to%20consult%20about%20Bento.",
  },
  snackBoxPage: {
    hero: {
      eyebrow: "Snack Box",
      title: "Complete special moments with delicious treats",
      cta: "Download Menu",
    },
    about: {
      titleHighlight: "Delicious in",
      titleBody: "every box",
      paragraph1:
        "Complete your special moments with unforgettable treats. KSM Katering snack boxes are specially prepared to deliver a special taste in every bite, making every event more memorable.",
      paragraph2:
        "With varied and high-quality menu choices, we are ready to delight your guests. Make every gathering more meaningful with practical servings full of enjoyment.",
    },
    packages: {
      titleLead: "Snack Box",
      titleBrand: "Packages",
    },
    minimumOrder:
      "Minimum delivery order is 50 boxes. Orders below 50 boxes can be picked up from our kitchen.",
    gallerySection: {
      title: "Our Snack Box Selection",
    },
    menuSection: {
      titleLead: "Menu",
      titleBrand: "Choices",
    },
  },
  snackBoxMenu: {
    popular: "Most Popular",
    orderNow: "Order Now",
  },
  snackBoxMenuServices: {
    mainTitle: "Snack Choices",
    sideTitle: "Sides",
  },
  snackBoxCta: {
    title: "Practical Snack Boxes for Every Event",
    description:
      "Delicious and hygienic options ready to complete every event, from meetings to special activities.",
    orderLink:
      "https://wa.me/628111171713?text=Hello%2C%20I%20want%20to%20order%20Snack%20Box.",
    consultLink:
      "https://wa.me/628111171713?text=Hello%2C%20I%20want%20to%20consult%20about%20Snack%20Box.",
  },
  tumpengPage: {
    hero: {
      eyebrow: "Tumpeng",
      title: "More than yellow rice, more than a celebration",
      cta: "Download Menu",
    },
    about: {
      titleHighlight: "Delicious tumpeng,",
      titleBody: "warm prayers and hopes",
      paragraph1:
        "More than just yellow rice, our tumpeng catering brings deeper meaning to every celebration. With appetizing side dishes and authentic flavors, we do not only serve food, but also share hopes and prayers for happiness and success.",
      paragraph2:
        "Every element in our tumpeng is carefully selected to complete its symbolic meaning. Make your special moment more memorable with tumpeng full of meaning and flavor.",
    },
    packages: {
      titleLead: "Tumpeng",
      titleBrand: "Packages",
    },
    minimumOrder:
      "Minimum delivery order is 50 boxes. Orders below 50 boxes can be picked up from our kitchen.",
    gallerySection: {
      title: "Our Tumpeng Selection",
    },
    menuSection: {
      titleLead: "Menu",
      titleBrand: "Choices",
    },
  },
  tumpengMenu: {
    popular: "Most Popular",
    orderNow: "Order Now",
  },
  tumpengCta: {
    title: "Tumpeng for Every Meaningful Moment",
    description:
      "Served with warmth and authentic flavor to celebrate your togetherness.",
    orderLink:
      "https://wa.me/628111171713?text=Hello%2C%20I%20want%20to%20order%20Tumpeng.",
    consultLink:
      "https://wa.me/628111171713?text=Hello%2C%20I%20want%20to%20consult%20about%20Tumpeng.",
  },
  korporatPage: {
    hero: {
      eyebrow: "Corporate Catering",
      title: "Higher productivity with quality meals",
      cta: "Download Menu",
    },
    about: {
      titleHighlight: "The best catering solution for your company",
      paragraph1:
        "KSM Katering is here to meet corporate catering needs with healthy, delicious, and hygienic menus.",
      paragraph2:
        "We provide various menu choices that can be adjusted to your company's tastes and needs. From employee lunches and meetings to corporate events, we are ready to be your trusted culinary partner.",
    },
    packages: {
      titleLead: "Corporate Catering",
      titleBrand: "Packages",
    },
    minimumOrder:
      "Minimum delivery order is 50 boxes. Orders below 50 boxes can be picked up from our kitchen.",
    gallerySection: {
      title: "Our Corporate Catering Selection",
    },
    menuSection: {
      titleLead: "Menu",
      titleBrand: "Choices",
    },
  },
  korporatMenu: {
    popular: "Most Popular",
    orderNow: "Order Now",
  },
  korporatCta: {
    title: "Professional Catering Solutions for Your Company",
    description:
      "Support every company activity with quality catering service, varied menus, and dependable service.",
    orderLink:
      "https://wa.me/628111171713?text=Hello%2C%20I%20want%20to%20order%20Corporate%20Catering.",
    consultLink:
      "https://wa.me/628111171713?text=Hello%2C%20I%20want%20to%20consult%20about%20Corporate%20Catering.",
  },
  serviceDetail: {
    eyebrow: "KSM Katering Services",
    primaryCta: "Contact Us",
    secondaryCta: "Back to Services",
    items: serviceItems,
  },
  sectionPage: {
    primaryCta: "Contact Us",
    secondaryCta: "Back to Home",
  },
  galleryPages: {
    event: {
      eyebrow: "Event Gallery",
      title: "Event documentation with KSM Katering",
      description:
        "This page is prepared to display KSM Katering service moments across different events. Full content can be added in the `/gallery/event` route file.",
    },
    menu: {
      eyebrow: "Menu Gallery",
      title: "Featured KSM Katering menu selections",
      description:
        "This page is prepared to display KSM Katering featured menu collections. Full content can be expanded in the `/gallery/menu` route file.",
    },
    video: {
      eyebrow: "Video Gallery",
      title: "Videos of KSM Katering services and moments",
      description:
        "This page is prepared to display promotional videos, event documentation, and visual content for KSM Katering.",
    },
  },
  aboutPages: {
    contact: {
      eyebrow: "KSM Contact",
      title: "Reach the KSM Katering team",
      description:
        "This page is prepared to help prospective customers contact the KSM Katering team for consultation and ordering.",
    },
  },
  aboutKsmPage: {
    hero: {
      eyebrow: "About KSM Katering",
      title:
        "Established in 2007, KSM Katering is a halal catering company committed to delivering excellent service and food quality. With a high-standard hygienic kitchen and production capacity of up to 8,000 portions per day, supported by modern equipment, we are also trusted to serve Garuda Indonesia airline catering in Batam.",
    },
    vision: {
      titleLead: "Vision & Mission",
      visionTitle: "Vision",
      visionDescription:
        "To become a quality catering company for events, industry, private institutions, and government institutions throughout Indonesia.",
      missionTitle: "Mission",
      missionDescription:
        "To implement Good Production Practices (GPP) in achieving customer satisfaction.",
    },
    strategy: {
      titleLead: "Strategy",
      subtitle: "Improving customer satisfaction through:",
      items: [
        "Building and improving systems to ensure product and service quality stays aligned with established standards.",
        "Improving service by maintaining the quality of the products and services provided.",
        "Developing human resources.",
        "Creating a conducive, harmonious, and humane work environment.",
      ],
    },
    contactSection: {
      title: "Ready to Cater Your Event",
      description:
        "Discuss your event needs with us and get a catering solution that fits.",
      primaryCta: "Start Ordering",
      secondaryCta: "Consult Now",
    },
  },
  contactPage: {
    hero: {
      eyebrow: "Contact KSM Katering",
      title:
        "We are ready to help you. For more information about our services and best offers, please contact our team. We are committed to providing fast, responsive, and professional service for your catering needs.",
    },
    vision: {
      titleLead: "Vision & Mission",
      visionTitle: "Vision",
      visionDescription:
        "To become a quality catering company for events, industry, private institutions, and government institutions throughout Indonesia.",
      missionTitle: "Mission",
      missionDescription:
        "To implement Good Production Practices (GPP) in achieving customer satisfaction.",
    },
    strategy: {
      titleLead: "Strategy",
      subtitle: "Improving customer satisfaction through:",
      items: [
        "Building and improving systems to ensure product and service quality stays aligned with established standards.",
        "Improving service by maintaining the quality of the products and services provided.",
        "Developing human resources.",
        "Creating a conducive, harmonious, and humane work environment.",
      ],
    },
    contactSection: {
      title: "Ready to Cater Your Event",
      description:
        "Discuss your event needs with us and get a catering solution that fits.",
      primaryCta: "Start Ordering",
      secondaryCta: "Consult Now",
    },
  },
} as const;

export default messages;
