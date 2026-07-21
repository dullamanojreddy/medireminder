import React from "react";
import { Navigate } from "react-router-dom";
import AppLayout from "../layouts/AppLayout";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const token = localStorage.getItem("authToken");

  if (!token) {
    // Redirect to login if token is missing
    return <Navigate to="/login" replace />;
  }

  // Wrap inside AppLayout for authenticated pages
  return <AppLayout>{children}</AppLayout>;
}
