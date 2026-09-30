"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Tag, ArrowRight } from "lucide-react";
import { Promo } from "@/types";
import { Button } from "@/components/ui/Button";

interface PromoBannerProps {
  promos: Promo[];
}

export const PromoBanner: React.FC<PromoBannerProps> = ({ promos }) => {
  const activePromos = promos.filter((p) => p.isActive);

  if (activePromos.length === 0) return null;

  const currentPromo = activePromos[0];

  return (
    <section className="py-8 sm:py-12 bg-white border-y border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-orange-600 to-amber-600 text-white shadow-xl">
          {/* Background image overlay */}
          <div className="absolute inset-0 opacity-20 mix-blend-overlay">
            <Image
              src={currentPromo.imageUrl}
              alt={currentPromo.title}
              fill
              className="object-cover"
            />
          </div>

          <div className="relative z-10 p-6 sm:p-10 lg:p-12 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-3 max-w-xl text-center md:text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-white text-xs font-bold uppercase tracking-wider">
                <Tag className="w-3.5 h-3.5" />
                <span>Promo Menarik</span>
              </div>
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
                {currentPromo.title}
              </h3>
              <p className="text-white/90 text-sm sm:text-base leading-relaxed">
                {currentPromo.description}
              </p>
            </div>

            <div className="shrink-0">
              <Link href="/menu">
                <Button
                  size="lg"
                  className="bg-white hover:bg-stone-100 text-orange-700 font-bold shadow-lg"
                >
                  <span>Pesan Sekarang</span>
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
