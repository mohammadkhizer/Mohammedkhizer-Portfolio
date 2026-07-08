import mongoose, { Schema, Document } from 'mongoose';

export interface IAuditLog extends Document {
  action: string;
  email: string;
  adminId: string | null;
  ipAddress: string;
  userAgent: string;
  metadata?: Record<string, string | number | boolean>;
  timestamp: Date;
}

const AuditLogSchema: Schema = new Schema(
  {
    action: { type: String, required: true },
    email: { type: String, required: true },
    adminId: { type: String, default: null },
    ipAddress: { type: String, required: true },
    userAgent: { type: String, required: true },
    metadata: { type: Schema.Types.Mixed, default: {} },
    timestamp: { type: Date, default: Date.now },
  },
  {
    collection: 'adminSecurityLogs'
  }
);

export default mongoose.models.AuditLog || mongoose.model<IAuditLog>('AuditLog', AuditLogSchema);
