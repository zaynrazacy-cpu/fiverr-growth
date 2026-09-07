import React, { useState, useEffect, useRef } from 'react';
import {
  Send,
  Copy,
  Check,
  Clock,
  DollarSign,
  Award,
  RefreshCw,
  CheckCircle2,
  UserCheck,
  Radio,
  ExternalLink,
  Briefcase,
  Zap
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface LiveBriefItem {
  id: string;
  source: string;
  client_title: string;
  company: string;
  budget: string;
  description: string;
  url: string;
  pub_date: string;
  skills: string[];
}

export const BuyerBriefView: React.FC<{ onProposalGenerated?: () => void }> = ({ onProposalGenerated }) => {
  const { user, userContext } = useAuth();

  const [briefText, setBriefText] = useState(
    'Need an expert developer to build a modern full-stack web application with responsive UI, clean backend APIs, and integration of an AI customer chatbot. Need fast turnaround and clean documentation.'
  );
  const [budget, setBudget] = useState('$350');
  const [urgency, setUrgency] = useState('3 Days');
  const [skills, setSkills] = useState(
    userContext?.profile?.skills?.join(', ') || 'Next.js, React, Node.js, Python, Tailwind CSS'
  );
  const [loading, setLoading] = useState(false);
  const [proposal, setProposal] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  // Live briefs state
  const [liveBriefs, setLiveBriefs] = useState<LiveBriefItem[]>([]);
  const [loadingLive, setLoadingLive] = useState(false);
  const [selectedTag, setSelectedTag] = useState<string>('developer');

  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (userContext?.profile?.skills) {
      setSkills(userContext.profile.skills.join(', '));
    }
  }, [userContext]);

  const fetchLiveBriefs = async (tag: string = selectedTag) => {
    setLoadingLive(true);
    try {
      const res = await fetch(`/api/v1/briefs/live?tag=${encodeURIComponent(tag)}&limit=8`);
      const json = await res.json();
      if (json.success && json.data) {
        setLiveBriefs(json.data);
      }
    } catch (err) {
      console.warn('Error fetching live briefs:', err);
    } finally {
      setLoadingLive(false);
    }
  };

  useEffect(() => {
    fetchLiveBriefs(selectedTag);
  }, [selectedTag]);

  const handleSelectLiveBrief = (item: LiveBriefItem) => {
    setBriefText(`[Client: ${item.company}] ${item.client_title}\n\nProject Scope:\n${item.description}`);
    setBudget(item.budget || '$250');
    setUrgency('2-3 Days');
    if (item.skills && item.skills.length > 0) {
      setSkills(item.skills.join(', '));
    }
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handlePropose = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/v1/briefs/propose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user?.id,
          brief_text: briefText,
          buyer_budget: budget,
          urgency: urgency,
          user_skills: skills.split(',').map((s) => s.trim()).filter(Boolean),
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

  const filterTags = ['developer', 'python', 'react', 'fullstack', 'ai'];

  return (
    <div className="space-y-8">
      {/* Context Grounding Indicator */}
      {userContext?.profile && (
        <div className="glass-panel p-4 rounded-2xl border border-cyan-500/20 bg-cyan-950/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
              <UserCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white">
                  Pitching as: {userContext.profile.name || user?.username}
                </span>
                <span className="text-[10px] px-2 py-0.2 rounded-full bg-cyan-500/20 text-cyan-300 font-mono">
                  Profile Grounded
                </span>
              </div>
              <p className="text-[11px] text-gray-400">
                {userContext.profile.fiverr_profile_url
                  ? `Portfolio Linked: ${userContext.profile.fiverr_profile_url}`
                  : 'Tailored using verified skills & positioning'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-cyan-300 font-mono">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Zero Generic Fluff &bull; Real Stats
          </div>
        </div>
      )}

      {/* REAL LIVE CLIENT BRIEFS / JOBS FEED */}
      <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
                Live Client Feed (Real-Time External Feeds)
              </span>
              <span className="text-[10px] text-gray-400 font-mono">
                {liveBriefs.length} Active Opportunities Found
              </span>
            </div>
            <h3 className="text-base font-bold text-white">
              Verified Real-World Client Projects & Buyer Briefs
            </h3>
            <p className="text-xs text-gray-400">
              Real projects posted by hiring companies worldwide. Click any card to instantly import and generate a winning customized pitch.
            </p>
          </div>

          {/* Filter pills & refresh */}
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-gray-950/60 p-1 rounded-xl border border-white/5 gap-1">
              {filterTags.map((t) => (
                <button
                  key={t}
                  onClick={() => setSelectedTag(t)}
                  className={`text-[10px] px-2.5 py-1 rounded-lg font-semibold uppercase transition-all ${
                    selectedTag === t
                      ? 'bg-emerald-500 text-gray-950 font-bold'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            <button
              onClick={() => fetchLiveBriefs(selectedTag)}
              disabled={loadingLive}
              title="Refresh Live Feed"
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 border border-white/5 transition-all"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loadingLive ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Live Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          {liveBriefs.map((item) => (
            <div
              key={item.id}
              className="glass-card p-4 rounded-xl border border-white/5 hover:border-emerald-500/40 transition-all flex flex-col justify-between space-y-3 group"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-emerald-400 flex items-center gap-1">
                    <Briefcase className="w-3 h-3" />
                    {item.company}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-white/5 text-gray-300 font-mono text-[10px]">
                    {item.budget}
                  </span>
                </div>

                <h4 className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors line-clamp-2">
                  {item.client_title}
                </h4>

                <p className="text-[11px] text-gray-400 line-clamp-3 leading-relaxed">
                  {item.description}
                </p>

                {item.skills && item.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {item.skills.slice(0, 3).map((s, i) => (
                      <span
                        key={i}
                        className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-2 border-t border-white/5 flex items-center justify-between gap-2">
                <a
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[10px] text-gray-400 hover:text-white flex items-center gap-1"
                >
                  <span>Client Link</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>

                <button
                  onClick={() => handleSelectLiveBrief(item)}
                  className="px-2.5 py-1 rounded-lg bg-emerald-500 text-gray-950 hover:bg-emerald-400 text-[10px] font-extrabold transition-all flex items-center gap-1 shadow-sm shadow-emerald-500/20"
                >
                  <Zap className="w-3 h-3" />
                  Pitch This Brief
                </button>
              </div>
            </div>
          ))}

          {liveBriefs.length === 0 && !loadingLive && (
            <div className="col-span-full py-8 text-center text-xs text-gray-400">
              No live briefs currently loaded. Click Refresh to query remote APIs.
            </div>
          )}
        </div>
      </div>

      {/* Input Card */}
      <div ref={formRef} className="glass-panel p-6 rounded-2xl border border-white/5">
        <div className="mb-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Send className="w-5 h-5 text-emerald-400" />
            AI Proposal & Pitch Synthesizer
          </h3>
          <p className="text-xs text-gray-400">
            Selected live project or pasted Fiverr buyer brief. The AI extracts the buyer's unspoken fears and crafts a high-converting pitch in seconds.
          </p>
        </div>

        <form onSubmit={handlePropose} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5 flex items-center justify-between">
              <span>Client Buyer Brief / Project Scope</span>
              <span className="text-[10px] text-emerald-400 font-mono">Auto-Filled from Live Feed or Custom</span>
            </label>
            <textarea
              rows={4}
              value={briefText}
              onChange={(e) => setBriefText(e.target.value)}
              className="w-full glass-input p-4 rounded-xl text-sm focus:ring-1 focus:ring-emerald-500 resize-none"
              placeholder="Paste the buyer's post or pick a live brief from above..."
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
                Synthesizing Custom Proposal from Real Data...
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
