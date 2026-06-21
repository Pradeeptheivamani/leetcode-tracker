import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import StatCard from '../components/StatCard';
import { contests } from '../data/mockData';
import { HiOutlineChartBar, HiOutlineStar, HiOutlineUserGroup } from 'react-icons/hi';

export default function Contests() {
  const bestRank = Math.min(...contests.map((contest) => contest.rankValue));
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-surface-950 dark:text-white">Contest Tracker</h1>
        <p className="text-surface-500 dark:text-surface-400">History, rating graph, participation count, and best rank.</p>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatCard label="Participation" value={contests.length} icon={HiOutlineUserGroup} />
        <StatCard label="Best Rank" value={bestRank} icon={HiOutlineStar} tone="amber" />
        <StatCard label="Latest Rating" value={contests.at(-1).rating} icon={HiOutlineChartBar} tone="green" />
      </div>
      <section className="glass-card p-5">
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={contests}>
              <XAxis dataKey="contestDate" />
              <YAxis />
              <Tooltip />
              <Line dataKey="rating" stroke="#2563eb" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>
      <section className="glass-card overflow-hidden">
        <table className="w-full">
          <thead className="bg-surface-100 dark:bg-surface-800">
            <tr>{['Contest', 'Date', 'Rank', 'Rating'].map((h) => <th key={h} className="px-5 py-3 text-left text-xs uppercase text-surface-500">{h}</th>)}</tr>
          </thead>
          <tbody>{contests.map((contest) => <tr key={contest.id} className="border-t border-surface-200 dark:border-surface-800"><td className="px-5 py-4 font-semibold">{contest.contestName}</td><td className="px-5 py-4">{contest.contestDate}</td><td className="px-5 py-4">{contest.rankValue}</td><td className="px-5 py-4">{contest.rating}</td></tr>)}</tbody>
        </table>
      </section>
    </div>
  );
}
