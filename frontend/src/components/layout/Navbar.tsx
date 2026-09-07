import React from 'react';
import { Sparkles, BarChart3, Send, Bookmark } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  gigsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, gigsCount }) => {
  const tabs = [
    { id: 'gigs', label: 'Gig Generator', icon: Sparkles },
    { id: 'briefs', label: 'Buyer Briefs', icon: Send },
    { id: 'research', label: 'Market Research', icon: BarChart3 },
    { id: 'saved', label: `Saved Gigs (${gigsCount})`, icon: Bookmark },
  ];

  return (
    <nav className="w-full glass-panel border-b border-white/5 sticky top-0 z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-extrabold text-lg tracking-tight text-white flex items-center gap-2">
              FiverrGrowth <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">v1.0</span>
            </h1>
            <p className="text-[11px] text-gray-400">Autonomous Freelancer Copilot</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center bg-gray-900/80 p-1.5 rounded-xl border border-white/5 gap-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-emerald-500 text-gray-950 shadow-md shadow-emerald-500/20 font-bold'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
