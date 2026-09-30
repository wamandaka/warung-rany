"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useBusiness } from "@/context/BusinessContext";
import {
  UtensilsCrossed,
  LayoutDashboard,
  ShoppingBag,
  Tags,
  Sparkles,
  Megaphone,
  MessageSquareQuote,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Produk", href: "/admin/products", icon: ShoppingBag },
  { name: "Kategori", href: "/admin/categories", icon: Tags },
  { name: "Menu Hari Ini", href: "/admin/today-menu", icon: Sparkles },
  { name: "Promo", href: "/admin/promos", icon: Megaphone },
  { name: "Testimonial", href: "/admin/testimonials", icon: MessageSquareQuote },
  { name: "Pengaturan", href: "/admin/settings", icon: Settings },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, logout, isFirebaseActive } = useAuth();
  const { settings } = useBusiness();
  const businessName = settings?.businessName || "Warung Rany";
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // If on login route, bypass shell
  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (!loading && !user && !isLoginPage) {
      router.push("/admin/login");
    }
  }, [user, loading, isLoginPage, router]);

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-100 flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-orange-600" />
          <span className="text-sm font-medium text-stone-600">
            Memuat Dashboard Admin...
          </span>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }

  const handleLogout = async () => {
    await logout();
    router.push("/admin/login");
  };

  const navContent = (
    <div className="flex flex-col h-full justify-between">
      <div className="space-y-6">
        {/* Brand */}
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-10 h-10 rounded-xl bg-orange-600 text-white flex items-center justify-center shadow-md shadow-orange-600/20">
            <UtensilsCrossed className="w-5 h-5" />
          </div>
          <div>
            <span className="font-bold text-base text-stone-900 block leading-tight truncate max-w-40">
              {businessName}
            </span>
            <span className="text-xs text-stone-500">Panel Pengelola</span>
          </div>
        </div>

        {/* Links */}
        <nav className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileDrawerOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors",
                  isActive
                    ? "bg-orange-50 text-orange-700 font-semibold border border-orange-200/60"
                    : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"
                )}
              >
                <Icon className={cn("w-4 h-4", isActive ? "text-orange-600" : "text-stone-400")} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer in sidebar */}
      <div className="space-y-3 pt-6 border-t border-stone-200">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:text-orange-600 hover:bg-orange-50 transition-colors"
        >
          <span>Buka Website Toko</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>

        <div className="p-3 bg-stone-100 rounded-xl">
          <div className="text-[11px] text-stone-500 truncate">
            {user.email || "Admin"}
          </div>
          <div className="flex items-center gap-1.5 mt-1">
            <span
              className={cn(
                "w-2 h-2 rounded-full",
                isFirebaseActive ? "bg-emerald-500" : "bg-amber-500"
              )}
            />
            <span className="text-[10px] text-stone-600 font-medium">
              {isFirebaseActive ? "Cloud Firestore" : "Local Demo Storage"}
            </span>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Keluar</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-stone-100/70 flex flex-col md:flex-row">
      {/* Mobile Header Bar */}
      <div className="md:hidden bg-white border-b border-stone-200 px-4 py-3 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-orange-600 text-white flex items-center justify-center">
            <UtensilsCrossed className="w-4 h-4" />
          </div>
          <span className="font-bold text-sm text-stone-900 truncate max-w-50">
            {businessName}
          </span>
        </div>
        <button
          onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
          aria-label={mobileDrawerOpen ? "Tutup menu admin" : "Buka menu admin"}
          className="p-2 rounded-xl text-stone-600 hover:bg-stone-100"
        >
          {mobileDrawerOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="fixed inset-0 bg-stone-900/50 backdrop-blur-xs"
            onClick={() => setMobileDrawerOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-64 bg-white p-5 shadow-2xl z-50 animate-in slide-in-from-left duration-200">
            {navContent}
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside
        aria-label="Navigasi Admin"
        className="hidden md:flex flex-col w-64 bg-white border-r border-stone-200 p-5 shrink-0 sticky top-0 h-screen"
      >
        {navContent}
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
}
