import React, { useState, useEffect } from "react";
import { InputBox } from "./InputBox";
import { SettingsPanel } from "./SettingsPanel";
import { OutputBox } from "./OutputBox";
import { ActionButton } from "./ActionButton";
import { initializeStorage, saveSettings, getSettings } from "../utils/storage";
import { Toast } from "./Toast";
import type { Settings, GenerateRequest } from "../utils/types";

type ToastType = "success" | "error" | "info";

interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
}

export function App() {
  // State management
  const [settings, setSettings] = useState<Settings | null>(null);
  const [inputText, setInputText] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Initialize settings from localStorage on mount
  useEffect(() => {
    const initialSettings = initializeStorage();
    setSettings(initialSettings);
    setInputText(initialSettings.lastInput || "");
  }, []);

  // Add toast notification
  const showToast = (message: string, type: ToastType = "info") => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  // Handle setting changes
  const handleSettingsChange = (newSettings: Partial<Settings>) => {
    if (!settings) return;
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    saveSettings(newSettings);
  };

  // Handle input change
  const handleInputChange = (text: string) => {
    setInputText(text);
    // Auto-save last input
    saveSettings({ lastInput: text });
  };

  // Handle clear input
  const handleClearInput = () => {
    setInputText("");
    setResult(null);
    setError(null);
    saveSettings({ lastInput: "" });
  };

  // Handle generate
  const handleGenerate = async () => {
    if (!settings) return;

    // Validation
    if (!inputText.trim()) {
      showToast("Please enter text to rewrite", "error");
      return;
    }

    if (inputText.trim().length < 10) {
      showToast("Text must be at least 10 characters", "error");
      return;
    }

    if (inputText.length > 5000) {
      showToast("Text must not exceed 5000 characters", "error");
      return;
    }

    // Start loading
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const payload: GenerateRequest = {
        text: inputText,
        tone: settings.tone,
        style: settings.style,
        language: settings.language,
        length: settings.length,
        customPrompt: settings.customPrompt || undefined,
      };

      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      console.log("API Response Status:", response.status);

      if (!response.ok) {
        console.error(
          "API Error Response:",
          response.status,
          response.statusText,
        );
        const errorData = await response
          .json()
          .catch(() => ({ error: "Failed to parse error response" }));
        console.error("Error Data:", errorData);
        throw new Error(
          errorData.error || `HTTP ${response.status}: Failed to generate text`,
        );
      }

      const data = await response.json();
      console.log("API Success Response:", data);

      if (data.success && data.result) {
        setResult(data.result);
        showToast("Text rewritten successfully!", "success");
      } else {
        throw new Error(data.error || "Unknown error occurred");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An error occurred";
      console.error("Generation error details:", err);
      setError(errorMessage);
      showToast(errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  // Don't render until settings are initialized
  if (!settings) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "50vh" }}>
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: "36px", height: "36px",
              border: "3px solid #e5e7eb",
              borderTopColor: "#1d4ed8",
              borderRadius: "50%",
              margin: "0 auto 0.875rem",
            }}
            className="animate-spin"
          />
          <p style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.8rem", fontWeight: 700, color: "#6b7280" }}>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* App layout */}
      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

        {/* Input */}
        <div style={{
          background: "#fff",
          border: "2px solid #0d0d0d",
          borderRadius: "8px",
          padding: "1.5rem",
          boxShadow: "4px 4px 0px #0d0d0d",
        }}>
          <InputBox
            value={inputText}
            onChange={handleInputChange}
            onClear={handleClearInput}
            disabled={loading}
          />
        </div>

        {/* Settings */}
        <SettingsPanel
          settings={settings}
          onSettingsChange={handleSettingsChange}
          disabled={loading}
        />

        {/* Generate button */}
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <ActionButton
            onClick={handleGenerate}
            loading={loading}
            disabled={!inputText.trim() || loading}
            label="Generate"
          />
        </div>

        {/* Output */}
        <div style={{
          background: "#fff",
          border: "2px solid #0d0d0d",
          borderRadius: "8px",
          padding: "1.5rem",
          boxShadow: result ? "4px 4px 0px #1d4ed8" : "4px 4px 0px #0d0d0d",
          transition: "box-shadow 0.3s",
        }}>
          <OutputBox
            result={result}
            loading={loading}
            error={error}
            onCopy={() => showToast("Copied to clipboard!", "success")}
          />
        </div>
      </div>

      {/* Toast Container */}
      <div style={{ position: "fixed", bottom: "1.5rem", right: "1.5rem", display: "flex", flexDirection: "column", gap: "0.5rem", zIndex: 1000, pointerEvents: "none" }}>
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() =>
              setToasts((prev) => prev.filter((t) => t.id !== toast.id))
            }
          />
        ))}
      </div>
    </>
  );
}
