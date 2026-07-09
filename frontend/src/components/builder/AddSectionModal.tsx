import React, { useState } from 'react';
import { useResumeStore } from '../../store/resumeStore';
import { newCustomSection } from '../../utils/defaults';
import { MOCKAROO_PROFILES, generateResumeFromMockaroo, type MockarooProfile } from '../../utils/mockarooData';
import { Plus, X, Sparkles, Heart, Users, Layers, Award, BookOpen, Share2, Globe, Database } from 'lucide-react';

interface AddSectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSection: (sectionId: string) => void;
}

const PRESET_CUSTOM_SECTIONS = [
  { title: 'Publications & Patents', icon: BookOpen, desc: 'Technical research papers, patents, and journal articles.' },
  { title: 'Volunteering & Community', icon: Heart, desc: 'Philanthropic leadership, mentorship, and non-profit work.' },
  { title: 'Speaking Engagements', icon: Share2, desc: 'Keynote talks, panel discussions, and conference workshops.' },
  { title: 'Professional Affiliations', icon: Award, desc: 'Memberships in IEEE, ACM, CFA Institute, or state bars.' },
  { title: 'Leadership & Extracurriculars', icon: Layers, desc: 'Student organizations, board advisories, and club roles.' },
  { title: 'Open Source Contributions', icon: Globe, desc: 'Notable GitHub libraries, framework PRs, and maintainer roles.' },
];

export function AddSectionModal({ isOpen, onClose, onSelectSection }: AddSectionModalProps) {
  const { currentResume, updateSection, setSectionOrder, setCurrentResume } = useResumeStore();
  const [customTitleInput, setCustomTitleInput] = useState('');
  const [activeTab, setActiveTab] = useState<'sections' | 'mockaroo'>('sections');

  if (!isOpen || !currentResume) return null;

  const sectionOrder = currentResume.sectionOrder || [];
  const customSections = currentResume.sections.customSections || [];

  const handleAddPresetSection = (sectionKey: 'interests' | 'references') => {
    if (!sectionOrder.includes(sectionKey)) {
      setSectionOrder([...sectionOrder, sectionKey]);
    }
    onSelectSection(sectionKey);
    onClose();
  };

  const handleCreateCustomSection = (title: string) => {
    const trimmed = title.trim() || 'Custom Section';
    const newSection = newCustomSection(trimmed);
    updateSection('customSections', [...customSections, newSection]);
    const customId = `custom_${newSection.id}`;
    if (!sectionOrder.includes(customId)) {
      setSectionOrder([...sectionOrder, customId]);
    }
    onSelectSection(customId);
    setCustomTitleInput('');
    onClose();
  };

  const handleLoadMockarooProfile = (profile: MockarooProfile) => {
    const generated = generateResumeFromMockaroo(profile);
    setCurrentResume(generated);
    onSelectSection('personalInfo');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-surface-900 border border-gray-100 dark:border-surface-800 rounded-2xl shadow-2xl max-w-xl w-full overflow-hidden animate-scale-up">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 dark:border-surface-800 flex items-center justify-between bg-gray-50/50 dark:bg-surface-800/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 flex items-center justify-center">
              <Plus size={18} />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-gray-900 dark:text-white">
                Add Section & Mock Data
              </h3>
              <p className="text-xs text-gray-500">
                Expand your resume structure or load realistic Mockaroo sample datasets
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-gray-100 dark:border-surface-800 px-6 pt-3 bg-white dark:bg-surface-900 gap-6 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('sections')}
            className={`pb-3 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'sections'
                ? 'border-brand-500 text-brand-600 dark:text-brand-400 font-bold'
                : 'border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
            }`}
          >
            <Layers size={14} /> Add Sections & Custom Headings
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('mockaroo')}
            className={`pb-3 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'mockaroo'
                ? 'border-brand-500 text-brand-600 dark:text-brand-400 font-bold'
                : 'border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
            }`}
          >
            <Database size={14} /> Mockaroo Realistic Sample Data
          </button>
        </div>

        {/* Body */}
        <div className="p-6 max-h-[65vh] overflow-y-auto">
          {activeTab === 'sections' ? (
            <div className="space-y-6">
              {/* Built-in Sections */}
              <div>
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-3">
                  Optional Built-in Sections
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => handleAddPresetSection('interests')}
                    className="p-3.5 rounded-xl border border-gray-200 dark:border-surface-700 hover:border-brand-400 dark:hover:border-brand-600 hover:bg-brand-50/30 dark:hover:bg-brand-950/20 text-left transition-all flex items-start gap-3 group"
                  >
                    <div className="w-9 h-9 rounded-lg bg-rose-50 dark:bg-rose-950/50 text-rose-500 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                      <Heart size={18} />
                    </div>
                    <div>
                      <span className="font-semibold text-sm text-gray-900 dark:text-white block">
                        Interests & Hobbies
                      </span>
                      <span className="text-xs text-gray-500 mt-0.5 block leading-tight">
                        Personal pursuits, extracurriculars, or athletic achievements.
                      </span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleAddPresetSection('references')}
                    className="p-3.5 rounded-xl border border-gray-200 dark:border-surface-700 hover:border-brand-400 dark:hover:border-brand-600 hover:bg-brand-50/30 dark:hover:bg-brand-950/20 text-left transition-all flex items-start gap-3 group"
                  >
                    <div className="w-9 h-9 rounded-lg bg-brand-50 dark:bg-brand-950/50 text-brand-500 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                      <Users size={18} />
                    </div>
                    <div>
                      <span className="font-semibold text-sm text-gray-900 dark:text-white block">
                        References
                      </span>
                      <span className="text-xs text-gray-500 mt-0.5 block leading-tight">
                        Direct supervisors, CTOs, or mentors who vouch for you.
                      </span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Preset Custom Sections */}
              <div>
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-3">
                  Preset Custom Sections (One-Click Add)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {PRESET_CUSTOM_SECTIONS.map((preset) => {
                    const Icon = preset.icon;
                    return (
                      <button
                        key={preset.title}
                        type="button"
                        onClick={() => handleCreateCustomSection(preset.title)}
                        className="p-3.5 rounded-xl border border-gray-200 dark:border-surface-700 hover:border-brand-400 dark:hover:border-brand-600 hover:bg-brand-50/30 dark:hover:bg-brand-950/20 text-left transition-all flex items-start gap-3 group"
                      >
                        <div className="w-9 h-9 rounded-lg bg-gray-100 dark:bg-surface-800 text-gray-600 dark:text-gray-300 flex items-center justify-center flex-shrink-0 group-hover:text-brand-500 transition-colors">
                          <Icon size={18} />
                        </div>
                        <div>
                          <span className="font-semibold text-sm text-gray-900 dark:text-white block">
                            {preset.title}
                          </span>
                          <span className="text-xs text-gray-500 mt-0.5 block leading-tight">
                            {preset.desc}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Create Custom Title */}
              <div className="pt-3 border-t border-gray-100 dark:border-surface-800">
                <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-2">
                  Create Your Own Custom Section Heading
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customTitleInput}
                    onChange={(e) => setCustomTitleInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleCreateCustomSection(customTitleInput);
                      }
                    }}
                    placeholder="e.g. Military Leadership, Clinical Rotations, Key Clients..."
                    className="input flex-1 text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => handleCreateCustomSection(customTitleInput)}
                    disabled={!customTitleInput.trim()}
                    className="btn btn-primary btn-md gap-1.5 flex-shrink-0"
                  >
                    <Plus size={16} /> Add Custom
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-brand-50/60 dark:bg-brand-950/30 border border-brand-200/60 dark:border-brand-800/50 flex items-start gap-3">
                <Sparkles size={18} className="text-brand-500 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-gray-700 dark:text-gray-300">
                  <span className="font-semibold text-gray-900 dark:text-white block mb-0.5">
                    Realistic Mockaroo Schema Datasets
                  </span>
                  Clicking any candidate below instantly populates the entire editor with complete, ATS-verified work histories, quantified impact bullets, patents, and top-tier credentials. Perfect for testing layouts or tailoring your own resume!
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 pt-1">
                {MOCKAROO_PROFILES.map((profile) => (
                  <div
                    key={profile.id}
                    onClick={() => handleLoadMockarooProfile(profile)}
                    className="p-4 rounded-xl border border-gray-200 dark:border-surface-700 hover:border-brand-500 dark:hover:border-brand-500 hover:bg-gray-50 dark:hover:bg-surface-800/80 cursor-pointer transition-all flex items-start justify-between gap-4 group"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-sm text-gray-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                          {profile.label}
                        </span>
                        <span className="badge badge-brand text-[10px] px-2 py-0.5">
                          {profile.badge}
                        </span>
                      </div>
                      <div className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">
                        {profile.role} • Template: <span className="capitalize text-brand-500 font-bold">{profile.template}</span>
                      </div>
                      <p className="text-xs text-gray-500 leading-relaxed">
                        {profile.description}
                      </p>
                    </div>
                    <button
                      type="button"
                      className="btn btn-outline btn-sm text-xs gap-1 flex-shrink-0 group-hover:bg-brand-500 group-hover:text-white group-hover:border-brand-500 transition-all"
                    >
                      Load Data
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 dark:bg-surface-800/80 border-t border-gray-100 dark:border-surface-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="btn btn-ghost btn-md text-gray-600 dark:text-gray-300"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
