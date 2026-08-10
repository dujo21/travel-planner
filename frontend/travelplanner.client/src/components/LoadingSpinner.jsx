export default function LoadingSpinner({ text = 'Učitavanje...' }) {
  return (
    <div className="spinner-container">
      <div className="spinner"></div>
      <span>{text}</span>
    </div>
  );
}