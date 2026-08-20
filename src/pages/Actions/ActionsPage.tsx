import React, { useState } from 'react';
import { securityManager } from '../../services/security/SecurityManager';
import { Zap, CheckCircle2, XCircle, AlertTriangle, ShieldCheck, Filter } from 'lucide-react';

export const ActionsPage: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'executed' | 'blocked'>('all');
  const auditLogs = securityManager.getAuditLogs();

  const filteredLogs = auditLogs.filter((log) => {
    if (filter === 'executed') return log.status === 'executed';
    if (filter === 'blocked') return log.status === 'blocked' || log.status === 'cancelled';
    return true;
  });

  return (
    <div className="flex-1 p-6 max-w-4xl mx-auto w-full space-y-6 overflow-y-auto select-none">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Zap className="w-5 h-5 text-purple-400" />
            Device Action History & Audit Log
          </h2>
          <p className="text-xs text-slate-400">
            Real-time verified system actions executed by Sathi AI
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center space-x-2 bg-slate-900/80 p-1 rounded-xl border border-white/10 text-xs">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              filter === 'all' ? 'bg-purple-600 text-white font-medium' : 'text-slate-400 hover:text-white'
            }`}
          >
            All Actions ({auditLogs.length})
          </button>
          <button
            onClick={() => setFilter('executed')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              filter === 'executed' ? 'bg-emerald-600 text-white font-medium' : 'text-slate-400 hover:text-white'
            }`}
          >
            Executed
          </button>
          <button
            onClick={() => setFilter('blocked')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              filter === 'blocked' ? 'bg-rose-600 text-white font-medium' : 'text-slate-400 hover:text-white'
            }`}
          >
            Blocked / Cancelled
          </button>
        </div>
      </div>

      {/* Timeline List */}
      <div className="space-y-3">
        {filteredLogs.length === 0 ? (
          <div className="glass-panel p-8 text-center text-slate-400 text-sm rounded-2xl">
            No system actions recorded yet. Command Sathi AI to open apps, search files, or take screenshots.
          </div>
        ) : (
          filteredLogs.map((log) => (
            <div
              key={log.id}
              className="glass-panel p-4 rounded-2xl border border-white/10 flex items-start justify-between space-x-4 hover:border-purple-500/30 transition-all"
            >
              <div className="flex items-start space-x-3.5">
                <div
                  className={`p-2.5 rounded-xl text-white ${
                    log.status === 'executed'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                  }`}
                >
                  {log.status === 'executed' ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                </div>

                <div className="space-y-0.5">
                  <div className="flex items-center space-x-2">
                    <h4 className="text-sm font-bold text-slate-200">{log.actionName}</h4>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full uppercase font-mono ${
                        log.riskLevel === 'HIGH'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : log.riskLevel === 'MEDIUM'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                      }`}
                    >
                      {log.riskLevel}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 font-mono">{log.details}</p>
                </div>
              </div>

              <div className="text-right text-[11px] text-slate-400 font-mono shrink-0">
                {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                <span className="block text-[10px] text-slate-500">
                  {new Date(log.timestamp).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
