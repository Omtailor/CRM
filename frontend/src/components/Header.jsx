import { Link } from 'react-router-dom';

function Header() {
  return (
    <header className="bg-gray-800 text-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">Support CRM</h1>
          <nav className="flex space-x-4">
            <Link 
              to="/" 
              className="text-gray-300 hover:text-white transition-colors"
            >
              Tickets
            </Link>
            <Link 
              to="/create" 
              className="text-gray-300 hover:text-white transition-colors"
            >
              Create Ticket
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Header;
