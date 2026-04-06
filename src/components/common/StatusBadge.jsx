const StatusBadge = ({ status }) => {
  const styles = {
    Pending: 'bg-amber-500/15 text-amber-500',
    Approved: 'bg-green-500/15 text-green-600',
    Rejected: 'bg-red-500/15 text-red-500',
  };
  
  const defaultStyle = 'bg-gray-500/15 text-gray-500';
  
  return (
    <span className={`status-badge inline-block px-3 py-1 rounded-full text-[11px] font-semibold ${styles[status] || defaultStyle}`}>
      {status}
    </span>
  );
};

export default StatusBadge;