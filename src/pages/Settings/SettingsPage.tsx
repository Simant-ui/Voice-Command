import React, { useState } from 'react';
import { UserSettings } from '../../types';
import { Settings as SettingsIcon, Mic, Key, Shield, Eye, EyeOff, Save, Check } from 'lucide-react';

interface SettingsPageProps {
  settings: UserSettings;
  onSaveSettings: (newSettings: UserSettings) => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ settings, onSaveSettings }) => {
  const [form, setForm] = useState<UserSettings>({ ...settings });
  const [showKey, setShowKey] = useState(false);
  const [activeTab, setActiveTab] = useState<'general' | 'voice' | 'ai' | 'privacy'>('general');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(form);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="flex-1 p-6 max-w-4xl mx-auto w-full space-y-6 overflow-y-auto">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <SettingsIcon className="w-5 h-5 text-cyan-400" />
            Santosh AI Configuration & Settings
          </h2>
          <p className="text-xs text-slate-400">Configure AI models, voice triggers, and Windows startup</p>
        </div>

        <button
          onClick={handleSubmit}
          className="flex items-center space-x-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-bold shadow-lg shadow-cyan-500/25 transition-all"
        >
          {savedSuccess ? <Check className="w-4 h-4 text-emerald-300" /> : <Save className="w-4 h-4" />}
          <span>{savedSuccess ? 'Saved Settings!' : 'Save Changes'}</span>
        </button>
      </div>

      {/* Sub tabs */}
      <div className="flex space-x-2 border-b border-slate-800/80 pb-2 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('general')}
          className={`px-4 py-2 rounded-xl transition-colors ${
            activeTab === 'general' ? 'bg-slate-800 text-cyan-400 border border-slate-700' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          General & Windows
        </button>
        <button
          onClick={() => setActiveTab('voice')}
          className={`px-4 py-2 rounded-xl transition-colors ${
            activeTab === 'voice' ? 'bg-slate-800 text-cyan-400 border border-slate-700' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Voice & Speech
        </button>
        <button
          onClick={() => setActiveTab('privacy')}
          className={`px-4 py-2 rounded-xl transition-colors ${
            activeTab === 'privacy' ? 'bg-slate-800 text-cyan-400 border border-slate-700' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Privacy & Security
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* GENERAL TAB */}
        {activeTab === 'general' && (
          <div className="glass-panel p-6 rounded-2xl space-y-4 border border-slate-800">
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">System Integration</h3>

            <div className="space-y-1 text-xs">
              <label className="text-slate-300 font-medium">Appearance & Theme Mode</label>
              <select
                value={form.themeMode || 'dark'}
                onChange={(e) => setForm({ ...form, themeMode: e.target.value as any })}
                className="w-full glass-input p-2.5 rounded-xl text-slate-200 bg-slate-900 focus:outline-none"
              >
                <option value="dark">🌙 Dark Mode (Futuristic Obsidian #07090D)</option>
                <option value="light">☀️ Light Mode (Clean Slate #F8FAFC)</option>
                <option value="system">💻 System Default</option>
              </select>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60">
              <div>
                <span className="text-sm font-medium text-slate-200 block">Start Sathi AI with Windows</span>
                <span className="text-xs text-slate-400">Launch silently in system tray when Windows boots</span>
              </div>
              <input
                type="checkbox"
                checked={form.startWithWindows}
                onChange={(e) => setForm({ ...form, startWithWindows: e.target.checked })}
                className="w-5 h-5 accent-cyan-500 rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60">
              <div>
                <span className="text-sm font-medium text-slate-200 block">Minimize to System Tray</span>
                <span className="text-xs text-slate-400">Closing window minimizes application instead of quitting</span>
              </div>
              <input
                type="checkbox"
                checked={form.minimizeToTray}
                onChange={(e) => setForm({ ...form, minimizeToTray: e.target.checked })}
                className="w-5 h-5 accent-cyan-500 rounded cursor-pointer"
              />
            </div>
          </div>
        )}

        {/* VOICE & LANGUAGE TAB */}
        {activeTab === 'voice' && (
          <div className="glass-panel p-6 rounded-2xl space-y-4 border border-slate-800">
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Language & Speech Engine</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1 text-xs">
                <label className="text-slate-300 font-medium">Assistant Language</label>
                <select
                  value={form.assistantLanguage || 'auto'}
                  onChange={(e) => setForm({ ...form, assistantLanguage: e.target.value as any })}
                  className="w-full glass-input p-2.5 rounded-xl text-slate-200 bg-slate-900 focus:outline-none"
                >
                  <option value="auto">Auto Detect (English, Nepali, Nepanglish)</option>
                  <option value="ne">नेपाली (Nepali)</option>
                  <option value="en">English</option>
                </select>
              </div>

              <div className="space-y-1 text-xs">
                <label className="text-slate-300 font-medium">Voice / STT Language</label>
                <select
                  value={form.voiceLanguage || 'auto'}
                  onChange={(e) => setForm({ ...form, voiceLanguage: e.target.value as any })}
                  className="w-full glass-input p-2.5 rounded-xl text-slate-200 bg-slate-900 focus:outline-none"
                >
                  <option value="auto">Auto Selection (ne-NP / en-US)</option>
                  <option value="ne-NP">नेपाली (ne-NP)</option>
                  <option value="en-US">English (en-US)</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60">
              <div>
                <span className="text-sm font-medium text-slate-200 block">Wake Word Activation (Privacy & Battery Protection)</span>
                <span className="text-xs text-slate-400">Wake assistant strictly on "Hey Sathi" or "साथी सुन". Mic stays sleeping by default.</span>
              </div>
              <input
                type="checkbox"
                checked={form.wakeWordEnabled}
                onChange={(e) => setForm({ ...form, wakeWordEnabled: e.target.checked })}
                className="w-5 h-5 accent-purple-500 rounded cursor-pointer"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1 text-xs">
                <label className="text-slate-300 font-medium">Wake Phrase</label>
                <input
                  type="text"
                  value={form.wakePhrase || 'Hey Sathi'}
                  onChange={(e) => setForm({ ...form, wakePhrase: e.target.value })}
                  placeholder="Hey Sathi / साथी सुन"
                  className="w-full glass-input p-2.5 rounded-xl text-slate-100 font-mono focus:outline-none"
                />
              </div>

              <div className="space-y-1 text-xs">
                <label className="text-slate-300 font-medium">Follow-Up Listening Timeout</label>
                <select
                  value={form.followUpTimeoutSeconds || 8}
                  onChange={(e) => setForm({ ...form, followUpTimeoutSeconds: Number(e.target.value) })}
                  className="w-full glass-input p-2.5 rounded-xl text-slate-200 bg-slate-900 focus:outline-none"
                >
                  <option value={5}>5 seconds</option>
                  <option value={8}>8 seconds (Default)</option>
                  <option value={12}>12 seconds</option>
                  <option value={15}>15 seconds</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60">
              <div>
                <span className="text-sm font-medium text-slate-200 block">Follow-Up Listening Window</span>
                <span className="text-xs text-slate-400">Keep mic active briefly after executing a command for chained follow-ups</span>
              </div>
              <input
                type="checkbox"
                checked={form.followUpListening ?? true}
                onChange={(e) => setForm({ ...form, followUpListening: e.target.checked })}
                className="w-5 h-5 accent-purple-500 rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60">
              <div>
                <span className="text-sm font-medium text-slate-200 block">Automatic Text-to-Speech</span>
                <span className="text-xs text-slate-400">Speak AI responses aloud automatically</span>
              </div>
              <input
                type="checkbox"
                checked={form.autoSpeak}
                onChange={(e) => setForm({ ...form, autoSpeak: e.target.checked })}
                className="w-5 h-5 accent-cyan-500 rounded cursor-pointer"
              />
            </div>

            <div className="space-y-1 text-xs">
              <label className="text-slate-300 font-medium">Speech Speed Rate ({form.ttsRate}x)</label>
              <input
                type="range"
                min="0.5"
                max="1.5"
                step="0.1"
                value={form.ttsRate}
                onChange={(e) => setForm({ ...form, ttsRate: parseFloat(e.target.value) })}
                className="w-full accent-cyan-500"
              />
            </div>
          </div>
        )}



        {/* PRIVACY TAB */}
        {activeTab === 'privacy' && (
          <div className="glass-panel p-6 rounded-2xl space-y-4 border border-slate-800">
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Privacy Controls</h3>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60">
              <div>
                <span className="text-sm font-medium text-slate-200 block">Save Conversations</span>
                <span className="text-xs text-slate-400">Persist chat history locally in SQLite</span>
              </div>
              <input
                type="checkbox"
                checked={form.saveConversations}
                onChange={(e) => setForm({ ...form, saveConversations: e.target.checked })}
                className="w-5 h-5 accent-cyan-500 rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60">
              <div>
                <span className="text-sm font-medium text-slate-200 block">Save Long-Term Memory</span>
                <span className="text-xs text-slate-400">Store learned user preferences</span>
              </div>
              <input
                type="checkbox"
                checked={form.saveMemory}
                onChange={(e) => setForm({ ...form, saveMemory: e.target.checked })}
                className="w-5 h-5 accent-cyan-500 rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60">
              <div>
                <span className="text-sm font-medium text-slate-200 block">Anonymous Telemetry</span>
                <span className="text-xs text-slate-400">Always disabled by default</span>
              </div>
              <input
                type="checkbox"
                checked={form.telemetry}
                onChange={(e) => setForm({ ...form, telemetry: e.target.checked })}
                className="w-5 h-5 accent-cyan-500 rounded cursor-pointer"
              />
            </div>
          </div>
        )}
      </form>
    </div>
  );
};
