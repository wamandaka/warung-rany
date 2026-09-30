import {
  Category,
  Product,
  Promo,
  Testimonial,
  BusinessSettings,
  OpeningHoursData,
} from "@/types";

export const initialCategories: Category[] = [
  {
    id: "cat-makanan",
    name: "Makanan",
    slug: "makanan",
    sortOrder: 1,
    isActive: true,
  },
  {
    id: "cat-lauk",
    name: "Lauk",
    slug: "lauk",
    sortOrder: 2,
    isActive: true,
  },
  {
    id: "cat-snack",
    name: "Snack",
    slug: "snack",
    sortOrder: 3,
    isActive: true,
  },
  {
    id: "cat-minuman",
    name: "Minuman",
    slug: "minuman",
    sortOrder: 4,
    isActive: true,
  },
];

export const initialProducts: Product[] = [
  {
    id: "prod-ayam-geprek",
    name: "Ayam Geprek",
    slug: "ayam-geprek",
    description:
      "Ayam krispi renyah dengan ulekan sambal bawang pedas nampol. Dilengkapi lalapan segar.",
    price: 18000,
    categoryId: "cat-makanan",
    imageUrl:
      "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=800&q=80",
    stock: 15,
    isAvailable: true,
    isTodayMenu: true,
    isFeatured: true,
    sortOrder: 1,
  },
  {
    id: "prod-nasi-uduk",
    name: "Nasi Uduk Komplit",
    slug: "nasi-uduk-komplit",
    description:
      "Nasi uduk wangi santan rempah, disajikan dengan bihun goreng, tempe orek manis, telur dadar iris, dan kerupuk.",
    price: 15000,
    categoryId: "cat-makanan",
    imageUrl:
      "https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&w=800&q=80",
    stock: 20,
    isAvailable: true,
    isTodayMenu: true,
    isFeatured: true,
    sortOrder: 2,
  },
  {
    id: "prod-ayam-bakar",
    name: "Ayam Bakar Madu",
    slug: "ayam-bakar-madu",
    description:
      "Ayam bakar bumbu kecap madu meresap gurih manis dengan aroma panggangan tradisional khas rumahan.",
    price: 20000,
    categoryId: "cat-makanan",
    imageUrl:
      "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=800&q=80",
    stock: 10,
    isAvailable: true,
    isTodayMenu: true,
    isFeatured: true,
    sortOrder: 3,
  },
  {
    id: "prod-tumis-kangkung",
    name: "Tumis Kangkung Terasi",
    slug: "tumis-kangkung-terasi",
    description:
      "Kangkung segar dimasak cepat dengan bumbu terasi wangi, irisan cabai rawit, dan tomat segar.",
    price: 10000,
    categoryId: "cat-lauk",
    imageUrl:
      "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80",
    stock: null, // Unlimited
    isAvailable: true,
    isTodayMenu: false,
    isFeatured: false,
    sortOrder: 4,
  },
  {
    id: "prod-risol-mayo",
    name: "Risol Mayo Keju (Isi 3)",
    slug: "risol-mayo-keju",
    description:
      "Kulit risol lembut berbalut tepung roti renyah, berisi smoked beef, telur rebus, keju cheddar, dan mayones melimpah.",
    price: 12000,
    categoryId: "cat-snack",
    imageUrl:
      "https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?auto=format&fit=crop&w=800&q=80",
    stock: 25,
    isAvailable: true,
    isTodayMenu: true,
    isFeatured: true,
    sortOrder: 5,
  },
  {
    id: "prod-es-teh",
    name: "Es Teh Manis Melati",
    slug: "es-teh-manis-melati",
    description:
      "Seduhan daun teh melati asli racikan khas rumahan, dingin segar dan manis pas.",
    price: 4000,
    categoryId: "cat-minuman",
    imageUrl:
      "https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=800&q=80",
    stock: null, // Unlimited
    isAvailable: true,
    isTodayMenu: false,
    isFeatured: true,
    sortOrder: 6,
  },
  {
    id: "prod-es-jeruk",
    name: "Es Jeruk Peras Murni",
    slug: "es-jeruk-peras-murni",
    description:
      "Jeruk peras segar alami kaya vitamin C, asam manis segar menyegarkan tenggorokan.",
    price: 6000,
    categoryId: "cat-minuman",
    imageUrl:
      "https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=800&q=80",
    stock: null, // Unlimited
    isAvailable: true,
    isTodayMenu: false,
    isFeatured: true,
    sortOrder: 7,
  },
];

export const initialSettings: BusinessSettings = {
  businessName: "Warung Rany",
  logoUrl: "",
  tagline: "Masakan Rumahan, Rasa yang Bikin Pulang",
  description:
    "Menyajikan hidangan rumahan segar setiap hari dengan bahan-bahan pilihan berkualitas, tanpa pengawet. Bersih, higienis, dan penuh kehangatan rasa keluarga.",
  address: "Jl. Tebet Raya No. 45, Jakarta Selatan (Patokan dekat Kantor Pos)",
  whatsappNumber: "081298765432",
  instagramUrl: "https://instagram.com",
  googleMapsUrl: "https://maps.google.com",
  tiktokUrl: "https://tiktok.com",
  heroTitle: "Masakan Rumahan, Rasa yang Bikin Pulang.",
  heroSubtitle:
    "Fresh dibuat setiap hari dengan rasa yang familiar dan nyaman. Pesan praktis langsung lewat WhatsApp.",
  heroImageUrl:
    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1200&q=80",
  ctaText: "Lihat Menu Hari Ini",
  defaultGreeting: "Halo Kak, saya mau pesan:",
  defaultOrderNote: "Mohon konfirmasi ketersediaannya ya. Terima kasih 🙏",
  aboutTitle: "Menghadirkan Kehangatan Masakan Rumah di Setiap Suapan",
  aboutStory:
    "Warung Rany berawal dari kecintaan memasak hidangan khas nusantara yang sering dinikmati bersama keluarga tercinta. Kami percaya bahwa masakan yang lezat bermula dari bahan yang segar, diolah dengan cinta, dan bumbu rempah pilihan yang melimpah.",
  aboutStory2:
    "Setiap menu kami masak di pagi hari untuk memastikan kesegaran saat sampai di meja makan Anda. Tanpa pengawet dan selalu mengutamakan kebersihan serta kehalalan produk.",
  aboutImageUrl:
    "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80",
  aboutBadgeTitle: "Resep Asli Keluarga",
  aboutBadgeSubtitle: "Bumbu rempah alami tanpa pengawet",
};

export const initialOpeningHours: OpeningHoursData = {
  monday: { dayName: "Senin", isOpen: true, openTime: "08:00", closeTime: "17:00" },
  tuesday: { dayName: "Selasa", isOpen: true, openTime: "08:00", closeTime: "17:00" },
  wednesday: { dayName: "Rabu", isOpen: true, openTime: "08:00", closeTime: "17:00" },
  thursday: { dayName: "Kamis", isOpen: true, openTime: "08:00", closeTime: "17:00" },
  friday: { dayName: "Jumat", isOpen: true, openTime: "08:00", closeTime: "17:00" },
  saturday: { dayName: "Sabtu", isOpen: true, openTime: "08:00", closeTime: "15:00" },
  sunday: { dayName: "Minggu", isOpen: false, openTime: "08:00", closeTime: "15:00" },
};

export const initialPromos: Promo[] = [
  {
    id: "promo-maksi",
    title: "Paket Hemat Makan Siang",
    description:
      "Dapatkan gratis Es Teh Manis setiap pemesanan minimal 2 porsi makanan berat!",
    imageUrl:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80",
    isActive: true,
    startDate: null,
    endDate: null,
  },
];

export const initialTestimonials: Testimonial[] = [
  {
    id: "testi-1",
    name: "Ibu Rahmawati",
    message:
      "Ayam geprek dan sambal bawangnya juara banget! Bumbunya pas, ayamnya renyah tapi juicy di dalam. Jadi langganan makan siang kantor.",
    rating: 5,
    isActive: true,
  },
  {
    id: "testi-2",
    name: "Dimas Anggara",
    message:
      "Nasi uduknya wangi dan lauknya komplit. Porsinya bikin kenyang dan rasanya beneran kayak masakan ibu di rumah.",
    rating: 5,
    isActive: true,
  },
  {
    id: "testi-3",
    name: "Siti Nurhaliza",
    message:
      "Risol mayonya favorit anak-anak di rumah! Kulitnya lembut dan mayonesnya lumer. Pesan lewat WhatsApp juga cepat tanggap.",
    rating: 5,
    isActive: true,
  },
];
