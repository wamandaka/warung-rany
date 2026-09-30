"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";
import { Product, Category } from "@/types";
import { ProductGrid } from "@/components/products/ProductGrid";

interface TodayMenuSectionProps {
  products: Product[];
  categories: Category[];
}

export const TodayMenuSection: React.FC<TodayMenuSectionProps> = ({
  products,
  categories,
}) => {
  // Filter products marked as today's menu
  const todayProducts = products.filter((p) => p.isTodayMenu);

  // Fallback to featured or first 4 products if none explicitly marked
  const displayProducts =
    todayProducts.length > 0
      ? todayProducts
      : products.filter((p) => p.isFeatured).slice(0, 4);

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-stone-50 border-t border-stone-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-12">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-600 bg-orange-50 border border-orange-200/70 px-3 py-1 rounded-full uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Spesial Hari Ini</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-stone-900 tracking-tight">
              Menu Hari Ini
            </h2>
            <p className="text-sm sm:text-base text-stone-500 mt-1 max-w-xl">
              Pilihan hidangan istimewa yang dimasak segar hari ini. Siap dipesan dan diantar untuk Anda.
            </p>
          </div>

          <Link
            href="/menu"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-orange-600 hover:text-orange-700 transition-colors group self-start sm:self-auto"
          >
            <span>Lihat Semua Menu</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Product Grid */}
        <ProductGrid
          products={displayProducts}
          categories={categories}
          emptyMessage="Belum Ada Menu Spesial Hari Ini"
          emptyDescription="Silakan lihat daftar menu lengkap kami untuk memesan lauk favorit Anda."
        />
      </div>
    </section>
  );
};
