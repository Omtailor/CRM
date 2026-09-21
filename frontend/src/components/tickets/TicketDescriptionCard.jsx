function TicketDescriptionCard({ description }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
      <h2 className="text-sm font-semibold text-slate-700 mb-3">Description</h2>
      <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
        {description}
      </p>
    </div>
  );
}

export default TicketDescriptionCard;
