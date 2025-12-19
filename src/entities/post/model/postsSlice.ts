import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { postsApi } from '@/shared/api';
import type { Post, CreatePostDto, UpdatePostDto } from '@/shared/types';

interface PostsState {
  items: Post[];
  loading: boolean;
  error: string | null;
  currentPost: Post | null;
}

// Async Thunks для работы с API
export const fetchPosts = createAsyncThunk('posts/fetchPosts', async (_, { rejectWithValue }) => {
  try {
    const data = await postsApi.getPosts();
    return data.slice(0, 10); // Ограничиваем до 10 постов
  } catch (error) {
    return rejectWithValue((error as Error).message);
  }
});

export const createPost = createAsyncThunk(
  'posts/createPost',
  async (postData: CreatePostDto, { rejectWithValue }) => {
    try {
      const data = await postsApi.createPost(postData);
      return data;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const updatePost = createAsyncThunk(
  'posts/updatePost',
  async ({ id, data }: { id: number; data: UpdatePostDto }, { rejectWithValue }) => {
    try {
      const updatedPost = await postsApi.updatePost(id, data);
      return updatedPost;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const deletePost = createAsyncThunk(
  'posts/deletePost',
  async (postId: number, { rejectWithValue }) => {
    try {
      await postsApi.deletePost(postId);
      return postId;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

const initialState: PostsState = {
  items: [],
  loading: false,
  error: null,
  currentPost: null,
};

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    // Синхронные действия
    setCurrentPost: (state, action) => {
      state.currentPost = action.payload;
    },
    clearCurrentPost: (state) => {
      state.currentPost = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    // Оптимистичное добавление поста (для мгновенного UI)
    addPostOptimistic: (state, action) => {
      state.items.unshift(action.payload);
    },
    // Удаление оптимистичного поста при ошибке
    removePostOptimistic: (state, action) => {
      state.items = state.items.filter((post) => post.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    // Fetch Posts
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Create Post
    builder
      .addCase(createPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.loading = false;
        // Добавляем пост в начало списка
        state.items.unshift(action.payload);
      })
      .addCase(createPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Update Post
    builder
      .addCase(updatePost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex((post) => post.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(updatePost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Delete Post
    builder
      .addCase(deletePost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter((post) => post.id !== action.payload);
      })
      .addCase(deletePost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setCurrentPost,
  clearCurrentPost,
  clearError,
  addPostOptimistic,
  removePostOptimistic,
} = postsSlice.actions;

export default postsSlice.reducer;
