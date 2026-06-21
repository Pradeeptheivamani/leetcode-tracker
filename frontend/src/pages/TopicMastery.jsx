import ProgressBar from '../components/ProgressBar';
import { topicMastery } from '../data/mockData';

export default function TopicMastery() {
  const entries = Object.entries(topicMastery);
  const weak = entries.filter(([, value]) => value < 50).map(([topic]) => topic);
  const strong = entries.filter(([, value]) => value >= 75).map(([topic]) => topic);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-surface-950 dark:text-white">Topic Mastery</h1>
        <p className="text-surface-500 dark:text-surface-400">Coverage across core interview patterns and data structures.</p>
      </div>
      <section className="glass-card grid gap-5 p-5 lg:grid-cols-2">
        {entries.map(([topic, value]) => <ProgressBar key={topic} label={topic} value={value} />)}
      </section>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section className="glass-card p-5">
          <h2 className="mb-3 text-lg font-semibold">Weak Topics</h2>
          <div className="flex flex-wrap gap-2">{weak.map((topic) => <span key={topic} className="badge-hard">{topic}</span>)}</div>
        </section>
        <section className="glass-card p-5">
          <h2 className="mb-3 text-lg font-semibold">Strong Topics</h2>
          <div className="flex flex-wrap gap-2">{strong.map((topic) => <span key={topic} className="badge-easy">{topic}</span>)}</div>
        </section>
      </div>
    </div>
  );
}
