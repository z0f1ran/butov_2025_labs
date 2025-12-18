import { useDispatch, useSelector } from 'react-redux';
import { useCallback, useEffect } from 'react';
import {
  selectSuccessMessage,
  selectErrorMessage,
  selectIsFormVisible,
  selectTheme,
} from '../selectors';
import {
  setSuccessMessage,
  clearSuccessMessage,
  setErrorMessage,
  clearErrorMessage,
  toggleForm,
  toggleTheme,
} from '../slices/uiSlice';

/**
 * Кастомный хук для управления UI состоянием через Redux
 */
export function useUI() {
  const dispatch = useDispatch();
  const successMessage = useSelector(selectSuccessMessage);
  const errorMessage = useSelector(selectErrorMessage);
  const isFormVisible = useSelector(selectIsFormVisible);
  const theme = useSelector(selectTheme);

  // Автоматическое скрытие success message через 3 секунды
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        dispatch(clearSuccessMessage());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, dispatch]);

  const showSuccess = useCallback(
    (message) => {
      dispatch(setSuccessMessage(message));
    },
    [dispatch]
  );

  const showError = useCallback(
    (message) => {
      dispatch(setErrorMessage(message));
    },
    [dispatch]
  );

  const clearError = useCallback(() => {
    dispatch(clearErrorMessage());
  }, [dispatch]);

  const toggleFormVisibility = useCallback(() => {
    dispatch(toggleForm());
  }, [dispatch]);

  const switchTheme = useCallback(() => {
    dispatch(toggleTheme());
  }, [dispatch]);

  return {
    successMessage,
    errorMessage,
    isFormVisible,
    theme,
    showSuccess,
    showError,
    clearError,
    toggleForm: toggleFormVisibility,
    toggleTheme: switchTheme,
  };
}
