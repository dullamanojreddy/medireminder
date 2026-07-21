import React from "react";
import { motion } from "motion/react";

interface CardProps {
  id: string;
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
}

export default function Card({
  id,
  children,
  className = "",
  hoverable = false,
}: CardProps) {
  const hoverAnimation = hoverable
    ? {
        whileHover: { y: -4, boxShadow: "0 12px 24px rgba(0,0,0,0.08)" },
        transition: { duration: 0.2 },
      }
    : {};

  return (
    <motion.div
      id={id}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      {...hoverAnimation}
      className={`bg-card-bg border border-brand-border rounded-card shadow-soft p-6 md:p-8 ${className}`}
    >
      {children}
    </motion.div>
  );
}
