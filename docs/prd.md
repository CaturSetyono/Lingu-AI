Tentu, ini adalah versi **Product Requirements Document (PRD)** yang telah saya struktur ulang agar lebih teknis, hierarkis, dan mudah dipahami oleh AI Agent atau Developer. Saya menggunakan format standar industri yang memisahkan antara visi produk, spesifikasi teknis, dan logika sistem.

---

# 📄 PRD: LinguAI Studio (PWA Version)
**Project Status:** MVP / Phase 1  
**Architecture:** Serverless + No-Database + Local Storage  

---

## ## 1. Executive Summary
LinguAI Studio adalah alat bantu tulis berbasis AI (PWA) yang fokus pada kecepatan dan privasi. Aplikasi ini memungkinkan pengguna melakukan *rewriting* teks dengan kontrol parameter yang mendalam tanpa proses registrasi. Seluruh data preferensi disimpan secara lokal di sisi klien.

## ## 2. Core Objectives
* **Zero-Friction:** Pengguna bisa langsung menggunakan alat tanpa *login*.
* **High Customization:** Memberikan kontrol penuh atas *tone*, gaya, dan panjang teks.
* **Privacy-First:** Tidak ada data teks atau profil yang disimpan di server permanen.
* **Mobile-First:** Optimalisasi penggunaan satu tangan (thumb-friendly).

---

## ## 3. Technical Stack & Architecture
| Komponen | Teknologi | Keterangan |
| :--- | :--- | :--- |
| **Frontend** | Astro + React (UI Components) | Performa cepat dengan interaktivitas React. |
| **Styling** | Tailwind CSS | Utility-first untuk responsivitas mobile. |
| **State & Storage** | Browser LocalStorage | Menyimpan konfigurasi `{tone, style, lang, etc}`. |
| **Backend** | Astro API Routes (Serverless) | Proxy ke AI Provider untuk menyembunyikan API Key. |
| **AI Provider** | OpenRouter (Model: Qwen 3.6 Plus) | Engine pemrosesan teks. |
| **Deployment** | Vercel | Hosting otomatis dan optimasi edge functions. |

---

## ## 4. Feature Specifications

### ### 4.1 Global Settings Management (LocalStorage)
Sistem harus mampu melakukan *Read/Write* pada `localStorage` untuk objek berikut:
```json
{
  "tone": "formal | casual | professional | humorous",
  "style": "concise | descriptive | academic",
  "language": "id | en",
  "length": "shorter | original | longer",
  "customPrompt": "string",
  "lastInput": "string"
}
```

### ### 4.2 UI/UX Components (Mobile-First Hierarchy)
1.  **Header:** Menampilkan logo dan indikator status PWA.
2.  **Input Area:** Textarea responsif dengan fitur *auto-resize*.
3.  **Collapsible Settings:** Panel akordion untuk konfigurasi AI agar tidak memakan ruang layar.
4.  **Sticky Action Button:** Tombol "Generate" yang melayang (*floating*) atau menempel di bawah layar.
5.  **Output Display:** Area hasil dengan fitur *Syntax Highlighting* (jika perlu) dan tombol *Copy to Clipboard*.

### ### 4.3 PWA Requirements
* **Manifest.json:** Icon 512x512, warna tema, dan `display: standalone`.
* **Service Worker:** Minimal caching untuk UI agar aplikasi dapat terbuka secara instan meski koneksi lambat.

---

## ## 5. Logic & System Flow

### ### 5.1 User Workflow
1.  **Initialization:** Aplikasi mengecek `localStorage`. Jika kosong, set ke *default*.
2.  **Input:** User memasukkan teks yang ingin diubah.
3.  **Adjustment:** User membuka panel Settings (opsional) untuk mengubah parameter.
4.  **Execution:** Klik "Generate" -> Trigger API Route.
5.  **Completion:** Hasil muncul di Output Area; User melakukan Copy atau Regenerate.

### ### 5.2 Prompt Engineering Structure
Agent harus mengirimkan prompt ke OpenRouter dengan struktur berikut:
> **System Role:** You are a professional writing assistant.
> 
> **Instructions:** Rewrite the text with these parameters:
> * Tone: `{{state.tone}}`
> * Style: `{{state.style}}`
> * Language: `{{state.language}}`
> * Length: `{{state.length}}`
> 
> **Additional Context:** `{{state.customPrompt}}`
> 
> **Target Text:** `{{userInput}}`

---

## ## 6. File Structure (Reference for Agent)
```text
/src
  ├── /components
  │    ├── Header.astro
  │    ├── InputBox.jsx        (Handling user input state)
  │    ├── SettingsPanel.jsx   (Accordion UI + LocalStorage Sync)
  │    ├── OutputBox.jsx       (Displaying AI result)
  │    └── ActionButton.jsx    (Floating Generate button)
  ├── /pages
  │    ├── index.astro         (Main Layout)
  │    └── /api
  │         └── generate.ts    (OpenRouter API integration)
  ├── /utils
  │    ├── storage.ts          (Helper for localStorage CRUD)
  │    └── constants.ts        (Options for Tone, Style, etc)
  └── /styles
       └── global.css
```

---

## ## 7. Success Metrics (MVP)
* **Lighthouse Score:** > 90 untuk Performance dan PWA.
* **Latency:** API response di bawah 3 detik untuk teks pendek.
* **Data Persistence:** Pengaturan tidak hilang saat aplikasi ditutup/direfresh.

---

