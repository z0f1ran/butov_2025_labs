import { useState } from 'react'
import './App.css'
import PostForm from './components/PostForm'
import PostItem from './components/PostItem'
import LoadingSpinner from './components/LoadingSpinner'
import ErrorMessage from './components/ErrorMessage'
import UsersList from './components/UsersList'
import { usePosts, useCreatePost, useUpdatePost, useDeletePost } from './hooks/usePosts'

function App() {
  const [successMessage, setSuccessMessage] = useState('')

  // Используем React Query вместо useEffect + useState
  const { data: posts = [], isLoading, error, refetch } = usePosts()
  
  // Мутации с оптимистичными обновлениями
  const createPostMutation = useCreatePost()
  const updatePostMutation = useUpdatePost()
  const deletePostMutation = useDeletePost()

  // POST-запрос: Создание нового поста
  const handleCreatePost = async (newPost) => {
    try {
      await createPostMutation.mutateAsync(newPost)
      showSuccessMessage('Пост успешно создан!')
    } catch (err) {
      console.error('Failed to create post:', err)
    }
  }

  // PUT-запрос: Обновление поста
  const handleUpdatePost = async (id, updatedData) => {
    try {
      await updatePostMutation.mutateAsync({ id, data: updatedData })
      showSuccessMessage('Пост успешно обновлен!')
    } catch (err) {
      console.error('Failed to update post:', err)
    }
  }

  // DELETE-запрос: Удаление поста
  const handleDeletePost = async (id) => {
    if (!window.confirm('Вы уверены, что хотите удалить этот пост?')) {
      return
    }

    try {
      await deletePostMutation.mutateAsync(id)
      showSuccessMessage('Пост успешно удален!')
    } catch (err) {
      console.error('Failed to delete post:', err)
    }
  }

  const showSuccessMessage = (message) => {
    setSuccessMessage(message)
    setTimeout(() => setSuccessMessage(''), 3000)
  }

  // Проверяем, выполняется ли какая-либо мутация
  const isMutating = createPostMutation.isPending || 
                     updatePostMutation.isPending || 
                     deletePostMutation.isPending

  return (
    <div className="app">
      <header className="app-header">
        <h1>📝 Управление постами</h1>
        <p className="subtitle">Лабораторная работа №2: React Query</p>
      </header>

      <div className="container">
        {successMessage && (
          <div className="success-message">
            ✅ {successMessage}
          </div>
        )}

        {/* Список пользователей с автообновлением */}
        <UsersList />

        <PostForm onSubmit={handleCreatePost} />

        {error && <ErrorMessage error={error} onRetry={refetch} />}

        {isLoading && posts.length === 0 ? (
          <LoadingSpinner />
        ) : (
          <div className="posts-section">
            <div className="posts-header">
              <h2>Список постов ({posts.length})</h2>
              <button 
                onClick={() => refetch()} 
                className="btn-refresh"
                disabled={isLoading || isMutating}
              >
                🔄 Обновить {(isLoading || isMutating) && '...'}
              </button>
            </div>
            <div className="posts-list">
              {posts.map(post => (
                <PostItem
                  key={post.id}
                  post={post}
                  onDelete={handleDeletePost}
                  onUpdate={handleUpdatePost}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
