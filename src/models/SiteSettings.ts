import mongoose, { Schema, Document } from 'mongoose';

export interface ISiteSettings extends Document {
  id: string;
  metaTitle: string;
  metaDescription: string;
  footerBio: string;
  contactEmail: string;
  contactPhone: string;
  socialLinks: {
    github: string;
    linkedin: string;
    instagram: string;
    twitter?: string;
  };
  isPublished: boolean;
  updatedBy?: string;
  updatedAt: Date;
}

const SiteSettingsSchema: Schema = new Schema(
  {
    id: { type: String, required: true, unique: true, default: 'main-site-settings' },
    metaTitle: {
      type: String,
      default: 'Mohammed Khizer Shaikh | Web & Mobile Systems for Businesses',
    },
    metaDescription: {
      type: String,
      default: 'Full-Stack Web & Mobile Developer building web and mobile systems for businesses.',
    },
    footerBio: {
      type: String,
      default: 'Full-Stack Web & Mobile Developer building web and mobile systems for businesses.',
    },
    contactEmail: { type: String, default: 'work.mkhizer@gmail.com' },
    contactPhone: { type: String, default: '+91 9510865651' },
    socialLinks: {
      github: { type: String, default: 'https://github.com/mohammadkhizer' },
      linkedin: { type: String, default: 'https://in.linkedin.com/in/mohammed-khizer-shaikh' },
      instagram: { type: String, default: 'https://www.instagram.com/khizerrrr11/' },
      twitter: { type: String, default: '' },
    },
    isPublished: { type: Boolean, default: true },
    updatedBy: { type: String, default: 'system' },
  },
  {
    timestamps: true,
    collection: 'site_settings',
  }
);

export default mongoose.models.SiteSettings || mongoose.model<ISiteSettings>('SiteSettings', SiteSettingsSchema);
