import { motion } from 'framer-motion';
import { HiOutlineChartBar } from 'react-icons/hi';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function Analytics() {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      {/* Header */}
      <motion.div variants={item}>
        <h1 className="text-2xl md:text-3xl font-bold text-surface-900 dark:text-surface-50">
          Analytics
        </h1>
        <p className="mt-1 text-surface-500 dark:text-surface-400">
          Deep insights into your coding progress
        </p>
      </motion.div>

      {/* Charts Placeholder */}
      <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold text-surface-800 dark:text-surface-200 mb-4">
            Problems by Difficulty
          </h2>
          <div className="flex items-center justify-center h-64 text-surface-400 dark:text-surface-500">
            <div className="text-center">
              <HiOutlineChartBar className="w-12 h-12 mx-auto mb-3 opacity-40" />
              <p className="font-medium">No data available</p>
              <p className="text-sm mt-1">Solve problems to see analytics</p>
            </div>
          </div>
        </div>

        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold text-surface-800 dark:text-surface-200 mb-4">
            Topic Mastery
          </h2>
          <div className="flex items-center justify-center h-64 text-surface-400 dark:text-surface-500">
            <div className="text-center">
              <HiOutlineChartBar className="w-12 h-12 mx-auto mb-3 opacity-40" />
              <p className="font-medium">No data available</p>
              <p className="text-sm mt-1">Track topics to see mastery levels</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Streak Calendar Placeholder */}
      <motion.div variants={item} className="glass-card p-6">
        <h2 className="text-lg font-semibold text-surface-800 dark:text-surface-200 mb-4">
          Solving Streak
        </h2>
        <div className="flex items-center justify-center h-48 text-surface-400 dark:text-surface-500">
          <div className="text-center">
            <HiOutlineChartBar className="w-12 h-12 mx-auto mb-3 opacity-40" />
            <p className="font-medium">Streak calendar will appear here</p>
            <p className="text-sm mt-1">Keep solving daily to build your streak!</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
