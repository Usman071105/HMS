/**
 * Application Constants
 * Matches the backend Spring Boot enumerations and configurations
 */

// API Configuration
export const API_CONFIG = {
    BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1',
    SWAGGER_URL: 'http://localhost:8080/swagger-ui.html',
    API_DOCS_URL: 'http://localhost:8080/v3/api-docs',
    TIMEOUT: 15000
};

// User Roles - Must match backend Role enum
export const ROLES = {
    ADMIN: 'ADMIN',
    DOCTOR: 'DOCTOR',
    RECEPTIONIST: 'RECEPTIONIST',
    PATIENT: 'PATIENT'
};

// Appointment Status - Must match backend AppointmentStatus enum
export const APPOINTMENT_STATUS = {
    PENDING: 'PENDING',
    CONFIRMED: 'CONFIRMED',
    CANCELLED: 'CANCELLED',
    COMPLETED: 'COMPLETED',
    NOSHOW: 'NOSHOW'
};

// Appointment Status display configuration
export const APPOINTMENT_STATUS_CONFIG = {
    [APPOINTMENT_STATUS.PENDING]: {
        label: 'Pending',
        color: 'warning',
        bgColor: 'rgba(245, 158, 11, 0.15)'
    },
    [APPOINTMENT_STATUS.CONFIRMED]: {
        label: 'Confirmed',
        color: 'success',
        bgColor: 'rgba(16, 185, 129, 0.15)'
    },
    [APPOINTMENT_STATUS.CANCELLED]: {
        label: 'Cancelled',
        color: 'error',
        bgColor: 'rgba(239, 68, 68, 0.15)'
    },
    [APPOINTMENT_STATUS.COMPLETED]: {
        label: 'Completed',
        color: 'info',
        bgColor: 'rgba(59, 130, 246, 0.15)'
    },
    [APPOINTMENT_STATUS.NOSHOW]: {
        label: 'No Show',
        color: 'error',
        bgColor: 'rgba(239, 68, 68, 0.15)'
    }
};

// Gender - Must match backend Gender enum
export const GENDER = {
    MALE: 'MALE',
    FEMALE: 'FEMALE',
    OTHER: 'OTHER'
};

// Gender display labels
export const GENDER_LABELS = {
    [GENDER.MALE]: 'Male',
    [GENDER.FEMALE]: 'Female',
    [GENDER.OTHER]: 'Other'
};

// Blood Groups
export const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

// Invoice/Payment Status
export const INVOICE_STATUS = {
    PENDING: 'PENDING',
    PAID: 'PAID',
    PARTIAL: 'PARTIAL',
    CANCELLED: 'CANCELLED',
    OVERDUE: 'OVERDUE'
};

// Medical Record Types
export const RECORD_TYPES = {
    LAB_REPORT: 'LAB_REPORT',
    PRESCRIPTION: 'PRESCRIPTION',
    IMAGING: 'IMAGING',
    CONSULTATION_NOTES: 'CONSULTATION_NOTES',
    DISCHARGE_SUMMARY: 'DISCHARGE_SUMMARY'
};

// Role-based route prefixes
export const ROLE_ROUTES = {
    [ROLES.ADMIN]: '/admin',
    [ROLES.DOCTOR]: '/doctor',
    [ROLES.RECEPTIONIST]: '/receptionist',
    [ROLES.PATIENT]: '/patient'
};

// Role-based default redirects after login
export const ROLE_DEFAULT_ROUTES = {
    [ROLES.ADMIN]: '/admin',
    [ROLES.DOCTOR]: '/doctor',
    [ROLES.RECEPTIONIST]: '/receptionist',
    [ROLES.PATIENT]: '/patient'
};

// Pagination defaults
export const PAGINATION = {
    DEFAULT_PAGE: 0,
    DEFAULT_PAGE_SIZE: 10,
    PAGE_SIZE_OPTIONS: [5, 10, 20, 50, 100]
};

// Date/Time formats (for displaying dates from backend)
export const DATE_FORMATS = {
    DATE: 'yyyy-MM-dd',           // ISO format from backend
    TIME: 'HH:mm',                // 24-hour format from backend
    DATETIME: 'yyyy-MM-dd HH:mm',
    DISPLAY_DATE: 'MMM dd, yyyy',
    DISPLAY_TIME: 'hh:mm a',
    DISPLAY_DATETIME: 'MMM dd, yyyy hh:mm a'
};

// Specializations (common doctor specializations)
export const SPECIALIZATIONS = [
    'General Physician',
    'Cardiologist',
    'Dermatologist',
    'Orthopedic',
    'Pediatrician',
    'Neurologist',
    'Psychiatrist',
    'Gynecologist',
    'Ophthalmologist',
    'ENT Specialist',
    'Dentist',
    'Oncologist',
    'Radiologist',
    'Pathologist',
    'Anesthesiologist'
];

// Error messages
export const ERROR_MESSAGES = {
    NETWORK_ERROR: 'Network error - please check your connection',
    SERVER_ERROR: 'Server error occurred. Please try again later.',
    UNAUTHORIZED: 'Your session has expired. Please login again.',
    FORBIDDEN: 'You do not have permission to perform this action.',
    NOT_FOUND: 'The requested resource was not found.',
    VALIDATION_ERROR: 'Please check your input and try again.'
};

// Success messages
export const SUCCESS_MESSAGES = {
    LOGIN: 'Login successful!',
    LOGOUT: 'Logged out successfully.',
    SAVE: 'Changes saved successfully.',
    DELETE: 'Deleted successfully.',
    CREATE: 'Created successfully.',
    UPDATE: 'Updated successfully.'
};
