# Pustaka Petugas - Sistem Sirkulasi Perpustakaan Internal

Aplikasi web responsif sistem sirkulasi mandiri khusus petugas perpustakaan meja layanan (*circulation desk*) untuk mengelola katalog buku fisik, memproses peminjaman dan pengembalian eksemplar, rekonsiliasi inventaris stok rak, serta deteksi keterlambatan & denda otomatis.

Desain antarmuka, tata letak, palet warna, tipografi, dan perilaku komponen dibangun dengan mengacu langsung pada desain sistem **Athenaeum Minimal** dari Google Stitch ([Project 8984306241609568](https://stitch.google.com/projects/8984306241609568)).

---

## 🏛️ Desain Sistem (Athenaeum Minimal)

- **Brand Accent**: Burnt Orange / Terracotta (`#C85A17`, hover `#A34710`, active `#85380B`)
- **Canvas / Background**: Warm Canvas Cream (`#FBF9F5`, card `#F5F2EB` & `#FFFFFF`, subtle `#EBE5D8`)
- **Border & Outline**: Kontras Gelap / Charcoal Line (`#1E1E1E` / `#333333`)
- **Indikator Status**:
  - 🟢 **Hijau Zamrud**: Pengembalian selesai (`KEMBALI`), stok tersedia di rak
  - 🟡 **Kuning Amber**: Peminjaman aktif (`DIPINJAM`), mendekati jatuh tempo (1–4 hari)
  - 🔴 **Merah Coral**: Terlambat pengembalian (`TERLAMBAT`), stok eksemplar habis (0 EKS)
- **Tipografi**:
  - Display/Judul: *Lora / Cinzel* (serif klasik akademis)
  - UI/Body: *Plus Jakarta Sans* (sans-serif modern bersih)
  - Kode/Terminal/DDC: *JetBrains Mono* (monospace terstruktur)

---

## 📦 Struktur Modul & Halaman

1. **Beranda / Pusat Operasional Sirkulasi (`/`)**
   - Banner status terminal `POS-SIRKULASI-01`, koneksi WiFi, dan `SERVER INDUK AKTIF`.
   - 4 Kartu KPI Operasional: Koleksi Induk (142 Judul), Stok di Rak (486 Eks), Sirkulasi Aktif (28 Pinjam), Riwayat Selesai (314 / 91%).
   - Tabel 5 transaksi sirkulasi terbaru dengan aksi cepat pengembalian.
   - Panel Perhatian Petugas: 3 buku kritis mendekati jatuh tempo dengan tombol pengiriman notifikasi pengingat ke anggota.
   - Standar aturan denda keterlambatan Rp 1.000/hari kerja.

2. **Katalog Buku Koleksi (`/katalog`)**
   - Bilah pencarian instan (judul, pengarang, penerbit, DDC, ISBN) dan tombol scanner barcode.
   - Filter pill: *Semua*, *Tersedia*, *Stok Habis*.
   - Grid kartu buku interaktif dengan badge DDC, rak fisik, status ketersediaan.
   - Drawer panel detail bibliografi di sisi kanan dengan tombol `Pinjam Buku Ini` (otomatis terkunci dengan label *Stok buku habis* bila eksemplar = 0), `Cetak Label`, dan `Ubah Data`.

3. **Kelola Data Buku Perpustakaan (`/kelola-buku`)**
   - Modul rekonsiliasi fisik & katalog induk master.
   - Tabel inventaris master: Sampul, ID Buku, Judul & Penulis, Penerbit & Tahun, DDC & Rak, Stok Fisik, Aksi.
   - Modal formulir tambah dan edit buku, termasuk modul upload sampul buku hingga 2MB atau opsi sampul standar Athenaeum.
   - Prosedur berita acara rekonsiliasi triwulan inventaris.

4. **Riwayat Transaksi Sirkulasi (`/riwayat`)**
   - Header kode arsip `ARC-TRX-2026.Q1` dengan indikator sinkronisasi DB real-time.
   - Tab filter: *Semua Transaksi*, *Dipinjam*, *Kembali*.
   - Tabel log sirkulasi lengkap dengan kode transaksi `PJM-2026-XXXX`.
   - Tombol `Proses Pengembalian` aktif pada transaksi *Dipinjam* (+1 stok otomatis), dan terkunci dengan badge *Selesai (Stok +1)* untuk transaksi *Kembali* guna mencegah pengembalian ganda.

5. **Fitur Utilitas Meja Layanan**:
   - **Scanner Barcode / QR**: Simulasi deteksi kamera dan input kode cepat untuk buku dan nomor registrasi pinjam.
   - **Cetak Label & Barcode**: Format stiker punggung buku DDC dan barcode termal siap cetak (`window.print()`).
   - **Toast Notifications**: Konfirmasi visual untuk setiap transaksi peminjaman, pengembalian, dan penambahan buku.

---

## 🛠️ Stack Teknologi

- **Framework**: Next.js 14 (App Router) / React 18 / TypeScript
- **Styling**: Tailwind CSS dengan token kustom Athenaeum Minimal
- **Backend / API Routes**:
  - `GET /api/books` - Daftar katalog & pencarian
  - `POST /api/books` - Penambahan buku baru
  - `GET /api/transactions` - Riwayat log transaksi
  - `POST /api/transactions` - Transaksi peminjaman baru (mengurangi stok)
  - `PUT /api/transactions` - Proses pengembalian buku (menambah stok +1, cegah duplikasi)
  - `GET /api/stats` - Statistik KPI operasional & alert jatuh tempo
- **Zero-Dependency Standalone Server**: `standalone-server.js` (dapat dijalankan langsung dengan Node.js bawaan tanpa dependensi pihak ketiga).

---

## 🚀 Panduan Menjalankan Secara Lokal

### Opsi A: Menjalankan via Standalone Server (Langsung Siap Pakai)
Jika di komputer belum terpasang `npm` global, server dapat langsung dijalankan menggunakan Node runtime bawaan:
```powershell
cd C:\Users\ACER\.gemini\antigravity\scratch\pustaka-petugas
node standalone-server.js
# atau via runtime antigravity:
& "C:\Users\ACER\AppData\Roaming\Antigravity\bin\agy-node.cmd" standalone-server.js
```
Akses aplikasi di browser melalui: `http://localhost:3000`

### Opsi B: Menjalankan via Next.js Development Server
Jika Node.js dan npm telah terpasang:
```bash
cd pustaka-petugas
npm install
npm run dev
```
Buka `http://localhost:3000`.

---

## ☁️ Panduan Deploy ke VERCEL

Aplikasi ini sudah dilengkapi konfigurasi `vercel.json` dan struktur App Router standar:

### Langkah 1: Push ke GitHub / GitLab
```bash
git init
git add .
git commit -m "feat: Pustaka Petugas Circulation System"
git remote add origin https://github.com/USERNAME/pustaka-petugas.git
git push -u origin main
```

### Langkah 2: Deploy di Vercel Dashboard
1. Buka [https://vercel.com](https://vercel.com) dan login.
2. Klik **"Add New Project"** lalu pilih repositori `pustaka-petugas`.
3. Vercel akan otomatis mendeteksi:
   - **Framework Preset**: `Next.js`
   - **Build Command**: `next build`
   - **Output Directory**: `.next`
4. Masukkan Environment Variables (jika diperlukan) sesuai file `.env.example`:
   - `NEXT_PUBLIC_TERMINAL_ID=POS-SIRKULASI-01`
   - `NEXT_PUBLIC_OPERATOR_NAME=Petugas Meja 1`
   - `NEXT_PUBLIC_FINE_PER_DAY=1000`
5. Klik **"Deploy"**. Dalam hitungan detik website akan aktif secara publik.

### Langkah 3: Deploy via Vercel CLI (Alternatif)
```bash
npm i -g vercel
vercel
vercel --prod
```

---

## 🧪 Hasil Pengujian (QA & Automated Integration Tests)

Seluruh pengujian integrasi otomatis telah dijalankan dan lulus 100%:
- ✅ **Test 1: GET /api/stats** (200 OK - Rekonsiliasi KPI & alert)
- ✅ **Test 2: GET /api/books** (200 OK - 9 koleksi master katalog)
- ✅ **Test 3: POST /api/transactions** (201 Created - PJM baru & pengurangan stok)
- ✅ **Test 4: PUT /api/transactions** (200 OK - Pengembalian buku & rekonsiliasi +1 stok)
- ✅ **Test 5: Proteksi Pengembalian Ganda** (400 Bad Request - Validasi keamanan aktif)
- ✅ **Test 6: GET / (Frontend UI)** (200 OK - Render UI & komponen Google Stitch)

---

## 📋 Catatan & Tindak Lanjut
- **Penyimpanan Data Saat Ini**: Menggunakan in-memory repository dengan reaktivitas state. Data dapat dihubungkan ke PostgreSQL/Supabase dengan mengatur `DATABASE_URL` pada `.env`.
- **Integrasi Hardware Scanner**: Scanner software sudah mendukung pembacaan keyboard input dari barcode scanner fisik USB/Bluetooth (format HID keyboard emulator) secara otomatis.
