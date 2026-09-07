import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Navbar } from './components/layout/Navbar';
import { HeroScene } from './components/3d/HeroScene';
import { GigGeneratorView } from './components/modules/GigGeneratorView';
import { BuyerBriefView } from './components/modules/BuyerBriefView';
import { MarketResearchView } from './components/modules/MarketResearchView';
import { SavedGigsView } from './components/modules/SavedGigsView';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('gigs');
  const [savedGigs, setSavedGigs] = useState<any[]>([]);
  const contentRef = useRef<HTMLDivElement>(null);

  const fetchSavedGigs = async () => {
    try {
      const res = await fetch('/api/v1/gigs');
      const json = await res.json();
      if (json.success) {
        setSavedGigs(json.data);
      }
    } catch (err) {
      console.warn('Backend not yet connected or starting:', err);
    }
  };

  useEffect(() => {
    fetchSavedGigs();
  }, []);

  // GSAP animation on tab change
  useEffect(() => {
    if (contentRef.current) {
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }
      );
    }
  }, [activeTab]);

  return (
    <div className="min-h-screen flex flex-col bg-[#07090e] text-gray-100 selection:bg-emerald-500 selection:text-gray-950">
      {/* Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        gigsCount={savedGigs.length}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 md:px-6 py-6 space-y-8">
        {/* 3D Interactive Hero Canvas */}
        <HeroScene />

        {/* Tab Module Views (GSAP Animated) */}
        <div ref={contentRef}>
          {activeTab === 'gigs' && <GigGeneratorView onGigGenerated={fetchSavedGigs} />}
          {activeTab === 'briefs' && <BuyerBriefView />}
          {activeTab === 'research' && <MarketResearchView />}
          {activeTab === 'saved' && <SavedGigsView gigs={savedGigs} />}
        </div>
      </main>

      {/* Footer */}
      <footer className="glass-panel border-t border-white/5 py-6 px-6 mt-12 text-center text-xs text-gray-500">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          <div>
            FiverrGrowth AI Platform &copy; 2026. Built with React 19, Three.js, GSAP, Node.js & Groq/Gemini AI.
          </div>
          <div className="flex items-center gap-4 text-gray-400">
            <span>Human-in-the-Loop Verified</span>
            <span>&bull;</span>
            <span>Zero-Ban Compliance Architecture</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
