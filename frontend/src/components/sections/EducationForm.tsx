import { useState } from 'react';
import { useResumeStore } from '../../store/resumeStore';
import type { Education } from '../../types';
import { newEducation } from '../../utils/defaults';
import { Plus, Trash2, ChevronDown, ChevronUp, GraduationCap } from 'lucide-react';
import { RichTextToolbar } from '../builder/RichTextToolbar';
import { SectionTitleEditor } from '../builder/SectionTitleEditor';

export function EducationForm() {
  const { currentResume, updateSection } = useResumeStore();
  const educations = currentResume?.sections.education || [];
  const [expanded, setExpanded] = useState<string | null>(educations[0]?.id || null);

  const update = (updated: Education[]) => updateSection('education', updated);

  const add = () => {
    const edu = newEducation();
    update([edu, ...educations]);
    setExpanded(edu.id);
  };

  const remove = (id: string) => update(educations.filter((e) => e.id !== id));

  const updateEdu = (id: string, field: keyof Education, value: unknown) => {
    update(educations.map((e) => {
      if (e.id !== id) return e;
      const updated = { ...e, [field]: value };
      if (field === 'current') {
        updated.endDate = value ? 'Present' : '';
      }
      return updated;
    }));
  };

  return (
    <div className="space-y-4">
      <SectionTitleEditor sectionKey="education" defaultTitle="Education" />

      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-500">{educations.length} entr{educations.length !== 1 ? 'ies' : 'y'}</span>
        <button onClick={add} className="btn btn-primary btn-sm gap-1.5"><Plus size={14} /> Add Education</button>
      </div>

      {educations.length === 0 && (
        <div className="text-center py-10 border-2 border-dashed border-gray-200 dark:border-surface-700 rounded-2xl">
          <GraduationCap size={32} className="text-gray-300 mx-auto mb-3" />
          <div className="text-sm font-medium text-gray-500 mb-4">Add your education history</div>
          <button onClick={add} className="btn btn-primary btn-sm"><Plus size={14} /> Add Education</button>
        </div>
      )}

      {educations.map((edu) => (
        <div key={edu.id} className="card border border-gray-100 dark:border-surface-700">
          <div
            className={`flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-surface-800 transition-colors ${expanded === edu.id ? 'rounded-t-[11px]' : 'rounded-[11px]'}`}
            onClick={() => setExpanded(expanded === edu.id ? null : edu.id)}>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm text-gray-900 dark:text-white truncate">{edu.degree || 'Degree'} {edu.field ? `in ${edu.field}` : ''}</div>
              <div className="text-xs text-gray-500 truncate">{edu.institution || 'Institution'}</div>
            </div>
            <button onClick={(e) => { e.stopPropagation(); remove(edu.id); }} className="btn btn-ghost p-1.5 text-red-400 hover:text-red-600">
              <Trash2 size={14} />
            </button>
            {expanded === edu.id ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
          </div>

          {expanded === edu.id && (
            <div className="px-4 pb-4 border-t border-gray-100 dark:border-surface-800 pt-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 block">Institution *</label>
                  <input className="input" value={edu.institution} onChange={(e) => updateEdu(edu.id, 'institution', e.target.value)} placeholder="MIT" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 block">Degree *</label>
                  <input className="input" value={edu.degree} onChange={(e) => updateEdu(edu.id, 'degree', e.target.value)} placeholder="Bachelor of Science" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 block">Field of Study</label>
                  <input className="input" value={edu.field} onChange={(e) => updateEdu(edu.id, 'field', e.target.value)} placeholder="Computer Science" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 block">GPA (optional)</label>
                  <input className="input" value={edu.gpa} onChange={(e) => updateEdu(edu.id, 'gpa', e.target.value)} placeholder="3.9/4.0" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 block">Start Date</label>
                  <input className="input" type="month" value={edu.startDate} onChange={(e) => updateEdu(edu.id, 'startDate', e.target.value)} />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 block">End Date</label>
                  {edu.current ? (
                    <input className="input bg-gray-100 dark:bg-surface-800 text-gray-500 font-medium" type="text" value="Present" disabled />
                  ) : (
                    <input className="input" type="month" value={edu.endDate} onChange={(e) => updateEdu(edu.id, 'endDate', e.target.value)} />
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id={`edu-current-${edu.id}`} checked={edu.current} onChange={(e) => updateEdu(edu.id, 'current', e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-brand-500" />
                <label htmlFor={`edu-current-${edu.id}`} className="text-sm text-gray-600 dark:text-gray-400">Currently studying</label>
              </div>

              {/* Coursework & Honors description */}
              <div>
                <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5 block">Additional Details (Coursework, Honors, Thesis)</label>
                <RichTextToolbar
                  value={edu.description || ''}
                  onChange={(val: string) => updateEdu(edu.id, 'description', val)}
                />
                <textarea
                  className="input resize-none rounded-t-none border-t-0 focus:ring-0 text-sm"
                  rows={3}
                  value={edu.description || ''}
                  onChange={(e) => updateEdu(edu.id, 'description', e.target.value)}
                  placeholder="Dean's List, Relevant Coursework: Algorithms, Operating Systems, Machine Learning..."
                />
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
