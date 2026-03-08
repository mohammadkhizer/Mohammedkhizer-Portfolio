'use server';
/**
 * @fileOverview An AI assistant that recommends portfolio projects based on user interests.
 *
 * - recommendProjects - A function that handles the project recommendation process.
 * - RecommendProjectsInput - The input type for the recommendProjects function.
 * - RecommendProjectsOutput - The return type for the recommendProjects function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const projects = [
  {
    id: 'e-commerce-ai-recommendations',
    name: 'E-commerce Platform with AI Recommendations',
    description: 'A full-stack e-commerce solution featuring product listings, shopping cart, secure checkout, and a personalized recommendation engine powered by machine learning algorithms based on user behavior and preferences.',
    techStack: ['Next.js', 'TypeScript', 'Firebase', 'PostgreSQL', 'Python', 'TensorFlow', 'Genkit', 'Machine Learning'],
    industry: ['Retail', 'E-commerce', 'AI/ML', 'Data Science'],
  },
  {
    id: 'healthcare-analytics-dashboard',
    name: 'Healthcare Data Analytics Dashboard',
    description: 'Developed an interactive dashboard to visualize and analyze patient health records, identify trends, and predict potential health risks. Integrates with various data sources and provides real-time insights for healthcare professionals.',
    techStack: ['React', 'D3.js', 'Node.js', 'MongoDB', 'AWS', 'Data Visualization', 'Big Data'],
    industry: ['Healthcare', 'Data Analytics', 'Business Intelligence'],
  },
  {
    id: 'real-time-chat-application',
    name: 'Real-time Chat Application',
    description: 'A scalable real-time chat application with features like private messaging, group chats, emoji support, and file sharing. Built with WebSockets for instant communication.',
    techStack: ['Next.js', 'Socket.IO', 'Express.js', 'Redis', 'WebSockets'],
    industry: ['Communication', 'Social Media', 'Real-time Applications'],
  },
  {
    id: 'portfolio-website-generator',
    name: 'Portfolio Website Generator',
    description: 'A tool that allows users to quickly generate personalized portfolio websites by filling out a form. Supports various templates and custom themes. Built with a focus on user experience and rapid deployment.',
    techStack: ['React', 'Next.js', 'Generative AI', 'Content Management', 'Tailwind CSS'],
    industry: ['Web Development', 'Personal Branding', 'Design Tools'],
  },
  {
    id: 'ai-content-summarizer',
    name: 'AI-Powered Content Summarizer',
    description: 'An application that takes long articles or documents and generates concise summaries using advanced natural language processing (NLP) models. Useful for researchers and content creators.',
    techStack: ['Python', 'Hugging Face Transformers', 'NLP', 'FastAPI', 'React'],
    industry: ['Content Creation', 'Education', 'AI/ML', 'Research'],
  },
  {
    id: 'decentralized-finance-platform',
    name: 'Decentralized Finance (DeFi) Platform',
    description: 'A secure and transparent DeFi platform enabling peer-to-peer lending, borrowing, and yield farming using blockchain technology and smart contracts.',
    techStack: ['Solidity', 'Ethereum', 'React', 'Web3.js', 'Truffle'],
    industry: ['Blockchain', 'Fintech', 'Decentralized Finance'],
  },
];

const RecommendProjectsInputSchema = z.object({
  interest: z.string().describe("The user's interests or industry they are looking for projects in."),
});
export type RecommendProjectsInput = z.infer<typeof RecommendProjectsInputSchema>;

const RecommendProjectsOutputSchema = z.object({
  recommendations: z.array(
    z.object({
      projectId: z.string().describe('The ID of the recommended project.'),
      name: z.string().describe('The name of the recommended project.'),
      reason: z
        .string()
        .describe('A brief explanation of why this project is relevant to the user.'),
    })
  ).describe('A list of recommended project IDs, their names, and the reasons for their relevance.'),
});
export type RecommendProjectsOutput = z.infer<typeof RecommendProjectsOutputSchema>;

export async function recommendProjects(
  input: RecommendProjectsInput
): Promise<RecommendProjectsOutput> {
  return recommendProjectsFlow(input);
}

const recommendProjectsPrompt = ai.definePrompt({
  name: 'recommendProjectsPrompt',
  input: { schema: RecommendProjectsInputSchema },
  output: { schema: RecommendProjectsOutputSchema },
  prompt: `You are an AI assistant tasked with recommending portfolio projects.
A user will describe their interests or industry, and you will recommend the most relevant projects from the list provided below.
For each recommendation, explain why it is relevant to the user's query.

Here is a list of available projects, including their ID, name, description, tech stack, and relevant industries:
{{{projectsJson}}}

User's interests/industry: "{{{interest}}}"

Please provide your recommendations in the specified JSON format, including the project's ID, name, and the reason for recommendation.
`,
});

const recommendProjectsFlow = ai.defineFlow(
  {
    name: 'recommendProjectsFlow',
    inputSchema: RecommendProjectsInputSchema,
    outputSchema: RecommendProjectsOutputSchema,
  },
  async (input) => {
    const projectsJson = JSON.stringify(projects, null, 2);
    const { output } = await recommendProjectsPrompt({ ...input, projectsJson });
    return output!;
  }
);
