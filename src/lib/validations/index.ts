import { z } from "zod";
import { isValidIndonesianPhone } from "@/lib/whatsapp";

export const productSchema = z.object({
  name: z.string().min(2, "Nama produk minimal 2 karakter"),
  slug: z.string().optional(),
  description: z.string().min(5, "Deskripsi minimal 5 karakter"),
  price: z.coerce.number().int().min(100, "Harga harus lebih dari Rp100"),
  categoryId: z.string().min(1, "Kategori harus dipilih"),
  imageUrl: z.string().min(1, "Foto produk wajib disertakan"),
  stock: z
    .union([z.coerce.number().int().min(0, "Stok tidak boleh negatif"), z.null()])
    .optional(),
  isAvailable: z.boolean().default(true),
  isTodayMenu: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
  sortOrder: z.coerce.number().int().default(0),
});

export type ProductFormValues = z.infer<typeof productSchema>;

export const categorySchema = z.object({
  name: z.string().min(2, "Nama kategori minimal 2 karakter"),
  slug: z.string().optional(),
  sortOrder: z.coerce.number().int().default(0),
  isActive: z.boolean().default(true),
});

export type CategoryFormValues = z.infer<typeof categorySchema>;

export const promoSchema = z.object({
  title: z.string().min(3, "Judul promo minimal 3 karakter"),
  description: z.string().min(5, "Deskripsi minimal 5 karakter"),
  imageUrl: z.string().min(1, "Gambar banner promo wajib diisi"),
  isActive: z.boolean().default(true),
  startDate: z.string().nullable().optional(),
  endDate: z.string().nullable().optional(),
});

export type PromoFormValues = z.infer<typeof promoSchema>;

export const testimonialSchema = z.object({
  name: z.string().min(2, "Nama pelanggan minimal 2 karakter"),
  message: z.string().min(5, "Pesan testimoni minimal 5 karakter"),
  rating: z.coerce.number().int().min(1).max(5, "Rating antara 1 sampai 5"),
  isActive: z.boolean().default(true),
});

export type TestimonialFormValues = z.infer<typeof testimonialSchema>;

export const businessSettingsSchema = z.object({
  businessName: z.string().min(2, "Nama usaha wajib diisi"),
  logoUrl: z.string().optional().default(""),
  tagline: z.string().min(3, "Tagline wajib diisi"),
  description: z.string().min(10, "Deskripsi usaha minimal 10 karakter"),
  address: z.string().min(5, "Alamat usaha wajib diisi"),
  whatsappNumber: z
    .string()
    .min(9, "Nomor WhatsApp tidak valid")
    .refine((val) => isValidIndonesianPhone(val), {
      message: "Format nomor WhatsApp tidak valid (contoh: 081234567890)",
    }),
  instagramUrl: z.string().optional().default(""),
  googleMapsUrl: z.string().optional().default(""),
  tiktokUrl: z.string().optional().default(""),
  heroTitle: z.string().min(3, "Judul hero wajib diisi"),
  heroSubtitle: z.string().min(5, "Subjudul hero wajib diisi"),
  heroImageUrl: z.string().min(1, "Gambar hero wajib diisi"),
  ctaText: z.string().min(2, "Teks CTA wajib diisi"),
  defaultGreeting: z.string().min(3, "Salam pembuka WhatsApp wajib diisi"),
  defaultOrderNote: z.string().optional().default(""),
});

export type BusinessSettingsFormValues = z.infer<typeof businessSettingsSchema>;

export const checkoutFormSchema = z.object({
  customerName: z
    .string()
    .min(2, "Silakan masukkan nama Anda minimal 2 karakter")
    .max(50, "Nama terlalu panjang"),
  customerNote: z.string().max(200, "Catatan maksimal 200 karakter").optional(),
});

export type CheckoutFormValues = z.infer<typeof checkoutFormSchema>;
