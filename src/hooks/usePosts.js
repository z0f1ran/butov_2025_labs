import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getPosts, createPost, updatePost, deletePost } from '../api';

// Query Keys - централизованное управление ключами
export const postKeys = {
  all: ['posts'],
  lists: () => [...postKeys.all, 'list'],
  list: (filters) => [...postKeys.lists(), { filters }],
  details: () => [...postKeys.all, 'detail'],
  detail: (id) => [...postKeys.details(), id],
};

/**
 * Хук для получения списка постов
 * @param {Object} options - опции запроса
 * @returns {Object} - результат запроса с данными, статусом загрузки и ошибкой
 */
export function usePosts(options = {}) {
  return useQuery({
    queryKey: postKeys.lists(),
    queryFn: async () => {
      const data = await getPosts();
      // Ограничиваем до 10 постов
      return data.slice(0, 10);
    },
    ...options,
  });
}

/**
 * Хук для создания нового поста с автоматическим обновлением кэша
 */
export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPost,
    
    // При успехе обновляем кэш с реальными данными
    onSuccess: (newPost) => {
      // Добавляем новый пост в начало списка
      queryClient.setQueryData(postKeys.lists(), (old) => {
        if (!old) return [newPost];
        // Заменяем временный пост (если был) на реальный
        return [newPost, ...old.filter(post => post.id !== newPost.id)];
      });
    },

    // При ошибке показываем сообщение
    onError: (err) => {
      console.error('Failed to create post:', err);
    },
  });
}

/**
 * Хук для обновления поста
 */
export function useUpdatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => updatePost(id, data),
    
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: postKeys.lists() });
      
      const previousPosts = queryClient.getQueryData(postKeys.lists());

      // Оптимистично обновляем пост в списке
      queryClient.setQueryData(postKeys.lists(), (old) => {
        if (!old) return [];
        return old.map((post) =>
          post.id === id ? { ...post, ...data } : post
        );
      });

      return { previousPosts };
    },

    onError: (err, variables, context) => {
      if (context?.previousPosts) {
        queryClient.setQueryData(postKeys.lists(), context.previousPosts);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: postKeys.lists() });
    },
  });
}

/**
 * Хук для удаления поста
 */
export function useDeletePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePost,
    
    onMutate: async (postId) => {
      await queryClient.cancelQueries({ queryKey: postKeys.lists() });
      
      const previousPosts = queryClient.getQueryData(postKeys.lists());

      // Оптимистично удаляем пост из списка
      queryClient.setQueryData(postKeys.lists(), (old) => {
        if (!old) return [];
        return old.filter((post) => post.id !== postId);
      });

      return { previousPosts };
    },

    onError: (err, postId, context) => {
      if (context?.previousPosts) {
        queryClient.setQueryData(postKeys.lists(), context.previousPosts);
      }
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postKeys.lists() });
    },
  });
}
