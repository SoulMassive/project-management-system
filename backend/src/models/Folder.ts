import mongoose, { Schema, Document } from 'mongoose';

export interface IFolder extends Document {
  projectId: mongoose.Types.ObjectId;
  name: string;
  parentId: mongoose.Types.ObjectId | null;
  createdBy: mongoose.Types.ObjectId;
}

const folderSchema = new Schema<IFolder>({
  projectId:  { type: Schema.Types.ObjectId, ref: 'Project', required: true },
  name:       { type: String, required: true, trim: true },
  parentId:   { type: Schema.Types.ObjectId, ref: 'Folder', default: null },
  createdBy:  { type: Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

folderSchema.index({ projectId: 1, parentId: 1 });

export const Folder = mongoose.model<IFolder>('Folder', folderSchema);
