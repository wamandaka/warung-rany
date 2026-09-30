"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { UtensilsCrossed, MapPin, Clock, MessageSquare, ExternalLink, Heart } from "lucide-react";
import { useBusiness } from "@/context/BusinessContext";
import { normalizeWhatsAppNumber } from "@/lib/whatsapp";

export const Footer: React.FC = () => {
  const pathname = usePathname();
  const { settings, openingHours, storeStatus } = useBusiness();

  if (pathname.startsWith("/admin")) {
    return null;
  }

  const normalizedPhone = normalizeWhatsAppNumber(settings.whatsappNumber);
  const waDirectUrl = `https://wa.me/${normalizedPhone}?text=${encodeURIComponent(
    "Halo " + (settings.businessName || "Warung Rany") + ", saya ingin bertanya tentang menu makanan."
  )}`;

  return (
    <footer className="bg-stone-900 text-stone-300 pt-16 pb-24 sm:pb-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 pb-12 border-b border-stone-800">
          {/* Col 1: Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-orange-600 text-white flex items-center justify-center shadow-lg shadow-orange-600/30">
                <UtensilsCrossed className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-xl text-white tracking-tight">
                  {settings.businessName || "Warung Rany"}
                </span>
                <p className="text-xs text-stone-400">
                  {settings.tagline || "Masakan Rumahan, Rasa yang Bikin Pulang"}
                </p>
              </div>
            </div>
            <p className="text-sm text-stone-400 leading-relaxed">
              {settings.description ||
                "Menyajikan masakan rumahan segar setiap hari dengan bahan-bahan pilihan berkualitas, higienis, dan tanpa bahan pengawet."}
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-stone-800 border border-stone-700 text-xs">
              <span
                className={`w-2 h-2 rounded-full ${
                  storeStatus.isOpen ? "bg-emerald-400 animate-pulse" : "bg-stone-500"
                }`}
              />
              <span className="text-stone-300 font-medium">
                {storeStatus.isOpen ? "Warung Sedang Buka" : "Warung Sedang Tutup"}
              </span>
            </div>
          </div>

          {/* Col 2: Jam Operasional */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-orange-500" />
              Jam Operasional
            </h4>
            <div className="text-sm text-stone-400 space-y-2">
              {openingHours &&
                Object.entries(openingHours).map(([key, day]) => (
                  <div key={key} className="flex justify-between items-center text-xs sm:text-sm">
                    <span className="text-stone-300">{day.dayName}</span>
                    <span className={day.isOpen ? "text-stone-400" : "text-rose-400"}>
                      {day.isOpen ? `${day.openTime} - ${day.closeTime}` : "Tutup"}
                    </span>
                  </div>
                ))}
            </div>
          </div>

          {/* Col 3: Lokasi & Kontak */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <MapPin className="w-4 h-4 text-orange-500" />
              Lokasi & Alamat
            </h4>
            <p className="text-sm text-stone-400 leading-relaxed">
              {settings.address || "Jl. Mawar No. 12, Tebet, Jakarta Selatan"}
            </p>
            {settings.googleMapsUrl && (
              <a
                href={settings.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-orange-400 hover:text-orange-300 font-medium"
              >
                <span>Buka di Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>

          {/* Col 4: Hubungi Kami */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-orange-500" />
              Hubungi Kami
            </h4>
            <p className="text-xs text-stone-400 leading-relaxed">
              Mau tanya porsi katering atau ketersediaan lauk khusus? Chat langsung ke WhatsApp pemilik.
            </p>
            <a
              href={waDirectUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-sm font-semibold transition-all shadow-md shadow-emerald-900/30"
            >
              <MessageSquare className="w-4 h-4" />
              Chat WhatsApp Langsung
            </a>
            {settings.instagramUrl && (
              <a
                href={settings.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs text-stone-400 hover:text-white transition-colors"
              >
                <svg
                  className="w-4 h-4 text-pink-400 fill-current"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
                <span>Instagram: @{settings.businessName?.toLowerCase().replace(/\s+/g, "") || "warungrany"}</span>
              </a>
            )}
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p>© {new Date().getFullYear()} {settings.businessName || "Warung Rany"}. Seluruh hak cipta dilindungi.</p>
          <p className="flex items-center gap-1 text-stone-500">
            Dibuat dengan <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> untuk hidangan rumahan terbaik
          </p>
        </div>
      </div>
    </footer>
  );
};
