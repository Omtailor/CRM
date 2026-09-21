import { useEffect } from 'react';
import { getTickets } from '../api/client';

function TicketList() {
  useEffect(() => {
    getTickets()
      .then(tickets => {
        console.log('Tickets fetched:', tickets);
      })
      .catch(error => {
        console.error('Failed to fetch tickets:', error);
      });
  }, []);

  return (
    <div>
      <h1>Tickets</h1>
    </div>
  );
}

export default TicketList;
