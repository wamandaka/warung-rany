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
import { Testimonial } from "@/types";

const TESTIMONIALS_COLLECTION = "testimonials";

export async function getTestimonials(): Promise<Testimonial[]> {
  if (!isFirebaseConfigured || !db) {
    return localRepo.getTestimonials();
  }
  try {
    const snapshot = await getDocs(collection(db, TESTIMONIALS_COLLECTION));
    if (snapshot.empty) {
      return localRepo.getTestimonials();
    }
    return snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    })) as Testimonial[];
  } catch {
    return localRepo.getTestimonials();
  }
}

export async function getActiveTestimonials(): Promise<Testimonial[]> {
  const all = await getTestimonials();
  return all.filter((t) => t.isActive);
}

export async function createTestimonial(
  data: Omit<Testimonial, "id">
): Promise<Testimonial> {
  const newTesti: Testimonial = {
    ...data,
    id: `testi-${Date.now()}`,
  };

  if (!isFirebaseConfigured || !db) {
    const existing = localRepo.getTestimonials();
    localRepo.setTestimonials([...existing, newTesti]);
    return newTesti;
  }

  try {
    const docRef = await addDoc(collection(db, TESTIMONIALS_COLLECTION), data);
    newTesti.id = docRef.id;
    return newTesti;
  } catch {
    const existing = localRepo.getTestimonials();
    localRepo.setTestimonials([...existing, newTesti]);
    return newTesti;
  }
}

export async function updateTestimonial(
  id: string,
  data: Partial<Testimonial>
): Promise<void> {
  if (!isFirebaseConfigured || !db) {
    const existing = localRepo.getTestimonials();
    localRepo.setTestimonials(
      existing.map((t) => (t.id === id ? { ...t, ...data } : t))
    );
    return;
  }

  try {
    const docRef = doc(db, TESTIMONIALS_COLLECTION, id);
    await updateDoc(docRef, data);
  } catch {
    const existing = localRepo.getTestimonials();
    localRepo.setTestimonials(
      existing.map((t) => (t.id === id ? { ...t, ...data } : t))
    );
  }
}

export async function deleteTestimonial(id: string): Promise<void> {
  if (!isFirebaseConfigured || !db) {
    const existing = localRepo.getTestimonials();
    localRepo.setTestimonials(existing.filter((t) => t.id !== id));
    return;
  }

  try {
    const docRef = doc(db, TESTIMONIALS_COLLECTION, id);
    await deleteDoc(docRef);
  } catch {
    const existing = localRepo.getTestimonials();
    localRepo.setTestimonials(existing.filter((t) => t.id !== id));
  }
}
