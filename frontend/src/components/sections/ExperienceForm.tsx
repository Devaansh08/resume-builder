import { useState } from 'react';
import { useResumeStore } from '../../store/resumeStore';
import type { Experience } from '../../types';
import { newExperience } from '../../utils/defaults';
import { Plus, Trash2, ChevronDown, ChevronUp, Briefcase } from 'lucide-react';
import { WYSIWYGEditor } from '../builder/WYSIWYGEditor';
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

  const handleToolbarChange = (id: string, val: string) => {
    const lines = val.split('\n').map((l) => l.replace(/^[•\-–—*]\s*/, ''));
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

              {/* Bullet points area with WYSIWYG editor */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-medium text-gray-600 dark:text-gray-400">Key Achievements / Responsibilities</label>
                </div>

                <WYSIWYGEditor
                  value={exp.bullets.map((b) => `• ${b}`).join('\n')}
                  onChange={(val: string) => handleToolbarChange(exp.id, val)}
                  placeholder="• Increased sales by 30% by implementing high-concurrency architecture...&#10;• Spearheaded cross-functional team... (Press Enter for new line)"
                  minHeight="130px"
                />
                <p className="text-xs text-gray-400 mt-2">💡 Tip: Highlight words and click Bold/Size/Color on the toolbar above to format directly right inside the box.</p>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
