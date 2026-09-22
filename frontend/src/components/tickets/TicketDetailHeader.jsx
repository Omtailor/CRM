import StatusBadge from '../StatusBadge';
import PriorityBadge from '../PriorityBadge';
import SlaBadge from '../SlaBadge';

function TicketDetailHeader({ ticket, formatDate }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm px-6 py-5 mb-5">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <span className="text-xs font-mono font-semibold text-slate-400 tracking-wider">
              #{ticket.ticket_id}
            </span>
            <StatusBadge status={ticket.status} />
            <PriorityBadge priority={ticket.priority} />
            {ticket.is_breached && <SlaBadge isBreached={ticket.is_breached} />}
          </div>
          <h1 className="text-xl font-bold text-slate-900 leading-tight">{ticket.subject}</h1>
          <p className="text-sm text-slate-400 mt-1">
            Opened {formatDate(ticket.created_at)}
          </p>
        </div>
      </div>
    </div>
  );
}

export default TicketDetailHeader;
