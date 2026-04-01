import React, { useState, useEffect } from 'react';
import { InputBox } from './InputBox';
import { SettingsPanel } from './SettingsPanel';
import { OutputBox } from './OutputBox';
import { ActionButton } from './ActionButton';
import { initializeStorage, saveSettings, getSettings } from '../utils/storage';
import { Toast } from './Toast';
// Types are imported from utils but used for JSX - no need for 'type' keyword in .jsx files

type ToastType = 'success' | 'error' | 'info';

interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
}

export function App() {
  // State management
  const [settings, setSettings] = useState<Settings | null>(null);
  const [inputText, setInputText] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Initialize settings from localStorage on mount
  useEffect(() => {
    const initialSettings = initializeStorage();
    setSettings(initialSettings);
    setInputText(initialSettings.lastInput || '');
  }, []);

  // Add toast notification
  const showToast = (message: string, type: ToastType = 'info') => {
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
    setInputText('');
    setResult(null);
    setError(null);
    saveSettings({ lastInput: '' });
  };

  // Handle generate
  const handleGenerate = async () => {
    if (!settings) return;

    // Validation
    if (!inputText.trim()) {
      showToast('Please enter text to rewrite', 'error');
      return;
    }

    if (inputText.trim().length < 10) {
      showToast('Text must be at least 10 characters', 'error');
      return;
    }

    if (inputText.length > 5000) {
      showToast('Text must not exceed 5000 characters', 'error');
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

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      console.log('API Response Status:', response.status);

      if (!response.ok) {
        console.error('API Error Response:', response.status, response.statusText);
        const errorData = await response.json().catch(() => ({ error: 'Failed to parse error response' }));
        console.error('Error Data:', errorData);
        throw new Error(errorData.error || `HTTP ${response.status}: Failed to generate text`);
      }

      const data = await response.json();
      console.log('API Success Response:', data);

      if (data.success && data.result) {
        setResult(data.result);
        showToast('Text rewritten successfully!', 'success');
      } else {
        throw new Error(data.error || 'Unknown error occurred');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      console.error('Generation error details:', err);
      setError(errorMessage);
      showToast(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Don't render until settings are initialized
  if (!settings) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-nb-md">
          <div className="inline-block">
            <div
              className="w-10 h-10 border-nb-thick border-nb-black border-t-nb-accent
              rounded-full animate-spin"
            />
          </div>
          <p className="text-nb-lg nb-bold-text">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-nb-md pb-32 md:pb-0 max-w-3xl mx-auto">
        {/* Input Section */}
        <section>
          <InputBox
            value={inputText}
            onChange={handleInputChange}
            onClear={handleClearInput}
            disabled={loading}
          />
        </section>

        {/* Settings Section */}
        <section>
          <SettingsPanel
            settings={settings}
            onSettingsChange={handleSettingsChange}
            disabled={loading}
          />
        </section>

        {/* Output Section */}
        <section>
          <OutputBox
            result={result}
            loading={loading}
            error={error}
            onCopy={() => showToast('Copied to clipboard!', 'success')}
          />
        </section>

        {/* Desktop Action Button */}
        <div className="hidden md:flex justify-end pt-nb-lg">
          <ActionButton
            onClick={handleGenerate}
            loading={loading}
            disabled={!inputText.trim() || loading}
            label="Generate"
          />
        </div>
      </div>

      {/* Mobile Floating Button */}
      <div className="md:hidden">
        <ActionButton
          onClick={handleGenerate}
          loading={loading}
          disabled={!inputText.trim() || loading}
          label="Generate"
        />
      </div>

      {/* Toast Container */}
      <div className="fixed bottom-0 right-0 space-y-nb-sm p-nb-md pointer-events-none z-50">
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
