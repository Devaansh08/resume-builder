import type { ResumeSections, ATSResult, ATSCheck } from '../types';
import { wordCount } from './helpers';

// ─── ATS Action Verbs ─────────────────────────────────────────────────────
const ACTION_VERBS = [
  'achieved', 'accelerated', 'accomplished', 'built', 'collaborated', 'created',
  'delivered', 'designed', 'developed', 'drove', 'engineered', 'established',
  'executed', 'expanded', 'generated', 'implemented', 'improved', 'increased',
  'launched', 'led', 'managed', 'optimized', 'orchestrated', 'produced',
  'reduced', 'refactored', 'scaled', 'shipped', 'spearheaded', 'streamlined',
  'transformed', 'utilized', 'validated', 'won',
];

const WEAK_WORDS = [
  'responsible for', 'helped', 'assisted', 'worked on', 'was involved in',
  'participated in', 'tried to', 'attempted', 'did',
];

// ─── ATS Scorer ───────────────────────────────────────────────────────────
export function scoreResume(sections: ResumeSections): ATSResult {
  const checks: ATSCheck[] = [];
  let score = 0;
  const maxScore = 100;

  // Collect all text for analysis
  const allText = collectAllText(sections);
  const words = wordCount(allText);

  // ── 1. Personal Info completeness (20 pts) ────────────────────────────
  // ── 1. Personal Info completeness (20 pts) ────────────────────────────
  const pi = sections.personalInfo;
  const piFields = [pi.name, pi.email, pi.phone, pi.title, pi.summary];
  const piComplete = piFields.filter(Boolean).length;
  const piScore = Math.round((piComplete / piFields.length) * 20);
  score += piScore;

  checks.push({
    id: 'personal-info',
    label: 'Personal Information & Header',
    description: `${piComplete}/${piFields.length} key fields completed (${['Name', 'Email', 'Phone', 'Title', 'Summary'].filter((_, i) => !piFields[i]).join(', ') || 'All complete'})`,
    passed: piComplete >= 4,
    severity: piComplete < 3 ? 'error' : 'warning',
    suggestion: piComplete < 5
      ? `Ensure your header includes your full professional name, direct phone number, clean email address, targeted job title, and executive summary so recruiters can instantly verify your candidacy.`
      : undefined,
    rationale: 'ATS software scans header fields first to index your candidate profile inside applicant tracking databases.',
    examples: [
      'Johnathan R. Sterling | Senior Cloud Systems Architect | +1 (555) 234-5678 | johnathan.sterling@example.com | San Francisco, CA',
      'Sarah L. Jenkins | Principal Product Manager (AI & Enterprise SaaS) | +1 (555) 876-5432 | sarah.jenkins@example.com | New York, NY',
    ],
  });

  // ── 2. Professional Summary (10 pts) ──────────────────────────────────
  const hasSummary = pi.summary.length > 50;
  const summaryWords = wordCount(pi.summary);
  const goodSummaryLength = summaryWords >= 30 && summaryWords <= 100;
  score += hasSummary ? (goodSummaryLength ? 10 : 5) : 0;

  checks.push({
    id: 'summary',
    label: 'Professional Executive Summary',
    description: hasSummary
      ? `${summaryWords} words — ${goodSummaryLength ? 'Ideal executive summary length' : 'Consider adjusting between 30–100 words'}`
      : 'No professional summary detected',
    passed: hasSummary && goodSummaryLength,
    severity: !hasSummary ? 'error' : 'warning',
    suggestion: !hasSummary
      ? 'Construct a persuasive 3-to-4 sentence professional summary at the very top of your resume that articulates your years of expertise, core domain mastery, and greatest quantifiable career achievements.'
      : !goodSummaryLength
        ? 'Refine your professional summary to sit concisely between 30 and 100 words so hiring managers can digest your core value proposition within their initial 6-second scan.'
        : undefined,
    rationale: 'Hiring managers use the top summary to determine within 6 seconds whether your background aligns with the role requirements.',
    examples: [
      'Results-oriented Senior Full-Stack Software Engineer with over 8 years of experience building resilient microservices architectures, scalable cloud infrastructure, and responsive web applications for high-growth enterprise B2B SaaS platforms.',
      'Dynamic Product Manager with 6+ years of expertise directing cross-functional engineering and UX teams to launch data-driven consumer products, generating over $4.5M in new annual recurring revenue while boosting user retention by 28%.',
      'Detail-oriented Senior Financial Analyst with a proven track record of constructing complex financial models, automating variance reporting, and advising C-suite executives on $50M+ capital allocation strategies to increase operational margins.',
      'Strategic Digital Marketing Director specializing in multi-channel paid acquisition, SEO/SEM optimization, and brand storytelling, successfully lowering customer acquisition cost (CAC) by 34% while scaling quarterly lead generation by 150%.',
    ],
  });

  // ── 3. Work Experience (20 pts) ───────────────────────────────────────
  const hasExp = sections.experience.length > 0;
  const expWithBullets = sections.experience.filter(
    (e) => e.bullets.filter(Boolean).length >= 2
  ).length;
  const expScore = !hasExp ? 0 : expWithBullets === sections.experience.length ? 20 : 10;
  score += expScore;

  checks.push({
    id: 'experience',
    label: 'Work Experience & Impact Bullets',
    description: hasExp
      ? `${sections.experience.length} roles listed, ${expWithBullets} with detailed bullet points`
      : 'No work experience history listed',
    passed: hasExp && expWithBullets === sections.experience.length,
    severity: !hasExp ? 'error' : 'warning',
    suggestion: !hasExp
      ? 'Detail your professional history by adding at least one relevant work role with clear dates, company name, location, and structured bullet points highlighting measurable impact.'
      : expWithBullets < sections.experience.length
        ? 'Expand every role in your work history to include at least 3 to 5 comprehensive bullet points that follow the Google X-Y-Z formula: accomplished X, measured by Y, by doing Z.'
        : undefined,
    rationale: 'Recruiters evaluate work history bullet points to determine how effectively you delivered results in past positions.',
    examples: [
      'Spearheaded the migration of monolithic legacy backend services to distributed AWS Kubernetes (EKS) clusters, slashing average deployment time by 50% and improving system reliability to 99.99% uptime across 12 million users.',
      'Architected and deployed an automated continuous integration pipeline using GitHub Actions and Docker, eliminating 18 hours of weekly manual regression testing for a 15-person engineering team.',
      'Directed cross-functional agile sprints with product, UX, and data science teams to deliver a real-time analytics dashboard 3 weeks ahead of schedule, contributing directly to a 32% increase in customer contract renewals.',
      'Orchestrated a comprehensive cloud database indexing and query optimization initiative across mission-critical PostgreSQL instances, decreasing average query latency from 1,200ms down to 65ms.',
    ],
  });

  // ── 4. Education (10 pts) ─────────────────────────────────────────────
  const hasEdu = sections.education.length > 0;
  score += hasEdu ? 10 : 0;

  checks.push({
    id: 'education',
    label: 'Academic Background & Credentials',
    description: hasEdu ? `${sections.education.length} academic degrees/certifications listed` : 'No formal education listed',
    passed: hasEdu,
    severity: 'warning',
    suggestion: !hasEdu
      ? 'List your highest degree, university name, graduation date, and relevant academic achievements or coursework to satisfy corporate academic verification requirements.'
      : undefined,
    rationale: 'ATS software checks degrees and institutions against automated corporate eligibility filters.',
    examples: [
      'Bachelor of Science in Computer Science | University of California, Berkeley | Graduated Magna Cum Laude (GPA: 3.86 / 4.0)',
      'Master of Business Administration (MBA), Strategic Management | Wharton School, University of Pennsylvania | Dean’s Honor List',
      'Relevant Coursework: Advanced Distributed Systems, Database Architecture, Machine Learning, Artificial Intelligence, and Applied Cryptography.',
    ],
  });

  // ── 5. Skills Section (15 pts) ────────────────────────────────────────
  const totalSkills = sections.skills.reduce((acc, s) => acc + s.items.length, 0);
  const goodSkillsCount = totalSkills >= 5;
  score += goodSkillsCount ? 15 : Math.round((totalSkills / 5) * 15);

  checks.push({
    id: 'skills',
    label: 'Technical & Domain Core Competencies',
    description: `${totalSkills} professional skills detected across categories`,
    passed: goodSkillsCount,
    severity: totalSkills === 0 ? 'error' : 'warning',
    suggestion: !goodSkillsCount
      ? 'Incorporate at least 8 to 12 targeted hard skills, industry frameworks, and software tools directly from target job descriptions to guarantee keyword match percentages during automated screening.'
      : undefined,
    rationale: 'ATS algorithms calculate candidate relevance scores by matching exact technical keywords between the resume and the job requisition.',
    examples: [
      'Programming & Frameworks: TypeScript, JavaScript (ES6+), Python, Go, React.js, Next.js, Node.js, Express, GraphQL, and REST APIs.',
      'Cloud & DevOps Infrastructure: Amazon Web Services (AWS EKS, Lambda, S3, RDS), Docker, Kubernetes, Terraform, CI/CD Pipelines, and GitHub Actions.',
      'Data & Architecture Systems: PostgreSQL, MongoDB, Redis, Apache Kafka, Distributed Systems Design, and High-Concurrency Microservices.',
      'Product & Agile Methodologies: Cross-Functional Team Leadership, Agile / Scrum Frameworks, A/B Testing, User Journey Mapping, and SaaS Go-To-Market Strategy.',
    ],
  });

  // ── 6. Action Verbs (10 pts) ──────────────────────────────────────────
  const lowerText = allText.toLowerCase();
  const foundVerbs = ACTION_VERBS.filter((v) => lowerText.includes(v));
  const verbScore = Math.min(10, Math.round((foundVerbs.length / 5) * 10));
  score += verbScore;

  checks.push({
    id: 'action-verbs',
    label: 'Executive Action Verb Diversity',
    description: `${foundVerbs.length} high-impact leadership action verbs detected`,
    passed: foundVerbs.length >= 5,
    severity: foundVerbs.length < 3 ? 'error' : 'warning',
    suggestion: foundVerbs.length < 5
      ? `Initiate every single bullet point with authoritative, active leadership verbs such as 'Architected', 'Spearheaded', 'Accelerated', 'Engineered', or 'Orchestrated' rather than passive duty summaries.`
      : undefined,
    rationale: 'Strong active verbs convey personal ownership, decisive initiative, and leadership over past organizational deliverables.',
    examples: [
      'Spearheaded the redesign and deployment of the core customer onboarding portal, elevating user activation rates from 42% to 68% within two fiscal quarters.',
      'Architected a fault-tolerant payment processing gateway handling over $120M in annualized gross transaction volume with 99.999% availability.',
      'Orchestrated cross-company collaboration across product management, engineering, and legal departments to achieve SOC-2 Type II compliance 2 months ahead of deadline.',
    ],
  });

  // ── 7. Weak Language (5 pts) ──────────────────────────────────────────
  const weakFound = WEAK_WORDS.filter((w) => lowerText.includes(w));
  const noWeakWords = weakFound.length === 0;
  score += noWeakWords ? 5 : Math.max(0, 5 - weakFound.length * 2);

  checks.push({
    id: 'weak-words',
    label: 'Elimination of Passive & Weak Phrasing',
    description: noWeakWords
      ? 'Zero passive or weak phrasing detected'
      : `Detected passive phrasing: "${weakFound.slice(0, 3).join('", "')}"`,
    passed: noWeakWords,
    severity: 'warning',
    suggestion: !noWeakWords
      ? `Eliminate passive phrases such as "${weakFound.slice(0, 2).join('" or "')}" and replace them with strong active accomplishments that clearly state your direct executive contribution.`
      : undefined,
    rationale: 'Passive phrasing minimizes your individual impact and makes accomplishments sound like routine administrative duties.',
    examples: [
      'Instead of "Responsible for managing the engineering team" → "Mentored and led a high-performing engineering division of 16 software developers to deliver enterprise software updates with zero critical production defects."',
      'Instead of "Helped with improving website performance" → "Executed comprehensive frontend asset optimization and code splitting initiatives, reducing page load times by 48% and boosting organic search conversions by 19%."',
    ],
  });

  // ── 8. Contact Info completeness (5 pts) ─────────────────────────────
  const hasLinkedIn = Boolean(pi.linkedin);
  score += hasLinkedIn ? 5 : 0;

  checks.push({
    id: 'linkedin',
    label: 'Professional LinkedIn Profile Integration',
    description: hasLinkedIn ? 'LinkedIn profile URL integrated' : 'No LinkedIn URL detected',
    passed: hasLinkedIn,
    severity: 'info',
    suggestion: !hasLinkedIn
      ? 'Incorporate your customized LinkedIn URL inside the header section so hiring teams and executive recruiters can instantly review your extended portfolio and peer recommendations.'
      : undefined,
    rationale: 'Over 87% of corporate recruiters review a candidate’s LinkedIn profile to verify endorsements and past work tenure.',
    examples: [
      'https://www.linkedin.com/in/johndoe-cloud-architect/',
      'https://www.linkedin.com/in/sarahjenkins-product-leader/',
    ],
  });

  // ── 9. Quantified Results (5 pts) ────────────────────────────────────
  const numberRegex = /\d+(%|k|\+|x|million|billion)?/gi;
  const quantifiedMatches = allText.match(numberRegex) || [];
  const hasQuantified = quantifiedMatches.length >= 3;
  score += hasQuantified ? 5 : 0;

  checks.push({
    id: 'quantified',
    label: 'Quantified & Data-Driven Impact Metrics',
    description: hasQuantified
      ? `${quantifiedMatches.length} measurable metrics and percentages identified`
      : 'Few or zero quantifiable metrics identified',
    passed: hasQuantified,
    severity: 'warning',
    suggestion: !hasQuantified
      ? 'Reinforce your professional achievements by embedding exact numerical figures, dollar amounts saved or generated, percentage growth metrics, or team sizes into every bullet point.'
      : undefined,
    rationale: 'Numbers transform subjective claims into objective, verifiable evidence of your professional competence and economic value.',
    examples: [
      'Decreased cloud server hosting expenses by $180,000 annually by right-sizing AWS EC2 instances and transitioning background workloads to serverless AWS Lambda functions.',
      'Expanded international enterprise sales pipelines by 140% year-over-year by forging strategic corporate partnerships across 12 key European markets.',
      'Automated daily data ingestion pipelines processing over 4.2 billion records per day with zero data loss or synchronization drift.',
    ],
  });

  const finalScore = Math.min(maxScore, Math.round(score));

  return {
    score: finalScore,
    checks,
    keywordDensity: Math.round((foundVerbs.length / Math.max(words, 1)) * 100),
    wordCount: words,
    actionVerbCount: foundVerbs.length,
  };
}

function collectAllText(sections: ResumeSections): string {
  const parts: string[] = [];
  const pi = sections.personalInfo;
  parts.push(pi.name, pi.title, pi.summary);

  sections.experience.forEach((e) => {
    parts.push(e.company, e.position, e.description, ...e.bullets);
  });
  sections.projects.forEach((p) => {
    parts.push(p.name, p.description, ...p.bullets);
  });
  sections.education.forEach((e) => {
    parts.push(e.institution, e.degree, e.description);
  });
  sections.skills.forEach((s) => {
    parts.push(s.category, ...s.items);
  });
  sections.achievements.forEach((a) => {
    parts.push(a.title, a.description);
  });

  return parts.filter(Boolean).join(' ');
}

export function getScoreColor(score: number): string {
  if (score >= 80) return 'text-green-500';
  if (score >= 60) return 'text-amber-500';
  return 'text-red-500';
}

export function getScoreBg(score: number): string {
  if (score >= 80) return 'bg-green-500';
  if (score >= 60) return 'bg-amber-500';
  return 'bg-red-500';
}
