import { useResumeStore } from '../../store/resumeStore';
import type { Education, Experience, Project, Skill, Resume } from '../../types';
import { getDensityConfig, FONT_OPTIONS } from '../../utils/defaults';

export function IndianCorporateTemplate({ resume: propResume }: { resume?: Resume }) {
  const storeResume = useResumeStore((state) => propResume ? null : state.currentResume);
  const currentResume = propResume || storeResume;
  if (!currentResume) return null;

  const { personalInfo, education, experience, projects, skills, languages, certificates } = currentResume.sections;
  const primaryColor = currentResume.theme.primaryColor || '#c41e3a';
  const accentColor = currentResume.theme.accentColor || '#1a1a3e';
  const density = getDensityConfig(currentResume.theme);
  const fontObj = FONT_OPTIONS.find((f) => f.id === currentResume.theme.fontFamily);
  const fontStyle = fontObj ? fontObj.family : currentResume.theme.fontFamily || 'Inter, sans-serif';

  return (
    <div className="w-full h-full bg-white text-surface-900 flex leading-relaxed" style={{ minHeight: '297mm', fontSize: density.fontSize, lineHeight: density.lineHeight, fontFamily: fontStyle }}>
      
      {/* Left Column Sidebar */}
      <div className="w-[33%] bg-surface-50 border-r border-surface-200 flex flex-col" style={{ padding: density.pagePadding, gap: density.sectionGap }}>
        
        {/* Photo Placeholder */}
        <div className="flex flex-col items-center justify-center gap-2">
          {personalInfo.photo ? (
            <div className="w-28 h-28 rounded-full overflow-hidden border-2 border-surface-300 shadow-sm">
              <img src={personalInfo.photo} alt={personalInfo.name} className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="w-24 h-24 rounded-full bg-surface-200 border-2 border-dashed border-surface-300 flex flex-col items-center justify-center text-center p-2 text-surface-400">
              <span className="text-[10px] font-bold uppercase tracking-wider">Photo</span>
              <span className="text-[8px]">Placeholder</span>
            </div>
          )}
        </div>

        {/* Contact Info */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider border-b border-surface-300 pb-1" style={{ color: accentColor }}>
            Contact Details
          </h3>
          <div className="space-y-2 text-[11px] text-surface-700">
            {personalInfo.phone && (
              <div>
                <div className="font-semibold text-surface-500 text-[9px] uppercase">Mobile</div>
                <div>{personalInfo.phone}</div>
              </div>
            )}
            {personalInfo.email && (
              <div>
                <div className="font-semibold text-surface-500 text-[9px] uppercase">Email Address</div>
                <div className="break-all">{personalInfo.email}</div>
              </div>
            )}
            {personalInfo.address && (
              <div>
                <div className="font-semibold text-surface-500 text-[9px] uppercase">Address</div>
                <div>{personalInfo.address}</div>
              </div>
            )}
            {personalInfo.linkedin && (
              <div>
                <div className="font-semibold text-surface-500 text-[9px] uppercase">LinkedIn</div>
                <div className="break-all">linkedin.com/in/{personalInfo.linkedin}</div>
              </div>
            )}
            {personalInfo.github && (
              <div>
                <div className="font-semibold text-surface-500 text-[9px] uppercase">GitHub</div>
                <div className="break-all">github.com/{personalInfo.github}</div>
              </div>
            )}
          </div>
        </div>

        {/* Languages Spoken */}
        {languages && languages.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider border-b border-surface-300 pb-1" style={{ color: accentColor }}>
              Languages Spoken
            </h3>
            <div className="space-y-1 text-[11px] text-surface-700">
              {languages.map((lang) => (
                <div key={lang.id} className="flex justify-between">
                  <span className="font-medium">{lang.name}</span>
                  <span className="text-surface-500 italic text-[10px]">{lang.proficiency}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Key Expertise Categories */}
        {skills && skills.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider border-b border-surface-300 pb-1" style={{ color: accentColor }}>
              Areas of Expertise
            </h3>
            <div className="space-y-2.5">
              {skills.map((skill: Skill) => (
                <div key={skill.id} className="space-y-1">
                  <div className="font-semibold text-[10px] text-surface-700 uppercase tracking-wide">{skill.category}</div>
                  <div className="flex flex-wrap gap-1">
                    {skill.items.map((item, idx) => (
                      <span key={idx} className="px-1.5 py-0.5 bg-white border border-surface-200 rounded text-[9px] font-medium text-surface-600">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Right Column Main Body */}
      <div className="w-[67%] flex flex-col" style={{ padding: density.pagePadding, paddingLeft: `calc(${density.pagePadding} + 8px)`, gap: density.sectionGap }}>
        
        {/* Name Header */}
        <div className="space-y-1.5 pb-4 border-b border-surface-200">
          <h1 className="text-3xl font-extrabold tracking-tight text-surface-900" style={{ color: primaryColor }}>
            {personalInfo.name || 'Your Name'}
          </h1>
          <p className="text-sm font-bold tracking-wider text-surface-600 uppercase">
            {personalInfo.title || 'Professional Title'}
          </p>
        </div>

        {/* Executive Summary */}
        {personalInfo.summary && (
          <div className="space-y-1.5">
            <h2 className="text-xs font-bold uppercase tracking-widest text-surface-500">
              Executive Profile
            </h2>
            <p className="text-xs text-surface-700 text-justify leading-relaxed whitespace-pre-wrap">{personalInfo.summary}</p>
          </div>
        )}

        {/* Professional Experience */}
        {experience && experience.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-widest text-surface-500">
              Professional Experience
            </h2>
            <div className="space-y-3">
              {experience.map((exp: Experience) => (
                <div key={exp.id} className="space-y-1 text-xs">
                  <div className="flex justify-between items-baseline">
                    <span className="font-bold text-surface-800 text-[13px]">{exp.position}</span>
                    <span className="text-[10px] text-surface-500 font-semibold">{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</span>
                  </div>
                  <div className="flex justify-between text-[11px] font-semibold" style={{ color: primaryColor }}>
                    <span>{exp.company}</span>
                    <span className="text-surface-400 font-normal italic">{exp.location}</span>
                  </div>
                  <p className="text-[11px] text-surface-600 text-justify">{exp.description}</p>
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
          </div>
        )}

        {/* Academic Profile */}
        {education && education.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-widest text-surface-500">
              Education & Credentials
            </h2>
            <div className="space-y-2.5">
              {education.map((edu: Education) => (
                <div key={edu.id} className="text-xs space-y-0.5">
                  <div className="flex justify-between items-baseline font-bold text-surface-800">
                    <span>{edu.degree} {edu.field ? `in ${edu.field}` : ''}</span>
                    <span className="text-[10px] text-surface-500 font-semibold">{edu.startDate} – {edu.endDate}</span>
                  </div>
                  <div className="flex justify-between text-[11px] text-surface-600">
                    <span>{edu.institution}</span>
                    {edu.gpa && <span className="font-semibold text-surface-700">CGPA / Grade: {edu.gpa}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Selected Projects */}
        {projects && projects.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-widest text-surface-500">
              Key Project Assignments
            </h2>
            <div className="space-y-3">
              {projects.map((proj: Project) => (
                <div key={proj.id} className="space-y-1 text-xs">
                  <div className="flex justify-between items-baseline font-bold text-surface-800">
                    <span>{proj.name}</span>
                    <span className="text-[10px] text-surface-500 font-semibold">{proj.startDate} – {proj.endDate}</span>
                  </div>
                  {proj.technologies && proj.technologies.length > 0 && (
                    <div className="text-[9px] font-semibold text-surface-400 uppercase tracking-wider">
                      Technologies: {proj.technologies.join(', ')}
                    </div>
                  )}
                  <p className="text-[11px] text-surface-600 text-justify">{proj.description}</p>
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
          </div>
        )}

        {/* Certifications & Training */}
        {certificates && certificates.length > 0 && (
          <div className="space-y-2">
            <h2 className="text-xs font-bold uppercase tracking-widest text-surface-500">
              Professional Certifications
            </h2>
            <div className="grid grid-cols-2 gap-2 text-xs text-surface-700">
              {certificates.map((cert) => (
                <div key={cert.id} className="border-l-2 border-surface-200 pl-2 py-0.5">
                  <div className="font-semibold text-surface-800 text-[11px] leading-tight">{cert.name}</div>
                  <div className="text-[10px] text-surface-500">{cert.issuer} ({cert.date})</div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
