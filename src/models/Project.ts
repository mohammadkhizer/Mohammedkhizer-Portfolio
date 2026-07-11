import mongoose, { Schema, Document } from 'mongoose';

export interface IProject extends Document {
  id: string; // Unique string identifier
  title: string;
  description: string;
  projectImageUrl: string;
  liveDemoUrl: string;
  githubRepoUrl: string;
  skillIds: string[];
  categorySlug: string;  // references ProjectCategory.slug
  createdAt: string;
  updatedAt: string;
}

const ProjectSchema: Schema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    projectImageUrl: { type: String, default: 'https://picsum.photos/seed/project/800/600' },
    liveDemoUrl: { type: String, default: '#' },
    githubRepoUrl: { type: String, default: '#' },
    skillIds: { type: [String], default: [] },
    categorySlug: { type: String, default: '' },
    createdAt: { type: String, required: true },
    updatedAt: { type: String, required: true },
  },
  {
    collection: 'projects'
  }
);

export default mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema);
