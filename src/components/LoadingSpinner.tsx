import React from "react";

interface LoadingSpinnerProps {
  id: string;
  size?: "sm" | "md" | "lg";
  color?: string;
  className?: string;
}

export default function LoadingSpinner({
  id,
  size = "md",
  color = "text-primary",
  className = "",
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-5 h-5 border-2",
    md: "w-8 h-8 border-3",
    lg: "w-12 h-12 border-4",
  };

  return (
    <div id={id} className={`flex items-center justify-center ${className}`}>
      <div
        className={`${sizeClasses[size]} border-gray-200 border-t-current rounded-full animate-spin ${color}`}
        role="status"
        aria-label="loading"
      >
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
}
