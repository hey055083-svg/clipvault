# 🚀 GitHub + Railway Deployment Guide

Your code is now ready to push to GitHub and deploy to Railway! Follow these steps.

---

## **Step 1: Create a GitHub Repository**

### **Option A: Use GitHub Web (Easiest)**

1. Go to [GitHub.com](https://github.com) and log in
2. Click the **"+"** icon (top right) → **"New repository"**
3. Fill in:
   - **Repository name:** `clipvault` (or anything you want)
   - **Description:** Professional Online Video Downloader
   - **Visibility:** Public (anyone can see) or Private (only you)
4. **DO NOT** check "Initialize with README" (you already have files)
5. Click **"Create repository"**
6. You'll see a page with commands to push existing code → **Follow Step 2 below**

### **Option B: Use GitHub CLI (Faster)**

If you have [GitHub CLI](https://cli.github.com) installed:

```powershell
gh repo create clipvault --source=. --remote=origin --push
```

---

## **Step 2: Push Your Code to GitHub**

GitHub will show you these commands after creating the repo. Run them:

```powershell
cd "c:\Users\Nabin thapa\Downloads\clipvault---professional-online-video-downloader"

# Set the remote URL (replace YOUR_USERNAME and YOUR_REPO)
git remote add origin https://github.com/YOUR_USERNAME/clipvault.git

# Rename branch to main
git branch -M main

# Push the code
git push -u origin main
```

**Replace:**

- `YOUR_USERNAME` with your GitHub username
- `clipvault` with your repo name (if different)

**Example:**

```powershell
git remote add origin https://github.com/nabin/clipvault.git
git branch -M main
git push -u origin main
```

**You'll be asked for credentials:**

- **Option 1:** Enter GitHub username/password
- **Option 2:** Use Personal Access Token (recommended)
  - Go to GitHub Settings → Developer settings → Personal access tokens
  - Create new token with `repo` permission
  - Use the token as password

---

## **Step 3: Verify on GitHub**

1. Go to your repo: `https://github.com/YOUR_USERNAME/clipvault`
2. You should see:
   - ✅ All your files listed
   - ✅ `main` branch showing code
   - ✅ Commit message visible

---

## **Step 4: Deploy to Railway**

### **A. Sign Up for Railway (Free)**

1. Go to [Railway.app](https://railway.app)
2. Click **"Start Project"**
3. Sign up with GitHub (authorize Railway)

### **B. Create New Project from GitHub Repo**

1. In Railway Dashboard, click **"New Project"**
2. Choose **"Deploy from GitHub repo"**
3. Authorize Railway to access your GitHub
4. Select your `clipvault` repo
5. Click **"Deploy"**

Railway will automatically:

- ✅ Detect Node.js from `package.json`
- ✅ Install dependencies
- ✅ Run `npm run api` to start the server
- ✅ Assign you a public URL

**⏱️ Wait 2-3 minutes for deployment to complete.**

### **C. Get Your Railway URL**

Once deployed (green "Running" status):

1. Click your project in Railway
2. Go to **"Deployments"** tab
3. Click the **"Domain"** link (e.g., `clipvault-api-xxxxx.railway.app`)
4. **Copy this URL** - you need it for Netlify!

---

## **Step 5: Connect to Netlify Frontend**

1. Go to [Netlify.app](https://netlify.app) and log in
2. Click **"Add new site"** → **"Import an existing project"**
3. Choose **GitHub** and select your `clipvault` repo
4. **Build settings** (auto-detected):
   - Build command: `npm run build`
   - Publish directory: `dist`
5. Click **"Deploy site"** and wait 2-3 minutes

### **Add Environment Variable to Netlify:**

1. Go to your Netlify site
2. **Settings** → **Build & deploy** → **Environment**
3. Click **"Edit variables"**
4. Add:
   - **Key:** `VITE_API_URL`
   - **Value:** Your Railway URL (e.g., `https://clipvault-api-xxxxx.railway.app`)
5. **Save** and go to **Deployments** → **Trigger deploy** → **Deploy site**

**Wait 1-2 minutes for the rebuild.**

---

## **Step 6: Test Everything Works!**

1. Go to your Netlify URL: `https://your-site.netlify.app`
2. Paste a YouTube/TikTok/Instagram URL
3. Click "Download"
4. Modal should show "Ready to Download"
5. Click "Download Now"
6. Should open download page
7. Click to download → Works! ✅

---

## **Complete Checklist**

- [ ] GitHub account created
- [ ] Repository created on GitHub
- [ ] Local code pushed to GitHub (`git push` completed)
- [ ] Railway account signed up
- [ ] Railway connected to GitHub repo
- [ ] Railway shows "Running" status (green)
- [ ] Got Railway API URL
- [ ] Netlify connected to GitHub repo
- [ ] `VITE_API_URL` set in Netlify with Railway URL
- [ ] Netlify redeployed after env var change
- [ ] Everything tested and working! ✅

---

## **Your Architecture is Now:**

```
┌──────────────────────────────────────┐
│  GitHub (Your Source Code)           │
│  https://github.com/YOUR/clipvault   │
└────────┬─────────────────┬───────────┘
         │                 │
         │ (auto-deploys)  │ (auto-deploys)
         ▼                 ▼
┌─────────────────┐  ┌──────────────────┐
│  Netlify        │  │  Railway         │
│  Frontend       │  │  Backend API     │
│  3000 Lines CSS │  │  Node.js + Python│
│  React 19.2.4   │  │  yt-dlp          │
└────────┬────────┘  └────────┬─────────┘
         │                    │
         └─────────┬──────────┘
                   │
              User connects
           Frontend ↔ Backend
                   │
                   ▼
          Download works! 🎉
```

---

## **Automatic Deployments**

After initial setup, every time you:

```bash
git push
```

Both GitHub, Netlify, and Railway will **automatically redeploy**! No manual steps needed.

---

## **Troubleshooting**

### **Push to GitHub fails**

```powershell
# Check if remote is set
git remote -v

# Should show:
# origin  https://github.com/YOUR_USERNAME/clipvault.git (fetch)
# origin  https://github.com/YOUR_USERNAME/clipvault.git (push)

# If not, add it:
git remote add origin https://github.com/YOUR_USERNAME/clipvault.git
git branch -M main
git push -u origin main
```

### **Railway deployment fails**

- Check logs: **Deployments** → Click latest → **View logs**
- Most common: Missing `npm run build` or `npm start`
- We use `npm run api` which is in `package.json` ✅

### **Netlify shows 404**

- Make sure `VITE_API_URL` is set in environment variables
- Redeploy Netlify after setting env var

### **Download doesn't work**

- Check Netlify build log for errors
- Test Railway API: `https://your-railway-url/api/health`
- Should return 200 OK with JSON

---

## **Quick Commands Summary**

```powershell
# Check git status
git status

# See all commits
git log --oneline

# Make changes and commit
git add .
git commit -m "Your message"
git push

# Check remote URL
git remote -v

# View what's on branch
git show main
```

---

## **You're Set! 🎉**

Your ClipVault is now:

- ✅ On GitHub (backed up + version controlled)
- ✅ Deployed to Railway (backend running)
- ✅ Deployed to Netlify (frontend live)
- ✅ Auto-deploying on every `git push`
- ✅ Working for users worldwide

**Next:**

- Share the Netlify URL with friends!
- Test with real videos
- Monitor performance in Railway + Netlify dashboards
- Make updates and `git push` → Auto-deploys!

---

## **Real-World Example**

After setup, this is all you need to do to update your app:

```powershell
# Make changes to code
# Edit components, fix bugs, add features...

# Commit changes
git add .
git commit -m "Fixed download speed"
git push

# That's it!
# ✅ GitHub updated
# ✅ Netlify redeploying
# ✅ Railway redeploying
# ✅ Live in 2-3 minutes!
```

Done! Your ClipVault is production-ready! 🚀
