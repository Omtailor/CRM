import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTicket, updateTicket } from '../api/client';
import { formatDateTime } from '../utils/date';
import { ArrowLeft } from '../components/icons';
import TicketDetailSkeleton from '../components/tickets/TicketDetailSkeleton';
import TicketDetailError from '../components/tickets/TicketDetailError';
import TicketDetailHeader from '../components/tickets/TicketDetailHeader';
import CustomerInfoCard from '../components/tickets/CustomerInfoCard';
import TicketDescriptionCard from '../components/tickets/TicketDescriptionCard';
import TicketNotesSection from '../components/tickets/TicketNotesSection';
import TicketStatusCard from '../components/tickets/TicketStatusCard';
import TicketPriorityCard from '../components/tickets/TicketPriorityCard';
import TicketMetadataCard from '../components/tickets/TicketMetadataCard';

function TicketDetail() {
  const { ticketId } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isUpdatingPriority, setIsUpdatingPriority] = useState(false);
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [noteError, setNoteError] = useState('');
  const [statusError, setStatusError] = useState('');
  const [statusSaved, setStatusSaved] = useState(false);
  const [priorityError, setPriorityError] = useState('');
  const [prioritySaved, setPrioritySaved] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getTicket(ticketId);
        if (!cancelled) setTicket(data);
      } catch (err) {
        if (!cancelled) {
          if (err.message.includes('404') || err.message.toLowerCase().includes('not found')) {
            setError('Ticket not found');
          } else {
            setError(err.message || 'Failed to load ticket');
          }
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    run();
    return () => { cancelled = true; };
  }, [ticketId, refreshKey]);

  const handleStatusChange = async (newStatus) => {
    setStatusError('');
    setStatusSaved(false);
    setIsUpdatingStatus(true);
    try {
      await updateTicket(ticketId, { status: newStatus });
      const updatedTicket = await getTicket(ticketId);
      setTicket(updatedTicket);
      setStatusSaved(true);
      setTimeout(() => setStatusSaved(false), 2000);
    } catch (err) {
      setStatusError(err.message || 'Failed to update status');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handlePriorityChange = async (newPriority) => {
    setPriorityError('');
    setPrioritySaved(false);
    setIsUpdatingPriority(true);
    try {
      await updateTicket(ticketId, { priority: newPriority });
      const updatedTicket = await getTicket(ticketId);
      setTicket(updatedTicket);
      setPrioritySaved(true);
      setTimeout(() => setPrioritySaved(false), 2000);
    } catch (err) {
      setPriorityError(err.message || 'Failed to update priority');
    } finally {
      setIsUpdatingPriority(false);
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    const trimmedNote = noteText.trim();
    if (!trimmedNote) {
      setNoteError('Note cannot be empty');
      return;
    }
    setNoteError('');
    setIsAddingNote(true);
    try {
      await updateTicket(ticketId, { notes: trimmedNote });
      const updatedTicket = await getTicket(ticketId);
      setTicket(updatedTicket);
      setNoteText('');
    } catch (err) {
      setNoteError(err.message || 'Failed to add note');
    } finally {
      setIsAddingNote(false);
    }
  };

  const retry = () => setRefreshKey((k) => k + 1);

  /* ── Loading state ── */
  if (loading) {
    return (
      <div>
        <button
          onClick={() => navigate('/tickets')}
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors mb-6 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Manage Tickets
        </button>
        <TicketDetailSkeleton />
      </div>
    );
  }

  /* ── Error state ── */
  if (error) {
    return (
      <div>
        <button
          onClick={() => navigate('/tickets')}
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors mb-6 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Manage Tickets
        </button>
        <TicketDetailError
          error={error}
          onBack={() => navigate('/tickets')}
          onRetry={retry}
        />
      </div>
    );
  }

  /* ── Main detail view ── */
  return (
    <div>
      {/* Back navigation */}
      <button
        onClick={() => navigate('/tickets')}
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors mb-6 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded"
        aria-label="Back to manage tickets"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Manage Tickets
      </button>

      {/* Ticket header */}
      <TicketDetailHeader ticket={ticket} formatDate={formatDateTime} />

      {/* Two-column layout: main content + right sidebar */}
      <div className="flex flex-col lg:flex-row gap-5 items-start">
        {/* Left: customer info + description + notes */}
        <div className="flex-1 min-w-0 space-y-5">
          <CustomerInfoCard
            customerName={ticket.customer_name}
            customerEmail={ticket.customer_email}
          />
          <TicketDescriptionCard description={ticket.description} />
          <TicketNotesSection
            notes={ticket.notes}
            formatDate={formatDateTime}
            noteText={noteText}
            onNoteTextChange={(e) => {
              setNoteText(e.target.value);
              if (noteError) setNoteError('');
            }}
            noteError={noteError}
            isAddingNote={isAddingNote}
            onSubmitNote={handleAddNote}
          />
        </div>

        {/* Right sidebar: status + metadata */}
        <div className="w-full lg:w-72 flex-shrink-0 space-y-4">
          <TicketStatusCard
            status={ticket.status}
            onStatusChange={handleStatusChange}
            isUpdatingStatus={isUpdatingStatus}
            statusSaved={statusSaved}
            statusError={statusError}
          />
          <TicketPriorityCard
            priority={ticket.priority}
            isBreached={ticket.is_breached}
            onPriorityChange={handlePriorityChange}
            isUpdatingPriority={isUpdatingPriority}
            prioritySaved={prioritySaved}
            priorityError={priorityError}
          />
          <TicketMetadataCard
            ticketId={ticket.ticket_id}
            createdAt={ticket.created_at}
            updatedAt={ticket.updated_at}
            formatDate={formatDateTime}
          />
        </div>
      </div>
    </div>
  );
}

export default TicketDetail;
