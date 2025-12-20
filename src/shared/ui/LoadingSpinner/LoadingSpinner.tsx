import './LoadingSpinner.css';

interface LoadingSpinnerProps {
  message?: string;
}

export function LoadingSpinner({ message = 'Загрузка данных...' }: LoadingSpinnerProps) {
  return (
    <div className="loading-container">
      <div className="spinner"></div>
      <p>{message}</p>
    </div>
  );
}
