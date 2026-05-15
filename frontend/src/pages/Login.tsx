import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { LogIn } from 'lucide-react';
import api from '../services/api';
import { setCredentials } from '../store/slices/authSlice';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', { email, password });
      dispatch(setCredentials(res.data));
      toast.success('Logged in successfully!');
      navigate('/dashboard');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to login');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md p-8 space-y-6 glass rounded-2xl"
      >
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-primary/20 rounded-full">
              <LogIn className="w-8 h-8 text-primary" />
            </div>
          </div>
          <h2 className="text-3xl font-bold">Welcome Back</h2>
          <p className="mt-2 text-gray-400">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300">Email</label>
            <input
              type="email"
              required
              className="w-full px-4 py-2 mt-1 bg-surface border border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">Password</label>
            <input
              type="password"
              required
              className="w-full px-4 py-2 mt-1 bg-surface border border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 mt-4 text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors focus:ring-4 focus:ring-primary/50 font-medium"
          >
            Sign In
          </button>
        </form>

        <p className="text-center text-gray-400 text-sm">
          Don't have an account?{' '}
          <Link to="/signup" className="text-primary hover:underline">
            Sign up
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
