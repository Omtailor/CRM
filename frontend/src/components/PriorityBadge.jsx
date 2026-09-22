const PRIORITY_CONFIG = {
  Urgent: {
    dot: 'bg-red-500',
    badge: 'bg-red-50 text-red-700 border-red-200',
    label: 'Urgent',
  },
  High: {
    dot: 'bg-orange-500',
    badge: 'bg-orange-50 text-orange-700 border-orange-200',
    label: 'High',
  },
  Medium: {
    dot: 'bg-yellow-500',
    badge: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    label: 'Medium',
  },
  Low: {
    dot: 'bg-green-500',
    badge: 'bg-green-50 text-green-700 border-green-200',
    label: 'Low',
  },
};

function PriorityBadge({ priority = 'Medium' }) {
  const config = PRIORITY_CONFIG[priority] || PRIORITY_CONFIG.Medium;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${config.badge}`}
      aria-label={`Priority: ${config.label}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${config.dot}`} aria-hidden="true" />
      {config.label}
    </span>
  );
}

export default PriorityBadge;
