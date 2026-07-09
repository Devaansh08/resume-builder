import { useResumeStore } from '../../store/resumeStore';
import { formatDate } from '../../utils/helpers';
import { FONT_OPTIONS } from '../../utils/defaults';
import { RichText } from '../builder/RichText';

export function MinimalTemplate() {
  const { currentResume } = useResumeStore();
  if (!currentResume) return null;
  const { sections, theme } = currentResume;
  const pi = sections.personalInfo;

  const fontObj = FONT_OPTIONS.find((f) => f.id === theme?.fontFamily);
  const fontStyle = fontObj ? fontObj.family : theme?.fontFamily || 'Inter, sans-serif';

  const sizeStyles = {
    compact: { text: '9px', leading: '1.45', padding: '16px' },
    normal: { text: '10px', leading: '1.65', padding: '24px' },
    spacious: { text: '11px', leading: '1.85', padding: '32px' },
  }[theme?.fontSize || 'normal'];

  return (
    <div style={{ fontFamily: fontStyle, color: '#18181b', padding: '48px 52px', fontSize: sizeStyles.text, lineHeight: sizeStyles.leading, backgroundColor: '#fff' }}>
      {/* Header */}
      <div style={{ marginBottom: '28px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '20px' }}>
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: '24px', fontWeight: 300, letterSpacing: '-0.02em', marginBottom: '6px', color: '#09090b' }}>
            {pi.name || 'Your Name'}
          </h1>
          {pi.title && <p style={{ fontSize: '12px', color: '#71717a', marginBottom: '10px' }}>{pi.title}</p>}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', fontSize: '9.5px', color: '#71717a' }}>
            {pi.email && <span>{pi.email}</span>}
            {pi.phone && <span>{pi.phone}</span>}
            {pi.address && <span>{pi.address}</span>}
            {pi.linkedin && <a href={`https://${pi.linkedin}`} style={{ color: '#3b5bff' }}>{pi.linkedin}</a>}
            {pi.github && <a href={`https://${pi.github}`} style={{ color: '#3b5bff' }}>{pi.github}</a>}
          </div>
        </div>
        {pi.photo && (
          <img
            src={pi.photo}
            alt={pi.name}
            style={{ width: '70px', height: '70px', borderRadius: '50%', objectFit: 'cover', border: '1px solid #e4e4e7', flexShrink: 0 }}
          />
        )}
      </div>

      {pi.summary && (
        <div style={{ marginBottom: '24px' }}>
          <RichText content={pi.summary} style={{ color: '#3f3f46', maxWidth: '520px' }} />
        </div>
      )}

      {sections.experience.length > 0 && (
        <MinSection title="Experience">
          {sections.experience.map((exp) => (
            <div key={exp.id} style={{ marginBottom: '16px', display: 'grid', gridTemplateColumns: '1fr 3fr', gap: '16px' }}>
              <div style={{ color: '#a1a1aa', fontSize: '9px', paddingTop: '2px' }}>
                <div>{formatDate(exp.startDate)} –</div>
                <div>{exp.current ? 'Present' : formatDate(exp.endDate)}</div>
                {exp.location && <div style={{ marginTop: '2px' }}>{exp.location}</div>}
              </div>
              <div>
                <div style={{ fontWeight: 500, color: '#09090b' }}>{exp.position}</div>
                <div style={{ color: '#71717a', fontSize: '9.5px' }}>{exp.company}</div>
                {exp.bullets.filter(Boolean).map((b, i) => (
                  <RichText key={i} content={b} style={{ color: '#3f3f46', marginTop: '3px', paddingLeft: '8px', borderLeft: '2px solid #e4e4e7', lineHeight: 1.5 }} />
                ))}
              </div>
            </div>
          ))}
        </MinSection>
      )}

      {sections.education.length > 0 && (
        <MinSection title="Education">
          {sections.education.map((edu) => (
            <div key={edu.id} style={{ marginBottom: '10px', display: 'grid', gridTemplateColumns: '1fr 3fr', gap: '16px' }}>
              <div style={{ color: '#a1a1aa', fontSize: '9px' }}>
                {formatDate(edu.startDate)} – {edu.current ? 'Present' : formatDate(edu.endDate)}
              </div>
              <div>
                <div style={{ fontWeight: 500 }}>{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</div>
                <div style={{ color: '#71717a' }}>{edu.institution}{edu.gpa ? ` · ${edu.gpa}` : ''}</div>
              </div>
            </div>
          ))}
        </MinSection>
      )}

      {sections.projects.length > 0 && (
        <MinSection title="Projects">
          {sections.projects.map((proj) => (
            <div key={proj.id} style={{ marginBottom: '12px' }}>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'baseline' }}>
                <span style={{ fontWeight: 500 }}>{proj.name}</span>
                <span style={{ color: '#a1a1aa', fontSize: '9px' }}>{proj.technologies.slice(0, 3).join(' · ')}</span>
              </div>
              {proj.bullets.filter(Boolean).map((b, i) => (
                <RichText key={i} content={b} style={{ color: '#3f3f46', paddingLeft: '8px', borderLeft: '2px solid #e4e4e7', marginTop: '2px' }} />
              ))}
            </div>
          ))}
        </MinSection>
      )}

      {sections.skills.length > 0 && (
        <MinSection title="Skills">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {sections.skills.map((skill) => (
              <div key={skill.id} style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: '16px' }}>
                <span style={{ color: '#71717a', fontSize: '9px' }}>{skill.category}</span>
                <span style={{ color: '#3f3f46' }}>{skill.items.join(', ')}</span>
              </div>
            ))}
          </div>
        </MinSection>
      )}

      {/* Custom Sections */}
      {sections.customSections && sections.customSections.length > 0 && sections.customSections.map((cs) => (
        cs.items && cs.items.length > 0 ? (
          <MinSection key={cs.id} title={cs.title}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {cs.items.map((item) => (
                <div key={item.id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <span style={{ fontWeight: 500, color: '#18181b' }}>{item.title}</span>
                    {item.date && <span style={{ fontSize: '9px', color: '#a1a1aa' }}>{item.date}</span>}
                  </div>
                  {item.subtitle && <div style={{ fontSize: '10px', color: '#52525b', fontWeight: 500 }}>{item.subtitle}</div>}
                  {item.description && <RichText content={item.description} style={{ fontSize: '9.5px', color: '#52525b', marginTop: '2px', lineHeight: '1.5' }} />}
                </div>
              ))}
            </div>
          </MinSection>
        ) : null
      ))}

      {/* Interests */}
      {sections.interests && sections.interests.length > 0 && (
        <MinSection title="Interests">
          <div style={{ color: '#52525b', fontSize: '9.5px' }}>
            {sections.interests.map((i) => i.name).join('  ·  ')}
          </div>
        </MinSection>
      )}

      {/* References */}
      {sections.references && sections.references.length > 0 && (
        <MinSection title="References">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {sections.references.map((r) => (
              <div key={r.id} style={{ fontSize: '9.5px', color: '#52525b' }}>
                <span style={{ fontWeight: 500, color: '#18181b' }}>{r.name}</span> — {r.title}{r.company ? ` (${r.company})` : ''}
                {(r.email || r.phone) && <span style={{ color: '#a1a1aa', marginLeft: '6px' }}>[{[r.email, r.phone].filter(Boolean).join(' | ')}]</span>}
              </div>
            ))}
          </div>
        </MinSection>
      )}
    </div>
  );
}

function MinSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '24px' }}>
      <div style={{ fontSize: '9px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#a1a1aa', marginBottom: '12px' }}>
        {title}
      </div>
      {children}
    </div>
  );
}
