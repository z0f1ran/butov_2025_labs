import './ErrorMessage.css';

function ErrorMessage({ error, onRetry }) {
  return (
    <div className="error-container">
      <div className="error-icon">⚠️</div>
      <h3>Произошла ошибка</h3>
      <p className="error-text">
        {error?.message || 'Не удалось загрузить данные. Попробуйте еще раз.'}
      </p>
      {onRetry && (
        <button onClick={onRetry} className="btn-retry">
          Попробовать снова
        </button>
      )}
    </div>
  );
}

export default ErrorMessage;
