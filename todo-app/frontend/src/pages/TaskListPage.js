import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { FaPlus, FaList } from 'react-icons/fa';

export default function TaskListPage() {
  const { user } = useAuth();
  const [lists, setLists] = useState([]);
  const [newListName, setNewListName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLists = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('task_lists')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setLists(data);
      } catch (error) {
        console.error('Error fetching task lists:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLists();
  }, [user]);

  const handleAddList = async (e) => {
    e.preventDefault();
    if (!newListName.trim()) return;

    try {
      const { data, error } = await supabase
        .from('task_lists')
        .insert([{ name: newListName, user_id: user.id }])
        .select();

      if (error) throw error;
      setLists([data[0], ...lists]);
      setNewListName('');
    } catch (error) {
      console.error('Error adding task list:', error);
    }
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (!user) return <div className="text-center py-8">Please sign in to view task lists</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-blue-600 mb-6">Your Task Lists</h1>
      
      <form onSubmit={handleAddList} className="mb-6 flex gap-2">
        <input
          type="text"
          value={newListName}
          onChange={(e) => setNewListName(e.target.value)}
          placeholder="New list name"
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <button 
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <FaPlus /> Add
        </button>
      </form>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {lists.map(list => (
          <Link 
            key={list.id} 
            to={`/lists/${list.id}`}
            className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition-all"
          >
            <div className="flex items-center gap-3">
              <FaList className="text-blue-500 text-xl" />
              <h2 className="font-medium text-lg">{list.name}</h2>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Created: {new Date(list.created_at).toLocaleDateString()}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}