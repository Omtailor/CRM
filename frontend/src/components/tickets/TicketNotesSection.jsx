import { MessageSquare, AlertCircle } from '../icons';
import Spinner from '../common/Spinner';

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

function TicketNotesSection({
  notes,
  formatDate,
  noteText,
  onNoteTextChange,
  noteError,
  isAddingNote,
  onSubmitNote,
}) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
      <div className="flex items-center gap-2 mb-5">
        <MessageSquare className="h-4 w-4 text-slate-500" />
        <h2 className="text-sm font-semibold text-slate-700">
          Notes &amp; Comments
          {notes && notes.length > 0 && (
            <span className="ml-2 text-xs font-normal text-slate-400">
              ({notes.length})
            </span>
          )}
        </h2>
      </div>

      {/* Notes timeline */}
      {notes && notes.length > 0 ? (
        <div className="space-y-4 mb-6">
          {notes.map((note) => (
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
      <form onSubmit={onSubmitNote} className="border-t border-slate-100 pt-5">
        <label htmlFor="note" className="block text-sm font-medium text-slate-700 mb-1.5">
          Add a Note
        </label>
        <textarea
          id="note"
          value={noteText}
          onChange={onNoteTextChange}
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
  );
}

export default TicketNotesSection;
