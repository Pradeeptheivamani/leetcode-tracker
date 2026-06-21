import { useMemo, useState } from 'react';
import { HiOutlinePencil, HiOutlinePlus, HiOutlineSearch, HiOutlineTrash } from 'react-icons/hi';

const seed = [
  { id: 1, name: 'Two Sum', leetcodeUrl: 'https://leetcode.com/problems/two-sum/', difficulty: 'EASY', tags: ['Arrays'], companies: ['Google', 'Amazon'], dateSolved: '2026-06-01', status: 'SOLVED', notes: 'Hash map complement pattern.' },
  { id: 2, name: 'Longest Substring Without Repeating Characters', leetcodeUrl: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/', difficulty: 'MEDIUM', tags: ['Strings'], companies: ['Microsoft'], dateSolved: '2026-06-03', status: 'SOLVED', notes: 'Sliding window.' },
];

export default function Problems() {
  const [problems, setProblems] = useState(seed);
  const [query, setQuery] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [form, setForm] = useState({ name: '', leetcodeUrl: '', difficulty: 'EASY', tags: '', companies: '', status: 'SOLVED', dateSolved: '', notes: '' });
  const [editingId, setEditingId] = useState(null);

  const filtered = useMemo(() => problems.filter((p) => {
    const matchesQuery = p.name.toLowerCase().includes(query.toLowerCase()) || p.tags.join(' ').toLowerCase().includes(query.toLowerCase());
    return matchesQuery && (!difficulty || p.difficulty === difficulty);
  }), [problems, query, difficulty]);

  const save = (event) => {
    event.preventDefault();
    const payload = {
      ...form,
      id: editingId || Date.now(),
      tags: form.tags.split(',').map((item) => item.trim()).filter(Boolean),
      companies: form.companies.split(',').map((item) => item.trim()).filter(Boolean),
    };
    setProblems((items) => editingId ? items.map((item) => item.id === editingId ? payload : item) : [payload, ...items]);
    setEditingId(null);
    setForm({ name: '', leetcodeUrl: '', difficulty: 'EASY', tags: '', companies: '', status: 'SOLVED', dateSolved: '', notes: '' });
  };

  const edit = (problem) => {
    setEditingId(problem.id);
    setForm({ ...problem, tags: problem.tags.join(', '), companies: problem.companies.join(', ') });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-surface-950 dark:text-white">Problem Tracking</h1>
        <p className="text-surface-500 dark:text-surface-400">Add, edit, search, filter, sort, and annotate problems.</p>
      </div>

      <form onSubmit={save} className="glass-card grid grid-cols-1 gap-3 p-5 lg:grid-cols-4">
        <input className="input-field" placeholder="Problem name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        <input className="input-field" placeholder="LeetCode URL" value={form.leetcodeUrl} onChange={(e) => setForm({ ...form, leetcodeUrl: e.target.value })} required />
        <select className="input-field" value={form.difficulty} onChange={(e) => setForm({ ...form, difficulty: e.target.value })}>
          <option value="EASY">Easy</option>
          <option value="MEDIUM">Medium</option>
          <option value="HARD">Hard</option>
        </select>
        <select className="input-field" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
          <option value="SOLVED">Solved</option>
          <option value="UNSOLVED">Unsolved</option>
        </select>
        <input className="input-field" placeholder="Tags, comma separated" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} />
        <input className="input-field" placeholder="Companies, comma separated" value={form.companies} onChange={(e) => setForm({ ...form, companies: e.target.value })} />
        <input className="input-field" type="date" value={form.dateSolved} onChange={(e) => setForm({ ...form, dateSolved: e.target.value })} />
        <button className="btn-primary" type="submit"><HiOutlinePlus className="h-4 w-4" />{editingId ? 'Update' : 'Add Problem'}</button>
        <textarea className="input-field lg:col-span-4" placeholder="Notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
      </form>

      <div className="glass-card flex flex-col gap-3 p-4 md:flex-row">
        <div className="relative flex-1">
          <HiOutlineSearch className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-surface-400" />
          <input className="input-field pl-10" placeholder="Search by problem or topic" value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
        <select className="input-field md:w-52" value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
          <option value="">All difficulties</option>
          <option value="EASY">Easy</option>
          <option value="MEDIUM">Medium</option>
          <option value="HARD">Hard</option>
        </select>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-surface-100/80 dark:bg-surface-800/70">
              <tr>
                {['Problem', 'Difficulty', 'Status', 'Tags', 'Companies', 'Date', 'Actions'].map((head) => (
                  <th key={head} className="px-5 py-3 text-left text-xs font-semibold uppercase text-surface-500">{head}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-200 dark:divide-surface-800">
              {filtered.map((problem) => (
                <tr key={problem.id}>
                  <td className="px-5 py-4"><a className="font-semibold text-primary-600" href={problem.leetcodeUrl} target="_blank" rel="noreferrer">{problem.name}</a></td>
                  <td className="px-5 py-4"><span className={problem.difficulty === 'EASY' ? 'badge-easy' : problem.difficulty === 'MEDIUM' ? 'badge-medium' : 'badge-hard'}>{problem.difficulty}</span></td>
                  <td className="px-5 py-4 text-sm">{problem.status}</td>
                  <td className="px-5 py-4 text-sm">{problem.tags.join(', ')}</td>
                  <td className="px-5 py-4 text-sm">{problem.companies.join(', ')}</td>
                  <td className="px-5 py-4 text-sm">{problem.dateSolved || '-'}</td>
                  <td className="px-5 py-4">
                    <div className="flex gap-2">
                      <button className="btn-secondary px-3 py-2" onClick={() => edit(problem)}><HiOutlinePencil /></button>
                      <button className="btn-secondary px-3 py-2" onClick={() => setProblems((items) => items.filter((item) => item.id !== problem.id))}><HiOutlineTrash /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
