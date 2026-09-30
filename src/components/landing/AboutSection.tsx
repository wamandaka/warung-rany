"use client";

import React from "react";
import Image from "next/image";
import { Heart, ChefHat } from "lucide-react";
import { useBusiness } from "@/context/BusinessContext";

export const AboutSection: React.FC = () => {
  const { settings } = useBusiness();

  const title =
    settings.aboutTitle ||
    "Menghadirkan Kehangatan Masakan Rumah di Setiap Suapan";
  const story1 =
    settings.aboutStory ||
    `${settings.businessName || "Warung Rany"} berawal dari kecintaan memasak hidangan khas nusantara yang sering dinikmati bersama keluarga tercinta. Kami percaya bahwa masakan yang lezat bermula dari bahan yang segar, diolah dengan cinta, dan bumbu rempah pilihan yang melimpah.`;
  const story2 =
    settings.aboutStory2 ||
    "Setiap menu kami masak di pagi hari untuk memastikan kesegaran saat sampai di meja makan Anda. Tanpa pengawet dan selalu mengutamakan kebersihan serta kehalalan produk.";
  const imageUrl =
    settings.aboutImageUrl ||
    "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80";
  const badgeTitle = settings.aboutBadgeTitle || "Resep Asli Keluarga";
  const badgeSubtitle =
    settings.aboutBadgeSubtitle || "Bumbu rempah alami tanpa pengawet";

  return (
    <section id="tentang" className="py-16 sm:py-20 lg:py-28 bg-stone-50 border-t border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Images collage */}
          <div className="relative">
            <div className="relative aspect-4/3 rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-stone-100">
              <Image
                src={imageUrl}
                alt={badgeTitle}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            {/* Small floating badge */}
            <div className="absolute -bottom-5 right-2 sm:bottom-6 sm:-right-6 bg-white p-3.5 sm:p-5 rounded-2xl shadow-xl border border-stone-200/80 flex items-center gap-3 max-w-[calc(100%-1rem)] sm:max-w-xs">
              <div className="w-12 h-12 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                <ChefHat className="w-6 h-6" />
              </div>
              <div>
                <span className="block text-sm font-bold text-stone-900">
                  {badgeTitle}
                </span>
                <span className="text-xs text-stone-500">
                  {badgeSubtitle}
                </span>
              </div>
            </div>
          </div>

          {/* Text Story */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-600 bg-orange-50 border border-orange-200/70 px-3 py-1 rounded-full uppercase tracking-wider">
              <Heart className="w-3.5 h-3.5 fill-orange-600" />
              <span>Cerita Kami</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-stone-900 tracking-tight leading-snug">
              {title}
            </h2>

            <p className="text-stone-600 text-base leading-relaxed whitespace-pre-line">
              {story1}
            </p>

            {story2 && (
              <p className="text-stone-600 text-base leading-relaxed whitespace-pre-line">
                {story2}
              </p>
            )}

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-stone-200/60">
              <div className="space-y-1">
                <span className="text-2xl font-extrabold text-orange-600">Fresh</span>
                <p className="text-xs text-stone-500">Dimasak langsung tiap hari</p>
              </div>
              <div className="space-y-1">
                <span className="text-2xl font-extrabold text-orange-600">Mudah</span>
                <p className="text-xs text-stone-500">Pesan tanpa registrasi ribet</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
