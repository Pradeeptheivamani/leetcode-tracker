import { HiOutlineMenu, HiOutlineMoon, HiOutlineSun, HiOutlineBell } from 'react-icons/hi';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ onToggleSidebar, onToggleMobileSidebar }) {
  const { darkMode, toggleTheme } = useTheme();
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-30 glass-navbar h-16 flex items-center justify-between px-4 md:px-6">
      {/* Left section */}
      <div className="flex items-center gap-3">
        {/* Mobile hamburger */}
        <button
          onClick={onToggleMobileSidebar}
          className="lg:hidden btn-ghost p-2"
          aria-label="Toggle mobile menu"
        >
          <HiOutlineMenu className="w-5 h-5" />
        </button>

        {/* Desktop sidebar toggle */}
        <button
          onClick={onToggleSidebar}
          className="hidden lg:flex btn-ghost p-2"
          aria-label="Toggle sidebar"
        >
          <HiOutlineMenu className="w-5 h-5" />
        </button>

        <div className="hidden sm:block">
          <h1 className="text-lg font-semibold text-surface-800 dark:text-surface-100">
            Welcome back
            {user?.username ? (
              <span className="text-gradient">, {user.username}</span>
            ) : null}
          </h1>
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-2">
        {/* Notifications */}
        <button className="btn-ghost p-2 relative" aria-label="Notifications">
          <HiOutlineBell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary-500 rounded-full" />
        </button>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="btn-ghost p-2"
          aria-label="Toggle theme"
        >
          {darkMode ? (
            <HiOutlineSun className="w-5 h-5 text-amber-400" />
          ) : (
            <HiOutlineMoon className="w-5 h-5" />
          )}
        </button>

        {/* User avatar */}
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-accent-500 flex items-center justify-center text-white text-sm font-bold shadow-lg">
          {user?.username?.charAt(0)?.toUpperCase() || 'U'}
        </div>
      </div>
    </header>
  );
}
