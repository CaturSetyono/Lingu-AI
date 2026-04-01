# LinguAI Studio — AI Text Rewriting PWA

**Tagline:** A zero-friction, highly customizable AI writing assistant. Rewrite, refine, and translate your text instantly with precise control over tone, style, and language.

## 🎯 What is LinguAI Studio?

LinguAI Studio is a **Progressive Web App (PWA)** that leverages state-of-the-art AI (powered by DeepSeek R1) to rewrite and improve your text. Built with a premium **Neo-Brutalism** aesthetic, it offers a fast, clean, and professional experience tailored for content creators, professionals, and anyone who needs to write better.

- **Lightning Fast**: No registration or sign-ups required. Just paste your text and generate.
- **Deep Control**: Fine-tune your output by selecting from multiple tones, writing styles, and 33 supported languages.
- **Privacy-First**: All your settings are synced locally to your device.
- **Install Anywhere**: Fully PWA-compliant. Install it on your Windows, macOS, iOS, or Android device for quick, app-like access.
- **Striking Design**: Featuring a bold Neo-Brutalism design system inspired by top-tier modern SaaS platforms.

## ✨ Features

### Core Capabilities ✅

- 📝 **Advanced Text Rewriting** — Instantly improve your text's structure and clarity.
- 🎛️ **4-Parameter Smart Control**:
  - **Tones**: Formal, Casual, Professional, Humorous.
  - **Styles**: Concise, Descriptive, Academic.
  - **Lengths**: Shorter, Original, Longer.
  - **Languages**: 33 options covering Asian, European, Middle Eastern, and South Asian languages.
- 🤖 **DeepSeek R1 Integration** — Powered by the highly capable `deepseek-r1-8b` model via the OXLO API for nuanced reasoning and rewriting.
- 🎯 **Custom Instructions** — Add your own specific prompt overrides (e.g., "Keep the bullet points intact").
- 💾 **Local Persistence** — Your preferences are automatically saved between sessions.
- 📱 **PWA & Offline UI** — Installable to your home screen with a service worker that caches the UI for instant loading.

## 🎨 Design System

LinguAI Studio is built on a **Neo-Brutalism** design system:
- **Typography:** Uses clean, highly legible fonts (`Space Grotesk` for headings/UI, `Space Mono` for data/inputs).
- **Aesthetic:** High-contrast borders, offset hard shadows, dynamic hover interactions, and a distinct lack of generic UI elements. 
- **Palette:** A refined color scheme utilizing stark whites, deep blacks, and a vibrant primary blue accent (`#1d4ed8`).

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- OXLO API Key for the DeepSeek R1 model

### Installation

```bash
# Clone the repository
git clone https://github.com/CaturSetyono/LinguAI-.git
cd Ai-teksgen

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit .env and replace with your OXLO API key: OXLO_API_KEY="your_api_key_here"
```

### Development

```bash
npm run dev          # Start the development server at http://localhost:4321/
```

## 📦 Tech Stack

| Layer         | Technology                 |
| ------------- | -------------------------- |
| **Framework** | Astro 4 + React 18         |
| **Styling**   | Tailwind CSS + Vanilla CSS |
| **AI Model**  | DeepSeek R1 (`deepseek-r1-8b`) via OXLO API |
| **Storage**   | Browser LocalStorage API   |
| **Hosting**   | Vercel Serverless (Recommended) |

## 🗂️ Project Structure

```text
src/
├── components/                  # React UI components (App, InputBox, SettingsPanel)
├── pages/
│   ├── index.astro              # Landing page
│   ├── app.astro                # Core Web App interface
│   └── api/generate.ts          # Backend API endpoint connecting to OXLO
├── utils/                       # Constants, prompt engineering, and TypeScript types
└── styles/                      # Global CSS containing the Neo-Brutalism specific variables
public/
├── manifest.json                # PWA Configuration metadata
├── sw.js                        # Service Worker for caching and offline support
└── icon-*.png                   # PWA app icons (192, 512)
```

## 🌐 Deployment

Deploying LinguAI Studio is recommended via Vercel for zero-config serverless API routes.

1. Push your code to GitHub.
2. Import the project in your Vercel dashboard.
3. Add `OXLO_API_KEY` to the Environment Variables settings.
4. Click Deploy. Astro's Vercel adapter will handle the rest automatically.

## 🙏 Acknowledgments

Built by [Catur Setyono](https://github.com/catursetyono) with modern web technologies to push the limits of what a zero-friction AI app can look and feel like.

---

**LinguAI Studio: Because your writing deserves a professional touch.** 🚀
