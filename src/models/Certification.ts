import mongoose, { Schema, Document } from 'mongoose';

export interface ICertification extends Document {
  id: string;
  name: string;
  issuingBody: string;
  credentialUrl: string;
  imageUrl?: string;
  issueDate: string;
  createdAt: string;
  updatedAt: string;
}

const CertificationSchema: Schema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    issuingBody: { type: String, required: true },
    credentialUrl: { type: String, default: '#' },
    imageUrl: { type: String, default: '' },
    issueDate: { type: String, required: true },
    createdAt: { type: String, required: true },
    updatedAt: { type: String, required: true },
  },
  {
    collection: 'certifications'
  }
);

export default mongoose.models.Certification || mongoose.model<ICertification>('Certification', CertificationSchema);
