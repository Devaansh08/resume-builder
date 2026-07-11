import { useState } from 'react';
import { useResumeStore } from '../../store/resumeStore';
import type { Experience } from '../../types';
import { newExperience } from '../../utils/defaults';
import { Plus, Trash2, ChevronDown, ChevronUp, Briefcase, ArrowUp, ArrowDown } from 'lucide-react';
import { RichTextToolbar } from '../builder/RichTextToolbar';
import { SectionTitleEditor } from '../builder/SectionTitleEditor';

export function ExperienceForm() {
  const { currentResume, updateSection } = useResumeStore();
  const experiences = currentResume?.sections.experience || [];
  const [expanded, setExpanded] = useState<string | null>(experiences[0]?.id || null);

  const update = (updated: Experience[]) => updateSection('experience', updated);

  const add = () => {
    const exp = newExperience();
    update([exp, ...experiences]);
    setExpanded(exp.id);
  };

  const remove = (id: string) => {
    update(experiences.filter((e) => e.id !== id));
  };

  const updateExp = (id: string, field: keyof Experience, value: unknown) => {
    update(experiences.map((e) => {
      if (e.id !== id) return e;
      const updated = { ...e, [field]: value };
      if (field === 'current') {
        updated.endDate = value ? 'Present' : '';
      }
      return updated;
    }));
  };

  const updateBullet = (id: string, idx: number, value: string) => {
    const exp = experiences.find((e) => e.id === id);
    if (!exp) return;
    const bullets = [...exp.bullets];
    bullets[idx] = value;
    update(experiences.map((e) => e.id === id ? { ...e, bullets } : e));
  };

  const addBullet = (id: string) => {
    const exp = experiences.find((e) => e.id === id);
    if (!exp) return;
    update(experiences.map((e) => e.id === id ? { ...e, bullets: [...exp.bullets, ''] } : e));
  };

  const removeBullet = (id: string, idx: number) => {
    const exp = experiences.find((e) => e.id === id);
    if (!exp) return;
    const next = exp.bullets.filter((_, i) => i !== idx);
    update(experiences.map((e) => e.id === id ? { ...e, bullets: next.length ? next : [''] } : e));
  };

  const moveBullet = (id: string, idx: number, direction: 'up' | 'down') => {
    const exp = experiences.find((e) => e.id === id);
    if (!exp) return;
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= exp.bullets.length) return;
    const bullets = [...exp.bullets];
    const temp = bullets[idx];
    bullets[idx] = bullets[targetIdx];
    bullets[targetIdx] = temp;
    update(experiences.map((e) => e.id === id ? { ...e, bullets } : e));
  };

  const handleToolbarChange = (id: string, val: string) => {
    const lines = val.split('\n').map((l) => l.replace(/^[•\-–—*]\s*/, '')).filter(Boolean);
    updateExp(id, 'bullets', lines.length ? lines : ['']);
  };

  return (
    <div className="space-y-4">
      <SectionTitleEditor sectionKey="experience" defaultTitle="Work Experience" />

      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-500">{experiences.length} position{experiences.length !== 1 ? 's' : ''}</span>
        <button onClick={add} className="btn btn-primary btn-sm gap-1.5">
          <Plus size={14} /> Add Experience
        </button>
      </div>

      {experiences.length === 0 && (
        <div className="text-center py-10 border-2 border-dashed border-gray-200 dark:border-surface-700 rounded-2xl">
          <Briefcase size={32} className="text-gray-300 mx-auto mb-3" />
          <div className="text-sm font-medium text-gray-500 mb-1">No experience added</div>
          <div className="text-xs text-gray-400 mb-4">Add your work history to boost ATS score</div>
          <button onClick={add} className="btn btn-primary btn-sm">
            <Plus size={14} /> Add First Experience
          </button>
        </div>
      )}

      {experiences.map((exp) => (
        <div key={exp.id} className="card border border-gray-100 dark:border-surface-700">
          {/* Header */}
          <div
            className={`flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-surface-800 transition-colors ${expanded === exp.id ? 'rounded-t-[11px]' : 'rounded-[11px]'}`}
            onClick={() => setExpanded(expanded === exp.id ? null : exp.id)}
          >
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm text-gray-900 dark:text-white truncate">
                {exp.position || 'New Position'}
              </div>
              <div className="text-xs text-gray-500 truncate">{exp.company || 'Company'}</div>
            </div>
            <button onClick={(e) => { e.stopPropagation(); remove(exp.id); }} className="btn btn-ghost p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50">
              <Trash2 size={14} />
            </button>
            {expanded === exp.id ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
          </div>

          {/* Form */}
          {expanded === exp.id && (
            <div className="px-4 pb-4 border-t border-gray-100 dark:border-surface-800 pt-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 block">Job Title *</label>
                  <input className="input" value={exp.position} onChange={(e) => updateExp(exp.id, 'position', e.target.value)} placeholder="Software Engineer" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 block">Company *</label>
                  <input className="input" value={exp.company} onChange={(e) => updateExp(exp.id, 'company', e.target.value)} placeholder="Google" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 block">Location</label>
                  <input className="input" value={exp.location} onChange={(e) => updateExp(exp.id, 'location', e.target.value)} placeholder="San Francisco, CA" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 block">Start Date</label>
                  <input className="input" type="month" value={exp.startDate} onChange={(e) => updateExp(exp.id, 'startDate', e.target.value)} />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 block">End Date</label>
                  {exp.current ? (
                    <input className="input bg-gray-100 dark:bg-surface-800 text-gray-500 font-medium" type="text" value="Present" disabled />
                  ) : (
                    <input className="input" type="month" value={exp.endDate} onChange={(e) => updateExp(exp.id, 'endDate', e.target.value)} />
                  )}
                </div>
                <div className="flex items-center gap-2 pt-5">
                  <input type="checkbox" id={`current-${exp.id}`} checked={exp.current} onChange={(e) => updateExp(exp.id, 'current', e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-brand-500" />
                  <label htmlFor={`current-${exp.id}`} className="text-sm text-gray-600 dark:text-gray-400">Currently working here</label>
                </div>
              </div>

              {/* Bullet points area with toolbar */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-medium text-gray-600 dark:text-gray-400">Key Achievements / Responsibilities</label>
                  <button onClick={() => addBullet(exp.id)} className="text-xs text-brand-500 hover:text-brand-600 flex items-center gap-1 font-semibold">
                    <Plus size={12} /> Add bullet
                  </button>
                </div>

                <RichTextToolbar
                  value={exp.bullets.map((b) => `• ${b}`).join('\n')}
                  onChange={(val: string) => handleToolbarChange(exp.id, val)}
                />

                <div className="space-y-2 mt-2">
                  {exp.bullets.map((bullet, idx) => (
                    <div key={idx} className="flex items-start gap-1.5 group">
                      <span className="mt-3 text-brand-500 font-bold text-sm select-none">•</span>
                      <input
                        className="input flex-1 text-sm"
                        value={bullet}
                        onChange={(e) => updateBullet(exp.id, idx, e.target.value)}
                        placeholder="Increased sales by 30% by implementing high-concurrency architecture..."
                      />
                      <div className="flex items-center opacity-70 group-hover:opacity-100 transition-opacity">
                        {idx > 0 && (
                          <button type="button" onClick={() => moveBullet(exp.id, idx, 'up')} className="btn btn-ghost p-1 text-gray-400 hover:text-gray-600" title="Move up">
                            <ArrowUp size={14} />
                          </button>
                        )}
                        {idx < exp.bullets.length - 1 && (
                          <button type="button" onClick={() => moveBullet(exp.id, idx, 'down')} className="btn btn-ghost p-1 text-gray-400 hover:text-gray-600" title="Move down">
                            <ArrowDown size={14} />
                          </button>
                        )}
                        {exp.bullets.length > 1 && (
                          <button type="button" onClick={() => removeBullet(exp.id, idx)} className="btn btn-ghost p-1 text-red-400 hover:text-red-600" title="Delete bullet">
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-400 mt-2">💡 Tip: Use the Rich Toolbar above for quick action phrases ("Spearheaded...", "Engineered...").</p>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
