
import React, { useState } from 'react';

interface FAQItemProps {
  question: string;
  answer: string;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-gray-200 rounded-2xl mb-4 overflow-hidden bg-white transition-all hover:border-emerald-100 shadow-sm">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 text-left transition-colors"
      >
        <span className="font-bold text-gray-800">{question}</span>
        <div className={`w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center transition-all ${isOpen ? 'bg-emerald-500 text-white rotate-180' : 'text-gray-400'}`}>
          <i className="fas fa-chevron-down text-xs"></i>
        </div>
      </button>
      {isOpen && (
        <div className="px-5 pb-5 text-sm text-gray-500 border-t border-gray-50 pt-4 leading-relaxed animate-in slide-in-from-top-2 duration-200">
          {answer}
        </div>
      )}
    </div>
  );
};

const FAQ: React.FC = () => {
  const faqs = [
    {
      question: "How do I use ClipVault to download videos?",
      answer: "Using ClipVault is simple: 1. Copy the URL of the video you want to save. 2. Paste it into the search bar at the top of this page. 3. Click 'Download'. 4. Choose your preferred quality and format from the results provided. Your download will start instantly."
    },
    {
      question: "Which platforms does ClipVault support?",
      answer: "ClipVault supports over 100+ popular platforms including YouTube, TikTok (without watermark), Instagram, Facebook, Vimeo, Twitter/X, Dailymotion, and many more. If it's a video on the web, ClipVault can likely save it."
    },
    {
      question: "Can I download videos in 4K or 1080p?",
      answer: "Yes! ClipVault fetches all available qualities from the source. If the original video is available in 1080p, 2K, or 4K, you will see those options in our download list. We also offer MP3 conversion for audio-only needs."
    },
    {
      question: "Is there a limit on how many videos I can download?",
      answer: "Absolutely not. ClipVault is a free, unlimited service. You can download as many videos as you like without any hidden costs or registration requirements."
    },
    {
      question: "How does the ClipVault Browser Extension work?",
      answer: "Our extension adds a small 'Download' button directly onto video pages like YouTube or Facebook. This allows you to bypass the copy-paste step and save videos with just one click while you're browsing."
    }
  ];

  return (
    <section className="py-20 border-t border-gray-50">
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h2 className="text-3xl font-black text-gray-900 mb-4">Frequently Asked Questions</h2>
        <p className="text-gray-500">Everything you need to know about using the world's fastest video downloader.</p>
      </div>
      <div className="max-w-3xl mx-auto">
        {faqs.map((faq, idx) => (
          <FAQItem key={idx} question={faq.question} answer={faq.answer} />
        ))}
      </div>
    </section>
  );
};

export default FAQ;
