import React from 'react';

interface ActionButtonProps {
  onClick: () => void;
  loading?: boolean;
  disabled?: boolean;
  label?: string;
}

export function ActionButton({
  onClick,
  loading = false,
  disabled = false,
  label = 'Generate',
}: ActionButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        fixed bottom-nb-lg right-nb-lg md:relative md:bottom-auto md:right-auto
        px-nb-lg py-nb-md border-nb-thick font-black text-nb-base
        transition-all duration-200 active:scale-95
        ${
          disabled || loading
            ? 'opacity-50 cursor-not-allowed'
            : 'cursor-pointer hover:scale-105'
        }
        ${
          disabled || loading
            ? 'bg-nb-grey dark:bg-gray-600 text-nb-white border-nb-grey dark:border-gray-600'
            : 'bg-nb-accent dark:bg-nb-accent text-nb-white dark:text-nb-dark-bg border-nb-accent dark:border-nb-accent hover:bg-nb-black dark:hover:bg-nb-dark-text hover:border-nb-black dark:hover:border-nb-dark-text dark:hover:text-nb-accent'
        }
        flex items-center justify-center gap-nb-sm
        min-w-[150px] shadow-lg md:shadow-none
      `}
      title={loading ? 'Generating...' : label}
      aria-busy={loading}
    >
      {loading && (
        <span className="inline-block w-4 h-4 border-nb-thick border-nb-white dark:border-nb-dark-bg border-t-nb-accent dark:border-t-nb-dark-text rounded-full animate-spin" />
      )}
      <span>{loading ? 'Generating...' : label}</span>
    </button>
  );
}
