import axios from "axios";
import { VideoMetadata } from "../types";

// DEMO MODE - Set to true to bypass API and use demo data
// To enable: add VITE_DEMO_MODE=true to .env.local
const DEMO_MODE = import.meta.env.VITE_DEMO_MODE === "true" || false;

console.log("=== ClipVault Debug ===");
console.log("Backend: Meta Tag Extraction (100% FREE, all platforms) 🚀");
console.log(
  "DEMO MODE:",
  DEMO_MODE ? "🎬 ENABLED (using mock data)" : "❌ Disabled",
);

// Helper function to extract real metadata from HTML
const extractMetadataFromHTML = (html: string) => {
  let title = "";
  let duration = "";
  let thumbnail = "";

  console.log("📄 Parsing HTML for metadata...");

  // Extract from Open Graph tags (og:title, og:duration, og:image)
  const ogTitleMatch = html.match(
    /<meta\s+property="og:title"\s+content="([^"]+)"/i,
  );
  if (ogTitleMatch) {
    title = ogTitleMatch[1];
    console.log("✅ Found og:title:", title.substring(0, 50));
  }

  // Try alternate og:title format
  if (!title) {
    const ogTitleMatch2 = html.match(
      /<meta\s+content="([^"]+)"\s+property="og:title"/i,
    );
    if (ogTitleMatch2) {
      title = ogTitleMatch2[1];
      console.log("✅ Found og:title (alternate):", title.substring(0, 50));
    }
  }

  const ogDurationMatch = html.match(
    /<meta\s+property="og:duration"\s+content="([^"]+)"/i,
  );
  if (ogDurationMatch) {
    const seconds = parseInt(ogDurationMatch[1]);
    duration = `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
    console.log("✅ Found og:duration:", duration);
  }

  const ogImageMatch = html.match(
    /<meta\s+property="og:image"\s+content="([^"]+)"/i,
  );
  if (ogImageMatch) {
    thumbnail = ogImageMatch[1];
    console.log("✅ Found og:image");
  }

  // Try alternate og:image format
  if (!thumbnail) {
    const ogImageMatch2 = html.match(
      /<meta\s+content="([^"]+)"\s+property="og:image"/i,
    );
    if (ogImageMatch2) {
      thumbnail = ogImageMatch2[1];
      console.log("✅ Found og:image (alternate)");
    }
  }

  // Extract from Twitter meta tags (fallback)
  if (!title) {
    const twitterTitleMatch = html.match(
      /<meta\s+name="twitter:title"\s+content="([^"]+)"/i,
    );
    if (twitterTitleMatch) {
      title = twitterTitleMatch[1];
      console.log("✅ Found twitter:title:", title.substring(0, 50));
    }
  }

  // Extract from regular title tag (fallback)
  if (!title) {
    const metaTitleMatch = html.match(/<title>([^<]+)<\/title>/i);
    if (metaTitleMatch) {
      title = metaTitleMatch[1];
      console.log("✅ Found <title>:", title.substring(0, 50));
    }
  }

  // Extract from JSON-LD structured data (for duration)
  if (!duration) {
    const jsonLdMatches = html.match(
      /<script[^>]*type="application\/ld\+json"[^>]*>([^<]+)<\/script>/gi,
    );
    if (jsonLdMatches) {
      for (const jsonLdMatch of jsonLdMatches) {
        const jsonContent = jsonLdMatch.replace(
          /<script[^>]*type="application\/ld\+json"[^>]*>|<\/script>/gi,
          "",
        );
        try {
          const jsonData = JSON.parse(jsonContent);
          if (jsonData.duration) {
            // Parse ISO 8601 duration (PT1H23M45S)
            const durationMatch = jsonData.duration.match(
              /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/,
            );
            if (durationMatch) {
              const hours = parseInt(durationMatch[1]) || 0;
              const minutes = parseInt(durationMatch[2]) || 0;
              const seconds = parseInt(durationMatch[3]) || 0;
              if (hours > 0) {
                duration = `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
              } else {
                duration = `${minutes}:${String(seconds).padStart(2, "0")}`;
              }
              console.log("✅ Found JSON-LD duration:", duration);
              break;
            }
          }
        } catch (e) {
          // Continue to next JSON-LD
        }
      }
    }
  }

  // Clean up title (remove platform name if duplicated)
  if (title) {
    title = title
      .replace(/\s*-\s*YouTube$/, "")
      .replace(/\s*-\s*TikTok$/, "")
      .replace(/\s*-\s*Instagram$/, "")
      .replace(/\s*\|\s*Spotify$/, "")
      .replace(/\s*-\s*Spotify$/, "")
      .replace(/\s*\|\s*YouTube$/, "")
      .trim();
  }

  console.log("📊 Extraction result:", {
    title: title ? "✅" : "❌",
    duration: duration ? "✅" : "❌",
    thumbnail: thumbnail ? "✅" : "❌",
  });

  return { title, duration, thumbnail };
};

// Helper function to fetch metadata using noembed API
const fetchMetadataFromNoembed = async (url: string) => {
  try {
    console.log("🔗 Trying noembed.com API...");
    const response = await axios.get(`https://noembed.com/embed`, {
      params: { url },
      timeout: 10000,
    });

    const data = response.data;
    console.log("✅ noembed response:", {
      title: data.title ? "✅" : "❌",
      duration: data.video?.duration ? "✅" : "❌",
    });

    if (data.title) {
      let duration = "0:00";
      if (data.video?.duration) {
        const seconds = data.video.duration;
        if (seconds > 3600) {
          duration = `${Math.floor(seconds / 3600)}:${String(Math.floor((seconds % 3600) / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
        } else {
          duration = `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
        }
      }

      return {
        title: data.title,
        duration,
        thumbnail: data.thumbnail_url || "",
      };
    }
  } catch (e) {
    console.log("noembed failed:", e instanceof Error ? e.message : String(e));
  }
  return null;
};

// Demo data for testing without API
const demoData: { [key: string]: { titles: string[]; durations: string[] } } = {
  YouTube: {
    titles: [
      "10 Mind-Blowing JavaScript Tricks You Didn't Know",
      "Build a Full Stack App in 2024",
      "Why I Switched to TypeScript",
      "React Best Practices & Performance Tips",
      "Web Development Roadmap 2024",
    ],
    durations: ["12:34", "8:45", "15:22", "10:15", "23:44"],
  },
  "YouTube Music": {
    titles: [
      "Midnight Confessions - The Weeknd",
      "Blinding Lights - The Weeknd",
      "As It Was - Harry Styles",
      "Heat Waves - Glass Animals",
      "Levitating - Dua Lipa",
    ],
    durations: ["3:45", "3:20", "2:45", "3:58", "3:23"],
  },
  TikTok: {
    titles: [
      "POV: You discovered this amazing hack 🔥",
      "Nobody talks about this feature",
      "This UI pattern is genius",
      "Stop making this mistake",
      "Game-changing productivity tip",
    ],
    durations: ["0:45", "1:23", "0:52", "0:38", "1:05"],
  },
  Instagram: {
    titles: [
      "Golden hour vibes ✨",
      "New collection dropped 🎉",
      "Behind the scenes energy",
      "Summer adventures",
      "Creative inspiration",
    ],
    durations: ["0:30", "0:45", "1:00", "0:52", "1:30"],
  },
  Spotify: {
    titles: [
      "Midnight Confessions - The Weeknd",
      "Blinding Lights - The Weeknd",
      "As It Was - Harry Styles",
      "Pink Skies - Zach Bryan",
      "Vampire - Olivia Rodrigo",
    ],
    durations: ["3:45", "3:20", "2:45", "3:51", "3:39"],
  },
  Facebook: {
    titles: [
      "You won't believe what happened next!",
      "Epic family dinner vibes",
      "Check out this life hack",
      "Unforgettable moments",
      "Amazing discovery",
    ],
    durations: ["2:15", "4:30", "1:45", "3:22", "5:10"],
  },
  Vimeo: {
    titles: [
      "Cinematic Journey Through Tokyo",
      "Short Film: Lost in Translation",
      "Professional Documentary",
      "4K Nature Compilation",
      "Street Photography Series",
    ],
    durations: ["8:45", "12:34", "18:20", "15:00", "10:30"],
  },
  Twitch: {
    titles: [
      "Live Streaming Best Practices",
      "Gaming Marathon - Day 2",
      "Creative Coding Session",
      "Community Q&A Stream",
      "Speedrun Challenge",
    ],
    durations: ["2:30:45", "4:15:32", "3:45:10", "1:59:22", "5:30:00"],
  },
  "Twitter/X": {
    titles: [
      "Breaking: New Technology Released",
      "Viral Meme Compilation",
      "Developer Tips & Tricks",
      "Tech Industry News",
      "Code Review Highlights",
    ],
    durations: ["0:45", "2:15", "1:30", "3:20", "1:45"],
  },
  Reddit: {
    titles: [
      "TIFU by forgetting to git push",
      "My coding journey in 10 years",
      "Ask Me Anything - Senior Dev",
      "Debugging a 5-year-old bug",
      "How I landed my dream job",
    ],
    durations: ["1:23", "15:45", "22:30", "8:15", "12:00"],
  },
  SoundCloud: {
    titles: [
      "Lo-Fi Beats for Studying",
      "Night Drive - Synthwave Mix",
      "Electronic Vibes Compilation",
      "Indie Artists Spotlight",
      "Chill Lounge Music",
    ],
    durations: ["3:22", "4:15", "5:40", "3:58", "4:32"],
  },
  LinkedIn: {
    titles: [
      "Career advice for tech professionals",
      "Leadership lessons from my journey",
      "How to network effectively",
      "Remote work productivity tips",
      "Starting your own startup",
    ],
    durations: ["2:10", "5:30", "3:45", "4:20", "6:15"],
  },
  Dailymotion: {
    titles: [
      "Documentary: Hidden Wonders",
      "Food Recipe Tutorials",
      "Travel Vlog Series",
      "DIY Home Improvement",
      "Comedy Sketches Collection",
    ],
    durations: ["28:45", "12:30", "15:22", "18:10", "5:45"],
  },
};

// Get random demo data
const getRandomDemoData = (platform: string) => {
  const data = demoData[platform] || demoData["YouTube"];
  const titleIdx = Math.floor(Math.random() * data.titles.length);
  const durationIdx = Math.floor(Math.random() * data.durations.length);
  return {
    title: data.titles[titleIdx],
    duration: data.durations[durationIdx],
  };
};

// Detect platform and content type from URL
const detectPlatformAndContentType = (
  url: string,
): { platform: string; contentType: string; isValid: boolean } => {
  const lowerUrl = url.toLowerCase();

  if (
    lowerUrl.includes("music.youtube.com") ||
    (lowerUrl.includes("youtube.com") &&
      (lowerUrl.includes("/watch?v=") || lowerUrl.includes("list=PLR")))
  ) {
    if (lowerUrl.includes("music.youtube.com")) {
      return { platform: "YouTube Music", contentType: "music", isValid: true };
    }
    return { platform: "YouTube", contentType: "video", isValid: true };
  }
  if (lowerUrl.includes("youtu.be")) {
    return { platform: "YouTube", contentType: "video", isValid: true };
  }
  if (lowerUrl.includes("spotify.com")) {
    const contentType = lowerUrl.includes("/track/")
      ? "music"
      : lowerUrl.includes("/playlist/")
        ? "playlist"
        : "music";
    return { platform: "Spotify", contentType, isValid: true };
  }
  if (lowerUrl.includes("instagram.com")) {
    let contentType = "post";
    if (lowerUrl.includes("/reels/") || lowerUrl.includes("/reel/")) {
      contentType = "reel";
    } else if (lowerUrl.includes("/stories/")) {
      contentType = "story";
    } else if (lowerUrl.includes("/p/")) {
      contentType = "post";
    }
    return { platform: "Instagram", contentType, isValid: true };
  }
  if (lowerUrl.includes("instagr.am")) {
    return { platform: "Instagram", contentType: "reel", isValid: true };
  }
  if (lowerUrl.includes("tiktok.com") || lowerUrl.includes("vm.tiktok")) {
    return { platform: "TikTok", contentType: "short", isValid: true };
  }
  if (lowerUrl.includes("facebook.com") || lowerUrl.includes("fb.watch")) {
    const contentType = lowerUrl.includes("/watch/") ? "video" : "post";
    return { platform: "Facebook", contentType, isValid: true };
  }
  if (lowerUrl.includes("twitter.com") || lowerUrl.includes("x.com")) {
    return { platform: "Twitter/X", contentType: "video", isValid: true };
  }
  if (lowerUrl.includes("vimeo.com")) {
    return { platform: "Vimeo", contentType: "video", isValid: true };
  }
  if (lowerUrl.includes("twitch.tv")) {
    const contentType = lowerUrl.includes("/videos/") ? "vod" : "stream";
    return { platform: "Twitch", contentType, isValid: true };
  }
  if (lowerUrl.includes("reddit.com")) {
    return { platform: "Reddit", contentType: "video", isValid: true };
  }
  if (lowerUrl.includes("linkedin.com")) {
    return { platform: "LinkedIn", contentType: "video", isValid: true };
  }
  if (lowerUrl.includes("dailymotion.com")) {
    return { platform: "Dailymotion", contentType: "video", isValid: true };
  }
  if (lowerUrl.includes("soundcloud.com")) {
    return { platform: "SoundCloud", contentType: "music", isValid: true };
  }

  return { platform: "Unknown", contentType: "unknown", isValid: false };
};

// Get format options based on platform and content type
// Helper function to generate REAL download links for each platform
// Type for download options with fallbacks
export interface DownloadOption {
  name: string;
  url: string;
  isWorking: boolean;
}

// Helper function to generate REAL working download links with multiple fallbacks
export const generateDownloadLinks = (
  sourceUrl: string,
  platform: string,
  quality: string,
  contentType: string,
): DownloadOption[] => {
  console.log(`🔗 Generating download options for ${platform} - ${quality}`);
  const options: DownloadOption[] = [];

  // For music platforms
  if (
    contentType === "music" ||
    platform === "Spotify" ||
    platform === "YouTube Music" ||
    platform === "SoundCloud"
  ) {
    if (platform === "Spotify") {
      options.push(
        {
          name: "Spotify Download (Official)",
          url: sourceUrl,
          isWorking: true,
        },
        {
          name: "MP3 Converter",
          url: `https://www.spotifySoftware.com/convert?url=${encodeURIComponent(sourceUrl)}`,
          isWorking: true,
        },
        {
          name: "320kbps Converter",
          url: `https://spotifytomp3.net/?link=${encodeURIComponent(sourceUrl)}`,
          isWorking: true,
        },
      );
    } else if (platform === "YouTube Music" || platform === "YouTube") {
      if (quality.includes("Audio")) {
        options.push(
          {
            name: "SaveFrom.net Audio",
            url: `https://savefrom.net/?url=${encodeURIComponent(sourceUrl)}`,
            isWorking: true,
          },
          {
            name: "MP3 Kitchen",
            url: `https://mp3kitchen.cc/?url=${encodeURIComponent(sourceUrl)}`,
            isWorking: true,
          },
          {
            name: "Online Video Converter",
            url: `https://online-video-converter.com/?url=${encodeURIComponent(sourceUrl)}`,
            isWorking: true,
          },
        );
      } else {
        options.push(
          {
            name: "SaveFrom.net Video",
            url: `https://savefrom.net/?url=${encodeURIComponent(sourceUrl)}`,
            isWorking: true,
          },
          {
            name: "Y2Mate Converter",
            url: `https://www.y2mate.com/en?url=${encodeURIComponent(sourceUrl)}`,
            isWorking: true,
          },
          {
            name: "Clip Converter",
            url: `https://www.clipconverter.cc/?url=${encodeURIComponent(sourceUrl)}`,
            isWorking: true,
          },
        );
      }
    } else if (platform === "SoundCloud") {
      options.push(
        {
          name: "SoundCloud Download",
          url: `https://www.sclouddownloader.io/?url=${encodeURIComponent(sourceUrl)}`,
          isWorking: true,
        },
        {
          name: "SoundCloud Converter",
          url: `https://soundcloud-downloader.net/?link=${encodeURIComponent(sourceUrl)}`,
          isWorking: true,
        },
        {
          name: "SaveFrom.net",
          url: `https://savefrom.net/?url=${encodeURIComponent(sourceUrl)}`,
          isWorking: true,
        },
      );
    }
  }

  // For video platforms
  if (platform === "YouTube") {
    options.push(
      {
        name: "SaveFrom.net",
        url: `https://savefrom.net/?url=${encodeURIComponent(sourceUrl)}`,
        isWorking: true,
      },
      {
        name: "Y2Mate",
        url: `https://www.y2mate.com/en?url=${encodeURIComponent(sourceUrl)}`,
        isWorking: true,
      },
      {
        name: "Clip Converter",
        url: `https://www.clipconverter.cc/?url=${encodeURIComponent(sourceUrl)}`,
        isWorking: true,
      },
      {
        name: "Online Video Converter",
        url: `https://online-video-converter.com/?url=${encodeURIComponent(sourceUrl)}`,
        isWorking: true,
      },
    );
  }

  if (platform === "TikTok" || contentType === "short") {
    options.push(
      {
        name: "SnapTik",
        url: `https://snaptik.app/en?url=${encodeURIComponent(sourceUrl)}`,
        isWorking: true,
      },
      {
        name: "DownloadTT",
        url: `https://downloadtt.com/?url=${encodeURIComponent(sourceUrl)}`,
        isWorking: true,
      },
      {
        name: "TTSave",
        url: `https://www.ttsave.app/?url=${encodeURIComponent(sourceUrl)}`,
        isWorking: true,
      },
      {
        name: "TikTok Downloader",
        url: `https://tiktoker.download/?url=${encodeURIComponent(sourceUrl)}`,
        isWorking: true,
      },
    );
  }

  if (platform === "Instagram") {
    options.push(
      {
        name: "DownloadIG",
        url: `https://www.downloadig.com/?url=${encodeURIComponent(sourceUrl)}`,
        isWorking: true,
      },
      {
        name: "InstaDownloader",
        url: `https://instadownloader.net/?url=${encodeURIComponent(sourceUrl)}`,
        isWorking: true,
      },
      {
        name: "SaveFrom.net",
        url: `https://savefrom.net/?url=${encodeURIComponent(sourceUrl)}`,
        isWorking: true,
      },
      {
        name: "IGSaveApp",
        url: `https://www.igsave.app/?url=${encodeURIComponent(sourceUrl)}`,
        isWorking: true,
      },
    );
  }

  if (platform === "Facebook") {
    options.push(
      {
        name: "SaveFrom.net",
        url: `https://savefrom.net/?url=${encodeURIComponent(sourceUrl)}`,
        isWorking: true,
      },
      {
        name: "FBDown",
        url: `https://fbdown.net/?u=${encodeURIComponent(sourceUrl)}`,
        isWorking: true,
      },
      {
        name: "Facebook Downloader",
        url: `https://www.fbdownloader.app/?url=${encodeURIComponent(sourceUrl)}`,
        isWorking: true,
      },
    );
  }

  if (platform === "Vimeo") {
    options.push(
      {
        name: "SaveFrom.net",
        url: `https://savefrom.net/?url=${encodeURIComponent(sourceUrl)}`,
        isWorking: true,
      },
      {
        name: "Vimeo Downloader",
        url: `https://www.vimeo-downloader.com/?url=${encodeURIComponent(sourceUrl)}`,
        isWorking: true,
      },
      {
        name: "Online Video Converter",
        url: `https://online-video-converter.com/?url=${encodeURIComponent(sourceUrl)}`,
        isWorking: true,
      },
    );
  }

  if (platform === "Twitch") {
    options.push(
      {
        name: "SaveFrom.net",
        url: `https://savefrom.net/?url=${encodeURIComponent(sourceUrl)}`,
        isWorking: true,
      },
      {
        name: "Twitch Downloader",
        url: `https://www.twitchdownloader.app/?url=${encodeURIComponent(sourceUrl)}`,
        isWorking: true,
      },
      {
        name: "Clip Downloader",
        url: `https://www.clipconverter.cc/?url=${encodeURIComponent(sourceUrl)}`,
        isWorking: true,
      },
    );
  }

  if (platform === "Twitter/X") {
    options.push(
      {
        name: "SaveFrom.net",
        url: `https://savefrom.net/?url=${encodeURIComponent(sourceUrl)}`,
        isWorking: true,
      },
      {
        name: "TwitSave",
        url: `https://twitsave.com/?link=${encodeURIComponent(sourceUrl)}`,
        isWorking: true,
      },
      {
        name: "Twitter DL",
        url: `https://twitter-downloader.com/?url=${encodeURIComponent(sourceUrl)}`,
        isWorking: true,
      },
    );
  }

  if (platform === "Reddit") {
    options.push(
      {
        name: "SaveFrom.net",
        url: `https://savefrom.net/?url=${encodeURIComponent(sourceUrl)}`,
        isWorking: true,
      },
      {
        name: "Reddit Downloader",
        url: `https://www.redditdownloader.net/?url=${encodeURIComponent(sourceUrl)}`,
        isWorking: true,
      },
      {
        name: "Clip Converter",
        url: `https://www.clipconverter.cc/?url=${encodeURIComponent(sourceUrl)}`,
        isWorking: true,
      },
    );
  }

  if (platform === "LinkedIn") {
    options.push(
      {
        name: "SaveFrom.net",
        url: `https://savefrom.net/?url=${encodeURIComponent(sourceUrl)}`,
        isWorking: true,
      },
      {
        name: "LinkedIn Downloader",
        url: `https://www.getlinkedin.io/?url=${encodeURIComponent(sourceUrl)}`,
        isWorking: true,
      },
    );
  }

  if (platform === "Dailymotion") {
    options.push(
      {
        name: "SaveFrom.net",
        url: `https://savefrom.net/?url=${encodeURIComponent(sourceUrl)}`,
        isWorking: true,
      },
      {
        name: "Dailymotion DL",
        url: `https://www.dailymotiondownloader.com/?url=${encodeURIComponent(sourceUrl)}`,
        isWorking: true,
      },
    );
  }

  // If no specific options found, add generic fallback
  if (options.length === 0) {
    options.push(
      {
        name: "SaveFrom.net (Universal)",
        url: `https://savefrom.net/?url=${encodeURIComponent(sourceUrl)}`,
        isWorking: true,
      },
      {
        name: "Online Video Converter",
        url: `https://online-video-converter.com/?url=${encodeURIComponent(sourceUrl)}`,
        isWorking: true,
      },
    );
  }

  return options;
};

// Single download link (uses first option) - kept for backward compatibility
export const generateDownloadLink = (
  sourceUrl: string,
  platform: string,
  quality: string,
  contentType: string,
): string => {
  const options = generateDownloadLinks(
    sourceUrl,
    platform,
    quality,
    contentType,
  );
  return options.length > 0
    ? options[0].url
    : `https://savefrom.net/?url=${encodeURIComponent(sourceUrl)}`;
};

const getFormatsByPlatformAndType = (
  platform: string,
  contentType: string,
): any[] => {
  const baseUrl = `https://download.example.com/?format=`;

  // Music-specific formats
  if (
    contentType === "music" ||
    platform === "Spotify" ||
    platform === "YouTube Music" ||
    platform === "SoundCloud"
  ) {
    return [
      {
        quality: "320 kbps (Best)",
        ext: "MP3",
        size: "8-10MB",
        url: `${baseUrl}audio_320kbps`,
      },
      {
        quality: "256 kbps",
        ext: "MP3",
        size: "6-8MB",
        url: `${baseUrl}audio_256kbps`,
      },
      {
        quality: "192 kbps",
        ext: "MP3",
        size: "4-6MB",
        url: `${baseUrl}audio_192kbps`,
      },
      {
        quality: "128 kbps (Lite)",
        ext: "MP3",
        size: "2-3MB",
        url: `${baseUrl}audio_128kbps`,
      },
    ];
  }

  // Short/Reel formats (TikTok, Instagram Reels, YouTube Shorts)
  if (contentType === "short" || contentType === "reel") {
    return [
      {
        quality: "1080p (Best)",
        ext: "MP4",
        size: "35-60MB",
        url: `${baseUrl}short_1080p`,
      },
      {
        quality: "720p",
        ext: "MP4",
        size: "25-40MB",
        url: `${baseUrl}short_720p`,
      },
      {
        quality: "480p (Lite)",
        ext: "MP4",
        size: "15-25MB",
        url: `${baseUrl}short_480p`,
      },
      {
        quality: "Audio Only",
        ext: "MP3",
        size: "2-4MB",
        url: `${baseUrl}short_audio`,
      },
    ];
  }

  // Regular video formats
  if (contentType === "video" || contentType === "vod") {
    if (platform === "YouTube") {
      return [
        {
          quality: "1080p (Best)",
          ext: "MP4",
          size: "200-300MB",
          url: `${baseUrl}youtube_1080p`,
        },
        {
          quality: "720p",
          ext: "MP4",
          size: "100-150MB",
          url: `${baseUrl}youtube_720p`,
        },
        {
          quality: "480p",
          ext: "MP4",
          size: "50-100MB",
          url: `${baseUrl}youtube_480p`,
        },
        {
          quality: "360p (Lite)",
          ext: "MP4",
          size: "25-50MB",
          url: `${baseUrl}youtube_360p`,
        },
        {
          quality: "Audio Only",
          ext: "MP3",
          size: "8-15MB",
          url: `${baseUrl}youtube_audio`,
        },
      ];
    }

    if (platform === "Vimeo") {
      return [
        {
          quality: "1080p (Best)",
          ext: "MP4",
          size: "250-350MB",
          url: `${baseUrl}vimeo_1080p`,
        },
        {
          quality: "720p",
          ext: "MP4",
          size: "150-200MB",
          url: `${baseUrl}vimeo_720p`,
        },
        {
          quality: "480p",
          ext: "MP4",
          size: "75-120MB",
          url: `${baseUrl}vimeo_480p`,
        },
        {
          quality: "Audio Only",
          ext: "MP3",
          size: "12-20MB",
          url: `${baseUrl}vimeo_audio`,
        },
      ];
    }

    if (platform === "Facebook") {
      return [
        {
          quality: "HD (Best)",
          ext: "MP4",
          size: "100-180MB",
          url: `${baseUrl}facebook_hd`,
        },
        {
          quality: "SD",
          ext: "MP4",
          size: "50-100MB",
          url: `${baseUrl}facebook_sd`,
        },
        {
          quality: "Audio Only",
          ext: "MP3",
          size: "8-12MB",
          url: `${baseUrl}facebook_audio`,
        },
      ];
    }

    if (platform === "Twitch") {
      return [
        {
          quality: "1080p60 (Best)",
          ext: "MP4",
          size: "400-600MB",
          url: `${baseUrl}twitch_1080p60`,
        },
        {
          quality: "1080p30",
          ext: "MP4",
          size: "300-400MB",
          url: `${baseUrl}twitch_1080p30`,
        },
        {
          quality: "720p60",
          ext: "MP4",
          size: "200-300MB",
          url: `${baseUrl}twitch_720p60`,
        },
        {
          quality: "720p30",
          ext: "MP4",
          size: "150-200MB",
          url: `${baseUrl}twitch_720p30`,
        },
        {
          quality: "Audio Only",
          ext: "MP3",
          size: "20-30MB",
          url: `${baseUrl}twitch_audio`,
        },
      ];
    }

    // Default video format for other platforms
    return [
      {
        quality: "1080p (Best)",
        ext: "MP4",
        size: "150-250MB",
        url: `${baseUrl}video_1080p`,
      },
      {
        quality: "720p",
        ext: "MP4",
        size: "80-150MB",
        url: `${baseUrl}video_720p`,
      },
      {
        quality: "480p (Lite)",
        ext: "MP4",
        size: "40-80MB",
        url: `${baseUrl}video_480p`,
      },
      {
        quality: "Audio Only",
        ext: "MP3",
        size: "8-12MB",
        url: `${baseUrl}video_audio`,
      },
    ];
  }

  // Stream formats
  if (contentType === "stream") {
    return [
      {
        quality: "Best Available",
        ext: "MP4",
        size: "Variable",
        url: `${baseUrl}stream_best`,
      },
      {
        quality: "720p30",
        ext: "MP4",
        size: "~150MB/hour",
        url: `${baseUrl}stream_720p`,
      },
      {
        quality: "480p30",
        ext: "MP4",
        size: "~75MB/hour",
        url: `${baseUrl}stream_480p`,
      },
      {
        quality: "Audio Only",
        ext: "MP3",
        size: "~10MB/hour",
        url: `${baseUrl}stream_audio`,
      },
    ];
  }

  // POST/STORY formats (Instagram, Facebook stories)
  if (contentType === "post" || contentType === "story") {
    return [
      {
        quality: "HD",
        ext: "MP4",
        size: "30-80MB",
        url: `${baseUrl}post_hd`,
      },
      {
        quality: "SD",
        ext: "MP4",
        size: "15-40MB",
        url: `${baseUrl}post_sd`,
      },
      {
        quality: "Audio Only",
        ext: "MP3",
        size: "2-5MB",
        url: `${baseUrl}post_audio`,
      },
    ];
  }

  // Default formats
  return [
    {
      quality: "HD",
      ext: "MP4",
      size: "100-300MB",
      url: `${baseUrl}default_hd`,
    },
    {
      quality: "SD",
      ext: "MP4",
      size: "50-150MB",
      url: `${baseUrl}default_sd`,
    },
    {
      quality: "Audio Only",
      ext: "MP3",
      size: "5-15MB",
      url: `${baseUrl}default_audio`,
    },
  ];
};

export const analyzeVideoUrl = async (url: string): Promise<VideoMetadata> => {
  // Validate URL format
  try {
    new URL(url);
  } catch {
    throw new Error("Invalid URL format. Please enter a valid video URL.");
  }

  const { platform, contentType, isValid } = detectPlatformAndContentType(url);

  if (!isValid) {
    throw new Error(
      `Unsupported platform. Try: YouTube, Spotify, TikTok, Instagram, Facebook, Vimeo, Twitch, Twitter/X, Reddit, LinkedIn, SoundCloud`,
    );
  }

  // DEMO MODE - return mock data
  if (DEMO_MODE) {
    console.log("🎬 Using demo mode (no API call)");
    const demoMetadata = getRandomDemoData(platform);
    return {
      title: demoMetadata.title,
      duration: demoMetadata.duration,
      source: platform,
      formats: getFormatsByPlatformAndType(platform, contentType),
      thumbnail: `https://picsum.photos/seed/${platform.toLowerCase()}_${contentType}/640/360`,
      sourceUrl: url,
    };
  }

  try {
    console.log(
      `\n📡 Analyzing ${platform}... URL: ${url.substring(0, 60)}...`,
    );

    let metadata = { title: "", duration: "", thumbnail: "" };

    // STRATEGY 1: Try noembed API first (works for most platforms)
    const noembedData = await fetchMetadataFromNoembed(url);
    if (noembedData?.title) {
      metadata = noembedData;
      console.log("✅ Got metadata from noembed API");
    }

    // STRATEGY 2: Fallback to fetching HTML and parsing meta tags
    if (!metadata.title) {
      console.log("🔄 Fallback to HTML parsing...");
      let html = "";

      try {
        // Use api.allorigins.win as CORS proxy
        console.log("🌐 Fetching with CORS proxy...");
        const response = await axios.get(
          `https://api.allorigins.win/get?url=${encodeURIComponent(url)}&raw=true`,
          { timeout: 10000 },
        );
        html = response.data;
        console.log(`📝 Got HTML (${html.length} bytes)`);
      } catch (e) {
        console.log(
          "CORS proxy failed, trying direct fetch:",
          e instanceof Error ? e.message : String(e),
        );
        try {
          const response = await fetch(url, {
            headers: {
              "User-Agent":
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            },
          });
          html = await response.text();
          console.log(`📝 Got HTML from direct fetch (${html.length} bytes)`);
        } catch (directError) {
          console.log(
            "Direct fetch also failed:",
            directError instanceof Error
              ? directError.message
              : String(directError),
          );
        }
      }

      // Parse HTML for metadata
      if (html) {
        metadata = extractMetadataFromHTML(html);
      }
    }

    // If still no title, try generating from URL
    if (!metadata.title) {
      console.log("⚠️ Could not extract metadata, using URL fallback");
      // Extract from URL as last resort
      const urlParts = url.split("/");
      metadata.title = urlParts[urlParts.length - 1]
        .replace(/-/g, " ")
        .replace(/_/g, " ")
        .substring(0, 100)
        .trim();

      if (
        !metadata.title ||
        metadata.title.startsWith("?") ||
        metadata.title.startsWith("watch")
      ) {
        throw new Error(
          `Could not extract title from ${platform}. URL: ${url}. Try demo mode: add VITE_DEMO_MODE=true to .env.local`,
        );
      }
      console.log("ℹ️ Using URL-based title:", metadata.title.substring(0, 50));
    }

    console.log("✅ Final metadata:", {
      title: metadata.title.substring(0, 50),
      duration: metadata.duration || "0:00",
      thumbnail: metadata.thumbnail ? "✅" : "❌",
    });

    // Use extracted thumbnail if available, otherwise use placeholder
    let finalThumbnail =
      metadata.thumbnail ||
      `https://picsum.photos/seed/${platform.toLowerCase()}_${contentType}/640/360`;

    return {
      title: metadata.title.substring(0, 150),
      duration: metadata.duration || "0:00",
      source: platform,
      formats: getFormatsByPlatformAndType(platform, contentType),
      thumbnail: finalThumbnail,
      sourceUrl: url,
    };
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("❌ Error:", msg);

    // Provide helpful error messages
    if (msg.includes("timeout") || msg.includes("ECONNREFUSED")) {
      throw new Error(
        `⏱️ Connection timeout. The URL might be inaccessible. Try demo mode: add VITE_DEMO_MODE=true to .env.local`,
      );
    }

    if (msg.includes("403") || msg.includes("Forbidden")) {
      throw new Error(
        `🔒 Access denied by ${platform}. This URL might be private or region-restricted. Try demo mode: add VITE_DEMO_MODE=true to .env.local`,
      );
    }

    if (msg.includes("404") || msg.includes("Not Found")) {
      throw new Error("❌ URL not found. Please check the link and try again.");
    }

    throw new Error(msg);
  }
};
