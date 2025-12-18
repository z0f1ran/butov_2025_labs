import { useState, useEffect } from 'react';
import './PostItem.css';

function PostItem({ post, onDelete, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(post.title);
  const [editedBody, setEditedBody] = useState(post.body);

  // Обновляем локальное состояние когда пост меняется
  useEffect(() => {
    setEditedTitle(post.title);
    setEditedBody(post.body);
  }, [post.title, post.body]);

  const handleUpdate = () => {
    onUpdate(post.id, {
      title: editedTitle,
      body: editedBody,
      userId: post.userId,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedTitle(post.title);
    setEditedBody(post.body);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="post-item editing">
        <input
          type="text"
          value={editedTitle}
          onChange={(e) => setEditedTitle(e.target.value)}
          className="edit-input"
          placeholder="Заголовок"
        />
        <textarea
          value={editedBody}
          onChange={(e) => setEditedBody(e.target.value)}
          className="edit-textarea"
          placeholder="Текст поста"
          rows="4"
        />
        <div className="button-group">
          <button onClick={handleUpdate} className="btn-save">
            Сохранить
          </button>
          <button onClick={handleCancel} className="btn-cancel">
            Отмена
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="post-item">
      <h3>{post.title}</h3>
      <p>{post.body}</p>
      <div className="post-meta">
        <span className="post-id">ID: {post.id}</span>
        <span className="user-id">User: {post.userId}</span>
      </div>
      <div className="button-group">
        <button onClick={() => setIsEditing(true)} className="btn-edit">
          Редактировать
        </button>
        <button onClick={() => onDelete(post.id)} className="btn-delete">
          Удалить
        </button>
      </div>
    </div>
  );
}

export default PostItem;
