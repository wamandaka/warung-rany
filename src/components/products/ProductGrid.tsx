"use client";

import React from "react";
import { Product, Category } from "@/types";
import { ProductCard } from "./ProductCard";
import { Utensils } from "lucide-react";

interface ProductGridProps {
  products: Product[];
  categories?: Category[];
  emptyMessage?: string;
  emptyDescription?: string;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  categories = [],
  emptyMessage = "Belum Ada Menu Tersedia",
  emptyDescription = "Saat ini belum ada hidangan yang cocok dengan kriteria atau kategori ini.",
}) => {
  const categoryMap = React.useMemo(() => {
    const map = new Map<string, string>();
    categories.forEach((c) => map.set(c.id, c.name));
    return map;
  }, [categories]);

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-3xl border border-stone-200/80 my-6 shadow-xs">
        <div className="w-16 h-16 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center mb-4">
          <Utensils className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-stone-900 mb-1">{emptyMessage}</h3>
        <p className="text-sm text-stone-500 max-w-sm">{emptyDescription}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          categoryName={categoryMap.get(product.categoryId)}
        />
      ))}
    </div>
  );
};
