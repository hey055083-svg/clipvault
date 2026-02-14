import React, { useState } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import SupportedResources from "./components/SupportedResources";
import ContentSection from "./components/ContentSection";
import FAQ from "./components/FAQ";
import Footer from "./components/Footer";
import ResultCard from "./components/ResultCard";
import {
  TermsModal,
  PrivacyModal,
  InstallModal,
  LanguageModal,
} from "./components/LegalModals";
import { AppState, VideoMetadata } from "./types";
import { analyzeVideoUrl } from "./services/geminiService";

const App: React.FC = () => {
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState<AppState>(AppState.IDLE);
  const [metadata, setMetadata] = useState<VideoMetadata | null>(null);
  const [error, setError] = useState("");

  // Modal states
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isInstallOpen, setIsInstallOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("English");

  const handleDownload = async () => {
    if (!url.trim()) return;

    setStatus(AppState.LOADING);
    setError("");
    setMetadata(null);

    try {
      const result = await analyzeVideoUrl(url);
      setMetadata(result);
      setStatus(AppState.SUCCESS);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      console.error(err);
      setError(
        errorMsg ||
          "Failed to analyze the URL. Please ensure it is a valid video link.",
      );
      setStatus(AppState.ERROR);
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-800 selection:bg-emerald-100 selection:text-emerald-900">
      <Header onInstallClick={() => setIsInstallOpen(true)} />

      <main>
        <Hero
          url={url}
          setUrl={setUrl}
          onDownload={handleDownload}
          isLoading={status === AppState.LOADING}
          onTermsClick={() => setIsTermsOpen(true)}
          onPrivacyClick={() => setIsPrivacyOpen(true)}
        />

        <div className="max-w-5xl mx-auto px-4">
          {status === AppState.LOADING && (
            <div className="flex flex-col items-center justify-center py-20 animate-pulse">
              <div className="relative">
                <div className="h-16 w-16 rounded-full border-4 border-emerald-100 border-t-emerald-500 animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <i className="fas fa-cloud-download-alt text-emerald-500 text-xl"></i>
                </div>
              </div>
              <p className="mt-6 text-emerald-600 font-bold text-lg">
                Fetching media streams...
              </p>
              <p className="text-gray-400 text-sm mt-1 text-center">
                ClipVault is analyzing the source to find the best quality for
                you.
              </p>
            </div>
          )}

          {status === AppState.ERROR && (
            <div className="bg-red-50 border border-red-100 p-6 my-8 rounded-2xl flex items-start space-x-4 animate-in fade-in slide-in-from-top-4 duration-300">
              <div className="w-10 h-10 bg-red-100 text-red-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <i className="fas fa-exclamation-triangle"></i>
              </div>
              <div>
                <h4 className="font-bold text-red-900">Analysis Failed</h4>
                <p className="text-sm text-red-700 mt-1">{error}</p>
                <button
                  onClick={() => setStatus(AppState.IDLE)}
                  className="mt-3 text-sm font-bold text-red-600 hover:underline"
                >
                  Try another URL
                </button>
              </div>
            </div>
          )}

          {status === AppState.SUCCESS && metadata && (
            <ResultCard
              metadata={metadata}
              onReset={() => setStatus(AppState.IDLE)}
            />
          )}

          {!metadata && status !== AppState.LOADING && (
            <>
              <SupportedResources />
              <ContentSection />
              <FAQ />
            </>
          )}
        </div>
      </main>

      <Footer
        onTermsClick={() => setIsTermsOpen(true)}
        onPrivacyClick={() => setIsPrivacyOpen(true)}
        onInstallClick={() => setIsInstallOpen(true)}
        onLanguageClick={() => setIsLanguageOpen(true)}
        currentLanguage={selectedLanguage}
      />

      {/* Modals */}
      <TermsModal isOpen={isTermsOpen} onClose={() => setIsTermsOpen(false)} />
      <PrivacyModal
        isOpen={isPrivacyOpen}
        onClose={() => setIsPrivacyOpen(false)}
      />
      <InstallModal
        isOpen={isInstallOpen}
        onClose={() => setIsInstallOpen(false)}
      />
      <LanguageModal
        isOpen={isLanguageOpen}
        onClose={() => setIsLanguageOpen(false)}
        onSelect={(lang) => setSelectedLanguage(lang)}
      />
    </div>
  );
};

export default App;
