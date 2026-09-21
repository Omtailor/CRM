import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getTickets } from '../api/client';
import StatusBadge from '../components/StatusBadge';
import { Search, Plus, AlertCircle, RefreshCw, InboxIcon } from '../components/icons';

/* ── Skeleton loader ────────────────────────────────────────────── */
function SkeletonRow() {
  return (
    <tr className="animate-pulse">
      <td className="px-5 py-4">
        <div className="h-3.5 bg-slate-200 rounded w-24" />
      </td>
      <td className="px-5 py-4">
        <div className="h-3.5 bg-slate-200 rounded w-36" />
      </td>
      <td className="px-5 py-4">
        <div className="h-3.5 bg-slate-200 rounded w-48" />
      </td>
      <td className="px-5 py-4">
        <div className="h-5 bg-slate-200 rounded-full w-20" />
      </td>
      <td className="px-5 py-4">
        <div className="h-3.5 bg-slate-200 rounded w-32" />
      </td>
      <td className="px-5 py-4">
        <div className="h-7 bg-slate-200 rounded-lg w-14" />
      </td>
    </tr>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 animate-pulse">
      <div className="flex items-start justify-between mb-3">
        <div className="h-3.5 bg-slate-200 rounded w-24" />
        <div className="h-5 bg-slate-200 rounded-full w-16" />
      </div>
      <div className="h-4 bg-slate-200 rounded w-3/4 mb-2" />
      <div className="h-3 bg-slate-200 rounded w-1/2" />
    </div>
  );
}

/* ── Empty state ────────────────────────────────────────────────── */
function EmptyState({ hasFilters }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl px-6 py-14 flex flex-col items-center text-center">
      <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center mb-4">
        <InboxIcon className="h-7 w-7 text-slate-400" />
      </div>
      <p className="text-slate-800 font-semibold text-base mb-1">No tickets found</p>
      <p className="text-slate-500 text-sm max-w-xs">
        {hasFilters
          ? 'Try clearing your search or changing the status filter.'
          : 'No support tickets have been created yet.'}
      </p>
      {!hasFilters && (
        <Link
          to="/create"
          className="mt-5 inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Create your first ticket
        </Link>
      )}
    </div>
  );
}

/* ── Error state ────────────────────────────────────────────────── */
function ErrorState({ message, onRetry }) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-xl px-6 py-10 flex flex-col items-center text-center">
      <AlertCircle className="h-8 w-8 text-red-500 mb-3" />
      <p className="text-red-800 font-semibold mb-1">Failed to load tickets</p>
      <p className="text-red-600 text-sm mb-4 max-w-md">{message}</p>
      <button
        onClick={onRetry}
        className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
      >
        <RefreshCw className="h-4 w-4" />
        Retry
      </button>
    </div>
  );
}

/* ── Mobile ticket card ─────────────────────────────────────────── */
function TicketCard({ ticket, onClick, formatDate }) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
      className="bg-white border border-slate-200 rounded-xl p-4 cursor-pointer hover:border-indigo-300 hover:shadow-sm transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <span className="text-xs font-mono font-semibold text-slate-400 tracking-wide">
          #{ticket.ticket_id}
        </span>
        <StatusBadge status={ticket.status} />
      </div>
      <p className="text-sm font-medium text-slate-900 mb-1 leading-snug">{ticket.subject}</p>
      <p className="text-xs text-slate-500">
        {ticket.customer_name} &middot; {formatDate(ticket.created_at)}
      </p>
    </div>
  );
}

/* ── Main page component ────────────────────────────────────────── */
function TicketList() {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  /* Debounce search input */
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  /* Fetch tickets */
  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = {};
        if (debouncedSearch) params.search = debouncedSearch;
        if (statusFilter) params.status = statusFilter;
        const data = await getTickets(params);
        if (!cancelled) setTickets(data);
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    run();
    return () => { cancelled = true; };
  }, [debouncedSearch, statusFilter, refreshKey]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const hasFilters = Boolean(debouncedSearch || statusFilter);

  return (
    <div>
      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Tickets</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Manage and track customer support requests
        </p>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by name, email, or subject..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search tickets"
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-lg bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow"
          />
        </div>

        {/* Status filter */}
        <div className="sm:w-44">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            aria-label="Filter by status"
            className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 cursor-pointer transition-shadow"
          >
            <option value="">All Status</option>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Closed">Closed</option>
          </select>
        </div>

        {/* Create ticket button */}
        <Link
          to="/create"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 transition-colors whitespace-nowrap"
        >
          <Plus className="h-4 w-4" />
          Create Ticket
        </Link>
      </div>

      {/* Content states */}
      {loading && (
        <>
          {/* Desktop skeleton */}
          <div className="hidden sm:block bg-white rounded-xl border border-slate-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  {['Ticket ID', 'Customer', 'Subject', 'Status', 'Created', 'Action'].map((h) => (
                    <th
                      key={h}
                      className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {Array(5).fill(0).map((_, i) => <SkeletonRow key={i} />)}
              </tbody>
            </table>
          </div>
          {/* Mobile skeleton */}
          <div className="sm:hidden space-y-3">
            {Array(4).fill(0).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        </>
      )}

      {!loading && error && (
        <ErrorState message={error} onRetry={() => setRefreshKey((k) => k + 1)} />
      )}

      {!loading && !error && tickets.length === 0 && (
        <EmptyState hasFilters={hasFilters} />
      )}

      {!loading && !error && tickets.length > 0 && (
        <>
          {/* Desktop table */}
          <div className="hidden sm:block bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Ticket ID
                    </th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Subject
                    </th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {tickets.map((ticket) => (
                    <tr
                      key={ticket.ticket_id}
                      onClick={() => navigate(`/tickets/${ticket.ticket_id}`)}
                      className="hover:bg-slate-50 cursor-pointer transition-colors group"
                    >
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className="text-xs font-mono font-semibold text-slate-500 tracking-wide">
                          #{ticket.ticket_id}
                        </span>
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-slate-800">
                          {ticket.customer_name}
                        </span>
                      </td>
                      <td className="px-5 py-4 max-w-xs">
                        <span className="text-sm text-slate-700 line-clamp-1">
                          {ticket.subject}
                        </span>
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <StatusBadge status={ticket.status} />
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className="text-sm text-slate-500">
                          {formatDate(ticket.created_at)}
                        </span>
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/tickets/${ticket.ticket_id}`);
                          }}
                          className="px-3 py-1.5 text-xs font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                          aria-label={`View ticket ${ticket.ticket_id}`}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile cards */}
          <div className="sm:hidden space-y-3">
            {tickets.map((ticket) => (
              <TicketCard
                key={ticket.ticket_id}
                ticket={ticket}
                onClick={() => navigate(`/tickets/${ticket.ticket_id}`)}
                formatDate={formatDate}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default TicketList;
