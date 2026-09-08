import React from 'react';
import { Sparkles, BarChart3, Send, Bookmark, Compass, User, LogOut, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  gigsCount: number;
  onOpenAuth: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  gigsCount,
  onOpenAuth,
}) => {
  const { user, userContext, logout } = useAuth();

  const tabs = [
    {
      id: 'strategist',
      label: 'Growth Strategist',
      icon: Compass,
      badge: !userContext?.strategy ? 'New' : undefined,
    },
    { id: 'gigs', label: 'Gig Generator', icon: Sparkles },
    { id: 'briefs', label: 'Buyer Briefs', icon: Send },
    { id: 'research', label: 'Market Research', icon: BarChart3 },
    { id: 'saved', label: `Saved Gigs (${gigsCount})`, icon: Bookmark },
  ];

  return (
    <header className="w-full glass-panel border-b border-white/5 sticky top-0 z-50 px-4 md:px-6 py-2.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Brand */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 shrink-0">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-sm md:text-base tracking-tight text-white flex items-center gap-1.5">
                FiverrGrowth <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-mono border border-emerald-500/30">v2.0 Cockpit</span>
              </h1>
              <span className="hidden lg:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Feeds Online
              </span>
            </div>
            <p className="text-[10px] text-gray-400 hidden sm:block">Autonomous AI Freelance Strategy & Growth Engine</p>
          </div>
        </div>

        {/* Navigation Tabs - with scrollbar-none to prevent any native Windows scrollbars */}
        <nav className="flex items-center bg-gray-900/90 p-1 rounded-xl border border-white/10 gap-0.5 md:gap-1 scrollbar-none overflow-x-auto max-w-[50vw] sm:max-w-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-2.5 md:px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-gray-950 shadow-md shadow-emerald-500/20 font-bold'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-gray-950' : 'text-gray-400'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className={`px-1.5 py-0.2 rounded-full text-[9px] font-extrabold ${
                    isActive ? 'bg-gray-950 text-emerald-400' : 'bg-cyan-400 text-gray-950 animate-pulse'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Auth & Profile Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {user ? (
            <div className="flex items-center gap-2 bg-gray-900/90 py-1 px-2.5 rounded-xl border border-white/10 shadow-sm">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center text-gray-950 text-xs font-black">
                {user.username.charAt(0).toUpperCase()}
              </div>
              <div className="text-left hidden sm:block">
                <div className="text-xs font-bold text-white flex items-center gap-1 leading-none">
                  <span className="truncate max-w-[100px]">{user.username}</span>
                  {userContext?.strategy && (
                    <span title="Context Locked & Ready">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    </span>
                  )}
                </div>
                <div className="text-[9px] text-gray-400 font-mono leading-tight mt-0.5">
                  ID: {user.id.substring(0, 8)}...
                </div>
              </div>
              <button
                onClick={logout}
                title="Sign Out"
                className="ml-1 p-1 text-gray-400 hover:text-rose-400 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-gray-950 font-bold text-xs shadow-md shadow-emerald-500/20 hover:opacity-90 transition-all cursor-pointer"
            >
              <User className="w-3.5 h-3.5" />
              <span>Sign In / Join</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
