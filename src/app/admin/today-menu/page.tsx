"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Sparkles, Check, Loader2, ArrowRight } from "lucide-react";
import { getProducts, toggleTodayMenu } from "@/services/products";
import { Product } from "@/types";
import { formatRupiah } from "@/lib/utils";
import { toast } from "@/components/ui/Toast";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function AdminTodayMenuPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const loadData = async () => {
    try {
      const data = await getProducts();
      setProducts(data);
    } catch {
      toast.error("Gagal memuat produk");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleToggle = async (product: Product) => {
    const nextStatus = !product.isTodayMenu;
    setUpdatingId(product.id);
    try {
      await toggleTodayMenu(product.id, nextStatus);
      setProducts((prev) =>
        prev.map((p) =>
          p.id === product.id ? { ...p, isTodayMenu: nextStatus } : p
        )
      );
      toast.success(
        nextStatus
          ? `${product.name} dimasukkan ke Menu Hari Ini`
          : `${product.name} dikeluarkan dari Menu Hari Ini`
      );
    } catch {
      toast.error("Gagal memperbarui status menu");
    } finally {
      setUpdatingId(null);
    }
  };

  const selectedCount = products.filter((p) => p.isTodayMenu).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-600 bg-orange-50 border border-orange-200/70 px-3 py-1 rounded-full uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Sorotan Beranda</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            Kelola Menu Hari Ini
          </h1>
          <p className="text-sm text-stone-500 mt-1">
            Centang hidangan yang siap disajikan hari ini. Pilihan langsung tampil di beranda depan untuk memudahkan pelanggan memesan.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs sm:text-sm font-bold text-orange-600 bg-orange-50 px-3.5 py-2 rounded-xl border border-orange-200">
            {selectedCount} Menu Dipilih
          </span>
          <Link href="/" target="_blank">
            <Button variant="outline" size="sm">
              Lihat di Beranda
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Grid of checklist cards */}
      {loading ? (
        <div className="p-12 flex justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-orange-600" />
        </div>
      ) : products.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-3xl border border-stone-200">
          <p className="text-stone-600 font-semibold mb-3">
            Belum ada produk terdaftar
          </p>
          <Link href="/admin/products/new">
            <Button variant="primary" size="sm">
              + Tambah Produk Baru
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => {
            const isSelected = product.isTodayMenu;
            const isUpdating = updatingId === product.id;

            return (
              <div
                key={product.id}
                onClick={() => !isUpdating && handleToggle(product)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer select-none flex items-center justify-between gap-4 ${
                  isSelected
                    ? "bg-orange-50/70 border-orange-300 shadow-sm"
                    : "bg-white border-stone-200 hover:border-stone-300"
                }`}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  {/* Thumbnail */}
                  <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-stone-100 shrink-0 border border-stone-200">
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      fill
                      className="object-cover"
                      sizes="56px"
                    />
                  </div>

                  <div className="min-w-0">
                    <h4 className="font-bold text-sm text-stone-900 truncate">
                      {product.name}
                    </h4>
                    <span className="text-xs font-semibold text-orange-600 block">
                      {formatRupiah(product.price)}
                    </span>
                    <span className="text-[11px] text-stone-400 block truncate">
                      {product.stock === null
                        ? "Stok tak terbatas"
                        : product.stock === 0
                        ? "Habis"
                        : `Stok sisa: ${product.stock}`}
                    </span>
                  </div>
                </div>

                {/* Checkbox button */}
                <div
                  className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 border transition-all ${
                    isSelected
                      ? "bg-orange-600 border-orange-600 text-white"
                      : "bg-white border-stone-300 text-transparent hover:border-orange-400"
                  }`}
                >
                  {isUpdating ? (
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                  ) : (
                    <Check className="w-4 h-4 stroke-3" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
