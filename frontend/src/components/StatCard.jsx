export default function StatCard({ label, value, icon: Icon, tone = 'primary' }) {
  const tones = {
    primary: 'bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-300',
    green: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-300',
    amber: 'bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-300',
    red: 'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-300',
  };

  return (
    <div className="stat-card">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-surface-500 dark:text-surface-400">{label}</p>
          <p className="mt-2 text-3xl font-bold text-surface-950 dark:text-white">{value}</p>
        </div>
        {Icon && (
          <div className={`grid h-11 w-11 place-items-center rounded-lg ${tones[tone]}`}>
            <Icon className="h-5 w-5" />
          </div>
        )}
      </div>
    </div>
  );
}
