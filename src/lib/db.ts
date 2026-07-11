import dbConnect from './mongodb';
import Project from '@/models/Project';
import Skill from '@/models/Skill';
import Experience from '@/models/Experience';
import Education from '@/models/Education';
import Certification from '@/models/Certification';
import Testimonial from '@/models/Testimonial';
import UserProfile from '@/models/UserProfile';
import ProjectCategory from '@/models/ProjectCategory';


/**
 * Fetches project categories from MongoDB server-side.
 */
export async function getProjectCategories() {
  try {
    await dbConnect();
    const docs = await ProjectCategory.find().sort({ order: 1, name: 1 }).lean();
    return docs.map((doc: any) => ({
      ...doc,
      _id: doc._id.toString(),
      id: doc.id || doc._id.toString(),
    }));
  } catch (error) {
    console.error('Error fetching project categories:', error);
    return [];
  }
}


/**
 * Fetches projects from MongoDB server-side with pagination support.
 */
export async function getProjects(limit: number = 20, offset: number = 0) {
  try {
    await dbConnect();
    const docs = await Project.find()
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit)
      .lean();

    return docs.map((doc: any) => ({
      ...doc,
      _id: doc._id.toString(),
      id: doc.id || doc._id.toString(),
    }));
  } catch (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
}

/**
 * Fetches skills from MongoDB server-side.
 */
export async function getSkills() {
  try {
    await dbConnect();
    const docs = await Skill.find().lean();
    return docs.map((doc: any) => ({
      ...doc,
      _id: doc._id.toString(),
      id: doc.id || doc._id.toString(),
    }));
  } catch (error) {
    console.error('Error fetching skills:', error);
    return [];
  }
}

/**
 * Fetches experience from MongoDB server-side with pagination support.
 */
export async function getExperience(limit: number = 20, offset: number = 0) {
  try {
    await dbConnect();
    const docs = await Experience.find()
      .sort({ startDate: -1 })
      .skip(offset)
      .limit(limit)
      .lean();

    return docs.map((doc: any) => ({
      ...doc,
      _id: doc._id.toString(),
      id: doc.id || doc._id.toString(),
    }));
  } catch (error) {
    console.error('Error fetching experience:', error);
    return [];
  }
}

/**
 * Fetches education history from MongoDB server-side.
 */
export async function getEducation() {
  try {
    await dbConnect();
    const docs = await Education.find()
      .sort({ startDate: -1 })
      .lean();

    return docs.map((doc: any) => ({
      ...doc,
      _id: doc._id.toString(),
      id: doc.id || doc._id.toString(),
    }));
  } catch (error) {
    console.error('Error fetching education:', error);
    return [];
  }
}

/**
 * Fetches certifications from MongoDB server-side.
 */
export async function getCertifications() {
  try {
    await dbConnect();
    // Sort by issueDate descending, fallback to createdAt
    const docs = await Certification.find()
      .sort({ issueDate: -1, createdAt: -1 })
      .lean();

    return docs.map((doc: any) => ({
      ...doc,
      _id: doc._id.toString(),
      id: doc.id || doc._id.toString(),
    }));
  } catch (error) {
    console.error('Error fetching certifications:', error);
    return [];
  }
}

/**
 * Fetches testimonials from MongoDB server-side.
 */
export async function getTestimonials() {
  try {
    await dbConnect();
    const docs = await Testimonial.find().lean();
    return docs.map((doc: any) => ({
      ...doc,
      _id: doc._id.toString(),
      id: doc.id || doc._id.toString(),
    }));
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    return [];
  }
}

/**
 * Fetches the user profile from MongoDB server-side.
 */
export async function getUserProfile() {
  try {
    await dbConnect();
    const doc = await UserProfile.findOne({ id: 'main-profile' }).lean();
    if (!doc) return null;

    return {
      ...doc,
      _id: doc._id.toString(),
    };
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
}

