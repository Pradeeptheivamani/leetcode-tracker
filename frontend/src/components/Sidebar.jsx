import { NavLink } from 'react-router-dom';
import {
  HiOutlineViewGrid,
  HiOutlineCollection,
  HiOutlineChartBar,
  HiOutlineLogout,
  HiOutlineCode,
  HiOutlineUserGroup,
} from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { to: '/', icon: HiOutlineViewGrid, label: 'Dashboard' },
  { to: '/problems', icon: HiOutlineCollection, label: 'Problems' },
  { to: '/analytics', icon: HiOutlineChartBar, label: 'Analytics' },
  { to: '/leaderboard', icon: HiOutlineUserGroup, label: 'Leaderboard' },
];

export default function Sidebar({ isOpen, mobileOpen, onClose }) {
  const { logout, user } = useAuth();

  const sidebarClasses = `
    fixed top-0 left-0 h-full z-50
    glass-sidebar
    transition-all duration-300 ease-in-out
    flex flex-col
    ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
    lg:translate-x-0
    ${isOpen ? 'w-64' : 'w-20'}
  `;

  return (
    <aside className={sidebarClasses}>
      {/* Logo */}
      <div className="h-16 flex items-center gap-3 px-5 border-b border-surface-200/50 dark:border-surface-800/50">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-primary-500/20">
          <HiOutlineCode className="w-5 h-5 text-white" />
        </div>
        {isOpen && (
          <span className="text-lg font-bold text-gradient whitespace-nowrap">
            LC Tracker
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all duration-200
              ${
                isActive
                  ? 'bg-primary-500/10 dark:bg-primary-500/15 text-primary-600 dark:text-primary-400 shadow-sm'
                  : 'text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800/60 hover:text-surface-900 dark:hover:text-surface-200'
              }`
            }
          >
            <Icon className="w-5 h-5 flex-shrink-0" />
            {isOpen && <span className="whitespace-nowrap">{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* User / Logout */}
      <div className="p-3 border-t border-surface-200/50 dark:border-surface-800/50">
        {isOpen && user && (
          <div className="px-3 py-2 mb-2">
            <p className="text-sm font-semibold text-surface-800 dark:text-surface-200 truncate">
              {user.username}
            </p>
            <p className="text-xs text-surface-500 truncate">{user.email}</p>
          </div>
        )}
        <button
          onClick={logout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-surface-600 dark:text-surface-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 font-medium transition-all duration-200"
        >
          <HiOutlineLogout className="w-5 h-5 flex-shrink-0" />
          {isOpen && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}
