import React, { useState, useEffect } from 'react';
import { Sparkles, Copy, Check, TrendingUp, Clock, RefreshCw, Award, Zap } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface GigGeneratorViewProps {
  onGigGenerated?: () => void;
  initialNiche?: string;
  initialSkills?: string;
}

export const GigGeneratorView: React.FC<GigGeneratorViewProps> = ({
  onGigGenerated,
  initialNiche,
  initialSkills,
}) => {
  const { user, userContext } = useAuth();

  const [niche, setNiche] = useState(
    initialNiche ||
      userContext?.strategy?.recommended_gigs?.[0]?.title ||
      'Production-Grade Next.js & React Web Application'
  );
  const [skill, setSkill] = useState(
    initialSkills ||
      userContext?.profile?.skills?.join(', ') ||
      'React, Next.js, Node.js, Tailwind CSS, TypeScript'
  );
  const [experience, setExperience] = useState('Expert');
  const [turnaround, setTurnaround] = useState('24 Hours');
  const [loading, setLoading] = useState(false);
  const [gig, setGig] = useState<any>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Sync props when user selects a recommended gig from Onboarding Blueprint
  useEffect(() => {
    if (initialNiche) setNiche(initialNiche);
    if (initialSkills) setSkill(initialSkills);
  }, [initialNiche, initialSkills]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/v1/gigs/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user?.id,
          service_niche: niche,
          primary_skill: skill,
          experience_level: experience,
          target_turnaround: turnaround,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setGig(json.data);
        if (onGigGenerated) onGigGenerated();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Context Grounding Banner */}
      {userContext?.strategy && (
        <div className="glass-panel p-4 rounded-2xl border border-emerald-500/20 bg-emerald-950/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white">
                  Grounded with {userContext.profile.name || user?.username}'s Blueprint
                </span>
                <span className="text-[10px] px-2 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 font-mono">
                  Context Active
                </span>
              </div>
              <p className="text-[11px] text-gray-400">
                Targeting: {userContext.strategy.profile_positioning?.recommended_title || 'Expert Freelancer'} &bull; User ID: {user?.id}
              </p>
            </div>
          </div>

          {/* Quick chip selector from recommended gigs */}
          {userContext.strategy.recommended_gigs && userContext.strategy.recommended_gigs.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 self-stretch md:self-auto">
              <span className="text-[10px] text-gray-400 font-semibold mr-1">Recommended:</span>
              {userContext.strategy.recommended_gigs.slice(0, 2).map((rec, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setNiche(rec.title)}
                  className="text-[10px] px-2.5 py-1 rounded-lg bg-white/5 hover:bg-emerald-500/20 hover:text-emerald-300 text-gray-300 border border-white/5 transition-all flex items-center gap-1"
                >
                  <Zap className="w-3 h-3 text-emerald-400" />
                  {rec.niche || rec.title.substring(0, 24)}...
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Form Card */}
      <div className="glass-panel p-6 rounded-2xl border border-white/5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-400" />
              Algorithmic Fiverr Gig Synthesizer
            </h3>
            <p className="text-xs text-gray-400">
              Generates high-ranking titles, 5-tiered SEO tags, 3-tier pricing, and conversion-engineered descriptions.
            </p>
          </div>
        </div>

        <form onSubmit={handleGenerate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">
              Service Niche
            </label>
            <input
              type="text"
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
              className="w-full glass-input px-4 py-2.5 rounded-xl text-sm focus:ring-1 focus:ring-emerald-500"
              placeholder="e.g. Python Web Scraping"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">
              Primary Skills & Tools
            </label>
            <input
              type="text"
              value={skill}
              onChange={(e) => setSkill(e.target.value)}
              className="w-full glass-input px-4 py-2.5 rounded-xl text-sm focus:ring-1 focus:ring-emerald-500"
              placeholder="e.g. Playwright, Scrapy, BeautifulSoup"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">
              Experience Positioning
            </label>
            <select
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              className="w-full glass-input px-4 py-2.5 rounded-xl text-sm"
            >
              <option value="Intermediate">Intermediate (Faster delivery hook)</option>
              <option value="Expert">Expert / Top-Tier Specialist</option>
              <option value="Agency">Full Agency / Enterprise Quality</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">
              Target Turnaround Speed
            </label>
            <select
              value={turnaround}
              onChange={(e) => setTurnaround(e.target.value)}
              className="w-full glass-input px-4 py-2.5 rounded-xl text-sm"
            >
              <option value="24 Hours">24 Hours (Maximum Conversion Hook)</option>
              <option value="48 Hours">48 Hours</option>
              <option value="3-5 Days">3-5 Days (Complex Projects)</option>
            </select>
          </div>

          <div className="md:col-span-2 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-6 rounded-xl font-bold text-sm bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-gray-950 flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 transition-all disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Synthesizing High-Ranking Gig with AI...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Generate High-Converting Fiverr Gig
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Generated Gig Output Card */}
      {gig && (
        <div className="glass-panel p-6 rounded-2xl border border-emerald-500/30 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Header & SEO Score */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-white/5">
            <div>
              <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                {gig.category} &gt; {gig.sub_category}
              </span>
              <h2 className="text-xl md:text-2xl font-bold text-white mt-1">
                {gig.title}
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <div className="px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-right">
                <div className="text-[10px] uppercase font-bold text-gray-400">Fiverr SEO Score</div>
                <div className="text-xl font-extrabold text-emerald-400 flex items-center gap-1 justify-end">
                  <TrendingUp className="w-4 h-4" />
                  {gig.seo_score || 95}/100
                </div>
              </div>
              <button
                onClick={() => copyToClipboard(gig.title, 'title')}
                className="p-3 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 transition-colors"
                title="Copy Title"
              >
                {copiedKey === 'title' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Search Tags */}
          <div>
            <div className="text-xs font-semibold text-gray-400 mb-2 flex items-center justify-between">
              <span>5 Search Tags (Click any tag to copy):</span>
              <button
                onClick={() => copyToClipboard(gig.search_tags.join(', '), 'tags')}
                className="text-emerald-400 hover:underline flex items-center gap-1 text-[11px]"
              >
                {copiedKey === 'tags' ? 'Copied all!' : 'Copy all 5 tags'}
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {gig.search_tags.map((tag: string, i: number) => (
                <button
                  key={i}
                  onClick={() => copyToClipboard(tag, `tag-${i}`)}
                  className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-medium hover:bg-emerald-500/20 transition-all flex items-center gap-1.5"
                >
                  #{tag}
                  {copiedKey === `tag-${i}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 opacity-60" />}
                </button>
              ))}
            </div>
          </div>

          {/* 3-Tier Pricing Packages */}
          <div>
            <h4 className="text-xs font-semibold text-gray-400 mb-3">3-Tier Pricing Packages:</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Basic */}
              <div className="glass-card p-4 rounded-xl border border-white/10 relative overflow-hidden">
                <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Basic</div>
                <div className="text-2xl font-black text-white mt-1">${gig.packages?.basic?.price_usd}</div>
                <div className="text-xs font-semibold text-emerald-400 mt-0.5">{gig.packages?.basic?.title}</div>
                <p className="text-xs text-gray-300 mt-2 min-h-12">{gig.packages?.basic?.description}</p>
                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-gray-400">
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {gig.packages?.basic?.delivery_days} Day Delivery</span>
                  <span>{gig.packages?.basic?.revisions} Revision</span>
                </div>
              </div>

              {/* Standard */}
              <div className="glass-card p-4 rounded-xl border border-emerald-500/40 relative overflow-hidden bg-emerald-950/20">
                <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-emerald-500 text-gray-950 text-[10px] font-extrabold uppercase">
                  Best Seller
                </div>
                <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Standard</div>
                <div className="text-2xl font-black text-white mt-1">${gig.packages?.standard?.price_usd}</div>
                <div className="text-xs font-semibold text-emerald-300 mt-0.5">{gig.packages?.standard?.title}</div>
                <p className="text-xs text-gray-300 mt-2 min-h-12">{gig.packages?.standard?.description}</p>
                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-gray-400">
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {gig.packages?.standard?.delivery_days} Days Delivery</span>
                  <span>{gig.packages?.standard?.revisions} Revisions</span>
                </div>
              </div>

              {/* Premium */}
              <div className="glass-card p-4 rounded-xl border border-cyan-500/30 relative overflow-hidden">
                <div className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Premium VIP</div>
                <div className="text-2xl font-black text-white mt-1">${gig.packages?.premium?.price_usd}</div>
                <div className="text-xs font-semibold text-cyan-300 mt-0.5">{gig.packages?.premium?.title}</div>
                <p className="text-xs text-gray-300 mt-2 min-h-12">{gig.packages?.premium?.description}</p>
                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-gray-400">
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {gig.packages?.premium?.delivery_days} Days Delivery</span>
                  <span>Unlimited Revisions</span>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-semibold text-gray-400">Description (Markdown):</h4>
              <button
                onClick={() => copyToClipboard(gig.description, 'description')}
                className="text-emerald-400 hover:underline flex items-center gap-1 text-[11px]"
              >
                {copiedKey === 'description' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                {copiedKey === 'description' ? 'Copied Description!' : 'Copy Description'}
              </button>
            </div>
            <pre className="glass-card p-4 rounded-xl text-xs text-gray-300 whitespace-pre-wrap font-sans max-h-60 overflow-y-auto border border-white/5">
              {gig.description}
            </pre>
          </div>

          {/* FAQs */}
          {gig.faqs && gig.faqs.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-gray-400 mb-2">Frequently Asked Questions ({gig.faqs.length}):</h4>
              <div className="space-y-2">
                {gig.faqs.map((faq: any, i: number) => (
                  <div key={i} className="glass-card p-3 rounded-lg text-xs border border-white/5">
                    <div className="font-bold text-white mb-1">Q: {faq.question}</div>
                    <div className="text-gray-300">A: {faq.answer}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
