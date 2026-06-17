import { dbAdmin } from './firebase-admin';
import { unstable_cache } from 'next/cache';

/**
 * Fetches projects from Firestore server-side with pagination support.
 */
export async function getProjects(limit: number = 20, offset: number = 0) {
  return unstable_cache(
    async () => {
      try {
        let query = dbAdmin.collection('projects').orderBy('createdAt', 'desc');
        
        if (limit) query = query.limit(limit);
        if (offset) query = query.offset(offset);
        
        const snapshot = await query.get();
        return snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
      } catch (error) {
        console.error('Error fetching projects:', error);
        return [];
      }
    },
    ['projects', `projects-${limit}-${offset}`],
    { revalidate: 3600, tags: ['projects'] }
  )();
}



/**
 * Fetches skills from Firestore server-side.
 */
export async function getSkills() {
  return unstable_cache(
    async () => {
      try {
        const snapshot = await dbAdmin.collection('skills').get();
        return snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
      } catch (error) {
        console.error('Error fetching skills:', error);
        return [];
      }
    },
    ['skills'],
    { revalidate: 3600, tags: ['skills'] }
  )();
}


/**
 * Fetches experience from Firestore server-side with pagination support.
 */
export async function getExperience(limit: number = 20, offset: number = 0) {
  return unstable_cache(
    async () => {
      try {
        let query = dbAdmin.collection('experience').orderBy('startDate', 'desc');
        
        if (limit) query = query.limit(limit);
        if (offset) query = query.offset(offset);
        
        const snapshot = await query.get();
        return snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
      } catch (error) {
        console.error('Error fetching experience:', error);
        return [];
      }
    },
    ['experience', `experience-${limit}-${offset}`],
    { revalidate: 3600, tags: ['experience'] }
  )();
}



/**
 * Fetches certifications from Firestore server-side.
 */
export async function getCertifications() {
  return unstable_cache(
    async () => {
      try {
        const snapshot = await dbAdmin.collection('certifications').orderBy('date', 'desc').get();
        return snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
      } catch (error) {
        console.error('Error fetching certifications:', error);
        return [];
      }
    },
    ['certifications'],
    { revalidate: 3600, tags: ['certifications'] }
  )();
}


/**
 * Fetches testimonials from Firestore server-side.
 */
export async function getTestimonials() {
  return unstable_cache(
    async () => {
      try {
        const snapshot = await dbAdmin.collection('testimonials').get();
        return snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
      } catch (error) {
        console.error('Error fetching testimonials:', error);
        return [];
      }
    },
    ['testimonials'],
    { revalidate: 3600, tags: ['testimonials'] }
  )();
}

