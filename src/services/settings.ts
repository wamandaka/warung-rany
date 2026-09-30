import { doc, getDoc, setDoc } from "firebase/firestore";
import { db, isFirebaseConfigured } from "@/lib/firebase/config";
import { localRepo } from "@/lib/firebase/localFallback";
import { BusinessSettings, OpeningHoursData } from "@/types";

const SETTINGS_COLLECTION = "settings";
const BUSINESS_DOC = "business";
const OPENING_HOURS_DOC = "openingHours";

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
    return snap.data() as BusinessSettings;
  } catch (error) {
    console.warn("Firestore getBusinessSettings error:", error);
    return localRepo.getSettings();
  }
}

export async function updateBusinessSettings(
  data: Partial<BusinessSettings>
): Promise<void> {
  const current = await getBusinessSettings();
  const updated = { ...current, ...data };

  if (!isFirebaseConfigured || !db) {
    localRepo.setSettings(updated);
    return;
  }

  try {
    const docRef = doc(db, SETTINGS_COLLECTION, BUSINESS_DOC);
    await setDoc(docRef, updated, { merge: true });
    localRepo.setSettings(updated);
  } catch (error) {
    console.warn("Firestore updateBusinessSettings error, setting local:", error);
    localRepo.setSettings(updated);
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
    return snap.data() as OpeningHoursData;
  } catch {
    return localRepo.getOpeningHours();
  }
}

export async function updateOpeningHours(
  data: OpeningHoursData
): Promise<void> {
  if (!isFirebaseConfigured || !db) {
    localRepo.setOpeningHours(data);
    return;
  }

  try {
    const docRef = doc(db, SETTINGS_COLLECTION, OPENING_HOURS_DOC);
    await setDoc(docRef, data);
    localRepo.setOpeningHours(data);
  } catch {
    localRepo.setOpeningHours(data);
  }
}
