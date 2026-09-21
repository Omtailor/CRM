import StatusBadge from '../StatusBadge';
import { AlertCircle } from '../icons';
import Spinner from '../common/Spinner';

function TicketStatusCard({
  status,
  onStatusChange,
  isUpdatingStatus,
  statusSaved,
  statusError,
}) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
      <h2 className="text-sm font-semibold text-slate-700 mb-4">Ticket Status</h2>

      {/* Current status display */}
      <div className="mb-4">
        <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">
          Current
        </p>
        <StatusBadge status={status} />
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
            value={status}
            onChange={(e) => onStatusChange(e.target.value)}
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
  );
}

export default TicketStatusCard;
