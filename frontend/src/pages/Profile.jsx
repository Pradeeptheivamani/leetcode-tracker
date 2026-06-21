import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const [form, setForm] = useState({ username: user?.username || '', leetcodeUsername: user?.leetcodeUsername || '' });
  const [saved, setSaved] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    await updateProfile(form);
    setSaved(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-surface-950 dark:text-white">Profile Management</h1>
        <p className="text-surface-500 dark:text-surface-400">Manage profile details and LeetCode identity.</p>
      </div>
      <form onSubmit={submit} className="glass-card max-w-2xl space-y-4 p-5">
        <input className="input-field" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} placeholder="Username" />
        <input className="input-field" value={form.leetcodeUsername} onChange={(e) => setForm({ ...form, leetcodeUsername: e.target.value })} placeholder="LeetCode username" />
        <input className="input-field" type="password" placeholder="New password" />
        <button className="btn-primary">Save Profile</button>
        {saved && <p className="text-sm text-emerald-600">Profile updated.</p>}
      </form>
    </div>
  );
}
