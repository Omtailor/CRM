import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTicket, updateTicket } from '../api/client';
import StatusBadge from '../components/StatusBadge';
import {
  ArrowLeft,
  User,
  Mail,
  MessageSquare,
  AlertCircle,
  RefreshCw,
} from '../components/icons';

/* ── Loading spinner ─────────────────────────────────────────────── */
function Spinner({ className = 'h-4 w-4' }) {
  return (
    <svg
      className={`animate-spin ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

/* ── Skeleton loader ─────────────────────────────────────────────── */
function SkeletonDetail() {
  return (
    <div className="animate-pulse space-y-5">
      <div className="h-4 bg-slate-200 rounded w-28" />
      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="h-6 bg-slate-200 rounded w-32" />
            <div className="h-4 bg-slate-200 rounded w-48" />
          </div>
          <div className="h-6 bg-slate-200 rounded-full w-20" />
        </div>
        <div className="border-t border-slate-100 pt-4 space-y-4">
          {Array(4).fill(0).map((_, i) => (
            <div key={i} className="space-y-1.5">
              <div className="h-3 bg-slate-200 rounded w-24" />
              <div className="h-4 bg-slate-200 rounded w-48" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Detail field ─────────────────────────────────────────────────── */
function DetailField({ icon: Icon, label, value, mono }) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex-shrink-0 w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center mt-0.5">
        <Icon className="h-4 w-4 text-slate-500" />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-0.5">
          {label}
        </p>
        <p className={`text-sm text-slate-800 ${mono ? 'font-mono' : 'font-medium'}`}>
          {value}
        </p>
      </div>
    </div>
  );
}

/* ── Avatar initial ────────────────────────────────────────────────── */
function Avatar({ name, className = 'w-8 h-8' }) {
  const initial = (name || '?')[0].toUpperCase();
  const colors = [
    'bg-indigo-100 text-indigo-700',
    'bg-purple-100 text-purple-700',
    'bg-pink-100 text-pink-700',
    'bg-blue-100 text-blue-700',
    'bg-teal-100 text-teal-700',
  ];
  const idx = initial.charCodeAt(0) % colors.length;
  return (
    <div
      className={`${className} ${colors[idx]} rounded-full flex items-center justify-center flex-shrink-0 text-xs font-semibold`}
      aria-hidden="true"
    >
      {initial}
    </div>
  );
}

/* ── Main component ──────────────────────────────────────────────── */
function TicketDetail() {
  const { ticketId } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [noteError, setNoteError] = useState('');
  const [statusError, setStatusError] = useState('');
  const [statusSaved, setStatusSaved] = useState(false);

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

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

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
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors mb-6 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Tickets
        </button>
        <SkeletonDetail />
      </div>
    );
  }

  /* ── Error state ── */
  if (error) {
    return (
      <div>
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors mb-6 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Tickets
        </button>
        <div className="flex flex-col items-center text-center py-14 bg-white border border-slate-200 rounded-xl">
          <AlertCircle className="h-10 w-10 text-red-400 mb-3" />
          <p className="text-slate-800 font-semibold mb-1">
            {error === 'Ticket not found' ? 'Ticket Not Found' : 'Something went wrong'}
          </p>
          <p className="text-slate-500 text-sm mb-5 max-w-xs">{error}</p>
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/')}
              className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Back to Tickets
            </button>
            {error !== 'Ticket not found' && (
              <button
                onClick={retry}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <RefreshCw className="h-4 w-4" />
                Retry
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  /* ── Main detail view ── */
  return (
    <div>
      {/* Back navigation */}
      <button
        onClick={() => navigate('/')}
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors mb-6 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded"
        aria-label="Back to tickets list"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Tickets
      </button>

      {/* Ticket header */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm px-6 py-5 mb-5">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2.5 mb-1">
              <span className="text-xs font-mono font-semibold text-slate-400 tracking-wider">
                #{ticket.ticket_id}
              </span>
              <StatusBadge status={ticket.status} />
            </div>
            <h1 className="text-xl font-bold text-slate-900 leading-tight">{ticket.subject}</h1>
            <p className="text-sm text-slate-400 mt-1">
              Opened {formatDate(ticket.created_at)}
            </p>
          </div>
        </div>
      </div>

      {/* Two-column layout: main content + right sidebar */}
      <div className="flex flex-col lg:flex-row gap-5 items-start">
        {/* Left: customer info + description + notes */}
        <div className="flex-1 min-w-0 space-y-5">
          {/* Customer info card */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <h2 className="text-sm font-semibold text-slate-700 mb-4">Customer Information</h2>
            <div className="space-y-4">
              <DetailField icon={User} label="Customer Name" value={ticket.customer_name} />
              <DetailField icon={Mail} label="Customer Email" value={ticket.customer_email} />
            </div>
          </div>

          {/* Description card */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <h2 className="text-sm font-semibold text-slate-700 mb-3">Description</h2>
            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
              {ticket.description}
            </p>
          </div>

          {/* Notes / comments card */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-5">
              <MessageSquare className="h-4 w-4 text-slate-500" />
              <h2 className="text-sm font-semibold text-slate-700">
                Notes &amp; Comments
                {ticket.notes && ticket.notes.length > 0 && (
                  <span className="ml-2 text-xs font-normal text-slate-400">
                    ({ticket.notes.length})
                  </span>
                )}
              </h2>
            </div>

            {/* Notes timeline */}
            {ticket.notes && ticket.notes.length > 0 ? (
              <div className="space-y-4 mb-6">
                {ticket.notes.map((note) => (
                  <div key={note.id} className="flex items-start gap-3">
                    <Avatar name="S" className="w-8 h-8 text-xs" />
                    <div className="flex-1 min-w-0">
                      <div className="bg-slate-50 border border-slate-100 rounded-lg px-4 py-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-semibold text-slate-600">
                            Support Team
                          </span>
                          <span className="text-xs text-slate-400">{formatDate(note.created_at)}</span>
                        </div>
                        <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
                          {note.note_text}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center text-center py-6 text-slate-400 mb-6">
                <MessageSquare className="h-7 w-7 mb-2 opacity-50" />
                <p className="text-sm">No notes yet. Add the first one below.</p>
              </div>
            )}

            {/* Add note form */}
            <form onSubmit={handleAddNote} className="border-t border-slate-100 pt-5">
              <label htmlFor="note" className="block text-sm font-medium text-slate-700 mb-1.5">
                Add a Note
              </label>
              <textarea
                id="note"
                value={noteText}
                onChange={(e) => {
                  setNoteText(e.target.value);
                  if (noteError) setNoteError('');
                }}
                rows={3}
                placeholder="Write a note or update..."
                disabled={isAddingNote}
                className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none transition-shadow disabled:opacity-50"
              />
              {noteError && (
                <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1" role="alert">
                  <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
                  {noteError}
                </p>
              )}
              <div className="flex justify-end mt-3">
                <button
                  type="submit"
                  disabled={isAddingNote || !noteText.trim()}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isAddingNote ? (
                    <>
                      <Spinner className="h-3.5 w-3.5 text-white" />
                      Adding...
                    </>
                  ) : (
                    'Add Note'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right sidebar: status + metadata */}
        <div className="w-full lg:w-72 flex-shrink-0 space-y-4">
          {/* Status card */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <h2 className="text-sm font-semibold text-slate-700 mb-4">Ticket Status</h2>

            {/* Current status display */}
            <div className="mb-4">
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">
                Current
              </p>
              <StatusBadge status={ticket.status} />
            </div>

            {/* Status selector */}
            <div>
              <label
                htmlFor="status-select"
                className="block text-xs font-medium text-slate-500 mb-1.5"
              >
                Update Status
              </label>
              <div className="relative">
                <select
                  id="status-select"
                  value={ticket.status}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  disabled={isUpdatingStatus}
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-shadow"
                >
                  <option value="Open">Open</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>

              {/* Saving indicator */}
              {isUpdatingStatus && (
                <p className="mt-2 text-xs text-slate-500 flex items-center gap-1.5">
                  <Spinner className="h-3 w-3 text-indigo-500" />
                  Saving...
                </p>
              )}
              {statusSaved && !isUpdatingStatus && (
                <p className="mt-2 text-xs text-green-600 font-medium">
                  ✓ Status updated
                </p>
              )}
              {statusError && (
                <p className="mt-2 text-xs text-red-600 flex items-center gap-1" role="alert">
                  <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
                  {statusError}
                </p>
              )}
            </div>
          </div>

          {/* Metadata card */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <h2 className="text-sm font-semibold text-slate-700 mb-4">Details</h2>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider mb-0.5">
                  Ticket ID
                </p>
                <p className="text-sm font-mono font-semibold text-slate-700">
                  #{ticket.ticket_id}
                </p>
              </div>
              <div className="border-t border-slate-100 pt-3">
                <p className="text-xs text-slate-400 uppercase tracking-wider mb-0.5">
                  Created
                </p>
                <p className="text-sm text-slate-700">{formatDate(ticket.created_at)}</p>
              </div>
              <div className="border-t border-slate-100 pt-3">
                <p className="text-xs text-slate-400 uppercase tracking-wider mb-0.5">
                  Last Updated
                </p>
                <p className="text-sm text-slate-700">{formatDate(ticket.updated_at)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TicketDetail;
