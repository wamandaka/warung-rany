import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage, isFirebaseConfigured } from "@/lib/firebase/config";

/**
 * Upload image to Firebase Storage, or fallback to DataURL for offline/mock usage
 */
export async function uploadImage(
  file: File,
  folder: string = "products"
): Promise<string> {
  // Validate file size (max 5MB)
  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    throw new Error("Ukuran foto maksimal 5MB");
  }

  // Validate file type
  if (!file.type.startsWith("image/")) {
    throw new Error("File harus berupa gambar (JPG, PNG, WebP)");
  }

  if (isFirebaseConfigured && storage) {
    try {
      const fileName = `${Date.now()}-${file.name.replace(/\s+/g, "_")}`;
      const storageRef = ref(storage, `${folder}/${fileName}`);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadUrl = await getDownloadURL(snapshot.ref);
      return downloadUrl;
    } catch (error) {
      console.warn("Firebase Storage upload failed, falling back to DataURL:", error);
    }
  }

  // Fallback to Base64 Data URL so local/demo usage works seamlessly
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result as string);
    };
    reader.onerror = () => {
      reject(new Error("Gagal membaca file gambar"));
    };
    reader.readAsDataURL(file);
  });
}
