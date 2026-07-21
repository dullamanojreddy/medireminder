import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";

interface ModalProps {
  id: string;
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidthClass?: string;
}

export default function Modal({
  id,
  isOpen,
  onClose,
  title,
  children,
  maxWidthClass = "max-w-md",
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  // Close on Escape key press
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && isOpen) {
        onClose();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Focus trap inside modal
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      // Focus modal container
      modalRef.current?.focus();
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-xs cursor-pointer"
            aria-hidden="true"
          />

          {/* Modal Content Wrapper */}
          <motion.div
            id={id}
            ref={modalRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-labelledby={`${id}-title`}
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: "spring", duration: 0.3 }}
            className={`relative bg-card-bg rounded-card shadow-soft border border-brand-border w-full ${maxWidthClass} p-6 md:p-8 z-10 focus:outline-none`}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-5 border-b border-brand-border pb-4">
              <h3 id={`${id}-title`} className="text-xl font-bold text-text-primary">
                {title}
              </h3>
              <button
                onClick={onClose}
                className="p-1.5 rounded-full text-text-secondary hover:text-text-primary hover:bg-gray-100 transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="max-h-[70vh] overflow-y-auto">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
