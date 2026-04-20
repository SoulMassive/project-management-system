import mongoose, { Schema, Document } from 'mongoose';

const subtaskSchema = new Schema({
  title:        { type: String, required: true },
  isCompleted:  { type: Boolean, default: false },
  orderIndex:   { type: Number, default: 0 },
}, { timestamps: true });

const commentSchema = new Schema({
  userId:   { type: Schema.Types.ObjectId, ref: 'User', required: true },
  content:  { type: String, required: true },
}, { timestamps: true });

export interface ITask extends Document {
  projectId: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  assignedTo: mongoose.Types.ObjectId[];
  status: 'todo' | 'doing' | 'review' | 'done';
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  dueDate?: Date;
  parentTaskId?: mongoose.Types.ObjectId;
  dependsOn: mongoose.Types.ObjectId[];
  subtasks: { _id?: mongoose.Types.ObjectId; title: string; isCompleted: boolean; orderIndex: number }[];
  comments: { _id?: mongoose.Types.ObjectId; userId: mongoose.Types.ObjectId; content: string; createdAt?: Date }[];
  createdBy: mongoose.Types.ObjectId;
  progress: number;
}

const taskSchema = new Schema<ITask>({
  projectId:    { type: Schema.Types.ObjectId, ref: 'Project', required: true },
  title:        { type: String, required: true, trim: true },
  description:  { type: String },
  assignedTo:   [{ type: Schema.Types.ObjectId, ref: 'User' }],
  status:       { type: String, enum: ['todo','doing','review','done'],
                  default: 'todo' },
  priority:     { type: String, enum: ['Critical','High','Medium','Low'],
                  default: 'Medium' },
  dueDate:      { type: Date },
  parentTaskId: { type: Schema.Types.ObjectId, ref: 'Task', default: null },
  dependsOn:    [{ type: Schema.Types.ObjectId, ref: 'Task' }],
  subtasks:     [subtaskSchema],
  comments:     [commentSchema],
  createdBy:    { type: Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

taskSchema.index({ projectId: 1, status: 1 });
taskSchema.index({ assignedTo: 1 });
taskSchema.index({ dueDate: 1 });

taskSchema.virtual('progress').get(function(this: ITask) {
  if (!this.subtasks || !this.subtasks.length) return 0;
  const done = this.subtasks.filter(s => s.isCompleted).length;
  return Math.round((done / this.subtasks.length) * 100);
});

export const Task = mongoose.model<ITask>('Task', taskSchema);
