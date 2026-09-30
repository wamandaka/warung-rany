export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  categoryId: string;
  imageUrl: string;
  stock: number | null; // null = unlimited, 0 = habis, 1+ = limited
  isAvailable: boolean;
  isTodayMenu: boolean;
  isFeatured: boolean;
  sortOrder: number;
  createdAt?: string | number | null;
  updatedAt?: string | number | null;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  sortOrder: number;
  isActive: boolean;
}

export interface Promo {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  isActive: boolean;
  startDate?: string | null;
  endDate?: string | null;
}

export interface Testimonial {
  id: string;
  name: string;
  message: string;
  rating: number; // 1-5
  isActive: boolean;
}

export interface BusinessSettings {
  businessName: string;
  logoUrl: string;
  tagline: string;
  description: string;
  address: string;
  whatsappNumber: string;
  instagramUrl: string;
  googleMapsUrl: string;
  tiktokUrl?: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImageUrl: string;
  ctaText: string;
  defaultGreeting: string;
  defaultOrderNote?: string;
  // Tentang Kami / About Us
  aboutTitle?: string;
  aboutStory?: string;
  aboutStory2?: string;
  aboutImageUrl?: string;
  aboutBadgeTitle?: string;
  aboutBadgeSubtitle?: string;
}

export type DayOfWeek =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

export interface DaySchedule {
  dayName: string;
  isOpen: boolean;
  openTime: string;
  closeTime: string;
}

export type OpeningHoursData = Record<DayOfWeek, DaySchedule>;

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
  maxStock: number | null;
  isAvailable: boolean;
}
