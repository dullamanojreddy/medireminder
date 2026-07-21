import React from "react";
import { ClipboardList } from "lucide-react";
import Button from "../Button";

interface EmptyStateProps {
  id: string;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export default function EmptyState({
  id,
  title,
  description,
  actionText,
  onAction,
  icon,
}: EmptyStateProps) {
  return (
    <div id={id} className="flex flex-col items-center justify-center text-center p-8 md:p-12 bg-white border border-brand-border rounded-card shadow-soft max-w-lg mx-auto gap-6">
      <div className="w-16 h-16 bg-blue-50 text-primary rounded-2xl flex items-center justify-center animate-pulse">
        {icon || <ClipboardList className="w-8 h-8" />}
      </div>
      
      <div className="flex flex-col gap-2">
        <h3 className="text-xl font-bold text-text-primary tracking-tight">
          {title}
        </h3>
        <p className="text-[15px] text-text-secondary leading-relaxed px-4">
          {description}
        </p>
      </div>

      {actionText && onAction && (
        <Button id={`${id}-action-btn`} onClick={onAction} variant="primary">
          {actionText}
        </Button>
      )}
    </div>
  );
}
