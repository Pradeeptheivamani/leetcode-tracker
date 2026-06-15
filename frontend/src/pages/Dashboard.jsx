import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  HiOutlineCheckCircle,
  HiOutlineFire,

  HiOutlineAcademicCap,
  HiOutlineCode,
  HiOutlineGlobeAlt,
  HiOutlineStar,
  HiOutlineSearch,
  HiOutlineDownload
} from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import * as XLSX from 'xlsx';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

export default function Dashboard() {
  const { user, updateProfile } = useAuth();
  const [usernameInput, setUsernameInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const [lcStats, setLcStats] = useState(null);
  const [lcLoading, setLcLoading] = useState(false);
  const [lcError, setLcError] = useState('');

  // Search Other Users State
  const [searchOtherInput, setSearchOtherInput] = useState('');
  const [searchedOtherStats, setSearchedOtherStats] = useState(null);
  const [isSearchingOther, setIsSearchingOther] = useState(false);
  const [searchOtherError, setSearchOtherError] = useState('');
  const isExportReady = !!searchedOtherStats && !isSearchingOther;


  useEffect(() => {
    if (user?.leetcodeUsername) {
      fetchLeetCodeStats(user.leetcodeUsername);
    }
  }, [user?.leetcodeUsername]);

  const fetchLeetCodeStats = async (username) => {
    setLcLoading(true);
    setLcError('');
    try {
      // Fetch general stats
      const { data: statsData } = await axios.get(`https://alfa-leetcode-api.onrender.com/${username}`);

      if (statsData.errors) {
        throw new Error('User not found on LeetCode');
      }

      // Fetch contest stats
      const { data: contestData } = await axios.get(`https://alfa-leetcode-api.onrender.com/${username}/contest`);

      setLcStats({
        ...statsData,
        contestRating: contestData?.contestRating ? Math.round(contestData.contestRating) : 'N/A',
        globalRanking: statsData.ranking || 'N/A',
      });
    } catch (error) {
      console.error('Error fetching LeetCode stats:', error);
      setLcError('Failed to fetch LeetCode statistics.');
    } finally {
      setLcLoading(false);
    }
  };

  const handleSaveUsername = async (e) => {
    e.preventDefault();
    if (!usernameInput.trim()) return;

    setIsSaving(true);
    try {
      await updateProfile({ leetcodeUsername: usernameInput.trim() });
    } catch (error) {
      console.error('Failed to save username:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSearchOther = async (e) => {
    e.preventDefault();
    if (!searchOtherInput.trim()) return;

    setIsSearchingOther(true);
    setSearchOtherError('');
    setSearchedOtherStats(null);

    const username = searchOtherInput.trim();
    const endpoint = `https://alfa-leetcode-api.onrender.com/${username}`;

    try {
      console.log('Fetching from:', endpoint);

      // Success is determined by HTTP request succeeding.
      const { data: rawResponse } = await axios.get(endpoint);
      console.log('API Response (raw stats):', rawResponse);

      // Requirement: API response may be nested or direct.
      const resolvedMatchedUser =
        rawResponse?.data?.matchedUser ?? rawResponse?.matchedUser ?? rawResponse;

      // Extract submitStats counts from exact index mapping.
      const acSubmissionNum = resolvedMatchedUser?.submitStats?.acSubmissionNum;
      const count0 = acSubmissionNum?.[0]?.count ?? 0;
      const count1 = acSubmissionNum?.[1]?.count ?? 0;
      const count2 = acSubmissionNum?.[2]?.count ?? 0;
      const count3 = acSubmissionNum?.[3]?.count ?? 0;

      // Extract username + ranking from profile.
      const profile = resolvedMatchedUser?.profile ?? {};
      const extractedUsername = profile?.username || resolvedMatchedUser?.username || username;
      const extractedRanking = profile?.ranking ?? resolvedMatchedUser?.ranking ?? 0;

      // contest endpoint is separate; keep it but do not store N/A.
      let contestRating = 0;
      try {
        const { data: contestData } = await axios.get(`${endpoint}/contest`);
        console.log('API Response (raw contest):', contestData);
        contestRating = contestData?.contestRating != null ? Math.round(contestData.contestRating) : 0;
      } catch (contestErr) {
        console.error('Contest API error:', contestErr);
        contestRating = 0;
      }

      const mapped = {
        username: extractedUsername,
        totalSolved: Number(count0) || 0,
        easy: Number(count1) || 0,
        medium: Number(count2) || 0,
        hard: Number(count3) || 0,
        contestRating: Number(contestRating) || 0,
        globalRanking: Number(extractedRanking) || 0,
        // acceptanceRate may not exist; store 0 if missing.
        acceptanceRate: Number(resolvedMatchedUser?.acceptanceRate ?? profile?.acceptanceRate ?? 0) || 0,
      };

      console.log('API mapped object (pre setSearchedOtherStats):', mapped);
      // Requirement: state assignment MUST store ONLY real values; never "N/A".
      // If field missing -> 0.
      setSearchedOtherStats(mapped);
    } catch (error) {
      console.error('Search error (Stats request):', error);
      setSearchOtherError('User not found');
    } finally {
      setIsSearchingOther(false);
    }
  };


  const handleExportExcel = () => {
    // Requirement: Excel must use searchedOtherStats directly AFTER successful state update.
    // Add guard: if data not ready, disable export.
    if (!searchedOtherStats) return;

    console.log('Exporting Excel data (pre-export state):', searchedOtherStats);

    const dataToExport = [{
      Username: searchedOtherStats.username,
      'Total Solved': searchedOtherStats.totalSolved ?? 0,
      Easy: searchedOtherStats.easy ?? 0,
      Medium: searchedOtherStats.medium ?? 0,
      Hard: searchedOtherStats.hard ?? 0,
      'Contest Rating': searchedOtherStats.contestRating ?? 0,
      'Global Ranking': searchedOtherStats.globalRanking ?? 0,
      'Acceptance Rate': searchedOtherStats.acceptanceRate ?? 0,
    }];

    console.log('Export Excel object (pre XLSX generation):', dataToExport);


    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Statistics');
    
    XLSX.writeFile(workbook, `${searchedOtherStats.username}_leetcode_stats.xlsx`);
  };

  const platformStats = [
    {
      label: 'Problems Solved (App)',
      value: user?.problemsSolved || '0',
      icon: HiOutlineCheckCircle,
      color: 'from-emerald-400 to-emerald-600',
      bgColor: 'bg-emerald-50 dark:bg-emerald-900/20',
    },
    {
      label: 'Current Streak',
      value: `${user?.streak?.current || 0} days`,
      icon: HiOutlineFire,
      color: 'from-orange-400 to-red-500',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
    },
    {
      label: 'Interview Score',
      value: user?.interviewScore || '0',
      icon: HiOutlineAcademicCap,
      color: 'from-purple-400 to-pink-500',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
    },
  ];

  const leetCodeCards = lcStats ? [
    {
      label: 'Total Solved',
      value: lcStats.solvedProblem,
      total: lcStats.totalQuestions,
      icon: HiOutlineCode,
      color: 'from-blue-400 to-indigo-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    },
    {
      label: 'Easy / Medium / Hard',
      value: `${lcStats.easySolved} / ${lcStats.mediumSolved} / ${lcStats.hardSolved}`,
      icon: HiOutlineCheckCircle,
      color: 'from-emerald-400 to-emerald-600',
      bgColor: 'bg-emerald-50 dark:bg-emerald-900/20',
    },
    {
      label: 'Contest Rating',
      value: lcStats.contestRating,
      icon: HiOutlineStar,
      color: 'from-yellow-400 to-orange-500',
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
    },
    {
      label: 'Global Ranking',
      value: lcStats.globalRanking,
      icon: HiOutlineGlobeAlt,
      color: 'from-purple-400 to-pink-500',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
    },
  ] : [];

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      {/* Page Header */}
      <motion.div variants={item}>
        <h1 className="text-2xl md:text-3xl font-bold text-surface-900 dark:text-surface-50">
          Dashboard
        </h1>
        <p className="mt-1 text-surface-500 dark:text-surface-400">
          Welcome back, {user?.username}! Here is your coding journey at a glance.
        </p>
      </motion.div>

      {/* Internal Stats Grid */}
      <motion.div
        variants={container}
        className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6"
      >
        {platformStats.map((stat) => (
          <motion.div key={stat.label} variants={item} className="stat-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-surface-500 dark:text-surface-400">
                  {stat.label}
                </p>
                <p className="mt-2 text-3xl font-bold text-surface-900 dark:text-surface-50">
                  {stat.value}
                </p>
              </div>
              <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                <stat.icon className={`w-6 h-6 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`} style={{ stroke: 'url(#gradient)' }} />
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* LeetCode Integration Section */}
      <motion.div variants={item} className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-surface-900 dark:text-surface-50 flex items-center gap-2">
            <img src="https://upload.wikimedia.org/wikipedia/commons/1/19/LeetCode_logo_black.png" alt="LeetCode" className="w-6 h-6 dark:invert" />
            LeetCode Statistics
          </h2>
        </div>

        {!user?.leetcodeUsername ? (
          <div className="bg-surface-50 dark:bg-surface-800/50 rounded-xl p-6 text-center border border-surface-200 dark:border-surface-700">
            <HiOutlineCode className="w-12 h-12 mx-auto text-surface-400 mb-4" />
            <h3 className="text-lg font-medium text-surface-900 dark:text-surface-50 mb-2">
              Connect Your LeetCode Account
            </h3>
            <p className="text-surface-500 dark:text-surface-400 mb-6 max-w-md mx-auto">
              Enter your LeetCode username to automatically fetch and display your progress, contest rating, and global ranking.
            </p>
            <form onSubmit={handleSaveUsername} className="flex max-w-sm mx-auto gap-2">
              <input
                type="text"
                placeholder="LeetCode Username"
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                className="input-field flex-1"
                required
              />
              <button
                type="submit"
                disabled={isSaving}
                className="btn-primary whitespace-nowrap"
              >
                {isSaving ? 'Saving...' : 'Connect'}
              </button>
            </form>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-medium text-surface-500 dark:text-surface-400">
                Connected as: <span className="text-primary-600 dark:text-primary-400 font-bold">{user.leetcodeUsername}</span>
              </p>
              <button
                onClick={() => updateProfile({ leetcodeUsername: '' })}
                className="text-xs text-surface-400 hover:text-red-500 transition-colors"
              >
                Disconnect
              </button>
            </div>

            {lcLoading ? (
              <div className="animate-pulse flex space-x-4">
                <div className="flex-1 space-y-4 py-1">
                  <div className="h-4 bg-surface-200 dark:bg-surface-700 rounded w-3/4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-surface-200 dark:bg-surface-700 rounded"></div>
                    <div className="h-4 bg-surface-200 dark:bg-surface-700 rounded w-5/6"></div>
                  </div>
                </div>
              </div>
            ) : lcError ? (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl border border-red-200 dark:border-red-800">
                {lcError}
              </div>
            ) : lcStats ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6 mt-4">
                {leetCodeCards.map((stat) => (
                  <div key={stat.label} className="bg-surface-50 dark:bg-surface-800/50 p-4 rounded-xl border border-surface-200 dark:border-surface-700">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-surface-500 dark:text-surface-400">
                        {stat.label}
                      </p>
                      <stat.icon className={`w-5 h-5 text-surface-400`} />
                    </div>
                    <p className="text-2xl font-bold text-surface-900 dark:text-surface-50">
                      {stat.value}
                      {stat.total && <span className="text-sm text-surface-400 font-normal ml-1">/ {stat.total}</span>}
                    </p>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        )}
      </motion.div>

      {/* Search Other Users Section */}
      <motion.div variants={item} className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-surface-900 dark:text-surface-50 flex items-center gap-2">
            <HiOutlineSearch className="w-6 h-6" />
            Search Other LeetCode Users
          </h2>
        </div>

        <form onSubmit={handleSearchOther} className="flex gap-2 max-w-md mb-6">
          <input
            type="text"
            placeholder="Enter public LeetCode username..."
            value={searchOtherInput}
            onChange={(e) => setSearchOtherInput(e.target.value)}
            className="input-field flex-1"
            required
          />
          <button type="submit" disabled={isSearchingOther} className="btn-primary">
            {isSearchingOther ? 'Searching...' : 'Search'}
          </button>
        </form>

        {searchOtherError && (
          <p className="mb-4 text-sm text-red-500 font-medium">{searchOtherError}</p>
        )}

        {searchedOtherStats && (
          <div className="bg-surface-50 dark:bg-surface-800/50 p-6 rounded-xl border border-surface-200 dark:border-surface-700">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <h3 className="text-lg font-bold text-primary-600 dark:text-primary-400">
                {searchedOtherStats.username}
              </h3>
              <button 
                onClick={handleExportExcel}
                disabled={!isExportReady}
                className="btn-secondary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <HiOutlineDownload className="w-5 h-5" /> Download Excel
              </button>

            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-xs text-surface-500 uppercase tracking-wider mb-1">Total Solved</p>
                <p className="font-bold text-xl text-surface-900 dark:text-surface-50">{searchedOtherStats.totalSolved ?? 0}</p>

              </div>
              <div className="flex gap-2">
                <div className="flex-1"><p className="text-[10px] text-emerald-500 uppercase">Easy</p><p className="font-semibold">{searchedOtherStats.easy ?? 0}</p></div>
                <div className="flex-1"><p className="text-[10px] text-yellow-500 uppercase">Med</p><p className="font-semibold">{searchedOtherStats.medium ?? 0}</p></div>
                <div className="flex-1"><p className="text-[10px] text-red-500 uppercase">Hard</p><p className="font-semibold">{searchedOtherStats.hard ?? 0}</p></div>

              </div>
              <div>
                <p className="text-xs text-surface-500 uppercase tracking-wider mb-1">Contest Rating</p>
                <p className="font-bold text-lg text-surface-900 dark:text-surface-50">{searchedOtherStats.contestRating ?? 0}</p>

              </div>
              <div>
                <p className="text-xs text-surface-500 uppercase tracking-wider mb-1">Global Ranking</p>
                <p className="font-bold text-lg text-surface-900 dark:text-surface-50">{searchedOtherStats.globalRanking ?? 0}</p>
              </div>
              <div>
                <p className="text-xs text-surface-500 uppercase tracking-wider mb-1">Acceptance Rate</p>
                <p className="font-bold text-lg text-surface-900 dark:text-surface-50">{searchedOtherStats.acceptanceRate ?? 0}%</p>
              </div>

            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
