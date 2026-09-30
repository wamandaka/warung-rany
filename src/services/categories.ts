import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
} from "firebase/firestore";
import { db, isFirebaseConfigured } from "@/lib/firebase/config";
import { localRepo } from "@/lib/firebase/localFallback";
import { Category } from "@/types";
import { slugify } from "@/lib/utils";

const CATEGORIES_COLLECTION = "categories";

export async function getCategories(): Promise<Category[]> {
  if (!isFirebaseConfigured || !db) {
    return localRepo.getCategories();
  }
  try {
    const q = query(
      collection(db, CATEGORIES_COLLECTION),
      orderBy("sortOrder", "asc")
    );
    const snapshot = await getDocs(q);
    if (snapshot.empty) {
      return localRepo.getCategories();
    }
    return snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    })) as Category[];
  } catch (error) {
    console.warn("Firestore getCategories error, fallback to local:", error);
    return localRepo.getCategories();
  }
}

export async function getActiveCategories(): Promise<Category[]> {
  const all = await getCategories();
  return all.filter((c) => c.isActive);
}

export async function createCategory(
  data: Omit<Category, "id">
): Promise<Category> {
  const slug = data.slug || slugify(data.name);
  const newCat: Category = {
    ...data,
    id: `cat-${Date.now()}`,
    slug,
  };

  if (!isFirebaseConfigured || !db) {
    const existing = localRepo.getCategories();
    localRepo.setCategories([...existing, newCat]);
    return newCat;
  }

  try {
    const docRef = await addDoc(collection(db, CATEGORIES_COLLECTION), {
      ...data,
      slug,
    });
    newCat.id = docRef.id;
    return newCat;
  } catch {
    const existing = localRepo.getCategories();
    localRepo.setCategories([...existing, newCat]);
    return newCat;
  }
}

export async function updateCategory(
  id: string,
  data: Partial<Category>
): Promise<void> {
  if (data.name && !data.slug) {
    data.slug = slugify(data.name);
  }

  if (!isFirebaseConfigured || !db) {
    const existing = localRepo.getCategories();
    localRepo.setCategories(
      existing.map((c) => (c.id === id ? { ...c, ...data } : c))
    );
    return;
  }

  try {
    const docRef = doc(db, CATEGORIES_COLLECTION, id);
    await updateDoc(docRef, data);
  } catch {
    const existing = localRepo.getCategories();
    localRepo.setCategories(
      existing.map((c) => (c.id === id ? { ...c, ...data } : c))
    );
  }
}

export async function deleteCategory(id: string): Promise<void> {
  if (!isFirebaseConfigured || !db) {
    const existing = localRepo.getCategories();
    localRepo.setCategories(existing.filter((c) => c.id !== id));
    return;
  }

  try {
    const docRef = doc(db, CATEGORIES_COLLECTION, id);
    await deleteDoc(docRef);
  } catch {
    const existing = localRepo.getCategories();
    localRepo.setCategories(existing.filter((c) => c.id !== id));
  }
}
