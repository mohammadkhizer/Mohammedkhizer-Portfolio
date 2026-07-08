import mongoose, { Schema, Document } from 'mongoose';

export interface IEducation extends Document {
  id: string;
  degree: string;
  institutionName: string;
  location?: string;
  startDate: string;
  endDate: string;
  description: string;
}

const EducationSchema: Schema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    degree: { type: String, required: true },
    institutionName: { type: String, required: true },
    location: { type: String, default: '' },
    startDate: { type: String, required: true },
    endDate: { type: String, default: 'Present' },
    description: { type: String, required: true },
  },
  {
    collection: 'educations'
  }
);

export default mongoose.models.Education || mongoose.model<IEducation>('Education', EducationSchema);
