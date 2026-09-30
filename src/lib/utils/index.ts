import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { OpeningHoursData, DayOfWeek } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format numeric amount into Indonesian Rupiah format: Rp15.000
 */
export function formatRupiah(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return "Rp0";
  }
  const formatted = new Intl.NumberFormat("id-ID", {
    maximumFractionDigits: 0,
  }).format(amount);
  return `Rp${formatted}`;
}

/**
 * Convert string to URL-friendly slug
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w-]+/g, "") // Remove all non-word chars
    .replace(/--+/g, "-"); // Replace multiple - with single -
}

/**
 * Get current day of week in our DayOfWeek key format
 */
export function getCurrentDayKey(): DayOfWeek {
  const days: DayOfWeek[] = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];
  const now = new Date();
  return days[now.getDay()];
}

/**
 * Check if the store is currently open according to OpeningHoursData
 */
export function isStoreCurrentlyOpen(hours?: OpeningHoursData): {
  isOpen: boolean;
  message: string;
} {
  if (!hours) {
    return { isOpen: true, message: "Buka" };
  }

  const currentDay = getCurrentDayKey();
  const todaySchedule = hours[currentDay];

  if (!todaySchedule || !todaySchedule.isOpen) {
    return { isOpen: false, message: "Tutup Hari Ini" };
  }

  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const [openHour, openMin] = todaySchedule.openTime.split(":").map(Number);
  const [closeHour, closeMin] = todaySchedule.closeTime.split(":").map(Number);

  const openMinutes = openHour * 60 + (openMin || 0);
  const closeMinutes = closeHour * 60 + (closeMin || 0);

  if (currentMinutes >= openMinutes && currentMinutes <= closeMinutes) {
    return {
      isOpen: true,
      message: `Buka sampai ${todaySchedule.closeTime}`,
    };
  } else if (currentMinutes < openMinutes) {
    return {
      isOpen: false,
      message: `Buka pukul ${todaySchedule.openTime}`,
    };
  } else {
    return {
      isOpen: false,
      message: `Tutup (Buka besok)`,
    };
  }
}

/**
 * Safely serialize any Firestore timestamp, Date, or object to an ISO string or null
 * to prevent Next.js RSC "Only plain objects can be passed to Client Components" errors.
 */
export function serializeTimestamp(value: unknown): string | null {
  if (!value) return null;
  if (typeof value === "string") return value;
  if (typeof value === "number") return new Date(value).toISOString();
  if (typeof value === "object" && value !== null) {
    if ("toDate" in value && typeof (value as { toDate: () => Date }).toDate === "function") {
      try {
        return (value as { toDate: () => Date }).toDate().toISOString();
      } catch {
        // fallback
      }
    }
    if ("seconds" in value && typeof (value as { seconds: number }).seconds === "number") {
      return new Date((value as { seconds: number }).seconds * 1000).toISOString();
    }
  }
  return null;
}

/**
 * Remove all undefined properties from an object recursively
 * so Firestore setDoc does not throw "Unsupported field value: undefined"
 */
export function removeUndefinedFields<T extends Record<string, any>>(obj: T): T {
  const cleaned = {} as Record<string, any>;
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined) {
      if (value !== null && typeof value === "object" && !Array.isArray(value)) {
        cleaned[key] = removeUndefinedFields(value);
      } else {
        cleaned[key] = value;
      }
    }
  }
  return cleaned as T;
}
