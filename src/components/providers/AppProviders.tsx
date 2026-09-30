"use client";

import React from "react";
import { AuthProvider } from "@/context/AuthContext";
import { BusinessProvider } from "@/context/BusinessContext";
import { CartProvider } from "@/context/CartContext";
import { ToastContainer } from "@/components/ui/Toast";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <BusinessProvider>
        <CartProvider>
          {children}
          <ToastContainer />
        </CartProvider>
      </BusinessProvider>
    </AuthProvider>
  );
}
