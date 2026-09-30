"use client";

import React from "react";
import { Star, MessageSquareQuote } from "lucide-react";
import { Testimonial } from "@/types";

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
}

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({
  testimonials,
}) => {
  const activeTestimonials = testimonials.filter((t) => t.isActive);

  if (activeTestimonials.length === 0) return null;

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-white border-t border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-600 bg-orange-50 border border-orange-200/70 px-3 py-1 rounded-full uppercase tracking-wider mb-2">
            <MessageSquareQuote className="w-3.5 h-3.5" />
            <span>Kata Pelanggan Kami</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-stone-900 tracking-tight">
            Cerita Rasa Dari Pelanggan
          </h2>
          <p className="text-sm sm:text-base text-stone-500 mt-1">
            Kepuasan rasa dan kehangatan masakan kami dinikmati oleh berbagai kalangan setiap harinya.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {activeTestimonials.map((item) => (
            <div
              key={item.id}
              className="flex flex-col justify-between p-6 rounded-3xl bg-stone-50 border border-stone-200/80 hover:border-orange-200 transition-all hover:shadow-md"
            >
              <div>
                {/* Star rating */}
                <div className="flex items-center gap-1 text-amber-500 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < item.rating
                          ? "fill-amber-400 text-amber-400"
                          : "text-stone-300"
                      }`}
                    />
                  ))}
                </div>

                {/* Message */}
                <p className="text-sm text-stone-700 leading-relaxed italic">
                  &ldquo;{item.message}&rdquo;
                </p>
              </div>

              {/* Author */}
              <div className="mt-6 pt-4 border-t border-stone-200/60 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-orange-200 text-orange-800 font-bold text-sm flex items-center justify-center">
                  {item.name.charAt(0)}
                </div>
                <div>
                  <span className="block text-sm font-bold text-stone-900">
                    {item.name}
                  </span>
                  <span className="text-[11px] text-stone-400">Pelanggan Setia</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
