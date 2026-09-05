# Product Requirements Document (PRD): NodeAI

## 1. Product Overview

**Nama Produk:** NodeAI
**Deskripsi:** NodeAI adalah sebuah aplikasi website SaaS (_Software as a Service_) inovatif yang dirancang untuk mempermudah pengguna memvisualisasikan ide, alur kerja bisnis, rute belajar (_roadmap_), dan arsitektur sistem secara instan menggunakan teknologi AI (_Artificial Intelligence_). Pengguna cukup memberikan instruksi teks (_prompt_), dan AI akan mengubahnya menjadi diagram visual interaktif di atas _canvas_ yang dapat dimodifikasi lebih lanjut secara bebas.

## 2. Latar Belakang & Pernyataan Masalah (_Problem Statement_)

Proses dokumentasi, perencanaan alur, atau pembelajaran seringkali menghadapi beberapa kendala berikut:

1. **Kurangnya Arahan Terstruktur:** Seseorang yang ingin mempelajari keahlian baru seringkali kebingungan mencari rute belajar (roadmap) yang sistematis dan langkah demi langkah.
2. **Keterbatasan Format Teks:** Penjelasan mengenai alur kerja, dokumentasi teknis, atau arsitektur sistem yang hanya berupa teks statis sangat membosankan dan sulit dipahami oleh tim atau audiens.
3. **Pembuatan Diagram Manual yang Repot:** Aktivitas merancang diagram alur (flowchart) dengan cara menarik bentuk satu per satu memakan waktu dan energi yang tidak sedikit.
4. **Output AI Generatif yang Kaku:** Meskipun banyak AI generatif (seperti ChatGPT), hasil pembuatan diagram seringkali berupa kode mentah (misalnya kode Mermaid) yang jika membutuhkan revisi kecil, mengharuskan pengguna memulai ulang dari _prompt_ baru alih-alih bisa di-_edit_ langsung.

## 3. Solusi & Proposisi Nilai (_Value Proposition_)

NodeAI memposisikan dirinya sebagai **solusi _one-stop_**. AI tidak hanya merancang (_generate_) diagram awal yang presisi sesuai _prompt_ pengguna, tetapi juga menempatkannya dalam sebuah kanvas visual dinamis. Setelah diagram atau _roadmap_ terbuat, pengguna diberikan hak akses penuh untuk memanipulasinya (_drag & drop_, menyambung garis, mengubah teks) tanpa batasan apa pun.

## 4. Target Pengguna (_Target Audience_)

- **Pelajar & Mahasiswa:** Untuk membuat _roadmap_ belajar atau mind-mapping tugas.
- **Developer / System Architect:** Untuk memvisualisasikan arsitektur sistem, _database_, dan infrastruktur.
- **Product Manager / Business Analyst:** Untuk merancang _user flow_, alur bisnis, dan proses kerja dengan tim pemasaran/pengembangan.
- **Content Creator / Edukator:** Untuk membuat infografik alur materi sebagai bahan ajar kepada audiens.

## 5. Fitur Utama MVP (_Minimum Viable Product_)

### 5.1. AI Chat to Canvas (AI Roadmap Generator)

- **Deskripsi:** Fitur _killer_ aplikasi di mana pengguna berinteraksi dengan asisten AI di _Side Panel_ kanvas.
- **Fungsi:** Mengubah _prompt_ teks (contoh: "Buatkan saya roadmap belajar Next.js") menjadi susunan kumpulan kotak (node) terstruktur yang terhubung dengan garis rapi di tengah _canvas_ beserta deskripsi instruksinya.

### 5.2. Drag, Drop, Custom Canvas Builder

- **Deskripsi:** Editor diagram visual (_canvas_) interaktif dengan manipulasi mutlak.
- **Fungsi:**
  - Menambahkan node secara manual melalui proses _drag-and-drop_ dari Panel Bentuk (mendukung bentuk bebas, lonjong, wajik kondisi, dll).
  - Skalabilitas kanvas tanpa batas (_infinite pan_ & _zoom_).
  - Menghubungkan berbagai node menggunakan titik hubung/garis (_edges_).
  - **Auto-Layout:** Fitur merapikan letak dan posisi node yang berantakan menjadi struktur hierarki/alur otomatis.
  - Memberikan tulisan / _inline text_ di atas _edge_ penghubung.

### 5.3. Real-time Auto-Save & Project Management

- **Deskripsi:** Sistem penyimpanan transparan tanpa mengganggu pengalaman pengguna.
- **Fungsi:** Menyimpan setiap perubahan sekecil apapun di _canvas_ ke database secara _real-time_. Menghadirkan **Dashboard User** tempat semua riwayat _roadmap_ dan _project diagram_ tersusun, dapat diakses kapan saja, dan aman dari risiko hilang.

### 5.4. Ekspor Visual (Visual Export)

- **Deskripsi:** Kemudahan untuk mengeluarkan hasil diagram karya _user_ ke format presentasi.
- **Fungsi:** Mendukung format pengunduhan ke **PNG, JPG, dan SVG** dengan kapabilitas latar belakang transparan.

### 5.5. Otentikasi dan Desain Premium (UI/UX)

- **Deskripsi:** Pendekatan visual dan _vibe_ modern standar aplikasi SaaS bernilai tinggi.
- **Fungsi:**
  - Login/Register aman (_Better Auth_).
  - Estetika UI terpandu dengan konsep _soft tech_, _glassmorphism_, paduan ungu estetik, serta bayangan (_glow shadow_) minimalis.
  - Penanganan gagal (_error handling_) intuitif berbasis _toast notification_ UI.

## 6. Spesifikasi Sistem & Arsitektur (_Tech Stack_)

Aplikasi dibangun menggunakan model arsitektur **Monorepo / Multi-apps (Turborepo)** dengan komponen berikut:

- **Frontend:**
  - Framework: React.js dipadukan dengan Vite (untuk performa build HMR cepat).
  - Logic Canvas: `@xyflow/react` (d/h React Flow).
  - Styling System: Vanilla CSS menggunakan _CSS Variables_ untuk sistem desain _token_-nya (tidak menggunakan UI library pre-built agar tampilan unik).
  - Iconography: Lucide React.
- **Backend & AI Engine:**
  - Server: Express.js (menangani _prompt_, sinkronisasi canvas, logika koneksi).
  - Integrasi LLM AI: **Vercel AI SDK** untuk _streaming_ respon dari model besar (Gemini / GPT) dan _generation_ sturktur JSON terdefinisi ke bentuk diagram spasial.
- **Database & Authentication:**
  - Basis Data Utama: PostgreSQL.
  - ORM (Object Relational Mapping): Drizzle ORM (TypeScript-first ORM bertenaga).
  - Manajemen Sesi: Better Auth.

## 7. Metrik Sukses & Rencana Masa Depan (Opsional)

- Tingkat konversi AI _generate_ menjadi ekspor data secara cepat.
- Kemungkinan pengembangan ke depan:
  - Mode Kolaborasi Multi-Player Realtime.
  - Templat Komunitas / _Marketplace Roadmap_.
  - Versi PWA (_Progressive Web App_) atau aplikasi _Desktop_.
