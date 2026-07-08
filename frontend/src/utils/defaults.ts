import type { ResumeSections, ResumeTheme } from '../types';
import { uuidv4 } from './helpers';

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
