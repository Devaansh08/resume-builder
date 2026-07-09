import { useResumeStore } from '../../store/resumeStore';
import { formatDate } from '../../utils/helpers';
import { FONT_OPTIONS } from '../../utils/defaults';

export function ProfessionalTemplate() {
  const { currentResume } = useResumeStore();
  if (!currentResume) return null;
  const { sections, theme } = currentResume;
  const pi = sections.personalInfo;

  const fontObj = FONT_OPTIONS.find((f) => f.id === theme?.fontFamily);
  const fontStyle = fontObj ? fontObj.family : theme?.fontFamily || 'Inter, sans-serif';

  const sizeStyles = {
    compact: { text: '9.5px', leading: '1.4', padding: '12px' },
    normal: { text: '10.5px', leading: '1.5', padding: '16px' },
    spacious: { text: '11.5px', leading: '1.65', padding: '20px' },
  }[theme?.fontSize || 'normal'];

  return (
    <div style={{ fontFamily: fontStyle, color: '#1a1a1a', padding: '50px 50px 40px', fontSize: sizeStyles.text, lineHeight: sizeStyles.leading }}>
      {/* Header — centered or split if photo */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: pi.photo ? 'space-between' : 'center', marginBottom: '20px', borderBottom: '2px solid #1a1a1a', paddingBottom: '16px', gap: '20px' }}>
        <div style={{ flex: 1, textAlign: pi.photo ? 'left' : 'center' }}>
          <h1 style={{ fontSize: '26px', fontWeight: 700, letterSpacing: '0.05em', marginBottom: '6px', textTransform: 'uppercase' }}>
            {pi.name || 'Your Name'}
          </h1>
          <div style={{ fontSize: '10px', color: '#4b5563', display: 'flex', justifyContent: pi.photo ? 'flex-start' : 'center', flexWrap: 'wrap', gap: '16px' }}>
            {pi.email && <span>{pi.email}</span>}
            {pi.phone && <span>{pi.phone}</span>}
            {pi.address && <span>{pi.address}</span>}
            {pi.linkedin && <span>{pi.linkedin}</span>}
            {pi.github && <span>{pi.github}</span>}
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
      {pi.summary && <ProfSection title="Summary"><p style={{ color: '#374151' }}>{pi.summary}</p></ProfSection>}

      {/* Experience */}
      {sections.experience.length > 0 && (
        <ProfSection title="Professional Experience">
          {sections.experience.map((exp) => (
            <div key={exp.id} style={{ marginBottom: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                <strong style={{ fontSize: '11px' }}>{exp.position} — {exp.company}</strong>
                <span style={{ fontSize: '9.5px', color: '#6b7280' }}>
                  {formatDate(exp.startDate)} – {exp.current ? 'Present' : formatDate(exp.endDate)}{exp.location ? ` | ${exp.location}` : ''}
                </span>
              </div>
              <ul style={{ paddingLeft: '16px' }}>
                {exp.bullets.filter(Boolean).map((b, i) => (
                  <li key={i} style={{ color: '#374151', marginBottom: '2px' }}>{b}</li>
                ))}
              </ul>
            </div>
          ))}
        </ProfSection>
      )}

      {/* Education */}
      {sections.education.length > 0 && (
        <ProfSection title="Education">
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
        <ProfSection title="Skills">
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
        <ProfSection title="Projects">
          {sections.projects.map((proj) => (
            <div key={proj.id} style={{ marginBottom: '10px' }}>
              <strong>{proj.name}</strong>
              {proj.technologies.length > 0 && <span style={{ color: '#6b7280', fontSize: '9.5px' }}> ({proj.technologies.join(', ')})</span>}
              <ul style={{ paddingLeft: '16px', marginTop: '2px' }}>
                {proj.bullets.filter(Boolean).map((b, i) => <li key={i} style={{ color: '#374151' }}>{b}</li>)}
              </ul>
            </div>
          ))}
        </ProfSection>
      )}

      {/* Certifications */}
      {sections.certificates.length > 0 && (
        <ProfSection title="Certifications">
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
          <ProfSection key={cs.id} title={cs.title}>
            {cs.items.map((item) => (
              <div key={item.id} style={{ marginBottom: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span><strong>{item.title}</strong>{item.subtitle ? ` — ${item.subtitle}` : ''}</span>
                  {item.date && <span style={{ fontSize: '9.5px', color: '#6b7280' }}>{item.date}</span>}
                </div>
                {item.description && <div style={{ fontSize: '10px', color: '#374151', marginTop: '2px', lineHeight: '1.4' }}>{item.description}</div>}
              </div>
            ))}
          </ProfSection>
        ) : null
      ))}

      {/* Interests */}
      {sections.interests && sections.interests.length > 0 && (
        <ProfSection title="Interests & Hobbies">
          <div style={{ fontSize: '10px', color: '#374151' }}>
            {sections.interests.map((i) => i.name).join(' • ')}
          </div>
        </ProfSection>
      )}

      {/* References */}
      {sections.references && sections.references.length > 0 && (
        <ProfSection title="References">
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

function ProfSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '16px' }}>
      <h2 style={{ fontSize: '11.5px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', borderBottom: '1px solid #d1d5db', paddingBottom: '4px', marginBottom: '10px' }}>
        {title}
      </h2>
      {children}
    </div>
  );
}
