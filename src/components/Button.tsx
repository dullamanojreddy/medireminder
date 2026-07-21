import React from "react";
import { motion } from "motion/react";

interface ButtonProps {
  id: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  children: React.ReactNode;
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "secondary" | "danger" | "success" | "warning" | "outline";
  disabled?: boolean;
  className?: string;
  fullWidth?: boolean;
}

export default function Button({
  id,
  onClick,
  children,
  type = "button",
  variant = "primary",
  disabled = false,
  className = "",
  fullWidth = false,
}: ButtonProps) {
  const baseStyle = "inline-flex items-center justify-center font-semibold text-[15px] rounded-button transition-colors duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary h-[48px] px-6";
  
  const variants = {
    primary: "bg-primary text-white hover:bg-primary-hover disabled:bg-gray-300 disabled:cursor-not-allowed",
    secondary: "bg-gray-100 text-text-primary hover:bg-gray-200 disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed",
    outline: "bg-transparent border border-brand-border text-text-primary hover:bg-gray-50 disabled:border-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed",
    danger: "bg-danger text-white hover:bg-red-700 disabled:bg-red-300 disabled:cursor-not-allowed",
    success: "bg-success text-white hover:bg-green-700 disabled:bg-green-300 disabled:cursor-not-allowed",
    warning: "bg-warning text-white hover:bg-amber-600 disabled:bg-amber-300 disabled:cursor-not-allowed",
  };

  const widthStyle = fullWidth ? "w-full" : "";

  return (
    <motion.button
      id={id}
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileHover={disabled ? {} : { scale: 1.02 }}
      whileTap={disabled ? {} : { scale: 0.98 }}
      className={`${baseStyle} ${variants[variant]} ${widthStyle} ${className}`}
    >
      {children}
    </motion.button>
  );
}
