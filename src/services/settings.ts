import { doc, getDoc, setDoc } from "firebase/firestore";
import { db, isFirebaseConfigured } from "@/lib/firebase/config";
import { localRepo } from "@/lib/firebase/localFallback";
import { BusinessSettings, OpeningHoursData } from "@/types";
import { removeUndefinedFields } from "@/lib/utils";

const SETTINGS_COLLECTION = "settings";
const BUSINESS_DOC = "business";
const OPENING_HOURS_DOC = "openingHours";

function normalizeBusinessSettings(raw: Record<string, unknown>): BusinessSettings {
  const defaultSettings = localRepo.getSettings();
  return {
    ...defaultSettings,
    businessName: String(raw.businessName ?? defaultSettings.businessName),
    logoUrl: String(raw.logoUrl ?? defaultSettings.logoUrl),
    tagline: String(raw.tagline ?? defaultSettings.tagline),
    description: String(raw.description ?? defaultSettings.description),
    address: String(raw.address ?? defaultSettings.address),
    whatsappNumber: String(raw.whatsappNumber ?? defaultSettings.whatsappNumber),
    instagramUrl: String(raw.instagramUrl ?? defaultSettings.instagramUrl),
    googleMapsUrl: String(raw.googleMapsUrl ?? defaultSettings.googleMapsUrl),
    tiktokUrl: raw.tiktokUrl ? String(raw.tiktokUrl) : defaultSettings.tiktokUrl,
    heroTitle: String(raw.heroTitle ?? defaultSettings.heroTitle),
    heroSubtitle: String(raw.heroSubtitle ?? defaultSettings.heroSubtitle),
    heroImageUrl: String(raw.heroImageUrl ?? defaultSettings.heroImageUrl),
    ctaText: String(raw.ctaText ?? defaultSettings.ctaText),
    defaultGreeting: String(raw.defaultGreeting ?? defaultSettings.defaultGreeting),
    defaultOrderNote: raw.defaultOrderNote ? String(raw.defaultOrderNote) : defaultSettings.defaultOrderNote,
    aboutTitle: raw.aboutTitle !== undefined ? String(raw.aboutTitle) : defaultSettings.aboutTitle,
    aboutStory: raw.aboutStory !== undefined ? String(raw.aboutStory) : defaultSettings.aboutStory,
    aboutStory2: raw.aboutStory2 !== undefined ? String(raw.aboutStory2) : defaultSettings.aboutStory2,
    aboutImageUrl: raw.aboutImageUrl !== undefined ? String(raw.aboutImageUrl) : defaultSettings.aboutImageUrl,
    aboutBadgeTitle: raw.aboutBadgeTitle !== undefined ? String(raw.aboutBadgeTitle) : defaultSettings.aboutBadgeTitle,
    aboutBadgeSubtitle: raw.aboutBadgeSubtitle !== undefined ? String(raw.aboutBadgeSubtitle) : defaultSettings.aboutBadgeSubtitle,
  };
}

function normalizeOpeningHours(raw: Record<string, unknown>): OpeningHoursData {
  const defaultHours = localRepo.getOpeningHours();
  const res = { ...defaultHours };
  for (const day of Object.keys(defaultHours) as (keyof OpeningHoursData)[]) {
    if (raw[day] && typeof raw[day] === "object") {
      const item = raw[day] as Record<string, unknown>;
      res[day] = {
        dayName: String(item.dayName || defaultHours[day].dayName),
        isOpen: item.isOpen !== undefined ? Boolean(item.isOpen) : defaultHours[day].isOpen,
        openTime: String(item.openTime || defaultHours[day].openTime),
        closeTime: String(item.closeTime || defaultHours[day].closeTime),
      };
    }
  }
  return res;
}

export async function getBusinessSettings(): Promise<BusinessSettings> {
  if (!isFirebaseConfigured || !db) {
    return localRepo.getSettings();
  }
  try {
    const docRef = doc(db, SETTINGS_COLLECTION, BUSINESS_DOC);
    const snap = await getDoc(docRef);
    if (!snap.exists()) {
      return localRepo.getSettings();
    }
    return normalizeBusinessSettings(snap.data() as Record<string, unknown>);
  } catch (error) {
    console.warn("Firestore getBusinessSettings error:", error);
    return localRepo.getSettings();
  }
}

export async function updateBusinessSettings(
  data: Partial<BusinessSettings>
): Promise<void> {
  const current = await getBusinessSettings();
  const updated = removeUndefinedFields({ ...current, ...data });

  localRepo.setSettings(updated as BusinessSettings);

  if (isFirebaseConfigured && db) {
    try {
      const docRef = doc(db, SETTINGS_COLLECTION, BUSINESS_DOC);
      await setDoc(docRef, updated, { merge: true });
    } catch (error) {
      console.warn("Firestore updateBusinessSettings error:", error);
    }
  }

  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("storage_sync"));
  }
}

export async function getOpeningHours(): Promise<OpeningHoursData> {
  if (!isFirebaseConfigured || !db) {
    return localRepo.getOpeningHours();
  }
  try {
    const docRef = doc(db, SETTINGS_COLLECTION, OPENING_HOURS_DOC);
    const snap = await getDoc(docRef);
    if (!snap.exists()) {
      return localRepo.getOpeningHours();
    }
    return normalizeOpeningHours(snap.data() as Record<string, unknown>);
  } catch {
    return localRepo.getOpeningHours();
  }
}

export async function updateOpeningHours(
  data: OpeningHoursData
): Promise<void> {
  const cleaned = removeUndefinedFields(data);
  localRepo.setOpeningHours(cleaned as OpeningHoursData);

  if (isFirebaseConfigured && db) {
    try {
      const docRef = doc(db, SETTINGS_COLLECTION, OPENING_HOURS_DOC);
      await setDoc(docRef, cleaned);
    } catch (error) {
      console.warn("Firestore updateOpeningHours error:", error);
    }
  }

  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("storage_sync"));
  }
}
