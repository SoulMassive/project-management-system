import mongoose, { Schema, Document } from 'mongoose';

interface ICommunication {
  userId: mongoose.Types.ObjectId;
  type: 'email' | 'call' | 'meeting' | 'note';
  content: string;
  attachments: { filename: string; filepath: string; mimetype: string }[];
  createdAt: Date;
}

export interface IClient extends Document {
  name: string;
  company?: string;
  email: string;
  phone?: string;
  address?: string;
  gstNumber?: string;
  billingInfo: {
    billingAddress?: string;
    paymentTerms?: string;
    currency: string;
  };
  communications: ICommunication[];
  createdBy: mongoose.Types.ObjectId;
}

const communicationSchema = new Schema({
  userId:       { type: Schema.Types.ObjectId, ref: 'User', required: true },
  type:         { type: String, enum: ['email','call','meeting','note'] },
  content:      { type: String, required: true },
  attachments:  [{ filename: String, filepath: String, mimetype: String }],
}, { timestamps: true });

const clientSchema = new Schema<IClient>({
  name:         { type: String, required: true, trim: true },
  company:      { type: String, trim: true },
  email:        { type: String, required: true, lowercase: true },
  phone:        { type: String },
  address:      { type: String },
  gstNumber:    { type: String, match: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/ },
  billingInfo:  {
    billingAddress: String,
    paymentTerms:   String,
    currency:       { type: String, default: 'INR' },
  },
  communications: [communicationSchema],
  createdBy:    { type: Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

clientSchema.index({ email: 1 });
clientSchema.index({ company: 1 });

export const Client = mongoose.model<IClient>('Client', clientSchema);
