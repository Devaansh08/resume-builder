import { useState } from 'react';
import { useResumeStore } from '../../store/resumeStore';
import type { Project } from '../../types';
import { newProject } from '../../utils/defaults';
import { Plus, Trash2, ChevronDown, ChevronUp, Code, X, ArrowUp, ArrowDown } from 'lucide-react';
import { RichTextToolbar } from '../builder/RichTextToolbar';

export function ProjectsForm() {
  const { currentResume, updateSection } = useResumeStore();
  const projects = currentResume?.sections.projects || [];
  const [expanded, setExpanded] = useState<string | null>(projects[0]?.id || null);
  const [techInput, setTechInput] = useState<Record<string, string>>({});

  const update = (updated: Project[]) => updateSection('projects', updated);
  const add = () => { const p = newProject(); update([p, ...projects]); setExpanded(p.id); };
  const remove = (id: string) => update(projects.filter((p) => p.id !== id));
  const updateProj = (id: string, field: keyof Project, value: unknown) => {
    update(projects.map((p) => p.id === id ? { ...p, [field]: value } : p));
  };
  const addTech = (id: string) => {
    const tech = techInput[id]?.trim();
    if (!tech) return;
    const proj = projects.find((p) => p.id === id);
    if (!proj) return;
    updateProj(id, 'technologies', [...proj.technologies, tech]);
    setTechInput((prev) => ({ ...prev, [id]: '' }));
  };
  const removeTech = (id: string, tech: string) => {
    const proj = projects.find((p) => p.id === id);
    if (!proj) return;
    updateProj(id, 'technologies', proj.technologies.filter((t) => t !== tech));
  };
  const updateBullet = (id: string, idx: number, value: string) => {
    const proj = projects.find((p) => p.id === id);
    if (!proj) return;
    const bullets = [...proj.bullets];
    bullets[idx] = value;
    updateProj(id, 'bullets', bullets);
  };

  const moveBullet = (id: string, idx: number, direction: 'up' | 'down') => {
    const proj = projects.find((p) => p.id === id);
    if (!proj) return;
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= proj.bullets.length) return;
    const bullets = [...proj.bullets];
    const temp = bullets[idx];
    bullets[idx] = bullets[targetIdx];
    bullets[targetIdx] = temp;
    updateProj(id, 'bullets', bullets);
  };

  const handleToolbarChange = (id: string, val: string) => {
    const lines = val.split('\n').map((l) => l.replace(/^[•\-–—*]\s*/, '')).filter(Boolean);
    updateProj(id, 'bullets', lines.length ? lines : ['']);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-500">{projects.length} project{projects.length !== 1 ? 's' : ''}</span>
        <button onClick={add} className="btn btn-primary btn-sm gap-1.5"><Plus size={14} /> Add Project</button>
      </div>

      {projects.length === 0 && (
        <div className="text-center py-10 border-2 border-dashed border-gray-200 dark:border-surface-700 rounded-2xl">
          <Code size={32} className="text-gray-300 mx-auto mb-3" />
          <div className="text-sm text-gray-500 mb-4">Showcase your best projects</div>
          <button onClick={add} className="btn btn-primary btn-sm"><Plus size={14} /> Add Project</button>
        </div>
      )}

      {projects.map((proj) => (
        <div key={proj.id} className="card border border-gray-100 dark:border-surface-700 overflow-hidden">
          <div className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-surface-800 transition-colors"
            onClick={() => setExpanded(expanded === proj.id ? null : proj.id)}>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm text-gray-900 dark:text-white truncate">{proj.name || 'New Project'}</div>
              <div className="text-xs text-gray-500 truncate">{proj.technologies.slice(0, 3).join(' · ')}</div>
            </div>
            <button onClick={(e) => { e.stopPropagation(); remove(proj.id); }} className="btn btn-ghost p-1.5 text-red-400">
              <Trash2 size={14} />
            </button>
            {expanded === proj.id ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
          </div>

          {expanded === proj.id && (
            <div className="px-4 pb-4 border-t border-gray-100 dark:border-surface-800 pt-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 block">Project Name *</label>
                  <input className="input" value={proj.name} onChange={(e) => updateProj(proj.id, 'name', e.target.value)} placeholder="ResumeAI" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 block">GitHub URL</label>
                  <input className="input" value={proj.githubUrl} onChange={(e) => updateProj(proj.id, 'githubUrl', e.target.value)} placeholder="github.com/user/repo" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 block">Live URL</label>
                  <input className="input" value={proj.liveUrl} onChange={(e) => updateProj(proj.id, 'liveUrl', e.target.value)} placeholder="app.example.com" />
                </div>
              </div>

              {/* Technologies */}
              <div>
                <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2 block">Technologies Used</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {proj.technologies.map((tech) => (
                    <span key={tech} className="badge bg-brand-50 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400 pr-1.5">
                      {tech}
                      <button onClick={() => removeTech(proj.id, tech)} className="ml-1 hover:text-red-500">
                        <X size={10} />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    className="input text-sm"
                    value={techInput[proj.id] || ''}
                    onChange={(e) => setTechInput((prev) => ({ ...prev, [proj.id]: e.target.value }))}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addTech(proj.id);
                      }
                    }}
                    placeholder="React, Node.js, Python... (press Enter)"
                  />
                  <button onClick={() => addTech(proj.id)} className="btn btn-secondary btn-sm px-3">Add</button>
                </div>
              </div>

              {/* Bullets with Toolbar */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-medium text-gray-600 dark:text-gray-400">Description / Key Features</label>
                  <button onClick={() => updateProj(proj.id, 'bullets', [...proj.bullets, ''])} className="text-xs text-brand-500 hover:text-brand-600 flex items-center gap-1 font-semibold">
                    <Plus size={12} /> Add bullet
                  </button>
                </div>

                <RichTextToolbar
                  value={proj.bullets.map((b) => `• ${b}`).join('\n')}
                  onChange={(val: string) => handleToolbarChange(proj.id, val)}
                />

                <div className="space-y-2 mt-2">
                  {proj.bullets.map((bullet, idx) => (
                    <div key={idx} className="flex items-start gap-1.5 group">
                      <span className="mt-3 text-brand-500 font-bold text-sm select-none">•</span>
                      <input
                        className="input flex-1 text-sm"
                        value={bullet}
                        onChange={(e) => updateBullet(proj.id, idx, e.target.value)}
                        placeholder="Built real-time collaboration using WebSockets..."
                      />
                      <div className="flex items-center opacity-70 group-hover:opacity-100 transition-opacity">
                        {idx > 0 && (
                          <button type="button" onClick={() => moveBullet(proj.id, idx, 'up')} className="btn btn-ghost p-1 text-gray-400 hover:text-gray-600" title="Move up">
                            <ArrowUp size={14} />
                          </button>
                        )}
                        {idx < proj.bullets.length - 1 && (
                          <button type="button" onClick={() => moveBullet(proj.id, idx, 'down')} className="btn btn-ghost p-1 text-gray-400 hover:text-gray-600" title="Move down">
                            <ArrowDown size={14} />
                          </button>
                        )}
                        {proj.bullets.length > 1 && (
                          <button type="button" onClick={() => updateProj(proj.id, 'bullets', proj.bullets.filter((_, i) => i !== idx))} className="btn btn-ghost p-1 text-red-400 hover:text-red-600" title="Delete bullet">
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
