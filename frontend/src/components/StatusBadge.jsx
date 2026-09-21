const STATUS_CONFIG = {
  Open: {
    dot: 'bg-red-500',
    badge: 'bg-red-50 text-red-700 border-red-200',
    label: 'Open',
  },
  'In Progress': {
    dot: 'bg-amber-500',
    badge: 'bg-amber-50 text-amber-700 border-amber-200',
    label: 'In Progress',
  },
  Closed: {
    dot: 'bg-green-500',
    badge: 'bg-green-50 text-green-700 border-green-200',
    label: 'Closed',
  },
};

function StatusBadge({ status }) {
  const config = STATUS_CONFIG[status] || {
    dot: 'bg-slate-400',
    badge: 'bg-slate-100 text-slate-600 border-slate-200',
    label: status,
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${config.badge}`}
      aria-label={`Status: ${config.label}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${config.dot}`} aria-hidden="true" />
      {config.label}
    </span>
  );
}

export default StatusBadge;
