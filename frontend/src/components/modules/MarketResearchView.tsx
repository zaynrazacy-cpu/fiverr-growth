import React, { useState } from 'react';
import { BarChart3, TrendingUp, DollarSign, Target, Lightbulb, RefreshCw } from 'lucide-react';

export const MarketResearchView: React.FC = () => {
  const [keywords, setKeywords] = useState('Python web scraping, Lead generation bot, FastAPI backend');
  const [loading, setLoading] = useState(false);
  const [research, setResearch] = useState<any>(null);

  const handleResearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/v1/research/niche', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          skill_keywords: keywords.split(',').map((s) => s.trim()),
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
      <div className="glass-panel p-6 rounded-2xl border border-white/5">
        <div className="mb-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-cyan-400" />
            Autonomous Fiverr Market & Opportunity Intelligence
          </h3>
          <p className="text-xs text-gray-400">
            Scan your target keywords across Fiverr to detect competition pressure, average pricing, and unserved buyer gaps.
          </p>
        </div>

        <form onSubmit={handleResearch} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">
              Target Skills & Service Keywords (comma separated)
            </label>
            <input
              type="text"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              className="w-full glass-input px-4 py-2.5 rounded-xl text-sm"
              placeholder="e.g. Python scraper, Shopify bot, AI chatbot"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-6 rounded-xl font-bold text-sm bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-gray-950 flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 transition-all disabled:opacity-50"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Scanning Fiverr Marketplace Dynamics...
              </>
            ) : (
              <>
                <Target className="w-4 h-4" />
                Analyze Niche Opportunity
              </>
            )}
          </button>
        </form>
      </div>

      {research && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Top Metric Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="glass-panel p-5 rounded-2xl border border-white/5">
              <div className="text-xs font-bold text-gray-400 uppercase">Opportunity Score</div>
              <div className="text-3xl font-black text-emerald-400 mt-1 flex items-center gap-2">
                <TrendingUp className="w-6 h-6" />
                {research.overall_niche_score}/100
              </div>
              <p className="text-xs text-gray-400 mt-1">High probability of ranking on Page 1</p>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-white/5">
              <div className="text-xs font-bold text-gray-400 uppercase">Pricing Benchmark</div>
              <div className="text-3xl font-black text-cyan-400 mt-1 flex items-center gap-2">
                <DollarSign className="w-6 h-6" />
                ${research.pricing_benchmarks?.recommended_entry_price || 30}
              </div>
              <p className="text-xs text-gray-400 mt-1">Recommended competitive entry price</p>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-white/5">
              <div className="text-xs font-bold text-gray-400 uppercase">Price Range</div>
              <div className="text-lg font-bold text-white mt-1">
                ${research.pricing_benchmarks?.avg_basic_price} &rarr; ${research.pricing_benchmarks?.avg_premium_price}
              </div>
              <p className="text-xs text-gray-400 mt-1">Basic to Premium spread</p>
            </div>
          </div>

          {/* Strategic Advice */}
          <div className="glass-panel p-5 rounded-2xl border border-cyan-500/30 bg-cyan-950/20">
            <h4 className="text-sm font-bold text-cyan-300 flex items-center gap-2 mb-1.5">
              <Lightbulb className="w-4 h-4 text-cyan-400" />
              Strategic Positioning Recommendation
            </h4>
            <p className="text-xs text-gray-200 leading-relaxed">
              {research.strategic_advice}
            </p>
          </div>

          {/* High Demand Gaps */}
          {research.high_demand_gaps && (
            <div className="glass-panel p-5 rounded-2xl border border-white/5">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                Underserved Gaps in Current Competitor Gigs:
              </h4>
              <ul className="space-y-2">
                {research.high_demand_gaps.map((gap: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-gray-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5" />
                    <span>{gap}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
