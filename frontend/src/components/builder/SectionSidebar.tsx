import { useState } from 'react';
import { useResumeStore } from '../../store/resumeStore';
import { sectionLabels, sectionIcons } from '../../utils/defaults';
import {
  User, Briefcase, GraduationCap, Code, Zap, Award, Trophy,
  Globe, Heart, Users, Plus, ChevronRight, Palette, Layers, Trash2,
  ChevronUp, ChevronDown, ChevronLeft, Menu
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
  isExpanded: boolean;
  onToggleExpand: () => void;
}

export function SectionSidebar({ activeSection, onSectionChange, isExpanded, onToggleExpand }: SectionSidebarProps) {
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
    <div className="flex flex-col h-full overflow-hidden min-w-0">
      {/* Header */}
      <div className="flex px-3 py-2.5 border-b border-gray-100 dark:border-surface-800 items-center justify-between shrink-0">
        {isExpanded ? (
          <p className="section-label text-[10px] uppercase font-bold tracking-wider text-gray-700 dark:text-gray-300">Resume Sections</p>
        ) : null}
        <button
          type="button"
          onClick={onToggleExpand}
          className={`btn btn-ghost p-1.5 hover:bg-surface-100 dark:hover:bg-surface-800 rounded-lg text-surface-500 hover:text-surface-900 dark:hover:text-white transition-colors ${
            !isExpanded ? 'mx-auto' : ''
          }`}
          title={isExpanded ? "Collapse Sidebar" : "Expand Sidebar"}
        >
          {isExpanded ? <ChevronLeft size={16} /> : <Menu size={16} />}
        </button>
      </div>

      {/* Sections list */}
      <div className="flex-1 overflow-y-auto py-2 px-1 min-h-0 no-scrollbar">
        <div className="flex flex-col items-center gap-1.5 w-full">
          {/* Theme Settings Button */}
          <div className="flex justify-center w-full px-1">
            <button
              onClick={() => onSectionChange('theme')}
              className={`flex items-center transition-all duration-150 group border ${
                isExpanded
                  ? 'w-full gap-2 px-3 py-2 md:py-2.5 rounded-xl text-left font-semibold'
                  : 'w-10 h-10 justify-center rounded-xl'
              } ${
                activeSection === 'theme'
                  ? 'bg-brand-500 text-white shadow-glow-sm border-brand-500 font-bold'
                  : 'border-brand-500/20 text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-950/20 font-semibold'
              }`}
              title={isExpanded ? "" : "Customize Theme"}
            >
              <span className="flex-shrink-0"><Palette size={16} /></span>
              {isExpanded && <span className="text-sm flex-1 truncate">Customize Theme</span>}
              {isExpanded && <ChevronRight size={14} className="flex-shrink-0" />}
            </button>
          </div>

          {sectionOrder.map((sectionId, index) => {
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
              <div key={sectionId} className="relative group/item flex items-center justify-center w-full px-1">
                <button
                  onClick={() => onSectionChange(sectionId)}
                  className={`flex items-center transition-all duration-200 group border ${
                    isExpanded
                      ? 'w-full justify-between gap-2 px-3 py-2 md:py-2.5 rounded-xl text-left'
                      : 'w-10 h-10 justify-center rounded-xl'
                  } ${
                    isActive
                      ? 'bg-brand-50 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400 font-semibold border-brand-200 dark:border-brand-900 shadow-xs'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-surface-800 hover:text-gray-900 dark:hover:text-white border-transparent'
                  }`}
                  title={isExpanded ? "" : label}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className={`flex-shrink-0 ${isActive ? 'text-brand-500' : ''}`}>
                      {icon}
                    </span>
                    {isExpanded && <span className="text-sm truncate">{label}</span>}
                  </div>
                  {isExpanded && (
                    <div className="flex items-center gap-1.5 shrink-0">
                      {count > 0 && (
                        <span className={`text-xs font-semibold px-1.5 py-0.5 rounded-full ${
                          isActive ? 'bg-brand-100 dark:bg-brand-900/60 text-brand-600 dark:text-brand-300' : 'bg-gray-100 dark:bg-surface-800 text-gray-500 dark:text-gray-400'
                        }`}>
                          {count}
                        </span>
                      )}
                      {isActive && (
                        <ChevronRight size={14} className="text-brand-500 flex-shrink-0" />
                      )}
                    </div>
                  )}
                </button>

                {isCustom && isExpanded && (
                  <button
                    type="button"
                    onClick={(e) => handleRemoveCustomSection(e, sectionId)}
                    className="absolute top-1/2 -translate-y-1/2 right-2 md:opacity-0 group-hover/item:opacity-100 p-1 text-gray-400 hover:text-red-500 transition-opacity bg-white dark:bg-surface-900 rounded-lg shadow-sm border border-gray-100 dark:border-surface-700 z-10"
                    title="Remove custom section"
                  >
                    <Trash2 size={13} />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Add custom section at bottom */}
      <div className={`border-t border-gray-100 dark:border-surface-800 shrink-0 ${isExpanded ? 'px-3 py-3' : 'px-1 py-3 flex justify-center'}`}>
        {isExpanded ? (
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-brand-50 dark:hover:bg-brand-950/40 hover:text-brand-600 dark:hover:text-brand-400 transition-all text-sm font-semibold border-2 border-dashed border-gray-200 dark:border-surface-700 hover:border-brand-400"
          >
            <Plus size={15} /> Add Custom Section
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="flex items-center justify-center w-10 h-10 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-brand-50 dark:hover:bg-brand-950/40 hover:text-brand-600 dark:hover:text-brand-400 transition-all border-2 border-dashed border-gray-200 dark:border-surface-700 hover:border-brand-400"
            title="Add Custom Section"
          >
            <Plus size={15} />
          </button>
        )}
      </div>

      <AddSectionModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSelectSection={onSectionChange}
      />
    </div>
  );
}
