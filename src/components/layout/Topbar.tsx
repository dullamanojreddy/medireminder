import React, { useState, useRef, useEffect } from "react";
import { Menu, Bell, User as UserIcon, LogOut, ChevronDown, Search, Shield, Mail, Phone, Building } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../Toast";
import Modal from "../Modal";

interface TopbarProps {
  id: string;
  onMenuToggle: () => void;
}

export default function Topbar({ id, onMenuToggle }: TopbarProps) {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [caregiverName, setCaregiverName] = useState("manojreddy dulla");
  const [caregiverEmail, setCaregiverEmail] = useState("manojreddy@example.com");
  const [caregiverPhone, setCaregiverPhone] = useState("+91 98765 43210");
  const [caregiverRole, setCaregiverRole] = useState("Primary Caregiver");
  const [caregiverOrganization, setCaregiverOrganization] = useState("MedReminder+ Health Services");

  // Load caregiver info from local storage if available
  useEffect(() => {
    const storedName = localStorage.getItem("caregiverName");
    if (storedName) {
      setCaregiverName(storedName);
    }
    const storedEmail = localStorage.getItem("caregiverEmail");
    if (storedEmail) {
      setCaregiverEmail(storedEmail);
    }
    const storedPhone = localStorage.getItem("caregiverPhone");
    if (storedPhone) {
      setCaregiverPhone(storedPhone);
    }
    const storedRole = localStorage.getItem("caregiverRole");
    if (storedRole) {
      setCaregiverRole(storedRole);
    }
    const storedOrganization = localStorage.getItem("caregiverOrganization");
    if (storedOrganization) {
      setCaregiverOrganization(storedOrganization);
    }
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("caregiverName");
    addToast("Logged out successfully.", "info");
    navigate("/login");
  };

  // Get greeting based on current time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "GOOD MORNING";
    if (hour < 17) return "GOOD AFTERNOON";
    return "GOOD EVENING";
  };

  return (
    <>
      <header
        id={id}
        className="fixed top-0 right-0 left-0 md:left-64 h-16 bg-white border-b border-slate-100 px-8 flex items-center justify-between z-30 shadow-xs"
      >
        {/* Left side: Hamburger (Mobile) & Greeting */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuToggle}
            className="md:hidden p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-xl focus:outline-none cursor-pointer"
            aria-label="Toggle sidebar menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="flex flex-col text-left">
            <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">
              {getGreeting()}
            </span>
            <span className="text-sm font-bold text-slate-900 tracking-tight">
              {caregiverName}
            </span>
          </div>
        </div>

        {/* Right side: Search, Notifications, Profile Dropdown */}
        <div className="flex items-center gap-6">
          {/* Header search bar */}
          <div className="relative w-64 hidden lg:block">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search anything..."
              className="w-full bg-slate-50 border border-slate-200/80 rounded-xl pl-9 pr-4 py-2 text-xs outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/10 transition-all duration-150 font-medium text-slate-700 placeholder-slate-400"
            />
          </div>

          {/* Notification Bell */}
          <button 
            onClick={() => addToast("You have no unread notifications.", "info")}
            className="relative p-2 rounded-xl hover:bg-slate-50 transition-all duration-150 border border-transparent hover:border-slate-100 cursor-pointer"
            aria-label="View notifications"
          >
            <Bell className="h-4.5 w-4.5 text-slate-500" />
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white" />
          </button>

          {/* Profile Avatar & Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <div
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2.5 border-l border-slate-100 pl-6 cursor-pointer hover:opacity-80 transition-all duration-150"
              aria-haspopup="true"
              aria-expanded={dropdownOpen}
            >
              <div className="h-8 w-8 rounded-full bg-blue-600 text-white font-semibold flex items-center justify-center text-sm shadow-xs border border-blue-500">
                {caregiverName ? caregiverName.charAt(0).toUpperCase() : "M"}
              </div>
              <span className="text-xs font-semibold text-slate-700 hidden sm:inline">
                {caregiverName.split(" ")[0]}
              </span>
              <ChevronDown className="h-4 w-4 text-slate-400 transition-transform duration-200" style={{ transform: dropdownOpen ? 'rotate(180deg)' : 'none' }} />
            </div>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-52 bg-white border border-slate-200/80 rounded-2xl shadow-lg py-1.5 z-50">
                <div className="px-4 py-2 border-b border-slate-100 mb-1">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Signed in as</p>
                  <p className="text-xs font-bold text-slate-900 truncate">{caregiverName}</p>
                </div>

                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    setIsProfileOpen(true);
                  }}
                  className="flex items-center gap-2.5 w-full text-left px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <UserIcon className="h-4 w-4 text-slate-400" />
                  <span>My Profile</span>
                </button>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2.5 w-full text-left px-4 py-2.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                >
                  <LogOut className="h-4 w-4 text-rose-600" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Caregiver Profile Modal */}
      <Modal
        id="caregiver-profile-modal"
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        title="My Profile"
      >
        <div className="flex flex-col items-center text-center gap-4 py-2">
          <div className="h-20 w-20 rounded-full bg-blue-600 text-white font-bold text-3xl flex items-center justify-center shadow-md">
            {caregiverName ? caregiverName.charAt(0).toUpperCase() : "M"}
          </div>
          <div>
            <h4 className="text-lg font-bold text-slate-900">{caregiverName}</h4>
            <span className="text-xs font-bold px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full uppercase tracking-wider mt-1.5 inline-block">
              {caregiverRole}
            </span>
          </div>

          <div className="w-full border-t border-slate-100 my-2" />

          <div className="w-full flex flex-col gap-3.5 text-left text-xs">
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-slate-400 shrink-0" />
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase">Email Address</p>
                <p className="font-semibold text-slate-800">{caregiverEmail}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-slate-400 shrink-0" />
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase">Phone Number</p>
                <p className="font-semibold text-slate-800">{caregiverPhone}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Shield className="h-4 w-4 text-slate-400 shrink-0" />
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase">Security Access</p>
                <p className="font-semibold text-slate-800">Admin / Care Manager</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Building className="h-4 w-4 text-slate-400 shrink-0" />
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase">Associated Organization</p>
                <p className="font-semibold text-slate-800">{caregiverOrganization}</p>
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsProfileOpen(false)}
            className="mt-4 w-full h-[40px] bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </Modal>
    </>
  );
}
