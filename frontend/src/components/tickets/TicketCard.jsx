import StatusBadge from '../StatusBadge';
import PriorityBadge from '../PriorityBadge';
import SlaBadge from '../SlaBadge';

function TicketCard({ ticket, onClick, formatDate }) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
      className="bg-white border border-slate-200 rounded-xl p-4 cursor-pointer hover:border-indigo-300 hover:shadow-sm transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <span className="text-xs font-mono font-semibold text-slate-400 tracking-wide">
          #{ticket.ticket_id}
        </span>
        <StatusBadge status={ticket.status} />
      </div>
      <div className="flex flex-wrap items-center gap-2 mb-2">
        <PriorityBadge priority={ticket.priority} />
        {ticket.is_breached && <SlaBadge isBreached={ticket.is_breached} />}
      </div>
      <p className="text-sm font-medium text-slate-900 mb-1 leading-snug">{ticket.subject}</p>
      <p className="text-xs text-slate-500">
        {ticket.customer_name} &middot; {formatDate(ticket.created_at)}
      </p>
    </div>
  );
}

export default TicketCard;
