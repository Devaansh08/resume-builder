import { useResumeStore } from '../../store/resumeStore';
import { formatDate } from '../../utils/helpers';
import { FONT_OPTIONS } from '../../utils/defaults';

export function ExecutiveTemplate() {
  const { currentResume } = useResumeStore();
  if (!currentResume) return null;

  const { sections, theme } = currentResume;
  const pi = sections.personalInfo;
  const primary = theme?.primaryColor || '#1A1A3E';
  const accent = theme?.accentColor || '#C41E3A';

  const fontObj = FONT_OPTIONS.find((f) => f.id === theme?.fontFamily);
  const fontStyle = fontObj ? fontObj.family : theme?.fontFamily || 'Plus Jakarta Sans, sans-serif';

  const sizeStyles = {
    compact: { text: '9.5px', leading: '1.45', margin: '10px', padding: '14px', headingSize: '22px' },
    normal: { text: '10.5px', leading: '1.65', margin: '14px', padding: '20px', headingSize: '26px' },
    spacious: { text: '11.5px', leading: '1.85', margin: '18px', padding: '28px', headingSize: '30px' },
  }[theme?.fontSize || 'normal'];

  return (
    <div style={{ fontFamily: fontStyle, color: '#1a1a1a', backgroundColor: '#fff', fontSize: sizeStyles.text, lineHeight: sizeStyles.leading }}>
      {/* ── Centered Header ──────────────────────────────────────────── */}
      <div style={{ padding: '40px 48px 24px', borderBottom: `3px solid ${primary}`, textAlign: 'center' }}>
        <h1 style={{ fontSize: sizeStyles.headingSize, fontWeight: 700, color: primary, marginBottom: '4px', letterSpacing: '-0.02em' }}>
          {pi.name || 'Your Name'}
        </h1>
        {pi.title && (
          <p style={{ fontSize: '12px', color: accent, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '12px' }}>
            {pi.title}
          </p>
        )}
        {/* Contact row */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '16px', fontSize: '9.5px', color: '#555' }}>
          {pi.email && <span>{pi.email}</span>}
          {pi.phone && <span>{pi.phone}</span>}
          {pi.address && <span>{pi.address}</span>}
          {pi.linkedin && <span>{pi.linkedin}</span>}
          {pi.github && <span>{pi.github}</span>}
          {pi.portfolio && <span>{pi.portfolio}</span>}
        </div>
      </div>

      {/* ── Body ─────────────────────────────────────────────────────── */}
      <div style={{ padding: '24px 48px 40px' }}>

        {/* Summary */}
        {pi.summary && (
          <ExecSection title="Professional Summary" accent={accent} primary={primary}>
            <p style={{ color: '#374151', lineHeight: '1.7', fontSize: '10.5px', textAlign: 'justify' }}>{pi.summary}</p>
          </ExecSection>
        )}

        {/* Experience */}
        {sections.experience.length > 0 && (
          <ExecSection title="Professional Experience" accent={accent} primary={primary}>
            {sections.experience.map((exp) => (
              <div key={exp.id} style={{ marginBottom: '18px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '2px' }}>
                  <div style={{ fontWeight: 700, color: primary, fontSize: '11px' }}>{exp.position}</div>
                  <div style={{ fontSize: '9px', color: '#888', fontStyle: 'italic' }}>
                    {formatDate(exp.startDate)} – {exp.current ? 'Present' : formatDate(exp.endDate)}
                  </div>
                </div>
                <div style={{ fontStyle: 'italic', color: '#555', fontSize: '10px', marginBottom: '6px' }}>
                  {exp.company}{exp.location ? `, ${exp.location}` : ''}
                </div>
                {exp.bullets.filter(Boolean).length > 0 && (
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {exp.bullets.filter(Boolean).map((b, i) => (
                      <li key={i} style={{ color: '#374151', paddingLeft: '14px', position: 'relative', marginBottom: '3px', lineHeight: '1.5' }}>
                        <span style={{ position: 'absolute', left: 0, color: accent, fontWeight: 700 }}>•</span>
                        {b}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </ExecSection>
        )}

        {/* Education */}
        {sections.education.length > 0 && (
          <ExecSection title="Education" accent={accent} primary={primary}>
            {sections.education.map((edu) => (
              <div key={edu.id} style={{ marginBottom: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <div style={{ fontWeight: 700, color: primary, fontSize: '11px' }}>
                    {edu.degree}{edu.field ? ` in ${edu.field}` : ''}
                  </div>
                  <div style={{ fontSize: '9px', color: '#888', fontStyle: 'italic' }}>
                    {formatDate(edu.startDate)} – {edu.current ? 'Present' : formatDate(edu.endDate)}
                  </div>
                </div>
                <div style={{ fontStyle: 'italic', color: '#555', fontSize: '10px' }}>
                  {edu.institution}{edu.gpa ? ` · GPA: ${edu.gpa}` : ''}
                </div>
                {edu.description && <p style={{ color: '#374151', marginTop: '4px', lineHeight: '1.5' }}>{edu.description}</p>}
              </div>
            ))}
          </ExecSection>
        )}

        {/* Skills */}
        {sections.skills.length > 0 && (
          <ExecSection title="Core Competencies" accent={accent} primary={primary}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px 24px' }}>
              {sections.skills.map((skill) => (
                <div key={skill.id}>
                  <span style={{ fontWeight: 600, color: primary, fontSize: '9.5px' }}>{skill.category}: </span>
                  <span style={{ color: '#374151' }}>{skill.items.join(', ')}</span>
                </div>
              ))}
            </div>
          </ExecSection>
        )}

        {/* Projects */}
        {sections.projects.length > 0 && (
          <ExecSection title="Notable Projects" accent={accent} primary={primary}>
            {sections.projects.map((proj) => (
              <div key={proj.id} style={{ marginBottom: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontWeight: 700, color: primary }}>{proj.name}</span>
                  {proj.technologies.length > 0 && (
                    <span style={{ fontSize: '9px', color: '#888' }}>{proj.technologies.slice(0, 4).join(' · ')}</span>
                  )}
                </div>
                {proj.bullets.filter(Boolean).map((b, i) => (
                  <div key={i} style={{ color: '#374151', paddingLeft: '14px', position: 'relative', marginTop: '3px', lineHeight: '1.5' }}>
                    <span style={{ position: 'absolute', left: 0, color: accent, fontWeight: 700 }}>•</span>
                    {b}
                  </div>
                ))}
              </div>
            ))}
          </ExecSection>
        )}

        {/* Certifications */}
        {sections.certificates.length > 0 && (
          <ExecSection title="Certifications" accent={accent} primary={primary}>
            {sections.certificates.map((cert) => (
              <div key={cert.id} style={{ marginBottom: '8px', display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <span style={{ fontWeight: 600, color: primary }}>{cert.name}</span>
                  {cert.issuer && <span style={{ color: '#555', fontStyle: 'italic' }}> · {cert.issuer}</span>}
                </div>
                {cert.date && <span style={{ fontSize: '9px', color: '#888' }}>{cert.date}</span>}
              </div>
            ))}
          </ExecSection>
        )}

        {/* Achievements */}
        {sections.achievements.length > 0 && (
          <ExecSection title="Awards & Achievements" accent={accent} primary={primary}>
            {sections.achievements.map((ach) => (
              <div key={ach.id} style={{ marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <div>
                  <span style={{ fontWeight: 600, color: primary }}>{ach.title}</span>
                  {ach.description && <span style={{ color: '#374151' }}> — {ach.description}</span>}
                </div>
                {ach.date && <span style={{ fontSize: '9px', color: '#888' }}>{ach.date}</span>}
              </div>
            ))}
          </ExecSection>
        )}

        {/* Languages */}
        {sections.languages.length > 0 && (
          <ExecSection title="Languages" accent={accent} primary={primary}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
              {sections.languages.map((lang) => (
                <span key={lang.id} style={{ color: '#374151' }}>
                  <strong style={{ color: primary }}>{lang.name}</strong> ({lang.proficiency})
                </span>
              ))}
            </div>
          </ExecSection>
        )}

        {/* Custom Sections */}
        {sections.customSections?.map((cs) =>
          cs.items?.length > 0 ? (
            <ExecSection key={cs.id} title={cs.title} accent={accent} primary={primary}>
              {cs.items.map((item) => (
                <div key={item.id} style={{ marginBottom: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: 600, color: primary }}>{item.title}{item.subtitle ? ` · ${item.subtitle}` : ''}</span>
                    {item.date && <span style={{ fontSize: '9px', color: '#888' }}>{item.date}</span>}
                  </div>
                  {item.description && <p style={{ color: '#374151', lineHeight: '1.5', marginTop: '3px' }}>{item.description}</p>}
                </div>
              ))}
            </ExecSection>
          ) : null
        )}
      </div>
    </div>
  );
}

function ExecSection({
  title,
  accent,
  primary,
  children,
}: {
  title: string;
  accent: string;
  primary: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ marginBottom: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
        <h2 style={{
          fontSize: '10px',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          color: primary,
        }}>
          {title}
        </h2>
        <div style={{ flex: 1, height: '1px', backgroundColor: accent, opacity: 0.4 }} />
      </div>
      {children}
    </div>
  );
}
