"use client";

import React, { useState, useEffect } from "react";
import { getCategories } from "@/services/categories";
import { Category } from "@/types";
import { ProductForm } from "@/components/admin/ProductForm";
import { Loader2 } from "lucide-react";

export default function NewProductPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const cats = await getCategories();
        setCategories(cats);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
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
          Tambah Produk Menu Baru
        </h1>
        <p className="text-sm text-stone-500 mt-1">
          Lengkapi detail nama, harga, stok, dan foto untuk menambahkan hidangan ke katalog.
        </p>
      </div>

      <ProductForm categories={categories} />
    </div>
  );
}
