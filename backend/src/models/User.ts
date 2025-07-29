// src/models/User.ts
import { Document, Schema, model } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password?: string;
  name?: string;
  dob?: Date;
  googleId?: string;
}

const UserSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  password: { type: String },
  name: { type: String },
  dob: { type: Date },
  googleId: { type: String, unique: true, sparse: true },
}, { timestamps: true });

export default model<IUser>('User', UserSchema);