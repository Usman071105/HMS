/**
 * API Utilities
 * Helper functions for handling API responses
 */

import { ERROR_MESSAGES } from '../constants';

/**
 * Extract data from standard API response
 * @param {Object} response - Axios response object
 * @returns {*} The data from the response
 * @throws {Error} If the response indicates failure
 */
export const extractData = (response) => {
    const { data } = response;

    if (data.success) {
        return data.data;
    }

    // Build error message from response
    let errorMessage = data.message || ERROR_MESSAGES.SERVER_ERROR;

    if (data.errors && data.errors.length > 0) {
        const fieldErrors = data.errors.map(err => `${err.field}: ${err.message}`).join(', ');
        errorMessage = `${errorMessage} (${fieldErrors})`;
    }

    throw new Error(errorMessage);
};

/**
 * Handle API errors consistently
 * @param {Error} error - The error object
 * @returns {string} User-friendly error message
 */
export const handleApiError = (error) => {
    if (error.response) {
        const { status, data } = error.response;

        switch (status) {
            case 400:
                return data?.message || ERROR_MESSAGES.VALIDATION_ERROR;
            case 401:
                return ERROR_MESSAGES.UNAUTHORIZED;
            case 403:
                return ERROR_MESSAGES.FORBIDDEN;
            case 404:
                return ERROR_MESSAGES.NOT_FOUND;
            case 500:
            default:
                return data?.message || ERROR_MESSAGES.SERVER_ERROR;
        }
    } else if (error.request) {
        return ERROR_MESSAGES.NETWORK_ERROR;
    }

    return error.message || ERROR_MESSAGES.SERVER_ERROR;
};

/**
 * Build query params for pagination and filtering
 * @param {Object} options - Query options
 * @param {number} options.page - Page number (0-indexed)
 * @param {number} options.size - Page size
 * @param {string} options.sort - Sort field
 * @param {string} options.direction - Sort direction (asc/desc)
 * @param {Object} options.filters - Additional filter params
 * @returns {Object} Query params object
 */
export const buildQueryParams = ({ page = 0, size = 10, sort, direction, filters = {} } = {}) => {
    const params = {
        page,
        size,
        ...filters
    };

    if (sort) {
        params.sort = direction ? `${sort},${direction}` : sort;
    }

    // Remove undefined/null values
    Object.keys(params).forEach(key => {
        if (params[key] === undefined || params[key] === null || params[key] === '') {
            delete params[key];
        }
    });

    return params;
};

/**
 * Format date for API requests (YYYY-MM-DD)
 * @param {Date|string} date - Date to format
 * @returns {string} Formatted date string
 */
export const formatDateForApi = (date) => {
    if (!date) return null;
    const d = new Date(date);
    return d.toISOString().split('T')[0];
};

/**
 * Format time for API requests (HH:mm)
 * @param {Date|string} time - Time to format
 * @returns {string} Formatted time string
 */
export const formatTimeForApi = (time) => {
    if (!time) return null;
    const d = new Date(time);
    return d.toTimeString().slice(0, 5);
};

/**
 * Parse ISO date string for display
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted display date
 */
export const formatDateForDisplay = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
};

/**
 * Parse time string for display
 * @param {string} timeString - Time string (HH:mm)
 * @returns {string} Formatted display time
 */
export const formatTimeForDisplay = (timeString) => {
    if (!timeString) return '-';
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
};

/**
 * Check if response is successful
 * @param {Object} response - API response
 * @returns {boolean} Whether the response indicates success
 */
export const isSuccess = (response) => {
    return response?.data?.success === true;
};

/**
 * Get error messages from response
 * @param {Object} response - API response
 * @returns {Array} Array of error messages
 */
export const getErrorMessages = (response) => {
    const errors = response?.data?.errors || [];
    return errors.map(err => err.message);
};
