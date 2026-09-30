"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Clock,
  Store,
  MessageSquare,
  Sparkles,
  Save,
  Loader2,
  Upload,
} from "lucide-react";
import {
  getBusinessSettings,
  updateBusinessSettings,
  getOpeningHours,
  updateOpeningHours,
} from "@/services/settings";
import { uploadImage } from "@/services/storage";
import { BusinessSettings, OpeningHoursData, DayOfWeek } from "@/types";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { toast } from "@/components/ui/Toast";
import { useBusiness } from "@/context/BusinessContext";

export default function AdminSettingsPage() {
  const { refreshSettings } = useBusiness();
  const [activeTab, setActiveTab] = useState<"info" | "hero" | "hours">("info");
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Settings State
  const [settings, setSettings] = useState<BusinessSettings | null>(null);
  const [hours, setHours] = useState<OpeningHoursData | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const [s, h] = await Promise.all([
          getBusinessSettings(),
          getOpeningHours(),
        ]);
        setSettings(s);
        setHours(h);
      } catch {
        toast.error("Gagal memuat pengaturan");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleHeroImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file || !settings) return;
    setIsUploading(true);
    try {
      const url = await uploadImage(file, "hero");
      setSettings({ ...settings, heroImageUrl: url });
      toast.success("Foto hero berhasil diunggah");
    } catch (err: unknown) {
      toast.error((err as Error).message || "Gagal mengunggah foto");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveAll = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings || !hours) return;

    setIsSaving(true);
    try {
      await Promise.all([
        updateBusinessSettings(settings),
        updateOpeningHours(hours),
      ]);
      await refreshSettings();
      toast.success("Pengaturan toko berhasil disimpan!");
    } catch {
      toast.error("Gagal menyimpan perubahan");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDayChange = (
    dayKey: DayOfWeek,
    field: "isOpen" | "openTime" | "closeTime",
    value: boolean | string
  ) => {
    if (!hours) return;
    setHours({
      ...hours,
      [dayKey]: {
        ...hours[dayKey],
        [field]: value,
      },
    });
  };

  if (loading || !settings || !hours) {
    return (
      <div className="p-12 flex justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-orange-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            Pengaturan Warung & Layanan
          </h1>
          <p className="text-sm text-stone-500 mt-1">
            Ubah identitas usaha, nomor WhatsApp pemesanan, dan jadwal jam operasional.
          </p>
        </div>

        <Button
          type="button"
          variant="primary"
          onClick={handleSaveAll}
          isLoading={isSaving}
          className="shadow-md"
        >
          <Save className="w-4 h-4 mr-1.5" />
          <span>Simpan Perubahan</span>
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab("info")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
            activeTab === "info"
              ? "bg-orange-600 text-white shadow-sm"
              : "text-stone-600 hover:bg-stone-100"
          }`}
        >
          <Store className="w-4 h-4" />
          <span>Informasi & WhatsApp</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("hero")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
            activeTab === "hero"
              ? "bg-orange-600 text-white shadow-sm"
              : "text-stone-600 hover:bg-stone-100"
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Tampilan Beranda</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("hours")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
            activeTab === "hours"
              ? "bg-orange-600 text-white shadow-sm"
              : "text-stone-600 hover:bg-stone-100"
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Jam Operasional</span>
        </button>
      </div>

      {/* Tab 1: Info & WhatsApp */}
      {activeTab === "info" && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-6">
            <h2 className="text-lg font-bold text-stone-900 pb-3 border-b border-stone-100 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-emerald-600" />
              Kontak WhatsApp Pemesanan (Paling Utama)
            </h2>

            <div className="space-y-4">
              <Input
                label="Nomor WhatsApp Penjual *"
                placeholder="Contoh: 081234567890"
                value={settings.whatsappNumber}
                onChange={(e) =>
                  setSettings({ ...settings, whatsappNumber: e.target.value })
                }
                helperText="Nomor ini akan otomatis dinormalisasi menjadi format internasional (62...)"
              />

              <Input
                label="Salam Pembuka Pesan WhatsApp *"
                placeholder="Halo Kak, saya mau pesan:"
                value={settings.defaultGreeting}
                onChange={(e) =>
                  setSettings({ ...settings, defaultGreeting: e.target.value })
                }
                helperText="Baris pertama yang akan muncul otomatis saat WhatsApp terbuka"
              />
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-6">
            <h2 className="text-lg font-bold text-stone-900 pb-3 border-b border-stone-100">
              Identitas Usaha
            </h2>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Nama Usaha *"
                  placeholder="Contoh: Warung Rany"
                  value={settings.businessName}
                  onChange={(e) =>
                    setSettings({ ...settings, businessName: e.target.value })
                  }
                />
                <Input
                  label="Slogan / Tagline *"
                  placeholder="Contoh: Masakan Rumahan, Rasa yang Bikin Pulang"
                  value={settings.tagline}
                  onChange={(e) =>
                    setSettings({ ...settings, tagline: e.target.value })
                  }
                />
              </div>

              <Textarea
                label="Deskripsi Singkat Usaha *"
                placeholder="Jelaskan kualitas masakan, bahan segar, dan kebersihan..."
                value={settings.description}
                onChange={(e) =>
                  setSettings({ ...settings, description: e.target.value })
                }
                rows={3}
              />

              <Input
                label="Alamat Lengkap Toko / Lokasi Pengambilan *"
                placeholder="Jl. Mawar No. 12, Tebet, Jakarta Selatan"
                value={settings.address}
                onChange={(e) =>
                  setSettings({ ...settings, address: e.target.value })
                }
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Tautan Google Maps (Opsional)"
                  placeholder="https://maps.google.com/..."
                  value={settings.googleMapsUrl}
                  onChange={(e) =>
                    setSettings({ ...settings, googleMapsUrl: e.target.value })
                  }
                />
                <Input
                  label="Tautan Instagram (Opsional)"
                  placeholder="https://instagram.com/..."
                  value={settings.instagramUrl}
                  onChange={(e) =>
                    setSettings({ ...settings, instagramUrl: e.target.value })
                  }
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Hero */}
      {activeTab === "hero" && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-6">
          <h2 className="text-lg font-bold text-stone-900 pb-3 border-b border-stone-100">
            Tampilan Hero Beranda
          </h2>

          <div className="space-y-4">
            <Input
              label="Judul Utama Hero *"
              placeholder="Masakan Rumahan, Rasa yang Bikin Pulang."
              value={settings.heroTitle}
              onChange={(e) =>
                setSettings({ ...settings, heroTitle: e.target.value })
              }
            />

            <Textarea
              label="Subjudul Hero *"
              placeholder="Fresh dibuat setiap hari dengan rasa yang familiar dan nyaman..."
              value={settings.heroSubtitle}
              onChange={(e) =>
                setSettings({ ...settings, heroSubtitle: e.target.value })
              }
              rows={3}
            />

            <Input
              label="Teks Tombol Aksi Utama (CTA) *"
              placeholder="Lihat Menu Hari Ini"
              value={settings.ctaText}
              onChange={(e) =>
                setSettings({ ...settings, ctaText: e.target.value })
              }
            />

            {/* Hero Image */}
            <div className="space-y-2 pt-2">
              <label className="block text-sm font-medium text-stone-700">
                Foto Utama Beranda *
              </label>
              <div className="relative aspect-video max-w-lg rounded-2xl overflow-hidden bg-stone-100 border border-stone-200">
                {settings.heroImageUrl && (
                  <Image
                    src={settings.heroImageUrl}
                    alt="Hero preview"
                    fill
                    className="object-cover"
                  />
                )}
              </div>

              <div className="flex gap-2 items-center max-w-lg pt-1">
                <label className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-stone-300 text-xs font-semibold text-stone-700 hover:bg-stone-50 cursor-pointer shrink-0">
                  <Upload className="w-3.5 h-3.5" />
                  <span>{isUploading ? "Mengunggah..." : "Unggah Foto"}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleHeroImageUpload}
                    className="hidden"
                  />
                </label>
                <Input
                  placeholder="Atau tautan URL foto..."
                  value={settings.heroImageUrl}
                  onChange={(e) =>
                    setSettings({ ...settings, heroImageUrl: e.target.value })
                  }
                  className="flex-1"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Hours */}
      {activeTab === "hours" && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-6">
          <div>
            <h2 className="text-lg font-bold text-stone-900 pb-1">
              Jadwal Jam Buka Harian
            </h2>
            <p className="text-xs text-stone-500">
              Atur waktu buka dan tutup untuk setiap hari dalam seminggu.
            </p>
          </div>

          <div className="divide-y divide-stone-100">
            {(
              [
                "monday",
                "tuesday",
                "wednesday",
                "thursday",
                "friday",
                "saturday",
                "sunday",
              ] as DayOfWeek[]
            ).map((dayKey) => {
              const schedule = hours[dayKey];

              return (
                <div
                  key={dayKey}
                  className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id={`day-${dayKey}`}
                      checked={schedule.isOpen}
                      onChange={(e) =>
                        handleDayChange(dayKey, "isOpen", e.target.checked)
                      }
                      className="w-4 h-4 text-orange-600 rounded border-stone-300 focus:ring-orange-500"
                    />
                    <label
                      htmlFor={`day-${dayKey}`}
                      className="font-bold text-sm text-stone-900 cursor-pointer min-w-17.5"
                    >
                      {schedule.dayName}
                    </label>
                    <span
                      className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                        schedule.isOpen
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-stone-100 text-stone-400"
                      }`}
                    >
                      {schedule.isOpen ? "Buka" : "Tutup"}
                    </span>
                  </div>

                  {schedule.isOpen ? (
                    <div className="flex items-center gap-2 pl-7 sm:pl-0">
                      <input
                        type="time"
                        value={schedule.openTime}
                        onChange={(e) =>
                          handleDayChange(dayKey, "openTime", e.target.value)
                        }
                        className="px-3 py-1.5 rounded-lg border border-stone-300 text-xs text-stone-800 focus:outline-none focus:border-orange-500"
                      />
                      <span className="text-xs text-stone-400">s/d</span>
                      <input
                        type="time"
                        value={schedule.closeTime}
                        onChange={(e) =>
                          handleDayChange(dayKey, "closeTime", e.target.value)
                        }
                        className="px-3 py-1.5 rounded-lg border border-stone-300 text-xs text-stone-800 focus:outline-none focus:border-orange-500"
                      />
                      <span className="text-xs text-stone-400">WIB</span>
                    </div>
                  ) : (
                    <span className="text-xs text-stone-400 pl-7 sm:pl-0 italic">
                      Libur / Tidak beroperasi
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Bottom Save Action */}
      <div className="flex justify-end pt-4">
        <Button
          type="button"
          variant="primary"
          size="lg"
          onClick={handleSaveAll}
          isLoading={isSaving}
          className="shadow-lg"
        >
          <Save className="w-5 h-5 mr-2" />
          <span>Simpan Semua Pengaturan</span>
        </Button>
      </div>
    </div>
  );
}
