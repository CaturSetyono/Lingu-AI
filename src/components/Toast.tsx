import React from 'react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose?: () => void;
}

export function Toast({
  message,
  type = 'info',
  onClose,
}: ToastProps) {
  return (
    <div
      className={`
        px-nb-lg py-nb-md border-nb-thick font-black text-nb-sm
        pointer-events-auto shadow-xl animation-slideUp
        max-w-sm
        ${
          type === 'success'
            ? 'bg-nb-black dark:bg-nb-accent text-nb-white dark:text-nb-dark-bg border-nb-accent dark:border-nb-accent'
            : type === 'error'
              ? 'bg-nb-grey dark:bg-nb-accent text-nb-white dark:text-nb-dark-bg border-nb-accent dark:border-nb-accent'
              : 'bg-nb-black dark:bg-nb-dark-surface text-nb-white dark:text-nb-dark-text border-nb-secondary dark:border-nb-dark-text'
        }
      `}
      role="alert"
    >
      <div className="flex items-center justify-between gap-nb-md">
        <span>{message}</span>
        {onClose && (
          <button
            onClick={onClose}
            className="ml-nb-md font-black hover:opacity-50 transition-opacity"
            aria-label="Close notification"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
}
