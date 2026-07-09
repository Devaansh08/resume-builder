// ─── User Types ───────────────────────────────────────────────────────────
export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
}

// ─── Resume Data Types ─────────────────────────────────────────────────────
export interface PersonalInfo {
  name: string;
  title: string;
  email: string;
  phone: string;
  address: string;
  linkedin: string;
  github: string;
  portfolio: string;
  website: string;
  photo?: string;
  summary: string;
}


export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  current: boolean;
  gpa: string;
  description: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  bullets: string[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  githubUrl: string;
  liveUrl: string;
  startDate: string;
  endDate: string;
  bullets: string[];
}

export interface Skill {
  id: string;
  category: string;
  items: string[];
  level?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
}

export interface Certificate {
  id: string;
  name: string;
  issuer: string;
  date: string;
  url: string;
  credentialId: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  date: string;
}

export interface Language {
  id: string;
  name: string;
  proficiency: 'basic' | 'conversational' | 'professional' | 'native';
}

export interface Interest {
  id: string;
  name: string;
}

export interface Reference {
  id: string;
  name: string;
  title: string;
  company: string;
  email: string;
  phone: string;
}

export interface CustomSection {
  id: string;
  title: string;
  items: CustomSectionItem[];
}

export interface CustomSectionItem {
  id: string;
  title: string;
  subtitle: string;
  date: string;
  description: string;
}

export interface ResumeSections {
  personalInfo: PersonalInfo;
  education: Education[];
  experience: Experience[];
  projects: Project[];
  skills: Skill[];
  certificates: Certificate[];
  achievements: Achievement[];
  languages: Language[];
  interests: Interest[];
  references: Reference[];
  customSections: CustomSection[];
}

// ─── Template Types ────────────────────────────────────────────────────────
export type TemplateId =
  | 'modern'
  | 'professional'
  | 'minimal'
  | 'google'
  | 'harvard'
  | 'stanford'
  | 'microsoft'
  | 'creative'
  | 'shrine'
  | 'executive';

export type ThemeMode = 'light' | 'dark' | 'system';

export interface ResumeTheme {
  primaryColor: string;
  fontFamily: string;
  fontSize: 'compact' | 'normal' | 'spacious';
  accentColor: string;
}

// ─── Resume Document ───────────────────────────────────────────────────────
export interface Resume {
  id: string;
  userId: string;
  title: string;
  template: TemplateId;
  theme: ResumeTheme;
  sections: ResumeSections;
  sectionOrder: string[];
  createdAt: string;
  updatedAt: string;
  isPublic?: boolean;
  shareId?: string;
}

// ─── ATS Types ────────────────────────────────────────────────────────────
export interface ATSCheck {
  id: string;
  label: string;
  description: string;
  passed: boolean;
  severity: 'error' | 'warning' | 'info';
  suggestion?: string;
  examples?: string[];
  rationale?: string;
}

export interface ATSResult {
  score: number;
  checks: ATSCheck[];
  keywordDensity: number;
  wordCount: number;
  actionVerbCount: number;
}

// ─── Section Metadata ──────────────────────────────────────────────────────
export interface SectionMeta {
  id: string;
  label: string;
  icon: string;
  enabled: boolean;
  required: boolean;
}

// ─── Version History ──────────────────────────────────────────────────────
export interface VersionEntry {
  id: string;
  savedAt: string;
  snapshot?: ResumeSections;
}
