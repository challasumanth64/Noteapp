// src/models/Note.ts
import { Document, Schema, model } from 'mongoose';

export interface INote extends Document {
  title: string;
  content: string;
  author: string; // user ID
  createdAt: Date;
}

const NoteSchema = new Schema<INote>({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  } as any, // Type assertion to avoid TypeScript error
}, { timestamps: true });

export default model<INote>('Note', NoteSchema);