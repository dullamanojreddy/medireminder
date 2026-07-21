import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Activity, Menu, X } from "lucide-react";
import Button from "./Button";

export default function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false);
  const location = useLocation();

  const toggleMenu = () => setIsOpen(!isOpen);

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 h-[72px] bg-white border-b border-brand-border z-40 shadow-xs">
      <div className="max-w-[1280px] mx-auto h-full px-6 md:px-8 flex items-center justify-between">
        {/* Logo and Project Name */}
        <Link id="nav-logo" to="/" className="flex items-center gap-2.5 group cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-lg p-1">
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center transition-colors duration-200 group-hover:bg-primary/15">
            <Activity className="w-5.5 h-5.5 text-primary" />
          </div>
          <span className="text-xl font-bold text-text-primary tracking-tight">
            MedReminder<span className="text-primary">+</span>
          </span>
        </Link>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            id="nav-link-login"
            to="/login"
            className={`text-base font-semibold px-4 py-2 rounded-input transition-colors ${
              isActive("/login") ? "text-primary bg-blue-50/50" : "text-text-secondary hover:text-text-primary"
            } focus:outline-none focus:ring-2 focus:ring-primary`}
          >
            Login
          </Link>
          <Link id="nav-link-register-btn" to="/register">
            <Button id="nav-btn-register" variant="primary">
              Get Started
            </Button>
          </Link>
        </div>

        {/* Mobile menu trigger */}
        <button
          id="nav-menu-toggle"
          onClick={toggleMenu}
          className="md:hidden p-2 text-text-secondary hover:text-text-primary hover:bg-gray-100 rounded-input focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
          aria-label={isOpen ? "Close menu" : "Open menu"}
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden absolute top-[72px] left-0 right-0 bg-white border-b border-brand-border py-4 px-6 shadow-soft flex flex-col gap-3">
          <Link
            id="nav-mobile-link-landing"
            to="/"
            onClick={() => setIsOpen(false)}
            className={`text-base font-semibold py-2.5 px-4 rounded-input transition-colors ${
              isActive("/") ? "bg-blue-50 text-primary" : "text-text-secondary hover:bg-gray-50"
            }`}
          >
            Home
          </Link>
          <Link
            id="nav-mobile-link-login"
            to="/login"
            onClick={() => setIsOpen(false)}
            className={`text-base font-semibold py-2.5 px-4 rounded-input transition-colors ${
              isActive("/login") ? "bg-blue-50 text-primary" : "text-text-secondary hover:bg-gray-50"
            }`}
          >
            Login
          </Link>
          <Link
            id="nav-mobile-link-register"
            to="/register"
            onClick={() => setIsOpen(false)}
            className="w-full mt-2"
          >
            <Button id="nav-mobile-btn-register" variant="primary" fullWidth>
              Get Started
            </Button>
          </Link>
        </div>
      )}
    </nav>
  );
}
