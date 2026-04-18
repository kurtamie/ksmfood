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
        "KSM Katering has served since 2007 as a halal catering provider that delivers tasty, healthy, and hygienic meals. We support companies, hospitals, schools, government institutions, ministries, banks, and airlines in Batam.",
      paragraph2:
        "We also serve many kinds of events such as weddings, meetings, hajj support, and other occasions.",
      paragraph3:
        "With more than 17 years of experience, KSM Katering is ready to be the right catering solution for your events.",
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
        price: "Starting from Rp:32.000/portion",
      },
      { id: 2, title: "Buffet", price: "Starting from Rp:32.000/portion" },
      { id: 3, title: "Rice Box", price: "Starting from Rp:25.000/box" },
      { id: 4, title: "Bento", price: "Starting from Rp:56.000/box" },
      {
        id: 5,
        title: "Packaged Rendang",
        price: "Starting from Rp:80.000/package",
      },
      { id: 6, title: "Snack Box", price: "Starting from Rp:13.000" },
      { id: 7, title: "Aqiqah", price: "Flexible pricing" },
      { id: 8, title: "Coffee Break", price: "Starting from Rp:700.000" },
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
          "KSM has 17 years of experience serving many event types and industrial company canteen operations in Batam.",
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
          "Our minimum catering order is 20 portions for each event type.",
      },
      {
        id: "support",
        question: "How can I reach customer service?",
        answer:
          "You can contact us by email, live chat, or phone. We respond within 24 hours on working days.",
      },
      {
        id: "price",
        question: "Do prices include equipment and service?",
        answer: "Yes, our quoted prices already include equipment and service.",
      },
      {
        id: "order",
        question: "How do I place an order?",
        answer:
          "You can place an order by email, live chat, or phone. We respond within 24 hours on working days.",
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
        name: "Rina Maharani",
        text: "Our family event order arrived on time, looked neat, and tasted consistently good from start to finish.",
      },
      {
        id: 2,
        name: "Fajar Nugroho",
        text: "The KSM team was easy to coordinate with. The buffet menu was complete and many office guests asked for the recommendation.",
      },
      {
        id: 3,
        name: "Dewi Lestari",
        text: "I liked the portion size, the seasoning, and the presentation. It made our engagement event feel more refined.",
      },
      {
        id: 4,
        name: "Aldo Pratama",
        text: "Both the snack box and lunch were satisfying. Clean packaging and every order arrived as requested.",
      },
      {
        id: 5,
        name: "Nadia Permata",
        text: "The menu choices were flexible and worked well for guests of different ages. That really helped for a big family event.",
      },
      {
        id: 6,
        name: "Rizky Ananda",
        text: "Service was fast when we needed portion changes. The admin response was clear and efficient.",
      },
    ],
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
    aqiqah: [
      { href: "#tentang", label: "About" },
      { href: "#menu", label: "Packages" },
      { href: "#bonus", label: "Bonus" },
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
    ksm: {
      eyebrow: "About KSM",
      title: "A brief profile of KSM Katering",
      description:
        "This page is prepared to present the company profile, history, and core values of KSM Katering in more detail.",
    },
    contact: {
      eyebrow: "KSM Contact",
      title: "Reach the KSM Katering team",
      description:
        "This page is prepared to help prospective customers contact the KSM Katering team for consultation and ordering.",
    },
  },
} as const;

export default messages;
