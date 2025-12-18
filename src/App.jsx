import { useState, useEffect } from 'react'
import './App.css'
import { getPosts, createPost, updatePost, deletePost } from './api'
import PostForm from './components/PostForm'
import PostItem from './components/PostItem'
import LoadingSpinner from './components/LoadingSpinner'
import ErrorMessage from './components/ErrorMessage'

function App() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [successMessage, setSuccessMessage] = useState('')

  // GET-запрос: Загрузка постов при монтировании компонента
  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getPosts()
      // Ограничиваем до 10 постов для удобства просмотра
      setPosts(data.slice(0, 10))
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }

  // POST-запрос: Создание нового поста
  const handleCreatePost = async (newPost) => {
    try {
      setLoading(true)
      const createdPost = await createPost(newPost)
      // Добавляем новый пост в начало списка
      setPosts([createdPost, ...posts])
      showSuccessMessage('Пост успешно создан!')
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }

  // PUT-запрос: Обновление поста
  const handleUpdatePost = async (id, updatedData) => {
    try {
      setLoading(true)
      const updatedPost = await updatePost(id, updatedData)
      setPosts(posts.map(post => post.id === id ? updatedPost : post))
      showSuccessMessage('Пост успешно обновлен!')
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }

  // DELETE-запрос: Удаление поста
  const handleDeletePost = async (id) => {
    if (!window.confirm('Вы уверены, что хотите удалить этот пост?')) {
      return
    }

    try {
      setLoading(true)
      await deletePost(id)
      setPosts(posts.filter(post => post.id !== id))
      showSuccessMessage('Пост успешно удален!')
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }

  const showSuccessMessage = (message) => {
    setSuccessMessage(message)
    setTimeout(() => setSuccessMessage(''), 3000)
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>📝 Управление постами</h1>
        <p className="subtitle">Лабораторная работа: HTTP-методы в React</p>
      </header>

      <div className="container">
        {successMessage && (
          <div className="success-message">
            ✅ {successMessage}
          </div>
        )}

        <PostForm onSubmit={handleCreatePost} />

        {error && <ErrorMessage error={error} onRetry={fetchPosts} />}

        {loading && posts.length === 0 ? (
          <LoadingSpinner />
        ) : (
          <div className="posts-section">
            <div className="posts-header">
              <h2>Список постов ({posts.length})</h2>
              <button onClick={fetchPosts} className="btn-refresh">
                🔄 Обновить
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
