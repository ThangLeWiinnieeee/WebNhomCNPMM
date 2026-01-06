/**
 * Custom Hook for Customer Management
 * Location: client/src/stores/hooks/useCustomerManagement.js
 */

import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchAllCustomers,
  fetchCustomerById,
  updateCustomer,
  deleteCustomer,
  fetchCustomerStats,
} from '../thunks/customerThunks';
import {
  setSearchQuery,
  setSortOptions,
  setCurrentPage,
  clearSelectedCustomer,
  clearErrors,
  clearActionError,
} from '../Slice/customerSlice';

/**
 * Hook to manage customer operations
 * @returns {Object} Customer state and actions
 */
export const useCustomerManagement = () => {
  const dispatch = useDispatch();
  const customerState = useSelector((state) => state.customer);

  // Fetch customers with filters
  const fetchCustomers = useCallback(
    (params = {}) => {
      const {
        page = customerState.pagination.currentPage,
        limit = customerState.pagination.limit,
        search = customerState.searchQuery,
        sortBy = customerState.sortBy,
        sortOrder = customerState.sortOrder,
      } = params;

      return dispatch(
        fetchAllCustomers({
          page,
          limit,
          search,
          sortBy,
          sortOrder,
        })
      );
    },
    [dispatch, customerState]
  );

  // Fetch customer by ID
  const fetchCustomer = useCallback(
    (customerId) => {
      return dispatch(fetchCustomerById(customerId));
    },
    [dispatch]
  );

  // Update customer
  const updateCustomerInfo = useCallback(
    (customerId, data) => {
      return dispatch(updateCustomer({ customerId, data }));
    },
    [dispatch]
  );

  // Delete customer
  const removeCustomer = useCallback(
    (customerId) => {
      return dispatch(deleteCustomer(customerId));
    },
    [dispatch]
  );

  // Fetch customer statistics
  const fetchStats = useCallback(() => {
    return dispatch(fetchCustomerStats());
  }, [dispatch]);

  // Set search query
  const setSearch = useCallback(
    (query) => {
      dispatch(setSearchQuery(query));
    },
    [dispatch]
  );

  // Set sort options
  const setSort = useCallback(
    (sortBy, sortOrder) => {
      dispatch(setSortOptions({ sortBy, sortOrder }));
    },
    [dispatch]
  );

  // Set current page
  const setPage = useCallback(
    (page) => {
      dispatch(setCurrentPage(page));
    },
    [dispatch]
  );

  // Clear selected customer
  const clearSelected = useCallback(() => {
    dispatch(clearSelectedCustomer());
  }, [dispatch]);

  // Clear all errors
  const clearAllErrors = useCallback(() => {
    dispatch(clearErrors());
  }, [dispatch]);

  // Clear action error
  const clearActionErr = useCallback(() => {
    dispatch(clearActionError());
  }, [dispatch]);

  return {
    // State
    ...customerState,

    // Actions
    fetchCustomers,
    fetchCustomer,
    updateCustomerInfo,
    removeCustomer,
    fetchStats,
    setSearch,
    setSort,
    setPage,
    clearSelected,
    clearAllErrors,
    clearActionErr,
  };
};

export default useCustomerManagement;
