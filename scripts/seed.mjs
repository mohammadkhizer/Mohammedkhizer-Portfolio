import mongoose from 'mongoose';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load environment files (.env and .env.local)
const envFiles = ['.env', '.env.local'];
for (const file of envFiles) {
  try {
    const envPath = resolve(__dirname, `../${file}`);
    const envContent = readFileSync(envPath, 'utf-8');
    for (const line of envContent.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eqIdx = trimmed.indexOf('=');
      if (eqIdx === -1) continue;
      const key = trimmed.slice(0, eqIdx).trim();
      const value = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, '');
      if (!process.env[key]) process.env[key] = value;
    }
  } catch {
    // Ignore missing files
  }
}

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error('❌ MONGO_URI not set. Please check your .env.local file.');
  process.exit(1);
}

// Define schemas to seed
const SkillSchema = new mongoose.Schema({ id: String, name: String, category: String, proficiency: String, iconName: String }, { collection: 'skills', timestamps: true });
const ProjectSchema = new mongoose.Schema({ id: String, title: String, description: String, projectImageUrl: String, liveDemoUrl: String, githubRepoUrl: String, skillIds: [String], createdAt: String, updatedAt: String }, { collection: 'projects' });
const ExperienceSchema = new mongoose.Schema({ id: String, jobTitle: String, companyName: String, startDate: String, endDate: String, description: String, location: String }, { collection: 'experiences' });
const EducationSchema = new mongoose.Schema({ id: String, degree: String, institutionName: String, location: String, startDate: String, endDate: String, description: String }, { collection: 'educations' });
const CertificationSchema = new mongoose.Schema({ id: String, name: String, issuingBody: String, credentialUrl: String, imageUrl: String, issueDate: String, createdAt: String, updatedAt: String }, { collection: 'certifications' });
const TestimonialSchema = new mongoose.Schema({ id: String, clientName: String, clientTitle: String, testimonialText: String, rating: Number, clientImageUrl: String }, { collection: 'testimonials' });
const UserProfileSchema = new mongoose.Schema({ id: String, fullName: String, tagline: String, cvDownloadUrl: String, professionalSummary: String, introductionSummary: String, updatedAt: String }, { collection: 'userProfiles' });

const now = new Date().toISOString();

const skills = [
  { id: 'skill-python', name: 'Python', category: 'Programming', proficiency: 'Expert', iconName: 'Code2' },
  { id: 'skill-js', name: 'JavaScript', category: 'Programming', proficiency: 'Expert', iconName: 'Code2' },
  { id: 'skill-ts', name: 'TypeScript', category: 'Programming', proficiency: 'Advanced', iconName: 'Code2' },
  { id: 'skill-cpp', name: 'C++', category: 'Programming', proficiency: 'Advanced', iconName: 'Code2' },
  { id: 'skill-react', name: 'React.js', category: 'Web Development', proficiency: 'Expert', iconName: 'Layout' },
  { id: 'skill-next', name: 'Next.js', category: 'Web Development', proficiency: 'Expert', iconName: 'Layout' },
  { id: 'skill-node', name: 'Node.js', category: 'Web Development', proficiency: 'Advanced', iconName: 'Layout' },
  { id: 'skill-tailwind', name: 'Tailwind CSS', category: 'Web Development', proficiency: 'Expert', iconName: 'Layout' },
  { id: 'skill-mongodb', name: 'MongoDB', category: 'Databases & Tools', proficiency: 'Advanced', iconName: 'Database' },
  { id: 'skill-git', name: 'Git & GitHub', category: 'Databases & Tools', proficiency: 'Expert', iconName: 'Database' },
  { id: 'skill-tf', name: 'TensorFlow', category: 'Specialization', proficiency: 'Advanced', iconName: 'Sparkles' },
  { id: 'skill-scikit', name: 'Scikit-Learn', category: 'Specialization', proficiency: 'Advanced', iconName: 'Sparkles' },
  { id: 'skill-linux', name: 'Linux / Bash', category: 'Systems', proficiency: 'Advanced', iconName: 'Terminal' },
];

const projects = [
  {
    id: 'project-portfolio',
    title: 'AI-Powered Portfolio CMS',
    description: 'A full-stack portfolio management system built with Next.js 15 and MongoDB, featuring an AI-assisted admin panel, JWT authentication, and real-time content management for skills, projects, experience, and certifications.',
    projectImageUrl: 'https://picsum.photos/seed/portfolio-cms/800/600',
    liveDemoUrl: 'https://mohammedkhizer.com',
    githubRepoUrl: 'https://github.com/mohammedkhizer',
    skillIds: ['Next.js', 'MongoDB', 'TypeScript', 'TailwindCSS'],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'project-attendance',
    title: 'Smart Attendance System',
    description: 'An IoT-powered attendance tracking system using facial recognition (OpenCV + DeepFace), RFID, and a web dashboard. Integrates Raspberry Pi hardware with a Python backend and React frontend for real-time monitoring.',
    projectImageUrl: 'https://picsum.photos/seed/attendance-system/800/600',
    liveDemoUrl: '#',
    githubRepoUrl: 'https://github.com/mohammedkhizer',
    skillIds: ['Python', 'OpenCV', 'React.js', 'Raspberry Pi'],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'project-ecommerce',
    title: 'E-Commerce Web Application',
    description: 'A feature-rich e-commerce platform with product listings, cart management, Stripe payment integration, order tracking, and a vendor admin dashboard. Built with Next.js App Router and MongoDB.',
    projectImageUrl: 'https://picsum.photos/seed/ecommerce-app/800/600',
    liveDemoUrl: '#',
    githubRepoUrl: 'https://github.com/mohammedkhizer',
    skillIds: ['Next.js', 'React.js', 'MongoDB', 'Node.js'],
    createdAt: now,
    updatedAt: now,
  },
];

const experiences = [
  {
    id: 'exp-fullstack',
    jobTitle: 'Full Stack Developer Intern',
    companyName: 'Tech Innovators Pvt. Ltd.',
    startDate: 'Jun 2024',
    endDate: 'Sep 2024',
    description: 'Developed and maintained RESTful APIs using Node.js and Express, built responsive React.js dashboards, and integrated MongoDB for data persistence. Collaborated with senior engineers on a real-time notification system serving 10,000+ users.',
    location: 'Hyderabad, India',
  },
  {
    id: 'exp-webdev',
    jobTitle: 'Web Development Intern',
    companyName: 'Digital Craft Studios',
    startDate: 'Jan 2024',
    endDate: 'May 2024',
    description: 'Built e-commerce web pages using Next.js and Tailwind CSS, implemented SEO optimizations that improved organic traffic by 35%, and contributed to UI component library used across 5 client projects.',
    location: 'Remote',
  },
];

const education = [
  {
    id: 'edu-be',
    degree: 'Bachelor of Engineering in Computer Science',
    institutionName: 'Osmania University',
    location: 'Hyderabad, Telangana, India',
    startDate: '2021',
    endDate: '2025',
    description: 'Pursuing B.E. in Computer Science with a focus on Software Engineering, Machine Learning, and Distributed Systems. Active member of the Computer Science Club and IEEE student chapter. CGPA: 8.4/10.',
  },
];

const certifications = [
  {
    id: 'cert-meta',
    name: 'Meta Front-End Developer Professional Certificate',
    issuingBody: 'Meta (Coursera)',
    credentialUrl: '#',
    imageUrl: 'https://picsum.photos/seed/meta-cert/400/300',
    issueDate: '2024-03',
    createdAt: now,
    updatedAt: now,
  },
];

const testimonials = [
  {
    id: 'test-arjun',
    clientName: 'Arjun Mehta',
    clientTitle: 'Founder, TechLaunch Startup',
    testimonialText: 'Mohammed Khizer delivered our entire SaaS platform in record time. His expertise in Next.js and MongoDB is exceptional — the codebase is clean, scalable, and well-documented. Highly recommended for any serious tech project.',
    rating: 5,
    clientImageUrl: '',
  },
  {
    id: 'test-sarah',
    clientName: 'Sarah Chen',
    clientTitle: 'CEO, Digital Ventures Co.',
    testimonialText: 'We hired Khizer to build our e-commerce platform and he exceeded every expectation. His attention to detail in both frontend UI and backend architecture is impressive. The site performance scores went through the roof.',
    rating: 5,
    clientImageUrl: '',
  },
];

const profiles = [
  {
    id: 'main-profile',
    fullName: 'Mohammed Khizer Shaikh',
    tagline: 'Full-Stack Web Developer & AI/ML Enthusiast',
    cvDownloadUrl: 'https://portfolioimageskhizer.netlify.app/Mohammed-Khizer-Shaikh-CV-2.pdf',
    professionalSummary: 'Pursuing Bachelor of Engineering in Computer Science. Specialized in Next.js, React, Node.js, and MongoDB.',
    introductionSummary: 'I am a passionate Full-Stack Web Developer and AI/ML enthusiast. I specialize in building highly performant, user-centric web applications.',
    updatedAt: now,
  }
];

async function seed() {
  console.log('🌱 Connecting to MongoDB...');
  await mongoose.connect(MONGO_URI);
  console.log('✅ Connected.');

  const Skill = mongoose.models.Skill || mongoose.model('Skill', SkillSchema);
  const Project = mongoose.models.Project || mongoose.model('Project', ProjectSchema);
  const Experience = mongoose.models.Experience || mongoose.model('Experience', ExperienceSchema);
  const Education = mongoose.models.Education || mongoose.model('Education', EducationSchema);
  const Certification = mongoose.models.Certification || mongoose.model('Certification', CertificationSchema);
  const Testimonial = mongoose.models.Testimonial || mongoose.model('Testimonial', TestimonialSchema);
  const UserProfile = mongoose.models.UserProfile || mongoose.model('UserProfile', UserProfileSchema);

  const collections = [
    { model: Skill, data: skills, name: 'Skills' },
    { model: Project, data: projects, name: 'Projects' },
    { model: Experience, data: experiences, name: 'Experiences' },
    { model: Education, data: education, name: 'Education' },
    { model: Certification, data: certifications, name: 'Certifications' },
    { model: Testimonial, data: testimonials, name: 'Testimonials' },
    { model: UserProfile, data: profiles, name: 'UserProfile' },
  ];

  for (const { model, data, name } of collections) {
    // Clear and insert
    await model.deleteMany({});
    await model.insertMany(data);
    console.log(`✅ ${name}: Seeded ${data.length} records.`);
  }

  await mongoose.disconnect();
  console.log('\n🎉 Seeding complete! Your portfolio database is ready.');
}

seed().catch((err) => {
  console.error('❌ Seeding failed:', err);
  mongoose.disconnect();
  process.exit(1);
});
