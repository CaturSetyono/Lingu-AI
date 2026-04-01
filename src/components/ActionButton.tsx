import React from "react";

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
  label = "Generate",
}: ActionButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <button
      onClick={onClick}
      disabled={isDisabled}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.5rem",
        fontFamily: "'Space Grotesk', sans-serif",
        fontSize: "1rem",
        fontWeight: 700,
        padding: "0.875rem 2.5rem",
        borderRadius: "6px",
        border: "2px solid #0d0d0d",
        background: isDisabled ? "#9ca3af" : "#1d4ed8",
        color: "#fff",
        boxShadow: isDisabled ? "none" : "4px 4px 0px #0d0d0d",
        cursor: isDisabled ? "not-allowed" : "pointer",
        opacity: isDisabled ? 0.6 : 1,
        transition: "transform 0.1s, box-shadow 0.1s",
        /* Mobile: fixed bottom */
        position: undefined,
      }}
      onMouseEnter={(e) => {
        if (!isDisabled) {
          e.currentTarget.style.transform = "translate(-2px, -2px)";
          e.currentTarget.style.boxShadow = "6px 6px 0px #0d0d0d";
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "none";
        e.currentTarget.style.boxShadow = isDisabled ? "none" : "4px 4px 0px #0d0d0d";
      }}
      onMouseDown={(e) => {
        if (!isDisabled) {
          e.currentTarget.style.transform = "translate(2px, 2px)";
          e.currentTarget.style.boxShadow = "2px 2px 0px #0d0d0d";
        }
      }}
      onMouseUp={(e) => {
        if (!isDisabled) {
          e.currentTarget.style.transform = "translate(-2px, -2px)";
          e.currentTarget.style.boxShadow = "6px 6px 0px #0d0d0d";
        }
      }}
      title={loading ? "Generating..." : label}
      aria-busy={loading}
    >
      {loading ? (
        <>
          <span
            style={{
              display: "inline-block",
              width: "18px",
              height: "18px",
              border: "2.5px solid rgba(255,255,255,0.4)",
              borderTopColor: "#fff",
              borderRadius: "50%",
            }}
            className="animate-spin"
          />
          Generating...
        </>
      ) : (
        <>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
          </svg>
          {label}
        </>
      )}
    </button>
  );
}
