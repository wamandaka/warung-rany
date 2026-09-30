"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Plus,
  Edit,
  Trash2,
  Loader2,
  Upload,
} from "lucide-react";
import {
  getPromos,
  createPromo,
  updatePromo,
  deletePromo,
} from "@/services/promos";
import { uploadImage } from "@/services/storage";
import { Promo } from "@/types";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { toast } from "@/components/ui/Toast";

export default function AdminPromosPage() {
  const [promos, setPromos] = useState<Promo[]>([]);
  const [loading, setLoading] = useState(true);

  // Form modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPromo, setEditingPromo] = useState<Promo | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Delete
  const [promoToDelete, setPromoToDelete] = useState<Promo | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadData = async () => {
    try {
      const data = await getPromos();
      setPromos(data);
    } catch {
      toast.error("Gagal memuat daftar promo");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenCreate = () => {
    setEditingPromo(null);
    setTitle("");
    setDescription("");
    setImageUrl(
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80"
    );
    setIsActive(true);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p: Promo) => {
    setEditingPromo(p);
    setTitle(p.title);
    setDescription(p.description);
    setImageUrl(p.imageUrl);
    setIsActive(p.isActive);
    setIsModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const url = await uploadImage(file, "promos");
      setImageUrl(url);
      toast.success("Foto banner berhasil diunggah");
    } catch (err: unknown) {
      toast.error((err as Error).message || "Gagal mengunggah foto");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !imageUrl.trim()) {
      toast.error("Mohon lengkapi judul, deskripsi, dan foto banner promo");
      return;
    }

    setIsSaving(true);
    try {
      if (editingPromo) {
        await updatePromo(editingPromo.id, {
          title,
          description,
          imageUrl,
          isActive,
        });
        toast.success("Promo berhasil diperbarui");
      } else {
        await createPromo({
          title,
          description,
          imageUrl,
          isActive,
          startDate: null,
          endDate: null,
        });
        toast.success("Promo baru berhasil ditambahkan");
      }
      setIsModalOpen(false);
      loadData();
    } catch {
      toast.error("Gagal menyimpan promo");
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleActive = async (p: Promo) => {
    try {
      const newStatus = !p.isActive;
      await updatePromo(p.id, { isActive: newStatus });
      setPromos((prev) =>
        prev.map((item) => (item.id === p.id ? { ...item, isActive: newStatus } : item))
      );
      toast.success(`Promo ${newStatus ? "diaktifkan" : "dinonaktifkan"}`);
    } catch {
      toast.error("Gagal memperbarui status promo");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!promoToDelete) return;
    setIsDeleting(true);
    try {
      await deletePromo(promoToDelete.id);
      setPromos((prev) => prev.filter((item) => item.id !== promoToDelete.id));
      toast.success("Promo berhasil dihapus");
      setPromoToDelete(null);
    } catch {
      toast.error("Gagal menghapus promo");
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
            Kelola Promo & Banner
          </h1>
          <p className="text-sm text-stone-500 mt-1">
            Tampilkan penawaran spesial atau paket hemat makan siang di beranda depan.
          </p>
        </div>

        <Button variant="primary" onClick={handleOpenCreate} className="shadow-md">
          <Plus className="w-4 h-4 mr-1.5" />
          <span>Tambah Promo Baru</span>
        </Button>
      </div>

      {/* Promos Grid */}
      {loading ? (
        <div className="p-12 flex justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-orange-600" />
        </div>
      ) : promos.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-3xl border border-stone-200">
          <p className="text-stone-600 font-semibold mb-3">Belum ada promo aktif</p>
          <Button variant="outline" size="sm" onClick={handleOpenCreate}>
            + Tambah Promo Pertama
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {promos.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-video w-full bg-stone-100">
                  <Image
                    src={p.imageUrl}
                    alt={p.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-3 right-3">
                    <button
                      onClick={() => handleToggleActive(p)}
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border backdrop-blur-xs ${
                        p.isActive
                          ? "bg-emerald-500/90 text-white border-emerald-400"
                          : "bg-stone-900/80 text-stone-300 border-stone-700"
                      }`}
                    >
                      {p.isActive ? "Aktif" : "Nonaktif"}
                    </button>
                  </div>
                </div>

                <div className="p-6 space-y-2">
                  <h3 className="font-bold text-lg text-stone-900">{p.title}</h3>
                  <p className="text-sm text-stone-600 leading-relaxed">
                    {p.description}
                  </p>
                </div>
              </div>

              <div className="p-4 px-6 border-t border-stone-100 flex items-center justify-end gap-2 bg-stone-50/50">
                <button
                  onClick={() => handleOpenEdit(p)}
                  className="p-2 rounded-xl text-stone-600 hover:text-orange-600 hover:bg-white transition-colors"
                  title="Edit Promo"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setPromoToDelete(p)}
                  className="p-2 rounded-xl text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  title="Hapus Promo"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal create / edit */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingPromo ? "Edit Promo" : "Tambah Promo Baru"}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <Input
            label="Judul Promo *"
            placeholder="Contoh: Paket Hemat Makan Siang"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <Textarea
            label="Deskripsi Promo *"
            placeholder="Jelaskan penawaran atau syarat singkat..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />

          <div className="space-y-2">
            <label className="block text-sm font-medium text-stone-700">
              Foto Banner Promo *
            </label>
            <div className="relative aspect-video rounded-xl overflow-hidden bg-stone-100 border border-stone-200">
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt="Banner preview"
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="text-stone-400 text-xs flex items-center justify-center h-full">
                  Pratinjau Foto
                </div>
              )}
            </div>

            <div className="flex gap-2 items-center pt-1">
              <label className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-stone-300 text-xs font-semibold text-stone-700 hover:bg-stone-50 cursor-pointer">
                <Upload className="w-3.5 h-3.5" />
                <span>{isUploading ? "Mengunggah..." : "Unggah Gambar"}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
              <Input
                placeholder="Atau tautan URL..."
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="flex-1"
              />
            </div>
          </div>

          <label className="flex items-center gap-2.5 pt-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="w-4 h-4 text-orange-600 rounded border-stone-300 focus:ring-orange-500"
            />
            <span className="text-sm font-medium text-stone-800">
              Promo Aktif & Ditampilkan di Beranda
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

      {/* Delete confirmation */}
      <ConfirmDialog
        isOpen={Boolean(promoToDelete)}
        onClose={() => setPromoToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Hapus Promo?"
        message={`Apakah Anda yakin ingin menghapus promo "${promoToDelete?.title}"?`}
        confirmLabel="Ya, Hapus"
        isLoading={isDeleting}
      />
    </div>
  );
}
