import { Router } from 'express';
import { createNote, getNotes, deleteNote } from '../controllers/noteController';
import auth from '../middleware/auth';

const router = Router();

router.post('/', auth, createNote);
router.get('/', auth, getNotes);
router.delete('/:id', auth, deleteNote);

export default router;