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
    
    // Оптимистичное обновление
    onMutate: async (newPost) => {
      // Отменяем текущие запросы для списка постов
      await queryClient.cancelQueries({ queryKey: postKeys.lists() });

      // Сохраняем предыдущее состояние для rollback
      const previousPosts = queryClient.getQueryData(postKeys.lists());

      // Оптимистично обновляем кэш
      queryClient.setQueryData(postKeys.lists(), (old) => {
        if (!old) return [newPost];
        return [{ ...newPost, id: Date.now() }, ...old];
      });

      return { previousPosts };
    },

    // При ошибке откатываем изменения
    onError: (err, newPost, context) => {
      if (context?.previousPosts) {
        queryClient.setQueryData(postKeys.lists(), context.previousPosts);
      }
    },

    // После завершения (успех или ошибка) инвалидируем кэш
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: postKeys.lists() });
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
