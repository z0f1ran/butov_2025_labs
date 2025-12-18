import { configureStore } from '@reduxjs/toolkit';
import postsReducer from './slices/postsSlice';
import usersReducer from './slices/usersSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    posts: postsReducer,
    users: usersReducer,
    ui: uiReducer,
  },
  // DevTools автоматически включены в development режиме
  devTools: process.env.NODE_ENV !== 'production',
});

// Типы для TypeScript (можно использовать и в JS через JSDoc)
export const getState = () => store.getState();
export const dispatch = (action) => store.dispatch(action);

// Экспорт типов для использования в хуках
export const selectPosts = (state) => state.posts;
export const selectUsers = (state) => state.users;
export const selectUI = (state) => state.ui;
