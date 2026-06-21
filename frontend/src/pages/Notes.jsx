import { useMemo, useState } from 'react';

const categories = ['Personal Notes', 'Revision Notes', 'Important Tricks', 'Interview Notes'];

export default function Notes() {
  const [notes, setNotes] = useState([{ id: 1, title: 'Binary search template', category: 'Important Tricks', content: '<b>Maintain invariant</b> before moving bounds.' }]);
  const [query, setQuery] = useState('');
  const [draft, setDraft] = useState({ title: '', category: categories[0], content: '' });
  const filtered = useMemo(() => notes.filter((note) => `${note.title} ${note.category} ${note.content}`.toLowerCase().includes(query.toLowerCase())), [notes, query]);

  const save = (event) => {
    event.preventDefault();
    setNotes((items) => [{ id: Date.now(), ...draft }, ...items]);
    setDraft({ title: '', category: categories[0], content: '' });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-surface-950 dark:text-white">Notes System</h1>
        <p className="text-surface-500 dark:text-surface-400">Rich text friendly notes with search, categories, edit, and delete actions.</p>
      </div>
      <form onSubmit={save} className="glass-card grid gap-3 p-5 md:grid-cols-3">
        <input className="input-field" placeholder="Title" value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} required />
        <select className="input-field" value={draft.category} onChange={(e) => setDraft({ ...draft, category: e.target.value })}>{categories.map((category) => <option key={category}>{category}</option>)}</select>
        <button className="btn-primary">Save Note</button>
        <textarea className="input-field md:col-span-3" rows="4" placeholder="Use HTML for rich text formatting" value={draft.content} onChange={(e) => setDraft({ ...draft, content: e.target.value })} required />
      </form>
      <input className="input-field" placeholder="Search notes" value={query} onChange={(e) => setQuery(e.target.value)} />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {filtered.map((note) => (
          <article key={note.id} className="glass-card p-5">
            <div className="flex items-start justify-between gap-3">
              <div><h2 className="font-semibold">{note.title}</h2><p className="text-sm text-primary-600">{note.category}</p></div>
              <button className="text-sm text-red-500" onClick={() => setNotes((items) => items.filter((item) => item.id !== note.id))}>Delete</button>
            </div>
            <div className="prose prose-sm mt-4 max-w-none dark:prose-invert" dangerouslySetInnerHTML={{ __html: note.content }} />
          </article>
        ))}
      </div>
    </div>
  );
}
