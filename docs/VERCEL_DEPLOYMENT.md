# Vercel Deployment Setup

## Prerequisites
- Vercel account
- GitHub repo connected to Vercel project

## Setup Instructions

### 1. Add Environment Variables to Vercel

Go to your Vercel project dashboard:
1. **Settings** → **Environment Variables**
2. Add the following variable:
   - Key: `OXLO_API_KEY`
   - Value: Your OXLO API key (get from https://oxlo.ai)
   - Environments: **Production**, **Preview**, **Development** (select all)
3. Click **Save**

### 2. Redeploy

After adding environment variables:
1. Go to **Deployments**
2. Find your latest deployment
3. Click the **⋮** menu → **Redeploy**
4. Or simply push a new commit to trigger new deployment

## Important Notes

⚠️ **Security**: 
- NEVER commit `.env` file to git
- Always use Vercel Environment Variables for sensitive keys
- The `.env` file in your repo is for local development only

## CSS Not Rendering Issue

If styles are still not appearing:

1. **Clear browser cache** (Ctrl+Shift+Delete or Cmd+Shift+Delete)
2. **Force refresh** (Ctrl+F5 or Cmd+Shift+R)
3. **Check DevTools**:
   - Open DevTools (F12)
   - Go to Network tab
   - Look for CSS files in `_astro/` folder  
   - They should have status 200 and content

4. **Check Vercel Logs**:
   - Go to **Deployments** → Click latest deployment
   - Check logs for any CSS/build errors

## Troubleshooting

### 500 Internal Server Error
- Check that `OXLO_API_KEY` is set in Vercel Environment Variables
- Check Vercel function logs in deployment

### Styles not loading
- Verify CSS files load in Network tab (should be in `_astro/` folder)
- Check browser console for any errors

### API calls failing  
- Ensure `OXLO_API_KEY` is correct
- Verify OXLO API endpoint is accessible
- Check Vercel function logs
