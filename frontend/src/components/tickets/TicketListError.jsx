import { AlertCircle, RefreshCw } from '../icons';

function TicketListError({ message, onRetry }) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-xl px-6 py-10 flex flex-col items-center text-center">
      <AlertCircle className="h-8 w-8 text-red-500 mb-3" />
      <p className="text-red-800 font-semibold mb-1">Failed to load tickets</p>
      <p className="text-red-600 text-sm mb-4 max-w-md">{message}</p>
      <button
        onClick={onRetry}
        className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
      >
        <RefreshCw className="h-4 w-4" />
        Retry
      </button>
    </div>
  );
}

export default TicketListError;
