import { useEffect, useRef } from 'react';
import { AlertCircle, X } from '../icons';
import Spinner from './Spinner';

/**
 * Modal dialog that asks the user to confirm permanent ticket deletion.
 *
 * Props:
 *   ticketId    – string, e.g. "TKT-0004"
 *   isDeleting  – boolean, controls loading state
 *   error       – string | null, non-fatal API error to display inside the modal
 *   onConfirm   – called when the user clicks "Delete Ticket"
 *   onCancel    – called when the user cancels (Escape, backdrop click, Cancel button)
 */
function ConfirmDeleteModal({ ticketId, isDeleting, error, onConfirm, onCancel }) {
  const cancelBtnRef = useRef(null);

  // Auto-focus the Cancel button so keyboard users can dismiss easily
  useEffect(() => {
    cancelBtnRef.current?.focus();
  }, []);

  // Close on Escape (unless a delete is in flight)
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape' && !isDeleting) onCancel();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isDeleting, onCancel]);

  return (
    /* Full-screen overlay */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-modal-title"
      aria-describedby="delete-modal-desc"
    >
      {/* Backdrop — click to cancel (unless deleting) */}
      <div
        className="absolute inset-0 bg-black/50 transition-opacity"
        aria-hidden="true"
        onClick={!isDeleting ? onCancel : undefined}
      />

      {/* Dialog panel */}
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md border border-slate-200 p-6">
        {/* X close button */}
        {!isDeleting && (
          <button
            onClick={onCancel}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 rounded"
            aria-label="Close dialog"
          >
            <X className="h-4 w-4" />
          </button>
        )}

        {/* Warning icon + heading */}
        <div className="flex items-start gap-4 mb-4">
          <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
            <AlertCircle className="h-5 w-5 text-red-600" />
          </div>
          <div className="min-w-0">
            <h2
              id="delete-modal-title"
              className="text-base font-semibold text-slate-900 leading-tight"
            >
              Delete Ticket?
            </h2>
            <p id="delete-modal-desc" className="text-sm text-slate-500 mt-1 leading-relaxed">
              You are about to permanently delete ticket{' '}
              <span className="font-mono font-semibold text-slate-700">#{ticketId}</span>.
              All notes associated with this ticket will also be deleted. This
              action cannot be undone.
            </p>
          </div>
        </div>

        {/* Inline API error (non-fatal — user can retry or cancel) */}
        {error && (
          <div
            className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2.5 mb-4"
            role="alert"
          >
            <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex justify-end gap-3 mt-2">
          <button
            ref={cancelBtnRef}
            onClick={onCancel}
            disabled={isDeleting}
            className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
          >
            {isDeleting ? (
              <>
                <Spinner className="h-3.5 w-3.5 text-white" />
                Deleting…
              </>
            ) : (
              'Delete Ticket'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDeleteModal;
