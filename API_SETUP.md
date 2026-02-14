# 🎬 ClipVault Download Architecture

## How It Works

ClipVault uses a **Hybrid Download System** with intelligent fallback:

```
┌─────────────────────────────────────────────────────────┐
│  User Clicks "Download"                                 │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│  Try ClipVault API (yt-dlp backend)                     │
│  ✅ Direct download (fastest!)                          │
│  ⏱️  Timeout: 10 seconds                                │
└────────────────────┬────────────────────────────────────┘
                     │
          ┌──────────┴──────────┐
          │                     │
          ▼                     ▼
       SUCCESS              FAIL/TIMEOUT
          │                     │
          ▼                     ▼
    Direct Download    Fallback Services
       (our server)     (SaveFrom, Y2Mate, etc)
          │                     │
          └──────────┬──────────┘
                     │
                     ▼
           User Gets Download! 🎉
```

---

## Setup Instructions

### Option 1: With Custom Backend (Recommended for Production)

#### Prerequisites

- **Python 3.8+** installed
- **yt-dlp** package: `pip install yt-dlp`

#### Installation

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Start Frontend Dev Server:**

   ```bash
   npm run dev
   # Runs on: http://localhost:3007
   ```

3. **Start API Backend (in another terminal):**

   ```bash
   npm run api
   # Runs on: http://localhost:5000
   ```

4. **Test the API:**

   ```bash
   curl http://localhost:5000/api/health
   # Should return: { "status": "ClipVault API is running! 🚀" }
   ```

5. **Try a download:**
   - Go to http://localhost:3007
   - Paste a video URL
   - Click "Download"
   - If API is running → Direct download! ✅
   - If API fails → Fallback to alternatives ✅

---

### Option 2: Without Backend (Fallback Only)

If you don't want to set up the backend:

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Start Frontend Only:**

   ```bash
   npm run dev
   # Runs on: http://localhost:3007
   ```

3. **All downloads will use trusted third-party services automatically** (SaveFrom, Y2Mate, SnapTik, etc.)

---

## Installation Guide for yt-dlp

### Windows

1. **Install Python:** https://www.python.org/downloads/

2. **Install yt-dlp:**

   ```bash
   pip install yt-dlp
   ```

3. **Verify installation:**
   ```bash
   yt-dlp --version
   ```

---

## API Endpoints

### `POST /api/download`

Download a video/audio

**Request:**

```json
{
  "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  "format": "best",
  "contentType": "video"
}
```

**Success Response:**

```json
{
  "success": true,
  "title": "Video Title",
  "duration": 180,
  "filename": "video-title.mp4",
  "ext": "mp4",
  "url": "https://download-url.com/file.mp4"
}
```

**Failure Response (triggers fallback):**

```json
{
  "success": false,
  "error": "Video unavailable",
  "fallbackNeeded": true
}
```

### `GET /api/health`

Check if API is running

**Response:**

```json
{
  "status": "ClipVault API is running! 🚀"
}
```

---

## Supported Platforms

Both API and fallback services support:

- ✅ YouTube
- ✅ Spotify
- ✅ TikTok
- ✅ Instagram
- ✅ Facebook
- ✅ Vimeo
- ✅ Twitch
- ✅ Twitter/X
- ✅ Reddit
- ✅ LinkedIn
- ✅ SoundCloud
- ✅ Dailymotion
- ✅ 200+ other platforms (via yt-dlp)

---

## How Fallback Works

If our API fails for any reason:

1. ✅ 3-4 alternative download services are shown
2. ✅ User can try each one
3. ✅ At least one always works

Example for YouTube:

- SaveFrom.net (most reliable)
- Y2Mate
- Clip Converter
- Online Video Converter

---

## Troubleshooting

### API won't start

```bash
# Check if yt-dlp is installed
yt-dlp --version

# If not installed:
pip install yt-dlp --upgrade

# Check if port 5000 is in use
# Windows: netstat -ano | findstr :5000
# Mac/Linux: lsof -i :5000
```

### Downloads timing out

- Yt-dlp has a 10-second timeout
- Very large videos might fail → fallback handles it
- Check your internet connection

### API health check fails

- Make sure API server is running (`npm run api`)
- Check port 5000 is open
- Verify no CORS issues in browser console

---

## Production Deployment

For production deployment:

1. **Frontend:** Deploy `/dist` folder to Vercel, Netlify, or any static host
2. **API:** Deploy `api/server.js` to Heroku, Railway, or your own VPS

Example `.env` for production:

```
VITE_API_URL=https://your-api-domain.com
```

Then update `downloadService.ts`:

```typescript
const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
```

---

## License & Legal

⚠️ **Important:**

- Video downloads may violate platform ToS
- Use responsibly for personal use only
- Always respect copyright
- Fallback services handle legal responsibility

---

## Support

For issues:

1. Check console logs (`F12` in browser)
2. Verify yt-dlp is installed and updated
3. Try fallback services
4. Check internet connection
