import { useState } from 'react';
import './PostForm.css';

function PostForm({ onSubmit }) {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title.trim() || !body.trim()) {
      alert('Пожалуйста, заполните все поля!');
      return;
    }

    onSubmit({
      title: title.trim(),
      body: body.trim(),
      userId: 1, // Статичный userId для примера
    });

    // Очищаем форму после отправки
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
          rows="5"
        />
      </div>
      <button type="submit" className="btn-submit">
        Добавить пост
      </button>
    </form>
  );
}

export default PostForm;
