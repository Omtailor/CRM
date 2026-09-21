import StatusBadge from '../StatusBadge';

function TicketTable({ tickets, onSelectTicket, formatDate }) {
  return (
    <div className="hidden sm:block bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Ticket ID
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Subject
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Created
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {tickets.map((ticket) => (
              <tr
                key={ticket.ticket_id}
                onClick={() => onSelectTicket(ticket.ticket_id)}
                className="hover:bg-slate-50 cursor-pointer transition-colors group"
              >
                <td className="px-5 py-4 whitespace-nowrap">
                  <span className="text-xs font-mono font-semibold text-slate-500 tracking-wide">
                    #{ticket.ticket_id}
                  </span>
                </td>
                <td className="px-5 py-4 whitespace-nowrap">
                  <span className="text-sm font-medium text-slate-800">
                    {ticket.customer_name}
                  </span>
                </td>
                <td className="px-5 py-4 max-w-xs">
                  <span className="text-sm text-slate-700 line-clamp-1">
                    {ticket.subject}
                  </span>
                </td>
                <td className="px-5 py-4 whitespace-nowrap">
                  <StatusBadge status={ticket.status} />
                </td>
                <td className="px-5 py-4 whitespace-nowrap">
                  <span className="text-sm text-slate-500">
                    {formatDate(ticket.created_at)}
                  </span>
                </td>
                <td className="px-5 py-4 whitespace-nowrap">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectTicket(ticket.ticket_id);
                    }}
                    className="px-3 py-1.5 text-xs font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                    aria-label={`View ticket ${ticket.ticket_id}`}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TicketTable;
