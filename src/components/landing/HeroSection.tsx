"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles, ShieldCheck, HeartHandshake, Flame } from "lucide-react";
import { useBusiness } from "@/context/BusinessContext";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/Button";

export const HeroSection: React.FC = () => {
  const { settings, storeStatus } = useBusiness();
  const { openCart } = useCart();

  return (
    <section className="relative overflow-hidden pt-8 pb-16 sm:pt-12 sm:pb-24 lg:pt-16 lg:pb-32 bg-linear-to-b from-orange-50/50 via-stone-50 to-stone-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8 text-center lg:text-left">
            {/* Status & Badge */}
            <div className="inline-flex flex-wrap items-center justify-center lg:justify-start gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-bold border border-orange-200">
                <Sparkles className="w-3.5 h-3.5 text-orange-600" />
                <span>Masakan Fresh Setiap Hari</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-stone-700 text-xs font-medium border border-stone-200 shadow-2xs">
                <span
                  className={`w-2 h-2 rounded-full ${
                    storeStatus.isOpen ? "bg-emerald-500 animate-pulse" : "bg-stone-400"
                  }`}
                />
                <span>{storeStatus.message}</span>
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-stone-900 tracking-tight leading-[1.15]">
              {settings.heroTitle || "Masakan Rumahan, Rasa yang Bikin Pulang."}
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg lg:text-xl text-stone-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              {settings.heroSubtitle ||
                "Fresh dibuat setiap hari dengan rasa yang familiar dan nyaman. Pesan praktis langsung lewat WhatsApp."}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
              <Link href="/menu" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto shadow-md">
                  <span>{settings.ctaText || "Lihat Menu Hari Ini"}</span>
                  <ArrowRight className="w-5 h-5 ml-1" />
                </Button>
              </Link>
              <button
                onClick={openCart}
                className="w-full sm:w-auto px-6 h-13 rounded-xl border border-stone-300 hover:border-orange-500 hover:bg-white text-stone-700 font-semibold text-base transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                Pesan Cepat via WhatsApp
              </button>
            </div>

            {/* Trust points */}
            <div className="pt-4 border-t border-stone-200/80 grid grid-cols-3 gap-2 sm:gap-4 text-center lg:text-left max-w-lg mx-auto lg:mx-0">
              <div className="flex flex-col sm:flex-row items-center gap-2">
                <div className="p-2 rounded-xl bg-orange-100/80 text-orange-700">
                  <Flame className="w-4 h-4" />
                </div>
                <div>
                  <span className="block text-xs font-bold text-stone-900">Hangat & Baru</span>
                  <span className="text-[11px] text-stone-500">Dimasak tiap pagi</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-2">
                <div className="p-2 rounded-xl bg-emerald-100/80 text-emerald-700">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <span className="block text-xs font-bold text-stone-900">100% Halal</span>
                  <span className="text-[11px] text-stone-500">Bahan pilihan</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-2">
                <div className="p-2 rounded-xl bg-amber-100/80 text-amber-700">
                  <HeartHandshake className="w-4 h-4" />
                </div>
                <div>
                  <span className="block text-xs font-bold text-stone-900">Pesan Mudah</span>
                  <span className="text-[11px] text-stone-500">Langsung WhatsApp</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Image Column */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Background decorative blob */}
              <div className="absolute -inset-4 bg-linear-to-tr from-orange-400 to-amber-200 rounded-3xl blur-2xl opacity-25 -z-10 transform -rotate-3" />

              {/* Main Food Photo Frame */}
              <div className="relative aspect-4/3 sm:aspect-square rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-stone-100">
                <Image
                  src={
                    settings.heroImageUrl ||
                    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1200&q=80"
                  }
                  alt={settings.businessName || "Warung Rany Food"}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-t from-stone-950/60 via-transparent to-transparent" />

                {/* Floating pill badge on food photo */}
                <div className="absolute bottom-4 left-4 right-4 p-3 rounded-2xl bg-white/95 backdrop-blur-md border border-white/40 shadow-lg flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-orange-600 text-white flex items-center justify-center font-bold text-sm">
                      🍛
                    </div>
                    <div>
                      <span className="block text-xs font-bold text-stone-900">
                        {settings.businessName || "Warung Rany"}
                      </span>
                      <span className="text-[11px] text-stone-500">
                        Pilihan keluarga nomor 1
                      </span>
                    </div>
                  </div>
                  <Link
                    href="/menu"
                    className="text-xs font-bold text-orange-600 hover:text-orange-700"
                  >
                    Buka Menu →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
