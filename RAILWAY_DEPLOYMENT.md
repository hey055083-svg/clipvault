# 🚀 Railway Deployment Guide for ClipVault

Railway is the easiest way to deploy your ClipVault backend. It takes **5 minutes** and costs **$0** to start.

---

## **Step 1: Sign Up for Railway**

1. Go to [Railway.app](https://railway.app)
2. Click **"Start Project"**
3. Sign up with GitHub (easiest option)
4. Authorize Railway to access your GitHub account

---

## **Step 2: Create New Project**

1. Click **"New Project"**
2. Choose **"Deploy from GitHub repo"**
3. Search for your `clipvault` repository
4. Select it and click **"Deploy"**

Railway will automatically:

- ✅ Detect Node.js from `package.json`
- ✅ Install dependencies (`npm install`)
- ✅ Run `npm run api` to start the server
- ✅ Assign a public URL (like `https://clipvault-api-xxxxx.railway.app`)

**⏱️ Wait 2-3 minutes** for the deployment to complete.

---

## **Step 3: Verify Deployment**

Once deployed, Railway shows a green **"Running"** status.

Test the API by opening in your browser:

```
https://your-railway-url/api/health
```

Should return:

```json
{
  "status": "ClipVault API is running! 🚀",
  "version": "1.0.0",
  "timestamp": "2026-02-14T09:56:14.907Z"
}
```

---

## **Step 4: Get Your API URL**

In Railway Dashboard:

1. Select your ClipVault project
2. Go to **"Deployments"** tab
3. Click the **Domain** link (e.g., `clipvault-api-xxxxx.railway.app`)
4. **Copy this URL** - you'll need it for the next step

---

## **Step 5: Connect Frontend to Backend**

Now tell your Netlify frontend where the backend is:

### **A. Go to Netlify Dashboard**

1. Select your ClipVault site
2. Go to **Settings** → **Build & deploy** → **Environment**
3. Click **"Edit variables"**

### **B. Add Environment Variable**

Create new variable:

- **Key:** `VITE_API_URL`
- **Value:** `https://clipvault-api-xxxxx.railway.app` (your Railway URL)

### **C. Trigger Redeploy**

1. Go back to your site
2. Click **"Deploys"** tab
3. Click **"Trigger deploy"** → **"Deploy site"**
4. **Wait 1-2 minutes** for build to complete

---

## **Step 6: Test Completely**

Your full app should now work end-to-end:

1. Open `https://your-site.netlify.app`
2. Paste a YouTube/TikTok/Instagram URL
3. Click "Download"
4. Modal should show "Ready to Download"
5. Click "Download Now" → Opens download page
6. Download starts! ✅

---

## **Current Setup Architecture**

```
┌─ Browser (user) ─┐
│                  │
│  User enters URL │
│  in Netlify app  │
│  (frontend)      │
│                  │
└──────────────────┘
         │
         │ (calls)
         ▼
┌─────────────────────────────┐
│   Railway Backend API       │
│  (Node.js + Python yt-dlp)  │
│  Port 5000 running          │
│  Handles all downloads      │
└─────────────────────────────┘
         │
         │ (returns download link)
         ▼
┌──────────────────┐
│ Trusted Services │
│ (SaveFrom, etc)  │
│ Actual files!    │
└──────────────────┘
```

---

## **What Happens Behind the Scenes**

When you click **"Download Now"**:

1. **Frontend** (Netlify) sends request to **Backend** (Railway)
2. **Backend** uses our trusted services to find download link
3. **Backend** returns direct download link to frontend
4. **Frontend** opens download page in new tab
5. **User** clicks download on download service page
6. **File** downloads to user's computer ✅

---

## **Troubleshooting Railway Deployment**

### **Issue: Build fails with error**

- Check **Deployments** → Click latest → **View logs**
- Most common: Missing `BUILD_COMMAND` in environment
- **Solution:** Railway auto-detects from `package.json` - it should work!

### **Issue: API not responding**

- Test: `https://your-railway-url/api/health`
- Should return 200 OK with JSON
- If timeout: API is still starting, wait 30 seconds

### **Issue: Downloads don't work**

- Make sure `VITE_API_URL` is set in Netlify
- Check that both servers are running:
  - Frontend: `https://your-site.netlify.app`
  - Backend: `https://your-railway-url/api/health` (200 OK)

### **Issue: Port issues**

- Railway automatically detects port from `package.json`
- Our API runs on port 5000 (hardcoded in `api/server.js`)
- Don't need to change anything!

---

## **Upgrading as You Grow**

Railway's free tier includes:

- ✅ **$5 free credit** per month
- ✅ **Unlimited projects**
- ✅ **Unlimited bandwidth**
- ✅ **Auto-scaling**

Our API uses ~**0.2 credits/month** at normal usage.

When you exceed free tier:

- Railway charges **pay-as-you-go** ($0.50 per CPU-hour)
- Still very affordable for a download service

---

## **Environment Variables in Railway**

You can add more variables in Railway Dashboard:

1. Go to your project
2. **Settings** → **Variables**
3. Add any of these (optional):

| Variable   | Value        | Purpose                        |
| ---------- | ------------ | ------------------------------ |
| `NODE_ENV` | `production` | Optimization flag (optional)   |
| `PORT`     | `5000`       | API port (already set in code) |

---

## **One-Click Deploy Button (GitHub Integration)**

Railway watches your GitHub repo. Every time you push:

1. Railway **automatically rebuilds**
2. Deploys the latest version
3. Zero downtime! ✅

So you can just:

```
git push
```

And Railway handles the rest.

---

## **Final Checklist** ✅

- [ ] GitHub account with clipvault repo
- [ ] Railway.app account (free)
- [ ] Connected GitHub repo to Railway
- [ ] Got Railway API URL
- [ ] Set `VITE_API_URL` in Netlify
- [ ] Redeployed Netlify frontend
- [ ] Backend health check returns 200 OK
- [ ] Frontend makes API calls (check browser console)
- [ ] Download button opens download page
- [ ] File downloads successfully!

---

## **Compare Hosting Options**

| Provider    | Cost       | Setup Time | Deployment            |
| ----------- | ---------- | ---------- | --------------------- |
| **Railway** | $5 free/mo | 5 min      | Git push auto-deploys |
| Render.com  | $7/mo      | 10 min     | Git push auto-deploys |
| Heroku      | $7/mo      | 10 min     | Git push auto-deploys |

**Recommendation: Use Railway** - it's the easiest and free tier covers our needs perfectly.

---

## **Need Help?**

### **CLI Deployment Alternative**

If GitHub integration doesn't work:

```bash
# 1. Install Railway CLI
npm install -g @railway/cli

# 2. Login
railway login

# 3. Create new project
railway init

# 4. Deploy
railway up

# 5. Get URL
railway open
```

---

You're all set! Your ClipVault is now live on the internet! 🎉

Next: Tell your friends and test with real videos!
