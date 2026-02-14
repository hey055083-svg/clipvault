
import React from 'react';

interface HeroProps {
  url: string;
  setUrl: (url: string) => void;
  onDownload: () => void;
  isLoading: boolean;
  onTermsClick: () => void;
  onPrivacyClick: () => void;
}

const Hero: React.FC<HeroProps> = ({ url, setUrl, onDownload, isLoading, onTermsClick, onPrivacyClick }) => {
  const quickLinks = [
    { name: 'youtube.com', icon: 'fa-youtube', color: '#ff0000' },
    { name: 'facebook.com', icon: 'fa-facebook', color: '#1877f2' },
    { name: 'instagram.com', icon: 'fa-instagram', color: '#e4405f' },
    { name: 'tiktok.com', icon: 'fa-tiktok', color: '#000000' },
  ];

  return (
    <section className="bg-white pt-16 pb-12 px-4 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full -z-10 pointer-events-none opacity-40">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-100 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-50 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-4xl mx-auto text-center relative">
        <div className="inline-flex items-center space-x-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-xs font-bold uppercase tracking-wider mb-6">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span>Online & Free</span>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-6 leading-tight">
          Download Your Favorite <br/>
          <span className="gradient-text">Videos Instantly.</span>
        </h1>
        
        <p className="text-gray-500 text-lg mb-10 max-w-2xl mx-auto font-medium">
          The fastest way to save content from social media in high resolution. No sign-up required.
        </p>
        
        <div className="relative max-w-3xl mx-auto mb-6">
          <div className="flex flex-col md:flex-row items-stretch bg-white shadow-2xl shadow-emerald-200/50 rounded-2xl overflow-hidden border-4 border-gray-50 focus-within:border-emerald-500/20 transition-all p-1.5">
            <div className="flex-grow flex items-center px-4">
              <i className="fas fa-link text-gray-300 mr-3"></i>
              <input
                type="text"
                placeholder="Paste video URL from YouTube, TikTok, FB..."
                className="w-full py-4 outline-none text-lg text-gray-700 placeholder:text-gray-300 font-medium bg-transparent"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && onDownload()}
              />
            </div>
            <button
              onClick={onDownload}
              disabled={isLoading}
              className="bg-emerald-500 hover:bg-emerald-600 active:scale-[0.98] text-white font-bold py-4 px-10 text-lg rounded-xl transition-all flex items-center justify-center min-w-[180px] shadow-lg shadow-emerald-500/30"
            >
              {isLoading ? (
                <div className="h-6 w-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <i className="fas fa-arrow-down mr-2"></i>
                  <span>Download</span>
                </>
              )}
            </button>
          </div>
        </div>

        <p className="text-xs text-gray-400 mb-12">
          By using ClipVault you accept our{' '}
          <button onClick={onTermsClick} className="underline hover:text-emerald-500">Terms of Service</button>
          {' '}and{' '}
          <button onClick={onPrivacyClick} className="underline hover:text-emerald-500">Privacy Policy</button>
        </p>

        <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10">
          {quickLinks.map((link) => (
            <div key={link.name} className="flex flex-col items-center space-y-2 group cursor-pointer opacity-40 hover:opacity-100 transition-opacity">
              <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-xl transition-all group-hover:scale-110 group-hover:bg-white group-hover:shadow-md" style={{ color: link.color }}>
                <i className={`fab ${link.icon}`}></i>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 group-hover:text-gray-900 transition-colors">{link.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
