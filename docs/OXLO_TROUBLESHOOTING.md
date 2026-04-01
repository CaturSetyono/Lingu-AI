# OXLO Integration Troubleshooting Guide

## Common Issues dengan OXLO Provider

### 1. **Failed to Fetch Error**

#### Kemungkinan Penyebab:

**A. Missing atau Invalid API Key**
```
Error: Invalid OXLO API key. Please check your OXLO_API_KEY in environment variables.
```

**Solusi:**
- Pastikan `OXLO_API_KEY` sudah di-set di file `.env`
- Format key: `sk_K...` (dimulai dengan `sk_K`)
- Jangan copy paste, cek kembali karakternya
- Restart dev server setelah update `.env` (`npm run dev`)

**B. Network Connection Error**
```
Error: Network error connecting to OXLO. Please check your internet connection.
```

**Solusi:**
- Pastikan internet terhubung
- Cek apakah OXLO API server sedang down: https://status.oxlo.com
- Coba test dengan curl:
```bash
curl -X POST https://api.oxlo.ai/v1/chat/completions \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "deepseek-r1-8b",
    "messages": [{"role": "user", "content": "hello"}],
    "max_tokens": 512
  }'
```

**C. Request Timeout**
```
Error: Request timeout. OXLO is taking too long to respond. Try again later.
```

**Solusi:**
- Deepseek-r1-8b memerlukan waktu lebih lama untuk berpikir (thinking time)
- Timeout sudah di-set ke 60 detik
- Coba lagi dengan text yang lebih pendek
- Coba pada waktu yang berbeda (mungkin server OXLO sedang high-load)

**D. Rate Limited Error**
```
Error: OXLO rate limited. Please try again in a few moments.
```

**Solusi:**
- Tunggu beberapa menit sebelum mencoba lagi
- Check OXLO quota/limits di dashboard

### 2. **Debugging Steps**

#### A. Check Browser Console
1. Buka DevTools (F12)
2. Tab "Console"
3. Cari logs yang dimulai dengan:
   - `API Response Status:` - menampilkan HTTP status
   - `API Error Response:` - detail error dari API
   - `Error Data:` - response body error
   - `Calling OXLO API with model:` - konfirmasi model yang digunakan

#### B. Check Server Logs
Lihat terminal console dimana `npm run dev` berjalan:
```
Calling OXLO API with model: deepseek-r1-8b
OXLO API Error: [error detail]
```

#### C. Manual API Test

**Test OpenRouter (untuk membandingkan):**
```bash
curl -X POST https://openrouter.ai/api/v1/chat/completions \
  -H "Authorization: Bearer sk-or-..." \
  -H "Content-Type: application/json" \
  -d '{
    "model": "qwen/qwen3.6-plus-preview:free",
    "messages": [{"role": "user", "content": "hello"}],
    "max_tokens": 100
  }'
```

**Test OXLO:**
```bash
curl -X POST https://api.oxlo.ai/v1/chat/completions \
  -H "Authorization: Bearer sk_K..." \
  -H "Content-Type: application/json" \
  -d '{
    "model": "deepseek-r1-8b",
    "messages": [{"role": "user", "content": "hello"}],
    "max_tokens": 512
  }'
```

### 3. **Configuration Checklist**

- [ ] OXLO_API_KEY ada di `.env`
- [ ] Format key benar: `sk_K...`
- [ ] Tidak ada spasi di awal/akhir key
- [ ] Dev server sudah di-restart setelah update `.env`
- [ ] Provider dipilih "OXLO" di Settings → AI Provider dropdown
- [ ] Internet connection aktif
- [ ] OXLO API endpoint aktif (https://api.oxlo.ai/v1)

### 4. **Model Details**

- **Model ID:** `deepseek-r1-8b`
- **Base URL:** `https://api.oxlo.ai/v1`
- **Temperature:** 0.7
- **Max Tokens:** 2000
- **Timeout:** 60 detik

### 5. **Error Message Mapping**

| Error Message | Penyebab | Solusi |
|---|---|---|
| Invalid OXLO API key | API key salah/kadaluarsa | Update key di .env |
| Network error | Internet putus/firewall | Check koneksi internet |
| Request timeout | Server lambat | Tunggu, coba lagi |
| Rate limited | Terlalu banyak request | Tunggu beberapa menit |
| No response | Server error | Coba OpenRouter sebagai backup |

### 6. **Fallback Strategy**

Jika OXLO terus error, user bisa:
1. Buka Settings
2. Ubah AI Provider ke "OpenRouter"
3. OpenRouter akan gunakan Qwen 3.6 Plus Preview (free)

## Environment Variables Template

```env
# OpenRouter (Primary)
OPENROUTER_API_KEY=sk-or-v1-...

# OXLO (Alternative)
OXLO_API_KEY=sk_K...
```

## Support

- OXLO Issues: https://oxlo.com/support
- OpenRouter Issues: https://openrouter.ai/request-support
- App Issues: Check GitHub issues

---

**Last Updated:** April 1, 2026
