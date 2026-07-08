import mongoose, { Schema, Document } from 'mongoose';

export interface IUserProfile extends Document {
  id: string;
  fullName: string;
  tagline: string;
  cvDownloadUrl: string;
  professionalSummary: string;
  introductionSummary: string;
  updatedAt: string;
}

const UserProfileSchema: Schema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    fullName: { type: String, required: true },
    tagline: { type: String, required: true },
    cvDownloadUrl: { type: String, default: '' },
    professionalSummary: { type: String, default: '' },
    introductionSummary: { type: String, default: '' },
    updatedAt: { type: String, required: true },
  },
  {
    collection: 'userProfiles'
  }
);

export default mongoose.models.UserProfile || mongoose.model<IUserProfile>('UserProfile', UserProfileSchema);
