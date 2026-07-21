import React from "react";
import { AlertTriangle } from "lucide-react";
import Modal from "../Modal";
import Button from "../Button";

interface ConfirmModalProps {
  id: string;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "primary" | "warning";
}

export default function ConfirmModal({
  id,
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Delete",
  cancelText = "Cancel",
  variant = "danger",
}: ConfirmModalProps) {
  return (
    <Modal id={id} isOpen={isOpen} onClose={onClose} title={title}>
      <div className="flex flex-col gap-5 text-left">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-red-50 text-danger flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <p className="text-base text-text-primary leading-relaxed">
              {message}
            </p>
            <p className="text-sm text-text-secondary mt-1">
              This action cannot be undone.
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-4 border-t border-brand-border pt-4">
          <Button
            id={`${id}-cancel`}
            variant="secondary"
            onClick={onClose}
          >
            {cancelText}
          </Button>
          <Button
            id={`${id}-confirm`}
            variant={variant}
            onClick={onConfirm}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
