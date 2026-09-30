"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Plus, Check, Sparkles } from "lucide-react";
import { Product } from "@/types";
import { formatRupiah } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { toast } from "@/components/ui/Toast";
import { Badge } from "@/components/ui/Badge";

interface ProductCardProps {
  product: Product;
  categoryName?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  categoryName,
}) => {
  const { addToCart, items } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  // Check effective availability
  const isOutOfStock = !product.isAvailable || product.stock === 0;

  // Quantity already in cart
  const cartItem = items.find((i) => i.productId === product.id);
  const qtyInCart = cartItem ? cartItem.quantity : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isOutOfStock) {
      toast.error(`${product.name} sedang habis.`);
      return;
    }

    setIsAdding(true);
    const result = addToCart(product, 1);

    if (result.success) {
      toast.success(result.message || `${product.name} ditambahkan ke keranjang`);
    } else {
      toast.error(result.message || "Gagal menambahkan produk");
    }

    setTimeout(() => {
      setIsAdding(false);
    }, 400);
  };

  return (
    <div className="group relative flex flex-col bg-white rounded-2xl border border-stone-200/90 overflow-hidden shadow-xs hover:shadow-xl hover:border-orange-200 transition-all duration-300">
      {/* Product Image Area */}
      <Link
        href={`/product/${product.slug}`}
        className="relative aspect-4/3 w-full overflow-hidden bg-stone-100 block"
      >
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />

        {/* Badges Overlay */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-start justify-between pointer-events-none gap-1.5">
          <div className="flex flex-col gap-1 items-start">
            {product.isTodayMenu && (
              <span className="inline-flex items-center gap-1 bg-orange-600/95 text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm backdrop-blur-xs">
                <Sparkles className="w-3 h-3" />
                Menu Hari Ini
              </span>
            )}
            {categoryName && (
              <span className="bg-stone-900/80 text-white text-[10px] font-medium px-2 py-0.5 rounded-md backdrop-blur-xs">
                {categoryName}
              </span>
            )}
          </div>

          <div>
            {isOutOfStock ? (
              <Badge variant="danger" className="font-semibold shadow-xs">
                Habis
              </Badge>
            ) : product.stock !== null ? (
              <Badge variant="warning" className="font-semibold shadow-xs">
                Sisa {product.stock}
              </Badge>
            ) : null}
          </div>
        </div>

        {/* Out of stock overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-stone-950/40 backdrop-blur-[2px] flex items-center justify-center pointer-events-none">
            <span className="bg-white/95 text-stone-800 text-xs font-bold px-3 py-1.5 rounded-xl shadow-md border border-stone-200">
              Sedang Habis
            </span>
          </div>
        )}
      </Link>

      {/* Product Content */}
      <div className="flex flex-col flex-1 p-4 sm:p-5">
        <Link href={`/product/${product.slug}`} className="block group/title">
          <h3 className="font-bold text-base sm:text-lg text-stone-900 group-hover/title:text-orange-600 transition-colors line-clamp-1">
            {product.name}
          </h3>
          <p className="text-xs sm:text-sm text-stone-500 mt-1 line-clamp-2 leading-relaxed min-h-10">
            {product.description}
          </p>
        </Link>

        {/* Price & Action Button */}
        <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
          <div className="flex flex-col">
            <span className="text-[11px] text-stone-400 font-medium">Harga</span>
            <span className="text-base sm:text-lg font-bold text-orange-600">
              {formatRupiah(product.price)}
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            aria-label={
              isOutOfStock
                ? `${product.name} habis`
                : `Tambah ${product.name} ke keranjang`
            }
            className={`touch-target flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 select-none ${
              isOutOfStock
                ? "bg-stone-100 text-stone-400 cursor-not-allowed border border-stone-200"
                : "bg-orange-600 hover:bg-orange-700 text-white shadow-sm hover:shadow-orange-600/30 active:scale-95"
            }`}
          >
            {isAdding ? (
              <>
                <Check className="w-4 h-4 animate-in zoom-in" />
                <span className="hidden xs:inline">Ditambah</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                <span>
                  {qtyInCart > 0 ? `Tambah (${qtyInCart})` : "+ Keranjang"}
                </span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
