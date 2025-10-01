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

export default api;