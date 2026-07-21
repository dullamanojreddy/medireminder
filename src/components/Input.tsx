import React from "react";

interface InputProps {
  id: string;
  name: string;
  type?: string;
  label: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  required?: boolean;
  className?: string;
  maxLength?: number;
  disabled?: boolean;
  icon?: React.ReactNode;
}

export default function Input({
  id,
  name,
  type = "text",
  label,
  placeholder,
  value,
  onChange,
  error,
  required = false,
  className = "",
  maxLength,
  disabled = false,
  icon,
}: InputProps) {
  return (
    <div className={`flex flex-col gap-1.5 w-full ${className}`}>
      <label htmlFor={id} className="text-sm font-medium text-text-primary flex items-center justify-between">
        <span>
          {label}
          {required && <span className="text-danger ml-1" aria-hidden="true">*</span>}
        </span>
      </label>
      
      <div className="relative flex items-center">
        {icon && (
          <div className="absolute left-4 text-text-secondary pointer-events-none flex items-center justify-center">
            {icon}
          </div>
        )}
        <input
          id={id}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          maxLength={maxLength}
          disabled={disabled}
          className={`w-full h-[48px] ${icon ? "pl-11" : "pl-4"} pr-4 py-2 text-text-primary bg-white border ${
            error ? "border-danger focus:border-danger focus:ring-danger" : "border-brand-border focus:border-primary focus:ring-primary"
          } rounded-input text-base transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed placeholder-gray-400`}
        />
      </div>
      
      {error && (
        <span id={`${id}-error`} className="text-xs font-medium text-danger mt-0.5">
          {error}
        </span>
      )}
    </div>
  );
}
