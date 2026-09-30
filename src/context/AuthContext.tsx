"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
} from "firebase/auth";
import { auth, isFirebaseConfigured } from "@/lib/firebase/config";

interface AdminUser {
  uid: string;
  email: string | null;
  displayName: string | null;
}

interface AuthContextType {
  user: AdminUser | null;
  loading: boolean;
  isFirebaseActive: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_AUTH_STORAGE_KEY = "warung_rany_demo_admin";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (isFirebaseConfigured && auth) {
      const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
        if (firebaseUser) {
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName || "Admin",
          });
        } else {
          setUser(null);
        }
        setLoading(false);
      });
      return () => unsubscribe();
    } else {
      // Offline/Demo auth check
      try {
        const stored = localStorage.getItem(DEMO_AUTH_STORAGE_KEY);
        if (stored) {
          setUser(JSON.parse(stored));
        }
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
  }, []);

  const login = async (
    email: string,
    pass: string
  ): Promise<{ success: boolean; error?: string }> => {
    if (isFirebaseConfigured && auth) {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, pass);
        const fbUser = userCredential.user;
        setUser({
          uid: fbUser.uid,
          email: fbUser.email,
          displayName: fbUser.displayName || "Admin",
        });
        return { success: true };
      } catch (err: unknown) {
        let msg = "Gagal masuk. Periksa email dan kata sandi Anda.";
        const errorCode = (err as { code?: string })?.code;
        if (
          errorCode === "auth/user-not-found" ||
          errorCode === "auth/wrong-password" ||
          errorCode === "auth/invalid-credential"
        ) {
          msg = "Email atau kata sandi yang Anda masukkan salah.";
        } else if (errorCode === "auth/invalid-email") {
          msg = "Format email tidak valid.";
        }
        return { success: false, error: msg };
      }
    } else {
      // Demo authentication mode
      // Accept admin credentials: admin@warungrany.com / admin123 (or any valid email for demo)
      if ((email === "admin@warungrany.com" && pass === "admin123") || (email.includes("@") && pass.length >= 6)) {
        const demoUser: AdminUser = {
          uid: "demo-admin-uid-123",
          email: email,
          displayName: "Admin Pemilik Toko",
        };
        setUser(demoUser);
        localStorage.setItem(DEMO_AUTH_STORAGE_KEY, JSON.stringify(demoUser));
        return { success: true };
      } else {
        return {
          success: false,
          error: "Kata sandi minimal 6 karakter. (Demo login: admin@warungrany.com / admin123)",
        };
      }
    }
  };

  const logout = async () => {
    if (isFirebaseConfigured && auth) {
      try {
        await firebaseSignOut(auth);
      } catch (e) {
        console.error("Signout error:", e);
      }
    }
    setUser(null);
    localStorage.removeItem(DEMO_AUTH_STORAGE_KEY);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isFirebaseActive: isFirebaseConfigured,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
