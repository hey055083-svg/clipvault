
import React from 'react';

const ContentSection: React.FC = () => {
  return (
    <section className="py-12 space-y-24">
      {/* Feature 1 */}
      <div className="text-center max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Download Videos Easily with ClipVault</h2>
        <div className="space-y-6 text-gray-500 leading-relaxed text-sm">
          <p>
            ClipVault serves as your reliable solution for downloading favorite online videos and music content. 
            This trusted video downloader helps users worldwide, providing a simple method 
            to save media from popular platforms without requiring complex software installation.
          </p>
          <p>
            Whether you want YouTube videos, entertainment shows, or sports highlights, ClipVault provides dependable results. 
            Simply copy your desired video URL, paste it into our download field, and click the download button.
          </p>
        </div>
      </div>

      {/* Feature 2 */}
      <div className="text-center max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Download High-Quality MP4 Videos</h2>
        <div className="space-y-6 text-gray-500 leading-relaxed text-sm">
          <p>
            Offline video access gives you greater control over your entertainment experience compared to streaming alone. 
            ClipVault's video downloader maintains original quality standards, providing crystal-clear MP4 downloads 
            that preserve their source resolution and clarity.
          </p>
          <p>
            Ideal for travel situations, areas with limited internet connectivity, or users who prefer having instant access 
            to their content library, ClipVault offers reliable video downloading capabilities you can depend on.
          </p>
        </div>
      </div>

      {/* Guide Section */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-16">
          Complete Guide to Downloading High-Quality MP4 Videos Online
        </h2>
        
        <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
          <div className="order-2 md:order-1">
            <p className="text-gray-800 font-bold leading-relaxed">
              <span className="text-emerald-600 font-extrabold mr-1">1. Begin by copying the video URL</span> 
              from your preferred video platform. Navigate to our download page and insert the link into the designated field. 
              Select "Download" or hit "Enter" to launch the video conversion.
            </p>
          </div>
          <div className="order-1 md:order-2 bg-gray-50 rounded-2xl aspect-video flex items-center justify-center border border-dashed border-gray-300">
            <div className="flex flex-col items-center text-gray-400">
              <i className="fas fa-copy text-4xl mb-2"></i>
              <span className="text-xs uppercase font-bold tracking-widest">Copy Link</span>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="bg-gray-50 rounded-2xl aspect-video flex items-center justify-center border border-dashed border-gray-300">
            <div className="flex flex-col items-center text-gray-400">
              <i className="fas fa-paste text-4xl mb-2"></i>
              <span className="text-xs uppercase font-bold tracking-widest">Paste & Save</span>
            </div>
          </div>
          <div>
            <p className="text-gray-800 font-bold leading-relaxed">
              <span className="text-emerald-600 font-extrabold mr-1">2. Use the shortcut</span> 
              by clicking the browser extension icon when watching any video to instantly send the URL to ClipVault for processing.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContentSection;
