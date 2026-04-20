import mongoose, { Schema, Document } from 'mongoose';

const noteSchema = new Schema({
  userId:    { type: Schema.Types.ObjectId, ref: 'User' },
  content:   { type: String, required: true },
}, { timestamps: true });

export interface IProject extends Document {
  name: string;
  clientId: mongoose.Types.ObjectId;
  type: 'Website' | 'App' | 'Ecommerce' | 'Branding' | 'SEO' | 'Other';
  stage: 'Lead' | 'Proposal' | 'Development' | 'Testing' | 'Live' | 'Maintenance';
  status: 'In Progress' | 'Delayed' | 'Completed' | 'On Hold';
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  description?: string;
  startDate?: Date;
  endDate?: Date;
  budget?: number;
  teamMembers: mongoose.Types.ObjectId[];
  notes: { userId: mongoose.Types.ObjectId; content: string; createdAt?: Date }[];
  createdBy: mongoose.Types.ObjectId;
}

const projectSchema = new Schema<IProject>({
  name:         { type: String, required: true, trim: true },
  clientId:     { type: Schema.Types.ObjectId, ref: 'Client', required: true },
  type:         { type: String, enum: ['Website','App','Ecommerce',
                  'Branding','SEO','Other'] },
  stage:        { type: String, enum: ['Lead','Proposal','Development',
                  'Testing','Live','Maintenance'], default: 'Lead' },
  status:       { type: String, enum: ['In Progress','Delayed',
                  'Completed','On Hold'], default: 'In Progress' },
  priority:     { type: String, enum: ['Critical','High','Medium','Low'],
                  default: 'Medium' },
  description:  { type: String },
  startDate:    { type: Date },
  endDate:      { type: Date },
  budget:       { type: Number },
  teamMembers:  [{ type: Schema.Types.ObjectId, ref: 'User' }],
  notes:        [noteSchema],
  createdBy:    { type: Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

projectSchema.index({ clientId: 1 });
projectSchema.index({ teamMembers: 1 });
projectSchema.index({ status: 1, stage: 1 });

// Cascade delete tasks + files when project is deleted
projectSchema.pre('findOneAndDelete', async function() {
  const projectId = this.getQuery()._id;
  await mongoose.model('Task').deleteMany({ projectId });
  await mongoose.model('File').deleteMany({ projectId });
});

export const Project = mongoose.model<IProject>('Project', projectSchema);
