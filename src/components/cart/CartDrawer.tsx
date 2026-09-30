"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  X,
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  MessageSquare,
  ArrowRight,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useBusiness } from "@/context/BusinessContext";
import { formatRupiah } from "@/lib/utils";
import { generateWhatsAppUrl } from "@/lib/whatsapp";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { toast } from "@/components/ui/Toast";
import { WhatsAppConfirmationModal } from "./WhatsAppConfirmationModal";
import { getProducts } from "@/services/products";

export const CartDrawer: React.FC = () => {
  const {
    items,
    isCartOpen,
    closeCart,
    openCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    totalPrice,
    totalItems,
    customerName,
    setCustomerName,
    customerNote,
    setCustomerNote,
    validateCartItems,
  } = useCart();

  const { settings } = useBusiness();
  const [nameError, setNameError] = useState<string>("");
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [isValidating, setIsValidating] = useState<boolean>(false);

  if (!isCartOpen && totalItems === 0) {
    return null;
  }

  const handleCheckoutClick = async () => {
    // 1. Validate customer name
    if (!customerName.trim() || customerName.trim().length < 2) {
      setNameError("Silakan isi nama Anda (minimal 2 huruf)");
      return;
    }
    setNameError("");

    // 2. Validate cart items against live data
    setIsValidating(true);
    try {
      const liveProducts = await getProducts();
      const validation = validateCartItems(liveProducts);

      if (!validation.isValid) {
        toast.error(
          validation.message ||
            "Ada perubahan ketersediaan produk pada menu. Silakan sesuaikan keranjang."
        );
        return;
      }

      // Valid: open confirmation preview modal
      setShowConfirmModal(true);
    } catch {
      setShowConfirmModal(true);
    } finally {
      setIsValidating(false);
    }
  };

  const handleProceedToWhatsApp = () => {
    const waUrl = generateWhatsAppUrl(settings.whatsappNumber, {
      items,
      customerName,
      customerNote,
      greeting: settings.defaultGreeting || "Halo Kak, saya mau pesan:",
    });

    setShowConfirmModal(false);
    closeCart();

    // Open WhatsApp in new tab/window
    window.open(waUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <>
      {/* Floating Sticky Cart Button on Mobile when items > 0 and drawer is closed */}
      {!isCartOpen && totalItems > 0 && (
        <div className="fixed bottom-4 left-4 right-4 z-40 sm:hidden animate-in slide-in-from-bottom-5">
          <button
            onClick={openCart}
            aria-label="Lihat Keranjang Pesanan"
            className="w-full flex items-center justify-between bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3.5 px-5 rounded-2xl shadow-xl shadow-orange-950/30 active:scale-[0.98] transition-all"
          >
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <ShoppingBag className="w-5 h-5" />
                <span className="absolute -top-2 -right-2 bg-stone-900 text-white text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              </div>
              <span>Lihat Pesanan</span>
            </div>
            <div className="flex items-center gap-1.5 font-bold">
              <span>{formatRupiah(totalPrice)}</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </button>
        </div>
      )}

      {/* Slide-over Drawer Backdrop & Content */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs transition-opacity animate-in fade-in"
            onClick={closeCart}
            aria-hidden="true"
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-4 sm:pl-10">
            <aside
              aria-label="Keranjang Belanja"
              className="w-screen max-w-md bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300"
            >
              {/* Drawer Header */}
              <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="font-bold text-base sm:text-lg text-stone-900 leading-tight">
                      Keranjang Pesanan
                    </h2>
                    <p className="text-xs text-stone-500">
                      {totalItems} item dipilih
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  {items.length > 0 && (
                    <button
                      onClick={clearCart}
                      aria-label="Kosongkan keranjang"
                      className="text-xs text-stone-400 hover:text-rose-600 px-2 py-1 rounded-lg transition-colors"
                      title="Kosongkan keranjang"
                    >
                      Kosongkan
                    </button>
                  )}
                  <button
                    onClick={closeCart}
                    aria-label="Tutup keranjang"
                    className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Items List or Empty State */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
                {items.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center py-12">
                    <div className="w-16 h-16 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mb-4">
                      <ShoppingBag className="w-8 h-8" />
                    </div>
                    <h3 className="font-bold text-stone-800 text-base mb-1">
                      Keranjang Masih Kosong
                    </h3>
                    <p className="text-xs text-stone-500 max-w-xs mb-6">
                      Pilih hidangan lezat favorit Anda dari menu untuk mulai memesan via WhatsApp.
                    </p>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={closeCart}
                    >
                      Pilih Menu Sekarang
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {items.map((item) => (
                      <div
                        key={item.productId}
                        className="flex gap-3 p-3 bg-stone-50 rounded-2xl border border-stone-200/80 items-center justify-between"
                      >
                        {/* Thumbnail */}
                        <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-stone-200 shrink-0">
                          <Image
                            src={item.imageUrl}
                            alt={item.name}
                            fill
                            className="object-cover"
                            sizes="64px"
                          />
                        </div>

                        {/* Details */}
                        <div className="flex-1 min-w-0 pr-2">
                          <h4 className="font-bold text-sm text-stone-900 truncate">
                            {item.name}
                          </h4>
                          <span className="text-xs font-semibold text-orange-600 block mt-0.5">
                            {formatRupiah(item.price)}
                          </span>

                          {/* Max stock indicator */}
                          {item.maxStock !== null && (
                            <span className="text-[11px] text-amber-700 block mt-0.5">
                              Tersedia: {item.maxStock} porsi
                            </span>
                          )}
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex flex-col items-end gap-2">
                          <div className="flex items-center gap-1.5 bg-white border border-stone-200 rounded-lg p-0.5 shadow-2xs">
                            <button
                              onClick={() => {
                                updateQuantity(item.productId, item.quantity - 1);
                              }}
                              aria-label={`Kurangi ${item.name}`}
                              className="p-1 rounded text-stone-600 hover:text-orange-600 hover:bg-stone-100 transition-colors"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="w-6 text-center text-xs font-bold text-stone-800">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => {
                                const res = updateQuantity(item.productId, item.quantity + 1);
                                if (!res.success && res.message) {
                                  toast.error(res.message);
                                }
                              }}
                              aria-label={`Tambah ${item.name}`}
                              className="p-1 rounded text-stone-600 hover:text-orange-600 hover:bg-stone-100 transition-colors"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <button
                            onClick={() => removeFromCart(item.productId)}
                            aria-label={`Hapus ${item.name} dari keranjang`}
                            className="text-stone-400 hover:text-rose-600 transition-colors p-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}

                    {/* Customer Info Form */}
                    <div className="mt-6 pt-4 border-t border-stone-200 space-y-3">
                      <div className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                        Informasi Pemesan
                      </div>
                      <Input
                        label="Nama Anda *"
                        placeholder="Contoh: Budi Santoso"
                        value={customerName}
                        onChange={(e) => {
                          setCustomerName(e.target.value);
                          if (nameError) setNameError("");
                        }}
                        error={nameError}
                      />
                      <Textarea
                        label="Catatan Pesanan (Opsional)"
                        placeholder="Contoh: Tidak terlalu pedas, kuah dipisah, dsb."
                        value={customerNote}
                        onChange={(e) => setCustomerNote(e.target.value)}
                        rows={2}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Drawer Footer with Checkout */}
              {items.length > 0 && (
                <div className="p-4 sm:p-5 border-t border-stone-200 bg-stone-50/80 space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-stone-500 font-medium">Subtotal Pesanan</span>
                    <span className="text-stone-900 font-bold text-lg">
                      {formatRupiah(totalPrice)}
                    </span>
                  </div>

                  <p className="text-[11px] text-stone-500 leading-normal">
                    * Pesanan akan dipersiapkan via WhatsApp. Penjual akan memeriksa ketersediaan menu dan mengonfirmasi pembayaran.
                  </p>

                  <Button
                    variant="whatsapp"
                    size="lg"
                    className="w-full justify-center shadow-lg"
                    isLoading={isValidating}
                    onClick={handleCheckoutClick}
                  >
                    <MessageSquare className="w-5 h-5 fill-white mr-2" />
                    Pesan via WhatsApp
                  </Button>
                </div>
              )}
            </aside>
          </div>
        </div>
      )}

      {/* Pre-WhatsApp Confirmation Modal */}
      <WhatsAppConfirmationModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirmWhatsApp={handleProceedToWhatsApp}
        items={items}
        totalPrice={totalPrice}
        customerName={customerName}
        customerNote={customerNote}
      />
    </>
  );
};
