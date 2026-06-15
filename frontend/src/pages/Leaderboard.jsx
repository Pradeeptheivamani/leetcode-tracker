import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiOutlineSearch,
  HiOutlineUserAdd,
  HiOutlineUserRemove,
  HiOutlineRefresh,
  HiOutlineScale
} from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function Leaderboard() {
  const { user, trackUser, untrackUser } = useAuth();
  
  // Search state
  const [searchInput, setSearchInput] = useState('');
  const [searchedUser, setSearchedUser] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState('');

  // Leaderboard state
  const [trackedStats, setTrackedStats] = useState([]);
  const [isLoadingStats, setIsLoadingStats] = useState(false);
  const [sortBy, setSortBy] = useState('solved'); // 'solved', 'rating', 'ranking'

  // Comparison State
  const [compareList, setCompareList] = useState([]);
  const [showCompareModal, setShowCompareModal] = useState(false);

  const fetchUserStats = async (username) => {
    try {
      const [statsRes, contestRes] = await Promise.all([
        axios.get(`https://alfa-leetcode-api.onrender.com/${username}`),
        axios.get(`https://alfa-leetcode-api.onrender.com/${username}/contest`)
      ]);

      if (statsRes.data.errors) {
        throw new Error('User not found');
      }

      return {
        username,
        totalSolved: statsRes.data.solvedProblem || 0,
        easy: statsRes.data.easySolved || 0,
        medium: statsRes.data.mediumSolved || 0,
        hard: statsRes.data.hardSolved || 0,
        contestRating: contestRes.data?.contestRating ? Math.round(contestRes.data.contestRating) : 0,
        globalRanking: statsRes.data.ranking || Infinity,
      };
    } catch (error) {
      console.error(`Failed to fetch stats for ${username}`, error);
      return null;
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    
    setIsSearching(true);
    setSearchError('');
    setSearchedUser(null);
    
    const stats = await fetchUserStats(searchInput.trim());
    if (stats) {
      setSearchedUser(stats);
    } else {
      setSearchError('User not found on LeetCode.');
    }
    setIsSearching(false);
  };

  const loadLeaderboard = async () => {
    if (!user?.trackedUsers || user.trackedUsers.length === 0) {
      setTrackedStats([]);
      return;
    }

    setIsLoadingStats(true);
    const promises = user.trackedUsers.map((username) => fetchUserStats(username));
    const results = await Promise.all(promises);
    
    setTrackedStats(results.filter((res) => res !== null));
    setIsLoadingStats(false);
  };

  useEffect(() => {
    loadLeaderboard();
  }, [user?.trackedUsers]);

  const handleToggleTrack = async (username) => {
    if (user.trackedUsers.includes(username)) {
      await untrackUser(username);
      // Remove from compare list if untracked
      setCompareList(prev => prev.filter(u => u.username !== username));
    } else {
      await trackUser(username);
    }
  };

  const handleToggleCompare = (stats) => {
    setCompareList(prev => {
      if (prev.find(u => u.username === stats.username)) {
        return prev.filter(u => u.username !== stats.username);
      } else {
        if (prev.length >= 4) {
          alert('You can compare up to 4 users at once.');
          return prev;
        }
        return [...prev, stats];
      }
    });
  };

  const sortedStats = [...trackedStats].sort((a, b) => {
    if (sortBy === 'solved') return b.totalSolved - a.totalSolved;
    if (sortBy === 'rating') return b.contestRating - a.contestRating;
    if (sortBy === 'ranking') return a.globalRanking - b.globalRanking;
    return 0;
  });

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-surface-900 dark:text-surface-50">
            Leaderboard & Tracking
          </h1>
          <p className="mt-1 text-surface-500 dark:text-surface-400">
            Search, track, and compare your peers.
          </p>
        </div>
        <div className="flex gap-2">
          {compareList.length > 0 && (
            <button onClick={() => setShowCompareModal(true)} className="btn-secondary">
              <HiOutlineScale className="w-5 h-5" /> Compare ({compareList.length})
            </button>
          )}
          <button onClick={loadLeaderboard} className="btn-secondary" title="Refresh Stats">
            <HiOutlineRefresh className={`w-5 h-5 ${isLoadingStats ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </motion.div>

      {/* Search Section */}
      <motion.div variants={item} className="glass-card p-6">
        <form onSubmit={handleSearch} className="flex gap-2 max-w-md">
          <div className="relative flex-1">
            <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
            <input
              type="text"
              placeholder="Search LeetCode username..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="input-field pl-10"
              required
            />
          </div>
          <button type="submit" disabled={isSearching} className="btn-primary">
            {isSearching ? 'Searching...' : 'Search'}
          </button>
        </form>

        {searchError && (
          <p className="mt-3 text-sm text-red-500">{searchError}</p>
        )}

        <AnimatePresence>
          {searchedUser && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }} 
              animate={{ opacity: 1, height: 'auto' }} 
              exit={{ opacity: 0, height: 0 }}
              className="mt-6 border-t border-surface-200 dark:border-surface-700 pt-4"
            >
              <div className="flex items-center justify-between bg-surface-50 dark:bg-surface-800 p-4 rounded-xl">
                <div>
                  <p className="font-bold text-lg text-surface-900 dark:text-surface-50">{searchedUser.username}</p>
                  <p className="text-sm text-surface-500">Solved: {searchedUser.totalSolved} | Rating: {searchedUser.contestRating}</p>
                </div>
                <button 
                  onClick={() => handleToggleTrack(searchedUser.username)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                    user.trackedUsers.includes(searchedUser.username)
                    ? 'bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50'
                    : 'bg-primary-100 text-primary-600 hover:bg-primary-200 dark:bg-primary-900/30 dark:hover:bg-primary-900/50'
                  }`}
                >
                  {user.trackedUsers.includes(searchedUser.username) ? (
                    <><HiOutlineUserRemove className="w-5 h-5"/> Untrack</>
                  ) : (
                    <><HiOutlineUserAdd className="w-5 h-5"/> Track</>
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Leaderboard Section */}
      <motion.div variants={item} className="glass-card overflow-hidden flex flex-col">
        <div className="p-4 border-b border-surface-200/50 dark:border-surface-700/50 flex flex-col sm:flex-row gap-3 justify-between items-center">
          <h2 className="text-lg font-bold text-surface-900 dark:text-surface-50">Tracked Users</h2>
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="input-field w-auto text-sm py-1.5"
          >
            <option value="solved">Sort by Total Solved</option>
            <option value="rating">Sort by Contest Rating</option>
            <option value="ranking">Sort by Global Ranking</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-surface-200/50 dark:border-surface-700/50 bg-surface-50/50 dark:bg-surface-800/20">
                <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider text-surface-500">Rank</th>
                <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider text-surface-500">Username</th>
                <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider text-surface-500">Solved (E/M/H)</th>
                <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider text-surface-500">Contest Rating</th>
                <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider text-surface-500">Global Ranking</th>
                <th className="text-right px-6 py-4 text-xs font-semibold uppercase tracking-wider text-surface-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-200/50 dark:divide-surface-700/50">
              {isLoadingStats ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-surface-500">Loading leaderboard stats...</td>
                </tr>
              ) : sortedStats.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-surface-500">
                    <HiOutlineUserGroup className="w-12 h-12 mx-auto mb-3 opacity-40" />
                    <p>No tracked users.</p>
                  </td>
                </tr>
              ) : (
                sortedStats.map((stat, index) => {
                  const isCompared = compareList.find(u => u.username === stat.username);
                  return (
                    <tr key={stat.username} className="hover:bg-surface-50 dark:hover:bg-surface-800/30 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-surface-900 dark:text-surface-50">
                        #{index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-primary-600 dark:text-primary-400">
                        {stat.username} {stat.username === user?.leetcodeUsername && '(You)'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-surface-700 dark:text-surface-300">
                        {stat.totalSolved} <span className="text-surface-400 text-xs ml-1">({stat.easy}/{stat.medium}/{stat.hard})</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-surface-700 dark:text-surface-300">
                        {stat.contestRating || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-surface-700 dark:text-surface-300">
                        {stat.globalRanking === Infinity ? '-' : stat.globalRanking.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                        <button 
                          onClick={() => handleToggleCompare(stat)}
                          className={`px-3 py-1 rounded text-xs transition-colors ${
                            isCompared ? 'bg-primary-500 text-white' : 'bg-surface-200 dark:bg-surface-700 text-surface-700 dark:text-surface-300 hover:bg-surface-300'
                          }`}
                        >
                          {isCompared ? 'Comparing' : 'Compare'}
                        </button>
                        <button 
                          onClick={() => handleToggleTrack(stat.username)}
                          className="text-red-500 hover:text-red-700 px-2"
                          title="Untrack"
                        >
                          <HiOutlineUserRemove className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Comparison Modal */}
      <AnimatePresence>
        {showCompareModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-surface-900 rounded-2xl shadow-2xl max-w-4xl w-full p-6 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-surface-900 dark:text-surface-50">Compare Users</h2>
                <button onClick={() => setShowCompareModal(false)} className="text-surface-500 hover:text-surface-900 text-2xl leading-none">&times;</button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {compareList.map(u => (
                  <div key={u.username} className="bg-surface-50 dark:bg-surface-800 p-4 rounded-xl relative">
                    <button 
                      onClick={() => handleToggleCompare(u)}
                      className="absolute top-2 right-2 text-surface-400 hover:text-red-500"
                    >&times;</button>
                    <h3 className="font-bold text-lg mb-4 text-primary-600 dark:text-primary-400 truncate pr-6">{u.username}</h3>
                    
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-surface-500 uppercase tracking-wider">Total Solved</p>
                        <p className="font-bold text-xl">{u.totalSolved}</p>
                      </div>
                      <div className="flex gap-2">
                        <div className="flex-1"><p className="text-[10px] text-emerald-500 uppercase">Easy</p><p className="font-semibold">{u.easy}</p></div>
                        <div className="flex-1"><p className="text-[10px] text-yellow-500 uppercase">Med</p><p className="font-semibold">{u.medium}</p></div>
                        <div className="flex-1"><p className="text-[10px] text-red-500 uppercase">Hard</p><p className="font-semibold">{u.hard}</p></div>
                      </div>
                      <div>
                        <p className="text-xs text-surface-500 uppercase tracking-wider">Contest Rating</p>
                        <p className="font-bold text-lg">{u.contestRating || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-surface-500 uppercase tracking-wider">Global Rank</p>
                        <p className="font-bold">{u.globalRanking === Infinity ? 'N/A' : u.globalRanking.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
