
'use server';
/**
 * @fileOverview A chatbot flow for Mohammed Khizer Shaikh's portfolio.
 * Version: v1.0.1 (Includes Rate Limiting & Sanitization)
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { isRateLimited } from '@/lib/security';
import { sanitizeInput } from '@/lib/utils';

const ChatInputSchema = z.object({
  message: z.string().describe("The user's question about Khizer."),
  history: z.array(z.object({
    role: z.enum(['user', 'model']),
    text: z.string(),
  })).optional(),
});

const getProjectDetails = ai.defineTool(
  {
    name: 'getProjectDetails',
    description: 'Get detailed information about Mohammed Khizer Shaikh\'s specific technical projects.',
    inputSchema: z.object({}),
    outputSchema: z.array(z.object({
      id: z.string(),
      title: z.string(),
      description: z.string(),
      tech: z.array(z.string()),
    })),
  },
  async () => {
    return [
      {
        id: 'client-comet',
        title: 'Client Comet',
        description: 'A Sales Assistant Robot utilizing Raspberry Pi and SK-Learn for voice interaction and intelligent lead categorization.',
        tech: ['Python', 'Raspberry Pi', 'SK-Learn', 'Speech Recognition'],
      },
      {
        id: 'tech-kurukshetra',
        title: 'Tech Kurukshetra 2026',
        description: 'Developed the official website for the Tech Kurukshetra 2026 event, focusing on performance and user engagement.',
        tech: ['Next.js', 'React', 'Tailwind CSS', 'Framer Motion'],
      },
      {
        id: 'tripboss',
        title: 'Tripboss',
        description: 'Contributed to a Django-based trip management application during internship at Way to Web.',
        tech: ['Django', 'Python', 'PostgreSQL', 'JavaScript'],
      }
    ];
  }
);

export async function chatWithAI(input: z.infer<typeof ChatInputSchema>): Promise<string> {
  // 1. Rate Limiting Check (Server-Side)
  if (await isRateLimited()) {
    return "Rate limit exceeded. Please wait a minute before sending another message.";
  }

  // 2. Input Sanitization
  const safeMessage = sanitizeInput(input.message);

  const response = await ai.generate({
    system: `You are the Portfolio Assistant for Mohammed Khizer Shaikh.
    You help visitors learn about him. Be professional, friendly, and concise.
    
    About Khizer:
    - Title: Full-Stack Web Developer & AI/ML Enthusiast.
    - Education: 2nd Year CSE at SVGU (Bachelor's), Diploma in AI/ML from LJ University.
    - Experience: Python Developer Intern at Way to Web (Django, Tripboss project).
    - Location: Ahmedabad, Gujarat, India.
    
    When users ask about projects or specific work, use the getProjectDetails tool.
    
    Rules:
    - If someone asks for his email: work.mkhizer@gmail.com.
    - If someone asks for his LinkedIn: https://www.linkedin.com/in/mohammad-khizer-shaikh-14a362275.
    - Keep answers under 3 sentences unless asked for details.`,
    prompt: safeMessage,
    tools: [getProjectDetails],
    history: input.history?.map(h => ({
      role: h.role,
      content: [{ text: sanitizeInput(h.text) }],
    })),
  });

  return response.text;
}

export const chatFlow = ai.defineFlow(
  {
    name: 'chatFlow',
    inputSchema: ChatInputSchema,
    outputSchema: z.string(),
  },
  async (input) => {
    return chatWithAI(input);
  }
);
