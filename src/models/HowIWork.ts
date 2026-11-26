import mongoose, { Schema, Document } from 'mongoose';

export interface IHowIWorkStep {
  stepNumber: string;
  title: string;
  description: string;
  order: number;
  isPublished: boolean;
}

export interface IHowIWork extends Document {
  id: string;
  steps: IHowIWorkStep[];
  communicationLine: string;
  isPublished: boolean;
  updatedBy?: string;
  updatedAt: Date;
}

const HowIWorkSchema: Schema = new Schema(
  {
    id: { type: String, required: true, unique: true, default: 'main-how-i-work' },
    steps: {
      type: [
        {
          stepNumber: { type: String, required: true },
          title: { type: String, required: true },
          description: { type: String, required: true },
          order: { type: Number, default: 0 },
          isPublished: { type: Boolean, default: true },
        },
      ],
      default: [
        {
          stepNumber: '01',
          title: 'Discovery call: understand your needs and goals',
          description:
            'We review how your business operates today, where time is lost, and what the system needs to deliver.',
          order: 1,
          isPublished: true,
        },
        {
          stepNumber: '02',
          title: 'Scope and fixed quote within 48 hours',
          description:
            'You receive a written breakdown of features, delivery milestones, and a clear fixed quote within 48 hours.',
          order: 2,
          isPublished: true,
        },
        {
          stepNumber: '03',
          title: 'Weekly build demos',
          description:
            'Development moves in weekly iterations so you can test live progress and confirm every detail early.',
          order: 3,
          isPublished: true,
        },
        {
          stepNumber: '04',
          title: 'Launch and 30 days of support',
          description:
            'Full production launch, walkthrough for your team, and 30 days of dedicated post-launch support.',
          order: 4,
          isPublished: true,
        },
      ],
    },
    communicationLine: {
      type: String,
      default: 'One point of contact, WhatsApp/email updates, weekly demo call.',
    },
    isPublished: { type: Boolean, default: true },
    updatedBy: { type: String, default: 'system' },
  },
  {
    timestamps: true,
    collection: 'how_i_work',
  }
);

export default mongoose.models.HowIWork || mongoose.model<IHowIWork>('HowIWork', HowIWorkSchema);
