"use client";

import React from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { MessageSquare, ArrowRight } from "lucide-react";
import { CartItem } from "@/types";
import { formatRupiah } from "@/lib/utils";

interface WhatsAppConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmWhatsApp: () => void;
  items: CartItem[];
  totalPrice: number;
  customerName: string;
  customerNote?: string;
}

export const WhatsAppConfirmationModal: React.FC<
  WhatsAppConfirmationModalProps
> = ({
  isOpen,
  onClose,
  onConfirmWhatsApp,
  items,
  totalPrice,
  customerName,
  customerNote,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Konfirmasi Pesanan"
      description="Pesanan Anda akan diteruskan ke WhatsApp pemilik untuk dicek ketersediaannya."
      maxWidth="md"
    >
      <div className="space-y-4 pt-1">
        {/* Order items preview card */}
        <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200/80 space-y-3">
          <div className="text-xs font-bold text-stone-500 uppercase tracking-wider">
            Ringkasan Item
          </div>
          <div className="divide-y divide-stone-200/60 max-h-48 overflow-y-auto pr-1">
            {items.map((item) => (
              <div
                key={item.productId}
                className="py-2 flex items-center justify-between text-sm"
              >
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-stone-800">
                    {item.name}
                  </span>
                  <span className="text-stone-500 text-xs">
                    × {item.quantity}
                  </span>
                </div>
                <span className="font-medium text-stone-900">
                  {formatRupiah(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-stone-200 flex justify-between items-center">
            <span className="font-bold text-stone-900">Total Perkiraan</span>
            <span className="text-base font-extrabold text-orange-600">
              {formatRupiah(totalPrice)}
            </span>
          </div>
        </div>

        {/* Customer details preview */}
        <div className="bg-white rounded-xl p-3 border border-stone-200/80 text-xs space-y-1.5 text-stone-600">
          <div>
            <span className="font-semibold text-stone-700">Nama Pemesan:</span>{" "}
            {customerName}
          </div>
          {customerNote && (
            <div>
              <span className="font-semibold text-stone-700">Catatan:</span>{" "}
              {customerNote}
            </div>
          )}
        </div>

        {/* Clarification Notice (Requirement 17 & 42) */}
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 leading-relaxed">
          <span className="font-semibold block mb-0.5">Catatan Penting:</span>
          Sistem ini tidak memotong stok otomatis ataupun memproses pembayaran.
          Ketersediaan makanan, ongkir, serta pembayaran akan dikonfirmasi
          langsung oleh penjual melalui WhatsApp.
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Kembali
          </Button>
          <Button
            type="button"
            variant="whatsapp"
            onClick={onConfirmWhatsApp}
            className="gap-2"
          >
            <MessageSquare className="w-4 h-4 fill-white" />
            <span>Buka WhatsApp</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Modal>
  );
};
