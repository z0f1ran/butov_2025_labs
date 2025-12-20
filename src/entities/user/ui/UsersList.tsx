import './UsersList.css';
import { useUsers } from '../../../store/hooks/useUsers';
import type { User } from '@/shared/types';

/**
 * UsersList - moved to entities layer (FSD)
 */
export function UsersList() {
  const { users, loading, error, autoRefresh, toggleAutoRefresh } = useUsers();

  const lastUpdated = new Date().toLocaleTimeString();

  if (loading && users.length === 0) {
    return (
      <div className="users-list">
        <div className="users-header">
          <h3>👥 Пользователи</h3>
        </div>
        <div className="loading-text">Загрузка пользователей...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="users-list">
        <div className="users-header">
          <h3>👥 Пользователи</h3>
        </div>
        <div className="error-text">Ошибка: {error}</div>
      </div>
    );
  }

  return (
    <div className="users-list">
      <div className="users-header">
        <h3>👥 Пользователей ({users.length})</h3>
        <label className="auto-refresh-toggle">
          <input type="checkbox" checked={autoRefresh} onChange={toggleAutoRefresh} />
          <span>Авто-обновление (30с)</span>
        </label>
      </div>

      {autoRefresh && <div className="last-updated">Обновлено: {lastUpdated}</div>}

      <div className="users-grid">
        {users.map((user: User) => (
          <div key={user.id} className="user-card">
            <div className="user-name">{user.name}</div>
            <div className="user-email">{user.email}</div>
            <div className="user-company">{user.company?.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default UsersList;
