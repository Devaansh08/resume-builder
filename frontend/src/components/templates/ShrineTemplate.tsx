import { useResumeStore } from '../../store/resumeStore';
import type { Resume } from '../../types';
import { formatDate, formatUrl } from '../../utils/helpers';
import { FONT_OPTIONS, getDensityConfig, type DensityConfig } from '../../utils/defaults';
import { RichText } from '../builder/RichText';

export function ShrineTemplate({ resume: propResume }: { resume?: Resume }) {
  const storeResume = useResumeStore((state) => propResume ? null : state.currentResume);
  const currentResume = propResume || storeResume;
  if (!currentResume) return null;

  const { sections, theme, sectionTitles } = currentResume;
  const titles = sectionTitles || {};
  const pi = sections.personalInfo;

  // Material Design Shrine Color Palette
  const bgSoft = '#FEEAE6'; // Secondary 50 (Very light pink)
  const bgHeader = '#FEDBD0'; // Primary 100 (Peach pink)
  const textDark = '#442C2E'; // Primary 900 (Deep brown)
  const primaryColor = theme.primaryColor || '#442C2E';

  const fontObj = FONT_OPTIONS.find((f) => f.id === theme?.fontFamily);
  const fontStyle = fontObj ? fontObj.family : 'Plus Jakarta Sans, system-ui, sans-serif';

  const density = getDensityConfig(theme);

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
        fontSize: density.fontSize,
        lineHeight: density.lineHeight,
      }}
    >
      {/* ── Asymmetric Header Block ──────────────────────────────────────── */}
      <div style={{ backgroundColor: bgHeader, padding: '40px 50px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '32px', borderBottom: `2px solid ${textDark}` }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '-0.02em', margin: '0 0 6px 0', color: textDark }}>
            {pi.name || 'Your Name'}
          </h1>
          {pi.title && (
            <div style={{ fontSize: '13px', fontWeight: 600, color: primaryColor, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '14px' }}>
              {pi.title}
            </div>
          )}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', fontSize: '9.5px', color: textDark, opacity: 0.85, fontWeight: 500 }}>
            {pi.email && <span>✉ {pi.email}</span>}
            {pi.phone && <span>📞 {pi.phone}</span>}
            {pi.address && <span>📍 {pi.address}</span>}
            {pi.linkedin && <a href={formatUrl(pi.linkedin)} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'underline' }}>in {pi.linkedin}</a>}
            {pi.github && <a href={formatUrl(pi.github)} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'underline' }}>⌥ {pi.github}</a>}
            {pi.portfolio && <a href={formatUrl(pi.portfolio)} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'underline' }}>🌐 {pi.portfolio}</a>}
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
              <div style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em', color: textDark, marginBottom: '8px' }}>
                {titles.summary || "Summary"}
              </div>
              <div style={{ fontSize: '10px', color: textDark, opacity: 0.85, lineHeight: '1.7', padding: '16px', backgroundColor: `${primaryColor}08`, borderRadius: '8px' }}>
                <RichText content={pi.summary} />
              </div>
            </div>
          )}

          {/* Work Experience */}
          {sections.experience.length > 0 && (
            <ShrineSection density={density} title={titles.experience || "Experience"}>
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
                          <span style={{ position: 'absolute', left: -14, color: primaryColor }}>▹</span>
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
            <ShrineSection density={density} title={titles.projects || "Projects"}>
              {sections.projects.map((proj) => (
                <div key={proj.id} style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '2px' }}>
                    <span style={{ fontWeight: 600, fontSize: '10.5px', textTransform: 'uppercase' }}></span>
                    {proj.liveUrl && <a href={formatUrl(proj.liveUrl)} target="_blank" rel="noopener noreferrer" style={{ fontSize: '9px', textDecoration: 'underline', color: 'inherit', marginLeft: '6px' }}>↗ Live</a>}
                    {proj.githubUrl && <a href={formatUrl(proj.githubUrl)} target="_blank" rel="noopener noreferrer" style={{ fontSize: '9px', textDecoration: 'underline', color: 'inherit', marginLeft: '6px' }}>⌥ Code</a>}
                    {proj.technologies.length > 0 && (
                      <span style={{ fontSize: '8.5px', opacity: 0.8 }}>{proj.technologies.slice(0, 3).join(' · ')}</span>
                    )}
                  </div>
                  <ul style={{ paddingLeft: '12px', margin: '0', listStyleType: 'none' }}>
                    {proj.bullets.filter(Boolean).map((b, i) => (
                      <li key={i} style={{ marginBottom: '3px', position: 'relative', paddingLeft: '12px' }}>
                        <span style={{ position: 'absolute', left: 0, color: primaryColor }}>▹</span>
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
              <ShrineSection key={cs.id} density={density} title={cs.title}>
                {cs.items.map((item) => (
                  <div key={item.id} style={{ marginBottom: '14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <span style={{ fontWeight: 600, fontSize: '10.5px', textTransform: 'uppercase' }}>{item.title}</span>
                      {item.date && <span style={{ fontSize: '8.5px', opacity: 0.8 }}>{item.date}</span>}
                    </div>
                    {item.subtitle && <div style={{ fontSize: '10px', color: primaryColor, fontWeight: 500 }}>{item.subtitle}</div>}
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
            <ShrineSection density={density} title={titles.skills || "Skills"}>
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
            <ShrineSection density={density} title={titles.education || "Education"}>
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
            <ShrineSection density={density} title={titles.certificates || "Certifications"}>
              {sections.certificates.map((cert) => (
                <div key={cert.id} style={{ marginBottom: '10px' }}>
                  <div style={{ fontWeight: 600, fontSize: '9.5px', textTransform: 'uppercase' }}></div>
                    {cert.url && <a href={formatUrl(cert.url)} target="_blank" rel="noopener noreferrer" style={{ fontSize: '9px', textDecoration: 'underline', color: 'inherit', marginLeft: '6px' }}>↗ Verify</a>}
                  <div style={{ fontSize: '8.5px', opacity: 0.8 }}>{cert.issuer}</div>
                </div>
              ))}
            </ShrineSection>
          )}

          {/* Languages */}
          {sections.languages.length > 0 && (
            <ShrineSection density={density} title={titles.languages || "Languages"}>
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
            <ShrineSection density={density} title={titles.interests || "Interests"}>
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
            <ShrineSection density={density} title={titles.references || "References"}>
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

function ShrineSection({ title, density, children }: { title: string; density?: DensityConfig; children: React.ReactNode }) {
  const textDark = '#442C2E';
  const marginBottom = density?.sectionGap || '24px';
  const fontSize = density?.sectionTitleSize || '10px';
  return (
    <div style={{ marginBottom }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
        <h2 style={{ fontSize, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em', color: textDark, margin: '0' }}>
          {title}
        </h2>
        <div style={{ flex: 1, height: '1.5px', backgroundColor: `${textDark}20` }} />
      </div>
      {children}
    </div>
  );
}
