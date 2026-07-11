import type { ResumeSections, ResumeTheme } from '../types';
import { uuidv4 } from './helpers';
export { uuidv4 };

export const FONT_OPTIONS = [
  { id: 'Calibri', name: 'Calibri (MS Word Default)', family: 'Calibri, "Segoe UI", sans-serif' },
  { id: 'Inter', name: 'Inter (Modern Sans)', family: 'Inter, sans-serif' },
  { id: 'Arial', name: 'Arial (Clean Universal)', family: 'Arial, Helvetica, sans-serif' },
  { id: 'Times New Roman', name: 'Times New Roman (Classic)', family: '"Times New Roman", Times, serif' },
  { id: 'Garamond', name: 'Garamond (Traditional)', family: 'Garamond, "Hoefler Text", serif' },
  { id: 'Georgia', name: 'Georgia (Elegant Serif)', family: 'Georgia, serif' },
  { id: 'Montserrat', name: 'Montserrat (Geometric)', family: 'Montserrat, sans-serif' },
  { id: 'Lato', name: 'Lato (Humanist Tech)', family: 'Lato, sans-serif' },
  { id: 'Open Sans', name: 'Open Sans (Versatile)', family: '"Open Sans", sans-serif' },
  { id: 'Outfit', name: 'Outfit (Sleek Modern)', family: 'Outfit, sans-serif' },
  { id: 'Plus Jakarta Sans', name: 'Jakarta (Clean Tech)', family: '"Plus Jakarta Sans", sans-serif' },
  { id: 'Roboto', name: 'Roboto (Standard Sans)', family: 'Roboto, sans-serif' },
  { id: 'Merriweather', name: 'Merriweather (Executive)', family: 'Merriweather, serif' },
  { id: 'Playfair Display', name: 'Playfair (Prestige Serif)', family: '"Playfair Display", serif' },
  { id: 'Lora', name: 'Lora (Editorial Serif)', family: 'Lora, serif' },
  { id: 'Fira Code', name: 'Fira Code (Monospace)', family: '"Fira Code", monospace' },
];

export const defaultTheme: ResumeTheme = {
  primaryColor: '#3b5bff',
  accentColor: '#7c3aed',
  fontFamily: 'Inter',
  fontSize: 'normal',
};

export const defaultResumeSections = (): ResumeSections => ({
  personalInfo: {
    name: '',
    title: '',
    email: '',
    phone: '',
    address: '',
    linkedin: '',
    github: '',
    portfolio: '',
    website: '',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    summary: '',
  },
  education: [],
  experience: [],
  projects: [],
  skills: [],
  certificates: [],
  achievements: [],
  languages: [],
  interests: [],
  references: [],
  customSections: [],
});

export const sectionLabels: Record<string, string> = {
  personalInfo: 'Personal Info',
  experience: 'Experience',
  education: 'Education',
  projects: 'Projects',
  skills: 'Skills',
  certificates: 'Certifications',
  achievements: 'Achievements',
  languages: 'Languages',
  interests: 'Interests',
  references: 'References',
};

export const sectionIcons: Record<string, string> = {
  personalInfo: 'User',
  experience: 'Briefcase',
  education: 'GraduationCap',
  projects: 'Code',
  skills: 'Zap',
  certificates: 'Award',
  achievements: 'Trophy',
  languages: 'Globe',
  interests: 'Heart',
  references: 'Users',
};

export const newEducation = () => ({
  id: uuidv4(),
  institution: '',
  degree: '',
  field: '',
  startDate: '',
  endDate: '',
  current: false,
  gpa: '',
  description: '',
});

export const newExperience = () => ({
  id: uuidv4(),
  company: '',
  position: '',
  location: '',
  startDate: '',
  endDate: '',
  current: false,
  description: '',
  bullets: [''],
});

export const newProject = () => ({
  id: uuidv4(),
  name: '',
  description: '',
  technologies: [],
  githubUrl: '',
  liveUrl: '',
  startDate: '',
  endDate: '',
  bullets: [''],
});

export const newSkill = () => ({
  id: uuidv4(),
  category: '',
  items: [],
});

export const newCertificate = () => ({
  id: uuidv4(),
  name: '',
  issuer: '',
  date: '',
  url: '',
  credentialId: '',
});

export const newInterest = () => ({
  id: uuidv4(),
  name: '',
});

export const newReference = () => ({
  id: uuidv4(),
  name: '',
  title: '',
  company: '',
  email: '',
  phone: '',
});

export const newCustomSectionItem = () => ({
  id: uuidv4(),
  title: '',
  subtitle: '',
  date: '',
  description: '',
});

export const newCustomSection = (title = 'Custom Section') => ({
  id: uuidv4(),
  title,
  items: [newCustomSectionItem()],
});

export const defaultSectionTitles: Record<string, string> = {
  personalInfo: 'Personal Info',
  summary: 'Professional Summary',
  experience: 'Work Experience',
  education: 'Education',
  projects: 'Featured Projects',
  skills: 'Skills & Expertise',
  certificates: 'Certifications',
  achievements: 'Key Achievements',
  languages: 'Languages',
  interests: 'Interests & Hobbies',
  references: 'References',
};

export const COLOR_PALETTES = [
  { label: 'Red & Dark Gradient', primary: '#991b1b', accent: '#18181b', bg: 'bg-red-900' },
  { label: 'Marginalia Ink & Red', primary: '#1E293B', accent: '#DC2626', bg: 'bg-slate-900' },
  { label: 'Indigo Blue', primary: '#3b5bff', accent: '#7c3aed', bg: 'bg-blue-500' },
  { label: 'Emerald Green', primary: '#10b981', accent: '#059669', bg: 'bg-emerald-500' },
  { label: 'Slate Executive', primary: '#1e293b', accent: '#475569', bg: 'bg-slate-800' },
  { label: 'Cyberpunk Neon', primary: '#06b6d4', accent: '#a855f7', bg: 'bg-cyan-500' },
  { label: 'Sunset Rose', primary: '#f43f5e', accent: '#fb923c', bg: 'bg-rose-500' },
  { label: 'Midnight Azure', primary: '#1d4ed8', accent: '#38bdf8', bg: 'bg-blue-700' },
  { label: 'Amethyst Purple', primary: '#8b5cf6', accent: '#ec4899', bg: 'bg-purple-600' },
  { label: 'Amber Gold', primary: '#d97706', accent: '#b45309', bg: 'bg-amber-600' },
  { label: 'Nordic Ice', primary: '#0284c7', accent: '#0d9488', bg: 'bg-sky-600' },
  { label: 'Crimson Indigo', primary: '#be123c', accent: '#4f46e5', bg: 'bg-rose-700' },
  { label: 'Monochrome Prestige', primary: '#18181b', accent: '#52525b', bg: 'bg-zinc-900' },
  { label: 'Royal Sapphire', primary: '#2563eb', accent: '#4338ca', bg: 'bg-indigo-600' },
  { label: 'Forest Pine', primary: '#15803d', accent: '#047857', bg: 'bg-green-700' },
  { label: 'Obsidian & Gold', primary: '#27272a', accent: '#eab308', bg: 'bg-yellow-600' },
  { label: 'Shrine Peach', primary: '#442C2E', accent: '#FEDBD0', bg: 'bg-stone-800' },
  { label: 'Teal & Coral', primary: '#0f766e', accent: '#f87171', bg: 'bg-teal-700' },
];

export interface DensityConfig {
  pagePadding: string;
  headerPadding: string;
  sectionGap: string;
  itemGap: string;
  fontSize: string;
  lineHeight: string;
  headerTitleSize: string;
  subTitleSize: string;
  sectionTitleSize: string;
  bulletGap: string;
}

export function getDensityConfig(theme?: ResumeTheme): DensityConfig {
  const sz = theme?.fontSize || 'normal';
  if (sz === 'compact') {
    return {
      pagePadding: '20px 24px',
      headerPadding: '16px 24px',
      sectionGap: '12px',
      itemGap: '6px',
      fontSize: '9.5px',
      lineHeight: '1.4',
      headerTitleSize: '22px',
      subTitleSize: '12px',
      sectionTitleSize: '11px',
      bulletGap: '2px',
    };
  }
  if (sz === 'spacious') {
    return {
      pagePadding: '44px 48px',
      headerPadding: '32px 48px',
      sectionGap: '24px',
      itemGap: '14px',
      fontSize: '12.5px',
      lineHeight: '1.75',
      headerTitleSize: '30px',
      subTitleSize: '15px',
      sectionTitleSize: '14px',
      bulletGap: '6px',
    };
  }
  // normal
  return {
    pagePadding: '32px 38px',
    headerPadding: '24px 38px',
    sectionGap: '18px',
    itemGap: '10px',
    fontSize: '11px',
    lineHeight: '1.6',
    headerTitleSize: '26px',
    subTitleSize: '13.5px',
    sectionTitleSize: '12.5px',
    bulletGap: '4px',
  };
}
