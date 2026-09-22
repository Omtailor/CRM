import { Link } from 'react-router-dom';
import { Plus, InboxIcon } from '../icons';

function TicketListEmpty({ hasFilters }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl px-6 py-14 flex flex-col items-center text-center">
      <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center mb-4">
        <InboxIcon className="h-7 w-7 text-slate-400" />
      </div>
      <p className="text-slate-800 font-semibold text-base mb-1">No tickets found</p>
      <p className="text-slate-500 text-sm max-w-xs">
        {hasFilters
          ? 'Try clearing your search or changing the selected filters.'
          : 'No support tickets have been created yet.'}
      </p>
      {!hasFilters && (
        <Link
          to="/create"
          className="mt-5 inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Create your first ticket
        </Link>
      )}
    </div>
  );
}

export default TicketListEmpty;
