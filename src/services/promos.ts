import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db, isFirebaseConfigured } from "@/lib/firebase/config";
import { localRepo } from "@/lib/firebase/localFallback";
import { Promo } from "@/types";
import { serializeTimestamp } from "@/lib/utils";

const PROMOS_COLLECTION = "promos";

function normalizePromo(id: string, raw: Record<string, unknown>): Promo {
  return {
    id,
    title: String(raw.title ?? ""),
    description: String(raw.description ?? ""),
    imageUrl: String(raw.imageUrl ?? ""),
    isActive: raw.isActive !== undefined ? Boolean(raw.isActive) : true,
    startDate: serializeTimestamp(raw.startDate),
    endDate: serializeTimestamp(raw.endDate),
  };
}

export async function getPromos(): Promise<Promo[]> {
  if (!isFirebaseConfigured || !db) {
    return localRepo.getPromos();
  }
  try {
    const snapshot = await getDocs(collection(db, PROMOS_COLLECTION));
    if (snapshot.empty) {
      return localRepo.getPromos();
    }
    return snapshot.docs.map((docSnap) =>
      normalizePromo(docSnap.id, docSnap.data() as Record<string, unknown>)
    );
  } catch {
    return localRepo.getPromos();
  }
}

export async function getActivePromos(): Promise<Promo[]> {
  const all = await getPromos();
  return all.filter((p) => p.isActive);
}

export async function createPromo(data: Omit<Promo, "id">): Promise<Promo> {
  const newPromo: Promo = {
    ...data,
    id: `promo-${Date.now()}`,
  };

  if (!isFirebaseConfigured || !db) {
    const existing = localRepo.getPromos();
    localRepo.setPromos([...existing, newPromo]);
    return newPromo;
  }

  try {
    const docRef = await addDoc(collection(db, PROMOS_COLLECTION), data);
    newPromo.id = docRef.id;
    return newPromo;
  } catch {
    const existing = localRepo.getPromos();
    localRepo.setPromos([...existing, newPromo]);
    return newPromo;
  }
}

export async function updatePromo(
  id: string,
  data: Partial<Promo>
): Promise<void> {
  if (!isFirebaseConfigured || !db) {
    const existing = localRepo.getPromos();
    localRepo.setPromos(
      existing.map((p) => (p.id === id ? { ...p, ...data } : p))
    );
    return;
  }

  try {
    const docRef = doc(db, PROMOS_COLLECTION, id);
    await updateDoc(docRef, data);
  } catch {
    const existing = localRepo.getPromos();
    localRepo.setPromos(
      existing.map((p) => (p.id === id ? { ...p, ...data } : p))
    );
  }
}

export async function deletePromo(id: string): Promise<void> {
  if (!isFirebaseConfigured || !db) {
    const existing = localRepo.getPromos();
    localRepo.setPromos(existing.filter((p) => p.id !== id));
    return;
  }

  try {
    const docRef = doc(db, PROMOS_COLLECTION, id);
    await deleteDoc(docRef);
  } catch {
    const existing = localRepo.getPromos();
    localRepo.setPromos(existing.filter((p) => p.id !== id));
  }
}
