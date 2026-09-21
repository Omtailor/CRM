import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTicket, updateTicket } from '../api/client';
import StatusBadge from '../components/StatusBadge';

function TicketDetail() {
  const { ticketId } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [noteError, setNoteError] = useState('');
  const [statusError, setStatusError] = useState('');

  useEffect(() => {
    const fetchTicket = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getTicket(ticketId);
        setTicket(data);
      } catch (err) {
        if (err.message.includes('404') || err.message.includes('not found')) {
          setError('Ticket not found');
        } else {
          setError(err.message || 'Failed to load ticket');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTicket();
  }, [ticketId]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleStatusChange = async (newStatus) => {
    setStatusError('');
    setIsUpdatingStatus(true);
    try {
      await updateTicket(ticketId, { status: newStatus });
      // Re-fetch to get updated data
      const updatedTicket = await getTicket(ticketId);
      setTicket(updatedTicket);
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
      // Re-fetch to get updated notes
      const updatedTicket = await getTicket(ticketId);
      setTicket(updatedTicket);
      setNoteText('');
    } catch (err) {
      setError(err.message || 'Failed to add note');
    } finally {
      setIsAddingNote(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <p className="mt-2 text-gray-600">Loading ticket...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          <p className="font-medium">Error</p>
          <p className="text-sm">{error}</p>
        </div>
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Back to Tickets
        </button>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg mb-6">
          <p className="font-medium">Ticket not found</p>
          <p className="text-sm">The ticket you're looking for doesn't exist.</p>
        </div>
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Back to Tickets
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4">
        <button
          onClick={() => navigate('/')}
          className="text-blue-600 hover:text-blue-800 transition-colors"
        >
          ← Back to Tickets
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              #{ticket.ticket_id}
            </h1>
            <p className="text-sm text-gray-500">
              Created on {formatDate(ticket.created_at)}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <StatusBadge status={ticket.status} />
            <select
              value={ticket.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              disabled={isUpdatingStatus}
              className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none disabled:opacity-50 disabled:cursor-not-allowed bg-white"
            >
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Closed">Closed</option>
            </select>
            {isUpdatingStatus && (
              <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
            )}
          </div>
        </div>
        {statusError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded text-sm mb-4">
            {statusError}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Customer Name</label>
            <p className="text-gray-900">{ticket.customer_name}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Customer Email</label>
            <p className="text-gray-900">{ticket.customer_email}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Subject</label>
            <p className="text-gray-900 font-medium">{ticket.subject}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Description</label>
            <p className="text-gray-900 whitespace-pre-wrap">{ticket.description}</p>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <label className="block text-sm font-medium text-gray-500 mb-1">Last Updated</label>
            <p className="text-gray-600 text-sm">{formatDate(ticket.updated_at)}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Notes</h2>

        {ticket.notes && ticket.notes.length > 0 ? (
          <div className="space-y-4 mb-6">
            {ticket.notes.map((note) => (
              <div key={note.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <p className="text-gray-900 whitespace-pre-wrap mb-2">{note.note_text}</p>
                <p className="text-xs text-gray-500">
                  {formatDate(note.created_at)}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm mb-6">No notes yet.</p>
        )}

        <form onSubmit={handleAddNote} className="border-t border-gray-200 pt-4">
          <label htmlFor="note" className="block text-sm font-medium text-gray-700 mb-2">
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
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none mb-2"
            placeholder="Enter your note..."
            disabled={isAddingNote}
          />
          {noteError && (
            <p className="text-sm text-red-600 mb-2">{noteError}</p>
          )}
          <button
            type="submit"
            disabled={isAddingNote || !noteText.trim()}
            className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isAddingNote ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Adding...
              </span>
            ) : (
              'Add Note'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default TicketDetail;
