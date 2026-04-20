# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start dev server at http://localhost:4321/
npm run build      # Production build
npm run preview    # Preview production build locally
npm run test:run   # Run tests once (CI)
npm run test       # Run tests in watch mode
npm run test:ui    # Run tests with Vitest UI dashboard
```

No linter is configured.

## Architecture

**LinguAI Studio** is an AI-powered text rewriting PWA built with Astro (SSR) + React islands + Vercel serverless functions.

**Stack**: Astro 6 (`output: "server"`) · React 19 · Tailwind CSS · OpenAI SDK (pointed at OXLO/OpenRouter proxy) · Vitest + Testing Library

**Two routes matter most**:
- `/app` (`src/pages/app.astro`) — loads the React `App.tsx` component via `client:load`
- `/api/generate` (`src/pages/api/generate.ts`) — POST endpoint; builds prompts → calls OXLO API → returns rewritten text

**React component tree** (`src/components/`):
```
App.tsx  ← owns all state (settings, inputText, result, loading, toasts)
├── InputBox
├── SettingsPanel  ← tone / style / language / length + custom prompt
├── ActionButton
├── OutputBox      ← renders AI output via react-markdown
└── Toast[]
```

**Settings** (tone, style, language, length, custom prompt) are persisted to `localStorage` via `src/utils/storage.ts` under key `"linguai-settings"`. `initializeStorage()` is called on mount; `saveSettings()` is called on every change.

**Prompt building** is centralized in `src/utils/prompts.ts` (`buildSystemPrompt`, `buildUserPrompt`, `validateInput`). All option lists and limits (max 5000 chars, model name, API timeout) live in `src/utils/constants.ts`.

**AI call flow**: `App.tsx` POSTs to `/api/generate` → `generate.ts` validates → builds prompts → `openai` SDK pointed at OpenRouter (`https://openrouter.ai/api/v1`) → error recovery with specific messages for 401/429/timeout/network.

## Environment

Single required env var:
```
OPENROUTER_API_KEY=your_key_here
```

## Testing

Tests live alongside source files (`*.test.ts`, `*.test.tsx`). Coverage exists for `InputBox`, `prompts.ts`, and `storage.ts`. The jsdom environment is configured in `vitest.config.ts`; `@testing-library/jest-dom` matchers are set up in `vitest.setup.ts`.

## Design System

Neo-Brutalism: thick borders (2–4px), offset hard shadows (`4px 4px 0 #0d0d0d`), high-contrast black/white/blue palette, no gradients. Design tokens are CSS variables in `src/styles/global.css`. Fonts: `Space Grotesk` (UI) and `Space Mono` (monospace/inputs).

## Deployment

Deployed on Vercel via `@astrojs/vercel` adapter. SSR + API routes become serverless functions automatically. Inject `OXLO_API_KEY` as a Vercel environment variable.
