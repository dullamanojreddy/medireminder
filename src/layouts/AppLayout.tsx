import React, { useState } from "react";
import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";
import Footer from "../components/Footer";

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col font-sans antialiased text-slate-800" id="med-reminder-app">
      {/* Sidebar */}
      <Sidebar id="app-sidebar" isOpen={sidebarOpen} onClose={closeSidebar} />

      {/* Topbar */}
      <Topbar id="app-topbar" onMenuToggle={toggleSidebar} />

      {/* Layout Main Container */}
      <div className="flex-1 md:pl-64 pt-16 flex flex-col min-h-screen">
        <main className="flex-1 p-6 md:p-8 flex flex-col">
          {children}
        </main>
        
        {/* Simple Footer */}
        <Footer compact />
      </div>
    </div>
  );
}
