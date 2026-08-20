import React from 'react';
import { SearchSource } from '../../services/research/SearchProvider';
import { ExternalLink, ShieldCheck, Newspaper, MessageSquare } from 'lucide-react';

interface SourceCitationsProps {
  sources: SearchSource[];
}

export const SourceCitations: React.FC<SourceCitationsProps> = ({ sources }) => {
  if (!sources || sources.length === 0) return null;

  return (
    <div className="mt-3 pt-2.5 border-t border-white/10 space-y-2 select-none">
      <div className="flex items-center space-x-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
        <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
        <span>Verified Sources ({sources.length})</span>
      </div>

      <div className="flex flex-wrap gap-2">
        {sources.map((src, idx) => {
          const Icon = src.level === 1 ? ShieldCheck : src.level === 2 ? Newspaper : MessageSquare;
          const levelColor =
            src.level === 1
              ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/25'
              : src.level === 2
              ? 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30 hover:bg-cyan-500/25'
              : 'bg-purple-500/15 text-purple-300 border-purple-500/30 hover:bg-purple-500/25';

          return (
            <a
              key={idx}
              href={src.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-xl text-[11px] font-medium border transition-all ${levelColor}`}
              title={`${src.title} - ${src.url}`}
            >
              <Icon className="w-3 h-3 shrink-0" />
              <span className="truncate max-w-[150px]">{src.domain}</span>
              <ExternalLink className="w-2.5 h-2.5 opacity-60" />
            </a>
          );
        })}
      </div>
    </div>
  );
};
