import React from "react";

type BadgeType = 
  | "primary" 
  | "success" 
  | "danger" 
  | "warning" 
  | "Warning"
  | "info" 
  | "gray" 
  | "Active" 
  | "Expired" 
  | "Refill Soon"
  | "Pending"
  | "Completed"
  | "Snoozed"
  | "Safe"
  | "Critical";

interface BadgeProps {
  children: React.ReactNode;
  type?: BadgeType;
  className?: string;
}

export default function Badge({ children, type = "primary", className = "" }: BadgeProps) {
  const baseClasses = "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide border";

  const colorClasses: Record<BadgeType, string> = {
    primary: "bg-blue-50 border-blue-200 text-primary",
    success: "bg-green-50 border-green-200 text-success",
    danger: "bg-red-50 border-red-200 text-danger",
    warning: "bg-amber-50 border-amber-200 text-warning",
    info: "bg-sky-50 border-sky-200 text-sky-600",
    gray: "bg-gray-100 border-gray-200 text-text-secondary",
    
    // Status alignment
    Active: "bg-green-50 border-green-200 text-success",
    Completed: "bg-green-50 border-green-200 text-success",
    Safe: "bg-green-50 border-green-200 text-success",
    
    "Refill Soon": "bg-amber-50 border-amber-200 text-warning",
    Snoozed: "bg-amber-50 border-amber-200 text-warning",
    Warning: "bg-amber-50 border-amber-200 text-warning",
    
    Expired: "bg-gray-100 border-gray-200 text-text-secondary",
    Pending: "bg-blue-50 border-blue-200 text-primary",
    Critical: "bg-red-50 border-red-200 text-danger",
  };

  return (
    <span className={`${baseClasses} ${colorClasses[type] || colorClasses.primary} ${className}`}>
      {children}
    </span>
  );
}
