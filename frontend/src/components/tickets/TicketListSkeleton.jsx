function SkeletonRow() {
  return (
    <tr className="animate-pulse">
      <td className="px-5 py-4">
        <div className="h-3.5 bg-slate-200 rounded w-24" />
      </td>
      <td className="px-5 py-4">
        <div className="h-3.5 bg-slate-200 rounded w-36" />
      </td>
      <td className="px-5 py-4">
        <div className="h-3.5 bg-slate-200 rounded w-48" />
      </td>
      <td className="px-5 py-4">
        <div className="h-5 bg-slate-200 rounded-full w-20" />
      </td>
      <td className="px-5 py-4">
        <div className="h-3.5 bg-slate-200 rounded w-32" />
      </td>
      <td className="px-5 py-4">
        <div className="h-7 bg-slate-200 rounded-lg w-14" />
      </td>
    </tr>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 animate-pulse">
      <div className="flex items-start justify-between mb-3">
        <div className="h-3.5 bg-slate-200 rounded w-24" />
        <div className="h-5 bg-slate-200 rounded-full w-16" />
      </div>
      <div className="h-4 bg-slate-200 rounded w-3/4 mb-2" />
      <div className="h-3 bg-slate-200 rounded w-1/2" />
    </div>
  );
}

function TicketListSkeleton() {
  return (
    <>
      {/* Desktop skeleton */}
      <div className="hidden sm:block bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              {['Ticket ID', 'Customer', 'Subject', 'Status', 'Created', 'Action'].map((h) => (
                <th
                  key={h}
                  className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {Array(5).fill(0).map((_, i) => <SkeletonRow key={i} />)}
          </tbody>
        </table>
      </div>
      {/* Mobile skeleton */}
      <div className="sm:hidden space-y-3">
        {Array(4).fill(0).map((_, i) => <SkeletonCard key={i} />)}
      </div>
    </>
  );
}

export default TicketListSkeleton;
