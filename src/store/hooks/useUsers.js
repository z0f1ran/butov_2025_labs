import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useCallback } from 'react';
import {
  selectAllUsers,
  selectUsersLoading,
  selectUsersError,
  selectAutoRefresh,
  selectUsersCount,
} from '../selectors';
import {
  fetchUsers,
  toggleAutoRefresh as toggleAutoRefreshAction,
  clearError,
} from '../slices/usersSlice';

/**
 * Кастомный хук для работы с пользователями через Redux
 */
export function useUsers() {
  const dispatch = useDispatch();
  const users = useSelector(selectAllUsers);
  const loading = useSelector(selectUsersLoading);
  const error = useSelector(selectUsersError);
  const autoRefresh = useSelector(selectAutoRefresh);
  const count = useSelector(selectUsersCount);

  // Загрузка пользователей при монтировании
  useEffect(() => {
    if (users.length === 0 && !loading) {
      dispatch(fetchUsers());
    }
  }, [dispatch, users.length, loading]);

  // Автообновление каждые 30 секунд
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      dispatch(fetchUsers());
    }, 30000);

    return () => clearInterval(interval);
  }, [autoRefresh, dispatch]);

  const refetch = useCallback(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const toggleAutoRefresh = useCallback(() => {
    dispatch(toggleAutoRefreshAction());
  }, [dispatch]);

  const clearUsersError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  return {
    users,
    loading,
    error,
    autoRefresh,
    count,
    refetch,
    toggleAutoRefresh,
    clearError: clearUsersError,
  };
}
