import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    const errors = {};

    if (!form.email.trim()) {
      errors.email = 'Email is required';
    } else if (!validateEmail(form.email)) {
      errors.email = 'Invalid email format';
    }

    if (!form.password) {
      errors.password = 'Password is required';
    } else if (form.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (fieldErrors[name]) {
      setFieldErrors({ ...fieldErrors, [name]: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      await login(form);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <form onSubmit={handleSubmit} className="bg-gray-800 p-8 rounded-lg w-96 shadow-lg">
        <h2 className="text-2xl font-bold text-white mb-6">Login to Acadia XP</h2>
        
        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-200 p-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <div className="mb-4">
          <input
            type="email"
            placeholder="Email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className={`w-full p-3 rounded bg-gray-700 text-white outline-none transition ${
              fieldErrors.email ? 'border-2 border-red-500' : 'border border-gray-600'
            }`}
          />
          {fieldErrors.email && (
            <p className="text-red-400 text-sm mt-1">{fieldErrors.email}</p>
          )}
        </div>

        <div className="mb-6">
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={form.password}
            onChange={handleChange}
            className={`w-full p-3 rounded bg-gray-700 text-white outline-none transition ${
              fieldErrors.password ? 'border-2 border-red-500' : 'border border-gray-600'
            }`}
          />
          {fieldErrors.password && (
            <p className="text-red-400 text-sm mt-1">{fieldErrors.password}</p>
          )}
        </div>

        <button 
          type="submit" 
          disabled={loading || Object.keys(fieldErrors).length > 0}
          className="w-full bg-blue-600 text-white p-3 rounded font-bold hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>

        <p className="text-gray-400 mt-4 text-center">
          Don't have an account? <Link to="/register" className="text-blue-400 hover:underline">Register</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
