import React, { useState } from 'react';
import { MemoryItem } from '../../types';
import { Brain, Plus, Trash2, Tag, Calendar } from 'lucide-react';

interface MemoryPageProps {
  memoryItems: MemoryItem[];
  onAddMemory: (item: Omit<MemoryItem, 'id' | 'updatedAt'>) => void;
  onDeleteMemory: (id: string) => void;
  onClearAllMemory: () => void;
}

export const MemoryPage: React.FC<MemoryPageProps> = ({
  memoryItems,
  onAddMemory,
  onDeleteMemory,
  onClearAllMemory,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [category, setCategory] = useState<MemoryItem['category']>('Personal Preferences');
  const [key, setKey] = useState('');
  const [value, setValue] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!key.trim() || !value.trim()) return;
    onAddMemory({ category, key: key.trim(), value: value.trim() });
    setKey('');
    setValue('');
    setIsModalOpen(false);
  };

  const categories: MemoryItem['category'][] = [
    'Personal Preferences',
    'Applications',
    'Projects',
    'Important Information',
    'Custom Instructions',
  ];

  return (
    <div className="flex-1 p-6 max-w-4xl mx-auto w-full space-y-6 overflow-y-auto">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Brain className="w-5 h-5 text-indigo-400" />
            Santosh Long-Term Memory
          </h2>
          <p className="text-xs text-slate-400">
            Preferences & facts remembered by Santosh AI across sessions
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {memoryItems.length > 0 && (
            <button
              onClick={onClearAllMemory}
              className="px-3 py-2 rounded-xl bg-slate-800 text-slate-400 hover:text-rose-400 text-xs border border-slate-700"
            >
              Clear All
            </button>
          )}

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-semibold shadow-lg shadow-cyan-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>Add Memory</span>
          </button>
        </div>
      </div>

      {/* Memory Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {memoryItems.length === 0 ? (
          <div className="col-span-2 glass-panel p-8 text-center text-slate-400 text-sm rounded-2xl">
            No memories saved yet. You can tell Santosh "Remember my favorite editor is VS Code" or click Add Memory.
          </div>
        ) : (
          memoryItems.map((item) => (
            <div key={item.id} className="glass-panel p-4 rounded-2xl space-y-2 relative group border border-slate-800">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-mono">
                  <Tag className="w-3 h-3" />
                  {item.category}
                </span>

                <button
                  onClick={() => onDeleteMemory(item.id)}
                  className="opacity-0 group-hover:opacity-100 p-1 rounded-lg hover:bg-rose-500/20 text-rose-400 transition-all"
                  title="Delete Memory"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-slate-200">{item.key}</h4>
                <p className="text-xs text-cyan-300 font-medium mt-0.5">{item.value}</p>
              </div>

              <div className="text-[10px] text-slate-500 font-mono pt-1 flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>Updated: {new Date(item.updatedAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Memory Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-md p-6 rounded-2xl border border-slate-700 space-y-4">
            <h3 className="text-base font-bold text-slate-100">Add New Memory Item</h3>

            <form onSubmit={handleAdd} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as MemoryItem['category'])}
                  className="w-full glass-input p-2.5 rounded-xl text-slate-200 focus:outline-none bg-slate-900"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Fact / Key</label>
                <input
                  type="text"
                  value={key}
                  onChange={(e) => setKey(e.target.value)}
                  placeholder="e.g. Favorite Code Editor"
                  className="w-full glass-input p-2.5 rounded-xl text-slate-200 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Value / Details</label>
                <input
                  type="text"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder="e.g. Visual Studio Code"
                  className="w-full glass-input p-2.5 rounded-xl text-slate-200 focus:outline-none"
                  required
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold"
                >
                  Save Memory
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
