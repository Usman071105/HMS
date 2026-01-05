/**
 * useApi Hook
 * Custom hook for handling API calls with loading and error states
 */

import { useState, useCallback } from 'react';
import { handleApiError, extractData } from '../utils/apiHelpers';

/**
 * Hook for making API calls with loading and error state management
 * @returns {Object} API call utilities
 */
export function useApi() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    /**
     * Execute an API call with automatic loading and error handling
     * @param {Function} apiCall - The API function to call
     * @param {Object} options - Options for the call
     * @param {Function} options.onSuccess - Success callback
     * @param {Function} options.onError - Error callback
     * @param {boolean} options.extractData - Whether to extract data from response (default: true)
     * @returns {Promise<*>} The result of the API call
     */
    const execute = useCallback(async (apiCall, options = {}) => {
        const { onSuccess, onError, extractResponse = true } = options;

        setLoading(true);
        setError(null);

        try {
            const response = await apiCall();
            const result = extractResponse ? extractData(response) : response.data;

            if (onSuccess) {
                onSuccess(result);
            }

            return result;
        } catch (err) {
            const errorMessage = handleApiError(err);
            setError(errorMessage);

            if (onError) {
                onError(errorMessage, err);
            }

            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Clear current error
     */
    const clearError = useCallback(() => {
        setError(null);
    }, []);

    return {
        loading,
        error,
        execute,
        clearError
    };
}

/**
 * Hook for paginated API calls
 * @param {Function} fetchFunction - The API function to call
 * @param {Object} initialParams - Initial query parameters
 * @returns {Object} Pagination utilities
 */
export function usePaginatedApi(fetchFunction, initialParams = {}) {
    const [data, setData] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const { loading, error, execute, clearError } = useApi();

    const fetchData = useCallback(async (params = {}) => {
        const queryParams = {
            page: currentPage,
            size: pageSize,
            ...initialParams,
            ...params
        };

        const result = await execute(() => fetchFunction(queryParams));

        if (result) {
            setData(result.content || result);
            setTotalPages(result.totalPages || 1);
            setTotalElements(result.totalElements || result.length);
        }

        return result;
    }, [fetchFunction, currentPage, pageSize, initialParams, execute]);

    const goToPage = useCallback((page) => {
        setCurrentPage(page);
    }, []);

    const changePageSize = useCallback((size) => {
        setPageSize(size);
        setCurrentPage(0);
    }, []);

    const refresh = useCallback(() => {
        return fetchData();
    }, [fetchData]);

    return {
        data,
        loading,
        error,
        totalPages,
        totalElements,
        currentPage,
        pageSize,
        fetchData,
        goToPage,
        changePageSize,
        refresh,
        clearError
    };
}

export default useApi;
