import type { User } from '@/shared/types';

export function useUsers(): {
  users: User[];
  loading: boolean;
  error: string | null;
  autoRefresh: boolean;
  count: number;
  refetch: () => void;
  toggleAutoRefresh: () => void;
  clearError: () => void;
};
