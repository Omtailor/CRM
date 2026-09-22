import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTickets } from '../api/client';
import { formatDateTime } from '../utils/date';
import TicketToolbar from '../components/tickets/TicketToolbar';
import TicketTable from '../components/tickets/TicketTable';
import TicketCard from '../components/tickets/TicketCard';
import TicketListSkeleton from '../components/tickets/TicketListSkeleton';
import TicketListEmpty from '../components/tickets/TicketListEmpty';
import TicketListError from '../components/tickets/TicketListError';
import TicketPagination from '../components/tickets/TicketPagination';

const DEFAULT_PAGE_SIZE = 10;

function TicketList() {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [currentPage, setCurrentPage] = useState(1);
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
  const sortedTickets = useMemo(() => {
    return [...tickets].sort((a, b) => {
      const firstDate = new Date(a.created_at).getTime();
      const secondDate = new Date(b.created_at).getTime();
      return sortOrder === 'newest'
        ? secondDate - firstDate
        : firstDate - secondDate;
    });
  }, [tickets, sortOrder]);

  const totalItems = sortedTickets.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * pageSize;
  const paginatedTickets = sortedTickets.slice(startIndex, startIndex + pageSize);
  const startItem = totalItems === 0 ? 0 : startIndex + 1;
  const endItem = Math.min(startIndex + pageSize, totalItems);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1);
  };

  const handleSortOrderChange = (e) => {
    setSortOrder(e.target.value);
    setCurrentPage(1);
  };

  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value));
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div>
      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Manage Tickets</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Manage and track customer support requests
        </p>
      </div>

      {/* Toolbar */}
      <TicketToolbar
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        statusFilter={statusFilter}
        onStatusFilterChange={handleStatusFilterChange}
        sortOrder={sortOrder}
        onSortOrderChange={handleSortOrderChange}
      />

      {/* Content states */}
      {loading && <TicketListSkeleton />}

      {!loading && error && (
        <TicketListError message={error} onRetry={() => setRefreshKey((k) => k + 1)} />
      )}

      {!loading && !error && totalItems === 0 && (
        <TicketListEmpty hasFilters={hasFilters} />
      )}

      {!loading && !error && totalItems > 0 && (
        <>
          {/* Desktop table */}
          <TicketTable
            tickets={paginatedTickets}
            onSelectTicket={(ticketId) => navigate(`/tickets/${ticketId}`)}
            formatDate={formatDateTime}
          />

          {/* Mobile cards */}
          <div className="sm:hidden space-y-3">
            {paginatedTickets.map((ticket) => (
              <TicketCard
                key={ticket.ticket_id}
                ticket={ticket}
                onClick={() => navigate(`/tickets/${ticket.ticket_id}`)}
                formatDate={formatDateTime}
              />
            ))}
          </div>

          <TicketPagination
            currentPage={safeCurrentPage}
            pageSize={pageSize}
            totalItems={totalItems}
            totalPages={totalPages}
            startItem={startItem}
            endItem={endItem}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
          />
        </>
      )}
    </div>
  );
}

export default TicketList;
