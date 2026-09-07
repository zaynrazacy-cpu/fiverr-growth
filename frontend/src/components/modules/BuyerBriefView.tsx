import React, { useState } from 'react';
import { Send, Copy, Check, Clock, DollarSign, Award, RefreshCw } from 'lucide-react';

export const BuyerBriefView: React.FC<{ onProposalGenerated?: () => void }> = ({ onProposalGenerated }) => {
  const [briefText, setBriefText] = useState('Need an expert Python developer to scrape real estate listings from Redfin and Realtor.com and output clean CSV daily. Must handle anti-bot protection.');
  const [budget, setBudget] = useState('$150');
  const [urgency, setUrgency] = useState('2 Days');
  const [skills, setSkills] = useState('Python, Playwright, Scrapy, BeautifulSoup');
  const [loading, setLoading] = useState(false);
  const [proposal, setProposal] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  const handlePropose = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/v1/briefs/propose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brief_text: briefText,
          buyer_budget: budget,
          urgency: urgency,
          user_skills: skills.split(',').map((s) => s.trim()),
        }),
      });
      const json = await res.json();
      if (json.success) {
        setProposal(json.data);
        if (onProposalGenerated) onProposalGenerated();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const copyProposal = () => {
    if (!proposal) return;
    navigator.clipboard.writeText(proposal.proposal_text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Input Card */}
      <div className="glass-panel p-6 rounded-2xl border border-white/5">
        <div className="mb-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Send className="w-5 h-5 text-emerald-400" />
            Buyer Briefs & Job Proposal Generator
          </h3>
          <p className="text-xs text-gray-400">
            Paste any active Fiverr Buyer Brief. The AI extracts the buyer's unspoken fears and crafts a high-converting pitch in seconds.
          </p>
        </div>

        <form onSubmit={handlePropose} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">
              Client Buyer Brief (Paste here)
            </label>
            <textarea
              rows={4}
              value={briefText}
              onChange={(e) => setBriefText(e.target.value)}
              className="w-full glass-input p-4 rounded-xl text-sm focus:ring-1 focus:ring-emerald-500 resize-none"
              placeholder="Paste the buyer's post here..."
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                Stated Buyer Budget
              </label>
              <input
                type="text"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full glass-input px-4 py-2.5 rounded-xl text-sm"
                placeholder="e.g. $150 or Not specified"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                Urgency / Timeline
              </label>
              <input
                type="text"
                value={urgency}
                onChange={(e) => setUrgency(e.target.value)}
                className="w-full glass-input px-4 py-2.5 rounded-xl text-sm"
                placeholder="e.g. 24 Hours / 2 Days"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                Your Core Relevant Skills
              </label>
              <input
                type="text"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                className="w-full glass-input px-4 py-2.5 rounded-xl text-sm"
                placeholder="e.g. Python, Playwright, Scrapy"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-6 rounded-xl font-bold text-sm bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-gray-950 flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 transition-all disabled:opacity-50"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Synthesizing Custom Proposal...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Synthesize Winning Proposal
              </>
            )}
          </button>
        </form>
      </div>

      {/* Proposal Output */}
      {proposal && (
        <div className="glass-panel p-6 rounded-2xl border border-emerald-500/30 space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-white/5">
            <div>
              <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                Tailored Winning Pitch
              </span>
              <h3 className="text-lg font-bold text-white mt-0.5">
                Ready to Submit to Buyer Brief
              </h3>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 font-semibold">
                <DollarSign className="w-4 h-4" /> Bid: ${proposal.suggested_bid_usd}
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-xs text-cyan-300 font-semibold">
                <Clock className="w-4 h-4" /> {proposal.recommended_delivery_days} Days
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-purple-500/10 border border-purple-500/20 text-xs text-purple-300 font-semibold">
                <Award className="w-4 h-4" /> Match: {Math.round(proposal.confidence_score * 100)}%
              </div>
            </div>
          </div>

          <div className="relative">
            <pre className="glass-card p-5 rounded-xl text-sm text-gray-200 whitespace-pre-wrap font-sans border border-white/10 leading-relaxed">
              {proposal.proposal_text}
            </pre>
            <button
              onClick={copyProposal}
              className="absolute top-3 right-3 px-3 py-1.5 rounded-lg bg-emerald-500 text-gray-950 text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-500/20 hover:bg-emerald-400 transition-all"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied to Clipboard!' : 'Copy Proposal'}
            </button>
          </div>

          <div className="p-3 rounded-lg bg-white/5 border border-white/5 text-xs text-gray-400 flex items-center justify-between">
            <span>
              <strong className="text-emerald-400">Psychological Hook Used:</strong> {proposal.key_selling_hook}
            </span>
            <span className="text-[11px] text-gray-400">Paste directly into Fiverr Buyer Request modal</span>
          </div>
        </div>
      )}
    </div>
  );
};
