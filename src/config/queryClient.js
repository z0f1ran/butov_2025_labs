import { QueryClient } from '@tanstack/react-query';

// Создание QueryClient с глобальной конфигурацией
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Время, в течение которого данные считаются "свежими" (не требуют обновления)
      staleTime: 1000 * 60 * 5, // 5 минут

      // Время хранения неактивных данных в кэше
      cacheTime: 1000 * 60 * 10, // 10 минут

      // Количество попыток повторного запроса при ошибке
      retry: 1,

      // Автоматический рефетч при восстановлении фокуса окна
      refetchOnWindowFocus: false,

      // Автоматический рефетч при восстановлении соединения
      refetchOnReconnect: true,
    },
    mutations: {
      // Количество попыток для мутаций
      retry: 0,

      // Обработчик ошибок для всех мутаций
      onError: (error) => {
        console.error('Mutation error:', error);
      },
    },
  },
});
