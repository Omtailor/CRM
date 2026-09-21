// Fallback to localhost for development; production should use VITE_API_BASE_URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  let response;
  try {
    response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });
  } catch (networkError) {
    // Handle network errors (backend unreachable, CORS issues, etc.)
    throw new Error(`Network error: Unable to connect to server at ${API_BASE_URL}. Please check if the backend is running.`);
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

export async function getTickets(params = {}) {
  const queryParams = new URLSearchParams();
  if (params.status) queryParams.append('status', params.status);
  if (params.search) queryParams.append('search', params.search);
  
  const queryString = queryParams.toString();
  const endpoint = `/api/tickets${queryString ? `?${queryString}` : ''}`;
  
  return request(endpoint);
}

export async function getTicket(ticketId) {
  return request(`/api/tickets/${ticketId}`);
}

export async function createTicket(payload) {
  return request('/api/tickets', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function updateTicket(ticketId, payload) {
  return request(`/api/tickets/${ticketId}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}
