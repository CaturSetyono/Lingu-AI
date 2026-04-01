# Environment Variables & FUNCTION_INVOCATION_FAILED Error Guide

## Understanding the Error

`FUNCTION_INVOCATION_FAILED` with status 500 occurs when your Vercel serverless function crashes during execution. In your case, it's triggered because a critical environment variable is missing at runtime.

---

## The Fundamental Concept: Development vs. Production

### Local Development
```
.env file → Loaded by dev server → process.env available
Your laptop config      Astro reads it    In your code
```

### Production (Vercel)
```
.env file → ❌ NOT uploaded → process.env undefined
Local only   Security measure   Function crashes
```

**Why the difference?** 
- Your `.env` file contains secrets (API keys, database passwords, etc.)
- Uploading it to version control or deployment platforms is a security risk
- Best practice: `.env` should be in `.gitignore` and secrets managed separately

---

## What Happened in Your Code

### The Execution Chain:
1. Vercel deploys your app (`.env` not included)
2. User calls `/api/generate` endpoint
3. POST handler executes → calls `callAI()`
4. `callAI()` tries to read: `const apiKey = process.env.OXLO_API_KEY` → Returns `undefined`
5. OpenAI client initialization fails with `undefined`
6. Unhandled error crashes the entire function
7. Vercel responds: `FUNCTION_INVOCATION_FAILED`

### Code Analysis:
```typescript
// ❌ This was risky - no early return
if (!apiKey) {
  return { error: "..." };  // Returns error object, but SDK might still initialize badly
}

const client = new OpenAI({
  apiKey: apiKey,  // ← Could be undefined from a type perspective
  // ...
});
```

The issue: While there's a check, the error message suggests a configuration problem, but the OpenAI SDK might fail in unexpected ways when actually instantiated.

---

## The Solution

### 1. Set Environment Variable in Vercel ✅

**Steps:**
1. Go to: https://vercel.com/dashboard → Your Project → Settings → Environment Variables
2. Add new variable:
   ```
   Name:  OXLO_API_KEY
   Value: sk_KfF0QBQskaKKmvtmd0eSFptPez-jP47t7_NlVmp3afc
   ```
3. Select environments: **✓ Production** (and ✓ Preview if using preview deployments)
4. Click **Save**
5. **Redeploy**: Push to your repository or click "Redeploy" in Vercel dashboard

### 2. Why This Works:
- Vercel automatically injects environment variables into the Node.js process
- `process.env.OXLO_API_KEY` will now be defined at runtime
- Your API route can successfully initialize the OpenAI client

---

## Code Improvements I Made

### More Defensive Error Handling:
```typescript
// Before: ❌
const apiKey = process.env.OXLO_API_KEY;

// After: ✅
const apiKey = process.env.OXLO_API_KEY?.trim();

if (!apiKey) {
  console.error(
    "CRITICAL: OXLO_API_KEY environment variable is not set. This is required for function operation.",
  );
  return {
    error:
      "Server configuration error: Missing OXLO API key. Please contact support.",
  };
}
```

**Improvements:**
- `.trim()` removes accidental whitespace in Vercel UI
- More detailed logging for debugging
- Better error message for front-end users

---

## Warning Signs to Recognize This Pattern

### This error could happen again with:

1. **Any missing environment variable**
   ```typescript
   const dbUrl = process.env.DATABASE_URL;  // undefined on Vercel
   await database.connect(dbUrl);  // Crashes
   ```

2. **Assuming local `.env` is available everywhere**
   ```bash
   # Your .env file
   API_KEY=secret123
   
   # On Vercel: API_KEY is undefined ⚠️
   ```

3. **No fallback for missing critical config**
   ```typescript
   // Bad: No check
   const client = new API({ key: process.env.KEY });
   
   // Good: Always validate
   if (!process.env.KEY) throw new Error("KEY not configured");
   ```

4. **Different behavior locally vs. production**
   - Works fine locally → Crashes on Vercel
   - Classic sign: "It works on my machine!" 🤔

---

## Alternative Approaches

### Option 1: Vercel UI (Recommended) ✅
- **Pros**: Simple, secure, no code changes needed
- **Cons**: Can't test in preview without setting vars
- **Use when**: You have direct access to Vercel dashboard

### Option 2: `.vercel/.env.*.local` Files
- **Pros**: Can version locally but excluded from git
- **Cons**: Requires manual file creation, less portable
- **Use when**: Working in teams with different secrets

```bash
# Create .gitignore entry
echo ".vercel/.env.*.local" >> .gitignore

# Create environment file
echo "OXLO_API_KEY=sk_..." > .vercel/.env.production.local
```

### Option 3: Secrets in Code (NOT RECOMMENDED) ❌
```typescript
// ❌ Never do this!
const API_KEY = "sk_...";  // Hardcoded secrets = security breach

// ✅ Always use environment variables
const API_KEY = process.env.OXLO_API_KEY;
```

### Option 4: Use `@astrojs/vercel` Secrets Configuration
Create `astro.config.mjs`:
```typescript
export default defineConfig({
  adapter: vercel({
    // Vercel automatically loads process.env variables
    // Just set them in Vercel dashboard
  }),
});
```

---

## Testing Locally

### Verify Locally Before Deploying:
```bash
# 1. Ensure .env has the variable
cat .env
# Should output: OXLO_API_KEY=sk_...

# 2. Run dev server
npm run dev

# 3. Test the endpoint
curl -X POST http://localhost:4321/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Hello world",
    "tone": "casual",
    "style": "concise",
    "language": "en",
    "length": "original"
  }'

# 4. Check for errors in console
# Should see: "Calling OXLO API with model: deepseek-r1-8b"
# Should NOT see: "CRITICAL: OXLO_API_KEY environment variable is not set"
```

### Pre-Deploy Checklist:
- ✅ `.env` file exists locally with `OXLO_API_KEY`
- ✅ `OXLO_API_KEY` exists in Vercel dashboard
- ✅ `.env` is in `.gitignore` (never commit secrets)
- ✅ Test locally: `npm run dev` and call API
- ✅ Deploy: `git push` triggers Vercel rebuild

---

## Broader Architectural Lesson

### The Three-Layer Security Model:

1. **Local Development** 🏠
   - `.env` file with real secrets
   - Only on your machine
   - Never committed to git

2. **Version Control** 📦
   - No secrets in code or commits
   - `.env` in `.gitignore`
   - Configuration examples: `.env.example`

3. **Production** ☁️
   - Secrets managed separately (Vercel dashboard, AWS Secrets Manager, etc.)
   - Injected at runtime
   - Never exposed in deployments

```
┌─────────────────┐
│  .env (SECRET)  │  ← Local only
└────────┬────────┘
         │ (.gitignore)
         ↓
    ┌───────────────────────┐
    │ Process.env variables │  ← At runtime
    └────────┬──────────────┘
             ↓
    ┌──────────────────────────────┐
    │ Application code             │
    │ (can safely use secrets)     │
    └──────────────────────────────┘
```

---

## FAQ

**Q: Why can't Vercel just read my `.env` file?**
A: Because `.env` files contain secrets and should never be uploaded to any server. Only explicit environment variables set in the dashboard are trusted.

**Q: Will my secrets be visible in Vercel logs?**
A: No. Vercel redacts environment variable values in logs automatically.

**Q: Can I test with Vercel Preview Deployments?**
A: Yes, but you need to set the environment variable for the "Preview" environment too in the Vercel dashboard.

**Q: What if I accidentally commit my `.env` file?**
A: 1. Rotate your API keys immediately
   2. Remove the file from git history (use `git filter-branch` or BFG)
   3. Update credentials in Vercel

---

## Next Steps

1. ✅ Set `OXLO_API_KEY` in Vercel dashboard (Production environment)
2. ✅ Trigger a redeploy
3. ✅ Test the `/api/generate` endpoint
4. ✅ Monitor Vercel logs for "CRITICAL" messages
5. ✅ Celebrate! 🎉

If you still see the error, check Vercel logs (Deployments tab → View logs) for the actual error message.
