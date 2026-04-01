import React, { useRef, useEffect } from 'react';
import { MAX_INPUT_LENGTH } from '../utils/constants';

interface InputBoxProps {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
  disabled?: boolean;
}

export function InputBox({
  value,
  onChange,
  onClear,
  disabled = false,
}: InputBoxProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea based on content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        500
      )}px`;
    }
  }, [value]);

  const charCount = value.length;
  const isNearLimit = charCount > MAX_INPUT_LENGTH * 0.9;

  return (
    <div className="space-y-nb-md">
      <div className="flex items-center justify-between">
        <label htmlFor="input-text" className="text-nb-base nb-bold-text dark:text-nb-dark-text">
          Your Text
        </label>
        <span
          className={`text-nb-xs font-mono ${
            isNearLimit ? 'text-nb-accent font-black' : 'text-nb-grey dark:text-gray-400'
          }`}
        >
          {charCount} / {MAX_INPUT_LENGTH}
        </span>
      </div>

      <div className="relative">
        <textarea
          ref={textareaRef}
          id="input-text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Paste your text here..."
          disabled={disabled}
          maxLength={MAX_INPUT_LENGTH}
          className={`w-full px-nb-md py-nb-md border-nb-thick border-nb-black dark:border-nb-dark-text
            bg-nb-white dark:bg-nb-dark-surface text-nb-black dark:text-nb-dark-text
            font-mono text-nb-base placeholder-nb-grey dark:placeholder-gray-500
            focus:outline-none focus:ring-2 focus:ring-nb-accent focus:ring-offset-2
            dark:focus:ring-offset-nb-dark-bg
            disabled:opacity-50 disabled:cursor-not-allowed resize-none
            transition-all duration-200 min-h-[180px]`}
          aria-label="Input text for rewriting"
        />
        {value && (
          <button
            onClick={onClear}
            disabled={disabled}
            className="absolute top-nb-md right-nb-md px-nb-sm py-nb-xs
              bg-nb-black dark:bg-nb-accent text-nb-white dark:text-nb-dark-bg text-nb-xs font-black
              border-nb-thick border-nb-black dark:border-nb-accent hover:bg-nb-grey dark:hover:bg-nb-dark-text dark:hover:text-nb-accent
              transition-colors disabled:opacity-50"
            title="Clear input"
          >
            Clear
          </button>
        )}
      </div>

      <div className="text-nb-xs text-nb-grey dark:text-gray-400">
        • Min 10 characters • Max {MAX_INPUT_LENGTH} characters
      </div>
    </div>
  );
}
