/**
 * Source of truth for the native resume page at /resume/.
 *
 * Mirrors `public/resume/` so the HTML version and the PDF stay in step. When
 * you revise the PDF, revise this file in the same pass — nothing enforces it
 * automatically.
 */

export interface ResumeContact {
  label: string
  value: string
  href?: string
}

export interface ResumeSkillGroup {
  heading: string
  items: string[]
}

export interface ResumeRole {
  title: string
  company: string
  mode: string
  period: string
  /** One-line description of the employer, italicised on the page. */
  about?: string
  /** Framing sentence that precedes the bullets. */
  intro?: string
  bullets: string[]
}

export interface ResumeProjectBlock {
  heading?: string
  items: string[]
}

export interface ResumeProject {
  title: string
  subtitle: string
  period: string
  link?: string
  /** Links to the on-site case study when one exists. */
  caseStudyId?: string
  blocks: ResumeProjectBlock[]
}

export const resumeFile = '/resume/Software Developer | Mikhail-Ajaj.pdf'

export const resumeHeader = {
  name: 'Mikhail Ajaj',
  title: 'Software Developer',
  location: 'Burlington, ON',
}

export const resumeContacts: ResumeContact[] = [
  {
    label: 'Email',
    value: 'mikhailajaj@gmail.com',
    href: 'mailto:mikhailajaj@gmail.com',
  },
  {
    label: 'Website',
    value: 'mikhailajaj.github.io',
    href: 'https://mikhailajaj.github.io/',
  },
  {
    label: 'Location',
    value: 'Burlington, ON',
  },
]

export const resumeSummary =
  'Humble forever student developing and sharpening my skills in software engineering. Currently working as a Data Analyst at Tandia Financial, a recent graduate of Sheridan College (Aug 2026), with strong experience in data-driven development, software development, AI agentic development, and C#. Burlington resident who values in-person collaboration and has developed a deep understanding of software engineering and architecture. Proven project management and team building skills, passionate about translating business requirements into robust technical solutions.'

export const resumeSkills: ResumeSkillGroup[] = [
  {
    heading: 'Languages & Frameworks',
    items: [
      '.NET C#',
      'Python',
      'SQL',
      'Power BI (advanced)',
      'JavaScript / TypeScript (advanced)',
      'Kotlin',
      'Swift',
      'Node.js',
      'React',
      'Figma',
      'Visual Paradigm',
    ],
  },
  {
    heading: 'Cloud & DevOps',
    items: [
      'Microsoft Azure',
      'AWS',
      'Git',
      'Azure DevOps',
      'Jira',
      'CI/CD',
      'REST APIs',
    ],
  },
  {
    heading: 'Data & Automation',
    items: [
      'Excel',
      'Data Modeling',
      'Predictive Modeling (ML)',
      'Visualization',
      'Business Intelligence',
      'Report Automation',
    ],
  },
  {
    heading: 'Methods & Collaboration',
    items: ['Agile (Scrum)', 'Project Management', 'Project Planning'],
  },
]

export const resumeCompetencies = [
  'Full-Stack Development & Problem-Solving',
  'Agile Team Collaboration',
  'Mobile Development & Quality Assurance',
  'Technical Documentation & Communication',
  'Customer-Focused Solution Design',
  'Continuous Learning & Adaptability',
]

export const resumeSoftSkills = [
  'Feedback Receptive',
  'User Oriented',
  'Results Driven',
  'Goal Oriented',
]

export const resumeExperience: ResumeRole[] = [
  {
    title: 'Junior Data Analyst',
    company: 'Tandia Financial',
    mode: 'Hybrid',
    period: 'Aug 2026 – Dec 2026',
    about:
      'Tandia Financial is driven to lead the co-operative banking movement by delivering unparalleled products and services through a mutually rewarding relationship with our members and the communities we serve.',
    intro:
      'Full-time temporary employment; in addition to my current responsibilities I am taking on the role of data engineering:',
    bullets: [
      'Restructuring the data warehouse, cleaning the data by creating pipelines',
      'Working with staff to create Python scripts that automate repetitive tasks',
    ],
  },
  {
    title: 'IT Student — Co-op',
    company: 'Tandia Financial',
    mode: 'Hybrid',
    period: 'May 2026 – Jul 2026',
    about:
      'Tandia Financial is driven to lead the co-operative banking movement by delivering unparalleled products and services through a mutually rewarding relationship with our members and the communities we serve.',
    intro:
      'Grateful to be working at Tandia as a Data Analyst alongside a Senior Software Developer. Some of what I have been doing:',
    bullets: [
      "Translating stakeholders' requirements into interactive visualizations",
      'Participating in ongoing meetings to improve, validate, and refine the user experience',
      'Migrating from an MIS reporting system to paginated reports and Power BI Service (completed related coursework along the way)',
      'Reviewing data model architecture against best practices',
      'Partnering with the marketing department to standardize Power BI themes and visual components',
      'Writing Python scripts for more customized tasks',
      'Exploring the DBMS to build a comprehensive understanding of the data structures',
    ],
  },
  {
    title: 'Software Developer (Intern)',
    company: 'Linkify',
    mode: 'Remote',
    period: 'Jan 2026 – Apr 2026',
    about:
      'Linkify Solutions builds enterprise-grade custom software for businesses worldwide, creating software and tools that help e-commerce stores upgrade their services with as little as one click.',
    intro:
      'Using best practices of agentic software development to build, improve and test three Shopify applications:',
    bullets: [
      "Created an LLMs.txt application from scratch to help AI agents read a merchant's products and collections from a single page, with filtering, analytics and customization of product data",
      'Created a project capable of backing up an entire e-commerce store to .csv and JSONL as a downloadable backup, released with best practices and backend processes for long-running operations and real-time syncs at minimal cost',
      'Variant Organizer (Shopify App Store): rewrote a legacy codebase into a modular, maintainable application with clear separation of concerns and independent UI components; shipped a new major release featuring a redesigned interface and in-app tutorial',
    ],
  },
]

export const resumeEducation = {
  degree: 'Honours Bachelor of Computer Science (Mobile Computing)',
  institution: 'Sheridan College',
  location: 'Oakville, ON',
  period: 'August 2026',
  href: '/education/',
}

export const resumeProjects: ResumeProject[] = [
  {
    title: 'Capstone Project',
    subtitle: 'PulseShare — Blood Donation Management System',
    period: 'Sep 2024 – Dec 2025',
    caseStudyId: 'pulseshare',
    blocks: [
      {
        heading: 'Management System for Healthcare',
        items: [
          'Developed a comprehensive blood donation management system serving donors, staff, and admin users',
          'Implemented role-based authentication with custom views, admin invitations, and staff account creation',
          'Built an inventory management system tracking donation processes from booking to completion',
          'Created analytics and insights features for data-driven organizational decisions',
        ],
      },
      {
        heading: 'Technical Implementation',
        items: [
          'Frontend stack: Next.js (React), SwiftUI (iOS), Kotlin (Android)',
          'Backend: Supabase with SQL database management and REST API integration',
          'Process automation: QR code generation, appointment booking, and inventory updates',
          'Business intelligence: analytics dashboard and chatbot for customer support',
        ],
      },
      {
        heading: 'Real-World Impact',
        items: [
          'Streamlined the blood donation workflow from appointment booking to inventory management',
          'Delivered a client-focused solution addressing healthcare sector needs',
        ],
      },
    ],
  },
  {
    title: 'Project Owner / Software Architect',
    subtitle: 'Secret Santa (invitation system) — Group Project',
    period: 'Jan 2024 – Apr 2024',
    link: 'https://github.com/mikhailajaj/SecretSanta',
    blocks: [
      {
        items: [
          'Optimized project management with Jira, significantly increasing development speed and team efficiency',
          'Created a Visual Paradigm repository, ensuring accuracy and reducing clarification time, which enhanced team collaboration',
          'Formulated business rules and stakeholder relations, boosting governance and reducing compliance risks',
          'Designed a Figma prototype to refine UI/UX, receiving early feedback that reduced design revisions',
          'Standardized development using Git integration, which optimized code sharing and streamlined continuous integration',
          'Implemented AWS for secure authentication and efficient data management, improving overall system performance',
        ],
      },
    ],
  },
  {
    title: 'Mobile Application Development',
    subtitle: 'CardHouse Game Tutorial — React Native & Problem Solving',
    period: 'Jan 2023 – Apr 2023',
    caseStudyId: 'tarneeb-online',
    blocks: [
      {
        items: [
          'Developed a mobile application using React Native, functioning as a tutorial for the Tarneeb card game',
          'Implemented data structures and algorithms to store and manage game data, state, and logic',
          'Applied problem-solving methodologies for game mechanics and user interaction design',
          'Created a functional gaming experience with demonstration capabilities',
        ],
      },
    ],
  },
  {
    title: 'Machine Learning Activity',
    subtitle: 'Classification | Regression | Clustering | Neural Networks',
    period: 'Jan 2023 – Apr 2023',
    link: 'https://github.com/mikhailajaj/Ai_Classification_Abalone_Sex',
    blocks: [
      {
        items: [
          'Analyzing, cleaning, preprocessing datasets — one-hot encoding categorical features, handling missing values, and engineering/scaling features (including polynomial transforms) ahead of model training',
          'Grid-searching and cross-validating classifiers (Logistic Regression, Random Forest, KNN, SVM) and regressors (Ridge, Lasso, Elastic Net), selecting each by accuracy or RMSE',
          'Applying K-means clustering and the elbow method to recover natural groupings from unlabeled data',
          'Designing and comparing dense and convolutional neural network architectures in TensorFlow/Keras, testing dropout and optimizer choices (Adam vs. SGD) for overfitting and accuracy trade-offs',
          'Benchmarking classification models with PyCaret on a 3-class sex-classification problem, reporting accuracy, AUC, F1, Cohen\'s Kappa, and Matthews Correlation Coefficient across 10-fold cross-validation',
        ],
      },
    ],
  },
]
