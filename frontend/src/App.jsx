import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import TicketList from './pages/TicketList';
import CreateTicket from './pages/CreateTicket';
import TicketDetail from './pages/TicketDetail';
import { Menu, TicketIcon } from './components/icons';
import './App.css';

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
        <span className="text-2xl" aria-hidden="true">404</span>
      </div>
      <h1 className="text-xl font-semibold text-slate-900 mb-2">Page Not Found</h1>
      <p className="text-slate-500 text-sm mb-6 max-w-xs">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        to="/"
        className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
      >
        Back to Tickets
      </Link>
    </div>
  );
}

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <Router>
      <div className="min-h-screen bg-slate-50">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Content wrapper — offset by sidebar width on large screens */}
        <div className="lg:ml-60 flex flex-col min-h-screen">
          {/* Mobile top bar */}
          <header className="lg:hidden sticky top-0 z-10 bg-slate-900 border-b border-slate-800 px-4 py-3 flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-slate-400 hover:text-white transition-colors p-1 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
              aria-label="Open navigation menu"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-indigo-600 rounded flex items-center justify-center">
                <TicketIcon className="h-3 w-3 text-white" />
              </div>
              <span className="text-white font-semibold text-sm tracking-tight">
                Support CRM
              </span>
            </div>
          </header>

          {/* Page content */}
          <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 w-full max-w-6xl mx-auto">
            <Routes>
              <Route path="/" element={<TicketList />} />
              <Route path="/create" element={<CreateTicket />} />
              <Route path="/tickets/:ticketId" element={<TicketDetail />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
