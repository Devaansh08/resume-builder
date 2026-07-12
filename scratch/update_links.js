const fs = require('fs');
const path = require('path');

const templatesDir = path.join(__dirname, '../frontend/src/components/templates');
const files = fs.readdirSync(templatesDir).filter(f => f.endsWith('.tsx'));

for (const file of files) {
  const filePath = path.join(templatesDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // 1. Ensure formatUrl is imported
  if (!content.includes('formatUrl')) {
    content = content.replace(/import { formatDate } from '\.\.\/\.\.\/utils\/helpers';/, `import { formatDate, formatUrl } from '../../utils/helpers';`);
    if (!content.includes('formatUrl')) {
      // fallback if formatDate wasn't imported exact like that
      content = content.replace(/from '\.\.\/\.\.\/utils\/helpers';/, `, formatUrl } from '../../utils/helpers';`);
    }
    changed = true;
  }

  // 2. Replace social links spans if they haven't been replaced
  if (!content.includes('formatUrl(pi.linkedin)')) {
    // Replace standard span renderings for pi.linkedin, pi.github, pi.portfolio, pi.website
    content = content.replace(/\{pi\.linkedin && <span[^>]*>in \{pi\.linkedin\}<\/span>\}/g, `{pi.linkedin && <a href={formatUrl(pi.linkedin)} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'underline' }}>in {pi.linkedin}</a>}`);
    content = content.replace(/\{pi\.github && <span[^>]*>⌥ \{pi\.github\}<\/span>\}/g, `{pi.github && <a href={formatUrl(pi.github)} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'underline' }}>⌥ {pi.github}</a>}`);
    content = content.replace(/\{pi\.portfolio && <span[^>]*>🌐 \{pi\.portfolio\}<\/span>\}/g, `{pi.portfolio && <a href={formatUrl(pi.portfolio)} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'underline' }}>🌐 {pi.portfolio}</a>}`);
    content = content.replace(/\{pi\.website && <span[^>]*>🔗 \{pi\.website\}<\/span>\}/g, `{pi.website && <a href={formatUrl(pi.website)} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'underline' }}>🔗 {pi.website}</a>}`);
    changed = true;
  }

  // 3. Make sure projects liveUrl and githubUrl are rendered right after {proj.name}
  if (!content.includes('proj.liveUrl') && content.includes('{proj.name}')) {
    content = content.replace(/\{proj\.name\}(<\/span>|<\/div>)/g, `$1\n                    {proj.liveUrl && <a href={formatUrl(proj.liveUrl)} target="_blank" rel="noopener noreferrer" style={{ fontSize: '9px', textDecoration: 'underline', color: 'inherit', marginLeft: '6px' }}>↗ Live</a>}\n                    {proj.githubUrl && <a href={formatUrl(proj.githubUrl)} target="_blank" rel="noopener noreferrer" style={{ fontSize: '9px', textDecoration: 'underline', color: 'inherit', marginLeft: '6px' }}>⌥ Code</a>}`);
    changed = true;
  }

  // 4. Make sure certificates url is rendered right after {cert.name}
  if (!content.includes('cert.url') && content.includes('{cert.name}')) {
    content = content.replace(/\{cert\.name\}(<\/span>|<\/div>)/g, `$1\n                    {cert.url && <a href={formatUrl(cert.url)} target="_blank" rel="noopener noreferrer" style={{ fontSize: '9px', textDecoration: 'underline', color: 'inherit', marginLeft: '6px' }}>↗ Verify</a>}`);
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Updated:', file);
  }
}
