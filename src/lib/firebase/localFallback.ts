import {
  Category,
  Product,
  Promo,
  Testimonial,
  BusinessSettings,
  OpeningHoursData,
} from "@/types";
import {
  initialCategories,
  initialProducts,
  initialPromos,
  initialSettings,
  initialOpeningHours,
  initialTestimonials,
} from "./mockData";

const KEYS = {
  PRODUCTS: "warung_rany_products",
  CATEGORIES: "warung_rany_categories",
  SETTINGS: "warung_rany_settings",
  OPENING_HOURS: "warung_rany_opening_hours",
  PROMOS: "warung_rany_promos",
  TESTIMONIALS: "warung_rany_testimonials",
};

function getLocalItem<T>(key: string, defaultVal: T): T {
  if (typeof window === "undefined") return defaultVal;
  try {
    const stored = localStorage.getItem(key);
    if (!stored) {
      localStorage.setItem(key, JSON.stringify(defaultVal));
      return defaultVal;
    }
    return JSON.parse(stored) as T;
  } catch {
    return defaultVal;
  }
}

function setLocalItem<T>(key: string, val: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(val));
    window.dispatchEvent(new Event("storage_sync"));
  } catch (e) {
    console.error("Local storage error:", e);
  }
}

export const localRepo = {
  getProducts(): Product[] {
    return getLocalItem<Product[]>(KEYS.PRODUCTS, initialProducts);
  },
  setProducts(products: Product[]): void {
    setLocalItem(KEYS.PRODUCTS, products);
  },

  getCategories(): Category[] {
    return getLocalItem<Category[]>(KEYS.CATEGORIES, initialCategories);
  },
  setCategories(cats: Category[]): void {
    setLocalItem(KEYS.CATEGORIES, cats);
  },

  getSettings(): BusinessSettings {
    return getLocalItem<BusinessSettings>(KEYS.SETTINGS, initialSettings);
  },
  setSettings(s: BusinessSettings): void {
    setLocalItem(KEYS.SETTINGS, s);
  },

  getOpeningHours(): OpeningHoursData {
    return getLocalItem<OpeningHoursData>(KEYS.OPENING_HOURS, initialOpeningHours);
  },
  setOpeningHours(h: OpeningHoursData): void {
    setLocalItem(KEYS.OPENING_HOURS, h);
  },

  getPromos(): Promo[] {
    return getLocalItem<Promo[]>(KEYS.PROMOS, initialPromos);
  },
  setPromos(p: Promo[]): void {
    setLocalItem(KEYS.PROMOS, p);
  },

  getTestimonials(): Testimonial[] {
    return getLocalItem<Testimonial[]>(KEYS.TESTIMONIALS, initialTestimonials);
  },
  setTestimonials(t: Testimonial[]): void {
    setLocalItem(KEYS.TESTIMONIALS, t);
  },
};
