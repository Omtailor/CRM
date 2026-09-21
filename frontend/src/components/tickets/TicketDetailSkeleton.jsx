function TicketDetailSkeleton() {
  return (
    <div className="animate-pulse space-y-5">
      <div className="h-4 bg-slate-200 rounded w-28" />
      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="h-6 bg-slate-200 rounded w-32" />
            <div className="h-4 bg-slate-200 rounded w-48" />
          </div>
          <div className="h-6 bg-slate-200 rounded-full w-20" />
        </div>
        <div className="border-t border-slate-100 pt-4 space-y-4">
          {Array(4).fill(0).map((_, i) => (
            <div key={i} className="space-y-1.5">
              <div className="h-3 bg-slate-200 rounded w-24" />
              <div className="h-4 bg-slate-200 rounded w-48" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TicketDetailSkeleton;
