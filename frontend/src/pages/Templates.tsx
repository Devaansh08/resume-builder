import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useResumeStore } from '../store/resumeStore';
import type { TemplateId } from '../types';
import { FileText, ArrowRight, Upload, CheckCircle2, Star, ShieldCheck, Sparkles, LayoutGrid, Check, ArrowLeft } from 'lucide-react';
import { ImportModal } from '../components/builder/ImportModal';
import { Footer } from '../components/layout/Footer';
import { PageHeader } from '../components/shared/PageHeader';

export interface TemplateItem {
  id: string;
  name: string;
  category: 'tech' | 'corporate' | 'academic' | 'creative' | 'global' | 'specialized' | 'executive';
  gradient: string;
  badge: string;
  atsScore: string;
  bestFor: string;
  layoutStyle: string;
  photoUrl: string;
  candidateName: string;
  candidateRole: string;
  candidateLocation: string;
  skills: string[];
  exp: { role: string; comp: string; yr: string }[];
  desc: string;
  features: string[];
}

const TEMPLATES: TemplateItem[] = [
  // ─── 1. Tech & Engineering ───────────────────────────────────────────────────
  {
    id: 'modern',
    name: 'Modern (2-Column Tech)',
    category: 'tech',
    gradient: 'from-blue-600 via-indigo-600 to-purple-700',
    badge: 'Most Popular',
    atsScore: '100% ATS Verified • Auto-flow',
    bestFor: 'Tech, FAANG & Full-Stack Engineers',
    layoutStyle: 'sidebar-left',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    candidateName: 'Alex Rivera',
    candidateRole: 'Full Stack Architect',
    candidateLocation: 'San Francisco, CA',
    skills: ['React 19', 'TypeScript', 'Node.js', 'AWS Cloud', 'GraphQL'],
    exp: [
      { role: 'Senior Staff Architect', comp: 'Google Cloud', yr: '2022 - Present' },
      { role: 'Lead Frontend Eng', comp: 'Stripe API', yr: '2019 - 2022' }
    ],
    desc: 'Contemporary two-column architecture with a high-contrast sidebar, colored accent tags, and profile photo support.',
    features: [
      'Left accent column with skill pill tags',
      'Integrated profile portrait photo box',
      'Ideal for dense technical item listings',
    ],
  },
  {
    id: 'google',
    name: 'Google Style (ATS Clean)',
    category: 'tech',
    gradient: 'from-blue-500 via-emerald-500 to-amber-500',
    badge: 'FAANG Pick',
    atsScore: '100% ATS Parseable • Zero Friction',
    bestFor: 'Google, Apple, Meta & Amazon Applicants',
    layoutStyle: 'google-clean',
    photoUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
    candidateName: 'Priya Patel',
    candidateRole: 'Staff Machine Learning Eng',
    candidateLocation: 'Mountain View, CA',
    skills: ['PyTorch', 'Large Language Models', 'Distributed Systems', 'C++'],
    exp: [
      { role: 'Staff ML Engineer', comp: 'Google DeepMind', yr: '2022 - Present' },
      { role: 'Senior AI Researcher', comp: 'Meta AI', yr: '2019 - 2022' }
    ],
    desc: 'Inspired by internal engineering resume standards at Google. Highly structured and machine-readable.',
    features: [
      'Strict left-aligned data structure',
      'Rapid scannable bullet hierarchy',
      'Engineered for automated tracking systems',
    ],
  },
  {
    id: 'tech-hacker',
    name: 'Tech Hacker (Terminal Mono)',
    category: 'tech',
    gradient: 'from-emerald-700 via-teal-800 to-slate-900',
    badge: 'Code Style',
    atsScore: '99% ATS Clean • Code Style',
    bestFor: 'Cybersecurity, SREs, Systems Hackers & Linux Engineers',
    layoutStyle: 'minimal-space',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    candidateName: 'Kevin Mitnick',
    candidateRole: 'Principal Security Researcher',
    candidateLocation: 'Austin, TX',
    skills: ['Rust', 'Linux Kernel', 'Penetration Testing', 'Kubernetes Security'],
    exp: [
      { role: 'Lead Security Architect', comp: 'Cloudflare', yr: '2022 - Present' },
      { role: 'Systems Hacker', comp: 'Red Hat', yr: '2019 - 2022' }
    ],
    desc: 'Monospace hacker aesthetic with high-density technical syntax layout and crisp command-prompt section bars.',
    features: [
      'JetBrains / Fira Code monospace typography',
      'Terminal prompt section delimiters',
      'Zero fluff technical density',
    ],
  },
  {
    id: 'data-science-ai',
    name: 'Data Science & AI/ML Matrix',
    category: 'tech',
    gradient: 'from-purple-700 via-indigo-800 to-blue-900',
    badge: 'AI / ML Gold',
    atsScore: '100% ATS Verified • Quant Flow',
    bestFor: 'Data Scientists, ML Engineers, Quantitative Analysts & Researchers',
    layoutStyle: 'sidebar-left',
    photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    candidateName: 'Dr. Sophia Wu',
    candidateRole: 'Head of Quantitative AI',
    candidateLocation: 'Boston, MA',
    skills: ['Deep Learning', 'PyTorch', 'TensorFlow', 'LLM Fine-tuning', 'Python/R'],
    exp: [
      { role: 'Head of Quantitative AI', comp: 'Two Sigma', yr: '2021 - Present' },
      { role: 'Senior Research Scientist', comp: 'MIT CSAIL', yr: '2018 - 2021' }
    ],
    desc: 'Optimized for showcasing algorithms, research publications, Python/R models, and quantitative metrics.',
    features: [
      'Dedicated model impact & metrics callout blocks',
      'Clean algorithmic stack showcase',
      'Structured publication & patent row',
    ],
  },
  {
    id: 'devops-sre',
    name: 'DevOps & Cloud SRE Architecture',
    category: 'tech',
    gradient: 'from-cyan-600 via-sky-700 to-blue-800',
    badge: 'Cloud SRE',
    atsScore: '100% ATS Verified • Cloud Grid',
    bestFor: 'Cloud Architects, DevOps Engineers, Kubernetes & AWS Specialists',
    layoutStyle: 'sidebar-left',
    photoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
    candidateName: 'Marcus Thorne',
    candidateRole: 'Principal Cloud SRE',
    candidateLocation: 'Seattle, WA',
    skills: ['Kubernetes', 'AWS/GCP', 'Terraform', 'Prometheus', 'CI/CD Pipelines'],
    exp: [
      { role: 'Principal Infrastructure SRE', comp: 'Datadog', yr: '2022 - Present' },
      { role: 'DevOps Lead Architect', comp: 'HashiCorp', yr: '2019 - 2022' }
    ],
    desc: 'Systematic infrastructure grid highlighting multi-cloud certifications, uptime SLAs, and CI/CD automation.',
    features: [
      'Infrastructure stack & certification badges',
      'Reliability & SLA impact highlights',
      'High-speed scannable bullet blocks',
    ],
  },
  {
    id: 'engineering-ops',
    name: 'Hardware & Systems Operations',
    category: 'tech',
    gradient: 'from-slate-700 via-gray-800 to-zinc-900',
    badge: 'Systems Spec',
    atsScore: '100% ATS Verified • Systems Spec',
    bestFor: 'Mechanical, Electrical, Embedded & Manufacturing Engineers',
    layoutStyle: 'classic-header',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    candidateName: 'Jonathan Brooks',
    candidateRole: 'Principal Embedded Lead',
    candidateLocation: 'Detroit, MI',
    skills: ['Altium CAD', 'Firmware C/C++', 'FPGA Design', 'DFM / Robotics'],
    exp: [
      { role: 'Lead Hardware Engineer', comp: 'Tesla Robotics', yr: '2021 - Present' },
      { role: 'Senior Systems Eng', comp: 'Lockheed Martin', yr: '2017 - 2021' }
    ],
    desc: 'Rigorous technical specification layout with clear CAD, schematic, project milestone, and patent breakdowns.',
    features: [
      'Technical CAD & tooling matrix',
      'Project budget and timeline delivery specs',
      'Structured patent & regulatory tracking',
    ],
  },

  // ─── 2. Corporate, Finance & Business ────────────────────────────────────────
  {
    id: 'professional',
    name: 'Professional (Classic Serif)',
    category: 'corporate',
    gradient: 'from-slate-700 via-gray-800 to-zinc-900',
    badge: 'Classic Serif',
    atsScore: '100% ATS Verified • Traditional',
    bestFor: 'Finance, Law, Investment Banking & MBAs',
    layoutStyle: 'classic-header',
    photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    candidateName: 'Sarah Jenkins',
    candidateRole: 'VP of Product Strategy',
    candidateLocation: 'New York, NY',
    skills: ['P&L Management', 'M&A Strategy', 'Go-To-Market', 'Fintech', 'SaaS Growth'],
    exp: [
      { role: 'VP Product Strategy', comp: 'Goldman Sachs', yr: '2021 - Present' },
      { role: 'Senior Director', comp: 'McKinsey & Co', yr: '2017 - 2021' }
    ],
    desc: 'Timeless serif typography with clean dividing lines and rigorous hierarchy. Trusted by Fortune 500 recruiters.',
    features: [
      'Merriweather / Garamond serif styling',
      'Formal horizontal section dividers',
      'Optimized for financial & legal rigor',
    ],
  },
  {
    id: 'microsoft',
    name: 'Microsoft (Enterprise Grid)',
    category: 'corporate',
    gradient: 'from-blue-700 via-cyan-600 to-teal-700',
    badge: 'Corporate Standard',
    atsScore: '100% ATS Verified • Enterprise Ready',
    bestFor: 'Enterprise Software, IT & Corporate Leaders',
    layoutStyle: 'classic-header',
    photoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
    candidateName: 'Michael Chang',
    candidateRole: 'Principal Azure Cloud Architect',
    candidateLocation: 'Redmond, WA',
    skills: ['Azure Mesh', 'Kubernetes', 'Enterprise Security', 'C# / .NET 8'],
    exp: [
      { role: 'Principal Cloud Architect', comp: 'Microsoft', yr: '2021 - Present' },
      { role: 'Senior Solutions Lead', comp: 'Accenture', yr: '2017 - 2021' }
    ],
    desc: 'Modern corporate grid layout with clear visual dividers and crisp data hierarchy for enterprise applications.',
    features: [
      'Enterprise-grade visual structure',
      'Clean accent bars and metadata blocks',
      'Optimized for technical leadership roles',
    ],
  },
  {
    id: 'banking-finance',
    name: 'Wall Street Asset Management',
    category: 'corporate',
    gradient: 'from-zinc-800 via-slate-900 to-black',
    badge: 'Wall St Gold',
    atsScore: '100% ATS Gold • High Rigor',
    bestFor: 'Investment Bankers, Private Equity, Hedge Funds & Analysts',
    layoutStyle: 'classic-header',
    photoUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80',
    candidateName: 'Alexander Vance',
    candidateRole: 'Managing Director M&A',
    candidateLocation: 'New York, NY',
    skills: ['LBO Modeling', 'Valuation Mechanics', 'Capital Raising', 'Private Equity'],
    exp: [
      { role: 'Managing Director M&A', comp: 'Morgan Stanley', yr: '2020 - Present' },
      { role: 'Vice President IB', comp: 'Lazard', yr: '2015 - 2020' }
    ],
    desc: 'Ultra-rigorous financial format built specifically for Goldman Sachs, Morgan Stanley, and private equity standards.',
    features: [
      'Exact 0.5 inch banking margins',
      'Deal size and financial metric callout columns',
      'Zero-tolerance formatting precision',
    ],
  },
  {
    id: 'consulting-mckinsey',
    name: 'McKinsey & Bain Strategy Flow',
    category: 'corporate',
    gradient: 'from-blue-900 via-indigo-900 to-slate-900',
    badge: 'Strategy Flow',
    atsScore: '100% ATS Verified • Strategy Flow',
    bestFor: 'Management Consultants, Strategy Leads & Business Analysts',
    layoutStyle: 'executive-bold',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    candidateName: 'Ayesha Khan',
    candidateRole: 'Engagement Manager',
    candidateLocation: 'Chicago, IL',
    skills: ['Pyramid Principle', 'EBITDA Growth', 'Digital Transformation', 'M&A Integration'],
    exp: [
      { role: 'Engagement Manager', comp: 'McKinsey & Co', yr: '2022 - Present' },
      { role: 'Strategy Consultant', comp: 'Bain & Company', yr: '2019 - 2022' }
    ],
    desc: 'Structured pyramid framework highlighting client impact, EBITDA improvements, and strategic transformations.',
    features: [
      'Pyramid principle bullet structuring',
      'EBITDA and revenue growth metric bars',
      'Distinct case study & project blocks',
    ],
  },
  {
    id: 'sales-impact',
    name: 'Sales & Revenue Closer',
    category: 'corporate',
    gradient: 'from-red-600 via-rose-700 to-amber-700',
    badge: 'Top Closer',
    atsScore: '100% ATS Verified • Quota Focus',
    bestFor: 'Account Executives, VP Sales, Business Development & Closers',
    layoutStyle: 'sidebar-left',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    candidateName: 'Derek Sterling',
    candidateRole: 'VP of Global Enterprise Sales',
    candidateLocation: 'San Francisco, CA',
    skills: ['Enterprise SaaS', 'MEDDPICC', 'ARR Acceleration', 'President Club x4'],
    exp: [
      { role: 'VP Enterprise Sales', comp: 'Salesforce', yr: '2021 - Present' },
      { role: 'Strategic Account Dir', comp: 'Snowflake', yr: '2017 - 2021' }
    ],
    desc: 'Puts quota attainment, ARR generated, deal size, and president club achievements front and center.',
    features: [
      'Bold quota attainment & ARR highlight badges',
      'Territory & deal velocity breakdown',
      'High energy scannable executive flow',
    ],
  },
  {
    id: 'product-manager',
    name: 'Product Manager Sprint',
    category: 'corporate',
    gradient: 'from-indigo-600 via-purple-600 to-pink-600',
    badge: 'PM Agile',
    atsScore: '100% ATS Verified • Roadmap Flow',
    bestFor: 'Product Managers, Group PMs, Agile Owners & Tech Strategists',
    layoutStyle: 'sidebar-left',
    photoUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
    candidateName: 'Elena Rostova',
    candidateRole: 'Director of AI Product',
    candidateLocation: 'Palo Alto, CA',
    skills: ['Product Discovery', 'A/B Experimentation', 'OKR Leadership', 'Roadmap Strategy'],
    exp: [
      { role: 'Group Product Manager', comp: 'OpenAI', yr: '2022 - Present' },
      { role: 'Senior Product Lead', comp: 'Uber Tech', yr: '2019 - 2022' }
    ],
    desc: 'Designed around product lifecycles, user metrics, OKRs, and cross-functional leadership outcomes.',
    features: [
      'Product metric & OKR callout grid',
      'Roadmap execution and feature launch highlights',
      'Cross-functional impact summary',
    ],
  },
  {
    id: 'marketing-brand',
    name: 'Growth & Brand Marketing Lead',
    category: 'corporate',
    gradient: 'from-rose-500 via-pink-600 to-purple-600',
    badge: 'CMO Growth',
    atsScore: '100% ATS Verified • Growth Metrics',
    bestFor: 'CMOs, Growth Marketers, Brand Strategists & Performance Specialists',
    layoutStyle: 'creative-split',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    candidateName: 'Maya Lin',
    candidateRole: 'Chief Marketing Officer',
    candidateLocation: 'Los Angeles, CA',
    skills: ['Performance ROAS', 'Brand Evolution', 'Virality Looping', 'Omnichannel Growth'],
    exp: [
      { role: 'Chief Marketing Officer', comp: 'Glossier Brand', yr: '2021 - Present' },
      { role: 'VP Growth Strategy', comp: 'Nike Digital', yr: '2018 - 2021' }
    ],
    desc: 'Blends data-driven ROAS and CAC metrics with elegant brand storytelling and campaign achievements.',
    features: [
      'ROAS, CAC and conversion rate metric highlights',
      'Multi-channel campaign impact boxes',
      'Clean modern brand aesthetic',
    ],
  },

  // ─── 3. Academic, Research & Medical ─────────────────────────────────────────
  {
    id: 'harvard',
    name: 'Harvard (Crimson Academic)',
    category: 'academic',
    gradient: 'from-red-800 via-rose-900 to-red-950',
    badge: 'Academic Gold',
    atsScore: '100% ATS Verified • Academic Standard',
    bestFor: 'Ivy League, Law Schools & Research Scholars',
    layoutStyle: 'harvard-center',
    photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80',
    candidateName: 'Dr. Marcus Vance',
    candidateRole: 'Postdoctoral Fellow in Law',
    candidateLocation: 'Cambridge, MA',
    skills: ['Constitutional Law', 'Empirical Research', 'Public Policy', 'Econometrics'],
    exp: [
      { role: 'Research Fellow', comp: 'Harvard Law School', yr: '2023 - Present' },
      { role: 'Judicial Clerk', comp: 'US Court of Appeals', yr: '2021 - 2023' }
    ],
    desc: 'Classic Harvard-style centered header with deep crimson accents. Prestigious, structured, and authoritative.',
    features: [
      'Prominent centered candidate header',
      'Traditional academic section ordering',
      'Refined university-approved margins',
    ],
  },
  {
    id: 'stanford',
    name: 'Stanford (Academic Hybrid)',
    category: 'academic',
    gradient: 'from-red-600 via-orange-600 to-amber-700',
    badge: 'Valley Pick',
    atsScore: '100% ATS Verified • High Density',
    bestFor: 'Stanford MBAs, Startups & Product Leads',
    layoutStyle: 'stanford-clean',
    photoUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80',
    candidateName: 'Dr. Elena Rostova',
    candidateRole: 'Founder & AI Research Lead',
    candidateLocation: 'Palo Alto, CA',
    skills: ['Venture Scale Growth', 'AI Product', 'Seed Fundraising', 'Growth Looping'],
    exp: [
      { role: 'Founder & Research Lead', comp: 'Cognitive AI Labs', yr: '2022 - Present' },
      { role: 'Research Scientist', comp: 'Stanford AI Lab', yr: '2019 - 2022' }
    ],
    desc: 'Silicon Valley academic hybrid. Combines rigorous academic clarity with entrepreneurial speed and impact.',
    features: [
      'Compact date and location alignment',
      'Bold section headings with underline',
      'Perfect balance of depth and conciseness',
    ],
  },
  {
    id: 'academic-cv',
    name: 'Full Academic Curriculum Vitae (CV)',
    category: 'academic',
    gradient: 'from-slate-800 via-gray-900 to-black',
    badge: 'Full CV',
    atsScore: '100% ATS Verified • Comprehensive CV',
    bestFor: 'Postdocs, Professors, Researchers & Grant Applicants',
    layoutStyle: 'harvard-center',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    candidateName: 'Dr. Arthur Pendelton',
    candidateRole: 'Tenured Professor of Physics',
    candidateLocation: 'Princeton, NJ',
    skills: ['Quantum Mechanics', 'Grant Allocation', 'Symposia Chair', 'Published x45'],
    exp: [
      { role: 'Professor of Physics', comp: 'Princeton University', yr: '2018 - Present' },
      { role: 'Associate Professor', comp: 'Caltech Research', yr: '2013 - 2018' }
    ],
    desc: 'Multi-page academic CV format engineered for complete publication lists, teaching experience, grants, and symposia.',
    features: [
      'Detailed bibliography and peer-reviewed citation section',
      'Research grant and funding allocation tracking',
      'Teaching & mentoring matrix',
    ],
  },
  {
    id: 'medical-clinical',
    name: 'Medical & Clinical Practice',
    category: 'academic',
    gradient: 'from-teal-700 via-cyan-800 to-slate-900',
    badge: 'Medical MD',
    atsScore: '100% ATS Verified • Clinical Standard',
    bestFor: 'Physicians, Surgeons, Registered Nurses & Clinical Leads',
    layoutStyle: 'minimal-space',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    candidateName: 'Dr. Hannah Abbott, MD',
    candidateRole: 'Chief of Cardiothoracic Surgery',
    candidateLocation: 'Baltimore, MD',
    skills: ['Cardiothoracic Surgery', 'Clinical Trials', 'Robotic Surgery', 'Board Certified MD'],
    exp: [
      { role: 'Chief Surgical Fellow', comp: 'Johns Hopkins Hospital', yr: '2020 - Present' },
      { role: 'General Surgery Resident', comp: 'Mayo Clinic', yr: '2015 - 2020' }
    ],
    desc: 'Structured clinical layout highlighting hospital rotations, board certifications, patient volume, and medical licenses.',
    features: [
      'Board certification & medical license header block',
      'Clinical rotation and fellowship breakdown',
      'Hospital procedure & patient outcomes summary',
    ],
  },
  {
    id: 'legal-formal',
    name: 'Legal & Attorney Formal',
    category: 'academic',
    gradient: 'from-gray-900 via-slate-900 to-zinc-950',
    badge: 'Legal Bar Gold',
    atsScore: '100% ATS Gold • Legal Standard',
    bestFor: 'Attorneys, Judicial Clerks, Corporate Counsel & Law Partners',
    layoutStyle: 'classic-header',
    photoUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80',
    candidateName: 'Jessica Pearson, Esq.',
    candidateRole: 'Managing Partner Litigation',
    candidateLocation: 'New York, NY',
    skills: ['Commercial Litigation', 'M&A Governance', 'SEC Compliance', 'Bar Admitted NY/CA'],
    exp: [
      { role: 'Managing Law Partner', comp: 'Pearson Specter Litigation', yr: '2018 - Present' },
      { role: 'Assistant US Attorney', comp: 'SDNY Federal Court', yr: '2013 - 2018' }
    ],
    desc: 'Authoritative legal format designed for law firms, courts, and corporate counsel with precise case and bar admissions.',
    features: [
      'Bar admission and jurisdiction header summary',
      'Litigation, transaction and case outcome breakdown',
      'Impeccable legal serif typography',
    ],
  },

  // ─── 4. Creative & Design ────────────────────────────────────────────────────
  {
    id: 'creative',
    name: 'Creative (Vibrant Sidebar)',
    category: 'creative',
    gradient: 'from-purple-600 via-pink-600 to-rose-600',
    badge: 'Standout Design',
    atsScore: '99% ATS Clean • Creative Layout',
    bestFor: 'UI/UX Designers, Marketers & Art Directors',
    layoutStyle: 'creative-split',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    candidateName: 'Maya Lin',
    candidateRole: 'Creative Brand Director',
    candidateLocation: 'Los Angeles, CA',
    skills: ['Brand Identity', '3D Motion Design', 'Figma', 'Cinema4D', 'Copywriting'],
    exp: [
      { role: 'Executive Art Director', comp: 'Pentagram Studio', yr: '2022 - Present' },
      { role: 'Lead Brand Designer', comp: 'Apple Design', yr: '2018 - 2022' }
    ],
    desc: 'Bold left sidebar with vibrant color blocks, custom iconography, and prominent profile portrait presentation.',
    features: [
      'Vibrant colored sidebar panel',
      'High-impact visual skill meters',
      'Stunning portfolio & link display',
    ],
  },
  {
    id: 'shrine',
    name: 'Shrine (Material Warmth)',
    category: 'creative',
    gradient: 'from-rose-500 via-amber-500 to-orange-500',
    badge: 'Warm Material',
    atsScore: '100% ATS Verified • Material Design',
    bestFor: 'Consultants, Brand Managers & Creatives',
    layoutStyle: 'shrine-warm',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    candidateName: 'Ayesha Khan',
    candidateRole: 'Senior Management Consultant',
    candidateLocation: 'London, UK',
    skills: ['Digital Transformation', 'Agile Scale', 'Change Management', 'ESG Strategy'],
    exp: [
      { role: 'Principal Consultant', comp: 'Boston Consulting Group', yr: '2022 - Present' },
      { role: 'Strategy Associate', comp: 'Deloitte UK', yr: '2019 - 2022' }
    ],
    desc: 'Material Design inspired aesthetic with warm peach tones, soft card borders, and elegant human-centric typography.',
    features: [
      'Warm earth & peach tone palette',
      'Soft card-style section separation',
      'Human-centric readable typography',
    ],
  },
  {
    id: 'design-portfolio',
    name: 'Design Portfolio Showcase',
    category: 'creative',
    gradient: 'from-indigo-600 via-violet-600 to-purple-600',
    badge: 'Studio Showcase',
    atsScore: '98% ATS Clean • Studio Aesthetic',
    bestFor: 'UX/UI Designers, Motion Artists, Architects & 3D Animators',
    layoutStyle: 'creative-split',
    photoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
    candidateName: 'Leo Vance',
    candidateRole: 'Principal UX & Design Systems',
    candidateLocation: 'Berlin, Germany',
    skills: ['Figma Tokens', 'UI Prototyping', 'Design Systems', 'React Native / Web'],
    exp: [
      { role: 'Head of Design Systems', comp: 'Spotify Studio', yr: '2021 - Present' },
      { role: 'Staff Product Designer', comp: 'Figma Lab', yr: '2018 - 2021' }
    ],
    desc: 'Studio-grade layout that balances project imagery links, design system tools, and creative direction philosophy.',
    features: [
      'Featured project highlights with case study links',
      'Clean asymmetrical studio layout',
      'Modern typography with balanced whitespace',
    ],
  },
  {
    id: 'minimal',
    name: 'Minimal (Clean Executive)',
    category: 'creative',
    gradient: 'from-zinc-500 via-slate-500 to-gray-600',
    badge: 'Cleanest Space',
    atsScore: '100% ATS Verified • High Readability',
    bestFor: 'Designers, Architects & Senior Executives',
    layoutStyle: 'minimal-space',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    candidateName: 'David Chen',
    candidateRole: 'Principal UX Architect',
    candidateLocation: 'Seattle, WA',
    skills: ['Design Systems', 'Figma Mastery', 'User Research', 'Prototyping'],
    exp: [
      { role: 'Head of Design Systems', comp: 'Airbnb', yr: '2023 - Present' },
      { role: 'Staff Product Designer', comp: 'Figma', yr: '2020 - 2023' }
    ],
    desc: 'Generous whitespace with unencumbered typography. Lets your quantifiable accomplishments speak directly.',
    features: [
      'Ultra-clean breathing space balance',
      'Zero visual clutter or distractors',
      'Maximum focus on bullet impact metrics',
    ],
  },
  {
    id: 'dark-matrix',
    name: 'Dark High-Contrast Cyber Studio',
    category: 'creative',
    gradient: 'from-cyan-600 via-purple-700 to-pink-700',
    badge: 'Cyber Dark Mode',
    atsScore: '99% ATS Clean • Cyber Aesthetic',
    bestFor: 'Game Developers, Web3 Creators & Studio Founders',
    layoutStyle: 'sidebar-left',
    photoUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
    candidateName: 'Zackary Vane',
    candidateRole: 'Game Engine Lead & Web3 Architect',
    candidateLocation: 'Tokyo, Japan',
    skills: ['Unreal Engine 5', 'Shader C++', 'Web3 Solidity', 'Cyber Architecture'],
    exp: [
      { role: 'Lead Engine Architect', comp: 'Kojima Productions', yr: '2022 - Present' },
      { role: 'Senior Graphics Eng', comp: 'Epic Games', yr: '2019 - 2022' }
    ],
    desc: 'Bold dark-themed header with electric cyan/violet contrasts. Engineered to make an unforgettable creative impression.',
    features: [
      'High-contrast dark header banner',
      'Vibrant neon skill pill accents',
      'Modern sleek typography and divider bars',
    ],
  },
  {
    id: 'pastel-warmth',
    name: 'Subtle Pastel Warmth',
    category: 'creative',
    gradient: 'from-emerald-500 via-teal-600 to-sky-600',
    badge: 'Pastel Elegance',
    atsScore: '100% ATS Verified • Gentle Elegance',
    bestFor: 'Content Creators, PR Managers, HR Specialists & Educators',
    layoutStyle: 'shrine-warm',
    photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    candidateName: 'Clara Sterling',
    candidateRole: 'VP of People & Culture',
    candidateLocation: 'Denver, CO',
    skills: ['Talent Strategy', 'Empathetic Leadership', 'Total Rewards', 'D&I Growth'],
    exp: [
      { role: 'VP People Operations', comp: 'Patagonia HQ', yr: '2021 - Present' },
      { role: 'Director of HR', comp: 'Stripe Global', yr: '2017 - 2021' }
    ],
    desc: 'Soft pastel background headers and gentle rounded borders that convey warmth, empathy, and professional poise.',
    features: [
      'Gentle warm cream & sage palette accents',
      'Rounded card groupings for clean scannability',
      'Inviting human-friendly layout',
    ],
  },

  // ─── 5. Global & Country Standards ───────────────────────────────────────────
  {
    id: 'indian-academic',
    name: 'Indian Academic (Tabular Matrix)',
    category: 'global',
    gradient: 'from-amber-700 via-red-800 to-yellow-900',
    badge: 'IIT / NIT Matrix',
    atsScore: '100% ATS Verified • Tabular Matrix',
    bestFor: 'IIT/NIT Graduates, GATE Aspirants & Freshers',
    layoutStyle: 'tabular-matrix',
    photoUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80',
    candidateName: 'Aarav Sharma',
    candidateRole: 'B.Tech CS & GATE AIR-14',
    candidateLocation: 'New Delhi, India',
    skills: ['Data Structures & Algorithms', 'System Design', 'Competitive C++', 'OS'],
    exp: [
      { role: 'SDE Intern', comp: 'Microsoft India', yr: 'May 2024 - Jul 2024' },
      { role: 'Lead Tech Secretary', comp: 'IIT Delhi CSE', yr: '2023 - 2024' }
    ],
    desc: 'Official Indian university format featuring a structured tabular education matrix and formal declaration section.',
    features: [
      'Complete tabular education history matrix',
      'Formal academic declaration & signature',
      'Tailored for Indian campus placements',
    ],
  },
  {
    id: 'indian-corporate',
    name: 'Indian Corporate (Split Sidebar)',
    category: 'global',
    gradient: 'from-indigo-700 via-emerald-700 to-teal-800',
    badge: 'MNC Preferred',
    atsScore: '100% ATS Verified • Corporate Split',
    bestFor: 'Indian MNCs, IT Specialists & Experienced Leads',
    layoutStyle: 'corporate-split',
    photoUrl: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=400&q=80',
    candidateName: 'Rohan Mehta',
    candidateRole: 'Senior Solutions Lead',
    candidateLocation: 'Bengaluru, India',
    skills: ['Cloud Migration', 'Microservices', 'Spring Boot', 'Kafka', 'AWS ECS'],
    exp: [
      { role: 'Lead Consultant', comp: 'Infosys NextGen', yr: '2022 - Present' },
      { role: 'Technology Analyst', comp: 'TCS Digital', yr: '2019 - 2022' }
    ],
    desc: 'Corporate split architecture with dedicated profile photo box, personal details summary, and clean project timeline.',
    features: [
      'Prominent corporate portrait photo box',
      'Comprehensive personal biodata details',
      'Preferred by top Indian tech employers',
    ],
  },
  {
    id: 'europass-clean',
    name: 'European Standard (Europass Clean)',
    category: 'global',
    gradient: 'from-sky-700 via-blue-800 to-indigo-900',
    badge: 'EU Standard',
    atsScore: '100% ATS Verified • EU Standard',
    bestFor: 'European Union Job Seekers, Expat Visas & International Careers',
    layoutStyle: 'sidebar-left',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    candidateName: 'Marco Rossi',
    candidateRole: 'Senior EU Policy Analyst',
    candidateLocation: 'Brussels, Belgium',
    skills: ['CEFR English C2', 'French C1', 'EU Regulatory Law', 'Cross-border M&A'],
    exp: [
      { role: 'Senior Policy Advisor', comp: 'European Commission', yr: '2021 - Present' },
      { role: 'Consultant', comp: 'PwC Belgium', yr: '2017 - 2021' }
    ],
    desc: 'Streamlined EU standard format with CEFR language proficiency levels, structured personal data, and clean left date column.',
    features: [
      'CEFR language competency table (A1 to C2)',
      'EU standard date block navigation',
      'Profile photo & citizenship readiness',
    ],
  },
  {
    id: 'canadian-ats',
    name: 'Canadian ATS Standard Format',
    category: 'global',
    gradient: 'from-red-700 via-rose-800 to-slate-900',
    badge: 'Canadian Gold',
    atsScore: '100% ATS Gold • Canadian Compliance',
    bestFor: 'Canadian Job Applications, Express Entry & Toronto/Vancouver Tech',
    layoutStyle: 'minimal-space',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    candidateName: 'Liam O’Connor',
    candidateRole: 'Lead Software Specialist',
    candidateLocation: 'Toronto, ON',
    skills: ['Python / Django', 'Cloud Architecture', 'AWS Canada', 'Privacy Compliance'],
    exp: [
      { role: 'Staff Software Engineer', comp: 'Shopify HQ', yr: '2022 - Present' },
      { role: 'Senior Developer', comp: 'Royal Bank of Canada', yr: '2018 - 2022' }
    ],
    desc: 'Strict North American ATS format compliant with Canadian privacy rules (photo-free, clean chronological impact).',
    features: [
      'Zero photo / personal privacy compliance',
      'Chronological accomplishment focus',
      'Verified for Taleo, Workday and iCIMS',
    ],
  },
  {
    id: 'australian-standard',
    name: 'Australian Standard Resume',
    category: 'global',
    gradient: 'from-green-700 via-emerald-800 to-teal-900',
    badge: 'Aussie Flow',
    atsScore: '100% ATS Verified • Aussie Format',
    bestFor: 'Sydney, Melbourne & Brisbane Job Seekers across all sectors',
    layoutStyle: 'sidebar-left',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    candidateName: 'Chloe Henderson',
    candidateRole: 'Principal Civil Project Director',
    candidateLocation: 'Sydney, NSW',
    skills: ['Key Selection Criteria', 'Infrastructure Delivery', 'Safety Compliance', 'Stakeholder Mgt'],
    exp: [
      { role: 'Project Director', comp: 'Lendlease Australia', yr: '2021 - Present' },
      { role: 'Senior Civil Lead', comp: 'Sydney Metro Authority', yr: '2016 - 2021' }
    ],
    desc: 'Generous 3-4 page capable flow with key selection criteria (KSC) summaries and verified referee blocks.',
    features: [
      'Key Selection Criteria (KSC) highlight boxes',
      'Clear career achievements summary per role',
      'Optional structured referee contacts',
    ],
  },
  {
    id: 'uk-graduate',
    name: 'UK Corporate & Graduate Standard',
    category: 'global',
    gradient: 'from-blue-800 via-indigo-900 to-slate-950',
    badge: 'British Standard',
    atsScore: '100% ATS Verified • UK CV Standard',
    bestFor: 'London Financial City, UK Graduates, NHS & Corporate Applicants',
    layoutStyle: 'classic-header',
    photoUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80',
    candidateName: 'Edward Kensington',
    candidateRole: 'Chartered Financial Analyst',
    candidateLocation: 'London, UK',
    skills: ['CFA Level III', 'Degree First Class (Honours)', 'Financial Risk', 'M&A Advisory'],
    exp: [
      { role: 'Senior Associate', comp: 'Barclays Investment Bank', yr: '2021 - Present' },
      { role: 'Graduate Analyst', comp: 'HSBC London', yr: '2018 - 2021' }
    ],
    desc: 'Clean two-page British CV layout with clear GCSE/A-Level summary, degree classification (First/2:1), and professional profile.',
    features: [
      'UK degree classification & A-Level breakdown',
      'Crisp professional profile & core competencies',
      'Clean British typography and spacing',
    ],
  },

  // ─── 6. Specialized & Entry / Fresher ────────────────────────────────────────
  {
    id: 'fresher-compact',
    name: 'University Graduate & Fresher Impact',
    category: 'specialized',
    gradient: 'from-blue-600 via-cyan-600 to-teal-700',
    badge: 'Project Top Flow',
    atsScore: '100% ATS Verified • Project First',
    bestFor: 'College Students, Interns, Bootcamps & Entry-Level Candidates',
    layoutStyle: 'sidebar-left',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    candidateName: 'Lucas Miller',
    candidateRole: 'Software Engineering Graduate',
    candidateLocation: 'Austin, TX',
    skills: ['Hackathon Winner x3', 'React / Next.js', 'Python AI', 'Data Structures GPA 3.9'],
    exp: [
      { role: 'Software Engineering Intern', comp: 'Tesla Autopilot Team', yr: 'Summer 2024' },
      { role: 'Lead President', comp: 'University Computer Science Club', yr: '2023 - 2024' }
    ],
    desc: 'Puts academic projects, hackathons, open-source contributions, and coursework at the top above formal experience.',
    features: [
      'Top-priority academic projects & hackathon grid',
      'Relevant coursework & technical skills summary',
      'High-impact layout for zero experience',
    ],
  },
  {
    id: 'startup-founder',
    name: 'Startup Founder & Venture Builder',
    category: 'specialized',
    gradient: 'from-violet-700 via-purple-800 to-indigo-900',
    badge: 'Founder Traction',
    atsScore: '100% ATS Verified • Traction Focus',
    bestFor: 'Founders, Co-Founders, Entrepreneur in Residence & Venture Builders',
    layoutStyle: 'executive-bold',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    candidateName: 'Vikram Vance',
    candidateRole: 'Serial Entrepreneur & AI Founder',
    candidateLocation: 'San Francisco, CA',
    skills: ['Raised $18M Series A', 'Y-Combinator W22', '0-to-1 Product', 'Investor Exits'],
    exp: [
      { role: 'Founder & CEO (Acquired)', comp: 'HyperScale AI', yr: '2021 - 2024' },
      { role: 'Venture Partner & EIR', comp: 'Sequoia Scout', yr: '2019 - 2021' }
    ],
    desc: 'Highlights capital raised ($M), user acquisition growth, product pivots, team scaling, and investor exits.',
    features: [
      'Traction & fundraising metric highlight grid',
      'Venture scale achievement breakdown',
      'Bold entrepreneurial executive presence',
    ],
  },
  {
    id: 'infographic-charts',
    name: 'Infographic & Visual Metrics Layout',
    category: 'specialized',
    gradient: 'from-sky-600 via-indigo-600 to-purple-600',
    badge: 'Visual Impact',
    atsScore: '96% ATS Clean • Visual Impact',
    bestFor: 'Consultants, Analysts, Marketers & Creative Executives',
    layoutStyle: 'creative-split',
    photoUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
    candidateName: 'Serena Sterling',
    candidateRole: 'Global Strategy Analyst',
    candidateLocation: 'Chicago, IL',
    skills: ['Market Sizing 98%', 'Tableau / PowerBI', 'Financial Modeling', 'KPI Visuals'],
    exp: [
      { role: 'Lead Analytics Lead', comp: 'Accenture Strategy', yr: '2022 - Present' },
      { role: 'Business Intelligence Analyst', comp: 'Nielsen Data', yr: '2019 - 2022' }
    ],
    desc: 'Incorporates structured visual competency bars and quantifiable KPI progress dials while maintaining ATS text scannability.',
    features: [
      'Visual skill and language competency bars',
      'Highlight KPI stat callout boxes',
      'Sleek modern graphical accents',
    ],
  },
  {
    id: 'tabular-grid',
    name: 'Structured Tabular & Matrix Flow',
    category: 'specialized',
    gradient: 'from-slate-700 via-gray-800 to-zinc-900',
    badge: 'Tabular Boxed',
    atsScore: '100% ATS Verified • Tabular Clean',
    bestFor: 'Operations Managers, Supply Chain, Logistics & Project Directors',
    layoutStyle: 'tabular-matrix',
    photoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
    candidateName: 'George Thorne',
    candidateRole: 'VP of Global Supply Chain Operations',
    candidateLocation: 'Atlanta, GA',
    skills: ['Six Sigma Black Belt', 'Global Logistics', 'ERP SAP / Oracle', 'Cost Reduction $40M'],
    exp: [
      { role: 'VP Supply Chain Operations', comp: 'FedEx Global HQ', yr: '2020 - Present' },
      { role: 'Director of Operations', comp: 'General Electric', yr: '2014 - 2020' }
    ],
    desc: 'Clean boxed grid formatting where every role, project, and skill category resides inside crisp border cells.',
    features: [
      'Clean bordered table cells for all sections',
      'Impeccable structural scannability',
      'Zero ambiguity for dense operational data',
    ],
  },

  // ─── 7. Executive & C-Suite ──────────────────────────────────────────────────
  {
    id: 'executive',
    name: 'Executive (Bold Navy Leadership)',
    category: 'executive',
    gradient: 'from-indigo-900 via-blue-950 to-slate-900',
    badge: 'C-Suite Pick',
    atsScore: '100% ATS Verified • Leadership Flow',
    bestFor: 'Chief Executives, VPs, Directors & Founders',
    layoutStyle: 'executive-bold',
    photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
    candidateName: 'Liam Vance',
    candidateRole: 'Chief Financial Officer',
    candidateLocation: 'Chicago, IL',
    skills: ['Corporate Governance', 'IPO Execution', 'Capital Allocation', 'Risk Mgt'],
    exp: [
      { role: 'Chief Financial Officer', comp: 'Apex Holdings', yr: '2020 - Present' },
      { role: 'Managing Director', comp: 'Morgan Stanley', yr: '2014 - 2020' }
    ],
    desc: 'Commanding leadership presentation with dark navy headers, gold accents, and authoritative executive summary formatting.',
    features: [
      'Commanding centered leadership header',
      'Refined executive summary callout box',
      'Designed for multi-million dollar scope',
    ],
  },
  {
    id: 'executive-board',
    name: 'Board Member & Advisory Director',
    category: 'executive',
    gradient: 'from-slate-900 via-zinc-950 to-black',
    badge: 'Board Governance',
    atsScore: '100% ATS Verified • Board Governance',
    bestFor: 'Board of Directors, Advisors, Non-Executive Directors & Trustees',
    layoutStyle: 'executive-bold',
    photoUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80',
    candidateName: 'Senator Patricia Hayes',
    candidateRole: 'Non-Executive Board Director',
    candidateLocation: 'Washington, DC',
    skills: ['Fiduciary Oversight', 'ESG Governance', 'Audit Committee Chair', 'Public Policy'],
    exp: [
      { role: 'Non-Executive Board Director', comp: 'Lockheed Martin Board', yr: '2021 - Present' },
      { role: 'Managing Director & Partner', comp: 'Carlyle Group PE', yr: '2012 - 2021' }
    ],
    desc: 'Authoritative layout emphasizing corporate governance, committee leadership, M&A oversight, and fiduciary excellence.',
    features: [
      'Board and committee leadership header matrix',
      'Governance and shareholder value impact summary',
      'Prestige serif/sans balanced typography',
    ],
  },
];

// Helper to render hyper-distinct, high-fidelity visual preview sheets for all 12 architectural styles
function renderTemplatePreviewCard(t: TemplateItem) {
  switch (t.layoutStyle) {
    case 'google-clean':
      return (
        <div className="w-full flex flex-col p-3 bg-white dark:bg-surface-950 text-gray-800 dark:text-gray-100 overflow-hidden font-mono text-[6px]">
          <div className="flex justify-between items-end border-b border-emerald-500 pb-1 mb-1.5">
            <div>
              <div className="text-[9px] font-extrabold font-sans text-gray-900 dark:text-white truncate">{t.candidateName}</div>
              <div className="text-[6.5px] font-bold text-emerald-600 dark:text-emerald-400 truncate">{t.candidateRole}</div>
            </div>
            <div className="text-[5.5px] text-gray-400 text-right">{t.candidateLocation}<br/>github.com/candidate</div>
          </div>
          <div className="mb-1.5">
            <div className="text-[6px] font-extrabold text-gray-500 tracking-wider mb-0.5">SUMMARY & CORE TECH STACK:</div>
            <div className="flex flex-wrap gap-1">
              {t.skills.map((sk, idx) => (
                <span key={idx} className="bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 px-1 py-0.5 rounded font-semibold">
                  [+] {sk}
                </span>
              ))}
            </div>
          </div>
          <div className="flex-1 space-y-1 overflow-hidden">
            <div className="text-[6px] font-extrabold text-gray-500 tracking-wider">RELEVANT EXPERIENCE:</div>
            {t.exp.map((item, idx) => (
              <div key={idx} className="border-l-2 border-emerald-500/40 pl-1.5 py-0.5 space-y-0.5">
                <div className="flex justify-between font-bold text-[6.5px] text-gray-900 dark:text-white">
                  <span>{item.role} @ {item.comp}</span>
                  <span className="text-gray-400 font-normal">{item.yr}</span>
                </div>
                <div className="text-[5.5px] text-gray-600 dark:text-gray-400 font-sans">
                  • Architected high-throughput pipelines with zero latency bottlenecks and 99.99% uptime SLAs.
                </div>
              </div>
            ))}
          </div>
        </div>
      );

    case 'minimal-space':
      return (
        <div className="w-full flex flex-col p-3.5 bg-stone-50/70 dark:bg-zinc-900/70 text-gray-800 dark:text-gray-100 overflow-hidden font-sans">
          <div className="text-center pb-2 border-b border-stone-200 dark:border-zinc-800 mb-2">
            <div className="text-[10px] font-light tracking-wide text-gray-900 dark:text-white uppercase font-display truncate">{t.candidateName}</div>
            <div className="text-[6px] font-semibold text-stone-600 dark:text-zinc-400 tracking-widest uppercase mt-0.5">{t.candidateRole} • {t.candidateLocation}</div>
          </div>
          <div className="mb-2">
            <div className="text-[5.5px] font-bold text-stone-400 uppercase tracking-widest mb-0.5">Expertise & Stack</div>
            <div className="text-[6px] italic text-stone-700 dark:text-zinc-300 leading-relaxed truncate">
              {t.skills.join('  •  ')}
            </div>
          </div>
          <div className="flex-1 space-y-1.5 overflow-hidden">
            <div className="text-[5.5px] font-bold text-stone-400 uppercase tracking-widest">Selected Accomplishments</div>
            {t.exp.map((item, idx) => (
              <div key={idx} className="flex justify-between items-start gap-1">
                <div className="flex-1 min-w-0">
                  <div className="text-[6.5px] font-bold text-gray-900 dark:text-white truncate">{item.role}</div>
                  <div className="text-[5.5px] text-stone-600 dark:text-zinc-400 truncate">{item.comp}</div>
                </div>
                <div className="text-[5.5px] font-mono text-stone-400 shrink-0">{item.yr}</div>
              </div>
            ))}
          </div>
        </div>
      );

    case 'harvard-center':
      return (
        <div className="w-full flex flex-col p-3 bg-white dark:bg-surface-900 text-gray-800 dark:text-gray-100 overflow-hidden font-serif">
          <div className="text-center pb-1.5 mb-1.5 border-b-2 border-red-800">
            <div className="text-[10px] font-bold text-gray-950 dark:text-white tracking-tight truncate">{t.candidateName}</div>
            <div className="text-[6px] text-red-800 dark:text-red-400 font-semibold uppercase tracking-wider">{t.candidateRole}</div>
            <div className="text-[5.5px] text-gray-500 mt-0.5">{t.candidateLocation} | Harvard Research Scholar</div>
          </div>
          <div className="space-y-1 mb-1.5">
            <div className="text-[6px] font-bold text-red-900 dark:text-red-300 uppercase tracking-wider border-b border-red-100 dark:border-red-950/60 pb-0.5">I. Academic & Core Competencies</div>
            <div className="flex flex-wrap gap-1 pt-0.5">
              {t.skills.map((sk, idx) => (
                <span key={idx} className="text-[5.5px] bg-red-50 dark:bg-red-950/50 text-red-900 dark:text-red-200 px-1 py-0.5 rounded font-medium">
                  • {sk}
                </span>
              ))}
            </div>
          </div>
          <div className="flex-1 space-y-1 overflow-hidden">
            <div className="text-[6px] font-bold text-red-900 dark:text-red-300 uppercase tracking-wider border-b border-red-100 dark:border-red-950/60 pb-0.5">II. Academic & Professional Appointments</div>
            {t.exp.map((item, idx) => (
              <div key={idx} className="flex justify-between items-baseline pt-0.5">
                <div className="truncate">
                  <span className="text-[6.5px] font-bold text-gray-900 dark:text-white">{item.role}</span>
                  <span className="text-[5.5px] italic text-gray-600 dark:text-gray-400 ml-1">({item.comp})</span>
                </div>
                <div className="text-[5.5px] font-mono text-gray-500 shrink-0 ml-1">{item.yr}</div>
              </div>
            ))}
          </div>
        </div>
      );

    case 'stanford-clean':
      return (
        <div className="w-full flex flex-col p-3 bg-white dark:bg-surface-900 text-gray-800 dark:text-gray-100 overflow-hidden font-sans">
          <div className="flex justify-between items-center pb-1.5 border-b border-orange-500 mb-1.5">
            <div>
              <div className="text-[9.5px] font-black text-gray-900 dark:text-white tracking-tight truncate">{t.candidateName}</div>
              <div className="text-[6.5px] font-bold text-orange-600 dark:text-orange-400 truncate">{t.candidateRole}</div>
            </div>
            <div className="bg-orange-100 dark:bg-orange-950/80 text-orange-800 dark:text-orange-200 px-1.5 py-0.5 rounded font-bold text-[5px] uppercase tracking-wider">
              {t.candidateLocation}
            </div>
          </div>
          <div className="flex gap-2 flex-1 overflow-hidden">
            <div className="w-24 border-r border-orange-100 dark:border-orange-950/60 pr-1.5 space-y-1">
              <div className="text-[6px] font-bold text-orange-700 dark:text-orange-300 uppercase border-b border-orange-200 pb-0.5">Core Matrix</div>
              {t.skills.map((sk, idx) => (
                <div key={idx} className="text-[5.5px] font-medium bg-orange-50/80 dark:bg-orange-950/40 text-orange-900 dark:text-orange-200 px-1 py-0.5 rounded truncate">
                  → {sk}
                </div>
              ))}
            </div>
            <div className="flex-1 space-y-1 overflow-hidden">
              <div className="text-[6px] font-bold text-orange-700 dark:text-orange-300 uppercase border-b border-orange-200 pb-0.5">Impact Record</div>
              {t.exp.map((item, idx) => (
                <div key={idx} className="space-y-0.5">
                  <div className="flex justify-between font-bold text-[6.5px] text-gray-900 dark:text-white">
                    <span className="truncate">{item.role}</span>
                    <span className="text-gray-400 font-mono text-[5px] shrink-0 ml-1">{item.yr}</span>
                  </div>
                  <div className="text-[5.5px] text-orange-600 dark:text-orange-400 font-semibold truncate">{item.comp}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );

    case 'microsoft-grid':
      return (
        <div className="w-full flex flex-col p-2 bg-slate-50 dark:bg-surface-900 text-gray-800 dark:text-gray-100 overflow-hidden font-sans">
          <div className="bg-blue-700 text-white p-2 rounded-t-lg flex justify-between items-center mb-1.5 shadow-xs">
            <div>
              <div className="text-[9px] font-bold truncate">{t.candidateName}</div>
              <div className="text-[6px] text-blue-100 truncate">{t.candidateRole}</div>
            </div>
            <div className="text-[5px] bg-blue-800/80 px-1.5 py-0.5 rounded font-mono">{t.candidateLocation}</div>
          </div>
          <div className="grid grid-cols-2 gap-1.5 flex-1 overflow-hidden">
            <div className="bg-white dark:bg-surface-800 p-1.5 rounded border border-blue-100 dark:border-blue-900/50 space-y-1">
              <div className="text-[5.5px] font-extrabold text-blue-700 dark:text-blue-400 uppercase tracking-wider">Cloud & Enterprise Stack</div>
              {t.skills.map((sk, idx) => (
                <div key={idx} className="text-[5.5px] bg-blue-50 dark:bg-blue-950/60 text-blue-900 dark:text-blue-200 px-1 py-0.5 rounded font-medium truncate">
                  ✓ {sk}
                </div>
              ))}
            </div>
            <div className="bg-white dark:bg-surface-800 p-1.5 rounded border border-blue-100 dark:border-blue-900/50 space-y-1 overflow-hidden">
              <div className="text-[5.5px] font-extrabold text-blue-700 dark:text-blue-400 uppercase tracking-wider">Leadership Matrix</div>
              {t.exp.map((item, idx) => (
                <div key={idx} className="border-b border-gray-100 dark:border-surface-700/60 pb-0.5 last:border-0">
                  <div className="text-[6px] font-bold text-gray-900 dark:text-white truncate">{item.role}</div>
                  <div className="text-[5px] text-blue-600 dark:text-blue-400 truncate">{item.comp} ({item.yr})</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );

    case 'creative-split':
      return (
        <div className="w-full flex overflow-hidden bg-white dark:bg-surface-900 font-sans">
          <div className="w-22 bg-gradient-to-b from-purple-700 via-pink-600 to-rose-600 text-white p-2 flex flex-col items-center gap-1.5 shrink-0">
            <img src={t.photoUrl} alt={t.candidateName} className="w-9 h-9 rounded-full object-cover border-2 border-white shadow-md shrink-0" />
            <div className="w-full text-center">
              <div className="text-[6.5px] font-extrabold truncate">{t.candidateName}</div>
              <div className="text-[5px] text-purple-200 truncate">{t.candidateRole}</div>
            </div>
            <div className="w-full border-t border-white/20 pt-1 space-y-1">
              <div className="text-[5px] font-bold uppercase tracking-wider text-purple-100">Visual Mastery</div>
              {t.skills.slice(0, 3).map((sk, idx) => (
                <div key={idx} className="space-y-0.5">
                  <div className="flex justify-between text-[4.5px] font-semibold">
                    <span className="truncate">{sk}</span>
                    <span>{90 + idx * 3}%</span>
                  </div>
                  <div className="w-full bg-black/30 h-1 rounded-full overflow-hidden">
                    <div className="bg-amber-300 h-full rounded-full" style={{ width: `${88 + idx * 4}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex-1 p-2.5 flex flex-col justify-between overflow-hidden">
            <div>
              <div className="text-[6px] font-extrabold text-purple-600 dark:text-purple-400 uppercase tracking-wider mb-1">Featured Creative Portfolio</div>
              <div className="space-y-1.5">
                {t.exp.map((item, idx) => (
                  <div key={idx} className="border-l-2 border-pink-500 pl-1.5 py-0.5">
                    <div className="text-[7px] font-bold text-gray-900 dark:text-white truncate">{item.role}</div>
                    <div className="text-[5.5px] text-purple-600 dark:text-purple-400 font-medium truncate">{item.comp} • {item.yr}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-purple-50 dark:bg-purple-950/40 p-1 rounded text-[5px] text-purple-700 dark:text-purple-300 truncate font-semibold">
              ✨ Studio Base: {t.candidateLocation}
            </div>
          </div>
        </div>
      );

    case 'shrine-warm':
      return (
        <div className="w-full flex flex-col p-2.5 bg-[#fffaf5] dark:bg-surface-900 text-gray-800 dark:text-gray-100 overflow-hidden font-sans border border-orange-100 dark:border-orange-900/40">
          <div className="bg-white dark:bg-surface-800 p-2 rounded-xl border border-orange-200/80 dark:border-orange-900 flex items-center justify-between mb-1.5 shadow-2xs">
            <div>
              <div className="text-[9px] font-extrabold text-orange-950 dark:text-orange-100 truncate">{t.candidateName}</div>
              <div className="text-[6px] font-bold text-orange-600 dark:text-orange-400 truncate">{t.candidateRole}</div>
            </div>
            <span className="bg-orange-50 dark:bg-orange-950 text-orange-800 dark:text-orange-200 text-[5px] font-bold px-1.5 py-0.5 rounded-full border border-orange-200 dark:border-orange-800">
              {t.candidateLocation}
            </span>
          </div>
          <div className="bg-white dark:bg-surface-800 p-1.5 rounded-xl border border-orange-100 dark:border-orange-900 mb-1.5">
            <div className="text-[5.5px] font-bold text-orange-800 dark:text-orange-300 uppercase tracking-wider mb-1">Human-Centric Competencies</div>
            <div className="flex flex-wrap gap-1">
              {t.skills.map((sk, idx) => (
                <span key={idx} className="bg-orange-50 dark:bg-orange-950/60 text-orange-900 dark:text-orange-200 px-1.5 py-0.5 rounded-full text-[5px] font-semibold border border-orange-200/60 dark:border-orange-800/60">
                  ❀ {sk}
                </span>
              ))}
            </div>
          </div>
          <div className="bg-white dark:bg-surface-800 p-1.5 rounded-xl border border-orange-100 dark:border-orange-900 flex-1 overflow-hidden space-y-1">
            <div className="text-[5.5px] font-bold text-orange-800 dark:text-orange-300 uppercase tracking-wider">Career Milestones</div>
            {t.exp.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center text-[6px]">
                <span className="font-bold text-gray-900 dark:text-white truncate">{item.role} <span className="font-normal text-orange-600 dark:text-orange-400">@{item.comp}</span></span>
                <span className="font-mono text-gray-400 text-[5px] shrink-0 ml-1">{item.yr}</span>
              </div>
            ))}
          </div>
        </div>
      );

    case 'tabular-matrix':
      return (
        <div className="w-full flex flex-col p-2.5 bg-white dark:bg-surface-900 text-gray-800 dark:text-gray-100 overflow-hidden font-sans">
          <div className="text-center pb-1 mb-1.5 border-b-2 border-amber-800">
            <div className="text-[9.5px] font-extrabold text-gray-900 dark:text-white truncate">{t.candidateName}</div>
            <div className="text-[6px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">{t.candidateRole} • {t.candidateLocation}</div>
          </div>
          <div className="text-[5.5px] font-extrabold text-amber-900 dark:text-amber-300 uppercase tracking-wider mb-0.5">I. Academic & Qualification Matrix</div>
          <div className="border border-gray-400 dark:border-gray-600 rounded overflow-hidden mb-1.5">
            <div className="grid grid-cols-4 bg-gray-100 dark:bg-surface-800 font-bold text-[5px] text-gray-800 dark:text-gray-200 p-0.5 border-b border-gray-400 dark:border-gray-600 text-center">
              <div>Degree / Exam</div>
              <div>Institute / Board</div>
              <div>Year</div>
              <div>CPI / % Grade</div>
            </div>
            <div className="grid grid-cols-4 text-[5px] p-0.5 border-b border-gray-200 dark:border-surface-700 text-center font-medium">
              <div>B.Tech CSE</div>
              <div>IIT Delhi</div>
              <div>2024</div>
              <div className="font-bold text-amber-700 dark:text-amber-400">9.42 / 10.0</div>
            </div>
            <div className="grid grid-cols-4 text-[5px] p-0.5 text-center font-medium">
              <div>Class XII Higher</div>
              <div>CBSE Board</div>
              <div>2020</div>
              <div className="font-bold text-amber-700 dark:text-amber-400">98.4% (AIR-14)</div>
            </div>
          </div>
          <div className="flex-1 space-y-1 overflow-hidden">
            <div className="text-[5.5px] font-extrabold text-amber-900 dark:text-amber-300 uppercase tracking-wider">II. Technical Stack & Internships</div>
            <div className="flex flex-wrap gap-1">
              {t.skills.map((sk, idx) => (
                <span key={idx} className="bg-amber-50 dark:bg-amber-950/50 text-amber-900 dark:text-amber-200 px-1 py-0.5 rounded text-[5px] font-semibold border border-amber-200 dark:border-amber-800">
                  ⚡ {sk}
                </span>
              ))}
            </div>
          </div>
        </div>
      );

    case 'corporate-split':
      return (
        <div className="w-full flex flex-col p-2.5 bg-white dark:bg-surface-900 text-gray-800 dark:text-gray-100 overflow-hidden font-sans">
          <div className="bg-indigo-50/80 dark:bg-indigo-950/50 p-2 rounded-xl border border-indigo-200 dark:border-indigo-800 flex items-center gap-2 mb-1.5 shadow-2xs">
            <img src={t.photoUrl} alt={t.candidateName} className="w-10 h-10 rounded-full object-cover border-2 border-indigo-600 shadow-sm shrink-0" />
            <div className="flex-1 overflow-hidden">
              <div className="text-[9px] font-black text-gray-900 dark:text-white truncate">{t.candidateName}</div>
              <div className="text-[6px] font-bold text-indigo-600 dark:text-indigo-400 truncate">{t.candidateRole}</div>
              <div className="text-[5px] text-gray-500 truncate">DOB: 14 Aug 1996 • Base: {t.candidateLocation}</div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-1.5 flex-1 overflow-hidden">
            <div className="col-span-1 border-r border-gray-200 dark:border-surface-700 pr-1 space-y-1">
              <div className="text-[5.5px] font-extrabold text-indigo-700 dark:text-indigo-400 uppercase tracking-wider">Core Skills</div>
              {t.skills.map((sk, idx) => (
                <div key={idx} className="text-[5px] bg-indigo-50/60 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200 px-1 py-0.5 rounded font-medium truncate">
                  ▪ {sk}
                </div>
              ))}
            </div>
            <div className="col-span-2 space-y-1 overflow-hidden">
              <div className="text-[5.5px] font-extrabold text-indigo-700 dark:text-indigo-400 uppercase tracking-wider">MNC Deliverables</div>
              {t.exp.map((item, idx) => (
                <div key={idx} className="space-y-0.5">
                  <div className="flex justify-between font-bold text-[6px] text-gray-900 dark:text-white">
                    <span className="truncate">{item.role}</span>
                    <span className="text-gray-400 font-mono text-[4.5px] shrink-0">{item.yr}</span>
                  </div>
                  <div className="text-[5.5px] text-indigo-600 dark:text-indigo-400 font-semibold truncate">{item.comp}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );

    case 'executive-bold':
      return (
        <div className="w-full flex flex-col bg-white dark:bg-surface-900 text-gray-800 dark:text-gray-100 overflow-hidden font-sans">
          <div className="bg-slate-900 text-white p-2.5 border-b-2 border-amber-500 flex justify-between items-center shrink-0">
            <div>
              <div className="text-[10px] font-black tracking-tight text-amber-400 truncate">{t.candidateName}</div>
              <div className="text-[6.5px] font-bold text-slate-200 uppercase tracking-wider truncate">{t.candidateRole}</div>
            </div>
            <div className="text-right text-[5.5px] text-slate-400 font-mono">
              {t.candidateLocation}<br/><span className="text-amber-400 font-bold">$400M+ Scope</span>
            </div>
          </div>
          <div className="p-2.5 flex-1 flex flex-col justify-between overflow-hidden">
            <div>
              <div className="bg-slate-100 dark:bg-surface-800/80 p-1.5 rounded border-l-2 border-amber-500 mb-1.5 italic text-[5.5px] text-gray-700 dark:text-gray-300 leading-snug">
                "Authoritative financial & operational leader commanding IPO transformations and high-stakes capital oversight."
              </div>
              <div className="text-[6px] font-extrabold text-slate-900 dark:text-slate-300 uppercase tracking-wider mb-1">C-Suite Competency Matrix</div>
              <div className="flex flex-wrap gap-1 mb-2">
                {t.skills.map((sk, idx) => (
                  <span key={idx} className="bg-slate-100 dark:bg-surface-800 text-slate-800 dark:text-slate-200 px-1.5 py-0.5 rounded text-[5px] font-bold border border-slate-200 dark:border-surface-700">
                    ★ {sk}
                  </span>
                ))}
              </div>
            </div>
            <div className="border-t border-gray-200 dark:border-surface-800 pt-1 space-y-1 overflow-hidden">
              <div className="text-[6px] font-extrabold text-slate-900 dark:text-slate-300 uppercase tracking-wider">Executive Scope & Board Leadership</div>
              {t.exp.map((item, idx) => (
                <div key={idx} className="flex justify-between items-baseline text-[6px]">
                  <span className="font-bold text-gray-900 dark:text-white truncate">{item.role} <span className="font-normal text-amber-600 dark:text-amber-400">({item.comp})</span></span>
                  <span className="font-mono text-gray-400 text-[5px] shrink-0 ml-1">{item.yr}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      );

    case 'classic-header':
      return (
        <div className="w-full flex flex-col p-3 bg-white dark:bg-surface-900 text-gray-800 dark:text-gray-100 overflow-hidden font-serif">
          <div className="pb-1 mb-1.5 border-b-2 border-gray-800 dark:border-gray-300">
            <div className="text-[10px] font-bold text-gray-900 dark:text-white truncate">{t.candidateName}</div>
            <div className="text-[6.5px] font-semibold text-brand-600 dark:text-brand-400 uppercase tracking-wide truncate">{t.candidateRole} • {t.candidateLocation}</div>
          </div>
          <div className="space-y-1 mb-1.5">
            <div className="text-[6px] font-bold text-gray-900 dark:text-white uppercase tracking-wider border-b border-gray-200 dark:border-surface-700 pb-0.5">Core Practice Areas</div>
            <div className="flex flex-wrap gap-1 pt-0.5">
              {t.skills.map((sk, idx) => (
                <span key={idx} className="text-[5.5px] font-medium bg-gray-100 dark:bg-surface-800 text-gray-800 dark:text-gray-200 px-1 py-0.5 rounded">
                  ▪ {sk}
                </span>
              ))}
            </div>
          </div>
          <div className="flex-1 space-y-1 overflow-hidden">
            <div className="text-[6px] font-bold text-gray-900 dark:text-white uppercase tracking-wider border-b border-gray-200 dark:border-surface-700 pb-0.5">Professional Leadership Flow</div>
            {t.exp.map((item, idx) => (
              <div key={idx} className="flex justify-between items-baseline pt-0.5">
                <div className="truncate font-sans">
                  <span className="text-[6.5px] font-bold text-gray-900 dark:text-white">{item.role}</span>
                  <span className="text-[5.5px] text-brand-600 dark:text-brand-400 font-semibold ml-1">@ {item.comp}</span>
                </div>
                <div className="text-[5.5px] font-mono text-gray-400 shrink-0 ml-1">{item.yr}</div>
              </div>
            ))}
          </div>
        </div>
      );

    case 'sidebar-left':
    default:
      return (
        <div className="w-full h-full flex overflow-hidden bg-white dark:bg-surface-900 font-sans">
          <div className="w-20 bg-gray-50 dark:bg-surface-800/80 p-2 flex flex-col items-center gap-1.5 border-r border-gray-200 dark:border-surface-700 shrink-0">
            <img src={t.photoUrl} alt={t.candidateName} className="w-10 h-10 rounded-full object-cover border-2 border-brand-500 shadow-sm shrink-0" />
            <div className="w-full text-center">
              <div className="text-[6.5px] font-extrabold text-gray-900 dark:text-white truncate">{t.candidateName}</div>
              <div className="text-[5.5px] font-bold text-brand-600 dark:text-brand-400 truncate">{t.candidateRole}</div>
            </div>
            <div className="w-full border-t border-gray-200 dark:border-surface-700 pt-1 space-y-1">
              <div className="text-[5.5px] font-bold text-gray-500 uppercase tracking-wider">Top Skills</div>
              {t.skills.slice(0, 3).map((sk, idx) => (
                <div key={idx} className="text-[5.5px] font-semibold bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 px-1 py-0.5 rounded truncate">
                  {sk}
                </div>
              ))}
            </div>
          </div>
          <div className="flex-1 p-2 flex flex-col justify-between overflow-hidden">
            <div>
              <div className="text-[6px] font-extrabold text-gray-400 uppercase tracking-wider mb-1">Professional Experience</div>
              <div className="space-y-1.5">
                {t.exp.map((item, idx) => (
                  <div key={idx} className="border-b border-gray-100 dark:border-surface-800/60 pb-1 last:border-0">
                    <div className="text-[7px] font-bold text-gray-900 dark:text-white truncate">{item.role}</div>
                    <div className="text-[6px] text-brand-600 font-medium truncate">{item.comp} • <span className="text-gray-400">{item.yr}</span></div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-surface-800/40 p-1 rounded text-[5.5px] text-gray-500 truncate">
              Location: <span className="font-semibold text-gray-700 dark:text-gray-300">{t.candidateLocation}</span>
            </div>
          </div>
        </div>
      );
  }
}

export default function TemplatesPage() {
  const navigate = useNavigate();
  const { currentResume, createNewResume, setCurrentResume, updateTemplate } = useResumeStore();
  const [showImportModal, setShowImportModal] = useState(false);
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [previewModalItem, setPreviewModalItem] = useState<TemplateItem | null>(null);

  const toggleFlip = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setFlippedCards((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSelectTemplate = (templateId: string) => {
    if (currentResume) {
      updateTemplate(templateId as TemplateId);
    } else {
      const newResume = createNewResume('Alex Rivera — Software Architect', 'software');
      newResume.template = templateId as TemplateId;
      setCurrentResume(newResume);
    }
    navigate('/builder');
  };

  const CATEGORY_TABS = [
    { id: 'all', label: 'All Spectrum (36)' },
    { id: 'tech', label: 'Tech & Engineering (6)' },
    { id: 'corporate', label: 'Corporate & Finance (7)' },
    { id: 'academic', label: 'Academic & Medical (5)' },
    { id: 'creative', label: 'Creative & Design (6)' },
    { id: 'global', label: 'Global Standards (6)' },
    { id: 'specialized', label: 'Specialized & Fresher (4)' },
    { id: 'executive', label: 'Executive & Board (2)' },
  ];

  const filteredTemplates = selectedCategory === 'all'
    ? TEMPLATES
    : TEMPLATES.filter((t) => t.category === selectedCategory);

  return (
    <div className="min-h-screen bg-white dark:bg-transparent">
      {/* Universal PageHeader */}
      <PageHeader onUploadClick={() => setShowImportModal(true)} />

      <ImportModal isOpen={showImportModal} onClose={() => setShowImportModal(false)} onSuccess={() => navigate('/builder')} />

      <div className="max-w-7xl mx-auto px-4 pt-28 pb-14">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-50 dark:bg-brand-950/50 border border-brand-200 dark:border-brand-800 text-brand-600 dark:text-brand-400 font-semibold text-xs mb-3 shadow-xs">
            <Sparkles size={14} /> All 36+ Spectrum Formats • 100% Free API & Client Activated
          </div>
          <h1 className="font-display font-bold text-4xl text-gray-900 dark:text-white mb-3">
            Choose Your <span className="text-brand-500 font-schoolbook italic font-normal">Free Template</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-sm sm:text-base">
            Click or hover any card to flip ↻ and explore exact architectural details, columns, and ATS metrics. All 36+ templates are completely free with zero paywalls.
          </p>

          {/* Category Filter Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-7">
            {CATEGORY_TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedCategory(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-2xs ${
                  selectedCategory === tab.id
                    ? 'bg-brand-500 text-white shadow-md ring-2 ring-brand-500/30 scale-105'
                    : 'bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-300 hover:bg-surface-200 dark:hover:bg-surface-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTemplates.map((t, i) => {
            const isFlipped = !!flippedCards[t.id];
            return (
              <div
                key={t.id}
                className="group relative h-[520px] perspective rounded-2xl cursor-pointer animate-slide-up select-none"
                style={{ animationDelay: `${i * 0.04}s` }}
                onClick={(e) => toggleFlip(t.id, e)}
              >
                {/* 3D Flipper Container */}
                <div className={`w-full h-full relative transition-transform duration-700 preserve-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
                  
                  {/* ── FRONT FACE: Realistic Image Mockup & Column Data ── */}
                  <div className="absolute inset-0 w-full h-full backface-hidden bg-white dark:bg-surface-900 rounded-2xl border border-gray-200 dark:border-surface-800 shadow-md group-hover:shadow-2xl transition-all duration-300 flex flex-col overflow-hidden">
                    {/* Visual Layout Header with Authentic Column Mockup */}
                    <div className={`h-[58%] bg-gradient-to-br ${t.gradient} relative flex items-center justify-center p-3 overflow-hidden`}>
                      <div className="absolute inset-0 bg-black/10 backdrop-blur-[1px] group-hover:bg-black/0 transition-colors duration-300" />
                      
                      {/* Hyper-Distinct High-Fidelity Visual Preview Mockup per Layout Architecture */}
                      <div className="w-[86%] h-[92%] bg-white dark:bg-surface-900 rounded-xl shadow-2xl flex overflow-hidden border border-white/60 dark:border-surface-700 relative z-10 group-hover:scale-105 transition-transform duration-500">
                        {renderTemplatePreviewCard(t)}
                      </div>

                      {/* Badge overlay */}
                      <div className="absolute top-3 right-3 z-20">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/45 backdrop-blur-md text-white text-xs font-semibold border border-white/20 shadow-md">
                          <Sparkles size={11} className="text-amber-400" /> {t.badge}
                        </span>
                      </div>
                    </div>

                    {/* Front Card Footer Info */}
                    <div className="p-5 flex-1 flex flex-col justify-between gap-3 bg-white dark:bg-surface-900">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-bold text-lg text-gray-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                            {t.name}
                          </h3>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-2">
                          <ShieldCheck size={14} className="shrink-0" />
                          <span>{t.atsScore}</span>
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400 font-medium truncate">
                          Preview Candidate: <span className="font-bold text-gray-900 dark:text-white">{t.candidateName}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setPreviewModalItem(t);
                          }}
                          className="w-full py-2 px-2.5 rounded-xl font-bold text-xs bg-brand-600 hover:bg-brand-700 text-white transition-all duration-300 flex items-center justify-center gap-1 shadow-sm"
                        >
                          🔍 Preview Image
                        </button>
                        <button
                          type="button"
                          onClick={(e) => toggleFlip(t.id, e)}
                          className="w-full py-2 px-2.5 rounded-xl font-bold text-xs bg-brand-50 dark:bg-surface-800 text-brand-600 dark:text-brand-400 hover:bg-brand-100 dark:hover:bg-surface-700 transition-all duration-300 flex items-center justify-center gap-1 shadow-sm"
                        >
                          ↻ Flip Specs
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* ── BACK FACE: Architecture Details & Checklist ── */}
                  <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 bg-white dark:bg-surface-900 rounded-2xl border-2 border-brand-500/80 shadow-2xl flex flex-col justify-between p-6 overflow-y-auto">
                    <div>
                      <div className="flex items-center justify-between border-b border-gray-100 dark:border-surface-800 pb-3 mb-3">
                        <div>
                          <h3 className="font-extrabold text-lg text-brand-600 dark:text-brand-400">{t.name}</h3>
                          <div className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-0.5">
                            <CheckCircle2 size={13} /> {t.atsScore}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => toggleFlip(t.id, e)}
                          className="px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-surface-800 hover:bg-gray-200 text-gray-600 dark:text-gray-300 font-bold text-xs flex items-center gap-1 transition-colors"
                          title="Flip back to preview"
                        >
                          ↻ Back
                        </button>
                      </div>

                      <div className="space-y-1.5 mb-4 bg-surface-50 dark:bg-surface-800/70 p-3 rounded-xl border border-surface-200 dark:border-surface-700">
                        <div className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                          <span className="font-bold text-gray-900 dark:text-white">Ideal For: </span>{t.bestFor}
                        </div>
                      </div>

                      <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                        {t.desc}
                      </p>

                      <div className="space-y-2 border-t border-gray-100 dark:border-surface-800 pt-3">
                        <div className="text-[11px] font-extrabold text-gray-400 uppercase tracking-wider">Key Architectural Features</div>
                        {t.features.map((feat, idx) => (
                          <div key={idx} className="flex items-start gap-1.5 text-xs text-gray-700 dark:text-gray-300 font-medium">
                            <Check size={14} className="text-brand-500 shrink-0 mt-0.5" />
                            <span>{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-100 dark:border-surface-800 space-y-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectTemplate(t.id);
                        }}
                        className="w-full py-3 px-4 rounded-xl font-extrabold text-xs bg-brand-600 hover:bg-brand-700 text-white shadow-glow-brand transition-all flex items-center justify-center gap-2"
                      >
                        Use This Format Now <ArrowRight size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => toggleFlip(t.id, e)}
                        className="w-full py-1.5 rounded-lg text-center text-xs font-bold text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                      >
                        ↻ Flip back to preview image
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="text-center mt-16 pb-12">
          <p className="text-gray-500 mb-4">Not sure which format to start with?</p>
          <button onClick={() => navigate('/builder')} className="btn btn-primary btn-xl shadow-glow-brand gap-2 font-bold">
            Start Building with Modern — Switch Between All 12 Formats Anytime
          </button>
        </div>
      </div>

      {/* ── LIVE PREVIEW & DETAILS IMAGE MODAL ── */}
      {previewModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/75 backdrop-blur-sm animate-fade-in overflow-y-auto" onClick={() => setPreviewModalItem(null)}>
          <div className="bg-white dark:bg-surface-900 rounded-2xl sm:rounded-3xl max-w-4xl w-full max-h-[94vh] overflow-y-auto md:overflow-hidden shadow-2xl border border-gray-200 dark:border-surface-800 flex flex-col md:flex-row my-auto" onClick={(e) => e.stopPropagation()}>
            {/* Left: Large High-Resolution Sheet Preview */}
            <div className={`w-full md:w-1/2 p-4 sm:p-6 bg-gradient-to-br ${previewModalItem.gradient} flex items-center justify-center shrink-0 md:overflow-auto`}>
              <div className="w-full max-w-[210px] sm:max-w-[320px] aspect-[1/1.4] bg-white dark:bg-surface-900 rounded-xl sm:rounded-2xl shadow-2xl border border-white/40 overflow-hidden transform sm:scale-105 transition-transform">
                {renderTemplatePreviewCard(previewModalItem)}
              </div>
            </div>

            {/* Right: Detailed Breakdown & Actions */}
            <div className="w-full md:w-1/2 p-4 sm:p-6 md:p-8 flex flex-col justify-between md:overflow-y-auto md:max-h-[90vh]">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 text-xs font-bold border border-brand-200 dark:border-brand-800 mb-2">
                      <Sparkles size={12} /> {previewModalItem.badge}
                    </span>
                    <h2 className="text-2xl font-black text-gray-900 dark:text-white">{previewModalItem.name}</h2>
                    <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-1">
                      <ShieldCheck size={14} /> {previewModalItem.atsScore}
                    </div>
                  </div>
                  <button onClick={() => setPreviewModalItem(null)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-surface-800 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors text-lg font-bold">
                    ✕
                  </button>
                </div>

                <div className="bg-gray-50 dark:bg-surface-800/60 p-3.5 rounded-xl border border-gray-200 dark:border-surface-700 mb-4 text-xs text-gray-700 dark:text-gray-300">
                  <span className="font-bold text-gray-900 dark:text-white">Ideal For: </span> {previewModalItem.bestFor}
                </div>

                <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed mb-5">
                  {previewModalItem.desc}
                </p>

                <div className="space-y-2 mb-6 border-t border-gray-100 dark:border-surface-800 pt-4">
                  <div className="text-xs font-black uppercase text-gray-400 tracking-wider">Key Architectural Features</div>
                  {previewModalItem.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-gray-700 dark:text-gray-300 font-medium">
                      <Check size={15} className="text-brand-500 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-100 dark:border-surface-800 pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    const id = previewModalItem.id;
                    setPreviewModalItem(null);
                    handleSelectTemplate(id);
                  }}
                  className="flex-1 py-3.5 px-6 rounded-xl font-extrabold text-sm bg-brand-600 hover:bg-brand-700 text-white shadow-glow-brand transition-all flex items-center justify-center gap-2"
                >
                  Use This Free Template <ArrowRight size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewModalItem(null)}
                  className="px-5 py-3.5 rounded-xl font-bold text-xs bg-gray-100 dark:bg-surface-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-surface-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
