import React, { useState } from "react";
import { VideoMetadata, DownloadFormat } from "../types";
import { getHybridDownloadOptions } from "../services/downloadService";
import DownloadModal, { DownloadOption } from "./DownloadModal";

interface ResultCardProps {
  metadata: VideoMetadata;
  onReset: () => void;
}

interface DownloadItemProps {
  format: DownloadFormat;
  sourceUrl: string;
  platform: string;
  contentType: string;
}

const DownloadItem: React.FC<DownloadItemProps> = ({
  format,
  sourceUrl,
  platform,
  contentType,
}) => {
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [downloadOptions, setDownloadOptions] = useState<DownloadOption[]>([]);
  const [downloadSource, setDownloadSource] = useState<"our-api" | "fallback">(
    "fallback",
  );

  const handleDownloadClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (downloading) return;

    setDownloading(true);
    setError(false);

    try {
      console.log(
        `🔗 Getting download options for ${platform} - ${format.quality}`,
      );

      // Use hybrid service (tries our API first, then fallback)
      const result = await getHybridDownloadOptions(
        sourceUrl,
        platform,
        format.quality,
        contentType,
      );

      if (!result.success || !result.downloadOptions) {
        throw new Error(result.error || "Failed to get download options");
      }

      console.log(
        `📥 Download options: ${result.source === "our-api" ? "✅ Our API" : "📌 Fallback services"}`,
        result.downloadOptions,
      );

      setDownloadOptions(result.downloadOptions);
      setDownloadSource(result.source);
      setShowModal(true);

      console.log(`✅ Download initiated for ${format.quality} ${format.ext}`);
    } catch (err) {
      console.error("Download error:", err);
      setError(true);
    } finally {
      setDownloading(false);
      setTimeout(() => setError(false), 3000);
    }
  };

  return (
    <>
      <div className="group relative">
        <div
          className={`flex items-center justify-between p-4 bg-white border rounded-2xl transition-all ${
            error
              ? "border-red-200 bg-red-50/30"
              : showModal
                ? "border-emerald-200 bg-emerald-50/30"
                : "border-gray-100 hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-50"
          }`}
        >
          <div className="flex items-center space-x-4">
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl transition-colors ${
                format.ext === "MP3"
                  ? "bg-amber-50 text-amber-500"
                  : "bg-blue-50 text-blue-500"
              }`}
            >
              <i
                className={
                  format.ext === "MP3" ? "fas fa-music" : "fas fa-video"
                }
              ></i>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-black text-gray-900">
                  {format.quality}
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded uppercase">
                  {format.ext}
                </span>
              </div>
              <div
                className="text-xs text-gray-400 font-medium mt-0.5"
                title={`Estimated size: ${format.size}`}
              >
                File size: {format.size}
              </div>
            </div>
          </div>

          <button
            onClick={handleDownloadClick}
            disabled={downloading}
            title={
              error
                ? "Download failed. Try again."
                : `Download ${format.quality} ${format.ext}`
            }
            className={`relative overflow-hidden w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
              downloading
                ? "bg-gray-100"
                : error
                  ? "bg-red-500 text-white"
                  : showModal
                    ? "bg-emerald-500 text-white scale-110 shadow-lg shadow-emerald-200"
                    : "bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-100 active:scale-95"
            }`}
          >
            {downloading ? (
              <div className="w-5 h-5 border-2 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
            ) : error ? (
              <i className="fas fa-redo text-sm"></i>
            ) : showModal ? (
              <i className="fas fa-check"></i>
            ) : (
              <i className="fas fa-download"></i>
            )}
          </button>
        </div>

        {error && (
          <div className="absolute -bottom-1 left-4 right-4 bg-red-500 text-[10px] text-white font-bold py-0.5 px-2 rounded-b-lg text-center animate-in slide-in-from-top-1">
            DOWNLOAD FAILED
          </div>
        )}
      </div>

      <DownloadModal
        isOpen={showModal}
        platform={platform}
        quality={format.quality}
        ext={format.ext}
        downloadOptions={downloadOptions}
        source={downloadSource}
        onClose={() => setShowModal(false)}
      />
    </>
  );
};

const ResultCard: React.FC<ResultCardProps> = ({ metadata, onReset }) => {
  const shareUrl = window.location.href;
  const shareText = `I just downloaded "${metadata.title}" using ClipVault! Check it out:`;

  const shareActions = [
    {
      name: "Twitter",
      icon: "fab fa-twitter",
      color: "hover:text-sky-400",
      bgColor: "hover:bg-sky-50",
      action: () =>
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
          "_blank",
        ),
    },
    {
      name: "Facebook",
      icon: "fab fa-facebook-f",
      color: "hover:text-blue-600",
      bgColor: "hover:bg-blue-50",
      action: () =>
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
          "_blank",
        ),
    },
    {
      name: "WhatsApp",
      icon: "fab fa-whatsapp",
      color: "hover:text-emerald-500",
      bgColor: "hover:bg-emerald-50",
      action: () =>
        window.open(
          `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + " " + shareUrl)}`,
          "_blank",
        ),
    },
    {
      name: "Telegram",
      icon: "fab fa-telegram-plane",
      color: "hover:text-sky-500",
      bgColor: "hover:bg-sky-50",
      action: () =>
        window.open(
          `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`,
          "_blank",
        ),
    },
  ];

  return (
    <div className="my-16 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="bg-white rounded-3xl shadow-2xl shadow-gray-200/50 border border-gray-100 overflow-hidden flex flex-col md:flex-row max-w-5xl mx-auto">
        {/* Left Side: Media Preview */}
        <div className="md:w-[45%] relative bg-gray-900 group aspect-video md:aspect-auto">
          <img
            src={metadata.thumbnail}
            alt={metadata.title}
            className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-8">
            <div className="bg-emerald-500 text-white text-xs font-black px-3 py-1.5 rounded-lg w-fit mb-4 flex items-center space-x-2">
              <i className="fas fa-bolt"></i>
              <span>{metadata.duration}</span>
            </div>
            <h3 className="text-white font-bold text-xl leading-tight line-clamp-2">
              {metadata.title}
            </h3>
          </div>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/30 animate-pulse">
              <i className="fas fa-play ml-1"></i>
            </div>
          </div>
        </div>

        {/* Right Side: Options */}
        <div className="md:w-[55%] p-8 md:p-12 bg-gray-50/50 flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                Source Platform
              </h4>
              <div className="flex items-center space-x-2 text-gray-900 font-bold">
                <i
                  className={`fab fa-${metadata.source.toLowerCase().includes("youtube") ? "youtube text-red-600" : "link text-emerald-500"}`}
                ></i>
                <span>{metadata.source}</span>
              </div>
            </div>
            <button
              onClick={onReset}
              className="text-emerald-600 hover:text-emerald-700 text-sm font-bold flex items-center space-x-2 bg-emerald-50 px-4 py-2 rounded-xl transition-colors"
            >
              <i className="fas fa-search text-xs"></i>
              <span>New Search</span>
            </button>
          </div>

          <div className="space-y-4 flex-grow">
            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
              Select Format & Quality
            </h4>
            {metadata.formats.map((format, idx) => {
              // Detect content type from format quality or source
              let contentType = "video";
              if (format.ext === "MP3" || format.quality.includes("kbps")) {
                contentType = "music";
              } else if (format.quality.includes("Audio")) {
                contentType = "music";
              }

              return (
                <DownloadItem
                  key={idx}
                  format={format}
                  sourceUrl={metadata.sourceUrl || ""}
                  platform={metadata.source}
                  contentType={contentType}
                />
              );
            })}
          </div>

          <div className="mt-12 pt-8 border-t border-gray-200">
            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-center mb-6">
              Share with friends
            </h4>
            <div className="flex items-center justify-center space-x-4">
              {shareActions.map((share) => (
                <button
                  key={share.name}
                  onClick={share.action}
                  className={`flex flex-col items-center space-y-2 p-3 rounded-2xl transition-all group ${share.bgColor}`}
                >
                  <div
                    className={`w-10 h-10 flex items-center justify-center text-xl text-gray-400 ${share.color} transition-all group-hover:scale-110`}
                  >
                    <i className={share.icon}></i>
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-tighter text-gray-400 group-hover:text-gray-900">
                    {share.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultCard;
