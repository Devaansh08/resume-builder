import { useState } from 'react';
import { useResumeStore } from '../../store/resumeStore';
import type { Skill } from '../../types';
import { newSkill } from '../../utils/defaults';
import { Plus, Trash2, X, Zap } from 'lucide-react';

export function SkillsForm() {
  const { currentResume, updateSection } = useResumeStore();
  const skills = currentResume?.sections.skills || [];
  const [itemInput, setItemInput] = useState<Record<string, string>>({});

  const update = (updated: Skill[]) => updateSection('skills', updated);
  const add = () => { const s = newSkill(); update([...skills, s]); };
  const remove = (id: string) => update(skills.filter((s) => s.id !== id));
  const updateSkill = (id: string, field: keyof Skill, value: unknown) => {
    update(skills.map((s) => s.id === id ? { ...s, [field]: value } : s));
  };
  const addItem = (id: string) => {
    const item = itemInput[id]?.trim();
    if (!item) return;
    const skill = skills.find((s) => s.id === id);
    if (!skill) return;
    updateSkill(id, 'items', [...skill.items, item]);
    setItemInput((prev) => ({ ...prev, [id]: '' }));
  };
  const removeItem = (id: string, item: string) => {
    const skill = skills.find((s) => s.id === id);
    if (!skill) return;
    updateSkill(id, 'items', skill.items.filter((i) => i !== item));
  };

  const SUGGESTED_CATEGORIES = ['Technical Skills', 'Languages', 'Tools & Frameworks', 'Soft Skills', 'Databases', 'Cloud & DevOps'];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-500">{skills.reduce((acc, s) => acc + s.items.length, 0)} skills total</span>
        <button onClick={add} className="btn btn-primary btn-sm gap-1.5"><Plus size={14} /> Add Category</button>
      </div>

      {skills.length === 0 && (
        <div className="text-center py-10 border-2 border-dashed border-gray-200 dark:border-surface-700 rounded-2xl">
          <Zap size={32} className="text-gray-300 mx-auto mb-3" />
          <div className="text-sm text-gray-500 mb-2">Group your skills by category</div>
          <div className="text-xs text-gray-400 mb-4">ATS systems scan for specific skills</div>
          <div className="flex flex-wrap gap-2 justify-center mb-4">
            {SUGGESTED_CATEGORIES.slice(0, 3).map((cat) => (
              <button key={cat} onClick={() => {
                const s: Skill = { ...newSkill(), category: cat };
                update([...skills, s]);
              }} className="badge bg-brand-50 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400 cursor-pointer hover:bg-brand-100 transition-colors">
                + {cat}
              </button>
            ))}
          </div>
          <button onClick={add} className="btn btn-primary btn-sm"><Plus size={14} /> Add Skills Category</button>
        </div>
      )}

      {skills.map((skill) => (
        <div key={skill.id} className="card border border-gray-100 dark:border-surface-700 p-4 space-y-3">
          <div className="flex items-center gap-3">
            <input
              className="input flex-1"
              value={skill.category}
              onChange={(e) => updateSkill(skill.id, 'category', e.target.value)}
              placeholder="Category name (e.g. Technical Skills)"
            />
            <button onClick={() => remove(skill.id)} className="btn btn-ghost p-2 text-red-400 hover:text-red-600">
              <Trash2 size={14} />
            </button>
          </div>

          {/* Skills tags */}
          <div className="flex flex-wrap gap-2">
            {skill.items.map((item) => (
              <span key={item} className="badge bg-gray-100 dark:bg-surface-700 text-gray-700 dark:text-gray-300 pr-1.5">
                {item}
                <button onClick={() => removeItem(skill.id, item)} className="ml-1 hover:text-red-500">
                  <X size={10} />
                </button>
              </span>
            ))}
          </div>

          {/* Add item input */}
          <div className="flex gap-2">
            <input
              className="input text-sm"
              value={itemInput[skill.id] || ''}
              onChange={(e) => setItemInput((prev) => ({ ...prev, [skill.id]: e.target.value }))}
              onKeyDown={(e) => e.key === 'Enter' && addItem(skill.id)}
              placeholder="Type a skill and press Enter..."
            />
            <button onClick={() => addItem(skill.id)} className="btn btn-secondary btn-sm px-3">Add</button>
          </div>

          {/* Suggested skills */}
          {skill.category.toLowerCase().includes('tech') && (
            <div>
              <p className="text-xs text-gray-400 mb-2">Quick add:</p>
              <div className="flex flex-wrap gap-1.5">
                {['React', 'TypeScript', 'Node.js', 'Python', 'SQL', 'Docker', 'AWS', 'Git'].filter(s => !skill.items.includes(s)).map((s) => (
                  <button key={s} onClick={() => updateSkill(skill.id, 'items', [...skill.items, s])} className="text-xs px-2 py-1 rounded-lg border border-gray-200 dark:border-surface-600 text-gray-600 dark:text-gray-400 hover:border-brand-400 hover:text-brand-500 transition-colors">
                    + {s}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
