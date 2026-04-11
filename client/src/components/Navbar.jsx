import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="flex justify-between items-center p-4 bg-gray-900 text-white shadow-lg">
      <h1 className="text-2xl font-bold text-blue-400">🎮 Acadia XP</h1>
      {user && (
        <div className="flex items-center gap-4">
          <span className="text-sm">Welcome, {user.name}!</span>
          <button 
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded font-bold"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
