import { Metadata } from "next";
import { getProducts } from "@/services/products";
import { getActiveCategories } from "@/services/categories";
import { MenuExplorer } from "@/components/products/MenuExplorer";
import { Utensils } from "lucide-react";

export const metadata: Metadata = {
  title: "Daftar Menu Makanan & Minuman",
  description:
    "Jelajahi aneka menu masakan rumahan lezat, lauk pauk, camilan renyah, dan minuman segar buatan Warung Rany. Pesan mudah via WhatsApp.",
};

export const revalidate = 60;

export default async function MenuPage() {
  const [products, categories] = await Promise.all([
    getProducts(),
    getActiveCategories(),
  ]);

  return (
    <div className="py-8 sm:py-12 lg:py-16 bg-stone-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-600 bg-orange-50 border border-orange-200/70 px-3 py-1 rounded-full uppercase tracking-wider">
            <Utensils className="w-3.5 h-3.5" />
            <span>Pilihan Masakan</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-stone-900 tracking-tight">
            Menu Makanan & Minuman
          </h1>
          <p className="text-sm sm:text-base text-stone-500">
            Pilih masakan favorit Anda, masukkan ke keranjang belanja, dan langsung kirim pesanan Anda ke WhatsApp kami.
          </p>
        </div>

        {/* Menu Explorer with search & category filters */}
        <MenuExplorer initialProducts={products} categories={categories} />
      </div>
    </div>
  );
}
