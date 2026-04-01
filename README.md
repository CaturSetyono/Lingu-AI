# LinguAI Studio - AI Text Rewriting PWA

**Tagline:** Zero-friction, high-control AI writing assistant. Rewrite text instantly with customizable tone, style, and formatting.

## 🎯 What is LinguAI Studio?

LinguAI Studio is a **Progressive Web App (PWA)** that leverages AI to rewrite and improve text with deep parameter control. It's designed for:

- **Speed**: No registration needed. Start rewriting immediately.
- **Privacy**: All settings stored locally. No server storage of your text.
- **Control**: Fine-tune tone, style, language, and length for each rewrite.
- **Mobile-First**: Optimized for one-handed thumb-friendly interaction.
- **Neo-Brutalism**: Bold, striking design that's as functional as it is aesthetic.

## ✨ Features

### Core Features (MVP - Phase 1) ✅

- ✅ **Text Rewriting** — Input any text, get AI-powered alternatives
- ✅ **4-Parameter Control** — Adjust tone, style, language, length
- ✅ **Custom Instructions** — Add personal rewriting rules
- ✅ **LocalStorage Sync** — Settings persist across sessions
- ✅ **Copy-to-Clipboard** — One-click result copying
- ✅ **Real-time Feedback** — Loading states, error handling, success toasts
- ✅ **PWA Install** — Add to home screen (iOS/Android)
- ✅ **Service Worker** — Offline-friendly UI loading
- ✅ **Neo-Brutalism Design** — Bold, high-contrast, minimalist interface

### Coming Soon (Phase 2)

- 🔄 History tracking
- 🎛️ Advanced settings (token limits, temperature)
- 📊 Analytics (local only)
- 💾 Export to PDF/TXT
- ⌨️ Keyboard shortcuts

## 🚀 Quick Start

### Prerequisites

- Node.js 22+
- OpenRouter API key ([get one free](https://openrouter.ai))

### Installation

```bash
# Install dependencies (already done)
npm install

# Setup environment
cp .env.example .env
# Edit .env and add your OpenRouter API key
```

### Development

```bash
npm run dev          # Start http://localhost:4321/
npm run test         # Run tests
npm run build        # Production build
```

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for Vercel deployment.

## 📦 Tech Stack

| Layer         | Technology                 |
| ------------- | -------------------------- |
| **Framework** | Astro 6 + React 19         |
| **Styling**   | Tailwind CSS 4             |
| **AI**        | OpenRouter (Qwen 3.6 Plus) |
| **Storage**   | Browser LocalStorage       |
| **Testing**   | Vitest + Testing Library   |
| **Hosting**   | Vercel Serverless          |

## 🗂️ Project Structure

```
src/
├── pages/
│   ├── index.astro              # Main page
│   └── api/generate.ts          # OpenRouter endpoint
├── components/                  # React + Astro components
├── utils/                       # Storage, prompts, types
└── styles/                      # Global + Neo-Brutalism
public/
├── manifest.json                # PWA config
└── sw.js                        # Service Worker
```

## 🎨 Neo-Brutalism Design

Bold, raw, post-modern aesthetic:

- High contrast colors (`#000` on `#fff`, accent `#ff6b35`)
- Heavy typography (font-900)
- Thick borders (4px)
- Sharp edges (no rounding)

## 🧪 Testing

```bash
npm run test         # Run all tests
npm run test:ui      # Tests with UI
npm run test:run     # CI mode
```

**Coverage**: Storage utilities, prompt engineering, component behavior

## 🌐 Deployment

**See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for complete instructions**

Quick summary:

1. Get OpenRouter API key
2. Push to GitHub
3. Connect to Vercel
4. Add API key to env vars
5. Deploy!

## 📊 Status

🟢 **Phase 1 MVP Complete** - Production Ready

- Build time: ~8s
- Dev startup: ~6s
- 8 components, 16+ tests
- Lighthouse-optimized

## 📚 Documentation

- [PRD.md](./docs/prd.md) — Product requirements
- [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) — Deploy to Vercel
- [API Routes](./src/pages/api/generate.ts) — Endpoint details

## 🙏 Acknowledgments

Built with Astro, React, Tailwind, OpenRouter, and Vercel.

---

**Start rewriting today!** 🚀

Status: 🟢 Phase 1 MVP Complete  
Last Updated: April 1, 2026
