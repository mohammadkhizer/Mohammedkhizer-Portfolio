import mongoose, { Schema, Document } from 'mongoose';

export interface IService extends Document {
  id: string;
  title: string;
  shortDescription: string;
  bullets: string[];
  timeline: string;
  buttonText: string;
  buttonUrl: string;
  order: number;
  featured: boolean;
  isPublished: boolean;
  updatedBy?: string;
  updatedAt: Date;
}

const ServiceSchema: Schema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    shortDescription: { type: String, default: '' },
    bullets: { type: [String], default: [] },
    timeline: { type: String, default: 'Typical timeline: {{TODO: weeks}} weeks' },
    buttonText: { type: String, default: 'Discuss your project' },
    buttonUrl: { type: String, default: '/contact' },
    order: { type: Number, default: 0 },
    featured: { type: Boolean, default: false },
    isPublished: { type: Boolean, default: true },
    updatedBy: { type: String, default: 'system' },
  },
  {
    timestamps: true,
    collection: 'services',
  }
);

export default mongoose.models.Service || mongoose.model<IService>('Service', ServiceSchema);
