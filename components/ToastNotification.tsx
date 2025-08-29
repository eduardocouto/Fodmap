import React from 'react';

interface ToastInfo {
  id: number;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

interface ToastNotificationProps {
  info: ToastInfo | null;
  onClose: () => void;
}

const ToastNotification: React.FC<ToastNotificationProps> = ({ info, onClose }) => {
  if (!info) {
    return null;
  }

  const handleActionClick = () => {
    if (info.onAction) {
      info.onAction();
    }
    onClose(); 
  };

  return (
    <div
      role="alert"
      aria-live="assertive"
      className="fixed bottom-5 right-5 z-50 w-full max-w-sm"
    >
      <div className="bg-gray-800 text-white rounded-lg shadow-lg p-4 flex items-center justify-between animate-fade-in-up">
        <div className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="font-medium text-sm">{info.message}</p>
        </div>
        <div className="flex items-center">
          {info.actionLabel && info.onAction && (
            <button
              onClick={handleActionClick}
              className="text-sm font-bold text-emerald-300 hover:text-emerald-200 transition-colors mr-3"
            >
              {info.actionLabel}
            </button>
          )}
          <button onClick={onClose} aria-label="Close notification" className="text-gray-400 hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
      {/* Fix: Replaced non-standard <style jsx> with a standard <style> tag to resolve TypeScript error. The `jsx` prop is not part of the standard style element attributes in React. */}
      <style>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default ToastNotification;