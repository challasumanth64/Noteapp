import { useEffect, useState } from 'react';
import API from '../utils/api';

interface Note {
  _id: string;
  title: string;
  content: string;
  createdAt: string;
}

const NoteList = () => {
  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await API.get('/notes');
        setNotes(res.data);
      } catch (err) {
        console.error('Failed to fetch notes');
      }
    };
    fetchNotes();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this note?')) return;
    try {
      await API.delete(`/notes/${id}`);
      setNotes(notes.filter(note => note._id !== id));
    } catch (err) {
      alert('Failed to delete note');
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Your Notes</h2>
      {notes.length === 0 ? (
        <p>No notes yet.</p>
      ) : (
        notes.map(note => (
          <div key={note._id} className="border p-4 mb-4 rounded relative">
            <h3 className="font-bold">{note.title}</h3>
            <p>{note.content}</p>
            <small className="text-gray-500">{new Date(note.createdAt).toLocaleString()}</small>
            <button
              onClick={() => handleDelete(note._id)}
              className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-sm"
            >
              Delete
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default NoteList;