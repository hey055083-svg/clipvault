
import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <i className="fas fa-times text-gray-400"></i>
          </button>
        </div>
        <div className="p-8 overflow-y-auto text-gray-600 text-sm leading-relaxed">
          {children}
        </div>
        <div className="p-6 border-t border-gray-100 flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export const TermsModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => (
  <Modal isOpen={isOpen} onClose={onClose} title="Terms of Service">
    <div className="space-y-4">
      <p>Welcome to ClipVault. By using our service, you agree to these terms.</p>
      <h3 className="font-bold text-gray-900 uppercase text-xs">1. Use of Service</h3>
      <p>ClipVault is designed for personal use only. You must not use this tool to infringe upon copyright or intellectual property rights of content creators. You are solely responsible for the content you download.</p>
      <h3 className="font-bold text-gray-900 uppercase text-xs">2. Disclaimer</h3>
      <p>The materials on ClipVault are provided on an 'as is' basis. We make no warranties, expressed or implied, and hereby disclaim and negate all other warranties including, without limitation, implied warranties or conditions of merchantability.</p>
      <h3 className="font-bold text-gray-900 uppercase text-xs">3. Limitations</h3>
      <p>In no event shall ClipVault or its suppliers be liable for any damages arising out of the use or inability to use the materials on our website.</p>
    </div>
  </Modal>
);

export const PrivacyModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => (
  <Modal isOpen={isOpen} onClose={onClose} title="Privacy Policy">
    <div className="space-y-4">
      <p>Your privacy is important to us. It is ClipVault's policy to respect your privacy regarding any information we may collect from you across our website.</p>
      <h3 className="font-bold text-gray-900 uppercase text-xs">Data Collection</h3>
      <p>We do not store the videos you download. We only process the URL temporarily to fetch the media streams. We may collect anonymous usage data to improve our service.</p>
      <h3 className="font-bold text-gray-900 uppercase text-xs">Cookies</h3>
      <p>We use essential cookies to ensure the website functions correctly and to analyze our traffic anonymously.</p>
      <h3 className="font-bold text-gray-900 uppercase text-xs">Security</h3>
      <p>We protect your data within commercially acceptable means to prevent loss and theft, as well as unauthorized access, disclosure, copying, use or modification.</p>
    </div>
  </Modal>
);

export const InstallModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => (
  <Modal isOpen={isOpen} onClose={onClose} title="ClipVault Browser Extension">
    <div className="text-center py-4">
      <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-6 text-3xl">
        <i className="fas fa-puzzle-piece"></i>
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">Download with 1 Click</h3>
      <p className="mb-8">Add the ClipVault helper to your browser and download videos directly from the original page.</p>
      
      <div className="grid grid-cols-2 gap-4">
        <button className="flex flex-col items-center p-4 border border-gray-100 rounded-xl hover:border-emerald-200 hover:bg-emerald-50 transition-all">
          <i className="fab fa-chrome text-2xl text-blue-500 mb-2"></i>
          <span className="text-xs font-bold">Add to Chrome</span>
        </button>
        <button className="flex flex-col items-center p-4 border border-gray-100 rounded-xl hover:border-emerald-200 hover:bg-emerald-50 transition-all">
          <i className="fab fa-firefox-browser text-2xl text-orange-500 mb-2"></i>
          <span className="text-xs font-bold">Add to Firefox</span>
        </button>
      </div>
    </div>
  </Modal>
);

export const LanguageModal: React.FC<{ isOpen: boolean; onClose: () => void; onSelect: (lang: string) => void }> = ({ isOpen, onClose, onSelect }) => {
  const languages = [
    { name: 'English', code: 'en' },
    { name: 'Español', code: 'es' },
    { name: 'Français', code: 'fr' },
    { name: 'Deutsch', code: 'de' },
    { name: 'Italiano', code: 'it' },
    { name: 'Português', code: 'pt' },
    { name: 'Русский', code: 'ru' },
    { name: 'Türkçe', code: 'tr' },
    { name: 'Tiếng Việt', code: 'vi' },
    { name: 'हिन्दी', code: 'hi' },
    { name: '日本語', code: 'ja' },
    { name: '한국어', code: 'ko' }
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Select Language">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => { onSelect(lang.name); onClose(); }}
            className="p-3 text-left border border-gray-100 rounded-xl hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-700 transition-all font-medium text-sm"
          >
            {lang.name}
          </button>
        ))}
      </div>
    </Modal>
  );
};
