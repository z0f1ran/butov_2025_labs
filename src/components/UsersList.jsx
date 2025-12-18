import { useState } from 'react';
import { useUsers } from '../hooks/useUsers';
import './UsersList.css';

/**
 * Компонент для демонстрации:
 * - Автоматического кэширования
 * - Автоматического обновления (refetchInterval)
 * - Select для оптимизации ре-рендеров
 */
function UsersList() {
  const [autoRefresh, setAutoRefresh] = useState(false);

  // Используем select для получения только необходимых данных
  const { data: users = [], isLoading, error, dataUpdatedAt } = useUsers({
    // Автоматическое обновление каждые 30 секунд (если включено)
    refetchInterval: autoRefresh ? 30000 : false,
    
    // Оптимизация: получаем только первые 5 пользователей
    select: (data) => data.slice(0, 5),
  });

  if (isLoading) {
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
        <div className="error-text">Ошибка загрузки пользователей</div>
      </div>
    );
  }

  return (
    <div className="users-list">
      <div className="users-header">
        <h3>👥 Пользователей ({users.length})</h3>
        <label className="auto-refresh-toggle">
          <input
            type="checkbox"
            checked={autoRefresh}
            onChange={(e) => setAutoRefresh(e.target.checked)}
          />
          <span>Авто-обновление (30с)</span>
        </label>
      </div>
      
      {dataUpdatedAt && (
        <div className="last-updated">
          Обновлено: {new Date(dataUpdatedAt).toLocaleTimeString()}
        </div>
      )}

      <div className="users-grid">
        {users.map((user) => (
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
