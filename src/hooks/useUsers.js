import { useQuery } from '@tanstack/react-query';
import { getUsers, getUserById } from '../api';

// Query Keys для пользователей
export const userKeys = {
  all: ['users'],
  lists: () => [...userKeys.all, 'list'],
  details: () => [...userKeys.all, 'detail'],
  detail: (id) => [...userKeys.details(), id],
};

/**
 * Хук для получения списка пользователей
 */
export function useUsers(options = {}) {
  return useQuery({
    queryKey: userKeys.lists(),
    queryFn: getUsers,
    // Данные пользователей обновляются редко
    staleTime: 1000 * 60 * 10, // 10 минут
    ...options,
  });
}

/**
 * Хук для получения одного пользователя по ID
 * Пример зависимого запроса - выполняется только если есть userId
 */
export function useUser(userId, options = {}) {
  return useQuery({
    queryKey: userKeys.detail(userId),
    queryFn: () => getUserById(userId),
    // Запрос выполняется только если userId определен
    enabled: !!userId,
    staleTime: 1000 * 60 * 10,
    ...options,
  });
}
