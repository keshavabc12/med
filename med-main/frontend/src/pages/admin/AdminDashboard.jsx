import { useEffect, useMemo, useState } from 'react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,

  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import api from '../../services/api';

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-slate-600 bg-slate-900/95 px-3 py-2 text-xs shadow-xl">
      <p className="mb-1 font-semibold text-slate-200">{label}</p>
      {payload.map(p => (
        <p key={p.name} className="text-slate-300">
          <span className="text-slate-500">{p.name}:</span> {p.value.toLocaleString()}
        </p>
      ))}
    </div>
  );
}

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [err, setErr] = useState('');

  useEffect(() => {
    let cancelled = false;
    const fetchData = async () => {
      try {
        const { data: d } = await api.get('/api/admin/dashboard', { admin: true });
        if (!cancelled) setData(d);
      } catch (e) {
        if (!cancelled) {
          setErr(
            e.response?.data?.message ||
            (e.response?.status === 401 ? 'Session expired — log in again.' : 'Failed to load dashboard')
          );
        }
      }
    };
    fetchData();
    const interval = setInterval(() => {
      if (!cancelled) fetchData();
    }, 30000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  const chartKey = useMemo(() => (data ? `${data.realTimeSeries?.[data.realTimeSeries?.length - 1]?.label || data.totalVisitors}` : '0'), [data]);

  if (err) {
    return (
      <div className="rounded-2xl border border-red-800/50 bg-red-950/40 p-6 text-red-300">
        <p className="font-semibold">Dashboard unavailable</p>
        <p className="mt-2 text-sm text-red-200/80">{err}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-slate-400">
        <p>Loading analytics…</p>
      </div>
    );
  }

  const kpi = [
    {
      label: 'Live Visitors (last 5 min)',
      value: data.realTimeVisitors?.toLocaleString() ?? 0,
      sub: 'Visitors in last 5 minutes',
      accent: 'from-blue-500/20 to-blue-900/20',
    },
    {
      label: "Today's Visitors",
      value: data.todayVisitors?.toLocaleString() ?? 0,
      sub: 'Visitors since midnight',
      accent: 'from-purple-500/20 to-purple-900/20',
    },
    {
      label: 'This Week Visitors',
      value: data.thisWeekVisitors?.toLocaleString() ?? 0,
      sub: 'Visitors since start of week',
      accent: 'from-indigo-500/20 to-indigo-900/20',
    },
    {
      label: 'This Month Visitors',
      value: data.thisMonthVisitors?.toLocaleString() ?? 0,
      sub: 'Visitors since start of month',
      accent: 'from-pink-500/20 to-pink-900/20',
    },
    {
      label: 'Live products',
      value: data.totalProducts?.toLocaleString() ?? 0,
      sub: 'Active in storefront',
      accent: 'from-emerald-500/20 to-emerald-950/30',
    },
  ];

  const renderVisitorChart = (chartData, title, type = 'bar') => (
    <div className="rounded-2xl border border-slate-700/80 bg-slate-900/60 p-5 shadow-xl">
      <h2 className="font-display text-lg font-semibold text-white">{title}</h2>
      <div className="mt-4 h-64 w-full min-w-0">
        <ResponsiveContainer key={`${title}-${chartKey}`} width="100%" height="100%" debounce={50}>
          {type === 'bar' ? (
            <BarChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.6} vertical={false} />
              <XAxis dataKey="label" tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} width={44} tickFormatter={v => (v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v)} />
              <Tooltip content={<ChartTooltip />} />
              <Bar dataKey="visitors" name="Visitors" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={40} />
            </BarChart>
          ) : (
            <AreaChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorVis" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.6} vertical={false} />
              <XAxis dataKey="label" tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} width={44} tickFormatter={v => (v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v)} />
              <Tooltip content={<ChartTooltip />} />
              <Area type="monotone" dataKey="visitors" name="Visitors" stroke="#3b82f6" fillOpacity={1} fill="url(#colorVis)" />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );

  return (
    <div className="space-y-10 pb-8">
      <div>
        <h1 className="font-display text-3xl font-bold text-white">Analytics dashboard</h1>
        <p className="mt-2 text-sm text-slate-400">
          Track website visitors, wishlisted items, and overall store performance.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {kpi.map(c => (
          <div
            key={c.label}
            className={`rounded-2xl border border-slate-700/80 bg-gradient-to-br ${c.accent} p-5 shadow-lg backdrop-blur`}
          >
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{c.label}</p>
            <p className="mt-2 font-display text-2xl font-bold text-white">{c.value}</p>
            <p className="mt-1 text-xs text-slate-500">{c.sub}</p>
          </div>
        ))}
      </div>

      {data.realTimeSeries?.length > 0 && renderVisitorChart(data.realTimeSeries, 'Real‑time Visitors (Last 30 min)', 'area')}
    </div>
  );
}
