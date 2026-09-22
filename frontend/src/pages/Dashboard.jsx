import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTickets } from '../api/client';
import { formatDateTime } from '../utils/date';
import StatusBadge from '../components/StatusBadge';
import TicketListError from '../components/tickets/TicketListError';

const STATUSES = ['Open', 'In Progress', 'Closed'];

const STATUS_STYLES = {
  Open: 'bg-red-500',
  'In Progress': 'bg-amber-500',
  Closed: 'bg-green-500',
};

function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
        {[1, 2, 3, 4, 5].map((item) => (
          <div key={item} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
            <div className="h-3 w-24 bg-slate-200 rounded mb-4" />
            <div className="h-8 w-14 bg-slate-200 rounded" />
          </div>
        ))}
      </div>
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
        <div className="h-4 w-48 bg-slate-200 rounded mb-5" />
        <div className="space-y-4">
          {[1, 2, 3].map((item) => (
            <div key={item} className="h-8 bg-slate-100 rounded" />
          ))}
        </div>
      </div>
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
        <div className="h-4 w-36 bg-slate-200 rounded mb-5" />
        <div className="h-36 bg-slate-100 rounded" />
      </div>
    </div>
  );
}

function SummaryCard({ label, value }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className="text-3xl font-bold text-slate-900 mt-2">{value}</p>
    </div>
  );
}

function Dashboard() {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getTickets();
        if (!cancelled) setTickets(data);
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    run();
    return () => { cancelled = true; };
  }, [refreshKey]);

  const stats = useMemo(() => {
    const counts = {
      total: tickets.length,
      Open: 0,
      'In Progress': 0,
      Closed: 0,
      breached: 0,
    };

    tickets.forEach((ticket) => {
      if (STATUSES.includes(ticket.status)) {
        counts[ticket.status] += 1;
      }
      if (ticket.is_breached) {
        counts.breached += 1;
      }
    });

    return counts;
  }, [tickets]);

  const recentTickets = useMemo(() => {
    return [...tickets]
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 5);
  }, [tickets]);

  const maxStatusCount = Math.max(...STATUSES.map((status) => stats[status]), 1);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Dashboard</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Overview of current support ticket activity
        </p>
      </div>

      {loading && <DashboardSkeleton />}

      {!loading && error && (
        <TicketListError message={error} onRetry={() => setRefreshKey((k) => k + 1)} />
      )}

      {!loading && !error && (
        <div className="space-y-6">
          <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4" aria-label="Ticket summary">
            <SummaryCard label="Total Tickets" value={stats.total} />
            <SummaryCard label="Open" value={stats.Open} />
            <SummaryCard label="In Progress" value={stats['In Progress']} />
            <SummaryCard label="Closed" value={stats.Closed} />
            <SummaryCard label="Breaching SLA" value={stats.breached} />
          </section>

          <section className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm" aria-labelledby="status-overview-heading">
            <h2 id="status-overview-heading" className="text-base font-semibold text-slate-900">
              Ticket Status Overview
            </h2>
            <div className="mt-5 space-y-4">
              {STATUSES.map((status) => {
                const count = stats[status];
                const width = `${(count / maxStatusCount) * 100}%`;
                return (
                  <div key={status} className="grid grid-cols-[6.5rem_1fr_2rem] sm:grid-cols-[8rem_1fr_2.5rem] gap-3 items-center">
                    <span className="text-sm font-medium text-slate-600">{status}</span>
                    <div className="h-3 bg-slate-100 rounded-full overflow-hidden" aria-label={`${status}: ${count}`}>
                      <div className={`h-full rounded-full ${STATUS_STYLES[status]}`} style={{ width }} />
                    </div>
                    <span className="text-sm font-semibold text-slate-700 text-right">{count}</span>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm" aria-labelledby="recent-tickets-heading">
            <div className="px-5 py-4 border-b border-slate-200">
              <h2 id="recent-tickets-heading" className="text-base font-semibold text-slate-900">
                Recent Tickets
              </h2>
            </div>

            {recentTickets.length === 0 ? (
              <div className="px-5 py-10 text-center">
                <p className="text-sm font-medium text-slate-700">No tickets yet</p>
                <p className="text-sm text-slate-500 mt-1">New tickets will appear here once they are created.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Ticket ID</th>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Customer</th>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Subject</th>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Created</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {recentTickets.map((ticket) => (
                      <tr
                        key={ticket.ticket_id}
                        onClick={() => navigate(`/tickets/${ticket.ticket_id}`)}
                        className="hover:bg-slate-50 cursor-pointer transition-colors"
                      >
                        <td className="px-5 py-4 whitespace-nowrap">
                          <span className="text-xs font-mono font-semibold text-slate-500 tracking-wide">#{ticket.ticket_id}</span>
                        </td>
                        <td className="px-5 py-4 whitespace-nowrap">
                          <span className="text-sm font-medium text-slate-800">{ticket.customer_name}</span>
                        </td>
                        <td className="px-5 py-4 max-w-xs">
                          <span className="text-sm text-slate-700 line-clamp-1">{ticket.subject}</span>
                        </td>
                        <td className="px-5 py-4 whitespace-nowrap">
                          <StatusBadge status={ticket.status} />
                        </td>
                        <td className="px-5 py-4 whitespace-nowrap">
                          <span className="text-sm text-slate-500">{formatDateTime(ticket.created_at)}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
