import { useResumeStore } from '../../store/resumeStore';
import { PersonalInfoForm } from '../sections/PersonalInfoForm';
import { ExperienceForm } from '../sections/ExperienceForm';
import { EducationForm } from '../sections/EducationForm';
import { ProjectsForm } from '../sections/ProjectsForm';
import { SkillsForm } from '../sections/SkillsForm';
import { CertificatesForm } from '../sections/CertificatesForm';
import { AchievementsForm } from '../sections/AchievementsForm';
import { LanguagesForm } from '../sections/LanguagesForm';
import { ThemeForm } from '../sections/ThemeForm';
import { sectionLabels } from '../../utils/defaults';

interface EditorPanelProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const SECTION_COMPONENTS: Record<string, React.ComponentType> = {
  theme: ThemeForm,
  personalInfo: PersonalInfoForm,
  experience: ExperienceForm,
  education: EducationForm,
  projects: ProjectsForm,
  skills: SkillsForm,
  certificates: CertificatesForm,
  achievements: AchievementsForm,
  languages: LanguagesForm,
};

export function EditorPanel({ activeSection }: EditorPanelProps) {
  const { currentResume } = useResumeStore();

  if (!currentResume) return null;

  const SectionComponent = SECTION_COMPONENTS[activeSection];
  const label = activeSection === 'theme' ? 'Theme & Styling' : (sectionLabels[activeSection] || activeSection);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Section header */}
      <div className="px-6 py-4 border-b border-gray-100 dark:border-surface-800 bg-white dark:bg-surface-900 flex-shrink-0">
        <h2 className="font-display font-semibold text-gray-900 dark:text-white">{label}</h2>
        <p className="text-xs text-gray-500 mt-0.5">
          Changes save automatically every 5 seconds
        </p>
      </div>

      {/* Form area */}
      <div className="flex-1 overflow-y-auto p-6">
        {SectionComponent ? (
          <SectionComponent />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="text-gray-400 text-sm">
              Section editor coming soon
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
