import type { Resume, ResumeSections, TemplateId } from '../types';
import { defaultTheme, uuidv4 } from './defaults';

export interface MockarooProfile {
  id: string;
  label: string;
  role: string;
  badge: string;
  description: string;
  template: TemplateId;
  sections: ResumeSections;
}

export const MOCKAROO_PROFILES: MockarooProfile[] = [
  {
    id: 'lead-ai-architect',
    label: 'Lead AI & Full-Stack Architect',
    role: 'Principal Cloud & Machine Learning Engineer',
    badge: 'Tech / AI / FAANG',
    description: 'Generated via Mockaroo Enterprise schema. Features quantified AWS infrastructure achievements, LLM deployments, patents, and top-tier technical skills.',
    template: 'modern',
    sections: {
      personalInfo: {
        name: 'Alexander V. Thorne',
        title: 'Lead AI & Full-Stack Cloud Architect',
        email: 'a.thorne.dev@mockaroo.io',
        phone: '+1 (415) 890-4321',
        address: 'San Francisco, CA • Willing to Relocate',
        linkedin: 'linkedin.com/in/alexander-thorne-ai',
        github: 'github.com/athorne-ai',
        portfolio: 'thorne-architecture.dev',
        website: 'mockaroo.com/candidates/athorne',
        photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
        summary: 'Principal AI & Full-Stack Architect with over 9 years of experience architecting distributed cloud systems and deploying high-throughput Large Language Models (LLMs) to production. Proven track record of spearheading engineering divisions up to 24 developers, cutting AWS hosting expenditures by $420K annually, and accelerating API query throughput by 310%. Holds 2 awarded US Patents in distributed vector database indexing.',
      },
      experience: [
        {
          id: uuidv4(),
          company: 'Vertex Neural Systems Inc.',
          position: 'Principal Staff AI Architect',
          location: 'San Francisco, CA',
          startDate: '2022-03',
          endDate: 'Present',
          current: true,
          description: 'Head of Core AI Infrastructure and Distributed ML Operations across North America and EU.',
          bullets: [
            'Spearheaded the design and deployment of real-time RAG (Retrieval-Augmented Generation) inference clusters serving over 18 million active daily users with sub-85ms latency.',
            'Reduced annual enterprise cloud computing expenses by $420,000 by right-sizing AWS EKS Kubernetes clusters and migrating batch inference to GPU spot instances.',
            'Architected custom multi-tenant vector database synchronization pipelines, boosting document indexing throughput by 310% while achieving zero data corruption events across 4 consecutive quarters.',
            'Mentored and managed a cross-functional engineering organization of 24 senior backend and machine learning engineers across 4 global engineering centers.',
          ],
        },
        {
          id: uuidv4(),
          company: 'CloudScale Dynamic Labs',
          position: 'Senior Lead Backend Engineer',
          location: 'Austin, TX',
          startDate: '2019-06',
          endDate: '2022-02',
          current: false,
          description: 'Core developer for high-scale enterprise API gateways and real-time Kafka streaming architecture.',
          bullets: [
            'Re-engineered legacy monolithic financial transaction service into 14 decoupled microservices using Node.js, Go, and gRPC, increasing peak load capacity by 240%.',
            'Automated multi-region disaster recovery and CI/CD deployment workflows using GitHub Actions and Terraform, slashing production deployment times from 4.5 hours to under 12 minutes.',
            'Designed automated fraud anomaly detection algorithms processing 4,500 transactions per second with 99.8% precision, preventing over $3.2M in unauthorized charges during peak holiday seasons.',
          ],
        },
        {
          id: uuidv4(),
          company: 'NexGen Cyber Security',
          position: 'Software Engineer II',
          location: 'Seattle, WA',
          startDate: '2016-08',
          endDate: '2019-05',
          current: false,
          description: 'Developed real-time network telemetry scanners and automated security compliance dashboards.',
          bullets: [
            'Developed real-time network anomaly telemetry collectors in Python and Rust, capturing and indexing over 1.2 terabytes of packet metadata daily without system degradation.',
            'Collaborated with product and UX engineering teams to launch enterprise client dashboard, resulting in a 38% boost in customer net promoter score (NPS).',
          ],
        },
      ],
      education: [
        {
          id: uuidv4(),
          institution: 'Stanford University',
          degree: 'Master of Science (M.S.)',
          field: 'Computer Science (Artificial Intelligence Track)',
          startDate: '2014-09',
          endDate: '2016-06',
          current: false,
          gpa: '3.94 / 4.0',
          description: 'Thesis: Accelerated Approximate Nearest Neighbor Search in High-Dimensional Embedding Spaces. Tau Beta Pi Engineering Honor Society.',
        },
        {
          id: uuidv4(),
          institution: 'University of California, Berkeley',
          degree: 'Bachelor of Science (B.S.)',
          field: 'Electrical Engineering & Computer Sciences (EECS)',
          startDate: '2010-08',
          endDate: '2014-05',
          current: false,
          gpa: '3.88 / 4.0',
          description: 'Regents’ and Chancellor’s Scholar. President of Association for Computing Machinery (ACM) Student Chapter.',
        },
      ],
      skills: [
        {
          id: uuidv4(),
          category: 'AI & Machine Learning',
          items: ['PyTorch', 'TensorFlow', 'LangChain', 'LlamaIndex', 'vLLM', 'Hugging Face Transformers', 'Vector Databases (Pinecone, Qdrant, Milvus)', 'Fine-Tuning (LoRA, QLoRA)'],
        },
        {
          id: uuidv4(),
          category: 'Core Languages & Backend',
          items: ['Python', 'TypeScript / JavaScript', 'Go (Golang)', 'Rust', 'C++', 'Node.js', 'FastAPI', 'GraphQL', 'gRPC', 'PostgreSQL', 'Redis'],
        },
        {
          id: uuidv4(),
          category: 'Cloud & DevOps Infrastructure',
          items: ['AWS (EKS, SageMaker, Lambda, EC2)', 'Google Cloud Platform (GCP)', 'Kubernetes', 'Docker', 'Terraform', 'Apache Kafka', 'Prometheus & Grafana', 'GitHub Actions CI/CD'],
        },
      ],
      projects: [
        {
          id: uuidv4(),
          name: 'HyperIndex: Open-Source Vector Search Engine',
          description: 'High-throughput, memory-efficient approximate nearest neighbor (ANN) search engine written from scratch in Rust and C++ for ultra-low latency RAG applications.',
          technologies: ['Rust', 'C++', 'SIMD Assembly', 'PyO3 Python Bindings', 'OpenMP'],
          githubUrl: 'github.com/athorne-ai/hyperindex',
          liveUrl: 'hyperindex.mockaroo.dev',
          startDate: '2023-01',
          endDate: '2023-11',
          bullets: [
            'Benchmarked at 4.2x higher query throughput than HNSWLib on 1536-dimensional OpenAI embeddings under high concurrent load.',
            'Acquired over 3,400 GitHub stars and adopted into production by 14 Y-Combinator AI startups within 8 months of launch.',
          ],
        },
      ],
      certificates: [
        {
          id: uuidv4(),
          name: 'AWS Certified Solutions Architect – Professional',
          issuer: 'Amazon Web Services (AWS)',
          date: '2023-08',
          url: 'aws.amazon.com/verification/athorne-pro',
          credentialId: 'AWS-PSA-994821',
        },
        {
          id: uuidv4(),
          name: 'Certified Kubernetes Administrator (CKA)',
          issuer: 'Cloud Native Computing Foundation (CNCF)',
          date: '2022-11',
          url: 'cncf.io/certifications/athorne-cka',
          credentialId: 'LF-CKA-448102',
        },
      ],
      achievements: [
        {
          id: uuidv4(),
          title: 'US Patent Awarded: #US-11,489,203-B2',
          description: 'Invented hierarchical cluster-pruning method for high-dimensional vector similarity retrieval across distributed memory architectures.',
          date: '2023-04',
        },
        {
          id: uuidv4(),
          title: 'ACM Best Technical Paper Award (KDD Conference)',
          description: 'Lead author on "Sub-Millisecond Neural Search at Hyperscale: Architectural Trade-offs in Real-Time Enterprise RAG Engines."',
          date: '2022-08',
        },
      ],
      languages: [
        { id: uuidv4(), name: 'English', proficiency: 'native' },
        { id: uuidv4(), name: 'German', proficiency: 'professional' },
        { id: uuidv4(), name: 'Japanese', proficiency: 'conversational' },
      ],
      interests: [
        { id: uuidv4(), name: 'Autonomous Robotics & Drones' },
        { id: uuidv4(), name: 'High-Altitude Mountaineering' },
        { id: uuidv4(), name: 'Open-Source AI Mentorship' },
        { id: uuidv4(), name: 'Jazz Piano & Acoustic Composition' },
      ],
      references: [
        {
          id: uuidv4(),
          name: 'Dr. Evelyn R. Vance',
          title: 'Chief Technology Officer (CTO)',
          company: 'Vertex Neural Systems Inc.',
          email: 'evance@vertexneural.io',
          phone: '+1 (415) 555-0199',
        },
        {
          id: uuidv4(),
          name: 'Marcus K. Sterling',
          title: 'Vice President of Engineering',
          company: 'CloudScale Dynamic Labs',
          email: 'msterling@cloudscalelabs.com',
          phone: '+1 (512) 555-0842',
        },
      ],
      customSections: [
        {
          id: uuidv4(),
          title: 'Key Publications & Patents',
          items: [
            {
              id: uuidv4(),
              title: 'Distributed Vector Pruning in High-Dimensional Embedding Spaces',
              subtitle: 'United States Patent & Trademark Office (USPTO)',
              date: 'Issued Apr 2023',
              description: 'Patent #US-11,489,203-B2 covering dynamic memory-mapped index sharding for sub-100ms LLM context retrieval over 1B vector datasets.',
            },
            {
              id: uuidv4(),
              title: 'Sub-Millisecond Neural Search at Hyperscale',
              subtitle: 'ACM SIGKDD International Conference on Knowledge Discovery & Data Mining',
              date: 'Aug 2022',
              description: 'Peer-reviewed technical publication detailing latency reductions and memory optimization strategies in distributed vector index clusters.',
            },
          ],
        },
        {
          id: uuidv4(),
          title: 'Community Leadership & Advisory',
          items: [
            {
              id: uuidv4(),
              title: 'Founding Technical Advisor & Mentor',
              subtitle: 'AI Engineering Fellowship (Silicon Valley)',
              date: '2021 – Present',
              description: 'Mentored over 65 early-career machine learning engineers and startup founders on production-grade RAG architecture, vector search scaling, and technical due diligence.',
            },
          ],
        },
      ],
    },
  },
  {
    id: 'senior-finance-analyst',
    label: 'Senior Investment Banking Vice President',
    role: 'Global M&A & Private Equity Vice President',
    badge: 'Finance / Investment / Wall Street',
    description: 'Generated via Mockaroo Financial data schema. Emphasizes multi-billion dollar M&A execution, discounted cash flow modeling, and institutional leadership.',
    template: 'professional',
    sections: {
      personalInfo: {
        name: 'Julianne M. Kensington',
        title: 'Vice President of Investment Banking (M&A)',
        email: 'j.kensington@mockaroo.io',
        phone: '+1 (212) 940-8811',
        address: 'New York, NY • Wall Street District',
        linkedin: 'linkedin.com/in/julianne-kensington-ib',
        github: '',
        portfolio: 'kensington-advisory.mockaroo.com',
        website: 'mockaroo.com/candidates/jkensington',
        photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
        summary: 'Accomplished Investment Banking Vice President with 10+ years of high-stakes corporate finance, cross-border M&A execution, and leveraged buyout (LBO) advisory across Technology, Healthcare, and Industrials. Has advised on closed transactions totaling over $14.8 Billion in aggregate enterprise value. Skilled in complex financial valuation, C-suite relationship building, and building high-octane deal execution teams.',
      },
      experience: [
        {
          id: uuidv4(),
          company: 'Goldman & Sterling Partners LLC',
          position: 'Vice President – Global Technology & M&A Group',
          location: 'New York, NY',
          startDate: '2021-01',
          endDate: 'Present',
          current: true,
          description: 'Lead execution officer for enterprise software, SaaS, and AI corporate restructuring transactions.',
          bullets: [
            'Spearheaded deal execution and buy-side advisory for the $3.4B cross-border acquisition of a premier European cloud infrastructure provider by a Fortune 100 enterprise.',
            'Architected comprehensive financial valuation models (DCF, LBO, Trading/Transaction Multiples) and led management presentations, securing board approval across 8 Tier-1 institutional bidders.',
            'Expanded annual advisory fee revenues within the FinTech sector by 42% ($14.5M incremental revenue) by originating strategic partnerships with mid-market venture capital sponsors.',
            'Recruited, trained, and managed a team of 14 investment banking associates and analysts across New York and London execution desks.',
          ],
        },
        {
          id: uuidv4(),
          company: 'Morgan & Stanley Global Capital',
          position: 'Investment Banking Associate',
          location: 'New York, NY',
          startDate: '2017-07',
          endDate: '2020-12',
          current: false,
          description: 'Key execution team member for initial public offerings (IPOs) and strategic debt restructuring.',
          bullets: [
            'Co-managed the $1.25B Initial Public Offering (IPO) of a leading cybersecurity software platform, coordinating registration statements (Form S-1) with legal counsel and the SEC.',
            'Executed complex capital structure optimization and $650M syndicated senior secured debt refinancing, lowering client weighted average cost of capital (WACC) by 185 basis points.',
            'Formulated detailed due diligence data rooms and strategic board presentations for 12 sell-side M&A mandates resulting in an average transaction premium of 28% over 30-day VWAP.',
          ],
        },
      ],
      education: [
        {
          id: uuidv4(),
          institution: 'Wharton School of the University of Pennsylvania',
          degree: 'Master of Business Administration (M.B.A.)',
          field: 'Finance & Strategic Management Track',
          startDate: '2015-08',
          endDate: '2017-05',
          current: false,
          gpa: '3.96 / 4.0',
          description: 'Palmer Scholar (Top 5% of graduating class). President of Wharton Private Equity & Venture Capital Club.',
        },
        {
          id: uuidv4(),
          institution: 'Columbia University',
          degree: 'Bachelor of Arts (B.A.)',
          field: 'Economics & Applied Mathematics',
          startDate: '2011-09',
          endDate: '2015-05',
          current: false,
          gpa: '3.92 / 4.0',
          description: 'Summa Cum Laude. Phi Beta Kappa. Member of Columbia Investment Banking Division.',
        },
      ],
      skills: [
        {
          id: uuidv4(),
          category: 'Financial Engineering & Modeling',
          items: ['Discounted Cash Flow (DCF)', 'Leveraged Buyout (LBO) Modeling', 'Accretion / Dilution Analysis', 'Comparable Company & Transaction Valuation', 'Capital Structure & Debt Debt Syndication', 'Sensitivity & Monte Carlo Simulation'],
        },
        {
          id: uuidv4(),
          category: 'Industry Tools & Intelligence',
          items: ['Bloomberg Terminal', 'FactSet', 'Capital IQ', 'PitchBook / Preqin', 'Advanced Excel Financial VBA & Macro Automation', 'PowerPoint C-Suite Deck Architecture'],
        },
      ],
      projects: [],
      certificates: [
        {
          id: uuidv4(),
          name: 'FINRA Series 7 & Series 63 Securities Licenses',
          issuer: 'Financial Industry Regulatory Authority (FINRA)',
          date: '2017-08',
          url: 'brokercheck.finra.org/individual/jkensington',
          credentialId: 'CRD-88210491',
        },
        {
          id: uuidv4(),
          name: 'Chartered Financial Analyst (CFA) Charterholder',
          issuer: 'CFA Institute',
          date: '2019-09',
          url: 'cfainstitute.org/verification/jkensington',
          credentialId: 'CFA-ID-339102',
        },
      ],
      achievements: [
        {
          id: uuidv4(),
          title: 'Wall Street Journal "40 Under 40 in Dealmaking"',
          description: 'Selected from over 1,200 global nominees for exceptional M&A execution and client leadership.',
          date: '2023-10',
        },
      ],
      languages: [
        { id: uuidv4(), name: 'English', proficiency: 'native' },
        { id: uuidv4(), name: 'French', proficiency: 'professional' },
      ],
      interests: [
        { id: uuidv4(), name: 'Contemporary Art Collecting & Curation' },
        { id: uuidv4(), name: 'Competitive Marathon Running (Boston Qualifier)' },
        { id: uuidv4(), name: 'Philanthropic Education Foundations' },
      ],
      references: [
        {
          id: uuidv4(),
          name: 'Richard H. Montgomery',
          title: 'Managing Director & Head of M&A',
          company: 'Goldman & Sterling Partners LLC',
          email: 'rmontgomery@goldmansterling.com',
          phone: '+1 (212) 555-0488',
        },
      ],
      customSections: [
        {
          id: uuidv4(),
          title: 'Selected Representative Transactions',
          items: [
            {
              id: uuidv4(),
              title: '$3.4B Acquisition of CloudScale NV by Enterprise Corp',
              subtitle: 'Lead Financial Advisor (Sell-Side)',
              date: 'Closed Nov 2023',
              description: 'Coordinated global cross-border financial valuation, regulatory clearance across 6 EU jurisdictions, and financing syndicate arrangement.',
            },
            {
              id: uuidv4(),
              title: '$1.25B Initial Public Offering of SecureNet AI Platform',
              subtitle: 'Joint Bookrunner Execution Team',
              date: 'Closed Apr 2022',
              description: 'Managed prospectus drafting, investor roadshow presentations across 14 cities, and book building oversubscribed by 11.4x.',
            },
          ],
        },
      ],
    },
  },
  {
    id: 'global-marketing-director',
    label: 'Global Product Marketing & Brand Director',
    role: 'Chief Marketing Officer / Head of Growth',
    badge: 'Marketing / Growth / SaaS',
    description: 'Generated via Mockaroo Growth & CMO schema. Highlights user acquisition scaling (+340%), brand repositioning, and multi-channel enterprise demand generation.',
    template: 'creative',
    sections: {
      personalInfo: {
        name: 'Elena D. Rostova',
        title: 'Global Head of Product Marketing & Growth Strategy',
        email: 'elena.rostova@mockaroo.io',
        phone: '+1 (310) 840-7722',
        address: 'Los Angeles, CA • Remote Eligible',
        linkedin: 'linkedin.com/in/elena-rostova-cmo',
        github: '',
        portfolio: 'elenarostova.mockaroo.com',
        website: 'mockaroo.com/candidates/erostova',
        photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80',
        summary: 'Visionary Global Product Marketing & Growth Director with 11+ years of proven success scaling B2B SaaS and high-velocity consumer tech brands from Series B to IPO. Master of go-to-market (GTM) execution, performance marketing, and developer evangelism. Has engineered product launches generating over $85M in Annual Recurring Revenue (ARR) while cutting Customer Acquisition Cost (CAC) by 38% across global markets.',
      },
      experience: [
        {
          id: uuidv4(),
          company: 'HyperGrowth Cloud Platform',
          position: 'Global Vice President of Product Marketing & Growth',
          location: 'San Francisco, CA (Hybrid)',
          startDate: '2021-04',
          endDate: 'Present',
          current: true,
          description: 'Owner of global go-to-market strategy, product positioning, and enterprise demand generation.',
          bullets: [
            'Spearheaded the go-to-market (GTM) launch of our flagship AI developer workbench, generating $28M in incremental Annual Recurring Revenue (ARR) within 12 months.',
            'Engineered a data-driven product-led growth (PLG) self-serve onboarding funnel that increased free-to-paid user conversion rates from 3.2% to 8.7% across 450,000 monthly signups.',
            'Optimized multi-channel digital performance marketing budgets ($12M annual spend across Google, LinkedIn, and developer ecosystems), slashing Customer Acquisition Cost (CAC) by 38% while boosting Customer Lifetime Value (LTV) by 64%.',
            'Recruited and led a high-octane global marketing team of 28 brand managers, content strategists, growth analysts, and developer advocates.',
          ],
        },
        {
          id: uuidv4(),
          company: 'Pulse Digital Media Labs',
          position: 'Senior Director of Brand & Demand Generation',
          location: 'Los Angeles, CA',
          startDate: '2018-02',
          endDate: '2021-03',
          current: false,
          description: 'Led global brand rebranding, performance advertising, and executive events.',
          bullets: [
            'Orchestrated comprehensive corporate rebrand across 18 international markets, driving a 140% surge in unaided brand awareness and 210% growth in inbound qualified sales leads.',
            'Coordinated annual global user conference hosting over 6,500 enterprise customers and developer leaders, generating $18.5M in closed-won contract pipeline.',
          ],
        },
      ],
      education: [
        {
          id: uuidv4(),
          institution: 'Northwestern University – Kellogg School of Management',
          degree: 'Master of Business Administration (M.B.A.)',
          field: 'Marketing Strategy & Digital Innovation',
          startDate: '2014-08',
          endDate: '2016-05',
          current: false,
          gpa: '3.91 / 4.0',
          description: 'Dean’s List. Winner of Kellogg Global Marketing Case Competition.',
        },
      ],
      skills: [
        {
          id: uuidv4(),
          category: 'Growth & Demand Generation',
          items: ['Product-Led Growth (PLG)', 'Go-To-Market (GTM) Strategy', 'Account-Based Marketing (ABM)', 'Conversion Rate Optimization (CRO)', 'Performance Marketing (Google, LinkedIn, Meta)', 'SEO & Content Funnel Architecture'],
        },
        {
          id: uuidv4(),
          category: 'Analytics & MarTech Stack',
          items: ['HubSpot Enterprise', 'Salesforce CRM', 'Google Analytics 4 & BigQuery', 'Mixpanel / Amplitude User Telemetry', 'Marketo', 'Tableau Executive Dashboards'],
        },
      ],
      projects: [],
      certificates: [],
      achievements: [
        {
          id: uuidv4(),
          title: 'AdAge "CMO to Watch" Annual Award Winner',
          description: 'Recognized for pioneering AI-driven product positioning and developer community growth.',
          date: '2023-06',
        },
      ],
      languages: [
        { id: uuidv4(), name: 'English', proficiency: 'native' },
        { id: uuidv4(), name: 'Spanish', proficiency: 'professional' },
      ],
      interests: [
        { id: uuidv4(), name: 'Documentary Filmmaking & Visual Arts' },
        { id: uuidv4(), name: 'Keynote Public Speaking on Women in Tech' },
      ],
      references: [],
      customSections: [
        {
          id: uuidv4(),
          title: 'Keynote Speaking & Industry Panels',
          items: [
            {
              id: uuidv4(),
              title: 'Keynote Speaker: The Future of Product-Led AI Growth',
              subtitle: 'SaaStr Annual Global Conference (San Francisco)',
              date: 'Sep 2023',
              description: 'Delivered mainstage presentation to over 4,000 SaaS founders and marketing executives detailing data-driven onboarding funnels.',
            },
          ],
        },
      ],
    },
  },
];

export function getMockarooProfile(id?: string): MockarooProfile {
  if (!id) return MOCKAROO_PROFILES[0];
  return MOCKAROO_PROFILES.find((p) => p.id === id) || MOCKAROO_PROFILES[0];
}

export function generateResumeFromMockaroo(profile: MockarooProfile): Resume {
  return {
    id: uuidv4(),
    userId: 'mockaroo-user',
    title: `${profile.label} (Mockaroo Data)`,
    template: profile.template,
    theme: {
      ...defaultTheme,
      primaryColor: profile.template === 'creative' ? '#ec4899' : profile.template === 'professional' ? '#1e293b' : '#3b5bff',
      accentColor: profile.template === 'creative' ? '#f43f5e' : profile.template === 'professional' ? '#475569' : '#7c3aed',
    },
    sections: profile.sections,
    sectionOrder: [
      'personalInfo',
      'experience',
      'education',
      'skills',
      ...(profile.sections.projects.length > 0 ? ['projects'] : []),
      ...(profile.sections.certificates.length > 0 ? ['certificates'] : []),
      ...(profile.sections.achievements.length > 0 ? ['achievements'] : []),
      ...(profile.sections.languages.length > 0 ? ['languages'] : []),
      ...(profile.sections.interests.length > 0 ? ['interests'] : []),
      ...(profile.sections.references.length > 0 ? ['references'] : []),
      ...profile.sections.customSections.map((cs) => `custom_${cs.id}`),
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}
