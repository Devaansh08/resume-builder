import { useResumeStore } from '../../store/resumeStore';
import { formatDate } from '../../utils/helpers';
import { FONT_OPTIONS } from '../../utils/defaults';
import { RichText } from '../builder/RichText';

export function ShrineTemplate() {
  const { currentResume } = useResumeStore();
  if (!currentResume) return null;

  const { sections, theme } = currentResume;
  const pi = sections.personalInfo;

  // Material Design Shrine Color Palette
  const bgSoft = '#FEEAE6'; // Secondary 50 (Very light pink)
  const bgHeader = '#FEDBD0'; // Primary 100 (Peach pink)
  const textDark = '#442C2E'; // Primary 900 (Deep brown)
  const primaryColor = theme.primaryColor || '#442C2E';

  const fontObj = FONT_OPTIONS.find((f) => f.id === theme?.fontFamily);
  const fontStyle = fontObj ? fontObj.family : 'Plus Jakarta Sans, system-ui, sans-serif';

  return (
    <div
      style={{
        fontFamily: fontStyle,
        color: textDark,
        backgroundColor: bgSoft,
        padding: '0',
        minHeight: '1123px', // standard A4 height
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* ── Header block with slanted corner/backdrop style ──────────────── */}
      <div
        style={{
          backgroundColor: bgHeader,
          padding: '48px 50px 32px',
          borderBottom: `2px solid ${primaryColor}20`,
          position: 'relative',
          clipPath: 'polygon(0 0, 100% 0, 100% 85%, 95% 100%, 0 100%)', // Slanted edge style like Shrine UI sheets
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: '20px',
        }}
      >
        <div style={{ flex: 1 }}>
          {/* Shrine emblem branding */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', opacity: 0.8 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={textDark} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 3h12l4 6-10 13L2 9z" />
            </svg>
            <span style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase' }}>
              SHRINE PROFILE
            </span>
          </div>

          <h1 style={{ fontSize: '28px', fontWeight: 300, letterSpacing: '-0.02em', margin: '0 0 4px', textTransform: 'uppercase', color: textDark }}>
            {pi.name || 'Your Name'}
          </h1>
          {pi.title && (
            <p style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '0.05em', color: textDark, opacity: 0.8, margin: '0 0 16px', textTransform: 'uppercase' }}>
              {pi.title}
            </p>
          )}

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', fontSize: '9.5px', opacity: 0.9 }}>
            {pi.email && <span>✉ {pi.email}</span>}
            {pi.phone && <span>📞 {pi.phone}</span>}
            {pi.address && <span>📍 {pi.address}</span>}
            {pi.linkedin && <span>in/{pi.linkedin}</span>}
            {pi.github && <span>git/{pi.github}</span>}
          </div>
        </div>
        {pi.photo && (
          <img
            src={pi.photo}
            alt={pi.name}
            style={{ width: '84px', height: '84px', borderRadius: '12px', objectFit: 'cover', border: `2px solid ${textDark}`, flexShrink: 0 }}
          />
        )}
      </div>

      {/* ── Main Layout Grid ─────────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1.2fr', gap: '0', flex: 1 }}>
        {/* Left main column */}
        <div style={{ padding: '32px 32px 32px 50px', borderRight: `1px solid ${textDark}15` }}>
          {/* Summary */}
          {pi.summary && (
            <div style={{ marginBottom: '24px' }}>
              <div style={{ fontSize: '10px', color: textDark, opacity: 0.85, lineHeight: '1.7', padding: '16px', backgroundColor: `${primary}08`, borderRadius: '8px' }}>
                <RichText content={pi.summary} />
              </div>
            </div>
          )}

          {/* Work Experience */}
          {sections.experience.length > 0 && (
            <ShrineSection title="Experience">
              {sections.experience.map((exp) => (
                <div key={exp.id} style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '4px' }}>
                    <span style={{ fontWeight: 600, fontSize: '11px', textTransform: 'uppercase' }}>{exp.position}</span>
                    <span style={{ fontSize: '9px', opacity: 0.7 }}>
                      {formatDate(exp.startDate)} – {exp.current ? 'Present' : formatDate(exp.endDate)}
                    </span>
                  </div>
                  <div style={{ fontSize: '10px', fontWeight: 500, color: primaryColor, marginBottom: '6px' }}>
                    {exp.company} {exp.location && `· ${exp.location}`}
                  </div>
                  {exp.bullets.filter(Boolean).length > 0 && (
                    <ul style={{ paddingLeft: '14px', margin: '0', listStyleType: 'none' }}>
                      {exp.bullets.filter(Boolean).map((b, i) => (
                        <li key={i} style={{ marginBottom: '4px', paddingLeft: '4px', position: 'relative' }}>
                          <span style={{ position: 'absolute', left: -14, color: accent }}>▹</span>
                          <RichText content={b} />
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </ShrineSection>
          )}

          {/* Projects */}
          {sections.projects.length > 0 && (
            <ShrineSection title="Projects">
              {sections.projects.map((proj) => (
                <div key={proj.id} style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '2px' }}>
                    <span style={{ fontWeight: 600, fontSize: '10.5px', textTransform: 'uppercase' }}>{proj.name}</span>
                    {proj.technologies.length > 0 && (
                      <span style={{ fontSize: '8.5px', opacity: 0.8 }}>{proj.technologies.slice(0, 3).join(' · ')}</span>
                    )}
                  </div>
                  <ul style={{ paddingLeft: '12px', margin: '0', listStyleType: 'none' }}>
                    {proj.bullets.filter(Boolean).map((b, i) => (
                      <li key={i} style={{ marginBottom: '3px', position: 'relative', paddingLeft: '12px' }}>
                        <span style={{ position: 'absolute', left: 0, color: accent }}>▹</span>
                        <RichText content={b} />
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </ShrineSection>
          )}

          {/* Custom Sections */}
          {sections.customSections && sections.customSections.length > 0 && sections.customSections.map((cs) => (
            cs.items && cs.items.length > 0 ? (
              <ShrineSection key={cs.id} title={cs.title}>
                {cs.items.map((item) => (
                  <div key={item.id} style={{ marginBottom: '14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <span style={{ fontWeight: 600, fontSize: '10.5px', textTransform: 'uppercase' }}>{item.title}</span>
                      {item.date && <span style={{ fontSize: '8.5px', opacity: 0.8 }}>{item.date}</span>}
                    </div>
                    {item.subtitle && <div style={{ fontSize: '10px', color: primary, fontWeight: 500 }}>{item.subtitle}</div>}
                    {item.description && <RichText content={item.description} style={{ fontSize: '9.5px', paddingLeft: '8px', borderLeft: `2px solid ${textDark}30`, marginTop: '4px', opacity: 0.9, lineHeight: '1.4' }} />}
                  </div>
                ))}
              </ShrineSection>
            ) : null
          ))}
        </div>

        {/* Right sidebar column */}
        <div style={{ padding: '32px 50px 32px 32px' }}>
          {/* Skills */}
          {sections.skills.length > 0 && (
            <ShrineSection title="Skills">
              {sections.skills.map((skill) => (
                <div key={skill.id} style={{ marginBottom: '14px' }}>
                  {skill.category && (
                    <div style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '6px', opacity: 0.8 }}>
                      {skill.category}
                    </div>
                  )}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                    {skill.items.map((item) => (
                      <span key={item} style={{ fontSize: '8.5px', padding: '3px 8px', backgroundColor: `${textDark}15`, color: textDark, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </ShrineSection>
          )}

          {/* Education */}
          {sections.education.length > 0 && (
            <ShrineSection title="Education">
              {sections.education.map((edu) => (
                <div key={edu.id} style={{ marginBottom: '14px' }}>
                  <div style={{ fontWeight: 600, fontSize: '10px', textTransform: 'uppercase' }}>{edu.degree}</div>
                  <div style={{ fontSize: '9px', opacity: 0.8 }}>{edu.institution}</div>
                  <div style={{ fontSize: '8.5px', opacity: 0.7, marginTop: '2px' }}>
                    {formatDate(edu.startDate)} — {edu.current ? 'Present' : formatDate(edu.endDate)}
                  </div>
                </div>
              ))}
            </ShrineSection>
          )}

          {/* Certificates */}
          {sections.certificates.length > 0 && (
            <ShrineSection title="Certifications">
              {sections.certificates.map((cert) => (
                <div key={cert.id} style={{ marginBottom: '10px' }}>
                  <div style={{ fontWeight: 600, fontSize: '9.5px', textTransform: 'uppercase' }}>{cert.name}</div>
                  <div style={{ fontSize: '8.5px', opacity: 0.8 }}>{cert.issuer}</div>
                </div>
              ))}
            </ShrineSection>
          )}

          {/* Languages */}
          {sections.languages.length > 0 && (
            <ShrineSection title="Languages">
              {sections.languages.map((lang) => (
                <div key={lang.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '9.5px' }}>
                  <span style={{ fontWeight: 500, textTransform: 'uppercase' }}>{lang.name}</span>
                  <span style={{ opacity: 0.7, textTransform: 'capitalize' }}>{lang.proficiency}</span>
                </div>
              ))}
            </ShrineSection>
          )}

          {/* Interests */}
          {sections.interests && sections.interests.length > 0 && (
            <ShrineSection title="Interests">
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                {sections.interests.map((i) => (
                  <span key={i.id} style={{ fontSize: '8.5px', padding: '3px 8px', backgroundColor: `${textDark}15`, color: textDark, fontWeight: 600, textTransform: 'uppercase' }}>
                    {i.name}
                  </span>
                ))}
              </div>
            </ShrineSection>
          )}

          {/* References */}
          {sections.references && sections.references.length > 0 && (
            <ShrineSection title="References">
              {sections.references.map((r) => (
                <div key={r.id} style={{ marginBottom: '10px', fontSize: '9px' }}>
                  <div style={{ fontWeight: 600, textTransform: 'uppercase' }}>{r.name}</div>
                  <div style={{ opacity: 0.8 }}>{r.title}{r.company ? `, ${r.company}` : ''}</div>
                  {(r.email || r.phone) && <div style={{ opacity: 0.7 }}>{[r.email, r.phone].filter(Boolean).join(' | ')}</div>}
                </div>
              ))}
            </ShrineSection>
          )}
        </div>
      </div>
    </div>
  );
}

function ShrineSection({ title, children }: { title: string; children: React.ReactNode }) {
  const textDark = '#442C2E';
  return (
    <div style={{ marginBottom: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
        <h2 style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em', color: textDark, margin: '0' }}>
          {title}
        </h2>
        <div style={{ flex: 1, height: '1.5px', backgroundColor: `${textDark}20` }} />
      </div>
      {children}
    </div>
  );
}
