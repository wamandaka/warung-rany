"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Sparkles,
  CheckCircle2,
  XCircle,
  Loader2,
} from "lucide-react";
import {
  getProducts,
  deleteProduct,
  toggleProductAvailability,
  toggleTodayMenu,
} from "@/services/products";
import { getCategories } from "@/services/categories";
import { Product, Category } from "@/types";
import { formatRupiah } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { toast } from "@/components/ui/Toast";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Deletion modal state
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadData = async () => {
    try {
      const [p, c] = await Promise.all([getProducts(), getCategories()]);
      setProducts(p);
      setCategories(c);
    } catch (e) {
      console.error(e);
      toast.error("Gagal memuat data produk");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleToggleAvailability = async (product: Product) => {
    try {
      const newStatus = !product.isAvailable;
      await toggleProductAvailability(product.id, newStatus);
      setProducts((prev) =>
        prev.map((p) => (p.id === product.id ? { ...p, isAvailable: newStatus } : p))
      );
      toast.success(
        `${product.name} sekarang ${newStatus ? "Tersedia" : "Tidak Tersedia"}`
      );
    } catch {
      toast.error("Gagal mengubah status ketersediaan.");
    }
  };

  const handleToggleTodayMenu = async (product: Product) => {
    try {
      const newStatus = !product.isTodayMenu;
      await toggleTodayMenu(product.id, newStatus);
      setProducts((prev) =>
        prev.map((p) => (p.id === product.id ? { ...p, isTodayMenu: newStatus } : p))
      );
      toast.success(
        newStatus
          ? `${product.name} ditambahkan ke Menu Hari Ini`
          : `${product.name} dihapus dari Menu Hari Ini`
      );
    } catch {
      toast.error("Gagal mengubah status Menu Hari Ini.");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!productToDelete) return;
    setIsDeleting(true);
    try {
      await deleteProduct(productToDelete.id);
      setProducts((prev) => prev.filter((p) => p.id !== productToDelete.id));
      toast.success(`Produk ${productToDelete.name} berhasil dihapus`);
      setProductToDelete(null);
    } catch {
      toast.error("Gagal menghapus produk");
    } finally {
      setIsDeleting(false);
    }
  };

  const categoryMap = new Map<string, string>();
  categories.forEach((c) => categoryMap.set(c.id, c.name));

  const filteredProducts = products.filter((p) => {
    if (categoryFilter !== "all" && p.categoryId !== categoryFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            Kelola Menu & Produk
          </h1>
          <p className="text-sm text-stone-500 mt-1">
            Tambah, perbarui harga, foto, stok, atau atur ketersediaan menu.
          </p>
        </div>

        <Link href="/admin/products/new">
          <Button variant="primary" className="shadow-md">
            <Plus className="w-4 h-4 mr-1.5" />
            <span>Tambah Produk Baru</span>
          </Button>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-stone-200/90 shadow-2xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama produk..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-stone-300 text-sm focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
          />
        </div>

        <div className="w-full sm:w-auto flex items-center gap-2">
          <span className="text-xs text-stone-500 whitespace-nowrap">Kategori:</span>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full sm:w-48 rounded-xl border border-stone-300 px-3 py-2 text-sm text-stone-700 focus:outline-none focus:border-orange-500"
          >
            <option value="all">Semua Kategori ({products.length})</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-3xl border border-stone-200/90 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-orange-600" />
            <span className="text-sm text-stone-500">Memuat daftar produk...</span>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <p className="text-base font-bold text-stone-800">
              Tidak ada produk yang sesuai
            </p>
            <p className="text-xs text-stone-500">
              Ubah filter pencarian atau tambahkan produk baru.
            </p>
            <Link href="/admin/products/new">
              <Button variant="outline" size="sm">
                + Tambah Produk Sekarang
              </Button>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto scrollbar-none">
            <table className="w-full min-w-[720px] text-left text-sm text-stone-600">
              <thead className="bg-stone-50 text-xs uppercase font-bold text-stone-500 border-b border-stone-200">
                <tr>
                  <th className="py-3.5 px-4">Menu</th>
                  <th className="py-3.5 px-4">Kategori</th>
                  <th className="py-3.5 px-4">Harga</th>
                  <th className="py-3.5 px-4">Stok</th>
                  <th className="py-3.5 px-4">Tersedia</th>
                  <th className="py-3.5 px-4">Menu Hari Ini</th>
                  <th className="py-3.5 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredProducts.map((product) => {
                  return (
                    <tr
                      key={product.id}
                      className="hover:bg-stone-50/80 transition-colors"
                    >
                      {/* Product Thumbnail & Name */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-stone-100 border border-stone-200 shrink-0">
                            <Image
                              src={product.imageUrl}
                              alt={product.name}
                              fill
                              className="object-cover"
                              sizes="48px"
                            />
                          </div>
                          <div>
                            <span className="font-bold text-stone-900 block line-clamp-1">
                              {product.name}
                            </span>
                            <span className="text-xs text-stone-400 line-clamp-1">
                              {product.description}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3 px-4">
                        <Badge variant="neutral">
                          {categoryMap.get(product.categoryId) || "Lainnya"}
                        </Badge>
                      </td>

                      {/* Price */}
                      <td className="py-3 px-4 font-bold text-stone-900">
                        {formatRupiah(product.price)}
                      </td>

                      {/* Stock info */}
                      <td className="py-3 px-4">
                        {product.stock === null ? (
                          <span className="text-xs font-medium text-stone-500">
                            Tak Terbatas
                          </span>
                        ) : product.stock === 0 ? (
                          <Badge variant="danger">Habis (0)</Badge>
                        ) : (
                          <Badge variant="warning">Sisa {product.stock}</Badge>
                        )}
                      </td>

                      {/* Availability toggle */}
                      <td className="py-3 px-4">
                        <button
                          type="button"
                          onClick={() => handleToggleAvailability(product)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border transition-all ${
                            product.isAvailable
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                              : "bg-stone-100 text-stone-500 border-stone-300 hover:bg-stone-200"
                          }`}
                        >
                          {product.isAvailable ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Tersedia</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3.5 h-3.5 text-stone-400" />
                              <span>Nonaktif</span>
                            </>
                          )}
                        </button>
                      </td>

                      {/* Today's Menu toggle */}
                      <td className="py-3 px-4">
                        <button
                          type="button"
                          onClick={() => handleToggleTodayMenu(product)}
                          className={`p-1.5 rounded-lg border transition-all ${
                            product.isTodayMenu
                              ? "bg-orange-50 text-orange-600 border-orange-200"
                              : "bg-white text-stone-300 border-stone-200 hover:text-stone-500"
                          }`}
                          title={
                            product.isTodayMenu
                              ? "Aktif di Menu Hari Ini (klik untuk lepas)"
                              : "Klik untuk aktifkan di Menu Hari Ini"
                          }
                        >
                          <Sparkles className="w-4 h-4" />
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/products/${product.id}`}
                            className="p-2 rounded-xl text-stone-500 hover:text-orange-600 hover:bg-orange-50 transition-colors"
                            title="Edit Produk"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => setProductToDelete(product)}
                            className="p-2 rounded-xl text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Hapus Produk"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Confirmation Dialog before Delete */}
      <ConfirmDialog
        isOpen={Boolean(productToDelete)}
        onClose={() => setProductToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Hapus Produk Menu?"
        message={`Apakah Anda yakin ingin menghapus "${productToDelete?.name}"? Tindakan ini tidak dapat dibatalkan.`}
        confirmLabel="Ya, Hapus"
        isLoading={isDeleting}
      />
    </div>
  );
}
