# 🚀 ClipVault Netlify Deployment Guide

## **Prerequisites**

- ✅ GitHub account with your repo pushed
- ✅ Netlify account (free tier OK)
- ✅ Railway or Render account for backend (free tier OK)
- ✅ Gemini API key from Google AI Studio

---

## **Step 1: Deploy Frontend to Netlify**

### **Connect Your GitHub Repo:**

1. Log in to [Netlify Dashboard](https://app.netlify.com)
2. Click **"Add new site"** → **"Import an existing project"**
3. Choose **GitHub** and authorize
4. Select your `clipvault` repository
5. Netlify will auto-detect:
   - Build command: `npm run build`
   - Publish directory: `dist`
6. Click **"Deploy site"**

### **Set Environment Variables in Netlify:**

1. Go to your site → **Settings** → **Build & deploy** → **Environment**
2. Click **"Edit variables"** and add:

| Key            | Value                               | Notes                         |
| -------------- | ----------------------------------- | ----------------------------- |
| `VITE_API_URL` | `https://clipvault-api.railway.app` | Your backend URL (see Step 2) |

3. Your frontend is now live at `https://your-site-name.netlify.app` ✅

---

## **Step 2: Deploy Backend to Railway**

### **Quick Railway Setup (5 minutes):**

1. Go to [Railway.app](https://railway.app)
2. Click **"New Project"** → **"Deploy from GitHub"**
3. Select your `clipvault` repo
4. Railway will auto-detect `package.json`
5. Add this environment variable:
   - Key: `NODE_ENV`
   - Value: `production`

6. Click **"Deploy"**
7. You'll get a URL like: `https://clipvault-api-xxxxx.railway.app`

### **OR Use Render (Alternative to Railway):**

1. Go to [Render.com](https://render.com)
2. Click **"New +"** → **"Web Service"**
3. Connect GitHub repo
4. Settings:
   - **Name:** `clipvault-api`
   - **Build Command:** `npm install`
   - **Start Command:** `npm run api`
   - **Region:** Pick closest to you
5. Click **"Create Web Service"**
6. Copy your URL and use in Step 1

---

## **Step 3: Connect Backend to Frontend**

1. Copy your backend URL from Railway (e.g., `https://clipvault-api-xxxxx.railway.app`)
2. Go to **Netlify Dashboard** → Your site → **Settings** → **Build & deploy** → **Environment variables**
3. Update `VITE_API_URL=https://your-backend-url.app`
4. **Important:** Manually trigger a redeploy:
   - Go to **Deploys** → Click **"Trigger deploy"** → **"Deploy site"**
   - Wait 1-2 minutes for build to complete

Your app is now live! 🎉

---

## **Optional: Custom Domain Setup**

1. In Netlify → **Settings** → **Domain management** → **Add custom domain**
2. Follow DNS setup instructions (usually 5 minutes)
3. Free SSL certificate included automatically

---

## **Troubleshooting**

### **Downloads not working?**

- ✅ Check `VITE_API_URL` is set correctly in Netlify
- ✅ Verify backend is running: Open `https://your-api-url/api/health` in browser
- ✅ Should see: `{"status":"ClipVault API is running! 🚀"}`

### **Build fails?**

- Check build logs in **Netlify Dashboard** → **Deploys** → Latest build → **Build log**
- Most common: Missing `VITE_API_URL` environment variable

### **CORS errors?**

- Backend already has `Access-Control-Allow-Origin: *`
- No additional config needed

---

## **Environment Variables Summary**

| Variable       | Where Set         | Value            | Example                             |
| -------------- | ----------------- | ---------------- | ----------------------------------- |
| `VITE_API_URL` | Netlify Dashboard | Your backend URL | `https://clipvault-api.railway.app` |
| `NODE_ENV`     | Railway Dashboard | `production`     | `production`                        |

---

## **Final Checklist**

- ✅ Frontend deployed to Netlify
- ✅ Backend deployed to Railway/Render
- ✅ `VITE_API_URL` set in Netlify
- ✅ Redeployed frontend after setting env vars
- ✅ Test at `https://your-site.netlify.app`
- ✅ Try downloading a video - should work!

---

**That's it!** Your ClipVault is now live on the internet! 🚀
