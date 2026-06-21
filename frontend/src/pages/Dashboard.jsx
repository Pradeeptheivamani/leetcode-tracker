import { useEffect, useState } from 'react';
import { Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { HiOutlineAcademicCap, HiOutlineChartBar, HiOutlineCheckCircle, HiOutlineFire } from 'react-icons/hi';
import StatCard from '../components/StatCard';
import ProgressBar from '../components/ProgressBar';
import { companyReadiness, monthlySolved, topicMastery } from '../data/mockData';
import { useAuth } from '../context/AuthContext';

const emptyStats = {
  totalSolved: 0,
  easyCount: 0,
  mediumCount: 0,
  hardCount: 0,
  dailyStreak: 0,
  readinessScore: 0,
  readinessClass: 'Beginner',
  contestRating: 0,
  globalRanking: 0,
  monthlyProgress: [],
  topicMastery,
  companyReadiness,
};

function classify(score) {
  if (score <= 40) return 'Beginner';
  if (score <= 60) return 'Intermediate';
  if (score <= 80) return 'Interview Ready';
  return 'FAANG Ready';
}

function normalizeStats(data, contestData) {
  const totalSolved = Number(data.solvedProblem ?? data.totalSolved ?? data.submitStats?.acSubmissionNum?.[0]?.count ?? 0);
  const easyCount = Number(data.easySolved ?? data.easy ?? data.submitStats?.acSubmissionNum?.[1]?.count ?? 0);
  const mediumCount = Number(data.mediumSolved ?? data.medium ?? data.submitStats?.acSubmissionNum?.[2]?.count ?? 0);
  const hardCount = Number(data.hardSolved ?? data.hard ?? data.submitStats?.acSubmissionNum?.[3]?.count ?? 0);
  const contestRating = Math.round(Number(contestData?.contestRating ?? contestData?.rating ?? 0));
  const score = Math.min(100, Math.round(totalSolved * 0.18 + mediumCount * 0.2 + hardCount * 0.35 + contestRating / 35));

  return {
    ...emptyStats,
    totalSolved,
    easyCount,
    mediumCount,
    hardCount,
    contestRating,
    globalRanking: Number(data.ranking ?? data.profile?.ranking ?? 0),
    readinessScore: score,
    readinessClass: classify(score),
    monthlyProgress: monthlySolved.map((item, index) => ({
      ...item,
      value: Math.max(0, Math.round(totalSolved / 6) + (index - 2) * 2),
    })),
  };
}

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(emptyStats);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let ignore = false;

    async function loadProfile() {
      if (!user?.leetcodeUsername) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError('');
      try {
        const [profileResponse, contestResponse] = await Promise.allSettled([
          fetch(`https://alfa-leetcode-api.onrender.com/${user.leetcodeUsername}`),
          fetch(`https://alfa-leetcode-api.onrender.com/${user.leetcodeUsername}/contest`),
        ]);

        if (profileResponse.status !== 'fulfilled' || !profileResponse.value.ok) {
          throw new Error('Unable to fetch LeetCode profile');
        }

        const profileData = await profileResponse.value.json();
        const contestData = contestResponse.status === 'fulfilled' && contestResponse.value.ok
          ? await contestResponse.value.json()
          : {};

        if (!ignore) setStats(normalizeStats(profileData, contestData));
      } catch (err) {
        if (!ignore) {
          setStats(emptyStats);
          setError(err.message || 'Unable to fetch LeetCode profile');
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    loadProfile();
    return () => {
      ignore = true;
    };
  }, [user?.leetcodeUsername]);

  const difficultyData = [
    { name: 'Easy', value: stats.easyCount, color: '#10b981' },
    { name: 'Medium', value: stats.mediumCount, color: '#f59e0b' },
    { name: 'Hard', value: stats.hardCount, color: '#ef4444' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold text-surface-950 dark:text-white">Original LeetCode Profile Analysis</h1>
        <p className="text-surface-500 dark:text-surface-400">
          {loading ? `Fetching ${user?.leetcodeUsername}'s public LeetCode data...` : `Analyzing @${user?.leetcodeUsername}`}
        </p>
        {error && <p className="text-sm font-medium text-red-500">{error}</p>}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Solved" value={stats.totalSolved} icon={HiOutlineCheckCircle} tone="green" />
        <StatCard label="Contest Rating" value={stats.contestRating || '-'} icon={HiOutlineFire} tone="amber" />
        <StatCard label="Readiness Score" value={`${stats.readinessScore}/100`} icon={HiOutlineAcademicCap} />
        <StatCard label="Level" value={stats.readinessClass} icon={HiOutlineChartBar} tone="green" />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <section className="glass-card p-5 xl:col-span-2">
          <h2 className="mb-4 text-lg font-semibold text-surface-900 dark:text-white">Solved Trend Estimate</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.monthlyProgress.length ? stats.monthlyProgress : monthlySolved.map((item) => ({ ...item, value: 0 }))}>
                <XAxis dataKey="label" stroke="#71717a" />
                <YAxis stroke="#71717a" />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="glass-card p-5">
          <h2 className="mb-4 text-lg font-semibold text-surface-900 dark:text-white">Difficulty Distribution</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={difficultyData} dataKey="value" nameKey="name" innerRadius={58} outerRadius={96}>
                  {difficultyData.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <section className="glass-card p-5">
          <h2 className="mb-4 text-lg font-semibold text-surface-900 dark:text-white">Topic Mastery Estimate</h2>
          <div className="space-y-4">
            {Object.entries(stats.topicMastery).slice(0, 6).map(([label, value]) => (
              <ProgressBar key={label} label={label} value={value} />
            ))}
          </div>
        </section>
        <section className="glass-card p-5">
          <h2 className="mb-4 text-lg font-semibold text-surface-900 dark:text-white">Company Readiness Estimate</h2>
          <div className="space-y-4">
            {Object.entries(stats.companyReadiness).slice(0, 6).map(([label, value]) => (
              <ProgressBar key={label} label={label} value={value} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
