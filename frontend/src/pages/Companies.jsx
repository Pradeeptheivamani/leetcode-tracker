import ProgressBar from '../components/ProgressBar';
import { companyReadiness } from '../data/mockData';

export default function Companies() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-surface-950 dark:text-white">Company-wise Tracking</h1>
        <p className="text-surface-500 dark:text-surface-400">Question count, solved percentage, and readiness score by target company.</p>
      </div>
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {Object.entries(companyReadiness).map(([company, score], index) => (
          <section key={company} className="glass-card p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">{company}</h2>
              <span className="text-sm text-surface-500">{24 + index * 3} questions</span>
            </div>
            <ProgressBar label="Solved Percentage" value={score} />
            <p className="mt-4 text-sm text-surface-500">Readiness Score: <span className="font-semibold text-surface-900 dark:text-white">{score}/100</span></p>
          </section>
        ))}
      </div>
    </div>
  );
}
