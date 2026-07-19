import mongoose, { Schema, Document } from 'mongoose';

export interface IAchievement extends Document {
  id: string;
  title: string;
  issuer: string;
  date: string;
  description: string;
}

const AchievementSchema: Schema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    issuer: { type: String, required: true },
    date: { type: String, required: true },
    description: { type: String, required: true },
  },
  {
    collection: 'achievements'
  }
);

export default mongoose.models.Achievement || mongoose.model<IAchievement>('Achievement', AchievementSchema);
