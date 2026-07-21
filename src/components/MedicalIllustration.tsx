import React from "react";
import { motion } from "motion/react";

export default function MedicalIllustration() {
  return (
    <motion.svg
      viewBox="0 0 500 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-auto max-w-md mx-auto"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Background soft circle */}
      <motion.circle
        cx="250"
        cy="200"
        r="140"
        fill="#EFF6FF"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      />
      <circle cx="160" cy="110" r="45" fill="#DCFCE7" fillOpacity="0.7" />
      <circle cx="350" cy="280" r="35" fill="#DBEAFE" fillOpacity="0.7" />

      {/* Grid or medical dots pattern */}
      <circle cx="210" cy="80" r="3" fill="#93C5FD" />
      <circle cx="230" cy="80" r="3" fill="#93C5FD" />
      <circle cx="250" cy="80" r="3" fill="#93C5FD" />
      <circle cx="220" cy="95" r="3" fill="#93C5FD" />
      <circle cx="240" cy="95" r="3" fill="#93C5FD" />

      {/* Smartphone frame */}
      <motion.rect
        x="170"
        y="80"
        width="160"
        height="260"
        rx="24"
        fill="#FFFFFF"
        stroke="#E5E7EB"
        strokeWidth="6"
        shadow="0 10px 30px rgba(0,0,0,0.05)"
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.1, type: "spring", stiffness: 80 }}
      />
      
      {/* Phone screen content background */}
      <rect x="178" y="100" width="144" height="215" rx="14" fill="#F8FAFC" />

      {/* Speaker and Camera */}
      <rect x="220" y="88" width="60" height="4" rx="2" fill="#E5E7EB" />
      <circle cx="290" cy="90" r="3" fill="#E5E7EB" />

      {/* Reminders UI mockup inside phone */}
      {/* App Header */}
      <rect x="190" y="112" width="120" height="15" rx="4" fill="#DBEAFE" />
      <rect x="190" y="116" width="60" height="7" rx="3.5" fill="#2563EB" />

      {/* Reminders card 1 */}
      <motion.g
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4 }}
      >
        <rect x="186" y="140" width="128" height="42" rx="8" fill="#FFFFFF" stroke="#E5E7EB" strokeWidth="1" />
        <circle cx="204" cy="161" r="10" fill="#DBEAFE" />
        <path d="M200 161H208M204 157V165" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" />
        <rect x="220" y="152" width="80" height="7" rx="3.5" fill="#111827" />
        <rect x="220" y="163" width="50" height="5" rx="2.5" fill="#9CA3AF" />
      </motion.g>

      {/* Reminders card 2 */}
      <motion.g
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.6 }}
      >
        <rect x="186" y="190" width="128" height="42" rx="8" fill="#FFFFFF" stroke="#E5E7EB" strokeWidth="1" />
        <circle cx="204" cy="211" r="10" fill="#D1FAE5" />
        <path d="M200 211L203 214L208 208" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="220" y="202" width="70" height="7" rx="3.5" fill="#111827" />
        <rect x="220" y="213" width="40" height="5" rx="2.5" fill="#9CA3AF" />
      </motion.g>

      {/* Reminders card 3 */}
      <motion.g
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.8 }}
      >
        <rect x="186" y="240" width="128" height="42" rx="8" fill="#FFFFFF" stroke="#E5E7EB" strokeWidth="1" />
        <circle cx="204" cy="261" r="10" fill="#FEF3C7" />
        <path d="M204 257V262L207 264" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
        <rect x="220" y="252" width="75" height="7" rx="3.5" fill="#111827" />
        <rect x="220" y="263" width="60" height="5" rx="2.5" fill="#9CA3AF" />
      </motion.g>

      {/* Float element: Large Pill */}
      <motion.g
        initial={{ y: 0 }}
        animate={{ y: -10 }}
        transition={{
          repeat: Infinity,
          repeatType: "reverse",
          duration: 2.5,
          ease: "easeInOut",
        }}
      >
        {/* Curved pill outline */}
        <rect
          x="320"
          y="100"
          width="60"
          height="28"
          rx="14"
          transform="rotate(30, 320, 100)"
          fill="#3B82F6"
        />
        <rect
          x="350"
          y="117.32"
          width="30"
          height="28"
          rx="0"
          transform="rotate(30, 350, 117.32)"
          fill="#10B981"
          style={{ clipPath: "inset(0 0 0 14px rounded 0 14px 14px 0)" }}
          className="hidden" /* Standard visual simple rendering */
        />
        {/* Simple split color overlay */}
        <path
          d="M 335 110 L 360 125 A 14 14 0 0 1 346 149 L 321 135 A 14 14 0 0 1 335 110 Z"
          fill="#FFFFFF"
          opacity="0.35"
        />
      </motion.g>

      {/* Float element: Heart/Health bubble */}
      <motion.g
        initial={{ y: 0 }}
        animate={{ y: 8 }}
        transition={{
          repeat: Infinity,
          repeatType: "reverse",
          duration: 3,
          ease: "easeInOut",
          delay: 0.5,
        }}
      >
        <rect x="90" y="160" width="56" height="56" rx="16" fill="#FCA5A5" />
        {/* SVG Heart */}
        <path
          d="M118 193C118 193 104 184 104 175C104 170.5 107.5 167 112 167C114.8 167 117 168.5 118 170.5C119 168.5 121.2 167 124 167C128.5 167 132 170.5 132 175C132 184 118 193 118 193Z"
          fill="#FFFFFF"
        />
      </motion.g>

      {/* Float element: WhatsApp bubble with call out */}
      <motion.g
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, duration: 0.4 }}
      >
        <rect x="290" y="210" width="130" height="44" rx="12" fill="#25D366" />
        <circle cx="312" cy="232" r="12" fill="#FFFFFF" />
        <path d="M307 232C307 235.3 309.7 238 313 238C314.1 238 315.1 237.7 316 237.2L319 238L318.2 235C318.7 234.1 319 233.1 319 232C319 228.7 316.3 226 313 226C309.7 226 307 228.7 307 232Z" fill="#25D366" />
        {/* Notification Text */}
        <rect x="332" y="224" width="72" height="6" rx="3" fill="#FFFFFF" />
        <rect x="332" y="234" width="48" height="5" rx="2.5" fill="#FFFFFF" opacity="0.8" />
      </motion.g>

      {/* Soft floor shadow */}
      <ellipse cx="250" cy="360" rx="120" ry="8" fill="#E5E7EB" />
    </motion.svg>
  );
}
