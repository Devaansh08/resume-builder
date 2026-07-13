import { useResumeStore } from '../../store/resumeStore';
import type { Resume } from '../../types';
import { formatDate, formatUrl } from '../../utils/helpers';
import { FONT_OPTIONS, getDensityConfig, type DensityConfig } from '../../utils/defaults';
import { RichText } from '../builder/RichText';

export function CreativeTemplate({ resume: propResume }: { resume?: Resume }) {
  const storeResume = useResumeStore((state) => propResume ? null : state.currentResume);
  const currentResume = propResume || storeResume;
  if (!currentResume) return null;

  const { sections, theme, sectionTitles } = currentResume;
  const titles = sectionTitles || {};
  const pi = sections.personalInfo;
  const primary = theme?.primaryColor || '#C41E3A';
  const accent = theme?.accentColor || '#1A1A3E';

  const fontObj = FONT_OPTIONS.find((f) => f.id === theme?.fontFamily);
  const fontStyle = fontObj ? fontObj.family : theme?.fontFamily || 'Plus Jakarta Sans, sans-serif';

  const density = getDensityConfig(theme);

  return (
    <div style={{ fontFamily: fontStyle, color: '#1a1a1a', display: 'grid', gridTemplateColumns: '220px 1fr', minHeight: '1123px', fontSize: density.fontSize, lineHeight: density.lineHeight }}>

      {/* ── Left Sidebar ──────────────────────────────────────────────── */}
      <div style={{ backgroundColor: primary, color: 'white', padding: density.pagePadding, display: 'flex', flexDirection: 'column', gap: density.sectionGap }}>

        {/* Photo */}
        {pi.photo && (
          <div style={{ textAlign: 'center' }}>
            <img
              src={pi.photo}
              alt={pi.name}
              style={{ width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover', border: '3px solid rgba(255,255,255,0.3)', margin: '0 auto' }}
            />
          </div>
        )}

        {/* Contact info */}
        <div>
          <CreativeSideHeading>Contact</CreativeSideHeading>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '9px', color: 'rgba(255,255,255,0.85)' }}>
            {pi.email && <div>✉ <a href={`mailto:${pi.email}`} style={{ color: 'inherit', textDecoration: 'underline' }}>{pi.email}</a></div>}
            {pi.phone && <div>📞 {pi.phone}</div>}
            {pi.address && <div>📍 {pi.address}</div>}
            {pi.linkedin && <div>in <a href={formatUrl(pi.linkedin)} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'underline' }}>{pi.linkedin}</a></div>}
            {pi.github && <div>⌥ <a href={formatUrl(pi.github)} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'underline' }}>{pi.github}</a></div>}
            {pi.portfolio && <div>🌐 <a href={formatUrl(pi.portfolio)} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'underline' }}>{pi.portfolio}</a></div>}
          </div>
        </div>

        {/* Skills Sidebar */}
        {sections.skills.length > 0 && (
          <div>
            <CreativeSideHeading>{titles.skills || "Skills"}</CreativeSideHeading>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {sections.skills.map((skill) => (
                <div key={skill.id}>
                  <div style={{ fontSize: '8.5px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(255,255,255,0.65)', marginBottom: '4px' }}>
                    {skill.category}
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                    {skill.items.map((item, i) => (
                      <span key={i} style={{ fontSize: '8.5px', backgroundColor: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.9)', borderRadius: '3px', padding: '2px 6px', border: '1px solid rgba(255,255,255,0.2)' }}>
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Languages */}
        {sections.languages.length > 0 && (
          <div>
            <CreativeSideHeading>{titles.languages || "Languages"}</CreativeSideHeading>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              {sections.languages.map((lang) => (
                <div key={lang.id} style={{ fontSize: '9px', color: 'rgba(255,255,255,0.85)' }}>
                  <span style={{ fontWeight: 600 }}>{lang.name}</span>
                  <span style={{ color: 'rgba(255,255,255,0.6)' }}> · {lang.proficiency}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Certifications Sidebar */}
        {sections.certificates.length > 0 && (
          <div>
            <CreativeSideHeading>{titles.certificates || "Certifications"}</CreativeSideHeading>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {sections.certificates.map((cert) => (
                <div key={cert.id} style={{ fontSize: '8.5px', color: 'rgba(255,255,255,0.85)' }}>
                  <div style={{ fontWeight: 600 }}></div>
                    {cert.url && <a href={formatUrl(cert.url)} target="_blank" rel="noopener noreferrer" style={{ fontSize: '9px', textDecoration: 'underline', color: 'inherit', marginLeft: '6px' }}>↗ Verify</a>}
                  {cert.issuer && <div style={{ color: 'rgba(255,255,255,0.6)' }}>{cert.issuer}</div>}
                  {cert.date && <div style={{ color: 'rgba(255,255,255,0.5)' }}>{cert.date}</div>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Interests */}
        {sections.interests.length > 0 && (
          <div>
            <CreativeSideHeading>{titles.interests || "Interests"}</CreativeSideHeading>
            <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.8)', lineHeight: '1.6' }}>
              {sections.interests.map((i) => i.name).join('  ·  ')}
            </div>
          </div>
        )}
      </div>

      {/* ── Right Main Content ─────────────────────────────────────────── */}
      <div style={{ backgroundColor: '#fff', padding: density.pagePadding }}>

        {/* Name + Title Header */}
        <div style={{ marginBottom: density.sectionGap, paddingBottom: '16px', borderBottom: `2px solid ${accent}` }}>
          <h1 style={{ fontSize: density.headerTitleSize, fontWeight: 800, color: accent, marginBottom: '4px', letterSpacing: '-0.02em' }}>
            {pi.name || 'Your Name'}
          </h1>
          {pi.title && (
            <p style={{ fontSize: density.subTitleSize, color: primary, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              {pi.title}
            </p>
          )}
        </div>

        {/* Summary */}
        {pi.summary && (
          <CreativeSection density={density} title={titles.summary || "About Me"} primary={primary} accent={accent}>
            <RichText content={pi.summary} style={{ color: '#374151', lineHeight: '1.7' }} />
          </CreativeSection>
        )}

        {/* Experience */}
        {sections.experience.length > 0 && (
          <CreativeSection density={density} title={titles.experience || "Work Experience"} primary={primary} accent={accent}>
            {sections.experience.map((exp) => (
              <div key={exp.id} style={{ marginBottom: '18px', paddingLeft: '14px', borderLeft: `3px solid ${primary}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '3px' }}>
                  <div>
                    <div style={{ fontWeight: 700, color: accent, fontSize: '11px' }}>{exp.position}</div>
                    <div style={{ color: '#666', fontSize: '10px', fontStyle: 'italic' }}>{exp.company}{exp.location ? `, ${exp.location}` : ''}</div>
                  </div>
                  <div style={{ fontSize: '9px', color: '#999', textAlign: 'right', flexShrink: 0 }}>
                    {formatDate(exp.startDate)} – {exp.current ? 'Present' : formatDate(exp.endDate)}
                  </div>
                </div>
                {exp.bullets.filter(Boolean).length > 0 && (
                  <ul style={{ listStyle: 'none', padding: 0, margin: '6px 0 0' }}>
                    {exp.bullets.filter(Boolean).map((b, i) => (
                      <li key={i} style={{ color: '#374151', paddingLeft: '12px', position: 'relative', marginBottom: '3px', lineHeight: '1.5' }}>
                        <span style={{ position: 'absolute', left: 0, color: primary, fontWeight: 700, fontSize: '12px', lineHeight: 1 }}>›</span>
                        <RichText content={b} />
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </CreativeSection>
        )}

        {/* Education */}
        {sections.education.length > 0 && (
          <CreativeSection density={density} title={titles.education || "Education"} primary={primary} accent={accent}>
            {sections.education.map((edu) => (
              <div key={edu.id} style={{ marginBottom: '14px', paddingLeft: '14px', borderLeft: `3px solid ${primary}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <div style={{ fontWeight: 700, color: accent, fontSize: '11px' }}>
                    {edu.degree}{edu.field ? ` in ${edu.field}` : ''}
                  </div>
                  <div style={{ fontSize: '9px', color: '#999' }}>
                    {formatDate(edu.startDate)} – {edu.current ? 'Present' : formatDate(edu.endDate)}
                  </div>
                </div>
                <div style={{ color: '#666', fontStyle: 'italic', fontSize: '10px' }}>
                  {edu.institution}{edu.gpa ? ` · GPA ${edu.gpa}` : ''}
                </div>
              </div>
            ))}
          </CreativeSection>
        )}

        {/* Projects */}
        {sections.projects.length > 0 && (
          <CreativeSection density={density} title={titles.projects || "Projects"} primary={primary} accent={accent}>
            {sections.projects.map((proj) => (
              <div key={proj.id} style={{ marginBottom: '14px', paddingLeft: '14px', borderLeft: `3px solid ${primary}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '3px' }}>
                  <span style={{ fontWeight: 700, color: accent }}></span>
                    {proj.liveUrl && <a href={formatUrl(proj.liveUrl)} target="_blank" rel="noopener noreferrer" style={{ fontSize: '9px', textDecoration: 'underline', color: 'inherit', marginLeft: '6px' }}>↗ Live</a>}
                    {proj.githubUrl && <a href={formatUrl(proj.githubUrl)} target="_blank" rel="noopener noreferrer" style={{ fontSize: '9px', textDecoration: 'underline', color: 'inherit', marginLeft: '6px' }}>⌥ Code</a>}
                  {proj.technologies.length > 0 && (
                    <span style={{ fontSize: '9px', color: '#999' }}>{proj.technologies.slice(0, 3).join(' · ')}</span>
                  )}
                </div>
                {proj.bullets.filter(Boolean).map((b, i) => (
                  <div key={i} style={{ color: '#374151', paddingLeft: '12px', position: 'relative', marginTop: '3px', lineHeight: '1.5' }}>
                    <span style={{ position: 'absolute', left: 0, color: primary, fontWeight: 700, fontSize: '12px', lineHeight: 1 }}>›</span>
                    <RichText content={b} />
                  </div>
                ))}
              </div>
            ))}
          </CreativeSection>
        )}

        {/* Achievements */}
        {sections.achievements.length > 0 && (
          <CreativeSection density={density} title={titles.achievements || "Achievements"} primary={primary} accent={accent}>
            {sections.achievements.map((ach) => (
              <div key={ach.id} style={{ marginBottom: '8px', display: 'flex', gap: '8px', alignItems: 'baseline' }}>
                <span style={{ color: primary, fontWeight: 700, fontSize: '14px', lineHeight: 1, flexShrink: 0 }}>★</span>
                <div>
                  <span style={{ fontWeight: 600, color: accent }}>{ach.title}</span>
                  {ach.description && <span style={{ color: '#555' }}> — {ach.description}</span>}
                </div>
              </div>
            ))}
          </CreativeSection>
        )}

        {/* Custom Sections */}
        {sections.customSections?.map((cs) =>
          cs.items?.length > 0 ? (
            <CreativeSection key={cs.id} density={density} title={cs.title} primary={primary} accent={accent}>
              {cs.items.map((item) => (
                <div key={item.id} style={{ marginBottom: '10px', paddingLeft: '14px', borderLeft: `3px solid ${primary}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: 600, color: accent }}>{item.title}{item.subtitle ? ` · ${item.subtitle}` : ''}</span>
                    {item.date && <span style={{ fontSize: '9px', color: '#999' }}>{item.date}</span>}
                  </div>
                  {item.description && <RichText content={item.description} style={{ color: '#374151', lineHeight: '1.5', marginTop: '3px' }} />}
                </div>
              ))}
            </CreativeSection>
          ) : null
        )}
      </div>
    </div>
  );
}

function CreativeSideHeading({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontSize: '8.5px',
      fontWeight: 700,
      textTransform: 'uppercase',
      letterSpacing: '0.12em',
      color: 'rgba(255,255,255,0.5)',
      marginBottom: '8px',
      paddingBottom: '4px',
      borderBottom: '1px solid rgba(255,255,255,0.2)',
    }}>
      {children}
    </div>
  );
}

function CreativeSection({
  title,
  primary,
  accent,
  density,
  children,
}: {
  title: string;
  primary: string;
  accent: string;
  density?: DensityConfig;
  children: React.ReactNode;
}) {
  const marginBottom = density?.sectionGap || '22px';
  const fontSize = density?.sectionTitleSize || '11px';
  return (
    <div style={{ marginBottom }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
        <span style={{ width: '20px', height: '3px', backgroundColor: primary, borderRadius: '2px', flexShrink: 0 }} />
        <h2 style={{
          fontSize,
          fontWeight: 800,
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          color: accent,
        }}>
          {title}
        </h2>
      </div>
      {children}
    </div>
  );
}
