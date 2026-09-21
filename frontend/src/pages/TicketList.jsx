import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTickets } from '../api/client';
import { formatDateTime } from '../utils/date';
import TicketToolbar from '../components/tickets/TicketToolbar';
import TicketTable from '../components/tickets/TicketTable';
import TicketCard from '../components/tickets/TicketCard';
import TicketListSkeleton from '../components/tickets/TicketListSkeleton';
import TicketListEmpty from '../components/tickets/TicketListEmpty';
import TicketListError from '../components/tickets/TicketListError';

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
      <TicketToolbar
        searchTerm={searchTerm}
        onSearchChange={(e) => setSearchTerm(e.target.value)}
        statusFilter={statusFilter}
        onStatusFilterChange={(e) => setStatusFilter(e.target.value)}
      />

      {/* Content states */}
      {loading && <TicketListSkeleton />}

      {!loading && error && (
        <TicketListError message={error} onRetry={() => setRefreshKey((k) => k + 1)} />
      )}

      {!loading && !error && tickets.length === 0 && (
        <TicketListEmpty hasFilters={hasFilters} />
      )}

      {!loading && !error && tickets.length > 0 && (
        <>
          {/* Desktop table */}
          <TicketTable
            tickets={tickets}
            onSelectTicket={(ticketId) => navigate(`/tickets/${ticketId}`)}
            formatDate={formatDateTime}
          />

          {/* Mobile cards */}
          <div className="sm:hidden space-y-3">
            {tickets.map((ticket) => (
              <TicketCard
                key={ticket.ticket_id}
                ticket={ticket}
                onClick={() => navigate(`/tickets/${ticket.ticket_id}`)}
                formatDate={formatDateTime}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default TicketList;
