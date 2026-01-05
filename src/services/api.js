import axios from 'axios';

// Base URL for the Spring Boot backend API
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';

// Create axios instance with default config
const api = axios.create({
    baseURL: BASE_URL,
    timeout: 15000,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Token storage keys
const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';
const USER_KEY = 'user';

// Token management utilities
export const tokenUtils = {
    getAccessToken: () => localStorage.getItem(ACCESS_TOKEN_KEY),
    getRefreshToken: () => localStorage.getItem(REFRESH_TOKEN_KEY),
    setTokens: (accessToken, refreshToken) => {
        localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
        if (refreshToken) {
            localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
        }
    },
    clearTokens: () => {
        localStorage.removeItem(ACCESS_TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
    },
    getUser: () => {
        const user = localStorage.getItem(USER_KEY);
        return user ? JSON.parse(user) : null;
    },
    setUser: (user) => {
        localStorage.setItem(USER_KEY, JSON.stringify(user));
    }
};

// Flag to prevent multiple refresh attempts
let isRefreshing = false;
let refreshSubscribers = [];

const subscribeTokenRefresh = (callback) => {
    refreshSubscribers.push(callback);
};

const onTokenRefreshed = (accessToken) => {
    refreshSubscribers.forEach(callback => callback(accessToken));
    refreshSubscribers = [];
};

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const token = tokenUtils.getAccessToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for error handling and token refresh
api.interceptors.response.use(
    (response) => {
        // Handle standard API response format
        // The backend returns { success, message, data, timestamp, errors }
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        // Handle 401 Unauthorized - attempt token refresh
        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                // Wait for the token to be refreshed
                return new Promise((resolve) => {
                    subscribeTokenRefresh((token) => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        resolve(api(originalRequest));
                    });
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const refreshToken = tokenUtils.getRefreshToken();
                if (refreshToken) {
                    const response = await axios.post(`${BASE_URL}/auth/refresh`, {
                        refreshToken
                    });

                    if (response.data.success) {
                        const { accessToken, refreshToken: newRefreshToken } = response.data.data;
                        tokenUtils.setTokens(accessToken, newRefreshToken);
                        onTokenRefreshed(accessToken);
                        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                        return api(originalRequest);
                    }
                }
            } catch (refreshError) {
                // Refresh failed, redirect to login
                tokenUtils.clearTokens();
                window.location.href = '/login';
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }

            // No refresh token available, redirect to login
            tokenUtils.clearTokens();
            window.location.href = '/login';
        }

        // Handle 403 Forbidden - insufficient permissions
        if (error.response?.status === 403) {
            console.error('Access denied - insufficient permissions');
        }

        // Handle 500 Server Error
        if (error.response?.status >= 500) {
            console.error('Server error occurred');
        }

        // Handle network errors
        if (!error.response) {
            console.error('Network error - please check your connection');
        }

        return Promise.reject(error);
    }
);

export default api;

// ===== Authentication API =====
// Endpoints: /api/v1/auth
export const authAPI = {
    // POST /auth/register - Create a new user account (Public)
    register: (userData) => api.post('/auth/register', userData),

    // POST /auth/login - Authenticate and get tokens (Public)
    login: (credentials) => api.post('/auth/login', credentials),

    // POST /auth/refresh - Get new access token using refresh token (Public)
    refreshToken: (refreshToken) => api.post('/auth/refresh', { refreshToken }),

    // Helper to handle login response
    handleLoginResponse: (response) => {
        if (response.data.success) {
            const { accessToken, refreshToken, user } = response.data.data;
            tokenUtils.setTokens(accessToken, refreshToken);
            tokenUtils.setUser(user);
            return user;
        }
        throw new Error(response.data.message || 'Login failed');
    },

    // Logout - Clear tokens
    logout: () => {
        tokenUtils.clearTokens();
    }
};

// ===== Doctors API =====
// Endpoints: /api/v1/doctors
export const doctorAPI = {
    // GET /doctors - List all doctors (Authenticated)
    getAll: (params) => api.get('/doctors', { params }),

    // GET /doctors/{id} - Get doctor details (Authenticated)
    getById: (id) => api.get(`/doctors/${id}`),

    // GET /doctors/available - List currently available doctors (Authenticated)
    getAvailable: () => api.get('/doctors/available'),

    // GET /doctors/specializations - List all unique specializations (Authenticated)
    getSpecializations: () => api.get('/doctors/specializations'),

    // POST /doctors - Create a new doctor profile (ADMIN only)
    create: (data) => api.post('/doctors', data),

    // PUT /doctors/{id} - Update doctor profile (ADMIN or Owner)
    update: (id, data) => api.put(`/doctors/${id}`, data),

    // PATCH /doctors/{id}/availability - Toggle doctor availability (ADMIN or Owner)
    toggleAvailability: (id) => api.patch(`/doctors/${id}/availability`),

    // Additional endpoints for schedule management
    getSchedule: (id) => api.get(`/doctors/${id}/schedule`),
    updateSchedule: (id, schedule) => api.put(`/doctors/${id}/schedule`, schedule)
};

// ===== Patients API =====
// Endpoints: /api/v1/patients
export const patientAPI = {
    // GET /patients - List all patients (ADMIN, DOCTOR, RECEPTIONIST)
    getAll: (params) => api.get('/patients', { params }),

    // GET /patients/{id} - Get patient details (Auth User - Role restricted)
    getById: (id) => api.get(`/patients/${id}`),

    // GET /patients/search - Search patients by name (ADMIN, DOCTOR, RECEPTIONIST)
    search: (query) => api.get('/patients/search', { params: { name: query } }),

    // POST /patients - Register a new patient (ADMIN, RECEPTIONIST)
    create: (data) => api.post('/patients', data),

    // PUT /patients/{id} - Update patient (Auth User)
    update: (id, data) => api.put(`/patients/${id}`, data),

    // DELETE /patients/{id} - Delete patient (ADMIN)
    delete: (id) => api.delete(`/patients/${id}`),

    // GET /patients/{id}/medical-history - View medical history (ADMIN, DOCTOR)
    getMedicalHistory: (id) => api.get(`/patients/${id}/medical-history`),

    // POST /patients/{id}/medical-history - Add medical history record (ADMIN, DOCTOR)
    addMedicalHistory: (id, data) => api.post(`/patients/${id}/medical-history`, data)
};

// ===== Appointments API =====
// Endpoints: /api/v1/appointments
export const appointmentAPI = {
    // GET /appointments - List all appointments (Authenticated)
    getAll: (params) => api.get('/appointments', { params }),

    // GET /appointments/{id} - Get appointment details
    getById: (id) => api.get(`/appointments/${id}`),

    // POST /appointments - Book a new appointment (Authenticated)
    create: (data) => api.post('/appointments', data),

    // GET /appointments/patient/{id} - List patient appointments (Auth User)
    getByPatient: (patientId, params) => api.get(`/appointments/patient/${patientId}`, { params }),

    // GET /appointments/doctor/{id} - List doctor appointments (Auth User)
    getByDoctor: (doctorId, params) => api.get(`/appointments/doctor/${doctorId}`, { params }),

    // PATCH /appointments/{id}/status - Update status (ADMIN, DOCTOR, RECEPTIONIST)
    // Status: PENDING, CONFIRMED, CANCELLED, COMPLETED, NOSHOW
    updateStatus: (id, status) => api.patch(`/appointments/${id}/status`, { status }),

    // Convenience methods for common status updates
    confirm: (id) => api.patch(`/appointments/${id}/status`, { status: 'CONFIRMED' }),
    cancel: (id) => api.patch(`/appointments/${id}/status`, { status: 'CANCELLED' }),
    complete: (id) => api.patch(`/appointments/${id}/status`, { status: 'COMPLETED' }),
    markNoShow: (id) => api.patch(`/appointments/${id}/status`, { status: 'NOSHOW' }),

    // Additional utility endpoints
    getAvailability: (doctorId, date) => api.get('/appointments/availability', { params: { doctorId, date } }),
    getTodaysAppointments: () => api.get('/appointments/today')
};

// ===== Billing API =====
// Endpoints: /api/v1/billing
export const billingAPI = {
    // GET /billing/invoices - List all invoices (ADMIN, RECEPTIONIST)
    getInvoices: (params) => api.get('/billing/invoices', { params }),

    // POST /billing/invoices - Create a new invoice (ADMIN, RECEPTIONIST)
    createInvoice: (data) => api.post('/billing/invoices', data),

    // GET /billing/invoices/{id} - Get invoice details
    getInvoiceById: (id) => api.get(`/billing/invoices/${id}`),

    // GET /billing/invoices/patient/{id} - Get patient invoices (ADMIN, RECEPTIONIST)
    getPatientInvoices: (patientId) => api.get(`/billing/invoices/patient/${patientId}`),

    // POST /billing/payments - Record a payment for an invoice (ADMIN, RECEPTIONIST)
    recordPayment: (data) => api.post('/billing/payments', data)
};

// ===== Users API (for admin user management) =====
export const userAPI = {
    getAll: (params) => api.get('/users', { params }),
    getById: (id) => api.get(`/users/${id}`),
    create: (data) => api.post('/users', data),
    update: (id, data) => api.put(`/users/${id}`, data),
    delete: (id) => api.delete(`/users/${id}`),
    updateProfile: (data) => api.put('/users/profile', data),
    changePassword: (data) => api.post('/users/change-password', data)
};

// ===== Staff API =====
export const staffAPI = {
    getAll: (params) => api.get('/staff', { params }),
    getById: (id) => api.get(`/staff/${id}`),
    create: (data) => api.post('/staff', data),
    update: (id, data) => api.put(`/staff/${id}`, data),
    delete: (id) => api.delete(`/staff/${id}`)
};

// ===== Analytics/Reports API =====
export const analyticsAPI = {
    getDashboardStats: () => api.get('/analytics/dashboard'),
    getPatientStats: (params) => api.get('/analytics/patients', { params }),
    getAppointmentStats: (params) => api.get('/analytics/appointments', { params }),
    getRevenueStats: (params) => api.get('/analytics/revenue', { params })
};
