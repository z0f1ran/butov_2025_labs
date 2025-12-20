import { configureStore } from '@reduxjs/toolkit';
import postsReducer from '@/entities/post/model/postsSlice';
import usersReducer from '@/entities/user/model/usersSlice';
import uiReducer from '@/entities/ui/model/uiSlice';

export const store = configureStore({
  reducer: {
    posts: postsReducer,
    users: usersReducer,
    ui: uiReducer,
  },
  devTools: !!((import.meta as any).env && (import.meta as any).env.DEV),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
