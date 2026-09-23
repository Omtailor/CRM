import { Trash2 } from '../icons';

/**
 * Danger-zone card shown at the bottom of the Ticket Detail right sidebar.
 * Clicking the button does NOT delete immediately — it opens a confirmation modal.
 */
function DeleteTicketCard({ onDeleteClick }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
      <h2 className="text-sm font-semibold text-slate-700 mb-1">Danger Zone</h2>
      <p className="text-xs text-slate-500 mb-4 leading-relaxed">
        Permanently delete this ticket and all its associated notes.
      </p>
      <button
        onClick={onDeleteClick}
        className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 transition-colors"
        aria-label="Delete this ticket"
      >
        <Trash2 className="h-4 w-4" />
        Delete Ticket
      </button>
    </div>
  );
}

export default DeleteTicketCard;
