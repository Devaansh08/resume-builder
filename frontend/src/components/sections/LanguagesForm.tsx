// Languages Form
import { useResumeStore } from '../../store/resumeStore';
import { Plus, Trash2, Globe } from 'lucide-react';
import type { Language } from '../../types';
import { uuidv4 } from '../../utils/helpers';

const PROFICIENCY_LEVELS: { value: Language['proficiency']; label: string }[] = [
  { value: 'basic', label: 'Basic' },
  { value: 'conversational', label: 'Conversational' },
  { value: 'professional', label: 'Professional' },
  { value: 'native', label: 'Native / Bilingual' },
];

export function LanguagesForm() {
  const { currentResume, updateSection } = useResumeStore();
  const languages = currentResume?.sections.languages || [];
  const update = (updated: Language[]) => updateSection('languages', updated);
  const add = () => update([...languages, { id: uuidv4(), name: '', proficiency: 'professional' }]);
  const remove = (id: string) => update(languages.filter((l) => l.id !== id));
  const updateL = (id: string, field: keyof Language, value: string) => {
    update(languages.map((l) => l.id === id ? { ...l, [field]: value } : l));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button onClick={add} className="btn btn-primary btn-sm gap-1.5"><Plus size={14} /> Add Language</button>
      </div>
      {languages.length === 0 && (
        <div className="text-center py-10 border-2 border-dashed border-gray-200 dark:border-surface-700 rounded-2xl">
          <Globe size={32} className="text-gray-300 mx-auto mb-3" />
          <div className="text-sm text-gray-500 mb-4">Add languages you speak</div>
          <button onClick={add} className="btn btn-primary btn-sm"><Plus size={14} /> Add Language</button>
        </div>
      )}
      <div className="space-y-3">
        {languages.map((lang) => (
          <div key={lang.id} className="card border border-gray-100 dark:border-surface-700 p-4">
            <div className="flex items-center gap-3">
              <input className="input flex-1" value={lang.name} onChange={(e) => updateL(lang.id, 'name', e.target.value)} placeholder="English, Spanish, French..." />
              <select className="input w-auto" value={lang.proficiency} onChange={(e) => updateL(lang.id, 'proficiency', e.target.value)}>
                {PROFICIENCY_LEVELS.map((l) => (
                  <option key={l.value} value={l.value}>{l.label}</option>
                ))}
              </select>
              <button onClick={() => remove(lang.id)} className="btn btn-ghost p-1.5 text-red-400"><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
