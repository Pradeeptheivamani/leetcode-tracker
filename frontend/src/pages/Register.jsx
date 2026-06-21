import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiOutlineCode, HiOutlineLockClosed, HiOutlineMail, HiOutlineUser } from 'react-icons/hi';
import toast, { Toaster } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const result = await register(username, email, password);
      toast.success(result.local ? 'Local account created.' : 'Account created successfully!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Registration failed');
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
          <h1 className="mt-4 text-3xl font-bold text-gradient">Create Account</h1>
          <p className="mt-2 text-surface-500 dark:text-surface-400">Start tracking your progress</p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.45 }}
          className="glass-card p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="username" className="mb-1.5 block text-sm font-medium text-surface-700 dark:text-surface-300">
                Username
              </label>
              <div className="relative">
                <HiOutlineUser className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-surface-400" />
                <input id="username" type="text" value={username} onChange={(event) => setUsername(event.target.value)} className="input-field pl-10" placeholder="johndoe" required />
              </div>
            </div>

            <div>
              <label htmlFor="reg-email" className="mb-1.5 block text-sm font-medium text-surface-700 dark:text-surface-300">
                Email
              </label>
              <div className="relative">
                <HiOutlineMail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-surface-400" />
                <input id="reg-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="input-field pl-10" placeholder="you@example.com" required />
              </div>
            </div>

            <div>
              <label htmlFor="reg-password" className="mb-1.5 block text-sm font-medium text-surface-700 dark:text-surface-300">
                Password
              </label>
              <div className="relative">
                <HiOutlineLockClosed className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-surface-400" />
                <input id="reg-password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="input-field pl-10" placeholder="••••••••" required minLength={6} />
              </div>
            </div>

            <div>
              <label htmlFor="confirm-password" className="mb-1.5 block text-sm font-medium text-surface-700 dark:text-surface-300">
                Confirm Password
              </label>
              <div className="relative">
                <HiOutlineLockClosed className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-surface-400" />
                <input id="confirm-password" type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} className="input-field pl-10" placeholder="••••••••" required minLength={6} />
              </div>
            </div>

            <motion.button whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }} type="submit" disabled={loading} className="btn-primary w-full justify-center disabled:opacity-50">
              {loading ? <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" /> : 'Create Account'}
            </motion.button>
          </form>

          <p className="mt-6 text-center text-sm text-surface-500 dark:text-surface-400">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-primary-500 hover:text-primary-600">
              Sign in
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
