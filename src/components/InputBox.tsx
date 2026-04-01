import React, { useRef, useEffect } from "react";
import { MAX_INPUT_LENGTH } from "../utils/constants";

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

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 500)}px`;
    }
  }, [value]);

  const charCount = value.length;
  const isNearLimit = charCount > MAX_INPUT_LENGTH * 0.9;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <label
          htmlFor="input-text"
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: "0.72rem",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            color: "#6b7280",
          }}
        >
          Your Text
        </label>
        <span
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: "0.72rem",
            fontWeight: 700,
            color: isNearLimit ? "#ef4444" : "#9ca3af",
          }}
        >
          {charCount} / {MAX_INPUT_LENGTH}
        </span>
      </div>

      <div style={{ position: "relative" }}>
        <textarea
          ref={textareaRef}
          id="input-text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Paste your text here..."
          disabled={disabled}
          maxLength={MAX_INPUT_LENGTH}
          style={{
            width: "100%",
            minHeight: "180px",
            resize: "none",
            fontFamily: "'Space Mono', monospace",
            fontSize: "0.9rem",
            padding: "0.875rem 1rem",
            paddingRight: value ? "5.5rem" : "1rem",
          }}
          aria-label="Input text for rewriting"
        />
        {value && (
          <button
            onClick={onClear}
            disabled={disabled}
            style={{
              position: "absolute",
              top: "0.75rem",
              right: "0.75rem",
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "0.72rem",
              fontWeight: 700,
              background: "#fff",
              color: "#0d0d0d",
              border: "2px solid #0d0d0d",
              borderRadius: "4px",
              padding: "0.2rem 0.625rem",
              cursor: "pointer",
              transition: "background 0.15s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#fee2e2")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#fff")}
            title="Clear input"
          >
            Clear
          </button>
        )}
      </div>

      <div style={{ fontSize: "0.78rem", color: "#9ca3af", display: "flex", gap: "1rem" }}>
        <span>Min 10 characters</span>
        <span>Max {MAX_INPUT_LENGTH} characters</span>
      </div>
    </div>
  );
}
