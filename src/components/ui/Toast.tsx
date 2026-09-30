"use client";

import React, { useState, useEffect } from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type ToastType = "success" | "error" | "info";

export interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
}

// Global dispatcher
let toastListener: ((toast: ToastMessage) => void) | null = null;

export const toast = {
  success: (message: string) => {
    toastListener?.({
      id: `${Date.now()}-${Math.random()}`,
      type: "success",
      message,
    });
  },
  error: (message: string) => {
    toastListener?.({
      id: `${Date.now()}-${Math.random()}`,
      type: "error",
      message,
    });
  },
  info: (message: string) => {
    toastListener?.({
      id: `${Date.now()}-${Math.random()}`,
      type: "info",
      message,
    });
  },
};

export const ToastContainer: React.FC = () => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    toastListener = (newToast) => {
      setToasts((prev) => [...prev, newToast]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
      }, 4000);
    };
    return () => {
      toastListener = null;
    };
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none p-2 sm:p-0">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={cn(
            "pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-lg border text-sm animate-in slide-in-from-bottom-5 duration-200 transition-all",
            t.type === "success" && "bg-white border-emerald-200 text-stone-900",
            t.type === "error" && "bg-white border-rose-200 text-stone-900",
            t.type === "info" && "bg-white border-stone-200 text-stone-900"
          )}
        >
          <div className="shrink-0 mt-0.5">
            {t.type === "success" && (
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            )}
            {t.type === "error" && (
              <AlertCircle className="w-5 h-5 text-rose-600" />
            )}
            {t.type === "info" && <Info className="w-5 h-5 text-orange-600" />}
          </div>
          <div className="flex-1 font-medium leading-relaxed">{t.message}</div>
          <button
            onClick={() => removeToast(t.id)}
            className="shrink-0 p-1 text-stone-400 hover:text-stone-700 rounded-md"
            aria-label="Tutup notifikasi"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
