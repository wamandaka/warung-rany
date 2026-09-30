# 🍛 Warung Rany — Website Masakan Rumahan Modern

Website modern, responsif, dan siap produksi untuk usaha kuliner rumahan (single-store application). Dibuat dengan **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, dan **Firebase**, difokuskan pada pengalaman pemesanan yang sederhana, cepat, dan ramah pengguna via **WhatsApp**.

---

## 🎯 Filosofi Produk

Sistem ini sengaja dirancang **ringkas dan tepat guna**:

> **Alur Pelanggan**: Temukan menu → Pilih hidangan & porsi → Masukkan ke keranjang → Klik "Pesan via WhatsApp" → Pratinjau Pesanan → WhatsApp terbuka dengan pesan pesanan terisi otomatis.

### 🚫 Batasan Sistem (Sesuai Spesifikasi)
Situs ini **TIDAK** menerapkan:
- Payment gateway / pembayaran online
- Registrasi / akun pelanggan
- Database order internal
- Reservasi atau penguncian stok otomatis
- Pelacakan kurir / delivery tracking otomatis
- Sistem akuntansi rumit

Konfirmasi ketersediaan, ongkos kirim, dan pembayaran diselesaikan secara personal oleh pemilik usaha melalui **WhatsApp**.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router, Turbopack)
- **Bahasa**: [TypeScript](https://www.typescriptlang.org/) (Strict Mode)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icon**: [Lucide React](https://lucide.dev/)
- **Validasi**: [Zod](https://zod.dev/) & [React Hook Form](https://react-hook-form.com/)
- **Backend & Database**: [Firebase](https://firebase.google.com/) (Auth, Cloud Firestore, Firebase Storage)
- **Fallback Repository**: LocalStorage fallback bawaan sehingga aplikasi langsung berjalan dan dapat diuji penuh tanpa setup Firebase terlebih dahulu!

---

## 📂 Struktur Proyek

```text
src/
├── app/
│   ├── page.tsx                     # Halaman Utama (Hero, Menu Hari Ini, Promo, Testimonial, Jam Buka)
│   ├── menu/page.tsx                # Eksplorasi Menu Lengkap (Pencarian & Filter Kategori)
│   ├── product/[slug]/page.tsx      # Detail Produk & Pemilihan Jumlah Porsi
│   │
│   └── admin/
│       ├── login/page.tsx           # Login Admin (Firebase Auth + Mode Demo)
│       ├── layout.tsx               # Protected Layout Shell (Sidebar & Drawer)
│       ├── page.tsx                 # Ringkasan Usaha (Statistik Produk & Aksi Cepat)
│       ├── products/                # Kelola Produk (Daftar, Filter, Toggle Status, Hapus)
│       │   ├── page.tsx
│       │   ├── new/page.tsx         # Tambah Produk Baru
│       │   └── [id]/page.tsx        # Edit Produk
│       ├── categories/page.tsx      # Kelola Kategori Menu
│       ├── today-menu/page.tsx      # Atur Menu Hari Ini (Checklist Instan)
│       ├── promos/page.tsx          # Kelola Banner Promo
│       ├── testimonials/page.tsx    # Kelola Testimonial Pelanggan
│       └── settings/page.tsx        # Pengaturan Info Usaha, WhatsApp, Hero, & Jam Operasional
│
├── components/
│   ├── ui/                          # Button, Modal, Badge, Input, Textarea, Toast, ConfirmDialog
│   ├── layout/                      # Navbar, Footer
│   ├── landing/                     # Hero, TodayMenu, PromoBanner, About, OpeningHours, Testimonials
│   ├── products/                    # ProductCard, ProductGrid, MenuExplorer, ProductDetailView
│   ├── cart/                        # CartDrawer, WhatsAppConfirmationModal
│   ├── admin/                       # ProductForm
│   └── providers/                   # AppProviders
│
├── context/
│   ├── AuthContext.tsx              # Autentikasi Pengelola (Firebase Auth + Demo Mode)
│   ├── BusinessContext.tsx          # Pengaturan Toko & Jadwal Buka Global
│   └── CartContext.tsx              # State Keranjang Belanja Lokal (localStorage)
│
├── lib/
│   ├── firebase/                    # config.ts, mockData.ts, localFallback.ts
│   ├── whatsapp/                    # Normalisasi nomor telepon (62...) & Pembuat pesan URL
│   ├── utils/                       # formatRupiah(), slugify(), isStoreCurrentlyOpen()
│   └── validations/                 # Zod Schemas
│
├── services/                        # Service layer Firestore / Local Storage
│   ├── products.ts
│   ├── categories.ts
│   ├── promos.ts
│   ├── testimonials.ts
│   ├── settings.ts
│   └── storage.ts
│
└── types/                           # Strict TypeScript Interfaces
```

---

## 🚀 Cara Menjalankan

### 1. Jalankan Server Pengembangan
```bash
npm run dev
```
Buka browser di [http://localhost:3000](http://localhost:3000).

### 2. Akun Demo Admin
Jika Firebase belum dihubungkan, sistem otomatis mengaktifkan **Local Demo Mode** dengan akun pengelola:
- **Email**: `admin@warungrany.com`
- **Kata Sandi**: `admin123`

---

## 📱 Konfigurasi WhatsApp

Nomor WhatsApp pemilik dikonfigurasi melalui panel admin pada rute `/admin/settings`.
Format nomor Indonesia seperti `081234567890` akan otomatis dinormalisasi oleh utilitas `normalizeWhatsAppNumber()` menjadi format internasional `6281234567890`.

### Format Pesan WhatsApp:
```text
Halo Kak, saya mau pesan:

1. Ayam Geprek × 2 = Rp36.000
2. Es Teh Manis Melati × 1 = Rp4.000

Total: Rp40.000

Nama: Budi Santoso

Catatan:
Sambal dipisah, tidak terlalu pedas

Mohon konfirmasi ketersediaannya ya.
Terima kasih 🙏
```

---

## 🔥 Menghubungkan Firebase (Opsional untuk Produksi)

1. Buat proyek baru di [Firebase Console](https://console.firebase.google.com/).
2. Aktifkan **Firebase Authentication** (Email & Password).
3. Buat database **Cloud Firestore** dan **Firebase Storage**.
4. Salin berkas `.env.example` ke `.env.local`:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=warung-rany.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=warung-rany
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=warung-rany.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
   NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:...
   ```
5. Deploy aturan keamanan:
   - Aturan Firestore tersedia di [firestore.rules](file:///C:/Daka/iseng/warung-rany/firestore.rules)
   - Aturan Storage tersedia di [storage.rules](file:///C:/Daka/iseng/warung-rany/storage.rules)

---

## 📦 Verifikasi Produksi

```bash
# Validasi Linting
npm run lint

# Build Produksi
npm run build
```
Semua rute (SSR, ISR, dan Static) terkompilasi bersih tanpa error TypeScript maupun ESLint.
