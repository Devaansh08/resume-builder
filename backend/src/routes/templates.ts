import { Router, Request, Response } from 'express';

export const templatesRouter = Router();

export interface TemplateCatalogItem {
  id: string;
  name: string;
  category: 'tech' | 'corporate' | 'academic' | 'creative' | 'global' | 'specialized' | 'executive';
  atsScore: string;
  bestFor: string;
  layoutStyle: string;
  description: string;
  features: string[];
  defaultTheme: {
    primaryColor: string;
    accentColor: string;
    fontFamily: string;
    fontSize: 'compact' | 'normal' | 'spacious';
  };
}

export const TEMPLATES_CATALOG: TemplateCatalogItem[] = [
  // ─── 1. Tech & Engineering ───────────────────────────────────────────────────
  {
    id: 'modern',
    name: 'Modern (2-Column Tech)',
    category: 'tech',
    atsScore: '100% ATS Verified • Auto-flow',
    bestFor: 'Tech, FAANG & Full-Stack Engineers',
    layoutStyle: 'sidebar-left',
    description: 'Contemporary two-column architecture with a high-contrast sidebar, colored accent tags, and profile photo support.',
    features: ['Left accent column with skill pill tags', 'Integrated profile portrait photo box', 'Ideal for dense technical item listings'],
    defaultTheme: { primaryColor: '#2563eb', accentColor: '#4f46e5', fontFamily: 'Inter', fontSize: 'normal' },
  },
  {
    id: 'google',
    name: 'Google Style (ATS Clean)',
    category: 'tech',
    atsScore: '100% ATS Parseable • Zero Friction',
    bestFor: 'Google, Apple, Meta & Amazon Applicants',
    layoutStyle: 'google-clean',
    description: 'Inspired by internal engineering resume standards at Google. Highly structured and machine-readable.',
    features: ['Strict left-aligned data structure', 'Rapid scannable bullet hierarchy', 'Engineered for automated tracking systems'],
    defaultTheme: { primaryColor: '#16a34a', accentColor: '#2563eb', fontFamily: 'Roboto', fontSize: 'normal' },
  },
  {
    id: 'tech-hacker',
    name: 'Tech Hacker (Terminal Mono)',
    category: 'tech',
    atsScore: '99% ATS Clean • Code Style',
    bestFor: 'Cybersecurity, SREs, Systems Hackers & Linux Engineers',
    layoutStyle: 'terminal-mono',
    description: 'Monospace hacker aesthetic with high-density technical syntax layout and crisp command-prompt section bars.',
    features: ['JetBrains / Fira Code monospace typography', 'Terminal prompt section delimiters', 'Zero fluff technical density'],
    defaultTheme: { primaryColor: '#059669', accentColor: '#10b981', fontFamily: 'JetBrains Mono', fontSize: 'compact' },
  },
  {
    id: 'data-science-ai',
    name: 'Data Science & AI/ML Matrix',
    category: 'tech',
    atsScore: '100% ATS Verified • Quant Flow',
    bestFor: 'Data Scientists, ML Engineers, Quantitative Analysts & Researchers',
    layoutStyle: 'data-matrix',
    description: 'Optimized for showcasing algorithms, research publications, Python/R models, and quantitative metrics.',
    features: ['Dedicated model impact & metrics callout blocks', 'Clean algorithmic stack showcase', 'Structured publication & patent row'],
    defaultTheme: { primaryColor: '#7c3aed', accentColor: '#4f46e5', fontFamily: 'Outfit', fontSize: 'normal' },
  },
  {
    id: 'devops-sre',
    name: 'DevOps & Cloud SRE Architecture',
    category: 'tech',
    atsScore: '100% ATS Verified • Cloud Grid',
    bestFor: 'Cloud Architects, DevOps Engineers, Kubernetes & AWS Specialists',
    layoutStyle: 'cloud-grid',
    description: 'Systematic infrastructure grid highlighting multi-cloud certifications, uptime SLAs, and CI/CD automation.',
    features: ['Infrastructure stack & certification badges', 'Reliability & SLA impact highlights', 'High-speed scannable bullet blocks'],
    defaultTheme: { primaryColor: '#0284c7', accentColor: '#0d9488', fontFamily: 'Plus Jakarta Sans', fontSize: 'compact' },
  },
  {
    id: 'engineering-ops',
    name: 'Hardware & Systems Operations',
    category: 'tech',
    atsScore: '100% ATS Verified • Systems Spec',
    bestFor: 'Mechanical, Electrical, Embedded & Manufacturing Engineers',
    layoutStyle: 'systems-spec',
    description: 'Rigorous technical specification layout with clear CAD, schematic, project milestone, and patent breakdowns.',
    features: ['Technical CAD & tooling matrix', 'Project budget and timeline delivery specs', 'Structured patent & regulatory tracking'],
    defaultTheme: { primaryColor: '#334155', accentColor: '#475569', fontFamily: 'Inter', fontSize: 'normal' },
  },

  // ─── 2. Corporate, Finance & Business ────────────────────────────────────────
  {
    id: 'professional',
    name: 'Professional (Classic Serif)',
    category: 'corporate',
    atsScore: '100% ATS Verified • Traditional',
    bestFor: 'Finance, Law, Investment Banking & MBAs',
    layoutStyle: 'classic-header',
    description: 'Timeless serif typography with clean dividing lines and rigorous hierarchy. Trusted by Fortune 500 recruiters.',
    features: ['Merriweather / Garamond serif styling', 'Formal horizontal section dividers', 'Optimized for financial & legal rigor'],
    defaultTheme: { primaryColor: '#1e293b', accentColor: '#334155', fontFamily: 'Merriweather', fontSize: 'normal' },
  },
  {
    id: 'microsoft',
    name: 'Microsoft (Enterprise Grid)',
    category: 'corporate',
    atsScore: '100% ATS Verified • Enterprise Ready',
    bestFor: 'Enterprise Software, IT & Corporate Leaders',
    layoutStyle: 'microsoft-grid',
    description: 'Modern corporate grid layout with clear visual dividers and crisp data hierarchy for enterprise applications.',
    features: ['Enterprise-grade visual structure', 'Clean accent bars and metadata blocks', 'Optimized for technical leadership roles'],
    defaultTheme: { primaryColor: '#0078d4', accentColor: '#004e8c', fontFamily: 'Segoe UI', fontSize: 'normal' },
  },
  {
    id: 'banking-finance',
    name: 'Wall Street Asset Management',
    category: 'corporate',
    atsScore: '100% ATS Gold • High Rigor',
    bestFor: 'Investment Bankers, Private Equity, Hedge Funds & Analysts',
    layoutStyle: 'finance-strict',
    description: 'Ultra-rigorous financial format built specifically for Goldman Sachs, Morgan Stanley, and private equity standards.',
    features: ['Exact 0.5 inch banking margins', 'Deal size and financial metric callout columns', 'Zero-tolerance formatting precision'],
    defaultTheme: { primaryColor: '#0f172a', accentColor: '#1e293b', fontFamily: 'Times New Roman', fontSize: 'compact' },
  },
  {
    id: 'consulting-mckinsey',
    name: 'McKinsey & Bain Strategy',
    category: 'corporate',
    atsScore: '100% ATS Verified • Strategy Flow',
    bestFor: 'Management Consultants, Strategy Leads & Business Analysts',
    layoutStyle: 'strategy-flow',
    description: 'Structured pyramid framework highlighting client impact, EBITDA improvements, and strategic transformations.',
    features: ['Pyramid principle bullet structuring', 'EBITDA and revenue growth metric bars', 'Distinct case study & project blocks'],
    defaultTheme: { primaryColor: '#1e3a8a', accentColor: '#1d4ed8', fontFamily: 'Plus Jakarta Sans', fontSize: 'normal' },
  },
  {
    id: 'sales-impact',
    name: 'Sales & Revenue Closer',
    category: 'corporate',
    atsScore: '100% ATS Verified • Quota Focus',
    bestFor: 'Account Executives, VP Sales, Business Development & Closers',
    layoutStyle: 'quota-highlight',
    description: 'Puts quota attainment, ARR generated, deal size, and president club achievements front and center.',
    features: ['Bold quota attainment & ARR highlight badges', 'Territory & deal velocity breakdown', 'High energy scannable executive flow'],
    defaultTheme: { primaryColor: '#dc2626', accentColor: '#b91c1c', fontFamily: 'Outfit', fontSize: 'normal' },
  },
  {
    id: 'product-manager',
    name: 'Product Manager Sprint',
    category: 'corporate',
    atsScore: '100% ATS Verified • Roadmap Flow',
    bestFor: 'Product Managers, Group PMs, Agile Owners & Tech Strategists',
    layoutStyle: 'roadmap-flow',
    description: 'Designed around product lifecycles, user metrics, OKRs, and cross-functional leadership outcomes.',
    features: ['Product metric & OKR callout grid', 'Roadmap execution and feature launch highlights', 'Cross-functional impact summary'],
    defaultTheme: { primaryColor: '#4f46e5', accentColor: '#4338ca', fontFamily: 'Inter', fontSize: 'normal' },
  },
  {
    id: 'marketing-brand',
    name: 'Growth & Brand Marketing Lead',
    category: 'corporate',
    atsScore: '100% ATS Verified • Growth Metrics',
    bestFor: 'CMOs, Growth Marketers, Brand Strategists & Performance Specialists',
    layoutStyle: 'growth-metrics',
    description: 'Blends data-driven ROAS and CAC metrics with elegant brand storytelling and campaign achievements.',
    features: ['ROAS, CAC and conversion rate metric highlights', 'Multi-channel campaign impact boxes', 'Clean modern brand aesthetic'],
    defaultTheme: { primaryColor: '#e11d48', accentColor: '#be123c', fontFamily: 'Plus Jakarta Sans', fontSize: 'normal' },
  },

  // ─── 3. Academic, Research & Medical ─────────────────────────────────────────
  {
    id: 'harvard',
    name: 'Harvard Crimson Academic',
    category: 'academic',
    atsScore: '100% ATS Verified • Academic Gold',
    bestFor: 'Ivy League, Law Schools, Research Scholars & Professors',
    layoutStyle: 'harvard-center',
    description: 'Classic Harvard-style centered header with deep crimson accents. Prestigious, structured, and authoritative.',
    features: ['Prominent centered candidate header', 'Traditional academic section ordering', 'Refined university-approved margins'],
    defaultTheme: { primaryColor: '#881337', accentColor: '#9f1239', fontFamily: 'EB Garamond', fontSize: 'normal' },
  },
  {
    id: 'stanford',
    name: 'Stanford Valley Academic',
    category: 'academic',
    atsScore: '100% ATS Verified • High Density',
    bestFor: 'Stanford MBAs, Startups, PhDs & Tech Leads',
    layoutStyle: 'stanford-clean',
    description: 'Silicon Valley academic hybrid. Combines rigorous academic clarity with entrepreneurial speed and impact.',
    features: ['Compact date and location alignment', 'Bold section headings with underline', 'Perfect balance of depth and conciseness'],
    defaultTheme: { primaryColor: '#b91c1c', accentColor: '#c2410c', fontFamily: 'Plus Jakarta Sans', fontSize: 'normal' },
  },
  {
    id: 'academic-cv',
    name: 'Full Academic Curriculum Vitae (CV)',
    category: 'academic',
    atsScore: '100% ATS Verified • Comprehensive CV',
    bestFor: 'Postdocs, Professors, Researchers & Grant Applicants',
    layoutStyle: 'cv-extensive',
    description: 'Multi-page academic CV format engineered for complete publication lists, teaching experience, grants, and symposia.',
    features: ['Detailed bibliography and peer-reviewed citation section', 'Research grant and funding allocation tracking', 'Teaching & mentoring matrix'],
    defaultTheme: { primaryColor: '#1e293b', accentColor: '#334155', fontFamily: 'EB Garamond', fontSize: 'spacious' },
  },
  {
    id: 'medical-clinical',
    name: 'Medical & Clinical Practice',
    category: 'academic',
    atsScore: '100% ATS Verified • Clinical Standard',
    bestFor: 'Physicians, Surgeons, Registered Nurses, Healthcare & Clinical Leads',
    layoutStyle: 'clinical-standard',
    description: 'Structured clinical layout highlighting hospital rotations, board certifications, patient volume, and medical licenses.',
    features: ['Board certification & medical license header block', 'Clinical rotation and fellowship breakdown', 'Hospital procedure & patient outcomes summary'],
    defaultTheme: { primaryColor: '#0d9488', accentColor: '#0f766e', fontFamily: 'Inter', fontSize: 'normal' },
  },
  {
    id: 'legal-formal',
    name: 'Legal & Attorney Formal',
    category: 'academic',
    atsScore: '100% ATS Gold • Legal Standard',
    bestFor: 'Attorneys, Judicial Clerks, Corporate Counsel & Law Partners',
    layoutStyle: 'legal-strict',
    description: 'Authoritative legal format designed for law firms, courts, and corporate counsel with precise case and bar admissions.',
    features: ['Bar admission and jurisdiction header summary', 'Litigation, transaction and case outcome breakdown', 'Impeccable legal serif typography'],
    defaultTheme: { primaryColor: '#111827', accentColor: '#1f2937', fontFamily: 'Merriweather', fontSize: 'normal' },
  },

  // ─── 4. Creative & Design ────────────────────────────────────────────────────
  {
    id: 'creative',
    name: 'Creative (Vibrant Sidebar)',
    category: 'creative',
    atsScore: '99% ATS Clean • Standout Design',
    bestFor: 'UI/UX Designers, Marketers, Art Directors & Creators',
    layoutStyle: 'creative-split',
    description: 'Bold left sidebar with vibrant color blocks, custom iconography, and prominent profile portrait presentation.',
    features: ['Vibrant colored sidebar panel', 'High-impact visual skill meters', 'Stunning portfolio & link display'],
    defaultTheme: { primaryColor: '#9333ea', accentColor: '#ec4899', fontFamily: 'Outfit', fontSize: 'normal' },
  },
  {
    id: 'shrine',
    name: 'Shrine (Warm Material Design)',
    category: 'creative',
    atsScore: '100% ATS Verified • Warm Material',
    bestFor: 'Consultants, Brand Managers, Creators & Product Specialists',
    layoutStyle: 'shrine-warm',
    description: 'Material Design inspired aesthetic with warm peach tones, soft card borders, and elegant human-centric typography.',
    features: ['Warm earth & peach tone palette', 'Soft card-style section separation', 'Human-centric readable typography'],
    defaultTheme: { primaryColor: '#f43f5e', accentColor: '#f97316', fontFamily: 'Plus Jakarta Sans', fontSize: 'normal' },
  },
  {
    id: 'design-portfolio',
    name: 'Design Portfolio Showcase',
    category: 'creative',
    atsScore: '98% ATS Clean • Studio Aesthetic',
    bestFor: 'UX/UI Designers, Motion Artists, Architects & 3D Animators',
    layoutStyle: 'studio-showcase',
    description: 'Studio-grade layout that balances project imagery links, design system tools, and creative direction philosophy.',
    features: ['Featured project highlights with case study links', 'Clean asymmetrical studio layout', 'Modern typography with balanced whitespace'],
    defaultTheme: { primaryColor: '#18181b', accentColor: '#6366f1', fontFamily: 'Outfit', fontSize: 'normal' },
  },
  {
    id: 'minimal',
    name: 'Minimal Clean Executive',
    category: 'creative',
    atsScore: '100% ATS Verified • High Readability',
    bestFor: 'Designers, Architects & Senior Executives who value purity',
    layoutStyle: 'minimal-space',
    description: 'Generous whitespace with unencumbered typography. Lets your quantifiable accomplishments speak directly.',
    features: ['Ultra-clean breathing space balance', 'Zero visual clutter or distractors', 'Maximum focus on bullet impact metrics'],
    defaultTheme: { primaryColor: '#3f3f46', accentColor: '#52525b', fontFamily: 'Inter', fontSize: 'spacious' },
  },
  {
    id: 'dark-matrix',
    name: 'Dark High-Contrast Cyber Studio',
    category: 'creative',
    atsScore: '99% ATS Clean • Cyber Aesthetic',
    bestFor: 'Game Developers, Web3 Creators, Tech Leads & Studio Founders',
    layoutStyle: 'cyber-studio',
    description: 'Bold dark-themed header with electric cyan/violet contrasts. Engineered to make an unforgettable creative impression.',
    features: ['High-contrast dark header banner', 'Vibrant neon skill pill accents', 'Modern sleek typography and divider bars'],
    defaultTheme: { primaryColor: '#06b6d4', accentColor: '#a855f7', fontFamily: 'Plus Jakarta Sans', fontSize: 'normal' },
  },
  {
    id: 'pastel-warmth',
    name: 'Subtle Pastel Warmth',
    category: 'creative',
    atsScore: '100% ATS Verified • Gentle Elegance',
    bestFor: 'Content Creators, PR Managers, HR Specialists & Educators',
    layoutStyle: 'pastel-elegant',
    description: 'Soft pastel background headers and gentle rounded borders that convey warmth, empathy, and professional poise.',
    features: ['Gentle warm cream & sage palette accents', 'Rounded card groupings for clean scannability', 'Inviting human-friendly layout'],
    defaultTheme: { primaryColor: '#059669', accentColor: '#10b981', fontFamily: 'Outfit', fontSize: 'normal' },
  },

  // ─── 5. Global & Country Standards ───────────────────────────────────────────
  {
    id: 'indian-academic',
    name: 'Indian Academic (IIT/NIT Matrix)',
    category: 'global',
    atsScore: '100% ATS Verified • Tabular Matrix',
    bestFor: 'IIT/NIT Graduates, GATE Aspirants, Campus Placements & Freshers',
    layoutStyle: 'tabular-matrix',
    description: 'Official Indian university format featuring a structured tabular education matrix and formal declaration section.',
    features: ['Complete tabular education history matrix', 'Formal academic declaration & signature', 'Tailored for Indian campus placements'],
    defaultTheme: { primaryColor: '#9a3412', accentColor: '#b91c1c', fontFamily: 'Roboto', fontSize: 'normal' },
  },
  {
    id: 'indian-corporate',
    name: 'Indian Corporate (MNC Split)',
    category: 'global',
    atsScore: '100% ATS Verified • Corporate Split',
    bestFor: 'Experienced Indian IT Professionals, MNC Applications & Leads',
    layoutStyle: 'corporate-split',
    description: 'Balanced sidebar format optimized for Indian MNCs (TCS, Infosys, Wipro, Accenture) and global GCC hubs.',
    features: ['Structured project duration & client info tags', 'Clear summary of key IT skills and tools', 'Optimized for Indian recruitment workflows'],
    defaultTheme: { primaryColor: '#1e40af', accentColor: '#047857', fontFamily: 'Inter', fontSize: 'normal' },
  },
  {
    id: 'europass-clean',
    name: 'European Standard (Europass Clean)',
    category: 'global',
    atsScore: '100% ATS Verified • EU Standard',
    bestFor: 'European Union Job Seekers, Expat Visas & International Careers',
    layoutStyle: 'europass-spec',
    description: 'Streamlined EU standard format with CEFR language proficiency levels, structured personal data, and clean left date column.',
    features: ['CEFR language competency table (A1 to C2)', 'EU standard date block navigation', 'Profile photo & citizenship readiness'],
    defaultTheme: { primaryColor: '#0369a1', accentColor: '#0284c7', fontFamily: 'Roboto', fontSize: 'normal' },
  },
  {
    id: 'canadian-ats',
    name: 'Canadian ATS Standard Format',
    category: 'global',
    atsScore: '100% ATS Gold • Canadian Compliance',
    bestFor: 'Canadian Job Applications, Express Entry & Toronto/Vancouver Tech',
    layoutStyle: 'canadian-strict',
    description: 'Strict North American ATS format compliant with Canadian privacy rules (photo-free, clean chronological impact).',
    features: ['Zero photo / personal privacy compliance', 'Chronological accomplishment focus', 'Verified for Taleo, Workday and iCIMS'],
    defaultTheme: { primaryColor: '#b91c1c', accentColor: '#1e293b', fontFamily: 'Inter', fontSize: 'normal' },
  },
  {
    id: 'australian-standard',
    name: 'Australian Standard Resume',
    category: 'global',
    atsScore: '100% ATS Verified • Aussie Format',
    bestFor: 'Sydney, Melbourne & Brisbane Job Seekers across all sectors',
    layoutStyle: 'aussie-flow',
    description: 'Generous 3-4 page capable flow with key selection criteria (KSC) summaries and verified referee blocks.',
    features: ['Key Selection Criteria (KSC) highlight boxes', 'Clear career achievements summary per role', 'Optional structured referee contacts'],
    defaultTheme: { primaryColor: '#15803d', accentColor: '#166534', fontFamily: 'Plus Jakarta Sans', fontSize: 'spacious' },
  },
  {
    id: 'uk-graduate',
    name: 'UK Corporate & Graduate Standard',
    category: 'global',
    atsScore: '100% ATS Verified • UK CV Standard',
    bestFor: 'London Financial City, UK Graduates, NHS & Corporate Applicants',
    layoutStyle: 'uk-standard',
    description: 'Clean two-page British CV layout with clear GCSE/A-Level summary, degree classification (First/2:1), and professional profile.',
    features: ['UK degree classification & A-Level breakdown', 'Crisp professional profile & core competencies', 'Clean British typography and spacing'],
    defaultTheme: { primaryColor: '#1e3a8a', accentColor: '#3b82f6', fontFamily: 'Inter', fontSize: 'normal' },
  },

  // ─── 6. Specialized & Entry / Fresher ────────────────────────────────────────
  {
    id: 'fresher-compact',
    name: 'University Graduate & Fresher Impact',
    category: 'specialized',
    atsScore: '100% ATS Verified • Project First',
    bestFor: 'College Students, Interns, Bootcamps & Entry-Level Candidates',
    layoutStyle: 'project-first',
    description: 'Puts academic projects, hackathons, open-source contributions, and coursework at the top above formal experience.',
    features: ['Top-priority academic projects & hackathon grid', 'Relevant coursework & technical skills summary', 'High-impact layout for zero experience'],
    defaultTheme: { primaryColor: '#2563eb', accentColor: '#06b6d4', fontFamily: 'Outfit', fontSize: 'normal' },
  },
  {
    id: 'startup-founder',
    name: 'Startup Founder & Venture Builder',
    category: 'specialized',
    atsScore: '100% ATS Verified • Traction Focus',
    bestFor: 'Founders, Co-Founders, Entrepreneur in Residence & Venture Builders',
    layoutStyle: 'traction-metrics',
    description: 'Highlights capital raised ($M), user acquisition growth, product pivots, team scaling, and investor exits.',
    features: ['Traction & fundraising metric highlight grid', 'Venture scale achievement breakdown', 'Bold entrepreneurial executive presence'],
    defaultTheme: { primaryColor: '#4f46e5', accentColor: '#9333ea', fontFamily: 'Plus Jakarta Sans', fontSize: 'normal' },
  },
  {
    id: 'infographic-charts',
    name: 'Infographic & Visual Metrics Layout',
    category: 'specialized',
    atsScore: '96% ATS Clean • Visual Impact',
    bestFor: 'Consultants, Analysts, Marketers & Creative Executives',
    layoutStyle: 'visual-charts',
    description: 'Incorporates structured visual competency bars and quantifiable KPI progress dials while maintaining ATS text scannability.',
    features: ['Visual skill and language competency bars', 'Highlight KPI stat callout boxes', 'Sleek modern graphical accents'],
    defaultTheme: { primaryColor: '#0284c7', accentColor: '#6366f1', fontFamily: 'Outfit', fontSize: 'normal' },
  },
  {
    id: 'tabular-grid',
    name: 'Structured Tabular & Matrix Flow',
    category: 'specialized',
    atsScore: '100% ATS Verified • Tabular Clean',
    bestFor: 'Operations Managers, Supply Chain, Logistics & Project Directors',
    layoutStyle: 'tabular-clean',
    description: 'Clean boxed grid formatting where every role, project, and skill category resides inside crisp border cells.',
    features: ['Clean bordered table cells for all sections', 'Impeccable structural scannability', 'Zero ambiguity for dense operational data'],
    defaultTheme: { primaryColor: '#334155', accentColor: '#475569', fontFamily: 'Inter', fontSize: 'normal' },
  },

  // ─── 7. Executive & C-Suite ──────────────────────────────────────────────────
  {
    id: 'executive',
    name: 'Executive Leadership (Bold Navy)',
    category: 'executive',
    atsScore: '100% ATS Verified • Leadership Flow',
    bestFor: 'Chief Executives, VPs, Directors & General Managers',
    layoutStyle: 'executive-bold',
    description: 'Commanding leadership presentation with dark navy headers, gold accents, and authoritative executive summary formatting.',
    features: ['Commanding centered leadership header', 'Refined executive summary callout box', 'Designed for multi-million dollar scope'],
    defaultTheme: { primaryColor: '#1e1b4b', accentColor: '#b45309', fontFamily: 'Plus Jakarta Sans', fontSize: 'normal' },
  },
  {
    id: 'executive-board',
    name: 'Board Member & Advisory Director',
    category: 'executive',
    atsScore: '100% ATS Verified • Board Governance',
    bestFor: 'Board of Directors, Advisors, Non-Executive Directors & Trustees',
    layoutStyle: 'board-governance',
    description: 'Authoritative layout emphasizing corporate governance, committee leadership, M&A oversight, and fiduciary excellence.',
    features: ['Board and committee leadership header matrix', 'Governance and shareholder value impact summary', 'Prestige serif/sans balanced typography'],
    defaultTheme: { primaryColor: '#0f172a', accentColor: '#1e3a8a', fontFamily: 'EB Garamond', fontSize: 'spacious' },
  },
];

/**
 * GET /api/templates
 * List all 36 free resume templates across the entire spectrum
 */
templatesRouter.get('/', (req: Request, res: Response) => {
  const { category, search } = req.query;

  let filtered = [...TEMPLATES_CATALOG];

  if (category && typeof category === 'string' && category !== 'all') {
    filtered = filtered.filter(t => t.category === category);
  }

  if (search && typeof search === 'string') {
    const q = search.toLowerCase().trim();
    filtered = filtered.filter(t =>
      t.name.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q) ||
      t.bestFor.toLowerCase().includes(q) ||
      t.features.some(f => f.toLowerCase().includes(q))
    );
  }

  res.json({
    status: 'success',
    count: filtered.length,
    totalSpectrum: TEMPLATES_CATALOG.length,
    isFree: true,
    message: '🎉 All 36+ resume templates are 100% free with zero paywalls.',
    templates: filtered,
  });
});

/**
 * GET /api/templates/:id
 * Get full details and metadata for a specific template ID
 */
templatesRouter.get('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const template = TEMPLATES_CATALOG.find(t => t.id === id);

  if (!template) {
    return res.status(404).json({
      status: 'error',
      error: `Template with ID '${id}' not found in the catalog.`,
      availableTemplates: TEMPLATES_CATALOG.map(t => t.id),
    });
  }

  res.json({
    status: 'success',
    isFree: true,
    template,
  });
});

/**
 * POST /api/templates/render
 * Free Spectrum Rendering API: renders any template with user-provided resume JSON
 * Returns either clean HTML ready for PDF/DOM rendering or structured layout JSON.
 */
templatesRouter.post('/render', (req: Request, res: Response) => {
  try {
    const { resume, templateId, format = 'html' } = req.body;

    if (!resume || !resume.sections) {
      return res.status(400).json({
        status: 'error',
        error: 'Missing required field: resume object with sections.',
      });
    }

    const tid = templateId || resume.template || 'modern';
    const templateMeta = TEMPLATES_CATALOG.find(t => t.id === tid) || TEMPLATES_CATALOG[0];

    // Extract basic fields for server-side rendering
    const personal = resume.sections.personalInfo || {};
    const expList = resume.sections.experience || [];
    const eduList = resume.sections.education || [];
    const projList = resume.sections.projects || [];
    const skillsList = resume.sections.skills || [];
    const theme = resume.theme || templateMeta.defaultTheme;

    if (format === 'json') {
      return res.json({
        status: 'success',
        templateUsed: templateMeta,
        renderedLayout: {
          header: {
            name: personal.name || 'Full Name',
            title: personal.title || 'Professional Title',
            contact: [personal.email, personal.phone, personal.address].filter(Boolean),
            links: [personal.linkedin, personal.github, personal.portfolio, personal.website].filter(Boolean),
          },
          summary: personal.summary || '',
          experienceCount: expList.length,
          educationCount: eduList.length,
          projectCount: projList.length,
          skillsCount: skillsList.length,
          themeTokens: theme,
        },
      });
    }

    // Render clean standalone HTML for the template spectrum
    const primaryColor = theme.primaryColor || templateMeta.defaultTheme.primaryColor;
    const fontFamily = theme.fontFamily || templateMeta.defaultTheme.fontFamily;

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${personal.name || 'Resume'} - ${templateMeta.name}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=${encodeURIComponent(fontFamily)}:wght@400;500;600;700;800&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: '${fontFamily}', sans-serif;
      color: #1e293b;
      background: #ffffff;
      line-height: 1.5;
      padding: 40px;
      max-width: 800px;
      margin: 0 auto;
    }
    .header { border-bottom: 2px solid ${primaryColor}; padding-bottom: 20px; margin-bottom: 24px; }
    .name { font-size: 28px; font-weight: 800; color: ${primaryColor}; text-transform: uppercase; letter-spacing: -0.5px; }
    .title { font-size: 16px; font-weight: 600; color: #475569; margin-top: 4px; }
    .contact { font-size: 13px; color: #64748b; margin-top: 8px; display: flex; flex-wrap: wrap; gap: 12px; }
    .section-title { font-size: 14px; font-weight: 700; color: ${primaryColor}; text-transform: uppercase; letter-spacing: 1px; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; margin-top: 24px; margin-bottom: 12px; }
    .item { margin-bottom: 16px; }
    .item-header { display: flex; justify-content: space-between; font-weight: 700; font-size: 14px; color: #0f172a; }
    .item-sub { font-size: 13px; font-weight: 600; color: #475569; }
    .item-desc { font-size: 13px; color: #334155; margin-top: 4px; }
    .bullets { margin-top: 6px; padding-left: 18px; font-size: 13px; color: #334155; }
    .bullets li { margin-bottom: 4px; }
    .skills-grid { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 8px; }
    .skill-pill { background: #f1f5f9; border: 1px solid #cbd5e1; padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: 600; color: #1e293b; }
    .badge { display: inline-block; background: ${primaryColor}15; color: ${primaryColor}; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 700; margin-left: 8px; }
  </style>
</head>
<body>
  <div class="header">
    <div class="name">${personal.name || 'YOUR NAME'} <span class="badge">${templateMeta.name}</span></div>
    <div class="title">${personal.title || ''}</div>
    <div class="contact">
      ${personal.email ? `<span>📧 ${personal.email}</span>` : ''}
      ${personal.phone ? `<span>📞 ${personal.phone}</span>` : ''}
      ${personal.address ? `<span>📍 ${personal.address}</span>` : ''}
      ${personal.linkedin ? `<span>🔗 ${personal.linkedin}</span>` : ''}
    </div>
  </div>

  ${personal.summary ? `
    <div class="section-title">Professional Summary</div>
    <p class="item-desc">${personal.summary}</p>
  ` : ''}

  ${expList.length > 0 ? `
    <div class="section-title">Work Experience</div>
    ${expList.map((exp: any) => `
      <div class="item">
        <div class="item-header">
          <span>${exp.position || 'Role'}</span>
          <span>${exp.startDate || ''} – ${exp.current ? 'Present' : exp.endDate || ''}</span>
        </div>
        <div class="item-sub">${exp.company || 'Company'} ${exp.location ? `· ${exp.location}` : ''}</div>
        ${exp.description ? `<p class="item-desc">${exp.description}</p>` : ''}
        ${exp.bullets && exp.bullets.length > 0 ? `
          <ul class="bullets">
            ${exp.bullets.filter(Boolean).map((b: string) => `<li>${b}</li>`).join('')}
          </ul>
        ` : ''}
      </div>
    `).join('')}
  ` : ''}

  ${eduList.length > 0 ? `
    <div class="section-title">Education</div>
    ${eduList.map((edu: any) => `
      <div class="item">
        <div class="item-header">
          <span>${edu.degree || 'Degree'} ${edu.field ? `in ${edu.field}` : ''}</span>
          <span>${edu.startDate || ''} – ${edu.current ? 'Present' : edu.endDate || ''}</span>
        </div>
        <div class="item-sub">${edu.institution || 'University'} ${edu.gpa ? `· GPA: ${edu.gpa}` : ''}</div>
      </div>
    `).join('')}
  ` : ''}

  ${skillsList.length > 0 ? `
    <div class="section-title">Core Competencies</div>
    <div class="skills-grid">
      ${skillsList.map((sk: any) => `<div class="skill-pill">${sk.name || sk} ${sk.level ? `(${sk.level})` : ''}</div>`).join('')}
    </div>
  ` : ''}

  ${projList.length > 0 ? `
    <div class="section-title">Key Projects</div>
    ${projList.map((proj: any) => `
      <div class="item">
        <div class="item-header">
          <span>${proj.name || 'Project'}</span>
        </div>
        ${proj.description ? `<p class="item-desc">${proj.description}</p>` : ''}
      </div>
    `).join('')}
  ` : ''}
</body>
</html>`;

    res.json({
      status: 'success',
      templateUsed: templateMeta.name,
      templateId: templateMeta.id,
      html,
    });
  } catch (err: any) {
    console.error('[Template Render API Error]', err);
    res.status(500).json({ status: 'error', error: 'Failed to render template spectrum' });
  }
});
