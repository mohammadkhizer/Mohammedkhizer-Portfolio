import mongoose, { Schema, Document } from 'mongoose';

export interface IStatItem {
  label: string;
  value: string;
}

export interface IHomeHero extends Document {
  id: string;
  tagline: string;
  subtitle: string;
  primaryButtonText: string;
  primaryButtonUrl: string;
  secondaryButtonText: string;
  secondaryButtonUrl: string;
  cvDownloadUrl: string;
  stats: IStatItem[];
  isPublished: boolean;
  updatedBy?: string;
  updatedAt: Date;
}

const HomeHeroSchema: Schema = new Schema(
  {
    id: { type: String, required: true, unique: true, default: 'main-hero' },
    tagline: { type: String, default: 'Welcome to my space' },
    subtitle: { type: String, default: 'Full-Stack Web & Mobile Developer' },
    primaryButtonText: { type: String, default: 'Discuss your project' },
    primaryButtonUrl: { type: String, default: '/contact' },
    secondaryButtonText: { type: String, default: 'View Projects' },
    secondaryButtonUrl: { type: String, default: '/projects' },
    cvDownloadUrl: {
      type: String,
      default: 'https://portfolioimageskhizer.netlify.app/Mohammed-Khizer-Shaikh-CV-2.pdf',
    },
    stats: {
      type: [
        {
          label: { type: String, required: true },
          value: { type: String, required: true },
        },
      ],
      default: [
        { label: 'Post-launch Support', value: '30 Days' },
        { label: 'Projects Built', value: '10+' },
        { label: 'Certifications', value: '8+' },
        { label: 'Tech Stack Entities', value: '15+' },
      ],
    },
    isPublished: { type: Boolean, default: true },
    updatedBy: { type: String, default: 'system' },
  },
  {
    timestamps: true,
    collection: 'home_hero',
  }
);

export default mongoose.models.HomeHero || mongoose.model<IHomeHero>('HomeHero', HomeHeroSchema);
