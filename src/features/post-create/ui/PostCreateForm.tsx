import { useState, FormEvent } from 'react';
import type { CreatePostDto } from '@/shared/types';
import './PostCreateForm.css';

interface PostCreateFormProps {
  onSubmit: (data: CreatePostDto) => void;
  isLoading?: boolean;
}

export function PostCreateForm({ onSubmit, isLoading = false }: PostCreateFormProps) {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !body.trim()) {
      alert('Пожалуйста, заполните все поля!');
      return;
    }

    onSubmit({
      title: title.trim(),
      body: body.trim(),
      userId: 1,
    });

    setTitle('');
    setBody('');
  };

  return (
    <form onSubmit={handleSubmit} className="post-form">
      <h2>Создать новый пост</h2>
      <div className="form-group">
        <label htmlFor="title">Заголовок</label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Введите заголовок поста"
          className="form-input"
          disabled={isLoading}
        />
      </div>
      <div className="form-group">
        <label htmlFor="body">Текст поста</label>
        <textarea
          id="body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Введите текст поста"
          className="form-textarea"
          rows={5}
          disabled={isLoading}
        />
      </div>
      <button type="submit" className="btn-submit" disabled={isLoading}>
        {isLoading ? 'Создание...' : 'Добавить пост'}
      </button>
    </form>
  );
}
