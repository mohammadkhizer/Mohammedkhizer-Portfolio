import mongoose, { Schema, Document } from 'mongoose';

export interface IExperience extends Document {
  id: string;
  jobTitle: string;
  companyName: string;
  startDate: string;
  endDate: string;
  description: string;
  location: string;
}

const ExperienceSchema: Schema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    jobTitle: { type: String, required: true },
    companyName: { type: String, required: true },
    startDate: { type: String, required: true },
    endDate: { type: String, default: 'Present' },
    description: { type: String, required: true },
    location: { type: String, default: 'Remote/Office' },
  },
  {
    collection: 'experiences'
  }
);

export default mongoose.models.Experience || mongoose.model<IExperience>('Experience', ExperienceSchema);
