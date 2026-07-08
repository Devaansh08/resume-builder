import { useResumeStore } from '../../store/resumeStore';
import { sectionLabels, sectionIcons } from '../../utils/defaults';
import {
  User, Briefcase, GraduationCap, Code, Zap, Award, Trophy,
  Globe, Heart, Users, Plus, ChevronRight, Palette
} from 'lucide-react';

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
  const { currentResume } = useResumeStore();
  const sectionOrder = currentResume?.sectionOrder || DEFAULT_SECTION_ORDER;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-3 py-3 border-b border-gray-100 dark:border-surface-800">
        <p className="section-label text-[10px]">Resume Sections</p>
      </div>

      {/* Sections list */}
      <div className="flex-1 overflow-y-auto py-2 no-scrollbar">
        <div className="space-y-0.5 px-2">
          {/* Theme Settings Button */}
          <button
            onClick={() => onSectionChange('theme')}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left transition-all duration-150 group mb-2 border ${
              activeSection === 'theme'
                ? 'bg-brand-500 text-white shadow-glow-sm border-brand-500'
                : 'border-brand-500/20 text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-950/20'
            }`}
          >
            <span className="flex-shrink-0"><Palette size={16} /></span>
            <span className="text-sm font-semibold flex-1">Customize Theme</span>
            <ChevronRight size={14} className="flex-shrink-0" />
          </button>

          {sectionOrder.map((sectionId) => {
            const label = sectionLabels[sectionId] || sectionId;
            const iconName = sectionIcons[sectionId] || 'User';
            const icon = ICON_MAP[iconName] || <User size={16} />;
            const isActive = activeSection === sectionId;

            // Count items in section
            const sections = currentResume?.sections;
            let count = 0;
            if (sections) {
              const val = (sections as unknown as Record<string, unknown>)[sectionId];
              if (Array.isArray(val)) count = val.length;
              else if (sectionId === 'personalInfo') {
                const pi = sections.personalInfo;
                count = [pi.name, pi.email, pi.phone].filter(Boolean).length;
              }
            }

            return (
              <button
                key={sectionId}
                onClick={() => onSectionChange(sectionId)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left transition-all duration-150 group ${
                  isActive
                    ? 'bg-brand-50 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-surface-800 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <span className={`flex-shrink-0 ${isActive ? 'text-brand-500' : ''}`}>
                  {icon}
                </span>
                <span className="text-sm font-medium flex-1 truncate">{label}</span>
                {count > 0 && (
                  <span className={`text-xs font-semibold flex-shrink-0 ${
                    isActive ? 'text-brand-500' : 'text-gray-400'
                  }`}>
                    {count}
                  </span>
                )}
                {isActive && (
                  <ChevronRight size={14} className="text-brand-400 flex-shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Add custom section */}
      <div className="px-3 py-3 border-t border-gray-100 dark:border-surface-800">
        <button className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-gray-500 hover:bg-gray-50 dark:hover:bg-surface-800 hover:text-brand-500 transition-colors text-sm border-2 border-dashed border-gray-200 dark:border-surface-700 hover:border-brand-300">
          <Plus size={14} /> Add Section
        </button>
      </div>
    </div>
  );
}
