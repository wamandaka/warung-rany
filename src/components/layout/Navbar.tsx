"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, Menu, X, UtensilsCrossed, Clock } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useBusiness } from "@/context/BusinessContext";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { totalItems, openCart } = useCart();
  const { settings, storeStatus } = useBusiness();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // If in admin route, public navbar is not shown
  if (pathname.startsWith("/admin")) {
    return null;
  }

  const navLinks = [
    { name: "Beranda", href: "/" },
    { name: "Menu Lengkap", href: "/menu" },
    { name: "Tentang Kami", href: "/#tentang" },
    { name: "Jam Buka", href: "/#jam-buka" },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-stone-200/80 transition-all">
        {/* Top Info Bar */}
        <div className="bg-stone-900 text-stone-300 text-xs py-1.5 px-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "inline-block w-2 h-2 rounded-full",
                  storeStatus.isOpen ? "bg-emerald-400 animate-pulse" : "bg-stone-500"
                )}
              />
              <span className="font-medium text-stone-200">
                {storeStatus.isOpen ? "Warung Buka" : "Warung Tutup"}
              </span>
              <span className="hidden sm:inline text-stone-400">• {storeStatus.message}</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="hidden md:inline text-stone-400">
                Pesan Cepat via WhatsApp
              </span>
              {/* <Link
                href="/admin"
                className="text-stone-400 hover:text-white flex items-center gap-1 text-[11px]"
              >
                <Shield className="w-3 h-3" />
                <span>Admin</span>
              </Link> */}
            </div>
          </div>
        </div>

        {/* Main Nav */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo & Brand Name */}
            <Link href="/" className="flex items-center gap-2.5 group min-w-0 mr-2">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-orange-600 text-white flex items-center justify-center shadow-md shadow-orange-600/20 group-hover:scale-105 transition-transform shrink-0">
                <UtensilsCrossed className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-bold text-base sm:text-xl text-stone-900 tracking-tight leading-tight group-hover:text-orange-600 transition-colors truncate max-w-35 sm:max-w-xs">
                  {settings.businessName || "Warung Rany"}
                </span>
                <span className="text-[11px] text-stone-500 truncate max-w-35 sm:max-w-xs">
                  {settings.tagline || "Masakan Rumahan, Rasa yang Bikin Pulang"}
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1 lg:gap-2">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={cn(
                      "px-3.5 py-2 rounded-xl text-sm font-medium transition-colors",
                      isActive
                        ? "text-orange-600 bg-orange-50 font-semibold"
                        : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"
                    )}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </nav>

            {/* Cart & Mobile Hamburger */}
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={openCart}
                aria-label={`Keranjang Belanja (${totalItems} item)`}
                className="relative flex items-center gap-2 bg-orange-50 hover:bg-orange-100 text-orange-700 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all active:scale-95 border border-orange-200/60"
              >
                <div className="relative">
                  <ShoppingBag className="w-5 h-5" />
                  {totalItems > 0 && (
                    <span className="absolute -top-2 -right-2 bg-orange-600 text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center animate-in zoom-in">
                      {totalItems > 99 ? "99+" : totalItems}
                    </span>
                  )}
                </div>
                <span className="hidden sm:inline font-semibold">Keranjang</span>
              </button>

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label={mobileMenuOpen ? "Tutup menu" : "Buka menu navigasi"}
                className="md:hidden p-2.5 rounded-xl text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-stone-200 bg-white px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top-4 duration-200">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 rounded-xl text-base font-medium text-stone-800 hover:text-orange-600 hover:bg-orange-50 transition-colors"
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-3 border-t border-stone-100 flex flex-col gap-2">
              <div className="flex items-center gap-2 px-4 py-2 text-xs text-stone-500">
                <Clock className="w-4 h-4 text-orange-600" />
                <span>{storeStatus.message}</span>
              </div>
              <Button
                variant="outline"
                className="w-full justify-center"
                onClick={() => {
                  setMobileMenuOpen(false);
                  openCart();
                }}
              >
                <ShoppingBag className="w-4 h-4 mr-2" />
                Buka Keranjang ({totalItems})
              </Button>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
