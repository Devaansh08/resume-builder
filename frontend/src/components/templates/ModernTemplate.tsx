import { useResumeStore } from '../../store/resumeStore';
import { formatDate } from '../../utils/helpers';
import { FONT_OPTIONS } from '../../utils/defaults';
import { RichText } from '../builder/RichText';

export function ModernTemplate() {
  const { currentResume } = useResumeStore();
  if (!currentResume) return null;

  const { sections, theme } = currentResume;
  const pi = sections.personalInfo;
  const primary = theme?.primaryColor || '#3b5bff';

  const fontObj = FONT_OPTIONS.find((f) => f.id === theme?.fontFamily);
  const fontStyle = fontObj ? fontObj.family : theme?.fontFamily || 'Inter, sans-serif';

  const sizeStyles = {
    compact: { text: '10px', leading: '1.4', margin: '8px', padding: '12px' },
    normal: { text: '11px', leading: '1.65', margin: '12px', padding: '18px' },
    spacious: { text: '12.5px', leading: '1.8', margin: '16px', padding: '24px' },
  }[theme?.fontSize || 'normal'];

  return (
    <div className="text-gray-900" style={{ fontFamily: fontStyle, fontSize: sizeStyles.text, lineHeight: sizeStyles.leading }}>
      {/* Header */}
      <div className="px-10 pt-10 pb-6" style={{ borderBottom: `3px solid ${primary}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '24px' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900" style={{ fontSize: '28px', fontWeight: 700, marginBottom: '4px' }}>
            {pi.name || 'Your Name'}
          </h1>
          {pi.title && (
            <p style={{ fontSize: '14px', color: primary, fontWeight: 500, marginBottom: '10px' }}>
              {pi.title}
            </p>
          )}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', fontSize: '10px', color: '#6b7280' }}>
            {pi.email && <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>✉ {pi.email}</span>}
            {pi.phone && <span>📞 {pi.phone}</span>}
            {pi.address && <span>📍 {pi.address}</span>}
            {pi.linkedin && <span>in {pi.linkedin}</span>}
            {pi.github && <span>⌥ {pi.github}</span>}
            {pi.portfolio && <span>🌐 {pi.portfolio}</span>}
          </div>
        </div>
        {pi.photo && (
          <img
            src={pi.photo}
            alt={pi.name}
            style={{ width: '84px', height: '84px', borderRadius: '50%', objectFit: 'cover', border: `3px solid ${primary}`, flexShrink: 0 }}
          />
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '0' }}>
        {/* Left column */}
        <div style={{ padding: '20px 24px 20px 40px', borderRight: '1px solid #e5e7eb' }}>
          {/* Summary */}
          {pi.summary && (
            <Section title="Professional Summary" primary={primary}>
              <RichText content={pi.summary} style={{ color: '#374151', lineHeight: '1.6', fontSize: '10.5px' }} />
            </Section>
          )}

          {/* Experience */}
          {sections.experience.length > 0 && (
            <Section title="Work Experience" primary={primary}>
              {sections.experience.map((exp) => (
                <div key={exp.id} style={{ marginBottom: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '11.5px', color: '#111827' }}>{exp.position}</div>
                      <div style={{ color: primary, fontSize: '10.5px', fontWeight: 500 }}>{exp.company}</div>
                    </div>
                    <div style={{ fontSize: '9.5px', color: '#9ca3af', textAlign: 'right', flexShrink: 0 }}>
                      {formatDate(exp.startDate)} — {exp.current ? 'Present' : formatDate(exp.endDate)}
                      {exp.location && <div>{exp.location}</div>}
                    </div>
                  </div>
                  {exp.bullets.filter(Boolean).length > 0 && (
                    <ul style={{ paddingLeft: '14px', marginTop: '5px' }}>
                      {exp.bullets.filter(Boolean).map((b, i) => (
                        <li key={i} style={{ color: '#374151', fontSize: '10px', lineHeight: '1.5', marginBottom: '2px' }}>
                          <RichText content={b} />
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </Section>
          )}

          {/* Projects */}
          {sections.projects.length > 0 && (
            <Section title="Projects" primary={primary}>
              {sections.projects.map((proj) => (
                <div key={proj.id} style={{ marginBottom: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 600, fontSize: '11px', color: '#111827' }}>{proj.name}</span>
                    {proj.technologies.length > 0 && (
                      <span style={{ fontSize: '9px', color: '#6b7280' }}>{proj.technologies.slice(0, 4).join(' · ')}</span>
                    )}
                  </div>
                  {proj.bullets.filter(Boolean).map((b, i) => (
                    <li key={i} style={{ color: '#374151', fontSize: '10px', listStyle: 'disc', marginLeft: '12px', marginTop: '3px' }}>
                      <RichText content={b} />
                    </li>
                  ))}
                </div>
              ))}
            </Section>
          )}

          {/* Custom Sections (Left / Main Column) */}
          {sections.customSections && sections.customSections.length > 0 && sections.customSections.map((cs) => (
            cs.items && cs.items.length > 0 ? (
              <Section key={cs.id} title={cs.title} primary={primary}>
                {cs.items.map((item) => (
                  <div key={item.id} style={{ marginBottom: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <span style={{ fontWeight: 600, fontSize: '11px', color: '#111827' }}>{item.title}</span>
                      {item.date && <span style={{ fontSize: '9.5px', color: '#9ca3af', fontWeight: 500 }}>{item.date}</span>}
                    </div>
                    {item.subtitle && <div style={{ fontSize: '10px', color: primary, fontWeight: 500, marginBottom: '2px' }}>{item.subtitle}</div>}
                    {item.description && <RichText content={item.description} style={{ fontSize: '10px', color: '#374151', lineHeight: '1.5' }} />}
                  </div>
                ))}
              </Section>
            ) : null
          ))}
        </div>

        {/* Right column */}
        <div style={{ padding: '20px 24px 20px 20px', backgroundColor: '#f9fafb' }}>
          {/* Skills */}
          {sections.skills.length > 0 && (
            <Section title="Skills" primary={primary}>
              {sections.skills.map((skill) => (
                <div key={skill.id} style={{ marginBottom: '10px' }}>
                  {skill.category && (
                    <div style={{ fontSize: '9.5px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>
                      {skill.category}
                    </div>
                  )}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                    {skill.items.map((item) => (
                      <span key={item} style={{ fontSize: '9px', padding: '2px 7px', borderRadius: '4px', backgroundColor: `${primary}18`, color: primary, fontWeight: 500 }}>
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </Section>
          )}

          {/* Education */}
          {sections.education.length > 0 && (
            <Section title="Education" primary={primary}>
              {sections.education.map((edu) => (
                <div key={edu.id} style={{ marginBottom: '10px' }}>
                  <div style={{ fontWeight: 600, fontSize: '10.5px', color: '#111827' }}>{edu.degree} {edu.field ? `in ${edu.field}` : ''}</div>
                  <div style={{ color: primary, fontSize: '10px' }}>{edu.institution}</div>
                  <div style={{ fontSize: '9.5px', color: '#9ca3af' }}>
                    {formatDate(edu.startDate)} — {edu.current ? 'Present' : formatDate(edu.endDate)}
                    {edu.gpa && ` · GPA: ${edu.gpa}`}
                  </div>
                </div>
              ))}
            </Section>
          )}

          {/* Certificates */}
          {sections.certificates.length > 0 && (
            <Section title="Certifications" primary={primary}>
              {sections.certificates.map((cert) => (
                <div key={cert.id} style={{ marginBottom: '8px' }}>
                  <div style={{ fontWeight: 600, fontSize: '10px', color: '#111827' }}>{cert.name}</div>
                  <div style={{ fontSize: '9.5px', color: '#6b7280' }}>{cert.issuer} · {formatDate(cert.date)}</div>
                </div>
              ))}
            </Section>
          )}

          {/* Languages */}
          {sections.languages.length > 0 && (
            <Section title="Languages" primary={primary}>
              {sections.languages.map((lang) => (
                <div key={lang.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '10px' }}>
                  <span style={{ color: '#111827' }}>{lang.name}</span>
                  <span style={{ color: '#9ca3af', textTransform: 'capitalize' }}>{lang.proficiency}</span>
                </div>
              ))}
            </Section>
          )}

          {/* Achievements */}
          {sections.achievements.length > 0 && (
            <Section title="Achievements" primary={primary}>
              {sections.achievements.map((a) => (
                <div key={a.id} style={{ marginBottom: '8px' }}>
                  <div style={{ fontWeight: 600, fontSize: '10px', color: '#111827' }}>{a.title}</div>
                  {a.description && <div style={{ fontSize: '9.5px', color: '#6b7280' }}>{a.description}</div>}
                </div>
              ))}
            </Section>
          )}

          {/* Interests */}
          {sections.interests && sections.interests.length > 0 && (
            <Section title="Interests" primary={primary}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                {sections.interests.map((i) => (
                  <span key={i.id} style={{ fontSize: '9px', padding: '2px 7px', borderRadius: '4px', backgroundColor: '#f3f4f6', color: '#374151', fontWeight: 500 }}>
                    {i.name}
                  </span>
                ))}
              </div>
            </Section>
          )}

          {/* References */}
          {sections.references && sections.references.length > 0 && (
            <Section title="References" primary={primary}>
              {sections.references.map((r) => (
                <div key={r.id} style={{ marginBottom: '8px' }}>
                  <div style={{ fontWeight: 600, fontSize: '10px', color: '#111827' }}>{r.name}</div>
                  <div style={{ fontSize: '9.5px', color: '#6b7280' }}>{r.title}{r.company ? ` at ${r.company}` : ''}</div>
                  {r.email && <div style={{ fontSize: '9px', color: '#9ca3af' }}>{r.email}</div>}
                  {r.phone && <div style={{ fontSize: '9px', color: '#9ca3af' }}>{r.phone}</div>}
                </div>
              ))}
            </Section>
          )}
        </div>
      </div>
    </div>
  );
}

function Section({ title, primary, children }: { title: string; primary: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '18px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
        <h2 style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: primary, whiteSpace: 'nowrap' }}>
          {title}
        </h2>
        <div style={{ flex: 1, height: '1px', backgroundColor: `${primary}30` }} />
      </div>
      {children}
    </div>
  );
}
