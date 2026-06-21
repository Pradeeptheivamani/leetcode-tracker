import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { contests, monthlySolved } from '../data/mockData';

export default function Analytics() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-surface-950 dark:text-white">Progress Analytics</h1>
        <p className="text-surface-500 dark:text-surface-400">Weekly progress, monthly trends, streak visualization, and contest growth.</p>
      </div>
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <section className="glass-card p-5">
          <h2 className="mb-4 text-lg font-semibold">Monthly Solved</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlySolved}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#2563eb" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
        <section className="glass-card p-5">
          <h2 className="mb-4 text-lg font-semibold">Contest Rating Graph</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={contests}>
                <XAxis dataKey="contestName" hide />
                <YAxis />
                <Tooltip />
                <Line dataKey="rating" stroke="#059669" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>
      <section className="glass-card p-5">
        <h2 className="mb-4 text-lg font-semibold">Streak Visualization</h2>
        <div className="grid grid-cols-7 gap-2 md:grid-cols-14">
          {Array.from({ length: 42 }).map((_, index) => (
            <div key={index} className={`aspect-square rounded ${index % 5 === 0 ? 'bg-surface-200 dark:bg-surface-800' : index % 3 === 0 ? 'bg-emerald-300' : 'bg-emerald-600'}`} />
          ))}
        </div>
      </section>
    </div>
  );
}
