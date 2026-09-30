"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Search, X } from "lucide-react";
import { Product, Category } from "@/types";
import { ProductGrid } from "./ProductGrid";
import { getProducts } from "@/services/products";
import { getActiveCategories } from "@/services/categories";

interface MenuExplorerProps {
  initialProducts: Product[];
  categories: Category[];
}

export const MenuExplorer: React.FC<MenuExplorerProps> = ({
  initialProducts,
  categories: initialCategories,
}) => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [onlyAvailable, setOnlyAvailable] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    const loadFreshData = async () => {
      try {
        const [freshProducts, freshCategories] = await Promise.all([
          getProducts(),
          getActiveCategories(),
        ]);
        if (isMounted) {
          if (freshProducts && freshProducts.length > 0) setProducts(freshProducts);
          if (freshCategories && freshCategories.length > 0) setCategories(freshCategories);
        }
      } catch (err) {
        console.warn("MenuExplorer client refresh error:", err);
      }
    };

    loadFreshData();

    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        loadFreshData();
      }
    };
    window.addEventListener("visibilitychange", handleVisibility);
    return () => {
      isMounted = false;
      window.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // 1. Category filter
      if (selectedCategory !== "all" && product.categoryId !== selectedCategory) {
        return false;
      }

      // 2. Only available filter
      if (onlyAvailable && (!product.isAvailable || product.stock === 0)) {
        return false;
      }

      // 3. Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = product.name.toLowerCase().includes(query);
        const matchesDesc = product.description.toLowerCase().includes(query);
        if (!matchesName && !matchesDesc) {
          return false;
        }
      }

      return true;
    });
  }, [products, selectedCategory, onlyAvailable, searchQuery]);

  return (
    <div className="space-y-8">
      {/* Search and Filters Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200/90 shadow-xs space-y-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari lauk, nasi, camilan, atau minuman segar..."
            className="w-full pl-10 pr-10 py-3 rounded-xl border border-stone-200 bg-stone-50/50 text-sm text-stone-900 placeholder:text-stone-400 focus:bg-white focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category Pills & Availability Toggle */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all select-none cursor-pointer ${
                selectedCategory === "all"
                  ? "bg-orange-600 text-white shadow-sm shadow-orange-600/20"
                  : "bg-stone-100 hover:bg-stone-200 text-stone-600 hover:text-stone-900"
              }`}
            >
              Semua Menu ({initialProducts.length})
            </button>

            {categories.map((cat) => {
              const count = initialProducts.filter((p) => p.categoryId === cat.id).length;
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all select-none cursor-pointer ${
                    isSelected
                      ? "bg-orange-600 text-white shadow-sm shadow-orange-600/20"
                      : "bg-stone-100 hover:bg-stone-200 text-stone-600 hover:text-stone-900"
                  }`}
                >
                  {cat.name} ({count})
                </button>
              );
            })}
          </div>

          {/* Toggle for Available Only */}
          <label className="flex items-center gap-2 cursor-pointer self-start sm:self-auto select-none">
            <input
              type="checkbox"
              checked={onlyAvailable}
              onChange={(e) => setOnlyAvailable(e.target.checked)}
              className="w-4 h-4 text-orange-600 rounded border-stone-300 focus:ring-orange-500 cursor-pointer"
            />
            <span className="text-xs sm:text-sm font-medium text-stone-700">
              Hanya yang Tersedia
            </span>
          </label>
        </div>
      </div>

      {/* Results Header Info */}
      <div className="flex items-center justify-between text-xs sm:text-sm text-stone-500 px-1">
        <span>Menampilkan {filteredProducts.length} pilihan menu</span>
        {(searchQuery || selectedCategory !== "all" || onlyAvailable) && (
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("all");
              setOnlyAvailable(false);
            }}
            className="text-orange-600 hover:text-orange-700 font-semibold text-xs"
          >
            Reset Filter
          </button>
        )}
      </div>

      {/* Product Grid */}
      <ProductGrid
        products={filteredProducts}
        categories={categories}
        emptyMessage="Menu Tidak Ditemukan"
        emptyDescription="Coba ubah kata kunci pencarian atau pilih kategori menu lainnya."
      />
    </div>
  );
};
