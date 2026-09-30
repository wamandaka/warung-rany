"use client";

import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit,
  Trash2,
  CheckCircle2,
  XCircle,
  Loader2,
} from "lucide-react";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/services/categories";
import { Category } from "@/types";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { toast } from "@/components/ui/Toast";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal create/edit state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [catName, setCatName] = useState("");
  const [catSortOrder, setCatSortOrder] = useState<number>(0);
  const [catIsActive, setCatIsActive] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState(false);

  // Deletion state
  const [catToDelete, setCatToDelete] = useState<Category | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch {
      toast.error("Gagal memuat kategori");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleOpenCreate = () => {
    setEditingCategory(null);
    setCatName("");
    setCatSortOrder(categories.length + 1);
    setCatIsActive(true);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (c: Category) => {
    setEditingCategory(c);
    setCatName(c.name);
    setCatSortOrder(c.sortOrder);
    setCatIsActive(c.isActive);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName.trim() || catName.trim().length < 2) {
      toast.error("Nama kategori minimal 2 huruf");
      return;
    }

    setIsSaving(true);
    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, {
          name: catName,
          sortOrder: Number(catSortOrder) || 0,
          isActive: catIsActive,
        });
        toast.success("Kategori berhasil diperbarui");
      } else {
        await createCategory({
          name: catName,
          slug: "",
          sortOrder: Number(catSortOrder) || 0,
          isActive: catIsActive,
        });
        toast.success("Kategori baru berhasil dibuat");
      }
      setIsModalOpen(false);
      loadCategories();
    } catch {
      toast.error("Gagal menyimpan kategori");
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleActive = async (c: Category) => {
    try {
      const newStatus = !c.isActive;
      await updateCategory(c.id, { isActive: newStatus });
      setCategories((prev) =>
        prev.map((item) =>
          item.id === c.id ? { ...item, isActive: newStatus } : item
        )
      );
      toast.success(
        `Kategori ${c.name} ${newStatus ? "diaktifkan" : "dinonaktifkan"}`
      );
    } catch {
      toast.error("Gagal mengubah status kategori");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!catToDelete) return;
    setIsDeleting(true);
    try {
      await deleteCategory(catToDelete.id);
      setCategories((prev) => prev.filter((c) => c.id !== catToDelete.id));
      toast.success(`Kategori "${catToDelete.name}" berhasil dihapus`);
      setCatToDelete(null);
    } catch {
      toast.error("Gagal menghapus kategori");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            Kelola Kategori Menu
          </h1>
          <p className="text-sm text-stone-500 mt-1">
            Atur pengelompokan menu seperti Makanan, Lauk, Snack, dan Minuman.
          </p>
        </div>

        <Button variant="primary" onClick={handleOpenCreate} className="shadow-md">
          <Plus className="w-4 h-4 mr-1.5" />
          <span>Tambah Kategori</span>
        </Button>
      </div>

      {/* Categories Table */}
      <div className="bg-white rounded-3xl border border-stone-200/90 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-orange-600" />
            <span className="text-sm text-stone-500">Memuat kategori...</span>
          </div>
        ) : categories.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <p className="text-base font-bold text-stone-800">
              Belum ada kategori
            </p>
            <Button variant="outline" size="sm" onClick={handleOpenCreate}>
              + Tambah Kategori Pertama
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto scrollbar-none">
            <table className="w-full min-w-137.5 text-left text-sm text-stone-600">
              <thead className="bg-stone-50 text-xs uppercase font-bold text-stone-500 border-b border-stone-200">
                <tr>
                  <th className="py-3.5 px-6">Urutan</th>
                  <th className="py-3.5 px-6">Nama Kategori</th>
                  <th className="py-3.5 px-6">Slug URL</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {categories.map((c) => (
                  <tr key={c.id} className="hover:bg-stone-50/80 transition-colors">
                    <td className="py-3.5 px-6 font-semibold text-stone-400">
                      #{c.sortOrder}
                    </td>
                    <td className="py-3.5 px-6 font-bold text-stone-900">
                      {c.name}
                    </td>
                    <td className="py-3.5 px-6 font-mono text-xs text-stone-500">
                      {c.slug}
                    </td>
                    <td className="py-3.5 px-6">
                      <button
                        onClick={() => handleToggleActive(c)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border transition-all ${
                          c.isActive
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                            : "bg-stone-100 text-stone-500 border-stone-300 hover:bg-stone-200"
                        }`}
                      >
                        {c.isActive ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Aktif</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3.5 h-3.5 text-stone-400" />
                            <span>Nonaktif</span>
                          </>
                        )}
                      </button>
                    </td>
                    <td className="py-3.5 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(c)}
                          className="p-2 rounded-xl text-stone-500 hover:text-orange-600 hover:bg-orange-50 transition-colors"
                          title="Edit Kategori"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setCatToDelete(c)}
                          className="p-2 rounded-xl text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Hapus Kategori"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCategory ? "Edit Kategori" : "Tambah Kategori Baru"}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <Input
            label="Nama Kategori *"
            placeholder="Contoh: Makanan, Minuman, dsb."
            value={catName}
            onChange={(e) => setCatName(e.target.value)}
          />

          <Input
            label="Nomor Urutan Tampil"
            type="number"
            value={catSortOrder}
            onChange={(e) => setCatSortOrder(Number(e.target.value))}
            helperText="Angka lebih kecil akan muncul di urutan tab paling depan"
          />

          <label className="flex items-center gap-2.5 pt-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={catIsActive}
              onChange={(e) => setCatIsActive(e.target.checked)}
              className="w-4 h-4 text-orange-600 rounded border-stone-300 focus:ring-orange-500"
            />
            <span className="text-sm font-medium text-stone-800">
              Kategori Aktif & Ditampilkan di Menu
            </span>
          </label>

          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-stone-100">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsModalOpen(false)}
            >
              Batal
            </Button>
            <Button type="submit" variant="primary" isLoading={isSaving}>
              Simpan
            </Button>
          </div>
        </form>
      </Modal>

      {/* Deletion Dialog */}
      <ConfirmDialog
        isOpen={Boolean(catToDelete)}
        onClose={() => setCatToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Hapus Kategori?"
        message={`Apakah Anda yakin ingin menghapus kategori "${catToDelete?.name}"?`}
        confirmLabel="Ya, Hapus"
        isLoading={isDeleting}
      />
    </div>
  );
}
