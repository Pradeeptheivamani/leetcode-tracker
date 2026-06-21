import { useState } from 'react';
import api from '../services/api';

export default function AiHints() {
  const [problemStatement, setProblemStatement] = useState('');
  const [hint, setHint] = useState(null);
  const [loading, setLoading] = useState(false);

  const generate = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/api/ai/hints', { problemStatement });
      setHint(data);
    } catch {
      setHint({
        level1: 'Identify the input shape and constraints first.',
        level2: 'Look for repeated work, monotonic behavior, or a maintained invariant.',
        level3: 'Pick a data structure that updates the invariant efficiently.',
        approachSuggestion: 'Write pseudocode only; avoid jumping to a complete implementation.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-surface-950 dark:text-white">AI Hint Generator</h1>
        <p className="text-surface-500 dark:text-surface-400">Guided hints only. No full solutions.</p>
      </div>
      <form onSubmit={generate} className="glass-card space-y-4 p-5">
        <textarea className="input-field min-h-52" placeholder="Paste the problem statement..." value={problemStatement} onChange={(e) => setProblemStatement(e.target.value)} required />
        <button className="btn-primary" disabled={loading}>{loading ? 'Generating...' : 'Generate Hints'}</button>
      </form>
      {hint && <section className="glass-card grid gap-4 p-5 md:grid-cols-2">
        {Object.entries(hint).map(([key, value]) => <div key={key} className="rounded-lg border border-surface-200 p-4 dark:border-surface-800"><p className="mb-2 text-xs font-semibold uppercase text-surface-500">{key}</p><p>{value}</p></div>)}
      </section>}
    </div>
  );
}
