import React, { useState } from 'react';

interface OutputBoxProps {
  result: string | null;
  loading?: boolean;
  error?: string | null;
  onCopy?: () => void;
}

export function OutputBox({
  result,
  loading = false,
  error = null,
  onCopy,
}: OutputBoxProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (result) {
      navigator.clipboard.writeText(result).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        if (onCopy) onCopy();
      });
    }
  };

  return (
    <div className="space-y-nb-md">
      <div className="flex items-center justify-between">
        <h2 className="text-nb-base nb-bold-text dark:text-nb-dark-text">Result</h2>
        {result && (
          <button
            onClick={handleCopy}
            className={`text-nb-xs font-black px-nb-sm py-nb-xs
              transition-all duration-200 ${
                copied
                  ? 'bg-nb-accent text-nb-white dark:text-nb-dark-bg border-nb-thick border-nb-accent'
                  : 'bg-nb-white dark:bg-nb-dark-surface text-nb-black dark:text-nb-dark-text border-nb-thick border-nb-black dark:border-nb-dark-text hover:bg-nb-grey dark:hover:bg-nb-accent hover:text-nb-white dark:hover:text-nb-dark-bg'
              }`}
            title="Copy to clipboard"
          >
            {copied ? '✓ Copied' : 'Copy'}
          </button>
        )}
      </div>

      <div className="relative min-h-[180px] border-nb-thick border-nb-black dark:border-nb-dark-text p-nb-md bg-nb-white dark:bg-nb-dark-surface">
        {loading && (
          <div className="flex items-center justify-center h-full">
            <div className="space-y-nb-md text-center">
              <div className="inline-block">
                <div
                  className="w-8 h-8 border-nb-thick border-nb-black border-t-nb-accent
                  rounded-full animate-spin"
                />
              </div>
              <p className="text-nb-sm nb-bold-text">Generating...</p>
            </div>
          </div>
        )}

        {error && !loading && (
          <div className="h-full flex items-center justify-center">
            <div
              className="bg-nb-grey dark:bg-nb-accent text-nb-white dark:text-nb-dark-bg p-nb-md border-nb-thick border-nb-accent dark:border-nb-accent
              space-y-nb-sm"
            >
              <p className="text-nb-sm nb-bold-text">Error</p>
              <p className="text-nb-sm">{error}</p>
            </div>
          </div>
        )}

        {result && !loading && !error && (
          <div className="prose prose-sm max-w-none dark:prose-invert">
            <p className="text-nb-base font-mono whitespace-pre-wrap break-words leading-relaxed text-nb-black dark:text-nb-dark-text">
              {result}
            </p>
          </div>
        )}

        {!loading && !error && !result && (
          <div className="h-full flex items-center justify-center">
            <p className="text-nb-sm text-nb-grey nb-bold-text">
              Your rewritten text will appear here
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
