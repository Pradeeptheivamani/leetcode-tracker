import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import Problems from './pages/Problems';
import Analytics from './pages/Analytics';
import Leaderboard from './pages/Leaderboard';
import Login from './pages/Login';
import TopicMastery from './pages/TopicMastery';
import Companies from './pages/Companies';
import Contests from './pages/Contests';
import Notes from './pages/Notes';
import AiHints from './pages/AiHints';
import BulkExport from './pages/BulkExport';
import Admin from './pages/Admin';
import Profile from './pages/Profile';
import { useAuth } from './context/AuthContext';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-50 dark:bg-surface-950">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-surface-500 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return user ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Navigate to="/login" replace />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="problems" element={<Problems />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="topics" element={<TopicMastery />} />
        <Route path="companies" element={<Companies />} />
        <Route path="contests" element={<Contests />} />
        <Route path="notes" element={<Notes />} />
        <Route path="ai-hints" element={<AiHints />} />
        <Route path="leaderboard" element={<Leaderboard />} />
        <Route path="bulk-export" element={<BulkExport />} />
        <Route path="admin" element={<Admin />} />
        <Route path="profile" element={<Profile />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
