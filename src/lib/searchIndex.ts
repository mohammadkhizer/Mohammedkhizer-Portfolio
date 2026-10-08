export interface SearchItem {
  id: string;
  title: string;
  category: 'Projects' | 'Skills' | 'Achievements' | 'Experience' | 'Pages' | 'FAQs';
  description: string;
  url: string;
  tags?: string[];
}

export const SEARCH_INDEX: SearchItem[] = [
  // Pages
  {
    id: 'page-home',
    title: 'Home Page',
    category: 'Pages',
    description: 'Mohammed Khizer Shaikh portfolio homepage, hero section, and tech overview.',
    url: '/',
    tags: ['home', 'hero', 'overview'],
  },
  {
    id: 'page-about',
    title: 'About Me',
    category: 'Pages',
    description: 'Background, education at SVGU, full-stack journey, and technical philosophy.',
    url: '/about',
    tags: ['about', 'education', 'bio'],
  },
  {
    id: 'page-projects',
    title: 'Projects Portfolio',
    category: 'Pages',
    description: 'Full list of web development, AI/ML models, and open-source applications.',
    url: '/projects',
    tags: ['projects', 'apps', 'work'],
  },
  {
    id: 'page-skills',
    title: 'Skills & Tech Stack',
    category: 'Pages',
    description: 'Comprehensive breakdown of frontend, backend, AI/ML, and database technologies.',
    url: '/skills',
    tags: ['skills', 'react', 'nextjs', 'python', 'mongodb'],
  },
  {
    id: 'page-experience',
    title: 'Experience & Timeline',
    category: 'Pages',
    description: 'Work history, internships, hackathons, and engineering achievements.',
    url: '/experience',
    tags: ['experience', 'jobs', 'timeline'],
  },
  {
    id: 'page-achievements',
    title: 'Achievements & Certifications',
    category: 'Pages',
    description: 'Certifications, hackathon wins, honors, and academic recognitions.',
    url: '/achievements',
    tags: ['achievements', 'certifications', 'awards'],
  },
  {
    id: 'page-contact',
    title: 'Contact Me',
    category: 'Pages',
    description: 'Get in touch for collaborations, projects, or inquiries.',
    url: '/contact',
    tags: ['contact', 'email', 'hire'],
  },

  // Projects
  {
    id: 'proj-fashion-studio',
    title: 'Fashion Studio AI / E-Commerce',
    category: 'Projects',
    description: 'AI-driven full-stack fashion web app featuring virtual try-on, modern UI, and MongoDB backend.',
    url: '/projects',
    tags: ['nextjs', 'react', 'tailwind', 'ai', 'mongodb'],
  },
  {
    id: 'proj-ai-assistant',
    title: 'Interactive AI Assistant',
    category: 'Projects',
    description: 'Natural language chat interface with context awareness and customized prompt pipelines.',
    url: '/projects',
    tags: ['ai', 'chat', 'llm', 'python'],
  },
  {
    id: 'proj-boneyard-preloader',
    title: 'Boneyard Micro-Animations',
    category: 'Projects',
    description: 'Custom skeleton loader component library for Next.js applications.',
    url: '/projects',
    tags: ['react', 'animation', 'css'],
  },

  // Skills
  {
    id: 'skill-react-nextjs',
    title: 'React & Next.js Framework',
    category: 'Skills',
    description: 'App router, SSR, SSG, Server Actions, state management, and performance optimization.',
    url: '/skills',
    tags: ['react', 'nextjs', 'frontend', 'typescript'],
  },
  {
    id: 'skill-python-django',
    title: 'Python & Django Backend',
    category: 'Skills',
    description: 'REST APIs, asynchronous task workers, database ORM, and ML model integrations.',
    url: '/skills',
    tags: ['python', 'django', 'backend', 'api'],
  },
  {
    id: 'skill-mongodb-databases',
    title: 'MongoDB & Database Architecture',
    category: 'Skills',
    description: 'NoSQL schema design, aggregation pipelines, indexing, and connection pooling.',
    url: '/skills',
    tags: ['mongodb', 'database', 'nosql', 'sql'],
  },

  // FAQs
  {
    id: 'faq-hire',
    title: 'Are you available for freelance or full-time roles?',
    category: 'FAQs',
    description: 'Yes, available for remote software engineering roles, full-stack contracts, and AI development.',
    url: '/contact',
    tags: ['hire', 'freelance', 'job', 'work'],
  },
  {
    id: 'faq-location',
    title: 'Where are you based?',
    category: 'FAQs',
    description: 'Based in Ahmedabad, Gujarat, India, with remote work readiness across global time zones.',
    url: '/about',
    tags: ['location', 'ahmedabad', 'india', 'remote'],
  },
];
