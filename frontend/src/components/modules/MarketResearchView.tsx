import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  DollarSign,
  Target,
  Lightbulb,
  RefreshCw,
  Search,
  ExternalLink,
  Star,
  Activity,
  CheckCircle2,
  GitBranch
} from 'lucide-react';

export const MarketResearchView: React.FC = () => {
  const [keywords, setKeywords] = useState('AI Chatbot, LangChain, Next.js Development');
  const [loading, setLoading] = useState(false);
  const [research, setResearch] = useState<any>(null);
  const [liveIntelligence, setLiveIntelligence] = useState<any>(null);

  // Fetch initial live intelligence on load
  const fetchLiveIntelligence = async (nicheQuery: string) => {
    try {
      const res = await fetch(`/api/v1/market/intelligence?niche=${encodeURIComponent(nicheQuery)}`);
      const json = await res.json();
      if (json.success && json.data) {
        setLiveIntelligence(json.data);
      }
    } catch (err) {
      console.warn('Could not load live intelligence:', err);
    }
  };

  useEffect(() => {
    fetchLiveIntelligence('AI Chatbot & Next.js');
  }, []);

  const handleResearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const nicheStr = keywords.trim();
      fetchLiveIntelligence(nicheStr);

      const res = await fetch('/api/v1/research/niche', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          niche: nicheStr,
          skill_keywords: nicheStr.split(',').map((s) => s.trim()).filter(Boolean),
        }),
      });
      const json = await res.json();
      if (json.success) {
        setResearch(json.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Search & Control Card */}
      <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center gap-1">
                <Activity className="w-3 h-3 text-cyan-400" />
                Real-Time Market Spy Engine
              </span>
              <span className="text-[10px] text-gray-400 font-mono">
                Live Data &bull; Google Suggest &bull; Remote Feeds &bull; GitHub
              </span>
            </div>
            <h3 className="text-lg font-bold text-white">
              Autonomous Market Research & Trend Intelligence
            </h3>
            <p className="text-xs text-gray-400">
              Scans live search queries, real client remote jobs, and GitHub open-source repositories to uncover high-margin service niches.
            </p>
          </div>
        </div>

        <form onSubmit={handleResearch} className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">
              Service Niche or Tech Stack to Investigate
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                className="w-full glass-input pl-10 pr-4 py-2.5 rounded-xl text-sm"
                placeholder="e.g. AI Chatbot, Next.js, Python Web Scraping"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-6 rounded-xl font-bold text-sm bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 hover:opacity-95 text-gray-950 flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition-all disabled:opacity-50"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Harvesting Real-Time Market Intelligence...
              </>
            ) : (
              <>
                <Target className="w-4 h-4" />
                Run Real-Time Live Niche Research
              </>
            )}
          </button>
        </form>
      </div>

      {/* LIVE MARKET SIGNALS BANNER (Google Suggest & Remote Feeds) */}
      {liveIntelligence && (
        <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-white/5">
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                Live Real-World Signals for "{liveIntelligence.niche}"
              </h4>
              <p className="text-[11px] text-gray-400">
                Ground truth gathered from Google search suggestions, remote job boards, and developer activity.
              </p>
            </div>
            <span className="text-[10px] text-gray-400 font-mono">
              Live Updated: {new Date(liveIntelligence.last_updated).toLocaleTimeString()}
            </span>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="glass-card p-4 rounded-xl border border-white/5">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                Live Buyer Demand Score
              </span>
              <div className="text-2xl font-black text-emerald-400 mt-1 flex items-center gap-1.5">
                <TrendingUp className="w-5 h-5" />
                {liveIntelligence.opportunity_score}/100
              </div>
              <p className="text-[11px] text-gray-400 mt-0.5">{liveIntelligence.market_demand_level}</p>
            </div>

            <div className="glass-card p-4 rounded-xl border border-white/5">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                Real Market Rates
              </span>
              <div className="text-2xl font-black text-cyan-400 mt-1 flex items-center gap-1.5">
                <DollarSign className="w-5 h-5" />
                {liveIntelligence.salary_range?.avg}
              </div>
              <p className="text-[11px] text-gray-400 mt-0.5">
                Range: {liveIntelligence.salary_range?.min} - {liveIntelligence.salary_range?.max}
              </p>
            </div>

            <div className="glass-card p-4 rounded-xl border border-white/5">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                Active Client Job Listings
              </span>
              <div className="text-2xl font-black text-purple-400 mt-1 flex items-center gap-1.5">
                <Activity className="w-5 h-5" />
                {liveIntelligence.active_jobs_count}+
              </div>
              <p className="text-[11px] text-gray-400 mt-0.5">Verified open buyer/client briefs</p>
            </div>
          </div>

          {/* Real Buyer Intent Search Queries Cloud */}
          {liveIntelligence.buyer_search_keywords && liveIntelligence.buyer_search_keywords.length > 0 && (
            <div>
              <h5 className="text-xs font-bold text-white mb-2 flex items-center gap-1.5">
                <Search className="w-3.5 h-3.5 text-cyan-400" />
                Real Live Buyer Search Queries (Google Suggest Live):
              </h5>
              <div className="flex flex-wrap gap-2">
                {liveIntelligence.buyer_search_keywords.map((kw: string, i: number) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-mono flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    "{kw}"
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* GitHub Ecosystem Tools */}
          {liveIntelligence.github_ecosystem_tools && liveIntelligence.github_ecosystem_tools.length > 0 && (
            <div>
              <h5 className="text-xs font-bold text-white mb-3 flex items-center gap-1.5">
                <GitBranch className="w-3.5 h-3.5 text-cyan-400" />
                Top GitHub Ecosystem Tools & Frameworks for this Niche:
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {liveIntelligence.github_ecosystem_tools.slice(0, 4).map((tool: any, idx: number) => (
                  <a
                    key={idx}
                    href={tool.url}
                    target="_blank"
                    rel="noreferrer"
                    className="p-3 rounded-xl bg-white/5 border border-white/5 hover:border-cyan-500/30 transition-all flex items-start justify-between gap-3 group"
                  >
                    <div className="space-y-1">
                      <div className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors flex items-center gap-1.5">
                        <span>{tool.name}</span>
                        <ExternalLink className="w-3 h-3 opacity-60" />
                      </div>
                      <p className="text-[11px] text-gray-400 line-clamp-2">{tool.description}</p>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 font-mono flex items-center gap-1 shrink-0">
                      <Star className="w-3 h-3 fill-cyan-400 text-cyan-400" />
                      {tool.stars.toLocaleString()}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* AI STRATEGIC DEEP DIVE (Grounded in Real Signals) */}
      {research && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-6">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-emerald-400" />
              Strategic Niche Deep Dive & Actionable Differentiation
            </h4>

            {/* Market Gaps & Unserved Angles */}
            {research.unserved_market_gaps && (
              <div className="space-y-2">
                <span className="text-xs font-semibold text-gray-300">
                  High-Margin Market Gaps to Exploit:
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {research.unserved_market_gaps.map((gap: string, i: number) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20 text-xs text-gray-200 flex items-start gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{gap}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recommended High-Ticket Angles */}
            {research.recommended_gig_angles && (
              <div className="space-y-2">
                <span className="text-xs font-semibold text-gray-300">
                  Recommended High-Converting Gig Hooks:
                </span>
                <div className="space-y-2">
                  {research.recommended_gig_angles.map((angle: string, i: number) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl bg-white/5 border border-white/5 text-xs text-gray-200 flex items-start gap-2"
                    >
                      <span className="text-cyan-400 font-bold">{i + 1}.</span>
                      <span>{angle}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
