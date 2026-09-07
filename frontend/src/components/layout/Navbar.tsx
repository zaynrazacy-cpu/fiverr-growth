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
    <nav className="w-full glass-panel border-b border-white/5 sticky top-0 z-50 px-4 md:px-6 py-3.5">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 shrink-0">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-extrabold text-base md:text-lg tracking-tight text-white flex items-center gap-2">
              FiverrGrowth <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">v1.2</span>
            </h1>
            <p className="text-[11px] text-gray-400">Autonomous Freelance Growth & Strategy Platform</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center bg-gray-900/80 p-1 rounded-xl border border-white/5 gap-1 overflow-x-auto max-w-full">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 md:gap-2 px-3 md:px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 whitespace-nowrap ${
                  isActive
                    ? 'bg-emerald-500 text-gray-950 shadow-md shadow-emerald-500/20 font-bold'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className="px-1.5 py-0.2 rounded-full text-[9px] bg-cyan-400 text-gray-950 font-extrabold animate-pulse">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Auth & Profile Actions */}
        <div className="flex items-center gap-2">
          {user ? (
            <div className="flex items-center gap-2 bg-gray-900/90 py-1 px-3 rounded-xl border border-white/5">
              <div className="w-6 h-6 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-300 text-xs font-bold">
                {user.username.charAt(0).toUpperCase()}
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-white flex items-center gap-1.5 leading-none">
                  <span>{user.username}</span>
                  {userContext?.strategy && (
                    <span title="Context Locked">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    </span>
                  )}
                </div>
                <div className="text-[9px] text-gray-400 font-mono">
                  ID: {user.id.substring(0, 8)}...
                </div>
              </div>
              <button
                onClick={logout}
                title="Sign Out"
                className="ml-1 p-1 text-gray-400 hover:text-rose-400 rounded hover:bg-white/5 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-gray-950 font-bold text-xs shadow-md shadow-emerald-500/20 hover:opacity-90 transition-all"
            >
              <User className="w-3.5 h-3.5" />
              <span>Sign In / Join</span>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};
