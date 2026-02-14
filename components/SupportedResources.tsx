
import React from 'react';

const SupportedResources: React.FC = () => {
  const resources = [
    { name: 'YouTube', icon: 'fa-youtube', color: 'text-red-600' },
    { name: 'Facebook', icon: 'fa-facebook', color: 'text-blue-600' },
    { name: 'Instagram', icon: 'fa-instagram', color: 'text-pink-500' },
    { name: 'TikTok', icon: 'fa-tiktok', color: 'text-black' },
    { name: 'Vimeo', icon: 'fa-vimeo-v', color: 'text-sky-400' },
    { name: 'Dailymotion', icon: 'fa-play-circle', color: 'text-blue-500' },
    { name: 'Reddit', icon: 'fa-reddit-alien', color: 'text-orange-600' },
    { name: 'Pinterest', icon: 'fa-pinterest', color: 'text-red-700' },
    { name: 'VK Video', icon: 'fa-vk', color: 'text-blue-500' },
    { name: 'Tumblr', icon: 'fa-tumblr', color: 'text-indigo-900' },
    { name: 'Threads', icon: 'fa-at', color: 'text-gray-900' },
    { name: 'BiliBili', icon: 'fa-tv', color: 'text-sky-300' },
  ];

  return (
    <section className="py-20 border-t border-gray-50">
      <div className="text-center mb-12">
        <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.3em] mb-4">Supported Platforms</h3>
        <p className="text-sm text-gray-500">Download media from over 100+ websites with ClipVault</p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8">
        {resources.map((res) => (
          <div key={res.name} className="flex flex-col items-center group cursor-help transition-all hover:-translate-y-1">
            <div className={`w-14 h-14 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-2xl ${res.color} shadow-sm group-hover:shadow-md group-hover:border-emerald-100 transition-all`}>
              <i className={`fab ${res.icon}`}></i>
            </div>
            <span className="mt-3 text-xs font-bold text-gray-500 group-hover:text-gray-900 transition-colors tracking-wide">{res.name}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default SupportedResources;
