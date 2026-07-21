import React from "react";
import { motion } from "motion/react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen bg-brand-bg select-none">
      <Navbar />
      
      {/* Scrollable content container with top margin to avoid clipping from fixed header */}
      <main className="flex-1 pt-[72px] flex flex-col justify-center">
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="flex-1 w-full max-w-[1280px] mx-auto px-6 md:px-8 py-8 md:py-12"
        >
          {children}
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
