import React from "react";
import { Link } from "react-router-dom";
import { Home, ShieldQuestion } from "lucide-react";
import Button from "../components/Button";
import Card from "../components/Card";

export default function NotFoundPage() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)] py-12">
      <div className="w-full max-w-md text-center">
        <Card id="notfound-card" className="flex flex-col items-center gap-6 p-8">
          {/* Custom Illustration */}
          <div className="relative w-28 h-28 bg-red-50 rounded-full flex items-center justify-center text-danger animate-pulse">
            <ShieldQuestion className="w-16 h-16" />
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500"></span>
            </span>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-sm font-bold tracking-widest text-primary uppercase">
              Error 404
            </span>
            <h1 className="text-3xl font-extrabold text-text-primary tracking-tight">
              Page Not Found
            </h1>
            <p className="text-sm text-text-secondary leading-relaxed px-4">
              The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
            </p>
          </div>

          <div className="w-full pt-4 border-t border-brand-border">
            <Link id="notfound-back-home-link" to="/">
              <Button id="notfound-back-home-btn" variant="primary" fullWidth className="gap-2">
                <Home className="w-5 h-5" />
                Back to Home
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
