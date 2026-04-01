import React from "react";

interface ToastProps {
  message: string;
  type?: "success" | "error" | "info";
  onClose?: () => void;
}

export function Toast({ message, type = "info", onClose }: ToastProps) {
  return (
    <div
      className={`
        px-nb-lg py-nb-md border-nb-regular font-black text-nb-sm
        pointer-events-auto shadow-sm animation-slideUp rounded-nb
        max-w-sm
        ${
          type === "success"
            ? "bg-nb-bright dark:bg-nb-bright text-nb-white dark:text-nb-white border-nb-bright dark:border-nb-bright"
            : type === "error"
              ? "bg-nb-bright dark:bg-nb-bright text-nb-white dark:text-nb-white border-nb-bright dark:border-nb-bright"
              : "bg-nb-primary dark:bg-nb-primary text-nb-white dark:text-nb-white border-nb-primary dark:border-nb-primary"
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
