import React from "react";
import { Search } from "lucide-react";

interface SearchBarProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function SearchBar({
  id,
  value,
  onChange,
  placeholder = "Search...",
  className = "",
}: SearchBarProps) {
  return (
    <div className={`relative flex items-center ${className}`}>
      <Search className="absolute left-4 w-5 h-5 text-text-secondary pointer-events-none" />
      <input
        id={id}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-[48px] pl-12 pr-4 bg-white border border-brand-border rounded-input text-base text-text-primary placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 shadow-xs"
      />
    </div>
  );
}
