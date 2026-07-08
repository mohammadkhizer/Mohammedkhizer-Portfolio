import mongoose, { Schema, Document } from 'mongoose';

export interface ITestimonial extends Document {
  id: string;
  clientName: string;
  clientTitle: string;
  testimonialText: string;
  rating: number;
  clientImageUrl?: string;
}

const TestimonialSchema: Schema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    clientName: { type: String, required: true },
    clientTitle: { type: String, required: true },
    testimonialText: { type: String, required: true },
    rating: { type: Number, default: 5 },
    clientImageUrl: { type: String, default: '' },
  },
  {
    collection: 'testimonials'
  }
);

export default mongoose.models.Testimonial || mongoose.model<ITestimonial>('Testimonial', TestimonialSchema);
