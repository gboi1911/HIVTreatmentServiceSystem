import React from "react";
import {
  Users,
  BookOpen,
  ClipboardList,
  Calendar,
  UserCheck,
  FileText,
  MessageSquare,
  Settings,
  BarChart3,
  LogOut,
  UserCog
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const navItems = [
  { key: "dashboard", label: "Tổng quan", icon: BarChart3, path: "/admin/dashboard" },
  { key: "users", label: "Quản lý người dùng", icon: Users, path: "/admin/users" },
  { key: "staff", label: "Quản lý nhân viên", icon: UserCog, path: "/admin/staff" },
  { key: "doctor", label: "Quản lý bác sĩ", icon: UserCheck, path: "/admin/doctors" },
  { key: "home", label: "Trang chủ", icon: Users, path: "/" }
];

export default function AdminSidebar({ onLogout }) {
  const location = useLocation();

  return (
    <aside className="h-screen bg-gray-700 text-white w-64 flex flex-col shadow-xl fixed left-0 top-0 z-30">
      <div className="flex items-center justify-center h-20 border-b border-white/10">
        <span className="text-2xl font-bold tracking-wide">Admin Panel</span>
      </div>
      <nav className="flex-1 py-6">
        <ul className="space-y-1">
          {navItems.map((item) => {
            // Only one active bar at a time: match exact path or startsWith for dashboard/users/staff/doctors
            const isActive = location.pathname === item.path ||
              (item.path !== '/' && location.pathname.startsWith(item.path));
            return (
              <li key={item.key}>
                <Link
                  to={item.path}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "0.75rem 1.5rem",
                    borderRadius: "0.5rem",
                    fontWeight: 500,
                    gap: "0.75rem",
                    color: isActive ? "#fde047" : "#fff",
                    background: isActive ? "rgba(255,255,255,0.1)" : "transparent",
                    transition: "all 0.2s",
                    textDecoration: "none",
                    cursor: "pointer",
                  }}
                  onMouseEnter={e => {
                    if (!isActive) e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                  }}
                  onMouseLeave={e => {
                    if (!isActive) e.currentTarget.style.background = "transparent";
                  }}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="p-6 border-t border-white/10">
        <button
          onClick={onLogout}
          className="flex items-center gap-2 text-red-800 hover:text-red-400 font-semibold"
        >
          <LogOut className="w-5 h-5" />
          Đăng xuất
        </button>
      </div>
    </aside>
  );
}