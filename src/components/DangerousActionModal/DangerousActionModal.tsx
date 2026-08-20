import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PendingAction } from '../../types';
import { AlertTriangle, ShieldAlert, CheckCircle2, XCircle } from 'lucide-react';

interface DangerousActionModalProps {
  pendingAction: PendingAction | null;
}

export const DangerousActionModal: React.FC<DangerousActionModalProps> = ({ pendingAction }) => {
  if (!pendingAction) return null;

  const { toolCall, onConfirm, onCancel } = pendingAction;
  const isHighRisk = toolCall.riskLevel === 'HIGH';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-md rounded-2xl glass-panel p-6 border border-amber-500/30 shadow-2xl overflow-hidden space-y-4"
        >
          {/* Top glow border bar */}
          <div
            className={`absolute top-0 left-0 right-0 h-1.5 ${
              isHighRisk
                ? 'bg-gradient-to-r from-rose-500 via-red-600 to-amber-500'
                : 'bg-gradient-to-r from-amber-400 to-sky-400'
            }`}
          />

          <div className="flex items-start space-x-4">
            <div
              className={`p-3 rounded-xl shrink-0 ${
                isHighRisk ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
              }`}
            >
              {isHighRisk ? <ShieldAlert className="w-7 h-7" /> : <AlertTriangle className="w-7 h-7" />}
            </div>

            <div className="flex-1 space-y-2">
              <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                Action Confirmation
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-mono uppercase ${
                    isHighRisk ? 'bg-rose-500/30 text-rose-300 border border-rose-500/40' : 'bg-amber-500/30 text-amber-300 border border-amber-500/40'
                  }`}
                >
                  {toolCall.riskLevel} Risk
                </span>
              </h3>
              <p className="text-xs text-amber-200/90 leading-relaxed">
                Sathi AI is requesting permission to execute the following desktop operation:
              </p>

              <div className="bg-slate-900/90 p-3 rounded-xl border border-white/10 space-y-1 font-mono text-xs text-slate-200">
                <div className="flex justify-between">
                  <span className="text-slate-400">Action:</span>
                  <span className="text-amber-300 font-bold">{pendingAction.toolCall.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Risk Level:</span>
                  <span className="text-rose-400 font-bold">{pendingAction.toolCall.riskLevel}</span>
                </div>
                {pendingAction.toolCall.args && Object.keys(pendingAction.toolCall.args).length > 0 && (
                  <div className="pt-1 border-t border-white/5 text-[11px]">
                    <span className="text-slate-400 block">Parameters:</span>
                    <pre className="text-slate-300 overflow-x-auto text-[10px]">
                      {JSON.stringify(pendingAction.toolCall.args, null, 2)}
                    </pre>
                  </div>
                )}
              </div>

              <p className="text-[11px] text-slate-400">
                {pendingAction.toolCall.riskLevel === 'HIGH'
                  ? 'CAUTION: This action modifies system files or computer power state.'
                  : 'Please confirm if you would like Sathi AI to execute this task.'}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end space-x-3">
            <button
              onClick={onCancel}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors border border-slate-700"
            >
              <XCircle className="w-4 h-4" />
              <span>Cancel</span>
            </button>
            <button
              onClick={onConfirm}
              className={`flex items-center space-x-1.5 px-5 py-2 rounded-xl text-white text-xs font-semibold transition-all shadow-lg ${
                isHighRisk
                  ? 'bg-rose-600 hover:bg-rose-500 shadow-rose-600/30'
                  : 'bg-purple-600 hover:bg-purple-500 shadow-purple-600/30'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Confirm & Execute</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
