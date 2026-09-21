import { User, Mail } from '../icons';

function DetailField({ icon: Icon, label, value, mono }) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex-shrink-0 w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center mt-0.5">
        <Icon className="h-4 w-4 text-slate-500" />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-0.5">
          {label}
        </p>
        <p className={`text-sm text-slate-800 ${mono ? 'font-mono' : 'font-medium'}`}>
          {value}
        </p>
      </div>
    </div>
  );
}

function CustomerInfoCard({ customerName, customerEmail }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
      <h2 className="text-sm font-semibold text-slate-700 mb-4">Customer Information</h2>
      <div className="space-y-4">
        <DetailField icon={User} label="Customer Name" value={customerName} />
        <DetailField icon={Mail} label="Customer Email" value={customerEmail} />
      </div>
    </div>
  );
}

export default CustomerInfoCard;
