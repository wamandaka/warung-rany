import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db, isFirebaseConfigured } from "@/lib/firebase/config";
import { localRepo } from "@/lib/firebase/localFallback";
import { Product } from "@/types";
import { slugify, serializeTimestamp } from "@/lib/utils";

const PRODUCTS_COLLECTION = "products";

function normalizeProduct(id: string, raw: Record<string, unknown>): Product {
  return {
    id,
    name: String(raw.name ?? ""),
    slug: String(raw.slug ?? ""),
    description: String(raw.description ?? ""),
    price: Number(raw.price ?? 0),
    categoryId: String(raw.categoryId ?? ""),
    imageUrl: String(raw.imageUrl ?? ""),
    stock: raw.stock !== undefined && raw.stock !== null ? Number(raw.stock) : null,
    isAvailable: raw.isAvailable !== undefined ? Boolean(raw.isAvailable) : true,
    isTodayMenu: Boolean(raw.isTodayMenu),
    isFeatured: Boolean(raw.isFeatured),
    sortOrder: Number(raw.sortOrder ?? 0),
    createdAt: serializeTimestamp(raw.createdAt),
    updatedAt: serializeTimestamp(raw.updatedAt),
  };
}

export async function getProducts(): Promise<Product[]> {
  if (!isFirebaseConfigured || !db) {
    return localRepo.getProducts();
  }
  try {
    const q = query(
      collection(db, PRODUCTS_COLLECTION),
      orderBy("sortOrder", "asc")
    );
    const snapshot = await getDocs(q);
    if (snapshot.empty) {
      // If Firestore is empty, return local defaults
      return localRepo.getProducts();
    }
    return snapshot.docs.map((docSnap) =>
      normalizeProduct(docSnap.id, docSnap.data() as Record<string, unknown>)
    );
  } catch (error) {
    console.warn("Firestore getProducts error, falling back to local:", error);
    return localRepo.getProducts();
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const all = await getProducts();
  return all.find((p) => p.slug === slug) || null;
}

export async function getProductById(id: string): Promise<Product | null> {
  if (!isFirebaseConfigured || !db) {
    const all = localRepo.getProducts();
    return all.find((p) => p.id === id) || null;
  }
  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, id);
    const snap = await getDoc(docRef);
    if (!snap.exists()) {
      const all = localRepo.getProducts();
      return all.find((p) => p.id === id) || null;
    }
    return normalizeProduct(snap.id, snap.data() as Record<string, unknown>);
  } catch {
    const all = localRepo.getProducts();
    return all.find((p) => p.id === id) || null;
  }
}

export async function createProduct(
  data: Omit<Product, "id" | "createdAt" | "updatedAt">
): Promise<Product> {
  const slug = data.slug || slugify(data.name);
  const newProduct: Product = {
    ...data,
    id: `prod-${Date.now()}`,
    slug,
    sortOrder: data.sortOrder ?? 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  if (!isFirebaseConfigured || !db) {
    const existing = localRepo.getProducts();
    const updated = [...existing, newProduct];
    localRepo.setProducts(updated);
    return newProduct;
  }

  try {
    const docRef = await addDoc(collection(db, PRODUCTS_COLLECTION), {
      ...data,
      slug,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    newProduct.id = docRef.id;
    return newProduct;
  } catch (error) {
    console.warn("Firestore createProduct error, using local:", error);
    const existing = localRepo.getProducts();
    localRepo.setProducts([...existing, newProduct]);
    return newProduct;
  }
}

export async function updateProduct(
  id: string,
  data: Partial<Product>
): Promise<void> {
  if (data.name && !data.slug) {
    data.slug = slugify(data.name);
  }

  if (!isFirebaseConfigured || !db) {
    const existing = localRepo.getProducts();
    const updated = existing.map((p) =>
      p.id === id ? { ...p, ...data, updatedAt: new Date().toISOString() } : p
    );
    localRepo.setProducts(updated);
    return;
  }

  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.warn("Firestore updateProduct error, updating local:", error);
    const existing = localRepo.getProducts();
    const updated = existing.map((p) =>
      p.id === id ? { ...p, ...data, updatedAt: new Date().toISOString() } : p
    );
    localRepo.setProducts(updated);
  }
}

export async function deleteProduct(id: string): Promise<void> {
  if (!isFirebaseConfigured || !db) {
    const existing = localRepo.getProducts();
    localRepo.setProducts(existing.filter((p) => p.id !== id));
    return;
  }

  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.warn("Firestore deleteProduct error, deleting local:", error);
    const existing = localRepo.getProducts();
    localRepo.setProducts(existing.filter((p) => p.id !== id));
  }
}

export async function toggleProductAvailability(
  id: string,
  isAvailable: boolean
): Promise<void> {
  await updateProduct(id, { isAvailable });
}

export async function toggleTodayMenu(
  id: string,
  isTodayMenu: boolean
): Promise<void> {
  await updateProduct(id, { isTodayMenu });
}

export async function updateProductStock(
  id: string,
  stock: number | null
): Promise<void> {
  await updateProduct(id, { stock });
}
