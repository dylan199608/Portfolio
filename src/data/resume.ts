/**
 * Single source of truth for all portfolio content.
 * Everything here is taken from Dylan Allen's resume — edit this file to update the site.
 */

export interface Profile {
  name: string
  initials: string
  role: string
  location: string
  email: string
  phone: string
  /** Lists the phone number in the Contact section. Set to false to keep it only on the downloadable resume. */
  showPhone: boolean
  linkedin: string
  linkedinHandle: string
  resumeUrl: string
  /** Hero headline, drawn from the resume summary. */
  headline: string
  /** Short hero sub-headline. */
  intro: string
  /** First-person About summary, one paragraph per entry. The resume's opening sentence lives in `intro`. */
  summary: string[]
}

export interface Stat {
  value: string
  label: string
}

export interface FocusArea {
  title: string
  description: string
  /** lucide-react icon name used by the About section. */
  icon: 'ListChecks' | 'ScanSearch' | 'ShieldCheck' | 'Layers'
}

export interface SkillGroup {
  /** Stable key for the group; the Skills section picks each card's icon by it. */
  id: 'ai' | 'languages' | 'backend' | 'frontend' | 'data' | 'cloud' | 'practices'
  category: string
  /** Optional one-line context shown on the featured skills card. */
  description?: string
  skills: string[]
}

export interface Role {
  title: string
  company: string
  location: string
  start: string
  end: string
  current: boolean
  summary: string
  highlights: string[]
  tags: string[]
}

export interface FlowStep {
  label: string
  /** True for a stage that checks, scores, or gates model output rather than produces it. */
  check?: boolean
}

export interface Project {
  slug: string
  title: string
  org: string
  period: string
  summary: string
  highlights: string[]
  stack: string[]
  /** Ordered stages of the system, used to draw a small flow diagram. */
  flow: FlowStep[]
}

export interface Education {
  school: string
  /** Abbreviated degree as written on the resume, e.g. "B.S.". */
  degree: string
  /** The degree spelled out, e.g. "Bachelor of Science". */
  degreeName: string
  field: string
  /** Graduation year. */
  year: string
}

/** Ids of the page sections that appear in the navigation. */
export type SectionId = 'about' | 'work' | 'experience' | 'education' | 'skills' | 'contact'

export interface NavLink {
  id: SectionId
  label: string
}

export const profile: Profile = {
  name: 'Dylan Allen',
  initials: 'DA',
  role: 'Senior AI Engineer',
  location: 'Mississippi, United States',
  email: 'dylanallen19968@gmail.com',
  phone: '+1 901 661 2027',
  showPhone: true,
  linkedin: 'https://www.linkedin.com/in/dylan-allen-589882436',
  linkedinHandle: 'in/dylan-allen-589882436',
  resumeUrl: '/Dylan-Allen-Resume.pdf',
  headline: 'I find where models get things wrong — and build the checks that catch it.',
  intro:
    'Senior AI Engineer with 8+ years building production web applications and, for the past four, the LLM systems inside them.',
  summary: [
    // \u2060 (word joiner) after the hyphen keeps "OpenAI-based" from breaking across lines.
    'I work full stack in Python, Java, TypeScript, React, and SQL, with a deep recent focus on OpenAI-\u2060based systems: prompt design, retrieval, output validation, and evaluation.',
    'I own features end to end, from schema and API to the shipped interface, including the validation, evaluation, and review steps that catch model errors before users do.',
    'My work has been in healthcare and enterprise environments, where correctness, privacy, and reliability matter more than novelty.',
  ],
}

/** The facts row under the Hero intro. */
export const headlineStats: Stat[] = [
  { value: '8+', label: 'Years building production web applications' },
  { value: '4', label: 'Years shipping LLM systems' },
]

/** The stat tiles in About. */
export const stats: Stat[] = [
  { value: 'E2E', label: 'End-to-end feature ownership, backend to UI' },
  { value: 'HIPAA', label: 'RBAC, audit logging, and secure PHI handling' },
]

export const focusAreas: FocusArea[] = [
  {
    title: 'LLM Evaluation',
    description:
      'Rubric design, side-by-side preference ranking, and failure-pattern analysis that make model quality measurable rather than subjective.',
    icon: 'ListChecks',
  },
  {
    title: 'Retrieval (RAG)',
    description:
      'Embeddings and vector search over document sets, so answers are grounded and traceable to their source documents.',
    icon: 'ScanSearch',
  },
  {
    title: 'Guardrails & Validation',
    description:
      'JSON schema enforcement, field-level validation, confidence scoring, and human-in-the-loop review routing before model output is persisted.',
    icon: 'ShieldCheck',
  },
  {
    title: 'Full-Stack Delivery',
    description:
      'Python, Java, TypeScript, React, and SQL across REST APIs, microservices, data pipelines, and dashboards.',
    icon: 'Layers',
  },
]

export const skills: SkillGroup[] = [
  {
    id: 'ai',
    category: 'AI & LLM Systems',
    description:
      'The part of the stack I go deepest on, from the first prompt to the last check on what the model returns.',
    skills: [
      'OpenAI API',
      'Prompt Engineering',
      'Retrieval Augmented Generation',
      'Embeddings & Vector Search',
      'LLM Evaluation & Rubric Design',
      'Response Ranking',
      'Hallucination Detection',
      'Output Validation & Guardrails',
      'Human-in-the-Loop Review',
      'Responsible AI',
      'AI Workflow Automation',
    ],
  },
  {
    id: 'languages',
    category: 'Languages',
    skills: ['Python', 'Java', 'TypeScript', 'JavaScript', 'SQL'],
  },
  {
    id: 'backend',
    category: 'Backend & APIs',
    skills: [
      'FastAPI',
      'Node.js',
      'REST API Design',
      'Microservices',
      'ETL & Data Pipelines',
      'Third-Party Integrations',
    ],
  },
  {
    id: 'frontend',
    category: 'Frontend',
    skills: ['React', 'Next.js', 'Dashboards & Data Visualization'],
  },
  {
    id: 'data',
    category: 'Data',
    skills: [
      'PostgreSQL',
      'MySQL',
      'Schema Design',
      'Query Optimization',
      'Document Analysis & Data Extraction',
    ],
  },
  {
    id: 'cloud',
    category: 'Cloud & DevOps',
    skills: ['AWS', 'Docker', 'CI/CD', 'Git / GitHub'],
  },
  {
    id: 'practices',
    category: 'Practices & Compliance',
    skills: [
      'HIPAA',
      'RBAC & Audit Logging',
      'Agile / Scrum',
      'Code Review',
      'Unit Testing',
      'Debugging',
    ],
  },
]

export const experience: Role[] = [
  {
    title: 'Senior AI Engineer',
    company: 'Akveo',
    location: 'Austin, TX',
    start: 'Jun 2024',
    end: 'Present',
    current: true,
    summary: 'Finding where LLM responses fail, and turning those failures into better prompts and scoring.',
    highlights: [
      'Designed and executed evaluation frameworks for LLM responses, scoring accuracy, clarity, relevance, completeness, instruction following, and safety across enterprise business and technical use cases.',
      'Developed and iterated prompts to test model behavior against realistic business scenarios, including process optimization, reporting, workflow automation, data analysis, and software support tasks.',
      'Built scoring rubrics and structured evaluation criteria that improved consistency across repeated tasks and made model quality measurable rather than subjective.',
      'Performed side-by-side comparison and preference ranking of competing model responses, selecting stronger outputs on correctness, completeness, reasoning quality, and end-user value.',
      'Identified and documented hallucinations, unsupported claims, faulty reasoning chains, incorrect business logic, and formatting failures in model-generated output.',
      'Analyzed failures across large evaluation volumes to surface recurring patterns, then recommended changes to prompt design, response structure, and evaluation criteria.',
      'Wrote detailed technical feedback and error annotations to guide model improvement and fine-tuning, applying structured annotation guidelines to keep evaluations consistent and reproducible.',
      'Advanced responsible AI practice by testing outputs for safety, bias, and reliability before production use.',
    ],
    tags: [
      'LLM Evaluation',
      'Rubric Design',
      'Preference Ranking',
      'Hallucination Detection',
      'Prompt Engineering',
      'Responsible AI',
    ],
  },
  {
    title: 'Software Engineer',
    company: 'Orangesoft',
    location: 'Sheridan, WY',
    start: 'Oct 2022',
    end: 'May 2024',
    current: false,
    summary:
      'Shipped production LLM features in a HIPAA-aware healthcare environment — retrieval pipelines, guardrails, APIs, and the interfaces used to review AI output.',
    highlights: [
      'Developed and deployed production LLM features using the OpenAI API and GPT models, including document analysis, structured data extraction, conversational AI assistants, NLP, text generation, and AI workflow automation.',
      'Applied prompt engineering as a repeatable process by building evaluation sets of known inputs and expected outputs, running A/B comparisons across prompt versions, and measuring accuracy before deploying changes to production.',
      'Implemented Retrieval Augmented Generation (RAG) pipelines with embeddings and vector search over client document sets, improving factual accuracy, reducing hallucinations, and making AI responses traceable to source documents.',
      'Engineered backend guardrails for LLM output, including JSON schema enforcement, field-level validation, confidence scoring, and human-in-the-loop review routing, so model-generated data met accuracy requirements before database persistence.',
      'Optimized AI system cost and latency through per-task model selection, prompt and context window reduction, response caching, and asynchronous background processing.',
      'Designed and developed RESTful APIs and backend services in Python, Java, and Node.js for user management, clinical workflows, reporting, data processing, ETL pipelines, scheduled jobs, and third-party API integrations.',
      'Built responsive front ends in React, TypeScript, and JavaScript for AI output review, chat interfaces, multistep forms, dashboards, and data visualization.',
      'Delivered software in a HIPAA-aware healthcare environment, implementing RBAC, audit logging, least-privilege data access, and secure handling of PHI.',
    ],
    tags: ['OpenAI API', 'RAG', 'Guardrails', 'Python', 'Java', 'Node.js', 'React', 'TypeScript', 'HIPAA'],
  },
  {
    title: 'Backend Developer',
    company: 'Geomotiv',
    location: 'Alexandria, VA',
    start: 'Jun 2018',
    end: 'Oct 2022',
    current: false,
    summary: 'Server-side engineering for AI features: APIs, integrations, and the workflows behind them.',
    highlights: [
      'Designed and developed backend services and AI-powered features for web applications using Python, FastAPI, OpenAI APIs, and modern JavaScript frameworks.',
      'Built LLM workflows for chatbot support, document analysis, text generation, data extraction, and process automation.',
      'Implemented RAG and prompt engineering practices, testing against real user scenarios and edge cases, then refining prompts, logic, and validation rules from results.',
      'Engineered reusable backend services and API endpoints for AI features, covering request handling, response formatting, error handling, and logging.',
      'Integrated AI services with backend APIs, relational databases, and frontend applications to support end-to-end user experiences.',
      'Partnered with product managers, designers, and developers to translate business needs into practical AI solutions.',
    ],
    tags: ['Python', 'FastAPI', 'OpenAI API', 'RAG', 'REST APIs', 'JavaScript'],
  },
]

export const projects: Project[] = [
  {
    slug: 'llm-evaluation-framework',
    title: 'LLM Evaluation & Scoring Framework',
    org: 'Akveo',
    period: 'Jun 2024 – Present',
    summary: 'A consistent, repeatable way to judge model output, with recurring failures fed back into the prompts.',
    highlights: [
      'Built rubric-based evaluation criteria and annotation guidelines for scoring LLM responses on accuracy, completeness, instruction following, and safety across enterprise business and technical use cases.',
      'Ran side-by-side preference ranking and failure pattern analysis across large evaluation volumes, feeding findings directly into prompt redesign and fine-tuning feedback.',
    ],
    stack: ['Python', 'OpenAI API', 'Structured Rubrics', 'Annotation Tooling', 'Responsible AI Testing'],
    flow: [
      { label: 'Scenarios' },
      { label: 'Responses' },
      { label: 'Rubric scoring', check: true },
      { label: 'Preference ranking', check: true },
      { label: 'Failure analysis' },
      { label: 'Prompt redesign' },
    ],
  },
  {
    slug: 'rag-document-intelligence',
    title: 'RAG Document Intelligence Pipeline',
    org: 'Orangesoft',
    period: '2023 – 2024',
    summary: 'Grounded answers and validated data extraction in a healthcare setting, tuned for cost and latency.',
    highlights: [
      'Built a Retrieval Augmented Generation pipeline with embeddings and vector search over client document sets so every answer is traceable to its source document.',
      'Added structured data extraction with JSON schema enforcement, field-level validation, confidence scoring, and human-in-the-loop review routing before database persistence.',
      'Reduced cost and latency through per-task model selection, context window trimming, response caching, and asynchronous processing, all delivered in a HIPAA-aware environment.',
    ],
    stack: ['Python', 'FastAPI', 'OpenAI API', 'Embeddings & Vector Search', 'PostgreSQL', 'React / TypeScript'],
    flow: [
      { label: 'Documents' },
      { label: 'Embed & index' },
      { label: 'Retrieve' },
      { label: 'Generate' },
      { label: 'Validate', check: true },
      { label: 'Human review', check: true },
      { label: 'Persist' },
    ],
  },
  {
    slug: 'conversational-ai-assistant',
    title: 'Conversational AI Assistant & Workflow Automation',
    org: 'Geomotiv',
    period: '2021 – 2022',
    summary: 'Chatbot and automation workflows served through reusable APIs, with prompts refined by testing.',
    highlights: [
      'Built LLM-based chatbot support, document analysis, and data extraction workflows on the OpenAI API, exposed through reusable FastAPI endpoints and integrated with backend services and databases.',
      'Established a prompt iteration and evaluation practice by testing against real user scenarios and edge cases, then refining prompts, logic, and validation rules from the results.',
    ],
    stack: ['Python', 'FastAPI', 'OpenAI API', 'JavaScript', 'REST APIs'],
    flow: [
      { label: 'User request' },
      { label: 'FastAPI endpoint' },
      { label: 'LLM workflow' },
      { label: 'Validation rules', check: true },
      { label: 'Services & DB' },
    ],
  },
]

/** Degrees, most recent first. */
export const education: Education[] = [
  {
    school: 'University of Mississippi',
    degree: 'B.S.',
    degreeName: 'Bachelor of Science',
    field: 'Computer Science',
    year: '2018',
  },
]

export const navLinks: NavLink[] = [
  { id: 'about', label: 'About' },
  { id: 'work', label: 'Work' },
  { id: 'experience', label: 'Experience' },
  { id: 'education', label: 'Education' },
  { id: 'skills', label: 'Skills' },
  { id: 'contact', label: 'Contact' },
]
