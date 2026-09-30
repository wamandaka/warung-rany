"use client";

import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Star,
  Loader2,
} from "lucide-react";
import {
  getTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} from "@/services/testimonials";
import { Testimonial } from "@/types";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { toast } from "@/components/ui/Toast";

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  // Form modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Testimonial | null>(null);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState<number>(5);
  const [isActive, setIsActive] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Deletion
  const [itemToDelete, setItemToDelete] = useState<Testimonial | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadData = async () => {
    try {
      const data = await getTestimonials();
      setTestimonials(data);
    } catch {
      toast.error("Gagal memuat testimonial");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenCreate = () => {
    setEditingItem(null);
    setName("");
    setMessage("");
    setRating(5);
    setIsActive(true);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (t: Testimonial) => {
    setEditingItem(t);
    setName(t.name);
    setMessage(t.message);
    setRating(t.rating);
    setIsActive(t.isActive);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) {
      toast.error("Nama pelanggan dan pesan testimonial wajib diisi");
      return;
    }

    setIsSaving(true);
    try {
      if (editingItem) {
        await updateTestimonial(editingItem.id, {
          name,
          message,
          rating,
          isActive,
        });
        toast.success("Testimonial berhasil diperbarui");
      } else {
        await createTestimonial({
          name,
          message,
          rating,
          isActive,
        });
        toast.success("Testimonial baru berhasil ditambahkan");
      }
      setIsModalOpen(false);
      loadData();
    } catch {
      toast.error("Gagal menyimpan testimonial");
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleActive = async (t: Testimonial) => {
    try {
      const newStatus = !t.isActive;
      await updateTestimonial(t.id, { isActive: newStatus });
      setTestimonials((prev) =>
        prev.map((item) =>
          item.id === t.id ? { ...item, isActive: newStatus } : item
        )
      );
      toast.success(
        `Testimonial ${newStatus ? "ditampilkan" : "disembunyikan"}`
      );
    } catch {
      toast.error("Gagal mengubah status testimonial");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;
    setIsDeleting(true);
    try {
      await deleteTestimonial(itemToDelete.id);
      setTestimonials((prev) => prev.filter((i) => i.id !== itemToDelete.id));
      toast.success("Testimonial berhasil dihapus");
      setItemToDelete(null);
    } catch {
      toast.error("Gagal menghapus testimonial");
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
            Kelola Testimonial Pelanggan
          </h1>
          <p className="text-sm text-stone-500 mt-1">
            Ulasan dan rating dari pelanggan setia untuk meningkatkan kepercayaan calon pembeli.
          </p>
        </div>

        <Button variant="primary" onClick={handleOpenCreate} className="shadow-md">
          <Plus className="w-4 h-4 mr-1.5" />
          <span>Tambah Testimonial</span>
        </Button>
      </div>

      {/* Testimonials List */}
      {loading ? (
        <div className="p-12 flex justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-orange-600" />
        </div>
      ) : testimonials.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-3xl border border-stone-200">
          <p className="text-stone-600 font-semibold mb-3">
            Belum ada ulasan yang ditambahkan
          </p>
          <Button variant="outline" size="sm" onClick={handleOpenCreate}>
            + Tambah Testimonial Pertama
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="bg-white rounded-3xl p-6 border border-stone-200 flex flex-col justify-between shadow-xs hover:shadow-md transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  {/* Rating stars */}
                  <div className="flex items-center gap-1 text-amber-500">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < t.rating
                            ? "fill-amber-400 text-amber-400"
                            : "text-stone-200"
                        }`}
                      />
                    ))}
                  </div>

                  <button
                    onClick={() => handleToggleActive(t)}
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                      t.isActive
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-stone-100 text-stone-500 border-stone-300"
                    }`}
                  >
                    {t.isActive ? "Tayang" : "Disembunyikan"}
                  </button>
                </div>

                <p className="text-sm text-stone-700 italic leading-relaxed">
                  &ldquo;{t.message}&rdquo;
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between">
                <div>
                  <span className="font-bold text-stone-900 text-sm block">
                    {t.name}
                  </span>
                  <span className="text-xs text-stone-400">Pelanggan</span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(t)}
                    className="p-1.5 rounded-lg text-stone-500 hover:text-orange-600 hover:bg-stone-100 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setItemToDelete(t)}
                    className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? "Edit Testimonial" : "Tambah Testimonial Baru"}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <Input
            label="Nama Pelanggan *"
            placeholder="Contoh: Ibu Rahmawati"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1.5">
              Rating Bintang
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="p-1 hover:scale-110 transition-transform"
                >
                  <Star
                    className={`w-6 h-6 ${
                      star <= rating
                        ? "fill-amber-400 text-amber-400"
                        : "text-stone-300"
                    }`}
                  />
                </button>
              ))}
              <span className="text-xs font-semibold text-stone-600 ml-2">
                ({rating} dari 5 bintang)
              </span>
            </div>
          </div>

          <Textarea
            label="Pesan / Ulasan Pelanggan *"
            placeholder="Tulis ulasan tentang rasa makanan, pelayanan, atau pengantaran..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
          />

          <label className="flex items-center gap-2.5 pt-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="w-4 h-4 text-orange-600 rounded border-stone-300 focus:ring-orange-500"
            />
            <span className="text-sm font-medium text-stone-800">
              Tayangkan di Bagian Testimonial Website
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

      {/* Delete confirm */}
      <ConfirmDialog
        isOpen={Boolean(itemToDelete)}
        onClose={() => setItemToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Hapus Testimonial?"
        message={`Apakah Anda yakin ingin menghapus testimonial dari "${itemToDelete?.name}"?`}
        confirmLabel="Ya, Hapus"
        isLoading={isDeleting}
      />
    </div>
  );
}
