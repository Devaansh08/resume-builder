import React, { useState } from 'react';
import { useResumeStore } from '../../store/resumeStore';
import { newInterest } from '../../utils/defaults';
import { Plus, Trash2, Heart, Sparkles } from 'lucide-react';

const SUGGESTED_INTERESTS = [
  'Artificial Intelligence & Robotics',
  'Open-Source Software Mentorship',
  'Competitive Marathon Running',
  'High-Altitude Mountaineering',
  'Documentary Filmmaking',
  'Contemporary Art Curation',
  'Chess & Strategy Games',
  'Acoustic Guitar & Piano Composition',
  'Tech Entrepreneurship Podcasts',
  'Philanthropic Community Leadership',
];

export function InterestsForm() {
  const { currentResume, updateSection } = useResumeStore();
  const [customInput, setCustomInput] = useState('');

  if (!currentResume) return null;
  const interests = currentResume.sections.interests || [];

  const handleAddInterest = (name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    if (interests.some((i) => i.name.toLowerCase() === trimmed.toLowerCase())) return;
    const item = newInterest();
    item.name = trimmed;
    updateSection('interests', [...interests, item]);
    setCustomInput('');
  };

  const handleRemoveInterest = (id: string) => {
    updateSection('interests', interests.filter((i) => i.id !== id));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddInterest(customInput);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 dark:border-surface-800 pb-4">
        <div>
          <h3 className="font-display font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
            <Heart size={18} className="text-rose-500" />
            Personal Interests & Hobbies
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            Showcase unique personal pursuits or extracurricular passions that add character during recruiter interviews.
          </p>
        </div>
      </div>

      {/* Input box */}
      <div className="flex gap-2">
        <input
          type="text"
          value={customInput}
          onChange={(e) => setCustomInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="e.g. Open-Source AI, Marathon Running, Chess Strategy..."
          className="input flex-1 text-sm"
        />
        <button
          type="button"
          onClick={() => handleAddInterest(customInput)}
          disabled={!customInput.trim()}
          className="btn btn-primary btn-md gap-1.5 flex-shrink-0"
        >
          <Plus size={16} /> Add Interest
        </button>
      </div>

      {/* Current Interests Chips */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider block">
          Added Interests ({interests.length})
        </label>
        {interests.length === 0 ? (
          <div className="p-6 rounded-2xl border-2 border-dashed border-gray-200 dark:border-surface-800 text-center text-xs text-gray-400">
            No interests added yet. Type an interest above or click a suggestion below!
          </div>
        ) : (
          <div className="flex flex-wrap gap-2 pt-1">
            {interests.map((item) => (
              <span
                key={item.id}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800/60 text-xs font-medium group animate-scale-up"
              >
                <span>{item.name}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveInterest(item.id)}
                  className="text-rose-400 hover:text-rose-600 dark:hover:text-rose-200 transition-colors p-0.5 rounded-full hover:bg-rose-100 dark:hover:bg-rose-900/50"
                  title="Remove interest"
                >
                  <Trash2 size={13} />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Quick AI Recommendations */}
      <div className="p-4 rounded-2xl bg-gray-50 dark:bg-surface-800/50 border border-gray-200/60 dark:border-surface-700/60 space-y-3">
        <div className="flex items-center gap-1.5 text-xs font-bold text-gray-800 dark:text-gray-200">
          <Sparkles size={14} className="text-amber-500" />
          Quick Recommendations (Click to Add)
        </div>
        <div className="flex flex-wrap gap-1.5">
          {SUGGESTED_INTERESTS.map((sug) => {
            const isAdded = interests.some((i) => i.name.toLowerCase() === sug.toLowerCase());
            if (isAdded) return null;
            return (
              <button
                key={sug}
                type="button"
                onClick={() => handleAddInterest(sug)}
                className="px-2.5 py-1 rounded-lg bg-white dark:bg-surface-900 border border-gray-200 dark:border-surface-700 text-gray-600 dark:text-gray-300 text-[11px] hover:border-brand-400 hover:text-brand-600 dark:hover:text-brand-400 transition-all shadow-sm flex items-center gap-1"
              >
                <Plus size={11} className="text-gray-400" /> {sug}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
