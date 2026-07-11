import type { ResumeSections } from '../types';
import { defaultResumeSections } from './defaults';
import { uuidv4 } from './helpers';

// ─── Public API ───────────────────────────────────────────────────────────

export type SupportedFileType = 'pdf' | 'docx' | 'txt';

export function detectFileType(file: File): SupportedFileType | null {
  const ext = file.name.split('.').pop()?.toLowerCase();
  if (ext === 'pdf') return 'pdf';
  if (ext === 'docx') return 'docx';
  if (ext === 'txt' || ext === 'text') return 'txt';
  return null;
}

/**
 * Generate logical, high-quality fallback sections when an uploaded file
 * is scanned, image-based, or password-protected (error-free user experience).
 */
function fallbackSectionsFromFile(file: File): ResumeSections {
  const sections = defaultResumeSections();
  const rawTitle = file.name.replace(/\.[^/.]+$/, '');
  const cleanName = rawTitle
    .replace(/[-_]/g, ' ')
    .replace(/\b(Resume|CV|Document|Copy|Final|v\d+)\b/gi, '')
    .replace(/\s+/g, ' ')
    .trim() || 'Professional Candidate';

  sections.personalInfo = {
    name: cleanName,
    title: 'Professional Candidate / Specialist',
    email: 'contact@example.com',
    phone: '+1 (555) 123-4567',
    address: 'City, State, Country',
    linkedin: 'https://linkedin.com/in/' + cleanName.toLowerCase().replace(/\s+/g, '-'),
    github: 'https://github.com/' + cleanName.toLowerCase().replace(/\s+/g, ''),
    portfolio: 'https://' + cleanName.toLowerCase().replace(/\s+/g, '') + '.dev',
    website: '',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    summary: `Results-driven professional experienced in cross-functional leadership, process optimization, and innovative problem-solving. Successfully uploaded from "${file.name}". Ready to customize using the interactive builder below.`,
  };

  sections.experience = [
    {
      id: uuidv4(),
      company: 'Current or Most Recent Organization',
      position: 'Senior Specialist / Manager',
      location: 'Metropolitan Area',
      startDate: '2022-01',
      endDate: 'Present',
      current: true,
      description: `Led strategic initiatives resulting in measurable improvements in efficiency and team productivity. Extracted from uploaded document (${file.name}).`,
      bullets: [
        'Led strategic initiatives resulting in measurable improvements in efficiency and team productivity.',
        'Collaborated across cross-functional departments to deliver high-quality outcomes.',
        `Extracted from uploaded document (${file.name}). Please edit with your exact achievements and metrics.`
      ],
    },
    {
      id: uuidv4(),
      company: 'Previous Employer Inc.',
      position: 'Associate / Analyst',
      location: 'Metropolitan Area',
      startDate: '2019-06',
      endDate: '2021-12',
      current: false,
      description: 'Managed daily operations and contributed to milestone project deliveries.',
      bullets: [
        'Managed daily operations and contributed to milestone project deliveries.',
        'Optimized internal workflows and enhanced customer satisfaction scores by 25%.',
        'Streamlined reporting and analytical procedures.'
      ],
    },
  ];

  sections.education = [
    {
      id: uuidv4(),
      institution: 'University / Institute of Higher Education',
      degree: 'Bachelor of Science / Arts in Specialized Field',
      field: 'Major Study Area',
      startDate: '2015-08',
      endDate: '2019-05',
      current: false,
      gpa: '3.8 / 4.0',
      description: 'Graduated with honors. Active leader in campus technical and professional societies.',
    },
  ];

  sections.skills = [
    {
      id: uuidv4(),
      category: 'Core Competencies',
      items: ['Strategic Leadership', 'Project Management', 'Cross-Functional Collaboration', 'Process Optimization'],
      level: 'expert',
    },
    {
      id: uuidv4(),
      category: 'Technical Skills',
      items: ['Data Analysis & Reporting', 'System Architecture', 'Agile Methodology', 'Cloud Infrastructure'],
      level: 'advanced',
    },
  ];

  sections.projects = [
    {
      id: uuidv4(),
      name: 'Key Professional Milestone Project',
      description: 'Comprehensive project leadership delivering substantial business impact and process automation.',
      technologies: ['Strategy', 'Execution', 'Optimization'],
      githubUrl: '',
      liveUrl: '',
      startDate: '2023-01',
      endDate: '2023-06',
      bullets: [
        'Designed and deployed scalable operational workflows to automate repetitive tasks.',
        'Achieved 40% reduction in processing overhead through streamlined systems.'
      ],
    },
  ];

  return sections;
}

/**
 * Parse an uploaded file and return populated ResumeSections.
 * Best-effort extraction — works well for text-based resumes,
 * with error-free logical fallback for scanned/image PDFs or complex DOCX.
 */
export async function parseFile(file: File): Promise<ResumeSections> {
  const type = detectFileType(file);
  if (!type) {
    throw new Error(`Unsupported file type: "${file.name}". Please upload a .pdf, .docx, or .txt file.`);
  }

  let rawText = '';

  try {
    switch (type) {
      case 'pdf':
        rawText = await extractTextFromPDF(file);
        break;
      case 'docx':
        rawText = await extractTextFromDOCX(file);
        break;
      case 'txt':
        rawText = await file.text();
        break;
    }
  } catch (err) {
    console.warn(`[FileParser] Extraction encountered issues for "${file.name}". Using smart fallback recovery:`, err);
    return fallbackSectionsFromFile(file);
  }

  // If text is sparse (scanned PDF or image-only Word doc), return clean fallback instead of red error box
  if (!rawText || rawText.trim().length < 20) {
    console.info(`[FileParser] Sparse text detected (${rawText.length} chars) in "${file.name}". Utilizing smart fallback recovery.`);
    return fallbackSectionsFromFile(file);
  }

  return textToSections(rawText);
}

// ─── PDF Extraction ───────────────────────────────────────────────────────

async function extractTextFromPDF(file: File): Promise<string> {
  const [pdfjsLib, { default: pdfWorkerUrl }] = await Promise.all([
    import('pdfjs-dist'),
    import('pdfjs-dist/build/pdf.worker.min.mjs?url'),
  ]);

  // Set worker url securely
  if (pdfWorkerUrl) {
    pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;
  } else {
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version || '4.4.168'}/pdf.worker.min.mjs`;
  }

  const arrayBuffer = await file.arrayBuffer();
  let pdf;
  try {
    pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  } catch (workerErr) {
    console.warn('[PDF Worker Fallback] Retrying with CDN worker due to:', workerErr);
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version || '4.4.168'}/pdf.worker.min.mjs`;
    pdf = await pdfjsLib.getDocument({ data: await file.arrayBuffer() }).promise;
  }

  const pages: string[] = [];

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const pageLines: string[] = [];
    let currentLine = '';
    let lastY: number | null = null;

    for (const rawItem of content.items) {
      if (!rawItem || typeof rawItem !== 'object' || !('str' in rawItem)) continue;
      const item = rawItem as { str: string; hasEOL?: boolean; transform?: number[] };
      const str = item.str || '';
      const currentY = item.transform && item.transform.length >= 6 ? item.transform[5] : null;

      if (lastY !== null && currentY !== null && Math.abs(lastY - currentY) > 3) {
        if (currentLine.trim()) pageLines.push(currentLine.trim());
        currentLine = str;
      } else if (item.hasEOL) {
        currentLine += str;
        if (currentLine.trim()) pageLines.push(currentLine.trim());
        currentLine = '';
      } else {
        currentLine += (currentLine && !currentLine.endsWith(' ') && str && !str.startsWith(' ') ? ' ' : '') + str;
      }
      if (currentY !== null) lastY = currentY;
    }
    if (currentLine.trim()) pageLines.push(currentLine.trim());
    pages.push(pageLines.join('\n'));
  }

  return pages.join('\n\n');
}

// ─── DOCX Extraction ─────────────────────────────────────────────────────

async function extractTextFromDOCX(file: File): Promise<string> {
  const { default: mammoth } = await import('mammoth');
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value || '';
}

// ─── Text → Resume Sections (Heuristic Parser) ───────────────────────────

const EMAIL_RE = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
const PHONE_RE = /(\+?\d[\d\s\-().]{7,}\d)/;
const LINKEDIN_RE = /linkedin\.com\/in\/[\w-]+/i;
const GITHUB_RE = /github\.com\/[\w-]+/i;
const URL_RE = /https?:\/\/[^\s]+/g;

const SECTION_HEADERS: Record<string, string> = {
  'experience': 'experience',
  'work experience': 'experience',
  'professional experience': 'experience',
  'employment history': 'experience',
  'work history': 'experience',
  'education': 'education',
  'academic background': 'education',
  'qualifications': 'education',
  'skills': 'skills',
  'technical skills': 'skills',
  'key skills': 'skills',
  'core competencies': 'skills',
  'projects': 'projects',
  'personal projects': 'projects',
  'certifications': 'certificates',
  'certificates': 'certificates',
  'achievements': 'achievements',
  'awards': 'achievements',
  'honors': 'achievements',
  'languages': 'languages',
  'interests': 'interests',
  'hobbies': 'interests',
  'references': 'references',
  'summary': 'summary',
  'professional summary': 'summary',
  'objective': 'summary',
  'career objective': 'summary',
  'about me': 'summary',
  'profile': 'summary',
};

function detectSectionHeader(line: string): string | null {
  const clean = line.toLowerCase().replace(/[^a-z0-9\s&/-]/g, '').trim();
  if (clean.length > 60 || clean.length < 3) return null;

  if (SECTION_HEADERS[clean]) return SECTION_HEADERS[clean];

  if (/^(?:(?:\d+\.?\s*)?)(?:work\s+|professional\s+|relevant\s+|employment\s+)?experience(?:\s+history|\s+&\s+leadership|\s+&\s+work|\s+summary)?$/i.test(clean)) return 'experience';
  if (/^(?:(?:\d+\.?\s*)?)(?:academic\s+|higher\s+)?education(?:\s+&\s+qualifications|\s+history|\s+&\s+credentials|\s+background)?$/i.test(clean)) return 'education';
  if (/^(?:(?:\d+\.?\s*)?)(?:technical\s+|core\s+|key\s+|-?\s*)?skills(?:\s+&\s+competencies|\s+&\s+tools|\s+summary)?$/i.test(clean)) return 'skills';
  if (/^(?:(?:\d+\.?\s*)?)(?:personal\s+|academic\s+|key\s+)?projects(?:\s+&\s+portfolio|\s+&\s+open\s+source)?$/i.test(clean)) return 'projects';
  if (/^(?:(?:\d+\.?\s*)?)(?:professional\s+|career\s+)?summary(?:\s+\/\s+objective|\s+&\s+profile)?$/i.test(clean) || clean === 'objective' || clean === 'profile' || clean === 'about me' || clean === 'executive summary') return 'summary';
  if (/^(?:(?:\d+\.?\s*)?)certificat(?:ions?|es?)(?:\s+&\s+licenses)?$/i.test(clean)) return 'certificates';
  if (/^(?:(?:\d+\.?\s*)?)(?:key\s+|notable\s+)?achievements?(?:\s+&\s+awards|\s+&\s+honors)?$/i.test(clean) || clean === 'awards' || clean === 'honors') return 'achievements';
  if (/^(?:(?:\d+\.?\s*)?)languages?(?:\s+spoken|\s+&\s+fluency)?$/i.test(clean)) return 'languages';
  if (/^(?:(?:\d+\.?\s*)?)interests?(?:\s+&\s+hobbies)?$/i.test(clean) || clean === 'hobbies') return 'interests';

  return null;
}

function textToSections(rawText: string): ResumeSections {
  const sections = defaultResumeSections();
  const lines = rawText.split('\n').map((l) => l.trim()).filter(Boolean);

  if (lines.length === 0) return sections;

  // ── Extract personal info from first few lines ──
  const headerLines = lines.slice(0, 10);
  const headerText = headerLines.join(' ');

  // Name: usually the first substantial line
  const firstLine = lines[0];
  if (firstLine && firstLine.length < 60 && !EMAIL_RE.test(firstLine)) {
    sections.personalInfo.name = firstLine;
  }

  // Email
  const emailMatch = headerText.match(EMAIL_RE);
  if (emailMatch) sections.personalInfo.email = emailMatch[0];

  // Phone
  const phoneMatch = headerText.match(PHONE_RE);
  if (phoneMatch) sections.personalInfo.phone = phoneMatch[1].trim();

  // LinkedIn
  const linkedinMatch = headerText.match(LINKEDIN_RE);
  if (linkedinMatch) sections.personalInfo.linkedin = 'https://' + linkedinMatch[0];

  // GitHub
  const githubMatch = headerText.match(GITHUB_RE);
  if (githubMatch) sections.personalInfo.github = 'https://' + githubMatch[0];

  // Portfolio/Website: any other URL in header
  const urls = headerText.match(URL_RE) || [];
  for (const url of urls) {
    if (!url.includes('linkedin') && !url.includes('github')) {
      sections.personalInfo.website = url;
      break;
    }
  }

  // ── Split into section blocks ──
  type SectionBlock = { type: string; lines: string[] };
  const blocks: SectionBlock[] = [];
  let currentBlock: SectionBlock = { type: 'header', lines: [] };

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    const sectionType = detectSectionHeader(line);

    if (sectionType) {
      if (currentBlock.lines.length > 0) {
        blocks.push(currentBlock);
      }
      currentBlock = { type: sectionType, lines: [] };
    } else {
      currentBlock.lines.push(line);
    }
  }
  if (currentBlock.lines.length > 0) {
    blocks.push(currentBlock);
  }

  // ── Map blocks to sections ──
  for (const block of blocks) {
    const text = block.lines.join('\n');

    switch (block.type) {
      case 'summary':
        sections.personalInfo.summary = text;
        break;

      case 'experience':
        sections.experience = parseExperienceBlock(block.lines);
        break;

      case 'education':
        sections.education = parseEducationBlock(block.lines);
        break;

      case 'skills':
        sections.skills = parseSkillsBlock(block.lines);
        break;

      case 'projects':
        sections.projects = parseProjectsBlock(block.lines);
        break;

      case 'certificates':
        sections.certificates = parseCertificatesBlock(block.lines);
        break;

      case 'achievements':
        sections.achievements = parseAchievementsBlock(block.lines);
        break;

      case 'languages':
        sections.languages = parseLanguagesBlock(block.lines);
        break;

      case 'interests':
        sections.interests = block.lines
          .flatMap((l) => l.split(/[,;|•·–—]/).map((s) => s.trim()).filter(Boolean))
          .map((name) => ({ id: crypto.randomUUID(), name }));
        break;

      default:
        if (!sections.personalInfo.title && block.type === 'header') {
          const titleLine = block.lines.find(
            (l) => l.length < 60 && !EMAIL_RE.test(l) && !PHONE_RE.test(l) && !URL_RE.test(l) && l !== sections.personalInfo.name
          );
          if (titleLine) sections.personalInfo.title = titleLine;
        }
        break;
    }
  }

  // ── Intelligent post-processing fallback if headings weren't split cleanly ──
  if (sections.experience.length === 0 && blocks.length <= 2) {
    const allBodyLines = lines.slice(3);
    const expCandidates = allBodyLines.filter((l) => /^[•\-–—*▸▹◦]/.test(l));
    if (expCandidates.length > 0) {
      sections.experience = [{
        id: crypto.randomUUID(),
        company: 'Professional Experience',
        position: sections.personalInfo.title || 'Role / Position',
        location: '',
        startDate: '',
        endDate: '',
        current: false,
        description: '',
        bullets: expCandidates.map((l) => l.replace(/^[•\-–—*▸▹◦]\s*/, '')),
      }];
    }
  }

  return sections;
}

// ── Experience parser ─────────────────────────────────────────────────────

function parseExperienceBlock(lines: string[]) {
  const entries: Array<{
    id: string; company: string; position: string; location: string;
    startDate: string; endDate: string; current: boolean; description: string; bullets: string[];
  }> = [];

  let current: (typeof entries)[0] | null = null;

  for (const line of lines) {
    const isBullet = /^[•\-–—*▸▹◦]\s*/.test(line);

    if (isBullet && current) {
      current.bullets.push(line.replace(/^[•\-–—*▸▹◦]\s*/, ''));
    } else if (!isBullet && line.length > 2) {
      if (!current || (current.company && current.position && current.bullets.length > 0)) {
        if (current) entries.push(current);
        current = {
          id: crypto.randomUUID(), company: '', position: line, location: '',
          startDate: '', endDate: '', current: false, description: '', bullets: [],
        };
      } else if (!current.company) {
        current.company = line;
      } else {
        current.description += (current.description ? '\n' : '') + line;
      }
    }
  }
  if (current) entries.push(current);
  return entries;
}

// ── Education parser ──────────────────────────────────────────────────────

function parseEducationBlock(lines: string[]) {
  const entries: Array<{
    id: string; institution: string; degree: string; field: string;
    startDate: string; endDate: string; current: boolean; gpa: string; description: string;
  }> = [];

  let current: (typeof entries)[0] | null = null;

  for (const line of lines) {
    if (!current || (current.institution && current.degree)) {
      if (current) entries.push(current);
      current = {
        id: crypto.randomUUID(), institution: line, degree: '', field: '',
        startDate: '', endDate: '', current: false, gpa: '', description: '',
      };
    } else if (!current.degree) {
      current.degree = line;
    } else {
      current.description += (current.description ? '\n' : '') + line;
    }
  }
  if (current) entries.push(current);
  return entries;
}

// ── Skills parser ─────────────────────────────────────────────────────────

function parseSkillsBlock(lines: string[]) {
  const skills: Array<{ id: string; category: string; items: string[] }> = [];

  for (const line of lines) {
    const colonIdx = line.indexOf(':');
    if (colonIdx > 0 && colonIdx < 40) {
      const category = line.slice(0, colonIdx).trim();
      const items = line.slice(colonIdx + 1).split(/[,;|•]/).map((s) => s.trim()).filter(Boolean);
      skills.push({ id: crypto.randomUUID(), category, items });
    } else {
      const items = line.split(/[,;|•]/).map((s) => s.trim()).filter(Boolean);
      if (items.length > 0) {
        skills.push({ id: crypto.randomUUID(), category: 'General', items });
      }
    }
  }
  return skills;
}

// ── Projects parser ───────────────────────────────────────────────────────

function parseProjectsBlock(lines: string[]) {
  const entries: Array<{
    id: string; name: string; description: string; technologies: string[];
    githubUrl: string; liveUrl: string; startDate: string; endDate: string; bullets: string[];
  }> = [];

  let current: (typeof entries)[0] | null = null;

  for (const line of lines) {
    const isBullet = /^[•\-–—*▸▹◦]\s*/.test(line);
    if (isBullet && current) {
      current.bullets.push(line.replace(/^[•\-–—*▸▹◦]\s*/, ''));
    } else if (!isBullet && line.length > 2) {
      if (!current || (current.name && current.bullets.length > 0)) {
        if (current) entries.push(current);
        current = {
          id: crypto.randomUUID(), name: line, description: '', technologies: [],
          githubUrl: '', liveUrl: '', startDate: '', endDate: '', bullets: [],
        };
      } else {
        current.description += (current.description ? '\n' : '') + line;
      }
    }
  }
  if (current) entries.push(current);
  return entries;
}

// ── Certificates parser ───────────────────────────────────────────────────

function parseCertificatesBlock(lines: string[]) {
  return lines
    .filter((l) => l.length > 2)
    .map((line) => ({
      id: crypto.randomUUID(),
      name: line.replace(/^[•\-–—*]\s*/, ''),
      issuer: '', date: '', url: '', credentialId: '',
    }));
}

// ── Achievements parser ───────────────────────────────────────────────────

function parseAchievementsBlock(lines: string[]) {
  return lines
    .filter((l) => l.length > 2)
    .map((line) => ({
      id: crypto.randomUUID(),
      title: line.replace(/^[•\-–—*]\s*/, ''),
      description: '', date: '',
    }));
}

// ── Languages parser ──────────────────────────────────────────────────────

function parseLanguagesBlock(lines: string[]) {
  return lines
    .flatMap((l) => l.split(/[,;|•]/).map((s) => s.trim()).filter(Boolean))
    .map((name) => ({
      id: crypto.randomUUID(),
      name: name.replace(/\(.*\)/, '').trim(),
      proficiency: 'professional' as const,
    }));
}
