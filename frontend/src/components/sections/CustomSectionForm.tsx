import React from 'react';
import { useResumeStore } from '../../store/resumeStore';
import { newCustomSectionItem } from '../../utils/defaults';
import type { CustomSection, CustomSectionItem } from '../../types';
import { Plus, Trash2, Layers, Calendar, Award } from 'lucide-react';

interface CustomSectionFormProps {
  sectionId: string; // 'custom_xxx' or just 'xxx'
}

export function CustomSectionForm({ sectionId }: CustomSectionFormProps) {
  const { currentResume, updateSection } = useResumeStore();

  if (!currentResume) return null;
  const rawId = sectionId.replace(/^custom_/, '');
  const customSections = currentResume.sections.customSections || [];
  const targetSection = customSections.find((s) => s.id === rawId);

  if (!targetSection) {
    return (
      <div className="p-8 text-center text-gray-500">
        Custom section not found or removed.
      </div>
    );
  }

  const handleUpdateTitle = (title: string) => {
    const updated = customSections.map((s) => (s.id === rawId ? { ...s, title } : s));
    updateSection('customSections', updated);
  };

  const handleAddItem = () => {
    const updatedSection: CustomSection = {
      ...targetSection,
      items: [...(targetSection.items || []), newCustomSectionItem()],
    };
    const updated = customSections.map((s) => (s.id === rawId ? updatedSection : s));
    updateSection('customSections', updated);
  };

  const handleRemoveItem = (itemId: string) => {
    const updatedSection: CustomSection = {
      ...targetSection,
      items: (targetSection.items || []).filter((i) => i.id !== itemId),
    };
    const updated = customSections.map((s) => (s.id === rawId ? updatedSection : s));
    updateSection('customSections', updated);
  };

  const handleUpdateItem = (itemId: string, field: keyof CustomSectionItem, value: string) => {
    const updatedItems = (targetSection.items || []).map((item) =>
      item.id === itemId ? { ...item, [field]: value } : item
    );
    const updatedSection: CustomSection = { ...targetSection, items: updatedItems };
    const updated = customSections.map((s) => (s.id === rawId ? updatedSection : s));
    updateSection('customSections', updated);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 dark:border-surface-800 pb-4">
        <div className="flex-1 mr-4">
          <label className="label text-xs">Section Heading Title *</label>
          <input
            type="text"
            value={targetSection.title}
            onChange={(e) => handleUpdateTitle(e.target.value)}
            placeholder="e.g. Publications, Patents, Volunteering, Leadership..."
            className="input font-display font-bold text-lg text-gray-900 dark:text-white max-w-md"
          />
        </div>
        <button
          type="button"
          onClick={handleAddItem}
          className="btn btn-primary btn-sm gap-1.5 self-end mb-0.5"
        >
          <Plus size={15} /> Add Item
        </button>
      </div>

      {/* Items List */}
      {(!targetSection.items || targetSection.items.length === 0) ? (
        <div className="p-8 rounded-2xl border-2 border-dashed border-gray-200 dark:border-surface-800 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-brand-50 dark:bg-brand-950/50 flex items-center justify-center text-brand-500 mx-auto">
            <Layers size={22} />
          </div>
          <div className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            No entries inside &quot;{targetSection.title}&quot; yet
          </div>
          <p className="text-xs text-gray-500 max-w-xs mx-auto">
            Click &quot;Add Item&quot; to list individual publications, patents, leadership experiences, or awards.
          </p>
          <button
            type="button"
            onClick={handleAddItem}
            className="btn btn-outline btn-sm gap-1.5 mx-auto"
          >
            <Plus size={14} /> Add Entry
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {targetSection.items.map((item, idx) => (
            <div
              key={item.id}
              className="p-5 rounded-2xl bg-gray-50/70 dark:bg-surface-800/60 border border-gray-200/80 dark:border-surface-700/80 space-y-4 animate-scale-in relative group"
            >
              <div className="flex items-center justify-between">
                <span className="badge bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 text-xs">
                  Entry #{idx + 1}
                </span>
                <button
                  type="button"
                  onClick={() => handleRemoveItem(item.id)}
                  className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40"
                  title="Remove entry"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="label text-xs flex items-center gap-1">
                    <Award size={12} className="text-gray-400" /> Title / Name *
                  </label>
                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) => handleUpdateItem(item.id, 'title', e.target.value)}
                    placeholder="e.g. Distributed Vector Pruning in High-Dimensional Embedding Spaces"
                    className="input text-sm font-medium"
                  />
                </div>
                <div>
                  <label className="label text-xs flex items-center gap-1">
                    <Calendar size={12} className="text-gray-400" /> Date / Year
                  </label>
                  <input
                    type="text"
                    value={item.date}
                    onChange={(e) => handleUpdateItem(item.id, 'date', e.target.value)}
                    placeholder="e.g. Issued Apr 2023"
                    className="input text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="label text-xs">Subtitle / Issuer / Publisher</label>
                <input
                  type="text"
                  value={item.subtitle}
                  onChange={(e) => handleUpdateItem(item.id, 'subtitle', e.target.value)}
                  placeholder="e.g. United States Patent & Trademark Office (USPTO) or ACM Conference"
                  className="input text-sm"
                />
              </div>

              <div>
                <label className="label text-xs">Detailed Description / Highlights</label>
                <textarea
                  value={item.description}
                  onChange={(e) => handleUpdateItem(item.id, 'description', e.target.value)}
                  rows={3}
                  placeholder="Summarize the core impact, patent claims, research findings, or leadership accomplishments..."
                  className="input text-sm py-2 resize-y"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
