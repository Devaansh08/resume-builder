import React from 'react';
import { useResumeStore } from '../../store/resumeStore';
import { newReference } from '../../utils/defaults';
import type { Reference } from '../../types';
import { Plus, Trash2, Users, Mail, Phone, Building2 } from 'lucide-react';

export function ReferencesForm() {
  const { currentResume, updateSection } = useResumeStore();

  if (!currentResume) return null;
  const references = currentResume.sections.references || [];

  const handleAddReference = () => {
    updateSection('references', [...references, newReference()]);
  };

  const handleRemoveReference = (id: string) => {
    updateSection('references', references.filter((r) => r.id !== id));
  };

  const handleUpdateReference = (id: string, field: keyof Reference, value: string) => {
    const updated = references.map((r) => (r.id === id ? { ...r, [field]: value } : r));
    updateSection('references', updated);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 dark:border-surface-800 pb-4">
        <div>
          <h3 className="font-display font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
            <Users size={18} className="text-brand-500" />
            Professional References
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            Include direct supervisors, VP/CTO mentors, or academic advisors willing to vouch for your technical leadership.
          </p>
        </div>
        <button
          type="button"
          onClick={handleAddReference}
          className="btn btn-primary btn-sm gap-1.5"
        >
          <Plus size={15} /> Add Reference
        </button>
      </div>

      {/* Reference List */}
      {references.length === 0 ? (
        <div className="p-8 rounded-2xl border-2 border-dashed border-gray-200 dark:border-surface-800 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-surface-800 flex items-center justify-center text-gray-400 mx-auto">
            <Users size={22} />
          </div>
          <div className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            No professional references added
          </div>
          <p className="text-xs text-gray-500 max-w-xs mx-auto">
            Click &quot;Add Reference&quot; above to list direct colleagues or managers who can confirm your credentials.
          </p>
          <button
            type="button"
            onClick={handleAddReference}
            className="btn btn-outline btn-sm gap-1.5 mx-auto"
          >
            <Plus size={14} /> Create First Reference
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {references.map((refItem, idx) => (
            <div
              key={refItem.id}
              className="p-5 rounded-2xl bg-gray-50/70 dark:bg-surface-800/60 border border-gray-200/80 dark:border-surface-700/80 space-y-4 animate-scale-in relative group"
            >
              <div className="flex items-center justify-between">
                <span className="badge badge-brand text-xs">
                  Reference #{idx + 1}
                </span>
                <button
                  type="button"
                  onClick={() => handleRemoveReference(refItem.id)}
                  className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40"
                  title="Remove reference"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label text-xs">Full Name *</label>
                  <input
                    type="text"
                    value={refItem.name}
                    onChange={(e) => handleUpdateReference(refItem.id, 'name', e.target.value)}
                    placeholder="e.g. Dr. Evelyn R. Vance"
                    className="input text-sm"
                  />
                </div>
                <div>
                  <label className="label text-xs">Job Title / Designation *</label>
                  <input
                    type="text"
                    value={refItem.title}
                    onChange={(e) => handleUpdateReference(refItem.id, 'title', e.target.value)}
                    placeholder="e.g. Chief Technology Officer (CTO)"
                    className="input text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="label text-xs flex items-center gap-1">
                    <Building2 size={12} className="text-gray-400" /> Company / Institution
                  </label>
                  <input
                    type="text"
                    value={refItem.company}
                    onChange={(e) => handleUpdateReference(refItem.id, 'company', e.target.value)}
                    placeholder="e.g. Vertex Neural Systems"
                    className="input text-sm"
                  />
                </div>
                <div>
                  <label className="label text-xs flex items-center gap-1">
                    <Mail size={12} className="text-gray-400" /> Email Address
                  </label>
                  <input
                    type="email"
                    value={refItem.email}
                    onChange={(e) => handleUpdateReference(refItem.id, 'email', e.target.value)}
                    placeholder="e.g. evance@vertexneural.io"
                    className="input text-sm"
                  />
                </div>
                <div>
                  <label className="label text-xs flex items-center gap-1">
                    <Phone size={12} className="text-gray-400" /> Phone Number
                  </label>
                  <input
                    type="text"
                    value={refItem.phone}
                    onChange={(e) => handleUpdateReference(refItem.id, 'phone', e.target.value)}
                    placeholder="e.g. +1 (415) 555-0199"
                    className="input text-sm"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
