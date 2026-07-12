import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useResumeStore } from '../store/resumeStore';
import type { TemplateId } from '../types';
import { FileText, ArrowRight, Upload, CheckCircle2, Star, ShieldCheck, Sparkles, LayoutGrid, Check, ArrowLeft } from 'lucide-react';
import { ImportModal } from '../components/builder/ImportModal';
import { Footer } from '../components/layout/Footer';
import { PageHeader } from '../components/shared/PageHeader';

const TEMPLATES = [
  {
    id: 'modern',
    name: 'Modern (2-Column)',
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
    id: 'professional',
    name: 'Professional (Classic)',
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
    id: 'minimal',
    name: 'Minimal (Clean)',
    gradient: 'from-zinc-500 via-slate-500 to-gray-600',
    badge: 'Cleanest',
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
    id: 'google',
    name: 'Google Style (ATS)',
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
    id: 'harvard',
    name: 'Harvard (Crimson)',
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
    name: 'Stanford (Academic)',
    gradient: 'from-red-600 via-orange-600 to-amber-700',
    badge: 'Valley Pick',
    atsScore: '100% ATS Verified • High Density',
    bestFor: 'Stanford MBAs, Startups & Product Leads',
    layoutStyle: 'stanford-clean',
    photoUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80',
    candidateName: 'Elena Rostova',
    candidateRole: 'Founder & AI Product Lead',
    candidateLocation: 'Palo Alto, CA',
    skills: ['Venture Scale Growth', 'AI Product', 'Seed Fundraising', 'Growth Looping'],
    exp: [
      { role: 'Founder & CEO', comp: 'Cognitive AI', yr: '2022 - Present' },
      { role: 'Product Manager', comp: 'OpenAI', yr: '2020 - 2022' }
    ],
    desc: 'Silicon Valley academic hybrid. Combines rigorous academic clarity with entrepreneurial speed and impact.',
    features: [
      'Compact date and location alignment',
      'Bold section headings with underline',
      'Perfect balance of depth and conciseness',
    ],
  },
  {
    id: 'microsoft',
    name: 'Microsoft (Corporate)',
    gradient: 'from-blue-700 via-cyan-600 to-teal-700',
    badge: 'Corporate Standard',
    atsScore: '100% ATS Verified • Enterprise Ready',
    bestFor: 'Enterprise Software, IT & Cloud Architects',
    layoutStyle: 'microsoft-grid',
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
    id: 'creative',
    name: 'Creative (Sidebar)',
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
      { role: 'Executive Art Director', comp: 'Pentagram', yr: '2022 - Present' },
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
    id: 'executive',
    name: 'Executive (Bold Navy)',
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
    id: 'shrine',
    name: 'Shrine (Material Warmth)',
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
    id: 'indian-academic',
    name: 'Indian Academic (Tabular)',
    gradient: 'from-amber-700 via-red-800 to-yellow-900',
    badge: 'IIT / NIT Standard',
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
    name: 'Indian Corporate (Split)',
    gradient: 'from-indigo-700 via-emerald-700 to-teal-800',
    badge: 'MNC Preferred',
    atsScore: '100% ATS Verified • Corporate Split',
    bestFor: 'Indian MNCs, IT Specialists & MBA Freshers',
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
];

export default function TemplatesPage() {
  const navigate = useNavigate();
  const { currentResume, createNewResume, setCurrentResume, updateTemplate } = useResumeStore();
  const [showImportModal, setShowImportModal] = useState(false);
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});

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

  return (
    <div className="min-h-screen bg-white dark:bg-transparent">
      {/* Universal PageHeader */}
      <PageHeader onUploadClick={() => setShowImportModal(true)} />

      <ImportModal isOpen={showImportModal} onClose={() => setShowImportModal(false)} onSuccess={() => navigate('/builder')} />

      <div className="max-w-7xl mx-auto px-4 py-14">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-50 dark:bg-brand-950/50 border border-brand-200 dark:border-brand-800 text-brand-600 dark:text-brand-400 font-semibold text-xs mb-3 shadow-xs">
            <Sparkles size={14} /> All 12 Formats Real-Time ATS Tested & Verified
          </div>
          <h1 className="font-display font-bold text-4xl text-gray-900 dark:text-white mb-3">
            Choose Your <span className="text-brand-500 font-schoolbook italic font-normal">Template</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-sm sm:text-base">
            Click or hover any card to flip ↻ and explore exact architectural details, columns, and ATS metrics.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {TEMPLATES.map((t, i) => {
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
                      
                      {/* Real High-Fidelity Mini Resume Sheet with Respective Columns */}
                      <div className="w-[84%] h-[92%] bg-white dark:bg-surface-900 text-gray-800 dark:text-gray-100 rounded-xl shadow-2xl flex overflow-hidden border border-white/60 dark:border-surface-700 relative z-10 group-hover:scale-105 transition-transform duration-500">
                        
                        {t.layoutStyle === 'sidebar-left' || t.layoutStyle === 'creative-split' || t.layoutStyle === 'corporate-split' ? (
                          /* Two-Column Architecture: Left Sidebar + Right Main Column */
                          <>
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
                          </>
                        ) : (
                          /* Classic / Minimal / Harvard / Matrix Architecture: Header + Two-Column Body */
                          <div className="w-full flex flex-col p-2.5 overflow-hidden">
                            <div className="flex items-center gap-2 pb-1.5 border-b border-gray-200 dark:border-surface-700 shrink-0">
                              <img src={t.photoUrl} alt={t.candidateName} className="w-9 h-9 rounded-full object-cover border border-brand-500 shrink-0 shadow-xs" />
                              <div className="flex-1 overflow-hidden">
                                <div className="text-[8.5px] font-extrabold text-gray-900 dark:text-white truncate">{t.candidateName}</div>
                                <div className="text-[6.5px] font-bold text-brand-600 dark:text-brand-400 truncate">{t.candidateRole}</div>
                                <div className="text-[5.5px] text-gray-400 truncate">{t.candidateLocation}</div>
                              </div>
                            </div>
                            <div className="flex gap-2 mt-1.5 flex-1 overflow-hidden">
                              <div className="flex-1 space-y-1 overflow-hidden">
                                <div className="text-[6px] font-extrabold text-gray-400 uppercase tracking-wider">Experience Column</div>
                                {t.exp.map((item, idx) => (
                                  <div key={idx} className="space-y-0.5">
                                    <div className="text-[6.5px] font-bold text-gray-800 dark:text-gray-200 truncate">{item.role}</div>
                                    <div className="text-[5.5px] text-brand-600 font-medium truncate">{item.comp} ({item.yr})</div>
                                  </div>
                                ))}
                              </div>
                              <div className="w-20 border-l border-gray-100 dark:border-surface-800 pl-1.5 space-y-1 overflow-hidden">
                                <div className="text-[6px] font-extrabold text-gray-400 uppercase tracking-wider">Skills Column</div>
                                {t.skills.slice(0, 3).map((sk, idx) => (
                                  <div key={idx} className="text-[5.5px] font-medium bg-gray-100 dark:bg-surface-800 text-gray-700 dark:text-gray-300 px-1 py-0.5 rounded truncate">
                                    {sk}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
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

                      <button
                        type="button"
                        onClick={(e) => toggleFlip(t.id, e)}
                        className="w-full py-2.5 px-4 rounded-xl font-bold text-xs bg-brand-50 dark:bg-surface-800 text-brand-600 dark:text-brand-400 hover:bg-brand-600 hover:text-white dark:hover:bg-brand-500 transition-all duration-300 flex items-center justify-center gap-1.5 shadow-sm"
                      >
                        ↻ Flip Card & View Details
                      </button>
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
      <Footer />
    </div>
  );
}
