import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  successMessage: '',
  errorMessage: '',
  isFormVisible: false,
  theme: 'light',
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    // Управление сообщениями
    setSuccessMessage: (state, action) => {
      state.successMessage = action.payload;
      // Автоматически очищаем через 3 секунды (в компоненте)
    },
    clearSuccessMessage: (state) => {
      state.successMessage = '';
    },
    setErrorMessage: (state, action) => {
      state.errorMessage = action.payload;
    },
    clearErrorMessage: (state) => {
      state.errorMessage = '';
    },
    
    // Управление видимостью формы
    showForm: (state) => {
      state.isFormVisible = true;
    },
    hideForm: (state) => {
      state.isFormVisible = false;
    },
    toggleForm: (state) => {
      state.isFormVisible = !state.isFormVisible;
    },
    
    // Управление темой
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
    },
  },
});

export const {
  setSuccessMessage,
  clearSuccessMessage,
  setErrorMessage,
  clearErrorMessage,
  showForm,
  hideForm,
  toggleForm,
  setTheme,
  toggleTheme,
} = uiSlice.actions;

export default uiSlice.reducer;
