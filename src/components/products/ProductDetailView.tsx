"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ShoppingBag,
  Plus,
  Minus,
  Sparkles,
  ShieldCheck,
  Check,
} from "lucide-react";
import { Product, Category } from "@/types";
import { formatRupiah } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { useBusiness } from "@/context/BusinessContext";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { toast } from "@/components/ui/Toast";

interface ProductDetailViewProps {
  product: Product;
  category?: Category;
}

export const ProductDetailView: React.FC<ProductDetailViewProps> = ({
  product,
  category,
}) => {
  const { addToCart, items, openCart } = useCart();
  const { settings } = useBusiness();
  const [quantity, setQuantity] = useState<number>(1);
  const [isAdded, setIsAdded] = useState<boolean>(false);

  const isOutOfStock = !product.isAvailable || product.stock === 0;

  // Max allowed stock
  const maxStock = product.stock;

  // Current item in cart count
  const cartItem = items.find((i) => i.productId === product.id);
  const qtyInCart = cartItem ? cartItem.quantity : 0;

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleIncrease = () => {
    if (maxStock !== null && quantity + qtyInCart >= maxStock) {
      toast.error(`Stok ${product.name} hanya tersedia ${maxStock} porsi.`);
      return;
    }
    setQuantity((prev) => prev + 1);
  };

  const handleAddToCart = () => {
    if (isOutOfStock) {
      toast.error("Produk ini sedang tidak tersedia.");
      return;
    }

    const result = addToCart(product, quantity);
    if (result.success) {
      setIsAdded(true);
      toast.success(result.message || `${quantity} ${product.name} ditambahkan`);
      setTimeout(() => setIsAdded(false), 800);
    } else {
      toast.error(result.message || "Gagal menambahkan produk.");
    }
  };

  const handleBuyNowAndOpenCart = () => {
    if (isOutOfStock) return;
    const result = addToCart(product, quantity);
    if (result.success) {
      openCart();
    } else {
      toast.error(result.message || "Stok tidak mencukupi.");
    }
  };

  return (
    <div className="py-8 sm:py-12 bg-stone-50 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <div className="mb-6">
          <Link
            href="/menu"
            className="inline-flex items-center gap-2 text-sm font-semibold text-stone-600 hover:text-orange-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Menu</span>
          </Link>
        </div>

        {/* Product Card Container */}
        <div className="bg-white rounded-3xl border border-stone-200/90 shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 p-6 sm:p-8 lg:p-10">
            {/* Image Col */}
            <div className="space-y-4">
              <div className="relative aspect-4/3 sm:aspect-square rounded-2xl overflow-hidden bg-stone-100 border border-stone-200 shadow-xs">
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
                  {product.isTodayMenu && (
                    <span className="inline-flex items-center gap-1 bg-orange-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                      <Sparkles className="w-3.5 h-3.5" />
                      Menu Hari Ini
                    </span>
                  )}
                  {category && (
                    <span className="bg-stone-900/80 backdrop-blur-xs text-white text-xs font-medium px-2.5 py-0.5 rounded-lg">
                      {category.name}
                    </span>
                  )}
                </div>

                {isOutOfStock && (
                  <div className="absolute inset-0 bg-stone-950/40 backdrop-blur-xs flex items-center justify-center">
                    <span className="bg-white text-stone-800 text-sm font-bold px-4 py-2 rounded-xl shadow-lg">
                      Menu Sedang Habis
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Content Col */}
            <div className="flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <div className="text-xs font-bold uppercase tracking-wider text-orange-600">
                    {category ? category.name : "Hidangan"}
                  </div>
                  <div>
                    {isOutOfStock ? (
                      <Badge variant="danger" className="text-xs font-bold px-3 py-1">
                        Habis
                      </Badge>
                    ) : product.stock !== null ? (
                      <Badge variant="warning" className="text-xs font-bold px-3 py-1">
                        Sisa {product.stock} Porsi
                      </Badge>
                    ) : (
                      <Badge variant="success" className="text-xs font-bold px-3 py-1">
                        Tersedia
                      </Badge>
                    )}
                  </div>
                </div>

                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-stone-900 tracking-tight leading-tight">
                  {product.name}
                </h1>

                <div className="text-2xl sm:text-3xl font-extrabold text-orange-600">
                  {formatRupiah(product.price)}
                </div>

                <div className="prose prose-stone text-sm sm:text-base text-stone-600 leading-relaxed border-t border-stone-100 pt-4">
                  <p>{product.description}</p>
                </div>
              </div>

              {/* Quantity selector and Add-to-cart */}
              <div className="space-y-4 pt-4 border-t border-stone-200">
                {!isOutOfStock ? (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-stone-700">
                        Jumlah Porsi
                      </span>
                      <div className="flex items-center gap-3 bg-stone-100 border border-stone-200 rounded-xl p-1 shadow-2xs">
                        <button
                          onClick={handleDecrease}
                          disabled={quantity <= 1}
                          className="w-8 h-8 rounded-lg bg-white text-stone-700 hover:text-orange-600 flex items-center justify-center disabled:opacity-40 transition-colors shadow-2xs"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center font-bold text-stone-900 text-sm">
                          {quantity}
                        </span>
                        <button
                          onClick={handleIncrease}
                          disabled={
                            maxStock !== null && quantity + qtyInCart >= maxStock
                          }
                          className="w-8 h-8 rounded-lg bg-white text-stone-700 hover:text-orange-600 flex items-center justify-center disabled:opacity-40 transition-colors shadow-2xs"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      <Button
                        variant="outline"
                        size="lg"
                        onClick={handleAddToCart}
                        className="w-full justify-center"
                      >
                        {isAdded ? (
                          <>
                            <Check className="w-5 h-5 text-emerald-600 mr-2" />
                            <span>Tersimpan!</span>
                          </>
                        ) : (
                          <>
                            <ShoppingBag className="w-5 h-5 mr-2" />
                            <span>+ Keranjang ({quantity})</span>
                          </>
                        )}
                      </Button>

                      <Button
                        variant="primary"
                        size="lg"
                        onClick={handleBuyNowAndOpenCart}
                        className="w-full justify-center"
                      >
                        Pesan Sekarang
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="p-4 bg-stone-100 rounded-2xl text-center text-sm font-semibold text-stone-500 border border-stone-200">
                    Menu ini sementara sedang habis atau belum dimasak hari ini.
                  </div>
                )}

                {/* Helpful reassurance */}
                <div className="p-3 bg-orange-50/60 rounded-xl border border-orange-100 text-xs text-stone-600 flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
                  <span>
                    Pemesanan diteruskan langsung ke WhatsApp {settings.businessName || "Warung Rany"} untuk konfirmasi ketersediaan dan detail pengantaran.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
