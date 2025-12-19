import { createSelector } from '@reduxjs/toolkit';

// Базовые селекторы
export const selectPostsState = (state) => state.posts;
export const selectUsersState = (state) => state.users;
export const selectUIState = (state) => state.ui;

// Posts селекторы
export const selectAllPosts = (state) => state.posts.items;
export const selectPostsLoading = (state) => state.posts.loading;
export const selectPostsError = (state) => state.posts.error;
export const selectCurrentPost = (state) => state.posts.currentPost;

// Мемоизированный селектор: количество постов
export const selectPostsCount = createSelector([selectAllPosts], (posts) => posts.length);

// Мемоизированный селектор: посты с фильтром по userId
export const selectPostsByUserId = createSelector(
  [selectAllPosts, (state, userId) => userId],
  (posts, userId) => posts.filter((post) => post.userId === userId)
);

// Мемоизированный селектор: поиск постов по тексту
export const selectFilteredPosts = createSelector(
  [selectAllPosts, (state, searchQuery) => searchQuery],
  (posts, searchQuery) => {
    if (!searchQuery) return posts;
    const query = searchQuery.toLowerCase();
    return posts.filter(
      (post) => post.title.toLowerCase().includes(query) || post.body.toLowerCase().includes(query)
    );
  }
);

// Users селекторы
export const selectAllUsers = (state) => state.users.items;
export const selectUsersLoading = (state) => state.users.loading;
export const selectUsersError = (state) => state.users.error;
export const selectCurrentUser = (state) => state.users.currentUser;
export const selectAutoRefresh = (state) => state.users.autoRefresh;

// Мемоизированный селектор: количество пользователей
export const selectUsersCount = createSelector([selectAllUsers], (users) => users.length);

// Мемоизированный селектор: имена пользователей
export const selectUserNames = createSelector([selectAllUsers], (users) =>
  users.map((user) => ({ id: user.id, name: user.name }))
);

// UI селекторы
export const selectSuccessMessage = (state) => state.ui.successMessage;
export const selectErrorMessage = (state) => state.ui.errorMessage;
export const selectIsFormVisible = (state) => state.ui.isFormVisible;
export const selectTheme = (state) => state.ui.theme;

// Комбинированный мемоизированный селектор
export const selectPostsWithUserInfo = createSelector(
  [selectAllPosts, selectAllUsers],
  (posts, users) => {
    return posts.map((post) => {
      const user = users.find((u) => u.id === post.userId);
      return {
        ...post,
        userName: user?.name || 'Unknown',
        userEmail: user?.email || '',
      };
    });
  }
);
