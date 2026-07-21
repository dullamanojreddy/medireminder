import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  Activity, 
  LayoutDashboard, 
  Users, 
  UserPlus, 
  Clock, 
  Settings, 
  LogOut, 
  X 
} from "lucide-react";
import { useToast } from "../Toast";

interface SidebarProps {
  id: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ id, isOpen, onClose }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const menuItems = [
    {
      title: "Dashboard",
      path: "/dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
      disabled: false,
    },
    {
      title: "Patients",
      path: "/patients",
      icon: <Users className="h-5 w-5" />,
      disabled: false,
    },
    {
      title: "Add Patient",
      path: "/patients/add",
      icon: <UserPlus className="h-5 w-5" />,
      disabled: false,
    },
    {
      title: "Reminder Queue",
      path: "/reminders",
      icon: <Clock className="h-5 w-5" />,
      disabled: false,
    },
    {
      title: "Settings",
      path: "/settings",
      icon: <Settings className="h-5 w-5" />,
      disabled: false,
      badge: "ADMIN",
    }
  ];

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("caregiverName");
    addToast("Logged out successfully.", "info");
    navigate("/login");
  };

  const isActive = (path: string) => {
    if (path === "/patients" && (location.pathname.startsWith("/patients/"))) {
      return location.pathname === "/patients";
    }
    return location.pathname === path;
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-40 md:hidden cursor-pointer"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container matching exact theme */}
      <aside
        id={id}
        className={`fixed top-0 bottom-0 left-0 w-64 bg-slate-900 border-r border-slate-800 z-40 flex flex-col justify-between transition-transform duration-300 md:translate-x-0 text-slate-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Upper Brand Section */}
        <div>
          <div className="h-16 px-6 border-b border-slate-800 flex items-center justify-between">
            <Link to="/dashboard" className="flex items-center gap-2.5 focus:outline-none cursor-pointer" onClick={onClose}>
              <Activity className="h-6 w-6 text-blue-500 animate-pulse" />
              <span className="text-xl font-bold tracking-tight text-white">
                MedReminder<span className="text-blue-500">+</span>
              </span>
            </Link>

            {/* Mobile Close Button */}
            <button
              onClick={onClose}
              className="md:hidden p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl cursor-pointer"
              aria-label="Close sidebar"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Nav Links */}
          <nav className="flex-1 px-4 py-6 space-y-1.5">
            {menuItems.map((item, idx) => {
              if (item.disabled) {
                return (
                  <div
                    key={idx}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition-all duration-200 text-sm font-medium cursor-not-allowed select-none"
                    title="System settings are managed via administrative console"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-slate-500">{item.icon}</span>
                      <span>{item.title}</span>
                    </div>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold tracking-wider bg-slate-800 text-slate-400 uppercase">
                      ADMIN
                    </span>
                  </div>
                );
              }

              const active = isActive(item.path);

              return (
                <Link
                  key={idx}
                  to={item.path}
                  onClick={onClose}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium ${
                    active
                      ? "text-white bg-blue-600 shadow-sm shadow-blue-900/20"
                      : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={active ? "text-white" : "text-slate-500 group-hover:text-slate-300"}>
                      {item.icon}
                    </span>
                    <span>{item.title}</span>
                  </div>
                  {item.badge && (
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase ${
                      active ? "bg-blue-500 text-white" : "bg-slate-800 text-slate-400"
                    }`}>
                      {item.badge}
                    </span>
                  )}
                  {active && (
                    <span className="h-1.5 w-1.5 rounded-full bg-white" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section with Logout */}
        <div className="p-4 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-950/20 transition-all text-sm font-medium cursor-pointer"
          >
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
