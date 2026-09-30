"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useBusiness } from "@/context/BusinessContext";

const ROUTE_TITLES: Record<string, string> = {
  "/": "",
  "/menu": "Daftar Menu",
  "/admin": "Dashboard Admin",
  "/admin/login": "Login Pengelola",
  "/admin/products": "Kelola Menu & Produk",
  "/admin/products/new": "Tambah Produk Baru",
  "/admin/categories": "Kategori Menu",
  "/admin/today-menu": "Menu Hari Ini",
  "/admin/promos": "Promo & Diskon",
  "/admin/testimonials": "Testimonial Pelanggan",
  "/admin/settings": "Pengaturan Toko",
};

export function DynamicPageTitle() {
  const pathname = usePathname();
  const { settings } = useBusiness();

  useEffect(() => {
    if (typeof document === "undefined" || !settings?.businessName) return;

    const businessName = settings.businessName || "Warung Rany";
    const tagline = settings.tagline || "Masakan Rumahan, Rasa yang Bikin Pulang";

    // 1. Root / Homepage
    if (pathname === "/") {
      document.title = `${businessName} — ${tagline}`;
    }
    // 2. Direct route match
    else if (ROUTE_TITLES[pathname]) {
      document.title = `${ROUTE_TITLES[pathname]} | ${businessName}`;
    }
    // 3. Admin product edit route (/admin/products/[id])
    else if (pathname.startsWith("/admin/products/")) {
      document.title = `Edit Produk | ${businessName}`;
    }
    // 4. Product detail page (/product/[slug])
    else if (pathname.startsWith("/product/")) {
      const currentTitle = document.title;
      if (currentTitle && currentTitle.includes("|")) {
        const parts = currentTitle.split("|");
        const productName = parts[0].trim();
        document.title = `${productName} | ${businessName}`;
      } else {
        document.title = `Detail Menu | ${businessName}`;
      }
    }
    // 5. Fallback for other routes
    else {
      const currentTitle = document.title;
      if (currentTitle && currentTitle.includes("Warung Rany")) {
        document.title = currentTitle.replaceAll("Warung Rany", businessName);
      } else if (currentTitle && currentTitle.includes("|")) {
        document.title = `${currentTitle.split("|")[0].trim()} | ${businessName}`;
      } else {
        document.title = `${businessName} — ${tagline}`;
      }
    }

    // Optional: Dynamic Favicon if logoUrl is provided
    if (settings.logoUrl) {
      let favicon = document.querySelector<HTMLLinkElement>("link[rel~='icon']");
      if (!favicon) {
        favicon = document.createElement("link");
        favicon.rel = "icon";
        document.head.appendChild(favicon);
      }
      favicon.href = settings.logoUrl;
    }
  }, [pathname, settings?.businessName, settings?.tagline, settings?.logoUrl]);

  return null;
}
