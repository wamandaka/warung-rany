import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { AppProviders } from "@/components/providers/AppProviders";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";

const font = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-sans",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#ea580c",
};

export const metadata: Metadata = {
  title: {
    template: "%s | Warung Rany",
    default: "Warung Rany — Masakan Rumahan, Rasa yang Bikin Pulang",
  },
  description:
    "Pesan masakan rumahan segar dan lezat buatan Warung Rany langsung via WhatsApp. Higienis, fresh setiap hari, dan siap santap.",
  openGraph: {
    title: "Warung Rany — Masakan Rumahan Lezat & Fresh",
    description:
      "Pilihan menu rumahan nikmat, fresh dibuat tiap hari. Pesan praktis langsung lewat WhatsApp.",
    siteName: "Warung Rany",
    locale: "id_ID",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${font.variable} font-sans scroll-smooth`}>
      <body className="min-h-screen bg-stone-50 text-stone-900 flex flex-col antialiased selection:bg-orange-100 selection:text-orange-900">
        <AppProviders>
          <Navbar />
          <main className="flex-1 overflow-x-clip">{children}</main>
          <Footer />
          <CartDrawer />
        </AppProviders>
      </body>
    </html>
  );
}
