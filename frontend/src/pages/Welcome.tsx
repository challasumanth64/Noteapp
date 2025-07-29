import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import NoteForm from '../components/NoteForm';
import NoteList from '../components/NoteList';

const Welcome = () => {
  const { user, logout } = useContext(AuthContext)!;
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleNoteAdded = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Welcome, {user?.name}!</h1>
        <button onClick={logout} className="bg-red-500 text-white px-4 py-2 rounded">
          Logout
        </button>
      </div>
      <NoteForm onNoteAdded={handleNoteAdded} />
      <NoteList key={refreshTrigger} />
    </div>
  );
};

export default Welcome;