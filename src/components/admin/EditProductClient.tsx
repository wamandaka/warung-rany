"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getProductById } from "@/services/products";
import { getCategories } from "@/services/categories";
import { Product, Category } from "@/types";
import { ProductForm } from "@/components/admin/ProductForm";
import { Loader2 } from "lucide-react";
import { toast } from "@/components/ui/Toast";

export default function EditProductClient({ id }: { id: string }) {
  const router = useRouter();

  const [product, setProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [prod, cats] = await Promise.all([
          getProductById(id),
          getCategories(),
        ]);
        if (!prod) {
          toast.error("Produk tidak ditemukan");
          router.push("/admin/products");
          return;
        }
        setProduct(prod);
        setCategories(cats);
      } catch {
        toast.error("Gagal memuat detail produk");
      } finally {
        setLoading(false);
      }
    }
    if (id) {
      load();
    }
  }, [id, router]);

  if (loading || !product) {
    return (
      <div className="p-12 flex justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-orange-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
          Edit Produk: {product.name}
        </h1>
        <p className="text-sm text-stone-500 mt-1">
          Perbarui informasi hidangan, ketersediaan, atau ubah jumlah stok porsi.
        </p>
      </div>

      <ProductForm
        initialData={product}
        categories={categories}
        isEditing={true}
      />
    </div>
  );
}
