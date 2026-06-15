import { motion } from 'framer-motion';
import { HiOutlineSearch, HiOutlinePlus, HiOutlineFilter } from 'react-icons/hi';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function Problems() {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={item} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-surface-900 dark:text-surface-50">
            Problems
          </h1>
          <p className="mt-1 text-surface-500 dark:text-surface-400">
            Track and manage your LeetCode problems
          </p>
        </div>
        <button className="btn-primary" id="add-problem-btn">
          <HiOutlinePlus className="w-4 h-4" />
          Add Problem
        </button>
      </motion.div>

      {/* Filters Bar */}
      <motion.div variants={item} className="glass-card p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
          <input
            type="text"
            placeholder="Search problems..."
            className="input-field pl-10"
            id="search-problems"
          />
        </div>
        <div className="flex gap-2">
          <select className="input-field w-auto" id="filter-difficulty">
            <option value="">All Difficulties</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
          <select className="input-field w-auto" id="filter-status">
            <option value="">All Status</option>
            <option value="Solved">Solved</option>
            <option value="Attempted">Attempted</option>
            <option value="Todo">Todo</option>
          </select>
          <button className="btn-secondary" aria-label="More filters">
            <HiOutlineFilter className="w-4 h-4" />
          </button>
        </div>
      </motion.div>

      {/* Problems Table / Empty State */}
      <motion.div variants={item} className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full" id="problems-table">
            <thead>
              <tr className="border-b border-surface-200/50 dark:border-surface-700/50">
                <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">
                  #
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">
                  Title
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">
                  Difficulty
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">
                  Status
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">
                  Topics
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">
                  Date
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan="6" className="px-6 py-16 text-center">
                  <div className="flex flex-col items-center text-surface-400 dark:text-surface-500">
                    <HiOutlineSearch className="w-12 h-12 mb-3 opacity-40" />
                    <p className="text-base font-medium">No problems tracked yet</p>
                    <p className="text-sm mt-1">Click "Add Problem" to get started</p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
}
