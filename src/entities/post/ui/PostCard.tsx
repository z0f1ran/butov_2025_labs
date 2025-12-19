import { useState, useEffect } from 'react';
import type { Post, UpdatePostDto } from '@/shared/types';
import './PostCard.css';

interface PostCardProps {
  post: Post;
  onDelete: (id: number) => void;
  onUpdate: (id: number, data: UpdatePostDto) => void;
  isDeleting?: boolean;
  isUpdating?: boolean;
}

export function PostCard({ 
  post, 
  onDelete, 
  onUpdate,
  isDeleting = false,
  isUpdating = false 
}: PostCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(post.title);
  const [editedBody, setEditedBody] = useState(post.body);

  useEffect(() => {
    setEditedTitle(post.title);
    setEditedBody(post.body);
  }, [post.title, post.body]);

  const handleUpdate = () => {
    onUpdate(post.id, {
      title: editedTitle,
      body: editedBody,
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
          disabled={isUpdating}
        />
        <textarea
          value={editedBody}
          onChange={(e) => setEditedBody(e.target.value)}
          className="edit-textarea"
          placeholder="Текст поста"
          rows={4}
          disabled={isUpdating}
        />
        <div className="button-group">
          <button 
            onClick={handleUpdate} 
            className="btn-save"
            disabled={isUpdating}
          >
            {isUpdating ? 'Сохранение...' : 'Сохранить'}
          </button>
          <button 
            onClick={handleCancel} 
            className="btn-cancel"
            disabled={isUpdating}
          >
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
        <button 
          onClick={() => setIsEditing(true)} 
          className="btn-edit"
          disabled={isDeleting}
        >
          Редактировать
        </button>
        <button 
          onClick={() => onDelete(post.id)} 
          className="btn-delete"
          disabled={isDeleting}
        >
          {isDeleting ? 'Удаление...' : 'Удалить'}
        </button>
      </div>
    </div>
  );
}
