'use server';

import { isRateLimited, validateServerCsrfToken, isAdmin } from '@/lib/security';
import { sanitizeInput } from '@/lib/utils';
import dbConnect from '@/lib/mongodb';
import Project from '@/models/Project';
import { revalidatePath } from 'next/cache';

/**
 * Handles Project creation or update securely on the server.
 */
export async function manageProject(formData: FormData, editingId: string | null = null) {
  // 1. Rate Limiting
  const limited = await isRateLimited();
  if (limited) {
    return { success: false, error: 'Too many requests. Please try again in a minute.' };
  }

  // 2. Extra Security: CSRF Validation
  const clientToken = formData.get('csrfToken') as string;
  const isCsrfValid = await validateServerCsrfToken(clientToken);
  if (!isCsrfValid) {
    return { success: false, error: 'Security validation failed.' };
  }

  // 3. Extract and Sanitize Inputs
  const title = sanitizeInput(formData.get('title') as string);
  const description = sanitizeInput(formData.get('description') as string);
  const imageUrl = sanitizeInput(formData.get('imageUrl') as string);
  const demoUrl = sanitizeInput(formData.get('demoUrl') as string);
  const githubUrl = sanitizeInput(formData.get('githubUrl') as string);
  const techStackRaw = formData.get('techStack') as string;
  const techStack = techStackRaw ? techStackRaw.split(',').map(s => sanitizeInput(s.trim())) : [];
  
  // 4. Authorization Check
  const authorized = await isAdmin();
  if (!authorized) {
    return { success: false, error: 'Administrative privileges required.' };
  }

  // 5. Basic Validation
  if (!title || !description) {
    return { success: false, error: 'Title and description are required.' };
  }

  const projectData = {
    title,
    description,
    projectImageUrl: imageUrl || "https://picsum.photos/seed/project/800/600",
    liveDemoUrl: demoUrl || "#",
    githubRepoUrl: githubUrl || "#",
    skillIds: techStack,
    updatedAt: new Date().toISOString()
  };

  try {
    await dbConnect();

    if (editingId) {
      await Project.updateOne({ id: editingId }, { $set: projectData });
    } else {
      const newId = crypto.randomUUID();
      await Project.create({
        ...projectData,
        id: newId,
        createdAt: new Date().toISOString()
      });
    }

    revalidatePath('/admin/projects');
    return { success: true };
  } catch (error) {
    console.error('Error managing project:', error);
    return { success: false, error: 'Failed to save project. Ensure MongoDB connection is valid.' };
  }
}

/**
 * Deletes a project securely on the server.
 */
export async function deleteProject(id: string) {
  const limited = await isRateLimited();
  if (limited) {
    return { success: false, error: 'Too many requests.' };
  }

  const authorized = await isAdmin();
  if (!authorized) {
    return { success: false, error: 'Administrative privileges required.' };
  }

  try {
    await dbConnect();
    await Project.deleteOne({ id });
    revalidatePath('/admin/projects');
    return { success: true };
  } catch (error) {
    console.error('Error deleting project:', error);
    return { success: false, error: 'Failed to delete project.' };
  }
}
