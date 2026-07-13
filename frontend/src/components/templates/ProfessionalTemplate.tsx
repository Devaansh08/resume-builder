import { useResumeStore } from '../../store/resumeStore';
import type { Resume } from '../../types';
import { formatDate, formatUrl } from '../../utils/helpers';
import { FONT_OPTIONS, getDensityConfig, type DensityConfig } from '../../utils/defaults';
import { RichText } from '../builder/RichText';

export function ProfessionalTemplate({ resume: propResume }: { resume?: Resume }) {
  const storeResume = useResumeStore((state) => propResume ? null : state.currentResume);
  const currentResume = propResume || storeResume;
  if (!currentResume) return null;
  const { sections, theme, sectionTitles } = currentResume;
  const titles = sectionTitles || {};
  const pi = sections.personalInfo;

  const fontObj = FONT_OPTIONS.find((f) => f.id === theme?.fontFamily);
  const fontStyle = fontObj ? fontObj.family : theme?.fontFamily || 'Inter, sans-serif';

  const density = getDensityConfig(theme);

  return (
    <div style={{ fontFamily: fontStyle, color: '#1a1a1a', padding: density.pagePadding, fontSize: density.fontSize, lineHeight: density.lineHeight }}>
      {/* Header — centered or split if photo */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: pi.photo ? 'space-between' : 'center', marginBottom: '20px', borderBottom: '2px solid #1a1a1a', paddingBottom: '16px', gap: '20px' }}>
        <div style={{ flex: 1, textAlign: pi.photo ? 'left' : 'center' }}>
          <h1 style={{ fontSize: '26px', fontWeight: 700, letterSpacing: '0.05em', marginBottom: '6px', textTransform: 'uppercase' }}>
            {pi.name || 'Your Name'}
          </h1>
          <div style={{ fontSize: '10px', color: '#4b5563', display: 'flex', justifyContent: pi.photo ? 'flex-start' : 'center', flexWrap: 'wrap', gap: '16px' }}>
            {pi.email && <span><a href={`mailto:${pi.email}`} style={{ color: 'inherit', textDecoration: 'underline' }}>{pi.email}</a></span>}
            {pi.phone && <span>{pi.phone}</span>}
            {pi.address && <span>{pi.address}</span>}
            {pi.linkedin && <span><a href={formatUrl(pi.linkedin)} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'underline' }}>{pi.linkedin}</a></span>}
            {pi.github && <span><a href={formatUrl(pi.github)} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'underline' }}>{pi.github}</a></span>}
            {pi.portfolio && <span><a href={formatUrl(pi.portfolio)} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'underline' }}>{pi.portfolio}</a></span>}
          </div>
        </div>
        {pi.photo && (
          <img
            src={pi.photo}
            alt={pi.name}
            style={{ width: '80px', height: '80px', borderRadius: '4px', objectFit: 'cover', border: '1px solid #333', flexShrink: 0 }}
          />
        )}
      </div>

      {/* Summary */}
      {pi.summary && <ProfSection density={density} title={titles.summary || "Summary"}><RichText content={pi.summary} style={{ color: '#374151' }} /></ProfSection>}

      {/* Experience */}
      {sections.experience.length > 0 && (
        <ProfSection density={density} title={titles.experience || "Professional Experience"}>
          {sections.experience.map((exp) => (
            <div key={exp.id} style={{ marginBottom: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                <strong style={{ fontSize: '11px' }}>{exp.position} — {exp.company}</strong>
                <span style={{ fontSize: '9.5px', color: '#6b7280' }}>
                  {formatDate(exp.startDate)} – {exp.current ? 'Present' : formatDate(exp.endDate)}{exp.location ? ` | ${exp.location}` : ''}
                </span>
              </div>
              {exp.bullets.filter(Boolean).length > 0 && (
                <ul style={{ paddingLeft: '16px', marginTop: '4px', listStyleType: 'disc' }}>
                  {exp.bullets.filter(Boolean).map((b, i) => (
                    <li key={i} style={{ color: '#374151', marginBottom: '2px' }}><RichText content={b} /></li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </ProfSection>
      )}

      {/* Education */}
      {sections.education.length > 0 && (
        <ProfSection density={density} title={titles.education || "Education"}>
          {sections.education.map((edu) => (
            <div key={edu.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <div>
                <strong>{edu.degree} {edu.field && `in ${edu.field}`}</strong>
                <div>{edu.institution}{edu.gpa && ` — GPA: ${edu.gpa}`}</div>
              </div>
              <span style={{ fontSize: '9.5px', color: '#6b7280', flexShrink: 0 }}>
                {formatDate(edu.startDate)} – {edu.current ? 'Present' : formatDate(edu.endDate)}
              </span>
            </div>
          ))}
        </ProfSection>
      )}

      {/* Skills */}
      {sections.skills.length > 0 && (
        <ProfSection density={density} title={titles.skills || "Skills"}>
          {sections.skills.map((skill) => (
            <div key={skill.id} style={{ marginBottom: '4px' }}>
              {skill.category && <strong style={{ fontSize: '10px' }}>{skill.category}: </strong>}
              <span style={{ color: '#374151' }}>{skill.items.join(' · ')}</span>
            </div>
          ))}
        </ProfSection>
      )}

      {/* Projects */}
      {sections.projects.length > 0 && (
        <ProfSection density={density} title={titles.projects || "Projects"}>
          {sections.projects.map((proj) => (
            <div key={proj.id} style={{ marginBottom: '10px' }}>
              <strong>{proj.name}</strong>
              {proj.technologies.length > 0 && <span style={{ color: '#6b7280', fontSize: '9.5px' }}> ({proj.technologies.join(', ')})</span>}
              {proj.bullets.filter(Boolean).length > 0 && (
                <ul style={{ paddingLeft: '16px', marginTop: '4px', listStyleType: 'disc' }}>
                  {proj.bullets.filter(Boolean).map((b, i) => <li key={i} style={{ color: '#374151' }}><RichText content={b} /></li>)}
                </ul>
              )}
            </div>
          ))}
        </ProfSection>
      )}

      {/* Certifications */}
      {sections.certificates.length > 0 && (
        <ProfSection density={density} title={titles.certificates || "Certifications"}>
          {sections.certificates.map((cert) => (
            <div key={cert.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span><strong>{cert.name}</strong> — {cert.issuer}</span>
              <span style={{ fontSize: '9.5px', color: '#6b7280' }}>{formatDate(cert.date)}</span>
            </div>
          ))}
        </ProfSection>
      )}

      {/* Custom Sections */}
      {sections.customSections && sections.customSections.length > 0 && sections.customSections.map((cs) => (
        cs.items && cs.items.length > 0 ? (
          <ProfSection key={cs.id} density={density} title={cs.title}>
            {cs.items.map((item) => (
              <div key={item.id} style={{ marginBottom: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span><strong>{item.title}</strong>{item.subtitle ? ` — ${item.subtitle}` : ''}</span>
                  {item.date && <span style={{ fontSize: '9.5px', color: '#6b7280' }}>{item.date}</span>}
                </div>
                {item.description && <RichText content={item.description} style={{ fontSize: '10px', color: '#374151', marginTop: '2px', lineHeight: '1.4' }} />}
              </div>
            ))}
          </ProfSection>
        ) : null
      ))}

      {/* Interests */}
      {sections.interests && sections.interests.length > 0 && (
        <ProfSection density={density} title={titles.interests || "Interests & Hobbies"}>
          <div style={{ fontSize: '10px', color: '#374151' }}>
            {sections.interests.map((i) => i.name).join(' • ')}
          </div>
        </ProfSection>
      )}

      {/* References */}
      {sections.references && sections.references.length > 0 && (
        <ProfSection density={density} title={titles.references || "References"}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            {sections.references.map((r) => (
              <div key={r.id} style={{ fontSize: '9.5px', color: '#374151' }}>
                <div><strong>{r.name}</strong> — {r.title}{r.company ? `, ${r.company}` : ''}</div>
                {(r.email || r.phone) && <div style={{ color: '#6b7280' }}>{[r.email, r.phone].filter(Boolean).join(' | ')}</div>}
              </div>
            ))}
          </div>
        </ProfSection>
      )}
    </div>
  );
}

function ProfSection({ title, density, children }: { title: string; density?: DensityConfig; children: React.ReactNode }) {
  const marginBottom = density?.sectionGap || '16px';
  const fontSize = density?.sectionTitleSize || '11.5px';
  return (
    <div style={{ marginBottom }}>
      <h2 style={{ fontSize, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', borderBottom: '1px solid #d1d5db', paddingBottom: '4px', marginBottom: '8px' }}>
        {title}
      </h2>
      {children}
    </div>
  );
}
