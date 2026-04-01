import React, { useState } from 'react';
import {
  TONE_OPTIONS,
  STYLE_OPTIONS,
  LANGUAGE_OPTIONS,
  LENGTH_OPTIONS,
} from '../utils/constants';
import type { Settings } from '../utils/types';

interface SettingsPanelProps {
  settings: Settings;
  onSettingsChange: (settings: Partial<Settings>) => void;
  disabled?: boolean;
}

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
    <div className="space-y-nb-md">
      {/* Accordion Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
        className="w-full flex items-center justify-between px-nb-md py-nb-sm
          bg-nb-white dark:bg-nb-dark-surface border-nb-thick border-nb-black dark:border-nb-dark-text hover:bg-nb-grey dark:hover:bg-nb-accent
          hover:text-nb-white dark:hover:text-nb-dark-bg transition-colors disabled:opacity-50
          disabled:cursor-not-allowed"
      >
        <h2 className="text-nb-base nb-bold-text dark:text-nb-dark-text">Options</h2>
        <span className={`text-nb-lg transition-transform dark:text-nb-dark-text ${isOpen ? 'rotate-180' : ''}`}>
          ▼
        </span>
      </button>

      {/* Accordion Content */}
      {isOpen && (
        <div className="border-nb-thick border-nb-black dark:border-nb-dark-text p-nb-md space-y-nb-md bg-nb-white dark:bg-nb-dark-surface">
          {/* Tone Select */}
          <div className="space-y-nb-sm">
            <label htmlFor="tone-select" className="block text-nb-sm nb-bold-text dark:text-nb-dark-text">
              Tone
            </label>
            <select
              id="tone-select"
              value={settings.tone}
              onChange={(e) => handleChange('tone', e.target.value)}
              disabled={disabled}
              className="w-full px-nb-md py-nb-sm border-nb-thick border-nb-black dark:border-nb-dark-text
                font-mono text-nb-base focus:outline-none focus:ring-2
                focus:ring-nb-accent focus:ring-offset-2 dark:focus:ring-offset-nb-dark-bg disabled:opacity-50
                bg-nb-white dark:bg-nb-dark-surface text-nb-black dark:text-nb-dark-text cursor-pointer"
              aria-label="Select tone"
            >
              {TONE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Style Select */}
          <div className="space-y-nb-sm">
            <label
              htmlFor="style-select"
              className="block text-nb-sm nb-bold-text dark:text-nb-dark-text"
            >
              Style
            </label>
            <select
              id="style-select"
              value={settings.style}
              onChange={(e) => handleChange('style', e.target.value)}
              disabled={disabled}
              className="w-full px-nb-md py-nb-sm border-nb-thick border-nb-black dark:border-nb-dark-text
                font-mono text-nb-base focus:outline-none focus:ring-2
                focus:ring-nb-accent focus:ring-offset-2 dark:focus:ring-offset-nb-dark-bg disabled:opacity-50
                bg-nb-white dark:bg-nb-dark-surface text-nb-black dark:text-nb-dark-text cursor-pointer"
              aria-label="Select style"
            >
              {STYLE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Language Select */}
          <div className="space-y-nb-sm">
            <label
              htmlFor="language-select"
              className="block text-nb-sm nb-bold-text dark:text-nb-dark-text"
            >
              Language
            </label>
            <select
              id="language-select"
              value={settings.language}
              onChange={(e) => handleChange('language', e.target.value)}
              disabled={disabled}
              className="w-full px-nb-md py-nb-sm border-nb-thick border-nb-black dark:border-nb-dark-text
                font-mono text-nb-base focus:outline-none focus:ring-2
                focus:ring-nb-accent focus:ring-offset-2 dark:focus:ring-offset-nb-dark-bg disabled:opacity-50
                bg-nb-white dark:bg-nb-dark-surface text-nb-black dark:text-nb-dark-text cursor-pointer"
              aria-label="Select language"
            >
              {LANGUAGE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Length Select */}
          <div className="space-y-nb-sm">
            <label
              htmlFor="length-select"
              className="block text-nb-sm nb-bold-text dark:text-nb-dark-text"
            >
              Length
            </label>
            <select
              id="length-select"
              value={settings.length}
              onChange={(e) => handleChange('length', e.target.value)}
              disabled={disabled}
              className="w-full px-nb-md py-nb-sm border-nb-thick border-nb-black dark:border-nb-dark-text
                font-mono text-nb-base focus:outline-none focus:ring-2
                focus:ring-nb-accent focus:ring-offset-2 dark:focus:ring-offset-nb-dark-bg disabled:opacity-50
                bg-nb-white dark:bg-nb-dark-surface text-nb-black dark:text-nb-dark-text cursor-pointer"
              aria-label="Select length"
            >
              {LENGTH_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Custom Prompt */}
          <div className="space-y-nb-sm">
            <label
              htmlFor="custom-prompt"
              className="block text-nb-sm nb-bold-text dark:text-nb-dark-text"
            >
              Custom Instruction (Optional)
            </label>
            <textarea
              id="custom-prompt"
              value={settings.customPrompt}
              onChange={(e) => handleChange('customPrompt', e.target.value)}
              disabled={disabled}
              placeholder="Add any additional instructions..."
              className="w-full px-nb-md py-nb-sm border-nb-thick border-nb-black dark:border-nb-dark-text
                font-mono text-nb-sm focus:outline-none focus:ring-2
                focus:ring-nb-accent focus:ring-offset-2 dark:focus:ring-offset-nb-dark-bg disabled:opacity-50
                resize-none min-h-[80px] bg-nb-white dark:bg-nb-dark-surface text-nb-black dark:text-nb-dark-text placeholder-nb-grey dark:placeholder-gray-500"
              aria-label="Custom prompt instructions"
            />
          </div>
        </div>
      )}
    </div>
  );
}
