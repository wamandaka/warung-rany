"use client";

import React from "react";
import { Clock, CheckCircle2, XCircle } from "lucide-react";
import { useBusiness } from "@/context/BusinessContext";
import { getCurrentDayKey } from "@/lib/utils";

export const OpeningHoursSection: React.FC = () => {
  const { openingHours, storeStatus } = useBusiness();
  const currentDayKey = getCurrentDayKey();

  if (!openingHours) return null;

  return (
    <section id="jam-buka" className="py-12 sm:py-16 bg-stone-50 border-t border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-600 bg-orange-50 border border-orange-200/70 px-3 py-1 rounded-full uppercase tracking-wider mb-2">
            <Clock className="w-3.5 h-3.5" />
            <span>Jadwal Operasional</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            Jam Buka & Layanan
          </h2>
          <p className="text-sm sm:text-base text-stone-500 mt-1">
            Kami buka setiap hari memasak makanan hangat untuk makan siang dan malam Anda.
          </p>

          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-stone-200 shadow-2xs text-xs sm:text-sm font-semibold">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                storeStatus.isOpen ? "bg-emerald-500 animate-pulse" : "bg-stone-400"
              }`}
            />
            <span className="text-stone-800">Status Saat Ini: {storeStatus.message}</span>
          </div>
        </div>

        {/* Schedule Grid */}
        <div className="max-w-2xl mx-auto bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-sm divide-y divide-stone-100">
          {Object.entries(openingHours).map(([key, day]) => {
            const isToday = key === currentDayKey;
            return (
              <div
                key={key}
                className={`py-3.5 px-4 flex items-center justify-between rounded-xl transition-colors ${
                  isToday
                    ? "bg-orange-50/80 border border-orange-200/60 font-semibold"
                    : "hover:bg-stone-50"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {day.isOpen ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <XCircle className="w-4 h-4 text-stone-400" />
                  )}
                  <span className={isToday ? "text-orange-950 font-bold" : "text-stone-700"}>
                    {day.dayName}
                  </span>
                  {isToday && (
                    <span className="text-[10px] uppercase font-bold tracking-wider bg-orange-600 text-white px-2 py-0.5 rounded-full">
                      Hari Ini
                    </span>
                  )}
                </div>

                <div className="text-sm">
                  {day.isOpen ? (
                    <span className={isToday ? "text-orange-900 font-bold" : "text-stone-600"}>
                      {day.openTime} – {day.closeTime} WIB
                    </span>
                  ) : (
                    <span className="text-stone-400 font-medium">Tutup</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
