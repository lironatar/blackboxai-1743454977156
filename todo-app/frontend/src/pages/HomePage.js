import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

export default function HomePage() {
  const { user } = useAuth();

  return (
    <div className="text-center py-12">
      <h1 className="text-4xl font-bold text-blue-600 mb-6">Welcome to TodoApp</h1>
      <p className="text-lg text-gray-600 mb-8">
        {user ? 'Manage your tasks efficiently' : 'Please sign in to manage your tasks'}
      </p>
      {user ? (
        <Link
          to="/tasks"
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
        >
          Go to Tasks
        </Link>
      ) : (
        <Link
          to="/login"
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
        >
          Sign In
        </Link>
      )}
    </div>
  );
}