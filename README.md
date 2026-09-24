<div align="center">

<br/>

<img src="https://img.shields.io/badge/🎫-Support%20CRM-4f46e5?style=for-the-badge&labelColor=0d0d1a&color=4f46e5" alt="Support CRM" height="40"/>

<h1>Support CRM</h1>

<p><strong>A modern customer support ticket management system with SLA tracking and real-time updates.</strong></p>

<p>
  <a href="https://crm-nine-rho-lcthja0jqo.vercel.app/" target="_blank">
    <img src="https://img.shields.io/badge/🌐 Live Demo-Visit Now-4f46e5?style=for-the-badge&labelColor=0d0d1a" alt="Live Demo"/>
  </a>
</p>

<p>
  <img src="https://img.shields.io/badge/FastAPI-Python-009688?style=flat-square&logo=fastapi&logoColor=white"/>
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black"/>
  <img src="https://img.shields.io/badge/PostgreSQL-Neon-4169E1?style=flat-square&logo=postgresql&logoColor=white"/>
  <img src="https://img.shields.io/badge/Tailwind-4.3-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white"/>
  <img src="https://img.shields.io/badge/SQLAlchemy-2.0-CA2651?style=flat-square&logo=sqlalchemy&logoColor=white"/>
  <img src="https://img.shields.io/badge/Pydantic-v2-E92063?style=flat-square&logo=pydantic&logoColor=white"/>
</p>

<br/>

</div>

## 📸 Screenshots

<br/>

**🎫 Manage Tickets** - Searchable ticket list with status/priority filters, SLA breach indicators, and pagination

<img src="./assets/manage_tickets.png" alt="Manage Tickets" width="100%"/>

<br/><br/>

**📝 Create Ticket** - Form with validation for customer details, subject, description, and priority selection

<img src="./assets/create_ticket.png" alt="Create Ticket" width="100%"/>

<br/><br/>

**👤 Ticket Detail** - Comprehensive view with customer info, status/priority cards, notes timeline, and metadata

<img src="./assets/ticket_detail.png" alt="Ticket Detail" width="100%"/>

<br/><br/>

**📊 Dashboard** - Overview with ticket statistics and quick actions

<img src="./assets/dashboard.png" alt="Dashboard" width="100%"/>

<br/>

## ✨ Features

### 🎫 Ticket Management

- Full CRUD operations for support tickets with auto-generated ticket IDs (`TKT-0001` format)
- Priority-based SLA tracking with automatic breach detection (Urgent: 4h, High: 24h, Medium: 48h, Low: 72h)
- Status workflow management (Open → In Progress → Closed) with instant UI updates
- Search across ticket ID, customer name, email, and subject
- Status filtering with server-side pagination

### 📝 Notes System

- Add unlimited timestamped notes to any ticket
- Notes appear in chronological order for a complete ticket history
- Notes are preserved across status and priority changes

### 🎯 Priority Management

- Four priority levels: Low, Medium, High, Urgent
- Automatic priority normalization with validation
- Visual SLA breach indicators when tickets exceed response time thresholds

### 📱 Responsive Design

- Mobile-first layout with collapsible sidebar navigation
- Two-column ticket detail view on desktop
- Touch-friendly interface for mobile support agents

### ⚡ Performance & Reliability

- Efficient database queries with SQLAlchemy ORM
- Pydantic v2 request/response validation on every endpoint
- Error handling with user-friendly messages
- Loading states and skeleton screens for better UX

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Backend | FastAPI, SQLAlchemy 2.0, Pydantic v2 |
| Frontend | React 19, Vite, Tailwind CSS 4.3, React Router 7 |
| Database | PostgreSQL (Neon) |
| API | RESTful API with CORS support |
| Deployment | Render (backend) + Vercel (frontend) |
| Development | Hot reload, ESLint, Vite dev server |

## 🚀 Local Setup

### Prerequisites

- Python 3.8+
- Node.js 18+
- PostgreSQL (Neon free tier works out of the box)

### 1. Clone the repo

```bash
git clone https://github.com/yourusername/crm_datastraw.git
cd crm_datastraw
```

### 2. Backend setup

```bash
cd backend

# Create and activate virtual environment
python -m venv venv
venv\Scripts\activate        # Windows - macOS/Linux: source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file and fill in your values
cp .env.example .env

# Start the server (tables are created on startup)
uvicorn app.main:app --reload
```

The API will be available at `http://localhost:8000`

### 3. Frontend setup

```bash
cd frontend
npm install

# Point the API at your local backend
cp .env.example .env.development
npm run dev
```

Open `http://localhost:5173` to access the application.

### Environment Variables

Create a `.env` file in `backend/`:

```env
# Database (PostgreSQL / Neon)
DATABASE_URL=postgresql://user:password@host:5432/dbname?sslmode=require

# Application
SECRET_KEY=your_secret_key_here
DEBUG=True
CORS_ALLOWED_ORIGINS=http://localhost:5173
```

And a `frontend/.env.development`:

```env
VITE_API_BASE_URL=http://localhost:8000
```

## 📁 Project Structure

```
crm_datastraw/
├── backend/                    # FastAPI backend
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py            # FastAPI app with CORS
│   │   ├── database.py        # Database connection
│   │   ├── models.py          # SQLAlchemy models (Ticket, Note)
│   │   ├── schemas.py         # Pydantic schemas
│   │   ├── crud.py            # Database operations & SLA logic
│   │   ├── datetime_utils.py  # Date/time utilities
│   │   └── routers/
│   │       ├── __init__.py
│   │       └── tickets.py     # Ticket API endpoints
│   ├── requirements.txt
│   └── .env.example
├── frontend/                   # React frontend
│   ├── src/
│   │   ├── pages/             # Page components
│   │   │   ├── Dashboard.jsx
│   │   │   ├── TicketList.jsx
│   │   │   ├── CreateTicket.jsx
│   │   │   └── TicketDetail.jsx
│   │   ├── components/        # Reusable components
│   │   │   ├── Sidebar.jsx
│   │   │   ├── tickets/       # Ticket-specific components
│   │   │   └── icons.js       # Custom icons
│   │   ├── api/
│   │   │   └── client.js      # API client with error handling
│   │   ├── utils/
│   │   │   └── date.js        # Date formatting utilities
│   │   ├── context/           # React context providers
│   │   ├── App.jsx            # Main app with routing
│   │   └── App.css
│   ├── package.json
│   └── .env.example
└── assets/                    # Screenshots used in this README
```

## ⚖️ SLA Logic

| Priority | Response Time | Breach Detection |
|---|---|---|
| Urgent | 4 hours | > 4 hours from creation |
| High | 24 hours | > 24 hours from creation |
| Medium | 48 hours | > 48 hours from creation |
| Low | 72 hours | > 72 hours from creation |

SLA breaches are calculated server-side and displayed in the UI with visual indicators. Closed tickets are exempt from SLA calculations.

## 🎫 Ticket ID Generation

- Auto-incrementing IDs in the format `TKT-XXXX` (e.g., `TKT-0001`, `TKT-0002`)
- Generated server-side to prevent conflicts
- Handles edge cases where existing IDs don't match the expected format

## 🔔 Status Workflow

| Status | Description |
|---|---|
| Open | Newly created ticket, awaiting attention |
| In Progress | Active work being performed on the ticket |
| Closed | Ticket resolved and archived |

Status changes are timestamped and can trigger SLA breach recalculations.

## 📦 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/` | Health check endpoint |
| GET | `/api/tickets` | List all tickets with optional filters (status, search) |
| GET | `/api/tickets/{ticket_id}` | Get specific ticket with notes |
| POST | `/api/tickets` | Create new ticket |
| PUT | `/api/tickets/{ticket_id}` | Update ticket (status, priority, notes) |

## 🌐 Deployment

| Service | Provider | Notes |
|---|---|---|
| Frontend | Vercel | Auto-deploys on push |
| Backend | Render | Uvicorn / Gunicorn |
| PostgreSQL | Neon | Free tier, SSL required |

**Live:** [crm-nine-rho-lcthja0jqo.vercel.app](https://crm-nine-rho-lcthja0jqo.vercel.app/)

## 👤 Author

Built with modern web technologies for efficient customer support management.

> **Note:** This project is currently unlicensed. An MIT license is recommended before publishing.

<div align="center">
  <sub>Built with ❤️ using FastAPI and React</sub>
</div>
