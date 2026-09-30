"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { UtensilsCrossed, Lock, Mail, ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { toast } from "@/components/ui/Toast";

export default function AdminLoginPage() {
  const router = useRouter();
  const { user, login, isFirebaseActive, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (user && !loading) {
      router.push("/admin");
    }
  }, [user, loading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg("Mohon masukkan email dan kata sandi");
      return;
    }
    setErrorMsg("");
    setIsSubmitting(true);

    try {
      const res = await login(email, password);
      if (res.success) {
        toast.success("Berhasil masuk ke panel admin.");
        router.push("/admin");
      } else {
        setErrorMsg(res.error || "Gagal masuk.");
      }
    } catch {
      setErrorMsg("Terjadi kesalahan saat mencoba masuk.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFillDemo = () => {
    setEmail("admin@warungrany.com");
    setPassword("admin123");
    setErrorMsg("");
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-stone-100/60">
      <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-3xl border border-stone-200 shadow-xl">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-orange-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-orange-600/30">
            <UtensilsCrossed className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-stone-900 tracking-tight">
              Masuk Panel Admin
            </h1>
            <p className="text-sm text-stone-500 mt-1">
              Khusus pengelola Warung Rany
            </p>
          </div>
        </div>

        {/* Demo banner if Firebase not configured */}
        {!isFirebaseActive && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs text-amber-900 space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-amber-800">
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              <span>Mode Demo Lokal Aktif</span>
            </div>
            <p className="leading-relaxed">
              Firebase credentials belum diatur di .env. Anda dapat menggunakan akun demo instan untuk menguji seluruh fitur dashboard:
            </p>
            <div className="bg-white/80 p-2 rounded-lg font-mono text-[11px] text-stone-700 flex items-center justify-between">
              <span>admin@warungrany.com / admin123</span>
              <button
                type="button"
                onClick={handleFillDemo}
                className="text-orange-600 font-bold hover:underline"
              >
                Gunakan
              </button>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs font-medium text-rose-700">
              {errorMsg}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
              Email Admin
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@email.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 text-sm text-stone-900 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
              Kata Sandi
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 text-sm text-stone-900 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
              />
            </div>
          </div>

          <Button
            type="submit"
            size="lg"
            isLoading={isSubmitting}
            className="w-full justify-center mt-2 shadow-md"
          >
            <span>Masuk ke Dashboard</span>
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </form>
      </div>
    </div>
  );
}
