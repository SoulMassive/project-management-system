import mongoose, { Schema, Document } from 'mongoose';

export interface INotification extends Document {
  userId: mongoose.Types.ObjectId;
  type: 'task_assigned' | 'task_due' | 'comment' | 'stage_change' | 'file_uploaded';
  title: string;
  body?: string;
  entityType: 'Task' | 'Project' | 'File' | 'Client';
  entityId: mongoose.Types.ObjectId;
  isRead: boolean;
}

const notificationSchema = new Schema<INotification>({
  userId:     { type: Schema.Types.ObjectId, ref: 'User', required: true },
  type:       { type: String, enum: ['task_assigned','task_due',
                'comment','stage_change','file_uploaded'] },
  title:      { type: String, required: true },
  body:       { type: String },
  entityType: { type: String, enum: ['Task','Project','File','Client'] },
  entityId:   { type: Schema.Types.ObjectId },
  isRead:     { type: Boolean, default: false },
}, { timestamps: true });

notificationSchema.index({ userId: 1, isRead: 1, createdAt: -1 });

export const Notification = mongoose.model<INotification>('Notification', notificationSchema);
