import { useResumeStore } from '../../store/resumeStore';
import type { Education, Experience, Project, Skill, Resume } from '../../types';
import { getDensityConfig, FONT_OPTIONS } from '../../utils/defaults';

export function IndianAcademicTemplate({ resume: propResume }: { resume?: Resume }) {
  const storeResume = useResumeStore((state) => propResume ? null : state.currentResume);
  const currentResume = propResume || storeResume;
  if (!currentResume) return null;

  const { personalInfo, education, experience, projects, skills, languages, achievements } = currentResume.sections;
  const primaryColor = currentResume.theme.primaryColor || '#c41e3a';
  const accentColor = currentResume.theme.accentColor || '#1a1a3e';
  const density = getDensityConfig(currentResume.theme);
  const fontObj = FONT_OPTIONS.find((f) => f.id === currentResume.theme.fontFamily);
  const fontStyle = fontObj ? fontObj.family : currentResume.theme.fontFamily || 'Georgia, serif';

  return (
    <div className="w-full h-full bg-white text-surface-900 leading-relaxed relative" style={{ minHeight: '297mm', padding: density.pagePadding, fontSize: density.fontSize, lineHeight: density.lineHeight, fontFamily: fontStyle }}>
      {/* Notebook margin red line accent on left page edge */}
      <div className="absolute top-0 bottom-0 left-6 w-[1.5px] bg-[#c41e3a]/30 print:hidden" />

      <div className="ml-4 flex flex-col" style={{ gap: density.sectionGap }}>
        {/* Header Block */}
        <div className="text-center pb-4 border-b-2 border-double border-surface-300">
          <h1 className="text-3xl font-bold uppercase tracking-wide text-surface-900" style={{ color: primaryColor }}>
            {personalInfo.name || 'Your Name'}
          </h1>
          <p className="text-sm font-semibold tracking-wide text-surface-600 mt-1 uppercase">
            {personalInfo.title || 'Professional Title'}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 mt-3 text-xs text-surface-700">
            {personalInfo.email && <span>Email: {personalInfo.email}</span>}
            {personalInfo.phone && <span>Mobile: {personalInfo.phone}</span>}
            {personalInfo.address && <span>Address: {personalInfo.address}</span>}
            {personalInfo.linkedin && <span>LinkedIn: linkedin.com/in/{personalInfo.linkedin}</span>}
            {personalInfo.github && <span>GitHub: github.com/{personalInfo.github}</span>}
          </div>
        </div>

        {/* Profile Summary */}
        {personalInfo.summary && (
          <div className="space-y-1.5">
            <h2 className="text-sm font-bold uppercase tracking-wider border-b border-surface-300 pb-0.5" style={{ color: accentColor }}>
              Professional Summary
            </h2>
            <p className="text-xs text-surface-700 text-justify whitespace-pre-wrap">{personalInfo.summary}</p>
          </div>
        )}

        {/* Education (Indian Tabular Format) */}
        {education && education.length > 0 && (
          <div className="space-y-2">
            <h2 className="text-sm font-bold uppercase tracking-wider border-b border-surface-300 pb-0.5" style={{ color: accentColor }}>
              Academic Qualifications
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-[11px] text-left border-collapse border border-surface-300">
                <thead>
                  <tr className="bg-surface-50">
                    <th className="border border-surface-300 px-2 py-1 font-bold text-surface-800">Degree / Certificate</th>
                    <th className="border border-surface-300 px-2 py-1 font-bold text-surface-800">Institution / University</th>
                    <th className="border border-surface-300 px-2 py-1 font-bold text-surface-800">Year</th>
                    <th className="border border-surface-300 px-2 py-1 font-bold text-surface-800">CGPA / %</th>
                  </tr>
                </thead>
                <tbody>
                  {education.map((edu: Education) => (
                    <tr key={edu.id}>
                      <td className="border border-surface-300 px-2 py-1 font-semibold">{edu.degree} {edu.field ? `in ${edu.field}` : ''}</td>
                      <td className="border border-surface-300 px-2 py-1">{edu.institution}</td>
                      <td className="border border-surface-300 px-2 py-1">{edu.endDate ? edu.endDate.split('-')[0] : 'Present'}</td>
                      <td className="border border-surface-300 px-2 py-1 font-semibold">{edu.gpa || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Technical & Core Skills */}
        {skills && skills.length > 0 && (
          <div className="space-y-1.5">
            <h2 className="text-sm font-bold uppercase tracking-wider border-b border-surface-300 pb-0.5" style={{ color: accentColor }}>
              Technical Expertise
            </h2>
            <div className="grid grid-cols-1 gap-1 text-xs text-surface-700">
              {skills.map((skill: Skill) => (
                <div key={skill.id} className="flex items-start">
                  <span className="font-bold w-36 shrink-0 text-surface-800">{skill.category}:</span>
                  <span>{skill.items.join(', ')}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Experience */}
        {experience && experience.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-sm font-bold uppercase tracking-wider border-b border-surface-300 pb-0.5" style={{ color: accentColor }}>
              Professional Experience
            </h2>
            {experience.map((exp: Experience) => (
              <div key={exp.id} className="space-y-1 text-xs">
                <div className="flex justify-between items-baseline font-semibold text-surface-800">
                  <span className="text-sm font-bold">{exp.position}</span>
                  <span>{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</span>
                </div>
                <div className="flex justify-between text-[11px] italic text-surface-600 font-medium">
                  <span>{exp.company}</span>
                  <span>{exp.location}</span>
                </div>
                <p className="text-[11px] text-surface-700 text-justify">{exp.description}</p>
                {exp.bullets && exp.bullets.length > 0 && (
                  <ul className="list-disc list-inside pl-1 text-[11px] text-surface-700 space-y-0.5">
                    {exp.bullets.map((bullet, idx) => (
                      <li key={idx} className="text-justify">{bullet}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Key Projects */}
        {projects && projects.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-sm font-bold uppercase tracking-wider border-b border-surface-300 pb-0.5" style={{ color: accentColor }}>
              Academic & Personal Projects
            </h2>
            {projects.map((proj: Project) => (
              <div key={proj.id} className="space-y-1 text-xs">
                <div className="flex justify-between items-baseline font-semibold text-surface-800">
                  <span className="text-sm font-bold">{proj.name}</span>
                  <span>{proj.startDate} – {proj.endDate}</span>
                </div>
                {proj.technologies && proj.technologies.length > 0 && (
                  <div className="text-[10px] text-surface-500 font-semibold uppercase tracking-wider">
                    Tech Stack: {proj.technologies.join(', ')}
                  </div>
                )}
                <p className="text-[11px] text-surface-700 text-justify">{proj.description}</p>
                {proj.bullets && proj.bullets.length > 0 && (
                  <ul className="list-disc list-inside pl-1 text-[11px] text-surface-700 space-y-0.5">
                    {proj.bullets.map((bullet, idx) => (
                      <li key={idx} className="text-justify">{bullet}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Languages & Achievements Grid */}
        <div className="grid grid-cols-2 gap-6 pt-2">
          {languages && languages.length > 0 && (
            <div className="space-y-1">
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-surface-800">Languages Known</h3>
              <ul className="list-disc list-inside text-xs text-surface-700 space-y-0.5">
                {languages.map((lang) => (
                  <li key={lang.id}>{lang.name} ({lang.proficiency})</li>
                ))}
              </ul>
            </div>
          )}
          {achievements && achievements.length > 0 && (
            <div className="space-y-1">
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-surface-800">Achievements</h3>
              <ul className="list-disc list-inside text-xs text-surface-700 space-y-0.5">
                {achievements.map((ach) => (
                  <li key={ach.id}>{ach.title}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Declaration Section (Indian Traditional Format) */}
        <div className="pt-8 space-y-6 text-xs text-surface-700 border-t border-surface-200 mt-8">
          <div>
            <h3 className="font-bold uppercase tracking-wide mb-1 text-surface-800">Declaration:</h3>
            <p className="italic">
              I hereby declare that all the information details provided above are true and correct to the best of my knowledge and belief.
            </p>
          </div>
          <div className="flex justify-between pt-4">
            <div className="space-y-1">
              <div><strong>Date:</strong> {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
              <div><strong>Place:</strong> Bengaluru, India</div>
            </div>
            <div className="text-center border-t border-surface-400 w-40 pt-1">
              <strong>(Signature)</strong>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
