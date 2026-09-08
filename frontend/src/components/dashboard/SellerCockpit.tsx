import React from 'react';
import {
  Sparkles,
  TrendingUp,
  Send,
  Compass,
  CheckCircle2,
  DollarSign,
  ArrowRight,
  ShieldCheck,
  Zap,
  BarChart3,
  Flame,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface SellerCockpitProps {
  activeTab: string;
  onNavigateTab: (tab: string) => void;
  savedGigsCount: number;
}

export const SellerCockpit: React.FC<SellerCockpitProps> = ({
  activeTab,
  onNavigateTab,
  savedGigsCount,
}) => {
  const { user, userContext } = useAuth();
  const hasStrategy = !!userContext?.strategy;

  // 4-Step Guided Freelancer Pipeline
  const pipelineSteps = [
    {
      id: 'strategist',
      number: '01',
      title: 'Strategy & Identity',
      desc: hasStrategy ? 'Blueprint Locked' : 'Audit Profile & Niche',
      status: hasStrategy ? 'completed' : 'pending',
      icon: Compass,
    },
    {
      id: 'research',
      number: '02',
      title: 'Market Intelligence',
      desc: 'Live Buyer Search Terms',
      status: 'ready',
      icon: BarChart3,
    },
    {
      id: 'gigs',
      number: '03',
      title: '5-Tag Gig Studio',
      desc: savedGigsCount > 0 ? `${savedGigsCount} Gigs Built` : 'Craft High-Ticket Gigs',
      status: savedGigsCount > 0 ? 'completed' : 'ready',
      icon: Sparkles,
    },
    {
      id: 'briefs',
      number: '04',
      title: 'Live Brief Radar',
      desc: 'Pitch Real Client Deals',
      status: 'live',
      icon: Send,
    },
  ];

  const readinessScore = hasStrategy ? (savedGigsCount > 0 ? 96 : 78) : 35;

  return (
    <div className="w-full space-y-4">
      {/* Top Cockpit Header Banner with Subtle Ambient Glow */}
      <div className="relative overflow-hidden rounded-2xl border border-white/10 glass-panel p-5 md:p-6 shadow-2xl shadow-emerald-950/20 bg-gradient-to-br from-gray-900/90 via-slate-950/90 to-emerald-950/30">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          {/* Main Status & Welcome */}
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                Autonomous Engine Active
              </span>
              {hasStrategy ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                  <ShieldCheck className="w-3 h-3 text-cyan-400" />
                  Strategy Context Locked
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-amber-500/15 text-amber-300 border border-amber-500/30 animate-pulse">
                  <Zap className="w-3 h-3 text-amber-400" />
                  Action Required: Complete Onboarding Audit
                </span>
              )}
            </div>

            <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">
              {user ? `Welcome, ${user.username}` : 'FiverrGrowth Freelance Command Center'}
            </h2>
            <p className="text-xs md:text-sm text-gray-300 mt-1 leading-relaxed">
              {hasStrategy
                ? `Positioned as: ${userContext.strategy.profile_positioning?.recommended_title || 'AI & Full-Stack Solutions Engineer'}. Your unfair advantage is locked into all gig and proposal generators.`
                : 'Turn your skills into high-ticket freelance income. We examine your profile, find underserved market gaps, build 5-tag SEO gigs, and match you to active buyer briefs.'}
            </p>
          </div>

          {/* Quick Readiness Score Widget */}
          <div className="flex items-center gap-4 bg-gray-950/70 p-3.5 rounded-xl border border-white/10 shrink-0 w-full lg:w-auto justify-between sm:justify-start">
            <div>
              <div className="text-[11px] font-medium text-gray-400">Seller Readiness</div>
              <div className="text-2xl font-black text-white flex items-center gap-1.5">
                <span>{readinessScore}%</span>
                <span className="text-xs font-bold text-emerald-400">
                  {readinessScore > 80 ? 'Market Ready' : 'Setup In Progress'}
                </span>
              </div>
              <div className="w-36 h-1.5 bg-gray-800 rounded-full mt-1.5 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 transition-all duration-500 rounded-full"
                  style={{ width: `${readinessScore}%` }}
                />
              </div>
            </div>

            {!hasStrategy && (
              <button
                onClick={() => onNavigateTab('strategist')}
                className="px-3 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 text-gray-950 font-bold text-xs shadow-md shadow-emerald-500/20 hover:opacity-90 transition-all flex items-center gap-1 cursor-pointer shrink-0"
              >
                <span>Audit Now</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* 4 Executive KPI Metrics Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-5 pt-4 border-t border-white/5">
          <div className="bg-gray-950/40 p-3 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
            <div className="flex items-center justify-between text-gray-400 mb-1">
              <span className="text-[11px] font-medium">Market Velocity</span>
              <Flame className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <div className="text-base md:text-lg font-black text-white">98 / 100</div>
            <div className="text-[10px] text-emerald-400 flex items-center gap-1 mt-0.5">
              <TrendingUp className="w-2.5 h-2.5" />
              High Buyer Intent in AI & Web
            </div>
          </div>

          <div className="bg-gray-950/40 p-3 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
            <div className="flex items-center justify-between text-gray-400 mb-1">
              <span className="text-[11px] font-medium">Live Client Briefs</span>
              <Send className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <div className="text-base md:text-lg font-black text-white">18 Opportunities</div>
            <div className="text-[10px] text-cyan-400 flex items-center gap-1 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              Jobicy & Remotive Stream
            </div>
          </div>

          <div className="bg-gray-950/40 p-3 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
            <div className="flex items-center justify-between text-gray-400 mb-1">
              <span className="text-[11px] font-medium">Target Order Value</span>
              <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="text-base md:text-lg font-black text-white">$250 - $600</div>
            <div className="text-[10px] text-gray-400 mt-0.5">Value-based high ticket tier</div>
          </div>

          <div className="bg-gray-950/40 p-3 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
            <div className="flex items-center justify-between text-gray-400 mb-1">
              <span className="text-[11px] font-medium">Saved Studio Assets</span>
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            </div>
            <div className="text-base md:text-lg font-black text-white">{savedGigsCount} Gigs</div>
            <div className="text-[10px] text-purple-400 mt-0.5">Persistent local library</div>
          </div>
        </div>
      </div>

      {/* 4-Step Interactive Guided Pipeline Bar */}
      <div className="bg-gray-900/60 p-2 md:p-2.5 rounded-2xl border border-white/5 glass-panel">
        <div className="flex items-center justify-between px-2 mb-2">
          <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-emerald-400" />
            Seller Growth Pipeline
          </div>
          <div className="text-[10px] text-gray-500 font-mono">Step-by-step to first order</div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          {pipelineSteps.map((step) => {
            const Icon = step.icon;
            const isCurrent = activeTab === step.id;

            return (
              <button
                key={step.id}
                onClick={() => onNavigateTab(step.id)}
                className={`flex items-center gap-3 p-2.5 rounded-xl border text-left transition-all duration-200 cursor-pointer ${
                  isCurrent
                    ? 'bg-emerald-500/15 border-emerald-500/40 shadow-lg shadow-emerald-500/10'
                    : 'bg-gray-950/50 border-white/5 hover:border-white/15 hover:bg-gray-900/70'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    isCurrent
                      ? 'bg-emerald-500 text-gray-950 shadow-md shadow-emerald-500/20'
                      : step.status === 'completed'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-gray-800 text-gray-400'
                  }`}
                >
                  {step.status === 'completed' ? <CheckCircle2 className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-white flex items-center gap-1.5 truncate">
                    <span className="text-[10px] font-mono text-gray-500">{step.number}</span>
                    <span>{step.title}</span>
                    {step.status === 'live' && (
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                    )}
                  </div>
                  <div className="text-[10px] text-gray-400 truncate">{step.desc}</div>
                </div>

                <ArrowRight
                  className={`w-3.5 h-3.5 shrink-0 transition-transform ${
                    isCurrent ? 'text-emerald-400 translate-x-0.5' : 'text-gray-600'
                  }`}
                />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
