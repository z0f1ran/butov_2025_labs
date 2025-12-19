import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { usersApi } from '@/shared/api';
import type { User } from '@/shared/types';

interface UsersState {
  items: User[];
  currentUser: User | null;
  loading: boolean;
  error: string | null;
  autoRefresh: boolean;
}

// Async Thunks
export const fetchUsers = createAsyncThunk('users/fetchUsers', async (_, { rejectWithValue }) => {
  try {
    const data = await usersApi.getUsers();
    return data.slice(0, 5); // Ограничиваем до 5 пользователей
  } catch (error) {
    return rejectWithValue((error as Error).message);
  }
});

export const fetchUserById = createAsyncThunk(
  'users/fetchUserById',
  async (userId: number, { rejectWithValue }) => {
    try {
      const data = await usersApi.getUserById(userId);
      return data;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

const initialState: UsersState = {
  items: [],
  currentUser: null,
  loading: false,
  error: null,
  autoRefresh: false,
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    // Синхронные действия
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload;
    },
    clearCurrentUser: (state) => {
      state.currentUser = null;
    },
    toggleAutoRefresh: (state) => {
      state.autoRefresh = !state.autoRefresh;
    },
    setAutoRefresh: (state, action) => {
      state.autoRefresh = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Users
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch User By ID
    builder
      .addCase(fetchUserById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setCurrentUser, clearCurrentUser, toggleAutoRefresh, setAutoRefresh, clearError } =
  usersSlice.actions;

export default usersSlice.reducer;
