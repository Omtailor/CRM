function SlaBadge({ isBreached }) {
  const label = isBreached ? 'SLA Breached' : 'Within SLA';
  const classes = isBreached
    ? 'bg-red-50 text-red-700 border-red-200'
    : 'bg-green-50 text-green-700 border-green-200';
  const dot = isBreached ? 'bg-red-500' : 'bg-green-500';

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${classes}`}
      aria-label={`SLA status: ${label}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${dot}`} aria-hidden="true" />
      {label}
    </span>
  );
}

export default SlaBadge;
