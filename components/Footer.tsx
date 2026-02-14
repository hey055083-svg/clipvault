
import React from 'react';

interface FooterProps {
  onTermsClick: () => void;
  onPrivacyClick: () => void;
  onInstallClick: () => void;
  onLanguageClick: () => void;
  currentLanguage: string;
}

const Footer: React.FC<FooterProps> = ({ 
  onTermsClick, 
  onPrivacyClick, 
  onInstallClick, 
  onLanguageClick,
  currentLanguage 
}) => {
  const scrollToSearch = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // Focus the input after a small delay to allow for smooth scrolling
    setTimeout(() => {
      const input = document.querySelector('input');
      if (input) {
        input.focus();
        input.classList.add('ring-2', 'ring-emerald-500');
        setTimeout(() => input.classList.remove('ring-2', 'ring-emerald-500'), 2000);
      }
    }, 500);
  };

  const footerSections = [
    {
      title: 'PLATFORMS',
      links: [
        { name: 'YouTube Downloader', action: scrollToSearch },
        { name: 'Instagram Video', action: scrollToSearch },
        { name: 'TikTok Mp4', action: scrollToSearch },
        { name: 'Facebook Save', action: scrollToSearch }
      ]
    },
    {
      title: 'COMPANY',
      links: [
        { name: 'How it works', action: () => window.scrollTo({ top: document.body.scrollHeight / 3, behavior: 'smooth' }) },
        { name: 'Browser Extension', action: onInstallClick },
        { name: 'Help Center', action: () => alert('Our help center is coming soon!') },
        { name: 'Contacts', action: () => alert('Contact us at support@clipvault.com') }
      ]
    },
    {
      title: 'LEGAL',
      links: [
        { name: 'Terms of Service', action: onTermsClick },
        { name: 'Privacy Policy', action: onPrivacyClick },
        { name: 'Cookie Policy', action: onPrivacyClick }
      ]
    }
  ];

  return (
    <footer className="bg-white py-20 px-4 border-t border-gray-100 mt-20">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center space-x-2 mb-6 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <div className="w-8 h-8 bg-emerald-500 text-white rounded-lg flex items-center justify-center text-sm shadow-md">
                <i className="fas fa-bolt"></i>
              </div>
              <span className="text-xl font-black text-gray-900 tracking-tighter">ClipVault</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed max-w-[240px]">
              Premium online video downloading utility. Fast, reliable, and completely free.
            </p>
          </div>

          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 className="text-[10px] font-black text-gray-900 uppercase tracking-[0.2em] mb-8">{section.title}</h4>
              <ul className="space-y-4">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <button 
                      onClick={link.action} 
                      className="text-sm text-gray-500 hover:text-emerald-600 transition-colors font-medium text-left"
                    >
                      {link.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-10 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between space-y-6 md:space-y-0">
          <p className="text-xs text-gray-400 font-medium">
            © {new Date().getFullYear()} ClipVault Media Inc. All rights reserved.
          </p>
          
          <div className="flex items-center space-x-6">
            <button 
              onClick={onLanguageClick}
              className="flex items-center space-x-2 text-xs font-bold text-gray-600 hover:text-emerald-600 transition-colors bg-gray-50 px-3 py-2 rounded-lg"
            >
               <i className="fas fa-globe text-emerald-500"></i>
               <span>Global / {currentLanguage}</span>
               <i className="fas fa-chevron-up text-[8px] opacity-40 ml-1"></i>
            </button>
            <div className="flex items-center space-x-4">
              <i className="fab fa-twitter text-gray-300 hover:text-sky-400 cursor-pointer transition-colors"></i>
              <i className="fab fa-github text-gray-300 hover:text-gray-900 cursor-pointer transition-colors"></i>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
