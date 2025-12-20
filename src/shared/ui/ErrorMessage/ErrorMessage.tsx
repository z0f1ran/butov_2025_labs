import './ErrorMessage.css';

interface ErrorMessageProps {
  error?: Error | { message: string } | null;
  message?: string;
  onRetry?: () => void;
}

export function ErrorMessage({ error, message, onRetry }: ErrorMessageProps) {
  const errorText = message || error?.message || 'Не удалось загрузить данные. Попробуйте еще раз.';

  return (
    <div className="error-container">
      <div className="error-icon">⚠️</div>
      <h3>Произошла ошибка</h3>
      <p className="error-text">{errorText}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn-retry">
          Попробовать снова
        </button>
      )}
    </div>
  );
}
