"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  CheckCircle2,
  AlertTriangle,
  Tags,
  Sparkles,
  Plus,
  MessageSquare,
  ArrowRight,
} from "lucide-react";
import { getProducts } from "@/services/products";
import { getCategories } from "@/services/categories";
import { Product, Category } from "@/types";
import { Button } from "@/components/ui/Button";

export default function AdminDashboardPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [prodList, catList] = await Promise.all([
          getProducts(),
          getCategories(),
        ]);
        setProducts(prodList);
        setCategories(catList);
      } catch (e) {
        console.error("Failed to load dashboard data", e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Compute metrics per Requirement 20
  const totalProducts = products.length;
  const availableProducts = products.filter(
    (p) => p.isAvailable && p.stock !== 0
  ).length;
  const soldOutProducts = products.filter(
    (p) => !p.isAvailable || p.stock === 0
  ).length;
  const totalCategories = categories.length;
  const todayMenuCount = products.filter((p) => p.isTodayMenu).length;

  return (
    <div className="space-y-8">
      {/* Top Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            Ringkasan Usaha
          </h1>
          <p className="text-sm text-stone-500 mt-1">
            Pantau status ketersediaan menu dan kelola informasi warung Anda.
          </p>
        </div>

        {/* Quick action button */}
        <Link href="/admin/products/new">
          <Button variant="primary" className="shadow-md">
            <Plus className="w-4 h-4 mr-1.5" />
            <span>Tambah Produk Baru</span>
          </Button>
        </Link>
      </div>

      {/* Metrics Cards Grid (Requirement 20) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-5">
        {/* Total Products */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200/90 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-xs font-semibold">Total Produk</span>
            <div className="p-2 rounded-xl bg-stone-100 text-stone-700">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-stone-900">
            {loading ? "..." : totalProducts}
          </div>
          <span className="text-[11px] text-stone-400 block">
            Semua menu terdaftar
          </span>
        </div>

        {/* Available Products */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200/90 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-emerald-600">
            <span className="text-xs font-semibold text-stone-500">Produk Siap</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600">
            {loading ? "..." : availableProducts}
          </div>
          <span className="text-[11px] text-stone-400 block">
            Dapat dipesan pelanggan
          </span>
        </div>

        {/* Sold Out Products */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200/90 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-rose-600">
            <span className="text-xs font-semibold text-stone-500">Produk Habis</span>
            <div className="p-2 rounded-xl bg-rose-50 text-rose-600">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-rose-600">
            {loading ? "..." : soldOutProducts}
          </div>
          <span className="text-[11px] text-stone-400 block">
            Stok 0 atau dinonaktifkan
          </span>
        </div>

        {/* Today's Menu Count */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200/90 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-orange-600">
            <span className="text-xs font-semibold text-stone-500">Menu Hari Ini</span>
            <div className="p-2 rounded-xl bg-orange-50 text-orange-600">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-orange-600">
            {loading ? "..." : todayMenuCount}
          </div>
          <span className="text-[11px] text-stone-400 block">
            Tayang di beranda utama
          </span>
        </div>

        {/* Total Categories */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200/90 shadow-2xs space-y-2 col-span-2 sm:col-span-1 lg:col-span-1">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-xs font-semibold">Total Kategori</span>
            <div className="p-2 rounded-xl bg-stone-100 text-stone-700">
              <Tags className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-stone-900">
            {loading ? "..." : totalCategories}
          </div>
          <span className="text-[11px] text-stone-400 block">
            Kategori aktif di menu
          </span>
        </div>
      </div>

      {/* Quick Actions (Requirement 20) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-xs space-y-6">
        <div>
          <h2 className="text-lg font-bold text-stone-900">Aksi Cepat</h2>
          <p className="text-xs text-stone-500">
            Tindakan yang paling sering dilakukan dalam pengelolaan harian warung.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            href="/admin/products/new"
            className="flex items-center justify-between p-4 rounded-2xl border border-stone-200 hover:border-orange-500 hover:bg-orange-50/50 transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Plus className="w-5 h-5" />
              </div>
              <div>
                <span className="block font-bold text-sm text-stone-900 group-hover:text-orange-600 transition-colors">
                  + Tambah Produk
                </span>
                <span className="text-xs text-stone-500">
                  Buat menu makanan baru
                </span>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-stone-400 group-hover:translate-x-1 group-hover:text-orange-600 transition-all" />
          </Link>

          <Link
            href="/admin/today-menu"
            className="flex items-center justify-between p-4 rounded-2xl border border-stone-200 hover:border-orange-500 hover:bg-orange-50/50 transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <span className="block font-bold text-sm text-stone-900 group-hover:text-orange-600 transition-colors">
                  Kelola Menu Hari Ini
                </span>
                <span className="text-xs text-stone-500">
                  Tentukan hidangan spesial
                </span>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-stone-400 group-hover:translate-x-1 group-hover:text-orange-600 transition-all" />
          </Link>

          <Link
            href="/admin/settings"
            className="flex items-center justify-between p-4 rounded-2xl border border-stone-200 hover:border-orange-500 hover:bg-orange-50/50 transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <span className="block font-bold text-sm text-stone-900 group-hover:text-orange-600 transition-colors">
                  Pengaturan WhatsApp
                </span>
                <span className="text-xs text-stone-500">
                  Ubah nomor & jam buka
                </span>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-stone-400 group-hover:translate-x-1 group-hover:text-orange-600 transition-all" />
          </Link>
        </div>
      </div>
    </div>
  );
}
