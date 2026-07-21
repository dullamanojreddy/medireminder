import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, Globe, Check } from "lucide-react";
import { Language } from "../types";

interface LanguageDropdownProps {
  id: string;
  selected: Language;
  onChange: (lang: Language) => void;
  label?: string;
  required?: boolean;
  error?: string;
}

const LANGUAGES: Language[] = ["English", "Hindi", "Telugu", "Tamil", "Kannada", "Marathi"];

export default function LanguageDropdown({
  id,
  selected,
  onChange,
  label = "Preferred Language",
  required = false,
  error,
}: LanguageDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggle = () => setIsOpen(!isOpen);

  const handleSelect = (lang: Language) => {
    onChange(lang);
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setIsOpen(!isOpen);
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  return (
    <div className="flex flex-col gap-1.5 w-full relative" ref={containerRef}>
      <label className="text-sm font-medium text-text-primary">
        {label}
        {required && <span className="text-danger ml-1" aria-hidden="true">*</span>}
      </label>

      {/* Dropdown Trigger */}
      <button
        id={id}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        className={`w-full h-[48px] px-4 py-2 text-left bg-white border ${
          error ? "border-danger focus:border-danger" : "border-brand-border focus:border-primary"
        } rounded-input text-base text-text-primary transition-all duration-200 focus:outline-none focus:ring-2 ${
          error ? "focus:ring-danger" : "focus:ring-primary"
        } focus:ring-offset-0 flex items-center justify-between cursor-pointer`}
      >
        <div className="flex items-center gap-2.5">
          <Globe className="w-5 h-5 text-text-secondary" />
          <span>{selected}</span>
        </div>
        <ChevronDown className={`w-5 h-5 text-text-secondary transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.ul
            id={`${id}-menu`}
            role="listbox"
            aria-activedescendant={selected}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 w-full bg-white border border-brand-border rounded-input shadow-soft mt-1.5 py-1.5 max-h-[220px] overflow-y-auto focus:outline-none top-full"
          >
            {LANGUAGES.map((lang) => (
              <li
                key={lang}
                role="option"
                aria-selected={selected === lang}
                onClick={() => handleSelect(lang)}
                className={`px-4 py-2.5 text-base flex items-center justify-between cursor-pointer transition-colors duration-150 ${
                  selected === lang ? "bg-blue-50 text-primary font-medium" : "text-text-primary hover:bg-gray-50"
                }`}
              >
                <span>{lang}</span>
                {selected === lang && <Check className="w-4 h-4 text-primary" />}
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>

      {error && (
        <span className="text-xs font-medium text-danger mt-0.5">
          {error}
        </span>
      )}
    </div>
  );
}
