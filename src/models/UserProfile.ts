import mongoose, { Schema, Document } from 'mongoose';

export interface IUserProfile extends Document {
  id: string;
  fullName: string;
  tagline: string;
  cvDownloadUrl: string;
  professionalSummary: string;
  introductionSummary: string;
  yearsOfExperience?: number;
  projectsCount?: number;
  certificationsCount?: number;
  skillsCount?: number;
  studentYear?: string;
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
    yearsOfExperience: { type: Number, default: 2 },
    projectsCount: { type: Number, default: 10 },
    certificationsCount: { type: Number, default: 8 },
    skillsCount: { type: Number, default: 15 },
    studentYear: { type: String, default: '3rd' },
    updatedAt: { type: String, required: true },
  },
  {
    collection: 'userProfiles'
  }
);

export default mongoose.models.UserProfile || mongoose.model<IUserProfile>('UserProfile', UserProfileSchema);
