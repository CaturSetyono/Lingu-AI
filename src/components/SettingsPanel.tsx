import React, { useState } from "react";
import {
  TONE_OPTIONS,
  STYLE_OPTIONS,
  LANGUAGE_OPTIONS,
  LENGTH_OPTIONS,
} from "../utils/constants";
import type { Settings } from "../utils/types";

interface SettingsPanelProps {
  settings: Settings;
  onSettingsChange: (settings: Partial<Settings>) => void;
  disabled?: boolean;
}

const labelStyle: React.CSSProperties = {
  fontFamily: "'Space Mono', monospace",
  fontSize: "0.68rem",
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: "0.06em",
  color: "#6b7280",
  display: "block",
  marginBottom: "0.4rem",
};

const selectStyle: React.CSSProperties = {
  fontFamily: "'Space Grotesk', sans-serif",
  fontSize: "0.9rem",
  fontWeight: 600,
  background: "#ffffff",
  color: "#0d0d0d",
  border: "2px solid #0d0d0d",
  borderRadius: "6px",
  padding: "0.625rem 0.875rem",
  width: "100%",
  cursor: "pointer",
  appearance: "none",
  WebkitAppearance: "none",
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%230d0d0d' stroke-width='2.5'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right 0.875rem center",
  paddingRight: "2.5rem",
};

export function SettingsPanel({
  settings,
  onSettingsChange,
  disabled = false,
}: SettingsPanelProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleChange = (key: keyof Settings, value: any) => {
    onSettingsChange({ [key]: value });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
      {/* Toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0.875rem 1.125rem",
          background: isOpen ? "#eff6ff" : "#ffffff",
          color: isOpen ? "#1d4ed8" : "#0d0d0d",
          border: `2px solid ${isOpen ? "#1d4ed8" : "#0d0d0d"}`,
          borderRadius: "6px",
          boxShadow: isOpen ? "3px 3px 0px #1d4ed8" : "3px 3px 0px #0d0d0d",
          cursor: disabled ? "not-allowed" : "pointer",
          opacity: disabled ? 0.5 : 1,
          transition: "all 0.15s",
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: "0.9rem",
          fontWeight: 700,
        }}
        aria-expanded={isOpen}
      >
        <span style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="3"/>
            <path d="M19.07 4.93a10 10 0 010 14.14M4.93 4.93a10 10 0 000 14.14"/>
          </svg>
          Options & Settings
        </span>
        <svg
          width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
          style={{ transform: isOpen ? "rotate(180deg)" : "none", transition: "transform 0.25s" }}
        >
          <path d="M6 9l6 6 6-6"/>
        </svg>
      </button>

      {/* Panel */}
      {isOpen && (
        <div
          style={{
            border: "2px solid #0d0d0d",
            borderRadius: "6px",
            padding: "1.25rem",
            background: "#f9fafb",
            boxShadow: "4px 4px 0px #0d0d0d",
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          {/* 2-col grid for selects */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            {/* Tone */}
            <div>
              <label htmlFor="tone-select" style={labelStyle}>Tone</label>
              <select
                id="tone-select"
                value={settings.tone}
                onChange={(e) => handleChange("tone", e.target.value)}
                disabled={disabled}
                style={{ ...selectStyle, opacity: disabled ? 0.5 : 1 }}
                aria-label="Select tone"
              >
                {TONE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            {/* Style */}
            <div>
              <label htmlFor="style-select" style={labelStyle}>Style</label>
              <select
                id="style-select"
                value={settings.style}
                onChange={(e) => handleChange("style", e.target.value)}
                disabled={disabled}
                style={{ ...selectStyle, opacity: disabled ? 0.5 : 1 }}
                aria-label="Select style"
              >
                {STYLE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            {/* Language */}
            <div>
              <label htmlFor="language-select" style={labelStyle}>Language</label>
              <select
                id="language-select"
                value={settings.language}
                onChange={(e) => handleChange("language", e.target.value)}
                disabled={disabled}
                style={{ ...selectStyle, opacity: disabled ? 0.5 : 1 }}
                aria-label="Select language"
              >
                {LANGUAGE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            {/* Length */}
            <div>
              <label htmlFor="length-select" style={labelStyle}>Length</label>
              <select
                id="length-select"
                value={settings.length}
                onChange={(e) => handleChange("length", e.target.value)}
                disabled={disabled}
                style={{ ...selectStyle, opacity: disabled ? 0.5 : 1 }}
                aria-label="Select length"
              >
                {LENGTH_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Custom Prompt */}
          <div>
            <label htmlFor="custom-prompt" style={labelStyle}>
              Custom Instruction
              <span style={{ color: "#9ca3af", fontWeight: 400, marginLeft: "0.375rem", textTransform: "none", letterSpacing: 0 }}>(optional)</span>
            </label>
            <textarea
              id="custom-prompt"
              value={settings.customPrompt}
              onChange={(e) => handleChange("customPrompt", e.target.value)}
              disabled={disabled}
              placeholder="e.g. Keep it under 100 words, avoid jargon..."
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: "0.85rem",
                padding: "0.625rem 0.875rem",
                minHeight: "80px",
                resize: "none",
                opacity: disabled ? 0.5 : 1,
              }}
              aria-label="Custom prompt instructions"
            />
          </div>
        </div>
      )}
    </div>
  );
}
