import * as pdfjsLib from 'pdfjs-dist';
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import mammoth from 'mammoth';
import type { ResumeSections } from '../types';
import { defaultResumeSections } from './defaults';

// Configure PDF.js local worker via Vite URL import
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

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
 * Parse an uploaded file and return partially-filled ResumeSections.
 * Best-effort extraction — works well for single-column, text-based resumes.
 */
export async function parseFile(file: File): Promise<ResumeSections> {
  const type = detectFileType(file);
  if (!type) throw new Error(`Unsupported file type: "${file.name}". Please upload a .pdf, .docx, or .txt file.`);

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
    console.error('[FileParser] Extraction failed:', err);
    throw new Error(`Could not read text from "${file.name}". The file might be password-protected or scanned/image-based.`);
  }

  if (!rawText || rawText.trim().length === 0) {
    throw new Error(`No readable text found in "${file.name}". Please ensure it contains selectable text, or create from scratch.`);
  }

  return textToSections(rawText);
}

// ─── PDF Extraction ───────────────────────────────────────────────────────

async function extractTextFromPDF(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const pages: string[] = [];

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items
      .map((item) => ('str' in item ? item.str : ''))
      .join(' ');
    pages.push(pageText);
  }

  return pages.join('\n\n');
}

// ─── DOCX Extraction ─────────────────────────────────────────────────────

async function extractTextFromDOCX(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value;
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

function textToSections(rawText: string): ResumeSections {
  const sections = defaultResumeSections();
  const lines = rawText.split('\n').map((l) => l.trim()).filter(Boolean);

  if (lines.length === 0) return sections;

  // ── Extract personal info from first few lines ──
  const headerLines = lines.slice(0, 8);
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
    const normalized = line.toLowerCase().replace(/[^a-z\s]/g, '').trim();
    const sectionType = SECTION_HEADERS[normalized];

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
            (l) => l.length < 60 && !EMAIL_RE.test(l) && !PHONE_RE.test(l) && !URL_RE.test(l)
          );
          if (titleLine) sections.personalInfo.title = titleLine;
        }
        break;
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
