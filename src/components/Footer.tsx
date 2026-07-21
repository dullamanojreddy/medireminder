import React from "react";
import { Link } from "react-router-dom";
import { Activity } from "lucide-react";

interface FooterProps {
  compact?: boolean;
}

export default function Footer({ compact = false }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={`bg-white border-t border-brand-border ${compact ? "h-16 shrink-0" : "py-12"}`}>
      <div className={`max-w-[1280px] mx-auto px-6 md:px-8 flex flex-col md:flex-row items-center justify-between gap-6 ${compact ? "h-full" : ""}`}>
        <div className="flex items-center gap-2">
          <Activity className={`${compact ? "w-4 h-4" : "w-5 h-5"} text-primary`} />
          <span className="font-semibold text-text-primary">
            MedReminder<span className="text-primary">+</span>
          </span>
        </div>
        
        <p className={`${compact ? "text-xs" : "text-sm"} text-text-secondary`}>
          &copy; {currentYear} MedReminder+. All rights reserved.
        </p>

        <div className={`flex gap-6 ${compact ? "text-xs" : "text-sm"} text-text-secondary font-medium`}>
          <Link id="footer-link-privacy" to="/privacy" className="hover:text-text-primary transition-colors focus:outline-none focus:ring-1 focus:ring-primary rounded">
            Privacy Policy
          </Link>
          <Link id="footer-link-terms" to="/terms" className="hover:text-text-primary transition-colors focus:outline-none focus:ring-1 focus:ring-primary rounded">
            Terms of Service
          </Link>
          <Link id="footer-link-contact" to="/contact" className="hover:text-text-primary transition-colors focus:outline-none focus:ring-1 focus:ring-primary rounded">
            Contact
          </Link>
        </div>
      </div>
    </footer>
  );
}
