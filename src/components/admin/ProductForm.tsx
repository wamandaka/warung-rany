"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Product, Category } from "@/types";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { uploadImage } from "@/services/storage";
import { createProduct, updateProduct } from "@/services/products";
import { toast } from "@/components/ui/Toast";
import { Upload, X, ArrowLeft, Sparkles, Check } from "lucide-react";

interface ProductFormProps {
  initialData?: Product;
  categories: Category[];
  isEditing?: boolean;
}

export const ProductForm: React.FC<ProductFormProps> = ({
  initialData,
  categories,
  isEditing = false,
}) => {
  const router = useRouter();

  const [name, setName] = useState(initialData?.name || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [price, setPrice] = useState<number | string>(initialData?.price ?? 15000);
  const [categoryId, setCategoryId] = useState(
    initialData?.categoryId || (categories[0]?.id ?? "")
  );
  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl || "");
  
  // Stock mode: 'unlimited' vs 'limited' (Requirement 22)
  const [stockType, setStockType] = useState<"unlimited" | "limited">(
    initialData?.stock === null || initialData?.stock === undefined
      ? "unlimited"
      : "limited"
  );
  const [stockAmount, setStockAmount] = useState<number | string>(
    initialData?.stock !== null && initialData?.stock !== undefined
      ? initialData.stock
      : 10
  );

  const [isAvailable, setIsAvailable] = useState<boolean>(
    initialData?.isAvailable ?? true
  );
  const [isTodayMenu, setIsTodayMenu] = useState<boolean>(
    initialData?.isTodayMenu ?? false
  );
  const [isFeatured, setIsFeatured] = useState<boolean>(
    initialData?.isFeatured ?? false
  );
  const [sortOrder, setSortOrder] = useState<number>(
    initialData?.sortOrder ?? 0
  );

  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const url = await uploadImage(file, "products");
      setImageUrl(url);
      toast.success("Foto berhasil diunggah!");
    } catch (err: unknown) {
      toast.error((err as Error).message || "Gagal mengunggah gambar");
    } finally {
      setIsUploading(false);
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim() || name.length < 2) {
      newErrors.name = "Nama produk minimal 2 karakter";
    }
    if (!description.trim() || description.length < 5) {
      newErrors.description = "Deskripsi minimal 5 karakter";
    }
    const numPrice = Number(price);
    if (isNaN(numPrice) || numPrice <= 0) {
      newErrors.price = "Harga harus berupa angka lebih dari 0";
    }
    if (!categoryId) {
      newErrors.categoryId = "Pilih kategori menu";
    }
    if (!imageUrl.trim()) {
      newErrors.imageUrl = "Foto produk wajib diisi atau diunggah";
    }
    if (stockType === "limited") {
      const numStock = Number(stockAmount);
      if (isNaN(numStock) || numStock < 0) {
        newErrors.stock = "Jumlah stok harus 0 atau lebih";
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSaving(true);
    const finalStock = stockType === "unlimited" ? null : Number(stockAmount);
    const numericPrice = Number(price);

    try {
      if (isEditing && initialData) {
        await updateProduct(initialData.id, {
          name,
          description,
          price: numericPrice,
          categoryId,
          imageUrl,
          stock: finalStock,
          isAvailable,
          isTodayMenu,
          isFeatured,
          sortOrder: Number(sortOrder) || 0,
        });
        toast.success("Produk berhasil diperbarui!");
      } else {
        await createProduct({
          name,
          slug: "",
          description,
          price: numericPrice,
          categoryId,
          imageUrl,
          stock: finalStock,
          isAvailable,
          isTodayMenu,
          isFeatured,
          sortOrder: Number(sortOrder) || 0,
        });
        toast.success("Produk baru berhasil ditambahkan!");
      }
      router.push("/admin/products");
      router.refresh();
    } catch (err: unknown) {
      toast.error((err as Error).message || "Gagal menyimpan produk");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-8 pb-12">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-sm font-semibold text-stone-600 hover:text-stone-900"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali</span>
        </button>
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin/products")}
          >
            Batal
          </Button>
          <Button type="submit" variant="primary" isLoading={isSaving}>
            <Check className="w-4 h-4 mr-1.5" />
            <span>Simpan Produk</span>
          </Button>
        </div>
      </div>

      {/* Main Form Cards */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-xs space-y-6">
        <h2 className="text-lg font-bold text-stone-900 pb-3 border-b border-stone-100">
          Informasi Utama Produk
        </h2>

        <div className="space-y-4">
          <Input
            label="Nama Produk *"
            placeholder="Contoh: Ayam Geprek Sambal Korek"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={errors.name}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">
                Kategori Menu *
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full rounded-xl border border-stone-300 bg-white px-3.5 py-2.5 text-sm text-stone-900 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              {errors.categoryId && (
                <p className="text-xs font-medium text-rose-600 mt-1">
                  {errors.categoryId}
                </p>
              )}
            </div>

            <Input
              label="Harga (Rupiah) *"
              type="number"
              placeholder="15000"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              error={errors.price}
              helperText="Masukkan angka tanpa titik atau koma (contoh: 15000)"
            />
          </div>

          <Textarea
            label="Deskripsi Lengkap *"
            placeholder="Jelaskan cita rasa, bumbu, porsi, dan bahan utama..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            error={errors.description}
            rows={4}
          />
        </div>
      </div>

      {/* Foto Produk */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-xs space-y-6">
        <h2 className="text-lg font-bold text-stone-900 pb-3 border-b border-stone-100">
          Foto Produk
        </h2>

        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-start">
            {/* Image Preview */}
            <div className="space-y-2">
              <span className="block text-xs font-semibold text-stone-700 uppercase tracking-wider">
                Pratinjau Foto
              </span>
              <div className="relative aspect-4/3 rounded-2xl overflow-hidden bg-stone-100 border border-stone-200 flex items-center justify-center">
                {imageUrl ? (
                  <>
                    <Image
                      src={imageUrl}
                      alt="Pratinjau Foto"
                      fill
                      className="object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setImageUrl("")}
                      className="absolute top-2 right-2 p-1.5 rounded-full bg-stone-900/70 text-white hover:bg-stone-900 transition-colors"
                      title="Hapus foto"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </>
                ) : (
                  <div className="text-stone-400 text-xs text-center p-4">
                    Belum ada foto yang dipilih
                  </div>
                )}
              </div>
            </div>

            {/* Upload or URL input */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-2">
                  Unggah File Foto
                </label>
                <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-stone-300 hover:border-orange-500 rounded-2xl cursor-pointer bg-stone-50/50 hover:bg-orange-50/30 transition-all text-center">
                  <Upload className="w-6 h-6 text-stone-400 mb-2" />
                  <span className="text-xs font-semibold text-stone-700">
                    {isUploading ? "Mengunggah..." : "Pilih foto dari perangkat"}
                  </span>
                  <span className="text-[11px] text-stone-400 mt-1">
                    JPG, PNG, WebP (Maks 5MB)
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileChange}
                    disabled={isUploading}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="space-y-1.5">
                <span className="text-xs font-semibold text-stone-700 uppercase tracking-wider">
                  Atau Gunakan Tautan URL Foto
                </span>
                <Input
                  placeholder="https://images.unsplash.com/..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  error={errors.imageUrl}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stok dan Status (Requirement 22) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-xs space-y-6">
        <h2 className="text-lg font-bold text-stone-900 pb-3 border-b border-stone-100">
          Stok & Ketersediaan
        </h2>

        {/* Stock Radio Selector (Requirement 22) */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-stone-800">
            Pengaturan Stok
          </label>
          <div className="space-y-2.5">
            <label className="flex items-center gap-3 p-3 rounded-xl border border-stone-200 hover:bg-stone-50 cursor-pointer">
              <input
                type="radio"
                name="stockType"
                value="unlimited"
                checked={stockType === "unlimited"}
                onChange={() => setStockType("unlimited")}
                className="w-4 h-4 text-orange-600 focus:ring-orange-500"
              />
              <div>
                <span className="text-sm font-semibold text-stone-900 block">
                  Tidak dibatasi (Stok Tak Terbatas)
                </span>
                <span className="text-xs text-stone-500">
                  Cocok untuk menu yang selalu tersedia seperti minuman (Es Teh, Es Jeruk)
                </span>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 rounded-xl border border-stone-200 hover:bg-stone-50 cursor-pointer">
              <input
                type="radio"
                name="stockType"
                value="limited"
                checked={stockType === "limited"}
                onChange={() => setStockType("limited")}
                className="w-4 h-4 text-orange-600 focus:ring-orange-500"
              />
              <div>
                <span className="text-sm font-semibold text-stone-900 block">
                  Jumlah Tertentu (Terbatas)
                </span>
                <span className="text-xs text-stone-500">
                  Batas porsi yang bisa dipesan pelanggan hari ini
                </span>
              </div>
            </label>
          </div>

          {stockType === "limited" && (
            <div className="pt-2 pl-7 max-w-xs">
              <Input
                label="Jumlah Stok Tersedia *"
                type="number"
                min="0"
                value={stockAmount}
                onChange={(e) => setStockAmount(e.target.value)}
                error={errors.stock}
                helperText="Isi 0 jika stok hari ini habis"
              />
            </div>
          )}
        </div>

        {/* Checkbox toggles */}
        <div className="pt-4 border-t border-stone-100 space-y-4">
          <label className="flex items-center gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={isAvailable}
              onChange={(e) => setIsAvailable(e.target.checked)}
              className="w-5 h-5 text-orange-600 rounded-md border-stone-300 focus:ring-orange-500"
            />
            <div>
              <span className="text-sm font-semibold text-stone-900 block">
                Menu Tersedia untuk Dipesan
              </span>
              <span className="text-xs text-stone-500">
                Hilangkan centang jika menu sementara tidak ingin ditampilkan atau dijual
              </span>
            </div>
          </label>

          <label className="flex items-center gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={isTodayMenu}
              onChange={(e) => setIsTodayMenu(e.target.checked)}
              className="w-5 h-5 text-orange-600 rounded-md border-stone-300 focus:ring-orange-500"
            />
            <div>
              <span className="text-sm font-semibold text-stone-900 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-orange-600" />
                Tandai sebagai Menu Hari Ini
              </span>
              <span className="text-xs text-stone-500">
                Akan muncul di bagian sorotan spesial pada halaman depan
              </span>
            </div>
          </label>

          <label className="flex items-center gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="w-5 h-5 text-orange-600 rounded-md border-stone-300 focus:ring-orange-500"
            />
            <div>
              <span className="text-sm font-semibold text-stone-900 block">
                Produk Rekomendasi (Featured)
              </span>
              <span className="text-xs text-stone-500">
                Ditampilkan prioritas saat pelanggan mencari menu
              </span>
            </div>
          </label>
        </div>

        {/* Sort order */}
        <div className="pt-4 border-t border-stone-100 max-w-xs">
          <Input
            label="Nomor Urutan Tampil"
            type="number"
            value={sortOrder}
            onChange={(e) => setSortOrder(Number(e.target.value))}
            helperText="Angka lebih kecil tampil lebih awal (0, 1, 2, ...)"
          />
        </div>
      </div>

      {/* Form Submit Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/products")}
        >
          Batal
        </Button>
        <Button type="submit" variant="primary" size="lg" isLoading={isSaving}>
          <Check className="w-5 h-5 mr-1.5" />
          <span>Simpan Produk</span>
        </Button>
      </div>
    </form>
  );
};
