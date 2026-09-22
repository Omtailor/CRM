import { Link, useLocation } from 'react-router-dom';
import { DashboardIcon, TicketIcon, X } from './icons';

function NavItem({ to, icon: Icon, label, active, onClick }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 ${
        active
          ? 'bg-indigo-600 text-white shadow-sm'
          : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
      }`}
      aria-current={active ? 'page' : undefined}
    >
      <Icon className="h-4 w-4 flex-shrink-0" />
      <span>{label}</span>
    </Link>
  );
}

function Sidebar({ open, onClose }) {
  const location = useLocation();

  const isDashboardActive = location.pathname === '/';
  const isTicketsActive =
    location.pathname === '/tickets' || location.pathname.startsWith('/tickets/');

  return (
    <>
      {/* Mobile backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 z-20 lg:hidden transition-opacity duration-300 ${
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sidebar panel */}
      <aside
        className={`fixed top-0 left-0 h-full w-60 bg-slate-900 z-30 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-label="Main navigation"
      >
        {/* Brand area */}
        <div className="flex items-center gap-3 px-4 py-5 border-b border-slate-800">
          <div className="flex-shrink-0 w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <TicketIcon className="h-4 w-4 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-semibold text-sm leading-tight tracking-tight">
              Support CRM
            </p>
            <p className="text-slate-500 text-xs mt-0.5">Datastraw</p>
          </div>
          {/* Close button — mobile only */}
          <button
            onClick={onClose}
            className="lg:hidden text-slate-500 hover:text-slate-300 transition-colors p-1 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
            aria-label="Close navigation menu"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Navigation items */}
        <nav className="flex-1 px-3 py-4 space-y-0.5" aria-label="Pages">
          <NavItem
            to="/"
            icon={DashboardIcon}
            label="Dashboard"
            active={isDashboardActive}
            onClick={onClose}
          />
          <NavItem
            to="/tickets"
            icon={TicketIcon}
            label="Manage Tickets"
            active={isTicketsActive}
            onClick={onClose}
          />
        </nav>

        {/* Sidebar footer */}
        <div className="px-4 py-4 border-t border-slate-800">
          <p className="text-slate-600 text-xs">© 2026 Datastraw</p>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
