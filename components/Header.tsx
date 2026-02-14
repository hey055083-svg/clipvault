
import React from 'react';

interface HeaderProps {
  onInstallClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onInstallClick }) => {
  const navItems = [
    { name: 'YouTube', icon: 'fa-youtube' },
    { name: 'Facebook', icon: 'fa-facebook' },
    { name: 'Instagram', icon: 'fa-instagram' },
    { name: 'TikTok', icon: 'fa-tiktok' }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100 py-3 px-4 md:px-8">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2 group cursor-pointer" onClick={() => window.location.reload()}>
          <div className="w-10 h-10 bg-emerald-500 text-white rounded-xl flex items-center justify-center shadow-lg shadow-emerald-200 group-hover:scale-105 transition-transform">
            <i className="fas fa-bolt"></i>
          </div>
          <span className="text-2xl font-black text-gray-900 tracking-tighter">ClipVault</span>
        </div>
        
        <nav className="hidden lg:flex items-center space-x-8">
          {navItems.map((item) => (
            <a 
              key={item.name} 
              href="#" 
              className="text-sm font-semibold text-gray-500 hover:text-emerald-600 flex items-center space-x-2 transition-colors"
            >
              <i className={`fab ${item.icon}`}></i>
              <span>{item.name}</span>
            </a>
          ))}
        </nav>

        <div className="flex items-center space-x-4">
          <button 
            onClick={onInstallClick}
            className="hidden md:flex items-center space-x-2 px-5 py-2.5 bg-gray-900 hover:bg-black text-white rounded-xl text-sm font-bold transition-all hover:shadow-xl hover:-translate-y-0.5"
          >
            <i className="fas fa-puzzle-piece"></i>
            <span>Add to Browser</span>
          </button>
          
          <div className="md:hidden">
            <button className="w-10 h-10 flex items-center justify-center bg-gray-50 rounded-xl">
              <i className="fas fa-bars text-gray-600"></i>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
