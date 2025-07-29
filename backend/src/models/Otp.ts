import mongoose, { Document, Schema } from 'mongoose';

export interface IOtp extends Document {
  email: string;
  otp: string;
  expires: Date;
}

const OtpSchema: Schema = new Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  expires: {
    type: Date,
    required: true,
  },
}, { timestamps: true });

export default mongoose.model<IOtp>('Otp', OtpSchema);