export default function ProgressBar({ label, value }) {
  const color = value >= 75 ? 'bg-emerald-500' : value >= 50 ? 'bg-amber-500' : 'bg-red-500';

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3 text-sm">
        <span className="font-medium text-surface-700 dark:text-surface-200">{label}</span>
        <span className="text-surface-500 dark:text-surface-400">{value}%</span>
      </div>
      <div className="h-2 rounded-full bg-surface-200 dark:bg-surface-800">
        <div className={`h-2 rounded-full ${color}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}
