import { useState } from 'react';
import { useResumeStore } from '../../store/resumeStore';
import { sectionLabels, sectionIcons } from '../../utils/defaults';
import {
  User, Briefcase, GraduationCap, Code, Zap, Award, Trophy,
  Globe, Heart, Users, Plus, ChevronRight, Palette, Layers, Trash2,
  ChevronUp, ChevronDown
} from 'lucide-react';
import { AddSectionModal } from './AddSectionModal';

const ICON_MAP: Record<string, React.ReactNode> = {
  User: <User size={16} />,
  Briefcase: <Briefcase size={16} />,
  GraduationCap: <GraduationCap size={16} />,
  Code: <Code size={16} />,
  Zap: <Zap size={16} />,
  Award: <Award size={16} />,
  Trophy: <Trophy size={16} />,
  Globe: <Globe size={16} />,
  Heart: <Heart size={16} />,
  Users: <Users size={16} />,
};

const DEFAULT_SECTION_ORDER = [
  'personalInfo', 'experience', 'education', 'projects',
  'skills', 'certificates', 'achievements', 'languages',
  'interests', 'references',
];

interface SectionSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export function SectionSidebar({ activeSection, onSectionChange }: SectionSidebarProps) {
  const { currentResume, setSectionOrder } = useResumeStore();
  const [showAddModal, setShowAddModal] = useState(false);
  const sectionOrder = currentResume?.sectionOrder || DEFAULT_SECTION_ORDER;

  const handleRemoveCustomSection = (e: React.MouseEvent, sectionId: string) => {
    e.stopPropagation();
    if (!currentResume) return;
    const newOrder = sectionOrder.filter((id) => id !== sectionId);
    setSectionOrder(newOrder);
    if (activeSection === sectionId) {
      onSectionChange('personalInfo');
    }
  };

  const moveSection = (e: React.MouseEvent, index: number, direction: 'up' | 'down') => {
    e.stopPropagation();
    if (!currentResume) return;
    const newOrder = [...sectionOrder];
    if (direction === 'up' && index > 0) {
      [newOrder[index - 1], newOrder[index]] = [newOrder[index], newOrder[index - 1]];
    } else if (direction === 'down' && index < newOrder.length - 1) {
      [newOrder[index + 1], newOrder[index]] = [newOrder[index], newOrder[index + 1]];
    }
    setSectionOrder(newOrder);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-3 py-3 border-b border-gray-100 dark:border-surface-800 flex items-center justify-between">
        <p className="section-label text-[10px]">Resume Sections</p>
        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="text-[11px] text-brand-500 hover:text-brand-600 font-semibold flex items-center gap-1"
        >
          <Plus size={12} /> Add
        </button>
      </div>

      {/* Sections list */}
      <div className="flex-1 overflow-auto py-2 no-scrollbar">
        <div className="flex flex-row md:flex-col gap-2 md:gap-0.5 px-3 md:px-2 w-max md:w-auto">
          {/* Theme Settings Button */}
          <button
            onClick={() => onSectionChange('theme')}
            className={`flex-shrink-0 flex items-center gap-2 px-3 py-2 md:py-2.5 rounded-xl text-left transition-all duration-150 group md:mb-2 border ${
              activeSection === 'theme'
                ? 'bg-brand-500 text-white shadow-glow-sm border-brand-500'
                : 'border-brand-500/20 text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-950/20'
            }`}
          >
            <span className="flex-shrink-0"><Palette size={16} /></span>
            <span className="text-sm font-semibold hidden md:inline flex-1">Customize Theme</span>
            <span className="text-sm font-semibold md:hidden">Theme</span>
            <ChevronRight size={14} className="hidden md:block flex-shrink-0" />
          </button>

          {sectionOrder.map((sectionId) => {
            const isCustom = sectionId.startsWith('custom_');
            const rawId = isCustom ? sectionId.replace(/^custom_/, '') : sectionId;
            const customObj = isCustom
              ? currentResume?.sections.customSections?.find((s) => s.id === rawId)
              : null;

            const label = isCustom
              ? (customObj?.title || 'Custom Section')
              : (sectionLabels[sectionId] || sectionId);

            const iconName = isCustom ? 'Layers' : (sectionIcons[sectionId] || 'User');
            const icon = isCustom ? <Layers size={16} /> : (ICON_MAP[iconName] || <User size={16} />);
            const isActive = activeSection === sectionId;

            // Count items in section
            const sections = currentResume?.sections;
            let count = 0;
            if (sections) {
              if (isCustom) {
                count = customObj?.items?.length || 0;
              } else {
                const val = (sections as unknown as Record<string, unknown>)[sectionId];
                if (Array.isArray(val)) count = val.length;
                else if (sectionId === 'personalInfo') {
                  const pi = sections.personalInfo;
                  count = [pi.name, pi.email, pi.phone].filter(Boolean).length;
                }
              }
            }

            return (
              <div key={sectionId} className="relative group/item flex items-center flex-shrink-0">
                <button
                  onClick={() => onSectionChange(sectionId)}
                  className={`flex items-center gap-2 px-3 py-2 md:py-2.5 rounded-xl text-left transition-all duration-150 group border md:border-transparent ${
                    isActive
                      ? 'bg-brand-50 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400 font-semibold border-brand-200 dark:border-brand-900'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-surface-800 hover:text-gray-900 dark:hover:text-white border-gray-200 dark:border-surface-800'
                  }`}
                >
                  <span className={`flex-shrink-0 ${isActive ? 'text-brand-500' : ''}`}>
                    {icon}
                  </span>
                  <span className="text-sm truncate">{label}</span>
                  {count > 0 && (
                    <span className={`text-xs font-semibold flex-shrink-0 ${
                      isActive ? 'text-brand-500' : 'text-gray-400'
                    }`}>
                      {count}
                    </span>
                  )}
                  {isActive && (
                    <ChevronRight size={14} className="hidden md:block text-brand-400 flex-shrink-0" />
                  )}
                </button>

                {isCustom && (
                  <button
                    type="button"
                    onClick={(e) => handleRemoveCustomSection(e, sectionId)}
                    className="absolute -top-1 -right-1 md:top-auto md:right-2 md:opacity-0 group-hover/item:opacity-100 p-1 text-gray-400 hover:text-red-500 transition-opacity bg-white dark:bg-surface-900 rounded-lg shadow-sm border border-gray-100 dark:border-surface-700"
                    title="Remove custom section from sidebar"
                  >
                    <Trash2 size={13} />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Add custom section */}
      <div className="px-3 py-3 border-t border-gray-100 dark:border-surface-800">
        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-brand-50 dark:hover:bg-brand-950/40 hover:text-brand-600 dark:hover:text-brand-400 transition-all text-sm font-semibold border-2 border-dashed border-gray-200 dark:border-surface-700 hover:border-brand-400"
        >
          <Plus size={16} className="text-brand-500" /> Add Section
        </button>
      </div>

      <AddSectionModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSelectSection={onSectionChange}
      />
    </div>
  );
}
