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
  const pi = sections.personalInfo;
  const piFields = [pi.name, pi.email, pi.phone, pi.title, pi.summary];
  const piComplete = piFields.filter(Boolean).length;
  const piScore = Math.round((piComplete / piFields.length) * 20);
  score += piScore;

  checks.push({
    id: 'personal-info',
    label: 'Personal Information',
    description: `${piComplete}/${piFields.length} key fields filled`,
    passed: piComplete >= 4,
    severity: piComplete < 3 ? 'error' : 'warning',
    suggestion: piComplete < 5 ? 'Add missing: ' + ['name', 'email', 'phone', 'title', 'summary'].filter((_, i) => !piFields[i]).join(', ') : undefined,
  });

  // ── 2. Professional Summary (10 pts) ──────────────────────────────────
  const hasSummary = pi.summary.length > 50;
  const summaryWords = wordCount(pi.summary);
  const goodSummaryLength = summaryWords >= 30 && summaryWords <= 100;
  score += hasSummary ? (goodSummaryLength ? 10 : 5) : 0;

  checks.push({
    id: 'summary',
    label: 'Professional Summary',
    description: hasSummary
      ? `${summaryWords} words — ${goodSummaryLength ? 'ideal length' : 'consider 30–100 words'}`
      : 'No summary found',
    passed: hasSummary && goodSummaryLength,
    severity: !hasSummary ? 'error' : 'warning',
    suggestion: !hasSummary
      ? 'Add a 2–4 sentence professional summary targeting the job role'
      : !goodSummaryLength ? 'Keep your summary between 30–100 words for best ATS compatibility' : undefined,
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
    label: 'Work Experience',
    description: hasExp
      ? `${sections.experience.length} positions, ${expWithBullets} with detailed bullets`
      : 'No work experience added',
    passed: hasExp && expWithBullets === sections.experience.length,
    severity: !hasExp ? 'error' : 'warning',
    suggestion: !hasExp
      ? 'Add at least one work experience entry'
      : expWithBullets < sections.experience.length
        ? 'Add at least 2–4 bullet points per role with quantified results'
        : undefined,
  });

  // ── 4. Education (10 pts) ─────────────────────────────────────────────
  const hasEdu = sections.education.length > 0;
  score += hasEdu ? 10 : 0;

  checks.push({
    id: 'education',
    label: 'Education',
    description: hasEdu ? `${sections.education.length} education entries` : 'No education added',
    passed: hasEdu,
    severity: 'warning',
    suggestion: !hasEdu ? 'Add your highest level of education' : undefined,
  });

  // ── 5. Skills Section (15 pts) ────────────────────────────────────────
  const totalSkills = sections.skills.reduce((acc, s) => acc + s.items.length, 0);
  const goodSkillsCount = totalSkills >= 5;
  score += goodSkillsCount ? 15 : Math.round((totalSkills / 5) * 15);

  checks.push({
    id: 'skills',
    label: 'Skills',
    description: `${totalSkills} skills listed`,
    passed: goodSkillsCount,
    severity: totalSkills === 0 ? 'error' : 'warning',
    suggestion: !goodSkillsCount
      ? 'Add at least 5 relevant skills. ATS scans for keyword matches.'
      : undefined,
  });

  // ── 6. Action Verbs (10 pts) ──────────────────────────────────────────
  const lowerText = allText.toLowerCase();
  const foundVerbs = ACTION_VERBS.filter((v) => lowerText.includes(v));
  const verbScore = Math.min(10, Math.round((foundVerbs.length / 5) * 10));
  score += verbScore;

  checks.push({
    id: 'action-verbs',
    label: 'Action Verbs',
    description: `${foundVerbs.length} strong action verbs detected`,
    passed: foundVerbs.length >= 5,
    severity: foundVerbs.length < 3 ? 'error' : 'warning',
    suggestion: foundVerbs.length < 5
      ? `Start bullet points with verbs like: ${ACTION_VERBS.slice(0, 5).join(', ')}`
      : undefined,
  });

  // ── 7. Weak Language (5 pts) ──────────────────────────────────────────
  const weakFound = WEAK_WORDS.filter((w) => lowerText.includes(w));
  const noWeakWords = weakFound.length === 0;
  score += noWeakWords ? 5 : Math.max(0, 5 - weakFound.length * 2);

  checks.push({
    id: 'weak-words',
    label: 'Weak Language',
    description: noWeakWords
      ? 'No weak language detected'
      : `Found: "${weakFound.slice(0, 3).join('", "')}"`,
    passed: noWeakWords,
    severity: 'warning',
    suggestion: !noWeakWords
      ? `Replace phrases like "responsible for" and "helped" with strong action verbs`
      : undefined,
  });

  // ── 8. Contact Info completeness (5 pts) ─────────────────────────────
  const hasLinkedIn = Boolean(pi.linkedin);
  score += hasLinkedIn ? 5 : 0;

  checks.push({
    id: 'linkedin',
    label: 'LinkedIn Profile',
    description: hasLinkedIn ? 'LinkedIn URL added' : 'No LinkedIn URL',
    passed: hasLinkedIn,
    severity: 'info',
    suggestion: !hasLinkedIn ? 'Add your LinkedIn profile URL for more recruiter touchpoints' : undefined,
  });

  // ── 9. Quantified Results (5 pts) ────────────────────────────────────
  const numberRegex = /\d+(%|k|\+|x|million|billion)?/gi;
  const quantifiedMatches = allText.match(numberRegex) || [];
  const hasQuantified = quantifiedMatches.length >= 3;
  score += hasQuantified ? 5 : 0;

  checks.push({
    id: 'quantified',
    label: 'Quantified Achievements',
    description: hasQuantified
      ? `${quantifiedMatches.length} quantified results found`
      : 'Few or no numbers/metrics found',
    passed: hasQuantified,
    severity: 'warning',
    suggestion: !hasQuantified
      ? 'Add metrics like "Increased sales by 30%" or "Led team of 8 engineers"'
      : undefined,
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
