import { useState, useEffect } from 'react';

const Toast = ({ message, type = 'error', duration = 4000 }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(false), duration);
    return () => clearTimeout(timer);
  }, [duration]);

  if (!isVisible) return null;

  const bgColor = type === 'error' ? 'bg-red-500/20 border-red-500' : 'bg-green-500/20 border-green-500';
  const textColor = type === 'error' ? 'text-red-200' : 'text-green-200';

  return (
    <div className={`fixed top-4 right-4 ${bgColor} border ${textColor} p-4 rounded-lg shadow-lg max-w-sm z-50 animate-slide-in`}>
      <div className="flex items-center gap-3">
        <span className="text-lg">
          {type === 'error' ? '❌' : '✅'}
        </span>
        <span>{message}</span>
      </div>
    </div>
  );
};

export default Toast;
