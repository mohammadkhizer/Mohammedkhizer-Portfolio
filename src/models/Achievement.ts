import mongoose, { Schema, Document } from 'mongoose';

export interface IAchievement extends Document {
  id: string;
  title: string;
  issuer: string;
  date: string;
  description: string;
  images?: string[];
  links?: { label: string; url: string }[];
}

const AchievementSchema: Schema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    issuer: { type: String, required: true },
    date: { type: String, required: true },
    description: { type: String, required: true },
    images: { type: [String], default: [] },
    links: {
      type: [{ label: { type: String, required: true }, url: { type: String, required: true } }],
      default: [],
    },
  },
  {
    collection: 'achievements'
  }
);

export default mongoose.models.Achievement || mongoose.model<IAchievement>('Achievement', AchievementSchema);
