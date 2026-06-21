import StatCard from '../components/StatCard';
import { HiOutlineChartBar, HiOutlineDownload, HiOutlineUserGroup } from 'react-icons/hi';

export default function Admin() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-surface-950 dark:text-white">Admin Dashboard</h1>
        <p className="text-surface-500 dark:text-surface-400">Platform analytics, user activity, and report exports.</p>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatCard label="Total Users" value="1,248" icon={HiOutlineUserGroup} />
        <StatCard label="Active Users" value="812" icon={HiOutlineChartBar} tone="green" />
        <StatCard label="Reports Exported" value="326" icon={HiOutlineDownload} tone="amber" />
      </div>
      <section className="glass-card p-5">
        <h2 className="mb-3 text-lg font-semibold">Platform Analytics</h2>
        <div className="grid gap-3 md:grid-cols-4">
          {['Problems tracked', 'Notes created', 'Friend comparisons', 'AI hints generated'].map((label, index) => <div key={label} className="rounded-lg border border-surface-200 p-4 dark:border-surface-800"><p className="text-sm text-surface-500">{label}</p><p className="mt-1 text-2xl font-bold">{(index + 3) * 1240}</p></div>)}
        </div>
      </section>
    </div>
  );
}
