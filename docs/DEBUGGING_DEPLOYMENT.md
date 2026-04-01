# 🔍 Debugging FUNCTION_INVOCATION_FAILED Error

## Status Check (Langkah Pertama)

Buka browser dan akses:
```
https://your-vercel-url.vercel.app/api/health
```

**Apa yang seharusnya Anda lihat:**
```json
{
  "timestamp": "2026-04-01T...",
  "environment": {
    "hasOxloKey": true,
    "keyLength": 65,
    "nodeEnv": "production"
  },
  "deployment": {
    "model": "deepseek-r1-8b",
    "baseUrl": "https://api.oxlo.ai/v1"
  },
  "status": "healthy",
  "issues": []
}
```

**Jika status adalah "unhealthy":**
Pergi ke: **Settings → Environment Variables** di Vercel dashboard dan pastikan:
- ✅ Variable name: `OXLO_API_KEY`
- ✅ Variable value: Paste API key Anda (mulai dengan `sk_`)
- ✅ Environments: Pilih ✓ Production dan ✓ Preview
- ✅ Klik SAVE
- ✅ Trigger redeploy: `git push` atau klik "Redeploy" di Vercel

---

## Mengidentifikasi Masalah

### Masalah 1: "hasOxloKey": false

**Penyebab:**
- Environment variable tidak di-set di Vercel

**Solusi:**
1. Buka Vercel dashboard → Project Anda
2. Settings → Environment Variables
3. Add new variable:
   - Name: `OXLO_API_KEY`
   - Value: (paste dari `.env` lokal)
   - Select: ✓ Production
4. Klik Save → Redeploy

### Masalah 2: /api/health returns 503 but health endpoint works

**Penyebab:**
- Environment variable kosong atau whitespace

**Solusi:**
```bash
# Di Vercel dashboard, pastikan value tidak ada whitespace
# Contoh SALAH: "sk_abc... " (ada space di akhir)
# Contoh BENAR: "sk_abc..."

# Edit variable, hapus whitespace, save
```

### Masalah 3: API call still fails despite health check passing

**Penyebab:**
- OXLO API endpoint tidak accessible
- API key valid tapi tidak punya akses ke model
- Network issue dari Vercel ke OXLO

**Debugging:**
```bash
# 1. Check Vercel Logs
# Di Vercel dashboard → Deployments (recent) → View logs

# 2. Cari logs dengan prefix "[OXLO]" atau "[API]"
# Contoh:
# [OXLO] Initializing OpenAI client for model: deepseek-r1-8b
# [OXLO] Base URL: https://api.oxlo.ai/v1
# [OXLO] Sending request to API...
# [OXLO] API Error Details: ...

# 3. Catat exact error message
```

---

## Testing Locally vs Production

### Local (Development)

```bash
# 1. Pastikan .env memiliki:
cat .env
# Output: OXLO_API_KEY=sk_...

# 2. Start dev server
npm run dev

# 3. Test health endpoint
curl http://localhost:4321/api/health

# 4. Test generate endpoint
curl -X POST http://localhost:4321/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Hello world",
    "tone": "casual",
    "style": "concise",
    "language": "en",
    "length": "original"
  }'

# 5. Jika error, cek terminal untuk [OXLO] atau [API] logs
```

### Production (Vercel)

```bash
# 1. Check health first
curl https://your-app.vercel.app/api/health

# 2. If healthy, test generate
curl -X POST https://your-app.vercel.app/api/generate \
  -H "Content-Type: application/json" \
  -d '{...}'

# 3. If error, check Vercel Logs dashboard
```

---

## Step-by-Step Deployment Checklist

### Before Push:
- [ ] `.env` file exists locally with `OXLO_API_KEY`
- [ ] `.env` is in `.gitignore`
- [ ] Local test: `npm run dev` works
- [ ] Local test: `/api/health` shows `"status": "healthy"`
- [ ] Local test: `/api/generate` works with sample data

### During Vercel Setup:
- [ ] Go to Vercel Project → Settings → Environment Variables
- [ ] Add `OXLO_API_KEY` with full API key
- [ ] Select environment: ✓ Production
- [ ] Click Save
- [ ] Wait for automatic rebuild (or click Redeploy)

### After Deployment:
- [ ] Wait 30 seconds for fully deploy
- [ ] Visit `/api/health` → Should show `"status": "healthy"`
- [ ] If not, check Vercel logs for error
- [ ] If yes, try `/api/generate` with test data

---

## Common Issues & Fixes

| Issue | Symptom | Fix |
|-------|---------|-----|
| Env var missing | `/api/health` shows `hasOxloKey: false` | Add to Vercel dashboard |
| API key wrong | `/api/generate` returns 401 error | Verify key format & value |
| Timeout | Request takes >60 seconds | Check OXLO API status |
| CORS error | Browser blocks request | Not applicable (server-to-server) |
| Unhandled crash | 502/503 error with no logs | Check Vercel function logs |

---

## Accessing Vercel Logs

1. Go to: https://vercel.com/dashboard → Select your project
2. Click: "Deployments" or "Recent deployments"
3. Find the latest deployment (usually shows your branch/commit)
4. Click: "View logs" button
5. Look for logs with `[OXLO]` or `[API]` prefix
6. Filter by time (last 5 minutes usually)

---

## Next Actions

### If /api/health shows healthy:
1. Test `/api/generate` with a POST request
2. If error, check Vercel logs with `[OXLO]` prefix
3. Share the exact error message

### If /api/health shows unhealthy:
1. Go to Vercel Settings → Environment Variables
2. Verify `OXLO_API_KEY` is set correctly
3. Redeploy
4. Refresh `/api/health` after 30 seconds

### If still failing:
1. Run locally to confirm it works
2. Compare local `.env` with Vercel env vars
3. Check if API key has special characters (encode if needed)
4. Try regenerating/refreshing API key in OXLO dashboard
