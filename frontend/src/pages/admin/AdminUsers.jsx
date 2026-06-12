import { useEffect, useState } from 'react';
import api from '../../services/api';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data } = await api.get('/api/users', { admin: true });
        if (!cancelled) setUsers(data);
      } catch {
        if (!cancelled) setUsers([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) return <p className="text-slate-400">Loading users…</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-white">Customers</h1>
      <p className="mt-1 text-sm text-slate-400">Registered shopper accounts (admin excluded)</p>

      <div className="mt-6 overflow-x-auto rounded-xl border border-slate-800">
        <table className="min-w-full divide-y divide-slate-800 text-sm">
          <thead className="bg-slate-900">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-400">Name</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-400">Email</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-400">Phone</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-400">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 bg-slate-950">
            {users.map((u) => (
              <tr key={u._id}>
                <td className="px-4 py-3 text-slate-200">{u.name}</td>
                <td className="px-4 py-3 text-slate-400">{u.email}</td>
                <td className="px-4 py-3 text-slate-400">{u.phone || '—'}</td>
                <td className="px-4 py-3 text-slate-500">{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {users.length === 0 && <p className="mt-6 text-slate-500">No customers found.</p>}
    </div>
  );
}
