import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: 'Admin' | 'Manager' | 'Developer' | 'Sales';
  isActive: boolean;
  avatarUrl: string | null;
  lastLogin: Date | null;
  refreshToken: string | null;
  comparePassword: (password: string) => Promise<boolean>;
}

const userSchema = new Schema<IUser>({
  name:           { type: String, required: true, trim: true },
  email:          { type: String, required: true, unique: true, lowercase: true },
  passwordHash:   { type: String, required: true },
  role:           { type: String, enum: ['Admin','Manager','Developer','Sales'],
                    required: true },
  isActive:       { type: Boolean, default: true },
  avatarUrl:      { type: String, default: null },
  lastLogin:      { type: Date, default: null },
  refreshToken:   { type: String, default: null },
}, { timestamps: true });

userSchema.index({ email: 1 });

userSchema.pre('save', async function() {
  if (this.isModified('passwordHash')) {
    this.passwordHash = await bcrypt.hash(this.passwordHash, 12);
  }
});

userSchema.methods.comparePassword = async function(password: string): Promise<boolean> {
  return bcrypt.compare(password, this.passwordHash);
};

export const User = mongoose.model<IUser>('User', userSchema);
