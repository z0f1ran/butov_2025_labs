import { useQuery } from '@tanstack/react-query';
import { getPostComments } from '../api';

// Query Keys для комментариев
export const commentKeys = {
  all: ['comments'],
  byPost: (postId) => [...commentKeys.all, 'post', postId],
};

/**
 * Хук для получения комментариев поста
 * Пример зависимого запроса - enabled опция
 */
export function usePostComments(postId, options = {}) {
  return useQuery({
    queryKey: commentKeys.byPost(postId),
    queryFn: () => getPostComments(postId),
    // Запрос выполняется только если postId определен
    enabled: !!postId,
    staleTime: 1000 * 60 * 5, // 5 минут
    ...options,
  });
}
