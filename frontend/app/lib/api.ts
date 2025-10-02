import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('userType');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// Auth API functions
export const authAPI = {
  // Passenger APIs
  registerPassenger: (data: any) => api.post('/passenger', data),
  loginPassenger: (data: any) => api.post('/passenger/login', data),
  
  // Driver APIs
  registerDriver: (data: any) => api.post('/driver/register', data),
  loginDriver: (data: any) => api.post('/driver/login', data),
  
  // Admin APIs
  loginAdmin: (data: any) => api.post('/admin/login', data),
  registerAdmin: (data: any) => api.post('/admin/register', data),
};

// General API functions
export const generalAPI = {
  // Passenger APIs
  getPassengerProfile: (id: number) => api.get(`/passenger/${id}`),
  updatePassengerProfile: (id: number, data: any) => api.put(`/passenger/${id}`, data),
  
  // Driver APIs
  getDriverProfile: (id: number) => api.get(`/driver/${id}`),
  
  // Admin APIs
  getAllPassengers: () => api.get('/passenger'),
  getAllDrivers: () => api.get('/admin/drivers'),
  getAllActiveDrivers: () => api.get('/admin/drivers/active'),
  getAllDriversWithLocation: () => api.get('/admin/drivers/with-location'),
  getInactiveDrivers: () => api.get('/driver/inactive'),
  updateDriverStatus: (id: number, status: string) => api.patch(`/admin/drivers/${id}/status`, { status }),
  updateDriverDetails: (id: number, data: any) => api.patch(`/admin/drivers/${id}/details`, data),
  getDriverLocation: (id: number) => api.get(`/admin/drivers/${id}/location`),
};

// Route and Booking APIs
export const routeAPI = {
  // Get available routes for passengers
  getAvailableRoutes: () => api.get('/passenger/routes/available'),
  searchRoutes: (start?: string, end?: string) => api.get('/passenger/routes/search', { 
    params: { start, end } 
  }),
  getRouteDetails: (routeId: number) => api.get(`/passenger/routes/${routeId}`),
  getRouteSchedules: (routeId: number) => api.get(`/passenger/routes/${routeId}/schedules`),
  getAvailableSchedules: () => api.get('/passenger/schedules/available'),
};

// Ticket Booking APIs
export const ticketAPI = {
  // Single ticket booking
  createTicket: (passengerId: number, ticketData: any) => 
    api.post(`/passenger/${passengerId}/tickets`, ticketData),
  
  // Multiple seats booking
  createMultipleTickets: (passengerId: number, bookingData: any) => 
    api.post(`/passenger/${passengerId}/tickets/multiple`, bookingData),
  
  // Get passenger tickets
  getPassengerTickets: (passengerId: number) => 
    api.get(`/passenger/${passengerId}/tickets`),
  
  // Get grouped tickets (for multiple seat bookings)
  getPassengerTicketsGrouped: (passengerId: number) => 
    api.get(`/passenger/${passengerId}/tickets/grouped`),
  
  // Cancel single ticket
  cancelTicket: (passengerId: number, ticketId: number) => 
    api.delete(`/passenger/${passengerId}/tickets/${ticketId}`),
  
  // Cancel entire booking group
  cancelBookingGroup: (passengerId: number, bookingGroupId: string) => 
    api.delete(`/passenger/${passengerId}/booking-groups/${bookingGroupId}`),
  
  // Update ticket status
  updateTicketStatus: (ticketId: number, status: string) => 
    api.put(`/passenger/tickets/${ticketId}/status`, { status }),
};

export default api;