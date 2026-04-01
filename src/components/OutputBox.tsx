import React, { useState } from "react";

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
    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <label
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: "0.72rem",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            color: "#1d4ed8",
          }}
        >
          AI Output
        </label>
        {result && (
          <button
            onClick={handleCopy}
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "0.72rem",
              fontWeight: 700,
              padding: "0.25rem 0.75rem",
              borderRadius: "4px",
              border: "2px solid #0d0d0d",
              cursor: "pointer",
              transition: "all 0.15s",
              background: copied ? "#1d4ed8" : "#fff",
              color: copied ? "#fff" : "#0d0d0d",
              boxShadow: copied ? "none" : "2px 2px 0px #0d0d0d",
            }}
            title="Copy to clipboard"
          >
            {copied ? (
              <span style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                Copied!
              </span>
            ) : (
              <span style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
                Copy
              </span>
            )}
          </button>
        )}
      </div>

      <div
        style={{
          minHeight: "180px",
          border: "2px solid",
          borderColor: result ? "#1d4ed8" : "#0d0d0d",
          borderRadius: "6px",
          padding: "1rem",
          background: result ? "#eff6ff" : "#f9fafb",
          position: "relative",
          display: "flex",
          alignItems: loading || error || !result ? "center" : "flex-start",
          justifyContent: loading || error || !result ? "center" : "flex-start",
          boxShadow: result ? "4px 4px 0px #1d4ed8" : "none",
          transition: "all 0.3s",
        }}
      >
        {loading && (
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                width: "32px",
                height: "32px",
                border: "3px solid #e5e7eb",
                borderTopColor: "#1d4ed8",
                borderRadius: "50%",
                margin: "0 auto 0.75rem",
              }}
              className="animate-spin"
            />
            <p style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: "0.8rem",
              fontWeight: 700,
              color: "#6b7280",
            }}>
              Generating...
            </p>
          </div>
        )}

        {error && !loading && (
          <div
            style={{
              background: "#fee2e2",
              border: "2px solid #ef4444",
              borderRadius: "6px",
              padding: "1rem",
              boxShadow: "3px 3px 0px #ef4444",
              width: "100%",
            }}
          >
            <p style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: "0.72rem",
              fontWeight: 700,
              textTransform: "uppercase",
              color: "#dc2626",
              marginBottom: "0.375rem",
            }}>Error</p>
            <p style={{ fontSize: "0.875rem", color: "#b91c1c" }}>{error}</p>
          </div>
        )}

        {result && !loading && !error && (
          <p style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: "0.9rem",
            lineHeight: 1.75,
            color: "#0d0d0d",
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
          }}>
            {result}
          </p>
        )}

        {!loading && !error && !result && (
          <p style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: "0.8rem",
            color: "#9ca3af",
            fontWeight: 700,
            letterSpacing: "0.03em",
          }}>
            Your rewritten text will appear here
          </p>
        )}
      </div>
    </div>
  );
}
