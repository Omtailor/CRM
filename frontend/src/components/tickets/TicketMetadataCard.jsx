function TicketMetadataCard({ ticketId, createdAt, updatedAt, formatDate }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
      <h2 className="text-sm font-semibold text-slate-700 mb-4">Details</h2>
      <div className="space-y-3">
        <div>
          <p className="text-xs text-slate-400 uppercase tracking-wider mb-0.5">
            Ticket ID
          </p>
          <p className="text-sm font-mono font-semibold text-slate-700">
            #{ticketId}
          </p>
        </div>
        <div className="border-t border-slate-100 pt-3">
          <p className="text-xs text-slate-400 uppercase tracking-wider mb-0.5">
            Created
          </p>
          <p className="text-sm text-slate-700">{formatDate(createdAt)}</p>
        </div>
        <div className="border-t border-slate-100 pt-3">
          <p className="text-xs text-slate-400 uppercase tracking-wider mb-0.5">
            Last Updated
          </p>
          <p className="text-sm text-slate-700">{formatDate(updatedAt)}</p>
        </div>
      </div>
    </div>
  );
}

export default TicketMetadataCard;
