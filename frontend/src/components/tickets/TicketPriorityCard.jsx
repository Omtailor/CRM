import PriorityBadge from '../PriorityBadge';
import SlaBadge from '../SlaBadge';
import { AlertCircle } from '../icons';
import Spinner from '../common/Spinner';

function TicketPriorityCard({
  priority,
  isBreached,
  onPriorityChange,
  isUpdatingPriority,
  prioritySaved,
  priorityError,
}) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
      <h2 className="text-sm font-semibold text-slate-700 mb-4">Priority & SLA</h2>

      <div className="mb-4 space-y-3">
        <div>
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">
            Priority
          </p>
          <PriorityBadge priority={priority} />
        </div>
        <div className="border-t border-slate-100 pt-3">
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">
            SLA Status
          </p>
          <SlaBadge isBreached={isBreached} />
        </div>
      </div>

      <div>
        <label
          htmlFor="priority-select"
          className="block text-xs font-medium text-slate-500 mb-1.5"
        >
          Update Priority
        </label>
        <select
          id="priority-select"
          value={priority || 'Medium'}
          onChange={(e) => onPriorityChange(e.target.value)}
          disabled={isUpdatingPriority}
          className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-shadow"
        >
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
          <option value="Urgent">Urgent</option>
        </select>

        {isUpdatingPriority && (
          <p className="mt-2 text-xs text-slate-500 flex items-center gap-1.5">
            <Spinner className="h-3 w-3 text-indigo-500" />
            Saving...
          </p>
        )}
        {prioritySaved && !isUpdatingPriority && (
          <p className="mt-2 text-xs text-green-600 font-medium">
            Priority updated
          </p>
        )}
        {priorityError && (
          <p className="mt-2 text-xs text-red-600 flex items-center gap-1" role="alert">
            <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
            {priorityError}
          </p>
        )}
      </div>
    </div>
  );
}

export default TicketPriorityCard;
