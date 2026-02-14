import express from "express";
import cors from "cors";
import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";
import os from "os";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

// Detect OS and set the right command
const isWindows = os.platform() === "win32";
const pythonCmd = isWindows ? "py" : "python3";

// CORS configuration - allow all origins in production
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  }),
);

app.use(express.json());

// 🎬 Download endpoint
app.post("/api/download", async (req, res) => {
  const { url, format } = req.body;

  if (!url) {
    return res.status(400).json({ error: "URL required" });
  }

  try {
    console.log(`🎬 Starting download: ${url} - Format: ${format}`);

    // Use yt-dlp via Python module (Windows compatible)
    // This works on Windows, Mac, and Linux

    const args = [
      "-m",
      "yt_dlp",
      url,
      "-j", // JSON output
      "-f",
      format || "best", // Format code
      "--no-warnings",
      "--quiet",
      "--socket-timeout",
      "10",
    ];

    const ydl = spawn(pythonCmd, args, {
      timeout: 30000, // 30 second timeout - yt-dlp needs time
      stdio: ["pipe", "pipe", "pipe"],
    });

    let jsonOutput = "";
    let errorOutput = "";

    ydl.stdout.on("data", (data) => {
      jsonOutput += data.toString();
    });

    ydl.stderr.on("data", (data) => {
      errorOutput += data.toString();
    });

    ydl.on("close", (code) => {
      if (code === 0) {
        try {
          const info = JSON.parse(jsonOutput);
          console.log(`✅ Download ready: ${info.title}`);

          res.json({
            success: true,
            title: info.title || "Video",
            filename: info.filename || "download",
            duration: info.duration || 0,
            ext: info.ext || "mp4",
            url: info.url || url,
            message: "Ready to download from our service!",
          });
        } catch (err) {
          console.error(`❌ Parse error:`, err);
          res.status(500).json({
            success: false,
            error: "Failed to parse download info",
            fallbackNeeded: true,
          });
        }
      } else {
        console.error(`❌ yt-dlp failed: ${errorOutput}`);
        res.status(500).json({
          success: false,
          error: "Download service unavailable",
          fallbackNeeded: true,
        });
      }
    });

    // Timeout after 30 seconds
    setTimeout(() => {
      if (!res.headersSent) {
        ydl.kill();
        res.status(408).json({
          success: false,
          error: "Request timeout",
          fallbackNeeded: true,
        });
      }
    }, 30000);
  } catch (error) {
    console.error("Download error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
      fallbackNeeded: true,
    });
  }
});

// 🏥 Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "ClipVault API is running! 🚀",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Endpoint not found" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res.status(500).json({ error: "Internal server error" });
});

const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || "development";

const server = app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════╗
║          🎬 ClipVault Backend API Server               ║
╠════════════════════════════════════════════════════════╣
║  Environment: ${NODE_ENV.padEnd(43)}║
║  Port: ${String(PORT).padEnd(50)}║
║  URL: http://localhost:${String(PORT).padEnd(40)}║
║  Health: http://localhost:${String(PORT).padEnd(38)}/api/health║
╚════════════════════════════════════════════════════════╝
  `);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM signal received: closing HTTP server");
  server.close(() => {
    console.log("HTTP server closed");
    process.exit(0);
  });
});
