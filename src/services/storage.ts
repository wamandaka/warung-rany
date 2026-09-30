import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage, isFirebaseConfigured } from "@/lib/firebase/config";

/**
 * Converts a Google Drive share link into a direct CDN image link.
 * Example input: https://drive.google.com/file/d/1abcXYZ_123/view?usp=sharing
 * Example output: https://lh3.googleusercontent.com/d/1abcXYZ_123
 */
export function convertGoogleDriveUrl(rawUrl: string): string {
  if (!rawUrl || typeof rawUrl !== "string") return "";
  const trimmed = rawUrl.trim();

  // Pattern 1: https://drive.google.com/file/d/FILE_ID/view...
  const matchFileD = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (matchFileD && matchFileD[1]) {
    return `https://lh3.googleusercontent.com/d/${matchFileD[1]}`;
  }

  // Pattern 2: https://drive.google.com/open?id=FILE_ID or https://drive.google.com/uc?id=FILE_ID
  const matchId = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (matchId && matchId[1]) {
    return `https://lh3.googleusercontent.com/d/${matchId[1]}`;
  }

  return trimmed;
}

/**
 * Compress and resize an image file using browser Canvas.
 * Produces a lightweight WebP Data URL (typically 30KB - 80KB),
 * preventing Firestore 1MB document size limit errors.
 */
export async function compressImageToDataUrl(
  file: File,
  maxDimension = 1000,
  quality = 0.8
): Promise<string> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") {
      resolve("");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new window.Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }

        // Draw image with smooth scaling
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to WebP format with compression, fallback to JPEG
        let dataUrl = canvas.toDataURL("image/webp", quality);
        if (!dataUrl.startsWith("data:image/webp")) {
          dataUrl = canvas.toDataURL("image/jpeg", quality);
        }
        resolve(dataUrl);
      };

      img.onerror = () => reject(new Error("Gagal memproses file gambar"));
      img.src = e.target?.result as string;
    };

    reader.onerror = () => reject(new Error("Gagal membaca file gambar"));
    reader.readAsDataURL(file);
  });
}

/**
 * Upload image to ImgBB (Free public image hosting API)
 * Requires NEXT_PUBLIC_IMGBB_API_KEY in .env
 */
export async function uploadToImgBB(file: File, apiKey: string): Promise<string> {
  const formData = new FormData();
  formData.append("image", file);

  const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
    method: "POST",
    body: formData,
  });

  const data = await response.json();
  if (data.success && data.data?.url) {
    return data.data.url;
  }
  throw new Error(data.error?.message || "Gagal mengunggah foto ke ImgBB CDN");
}

/**
 * Main upload function with multi-tier fallback:
 * 1. ImgBB CDN (if NEXT_PUBLIC_IMGBB_API_KEY is configured)
 * 2. Firebase Cloud Storage (if activated in Firebase Console)
 * 3. Client-side Canvas WebP Compression (< 80KB) for seamless offline & zero-cost usage!
 */
export async function uploadImage(
  file: File,
  folder: string = "products"
): Promise<string> {
  // Validate file size (max 10MB raw)
  const maxSize = 10 * 1024 * 1024;
  if (file.size > maxSize) {
    throw new Error("Ukuran foto asli maksimal 10MB");
  }

  // Validate file type
  if (!file.type.startsWith("image/")) {
    throw new Error("File harus berupa gambar (JPG, PNG, WebP)");
  }

  // 1. Try ImgBB CDN if API key is provided
  const imgbbKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
  if (imgbbKey) {
    try {
      const imgbbUrl = await uploadToImgBB(file, imgbbKey);
      return imgbbUrl;
    } catch (err) {
      console.warn("ImgBB upload failed, falling back:", err);
    }
  }

  // 2. Try Firebase Storage if configured and available
  if (isFirebaseConfigured && storage) {
    try {
      const fileName = `${Date.now()}-${file.name.replace(/\s+/g, "_")}`;
      const storageRef = ref(storage, `${folder}/${fileName}`);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadUrl = await getDownloadURL(snapshot.ref);
      return downloadUrl;
    } catch (error) {
      console.warn("Firebase Storage unavailable, falling back to auto-compressed WebP:", error);
    }
  }

  // 3. Fallback: Compress in browser using Canvas to lightweight WebP Data URL (< 80KB)
  // This allows zero-cost image storage directly inside Firestore / localStorage without errors!
  return await compressImageToDataUrl(file);
}
