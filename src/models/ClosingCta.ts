import mongoose, { Schema, Document } from 'mongoose';

export interface IClosingCta extends Document {
  id: string;
  heading: string;
  description: string;
  buttonText: string;
  buttonUrl: string;
  statusBadgeText: string;
  showStatusBadge: boolean;
  isPublished: boolean;
  updatedBy?: string;
  updatedAt: Date;
}

const ClosingCtaSchema: Schema = new Schema(
  {
    id: { type: String, required: true, unique: true, default: 'main-closing-cta' },
    heading: { type: String, default: "Let's Build Something Exceptional Together" },
    description: {
      type: String,
      default:
        "Need a custom web or mobile system built cleanly from start to finish? Let's talk through your requirements and scope.",
    },
    buttonText: { type: String, default: 'Discuss your project' },
    buttonUrl: { type: String, default: '/contact' },
    statusBadgeText: { type: String, default: 'Taking on new projects' },
    showStatusBadge: { type: Boolean, default: true },
    isPublished: { type: Boolean, default: true },
    updatedBy: { type: String, default: 'system' },
  },
  {
    timestamps: true,
    collection: 'closing_cta',
  }
);

export default mongoose.models.ClosingCta || mongoose.model<IClosingCta>('ClosingCta', ClosingCtaSchema);
