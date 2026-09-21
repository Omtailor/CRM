import { useParams } from 'react-router-dom';

function TicketDetail() {
  const { ticketId } = useParams();

  return (
    <div>
      <h1>Ticket Details: {ticketId}</h1>
    </div>
  );
}

export default TicketDetail;
