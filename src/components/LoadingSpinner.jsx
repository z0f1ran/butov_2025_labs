import './LoadingSpinner.css';

function LoadingSpinner() {
  return (
    <div className="loading-container">
      <div className="spinner"></div>
      <p>Загрузка данных...</p>
    </div>
  );
}

export default LoadingSpinner;
