// Achievements Form
import { useResumeStore } from '../../store/resumeStore';
import { Plus, Trash2, Trophy } from 'lucide-react';
import type { Achievement } from '../../types';
import { uuidv4 } from '../../utils/helpers';
import { SectionTitleEditor } from '../builder/SectionTitleEditor';

export function AchievementsForm() {
  const { currentResume, updateSection } = useResumeStore();
  const achievements = currentResume?.sections.achievements || [];
  const update = (updated: Achievement[]) => updateSection('achievements', updated);
  const add = () => update([...achievements, { id: uuidv4(), title: '', description: '', date: '' }]);
  const remove = (id: string) => update(achievements.filter((a) => a.id !== id));
  const updateA = (id: string, field: keyof Achievement, value: string) => {
    update(achievements.map((a) => a.id === id ? { ...a, [field]: value } : a));
  };

  return (
    <div className="space-y-4">
      <SectionTitleEditor sectionKey="achievements" defaultTitle="Key Achievements" />
      <div className="flex justify-end">
        <button onClick={add} className="btn btn-primary btn-sm gap-1.5"><Plus size={14} /> Add Achievement</button>
      </div>
      {achievements.length === 0 && (
        <div className="text-center py-10 border-2 border-dashed border-gray-200 dark:border-surface-700 rounded-2xl">
          <Trophy size={32} className="text-gray-300 mx-auto mb-3" />
          <div className="text-sm text-gray-500 mb-4">Add awards & achievements to impress recruiters</div>
          <button onClick={add} className="btn btn-primary btn-sm"><Plus size={14} /> Add Achievement</button>
        </div>
      )}
      {achievements.map((a) => (
        <div key={a.id} className="card border border-gray-100 dark:border-surface-700 p-4 space-y-3">
          <div className="flex justify-end">
            <button onClick={() => remove(a.id)} className="btn btn-ghost p-1.5 text-red-400"><Trash2 size={14} /></button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="sm:col-span-2">
              <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 block">Achievement Title *</label>
              <input className="input" value={a.title} onChange={(e) => updateA(a.id, 'title', e.target.value)} placeholder="Best Innovation Award, Hackathon Winner..." />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 block">Date</label>
              <input className="input" type="month" value={a.date} onChange={(e) => updateA(a.id, 'date', e.target.value)} />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 block">Description</label>
              <textarea className="input resize-none" rows={2} value={a.description} onChange={(e) => updateA(a.id, 'description', e.target.value)} placeholder="Won 1st place out of 500+ teams..." />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
