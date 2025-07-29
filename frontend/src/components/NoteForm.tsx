import { useState } from 'react';
import API from '../utils/api';

interface NoteFormProps {
  onNoteAdded?: () => void;
}

const NoteForm = ({ onNoteAdded }: NoteFormProps) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await API.post('/notes', { title, content });
      setTitle('');
      setContent('');
      if (onNoteAdded) {
        onNoteAdded();
      }
    } catch (err) {
      alert('Error creating note');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <input
        type="text"
        placeholder="Note Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-2 border rounded mb-2"
        required
      />
      <textarea
        placeholder="Note Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full p-2 border rounded mb-2"
        rows={4}
        required
      />
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
        Add Note
      </button>
    </form>
  );
};

export default NoteForm;