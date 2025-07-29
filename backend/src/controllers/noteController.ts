import { Request, Response } from 'express';
import Note from '../models/Note';
import User from '../models/User';

// Create Note
export const createNote = async (req: Request, res: Response) => {
  const { title, content } = req.body;
  const author = req.userId; // Set by auth middleware

  try {
    const note = new Note({ title, content, author });
    await note.save();
    res.status(201).json(note);
  } catch (err) {
    res.status(500).json({ message: 'Error creating note' });
  }
};

// Get All Notes
export const getNotes = async (req: Request, res: Response) => {
  try {
    const notes = await Note.find({ author: req.userId }).sort({ createdAt: -1 });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching notes' });
  }
};

// Delete Note
export const deleteNote = async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.userId;

  try {
    const note = await Note.findById(id);
    if (!note) return res.status(404).json({ message: 'Note not found' });

    if (note.author.toString() !== userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Note.findByIdAndDelete(id);
    res.json({ message: 'Note deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting note' });
  }
};