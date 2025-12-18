import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useCallback } from 'react';
import {
  selectAllPosts,
  selectPostsLoading,
  selectPostsError,
  selectPostsCount,
} from '../selectors';
import {
  fetchPosts,
  createPost,
  updatePost,
  deletePost,
  clearError,
} from '../slices/postsSlice';
import { setSuccessMessage } from '../slices/uiSlice';

/**
 * Кастомный хук для работы с постами через Redux
 */
export function usePosts() {
  const dispatch = useDispatch();
  const posts = useSelector(selectAllPosts);
  const loading = useSelector(selectPostsLoading);
  const error = useSelector(selectPostsError);
  const count = useSelector(selectPostsCount);

  // Загрузка постов при монтировании
  useEffect(() => {
    if (posts.length === 0 && !loading) {
      dispatch(fetchPosts());
    }
  }, [dispatch, posts.length, loading]);

  const handleCreatePost = useCallback(
    async (postData) => {
      try {
        await dispatch(createPost(postData)).unwrap();
        dispatch(setSuccessMessage('Пост успешно создан!'));
      } catch (err) {
        console.error('Failed to create post:', err);
      }
    },
    [dispatch]
  );

  const handleUpdatePost = useCallback(
    async (id, data) => {
      try {
        await dispatch(updatePost({ id, data })).unwrap();
        dispatch(setSuccessMessage('Пост успешно обновлен!'));
      } catch (err) {
        console.error('Failed to update post:', err);
      }
    },
    [dispatch]
  );

  const handleDeletePost = useCallback(
    async (id) => {
      if (!window.confirm('Вы уверены, что хотите удалить этот пост?')) {
        return;
      }
      try {
        await dispatch(deletePost(id)).unwrap();
        dispatch(setSuccessMessage('Пост успешно удален!'));
      } catch (err) {
        console.error('Failed to delete post:', err);
      }
    },
    [dispatch]
  );

  const refetch = useCallback(() => {
    dispatch(fetchPosts());
  }, [dispatch]);

  const clearPostsError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  return {
    posts,
    loading,
    error,
    count,
    createPost: handleCreatePost,
    updatePost: handleUpdatePost,
    deletePost: handleDeletePost,
    refetch,
    clearError: clearPostsError,
  };
}
