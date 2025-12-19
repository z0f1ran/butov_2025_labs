import './App.css';
import PostForm from './components/PostForm';
import PostItem from './components/PostItem';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';
import UsersList from './components/UsersList';
import { usePosts } from './store/hooks/usePosts';
import { useUI } from './store/hooks/useUI';

function App() {
  const { posts, loading, error, count, createPost, updatePost, deletePost, refetch } = usePosts();

  const { successMessage } = useUI();

  return (
    <div className="app">
      <header className="app-header">
        <h1>📝 Управление постами</h1>
        <p className="subtitle">Лабораторная работа №3: Redux Toolkit</p>
      </header>

      <div className="container">
        {successMessage && <div className="success-message">✅ {successMessage}</div>}

        {/* Список пользователей с автообновлением */}
        <UsersList />

        <PostForm onSubmit={createPost} />

        {error && <ErrorMessage error={{ message: error }} onRetry={refetch} />}

        {loading && posts.length === 0 ? (
          <LoadingSpinner />
        ) : (
          <div className="posts-section">
            <div className="posts-header">
              <h2>Список постов ({count})</h2>
              <button onClick={refetch} className="btn-refresh" disabled={loading}>
                🔄 Обновить {loading && '...'}
              </button>
            </div>
            <div className="posts-list">
              {posts.map((post) => (
                <PostItem key={post.id} post={post} onDelete={deletePost} onUpdate={updatePost} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
