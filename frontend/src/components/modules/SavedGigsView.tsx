import React from 'react';
import { Bookmark, DollarSign } from 'lucide-react';

export const SavedGigsView: React.FC<{ gigs: any[] }> = ({ gigs }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-purple-400" />
            Your Saved Gigs & Library ({gigs.length})
          </h3>
          <p className="text-xs text-gray-400">
            All your synthesized gigs stored locally in the database for instant copying and reference.
          </p>
        </div>
      </div>

      {gigs.length === 0 ? (
        <div className="glass-panel p-12 rounded-2xl border border-white/5 text-center">
          <Bookmark className="w-8 h-8 text-gray-500 mx-auto mb-2" />
          <p className="text-sm text-gray-400">No gigs synthesized yet.</p>
          <p className="text-xs text-gray-500 mt-1">Use the Gig Generator tab to generate your first optimized gig!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {gigs.map((g, idx) => (
            <div key={g.id || idx} className="glass-panel p-5 rounded-2xl border border-white/10 space-y-4 hover:border-emerald-500/30 transition-all">
              <div>
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                  {g.category} &gt; {g.sub_category}
                </span>
                <h4 className="text-base font-bold text-white mt-1 line-clamp-2">
                  {g.title}
                </h4>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {g.search_tags?.map((t: string, ti: number) => (
                  <span key={ti} className="px-2 py-0.5 rounded text-[10px] bg-white/5 text-gray-300">
                    #{t}
                  </span>
                ))}
              </div>

              <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs text-gray-400">
                <span className="flex items-center gap-1 font-semibold text-emerald-400">
                  <DollarSign className="w-3.5 h-3.5" /> Basic: ${g.packages?.basic?.price_usd}
                </span>
                <span className="text-[11px] text-gray-500">
                  {new Date(g.createdAt || Date.now()).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
