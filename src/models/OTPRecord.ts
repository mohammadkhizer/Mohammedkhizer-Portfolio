import mongoose, { Schema, Document } from 'mongoose';

export interface IOTPRecord extends Document {
  id: string; // The hashed email as ID for compatibility
  email: string;
  otpHash: string;
  expiresAt: number;
  attempts: number;
  verified: boolean;
  resendCount: number;
  lastResendAt: number;
  lockedUntil: number | null;
  ipAddress: string;
  userAgent: string;
  resetToken: string | null;
  resetTokenExpiresAt: number | null;
  createdAt: number;
  updatedAt: number;
}

const OTPRecordSchema: Schema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    otpHash: { type: String, required: true },
    expiresAt: { type: Number, required: true },
    attempts: { type: Number, default: 0 },
    verified: { type: Boolean, default: false },
    resendCount: { type: Number, default: 0 },
    lastResendAt: { type: Number, required: true },
    lockedUntil: { type: Number, default: null },
    ipAddress: { type: String, required: true },
    userAgent: { type: String, required: true },
    resetToken: { type: String, default: null },
    resetTokenExpiresAt: { type: Number, default: null },
    createdAt: { type: Number, required: true },
    updatedAt: { type: Number, required: true },
  },
  {
    collection: 'adminPasswordResetRequests'
  }
);

export default mongoose.models.OTPRecord || mongoose.model<IOTPRecord>('OTPRecord', OTPRecordSchema);
