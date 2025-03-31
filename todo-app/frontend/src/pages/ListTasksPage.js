import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../contexts/AuthContext';
import TaskForm from '../components/TaskForm';
import TaskCard from '../components/TaskCard';
import { FaArrowLeft, FaList } from 'react-icons/fa';

export default function ListTasksPage() {
  const { listId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [list, setList] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      
      try {
        // Get list details
        const { data: listData, error: listError } = await supabase
          .from('task_lists')
          .select('*')
          .eq('id', listId)
          .single();

        if (listError) throw listError;
        setList(listData);

        // Get tasks for this list
        const { data: tasksData, error: tasksError } = await supabase
          .from('tasks')
          .select('*')
          .eq('list_id', listId)
          .order('created_at', { ascending: false });

        if (tasksError) throw tasksError;
        setTasks(tasksData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, listId]);

  const handleAddTask = async (newTask) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert([{ ...newTask, user_id: user.id, list_id: listId }])
        .select();

      if (error) throw error;
      setTasks([data[0], ...tasks]);
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (!user) return <div className="text-center py-8">Please sign in</div>;
  if (!list) return <div className="text-center py-8">List not found</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-6">
        <button 
          onClick={() => navigate('/lists')}
          className="p-2 rounded-full hover:bg-gray-100"
        >
          <FaArrowLeft className="text-blue-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-blue-600 flex items-center gap-2">
            <FaList /> {list.name}
          </h1>
          <p className="text-sm text-gray-500">
            Created: {new Date(list.created_at).toLocaleDateString()}
          </p>
        </div>
      </div>

      <TaskForm onSubmit={handleAddTask} />
      
      <div className="space-y-4 mt-6">
        {tasks.map(task => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
}