import mongoose, { Schema, Document } from 'mongoose';

export interface IActivityLog extends Document {
  userId: mongoose.Types.ObjectId;
  action: string;
  entityType: 'User' | 'Client' | 'Project' | 'Task' | 'File';
  entityId: mongoose.Types.ObjectId;
  metadata: Record<string, any>;
}

const activityLogSchema = new Schema<IActivityLog>({
  userId:       { type: Schema.Types.ObjectId, ref: 'User', required: true },
  action:       { type: String, required: true },
  entityType:   { type: String, enum: ['User','Client','Project','Task','File'] },
  entityId:     { type: Schema.Types.ObjectId },
  metadata:     { type: Schema.Types.Mixed, default: {} },
}, { timestamps: true });

activityLogSchema.index({ userId: 1, createdAt: -1 });

export const ActivityLog = mongoose.model<IActivityLog>('ActivityLog', activityLogSchema);
