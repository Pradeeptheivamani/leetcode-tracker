import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiOutlineCode, HiOutlineSearch } from 'react-icons/hi';
import toast, { Toaster } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const { connectLeetCode } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      await connectLeetCode(username);
      toast.success('LeetCode profile connected');
      navigate('/');
    } catch (err) {
      toast.error(err.message || 'Unable to fetch LeetCode profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-shell min-h-screen bg-surface-50 dark:bg-surface-950 flex items-center justify-center p-4">
      <Toaster position="top-right" />
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.55, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="mb-8 text-center">
          <motion.div
            animate={{ y: [0, -8, 0], rotate: [0, 2, -2, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-emerald-500 shadow-xl shadow-primary-500/30"
          >
            <HiOutlineCode className="h-8 w-8 text-white" />
          </motion.div>
          <h1 className="mt-4 text-3xl font-bold text-gradient">LeetCode Analyzer</h1>
          <p className="mt-2 text-surface-500 dark:text-surface-400">
            Analyze your original public LeetCode profile. No manual sign up.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.45 }}
          className="glass-card p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="leetcode-username" className="mb-1.5 block text-sm font-medium text-surface-700 dark:text-surface-300">
                LeetCode Username
              </label>
              <div className="relative">
                <HiOutlineSearch className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-surface-400" />
                <input
                  id="leetcode-username"
                  type="text"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  className="input-field pl-10"
                  placeholder="your-leetcode-username"
                  required
                />
              </div>
            </div>

            <motion.button
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center disabled:opacity-50"
            >
              {loading ? <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" /> : 'Analyze Profile'}
            </motion.button>
          </form>

          <p className="mt-5 text-center text-xs leading-5 text-surface-400">
            This app does not ask for your LeetCode password or Gmail password. It reads public profile statistics only.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
