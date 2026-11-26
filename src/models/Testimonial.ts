import mongoose, { Schema, Document } from 'mongoose';

export interface ITestimonial extends Document {
  id: string;
  clientName: string;
  clientTitle: string;
  role: string;
  business: string;
  clientImageUrl?: string;
  testimonialText: string;
  rating: number;
  order: number;
  isPublished: boolean;
  updatedBy?: string;
  createdAt?: string;
  updatedAt?: Date;
}

const TestimonialSchema: Schema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    clientName: { type: String, required: true },
    clientTitle: { type: String, default: '' },
    role: { type: String, default: '' },
    business: { type: String, default: '' },
    clientImageUrl: { type: String, default: '' },
    testimonialText: { type: String, required: true },
    rating: { type: Number, default: 5 },
    order: { type: Number, default: 0 },
    isPublished: { type: Boolean, default: true },
    updatedBy: { type: String, default: 'system' },
  },
  {
    timestamps: true,
    collection: 'testimonials',
  }
);

export default mongoose.models.Testimonial || mongoose.model<ITestimonial>('Testimonial', TestimonialSchema);
