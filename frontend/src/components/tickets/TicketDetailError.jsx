import { AlertCircle, RefreshCw } from '../icons';

function TicketDetailError({ error, onBack, onRetry }) {
  const isNotFound = error === 'Ticket not found';

  return (
    <div className="flex flex-col items-center text-center py-14 bg-white border border-slate-200 rounded-xl">
      <AlertCircle className="h-10 w-10 text-red-400 mb-3" />
      <p className="text-slate-800 font-semibold mb-1">
        {isNotFound ? 'Ticket Not Found' : 'Something went wrong'}
      </p>
      <p className="text-slate-500 text-sm mb-5 max-w-xs">{error}</p>
      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
        >
          Back to Tickets
        </button>
        {!isNotFound && (
          <button
            onClick={onRetry}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            Retry
          </button>
        )}
      </div>
    </div>
  );
}

export default TicketDetailError;
