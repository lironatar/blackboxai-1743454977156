import { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function TasksPage() {
  const { user } = useAuth();

  // Redirect to lists view since we now use task lists
  useEffect(() => {
    if (user) {
      window.location.href = '/lists';
    }
  }, [user]);

  if (!user) return <div className="text-center py-8">Please sign in to view tasks</div>;
  
  return null;
}