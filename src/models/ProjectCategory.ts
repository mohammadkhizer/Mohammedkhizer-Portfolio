import mongoose, { Schema, Document } from 'mongoose';

export interface IProjectCategory extends Document {
  id: string;
  name: string;       // e.g. "Web Development"
  slug: string;       // e.g. "web" (used for filtering)
  description?: string;
  order: number;      // display order in filter bar
  createdAt: string;
  updatedAt: string;
}

const ProjectCategorySchema: Schema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String, default: '' },
    order: { type: Number, default: 0 },
    createdAt: { type: String, required: true },
    updatedAt: { type: String, required: true },
  },
  {
    collection: 'project_categories',
  }
);

export default mongoose.models.ProjectCategory ||
  mongoose.model<IProjectCategory>('ProjectCategory', ProjectCategorySchema);
