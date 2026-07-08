import mongoose, { Schema, Document } from 'mongoose';

export interface IContactSubmission extends Document {
  id: string;
  senderName: string;
  senderEmail: string;
  subject: string;
  message: string;
  submissionDate: string;
  isRead: boolean;
  apiVersion: number;
}

const ContactSubmissionSchema: Schema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    senderName: { type: String, required: true },
    senderEmail: { type: String, required: true },
    subject: { type: String, default: 'No Subject' },
    message: { type: String, required: true },
    submissionDate: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    apiVersion: { type: Number, default: 2 },
  },
  {
    collection: 'contactSubmissions'
  }
);

export default mongoose.models.ContactSubmission || mongoose.model<IContactSubmission>('ContactSubmission', ContactSubmissionSchema);
