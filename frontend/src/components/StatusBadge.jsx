function StatusBadge({ status }) {
  const statusStyles = {
    'Open': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'In Progress': 'bg-blue-100 text-blue-800 border-blue-200',
    'Closed': 'bg-green-100 text-green-800 border-green-200',
  };

  const defaultStyle = 'bg-gray-100 text-gray-800 border-gray-200';
  const style = statusStyles[status] || defaultStyle;

  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${style}`}>
      {status}
    </span>
  );
}

export default StatusBadge;
