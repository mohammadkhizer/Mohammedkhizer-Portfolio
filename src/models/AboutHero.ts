import mongoose, { Schema, Document } from 'mongoose';

export interface IAboutHero extends Document {
  id: string;
  pillText: string;
  headline: string;
  headlineHighlight: string;
  subline: string;
  chips: string[];
  primaryButtonText: string;
  primaryButtonUrl: string;
  secondaryButtonText: string;
  secondaryButtonUrl: string;
  isPublished: boolean;
  updatedBy?: string;
  updatedAt: Date;
}

const AboutHeroSchema: Schema = new Schema(
  {
    id: { type: String, required: true, unique: true, default: 'main-about-hero' },
    pillText: { type: String, default: 'Mohammed Khizer Shaikh • Gujarat, India' },
    headline: { type: String, default: 'I build systems that save businesses' },
    headlineHighlight: { type: String, default: 'hours every week.' },
    subline: { type: String, default: 'Web and mobile apps for businesses across industries.' },
    chips: {
      type: [String],
      default: [
        'End-to-end custom systems',
        'Clean, maintainable architecture',
        '30 days dedicated post-launch support',
      ],
    },
    primaryButtonText: { type: String, default: 'Discuss your project' },
    primaryButtonUrl: { type: String, default: '/contact' },
    secondaryButtonText: { type: String, default: 'See my work' },
    secondaryButtonUrl: { type: String, default: '/projects' },
    isPublished: { type: Boolean, default: true },
    updatedBy: { type: String, default: 'system' },
  },
  {
    timestamps: true,
    collection: 'about_hero',
  }
);

export default mongoose.models.AboutHero || mongoose.model<IAboutHero>('AboutHero', AboutHeroSchema);
