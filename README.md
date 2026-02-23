# NodeAI

**NodeAI** adalah aplikasi website SaaS (_Software as a Service_) inovatif yang dirancang khusus untuk mempermudah siapa pun dalam memvisualisasikan ide, alur kerja, rute belajar, dan arsitektur sistem secara instan melalui kekuatan AI. Cukup ketik apa yang ingin Anda rancang, dan biarkan AI mengubahnya menjadi _roadmap_ atau diagram nyata yang bisa langsung diedit di atas _canvas_ interaktif!

---

## Latar Belakang & Masalah (Problem Statement)

Ide aplikasi ini muncul dari pemecahan masalah nyata yang sering ditemui dalam proses pembelajaran maupun dokumentasi profesional:

1. **Tidak Ada Arahan Belajar yang Jelas:** Ketika seseorang ingin menguasai _skill_ baru (misalnya "Belajar React" atau "Cara menjadi Data Scientist"), seringkali tidak ada rute pasti atau patokan pembelajaran terstruktur langkah demi langkah.
2. **Format Teks Susah Dipahami:** Penjelasan alur kerja bisnis atau teknis seringkali hanya berupa teks statis dan membosankan, sehingga sulit dipahami oleh _user_, teman kerja, atau audiens.
3. **Membuat Diagram Sangat Repot:** Kegiatan merancang diagram alur (flowchart) atau arsitektur masih dilakukan secara manual satu per satu, yang memakan banyak waktu dan energi.
4. **AI Generatif Masih Kaku:** Pembuatan diagram langsung melalui prompt AI (seperti ChatGPT biasa) sering kali menghasilkan output kaku (misal kode mermaid), dan ketika butuh perubahan sekecil apa pun, kita harus melakukan _chat_ ulang dari awal.

Oleh karena itu, **NodeAI** hadir sebagai _one-stop solution_ di mana AI tidak hanya merancang _(generate)_ diagram awalnya, tetapi juga mengizinkan _user_ untuk mengubah dan mengembangkannya _(drag & drop)_ di dalam editor visual yang dinamis.

---

## Tech Stack (Teknologi yang Digunakan)

Aplikasi ini dibangun menggunakan arsitektur monorepo / multi-apps modern (Frontend & Backend terpisah namun terintegrasi erat), dengan _tech stack_ handal:

### Frontend (Proyek Utama)

- **React.js + Vite:** Ekosistem dasar yang menjamin performa, waktu _build_ yang cepat (HMR), serta pengalaman _Single Page Application_ (SPA) yang sangat mulus.
- **@xyflow/react (React Flow):** _Library_ spesifik untuk menangani _canvas_, _nodes_, _edges_ (garis penghubung), algoritma _auto-layout_, dan interaktivitas tingkat tinggi di atas kanvas diagram.
- **Vanilla CSS:** Memanfaatkan CSS murni modern dengan CSS Variables sebagai sistem desain terpusat (_Design System Token_) - memprioritaskan estetika premium, elegan, _airy_, _glassmorphism_, dan _soft tech_.
- **Lucide React:** Set ikon minimalis nan estetis yang mendukung _interface_ aplikasi.

### Backend & AI Service

- **Express.js:** _Framework_ Node.js yang ringan dan efisien untuk menyajikan API ke sisi klien (menerima _prompt_ pengguna, memproses logika, dan menyimpannya).
- **Vercel AI SDK:** _Library_ andalan yang digunakan untuk menangani koneksi _(streaming & response)_ dari _Large Language Models_ (LLM) seperti Google Gemini / GPT, sehingga AI mampu menghasilkan struktur JSON diagram (node & koneksi garis) yang presisi sesuai permintaan user.

### Database & Authentication Server

- **PostgreSQL / Drizzle ORM:** Skema basis data rasional (_relational_) modern yang disupervisi dengan Drizzle untuk kehandalan _query_ dan simpan-muat data secara cepat.
- **Better Auth:** Layanan otentikasi tambahan (alternatif/transisi) dalam ekosistem sistem SaaS terpadu.

---

## Fitur MVP (Minimum Viable Product) yang Disuguhkan

Sebagai MVP yang langsung _ready_ digunakan, NodeAI menyuguhkan fitur-fitur "killer" berikut:

### 1. AI Chat to Canvas (AI Roadmap Generator)

Fitur utamanya! Pengguna berinteraksi dengan asisten AI yang berada di sebelah kanan kanvas (_Side Panel AI_). Cukup perintahkan _prompt_ seperti _"Buatkan saya roadmap belajar Next.js dari awal"_, AI akan men-_generate_ kumpulan node langkah demi langkah dan otomatis meletakkannya dengan rapi di tengah _canvas_ lengkap beserta deskripsi garisnya.

### 2. Drag, Drop, Custom Canvas Builder

Pengguna memiliki kontrol mutlak terhadap diagram yang dihasilkan AI.

- Menambahkan **Node Manual** (seperti bentuk kotak langkah, wajik untuk kondisi, atau elips untuk start/end) hanya dengan _drag and drop_ dari Panel Bentuk.
- Memindahkan (_drag_) posisi node sebebas mungkin di atas kanvas yang tak terbatas (_infinite pan_).
- Menghubungkan titik garis (_edges_) dari satu kotak ke kotak lainnya semudah ditarik secara visual.
- Fitur _Auto-Layout_ membenarkan node yang berantakan menjadi struktur hierarki atau alur otomatis yang sedap dipandang.
- Memberi _label_ catatan di atas garis penghubung secara _inline_.

### 3. Auto-Save & Project Management

Setiap perubahan sekecil apa pun di atas _canvas_ (menggeser node, menambah teks, atau interaksi AI) akan otomatis terjaga melalui fitur _Real-time Auto-save_ dan disambungkan ke _Database_ (Supabase). Semua riwayat _roadmap_/proyek tersimpan aman dan terkelola rapi pada Dashboard akun pribadi _user_.

### 4. Ekspor Visual

Apakah desain diagram _flow_ sudah jadi dan dirasa mantap? Pengguna cukup melakukan sekali klik menggunakan menu Ekspor agar bisa langsung diunduh _(download)_ dalam format populer seperti **PNG, JPG, dan SVG** - bahkan mendukung opsi latar belakang _Transparan_ untuk ditempel di presentasi/pitch deck!

### 5. Autentikasi Mudah dan Interface yang Memanjakan Mata

Sistem Login & Register dirakit kuat namun dengan _visual vibe_ yang cantik _(Soft Premium Aesthetic - perpaduan warna violet, gradasi kaca (ice), glow shadow minimalis)_. Termasuk sistem validasi _error_ yang sangat intuitif melalui _toast notification pop-up_.
