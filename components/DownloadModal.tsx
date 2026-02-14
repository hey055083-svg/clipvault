import React from "react";

export interface DownloadOption {
  name: string;
  url: string;
  isWorking: boolean;
}

interface DownloadModalProps {
  isOpen: boolean;
  platform: string;
  quality: string;
  ext: string;
  downloadOptions: DownloadOption[];
  source?: "our-api" | "fallback";
  onClose: () => void;
}

const DownloadModal: React.FC<DownloadModalProps> = ({
  isOpen,
  platform,
  quality,
  ext,
  downloadOptions,
  source = "fallback",
  onClose,
}) => {
  if (!isOpen) return null;

  const handleDownload = (url: string) => {
    console.log(`📥 Opening download page: ${url}`);
    // Open in new tab - user completes download from service
    window.open(url, "_blank");
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full sm:max-w-2xl max-h-[90vh] overflow-y-auto animate-in scale-95 fade-in">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 px-6 sm:px-8 py-6 sticky top-0 flex items-center justify-between">
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-white flex-shrink-0">
              <i
                className={ext === "MP3" ? "fas fa-music" : "fas fa-video"}
              ></i>
            </div>
            <div className="min-w-0">
              <h2 className="text-white font-black text-lg sm:text-xl truncate">
                Ready to Download
              </h2>
              <p className="text-emerald-50 text-xs sm:text-sm truncate">
                {platform} • {quality} • {ext}
              </p>
            </div>
          </div>
          {/* Close Button */}
          <button
            onClick={onClose}
            className="ml-4 text-white hover:bg-white/20 p-2 rounded-lg transition-colors flex-shrink-0"
            title="Close"
          >
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>

        {/* Content */}
        <div className="px-6 sm:px-8 py-6 sm:py-8">
          <div className="space-y-6">
            {/* Status Message */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4">
              <p className="text-sm font-bold text-emerald-900 mb-2">
                ✅ Ready to Download
              </p>
              <p className="text-sm text-emerald-800">
                Click below to open the download page. Your file will be ready
                within seconds!
              </p>
            </div>

            {/* Single Download Button */}
            <button
              onClick={() => {
                const url = downloadOptions[0]?.url || "";
                handleDownload(url);
              }}
              className="w-full px-6 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-2xl transition-all flex items-center justify-center space-x-2 text-lg"
            >
              <i className="fas fa-download"></i>
              <span>Download Now</span>
            </button>

            {/* Instructions */}
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
              <p className="text-sm font-bold text-blue-900 mb-2">
                📋 What Happens Next:
              </p>
              <ol className="text-sm text-blue-800 space-y-1">
                <li className="flex space-x-2">
                  <span className="font-bold">1.</span>
                  <span>Click "Download Now" above</span>
                </li>
                <li className="flex space-x-2">
                  <span className="font-bold">2.</span>
                  <span>New tab opens with download page</span>
                </li>
                <li className="flex space-x-2">
                  <span className="font-bold">3.</span>
                  <span>Click download button on that page</span>
                </li>
                <li className="flex space-x-2">
                  <span className="font-bold">4.</span>
                  <span>File starts downloading! ✅</span>
                </li>
              </ol>
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="w-full px-4 py-3 border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-bold rounded-xl transition-all hover:bg-gray-50"
            >
              <i className="fas fa-times mr-2"></i>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DownloadModal;
