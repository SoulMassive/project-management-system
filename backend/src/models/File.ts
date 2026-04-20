import mongoose, { Schema, Document } from 'mongoose';

export interface IFile extends Document {
  projectId: mongoose.Types.ObjectId;
  folderId: mongoose.Types.ObjectId | null;
  uploaderId: mongoose.Types.ObjectId;
  filename: string;
  originalName: string;
  mimetype: string;
  sizeBytes: number;
  accessRoles: string[];
  versionNumber: number;
  parentFileId: mongoose.Types.ObjectId | null;
  storagePath: string;
}

const fileSchema = new Schema<IFile>({
  projectId:      { type: Schema.Types.ObjectId, ref: 'Project', required: true },
  folderId:       { type: Schema.Types.ObjectId, ref: 'Folder', default: null },
  uploaderId:     { type: Schema.Types.ObjectId, ref: 'User', required: true },
  filename:       { type: String, required: true },
  originalName:   { type: String, required: true },
  mimetype:       { type: String, required: true },
  sizeBytes:      { type: Number, required: true },
  accessRoles:    { type: [String], default: ['Admin','Manager','Developer','Sales'] },
  versionNumber:  { type: Number, default: 1 },
  parentFileId:   { type: Schema.Types.ObjectId, ref: 'File', default: null },
  storagePath:    { type: String, required: true },
}, { timestamps: true });

fileSchema.index({ projectId: 1, folderId: 1 });
fileSchema.index({ parentFileId: 1 });

export const File = mongoose.model<IFile>('File', fileSchema);
