import React, { useState } from 'react'
import {
  Users,
  Calendar,
  AlertTriangle,
  GraduationCap,
  UserPlus,
} from 'lucide-react';
import { StatCard } from '../../components/AdminDashboard/StatCard';
import AdminSidebar from "../../components/AdminDashboard/AdminSidebar";
import { Charts } from '../../components/AdminDashboard/Charts';
import { RecentActivity } from '../../components/AdminDashboard/RecentActivity';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showUserModal, setShowUserModal] = useState(false);
  const [showCourseModal, setShowCourseModal] = useState(false);

  // Sample data
  const dashboardStats = {
    totalUsers: 1248,
    upcomingSessions: 23,
    highRiskUsers: 17,
    trainingParticipation: 89
  };

  const appointments = [
    { id: 1, user: 'Nguyễn Văn An', consultant: 'BS. Trần Thị Mai', date: '2024-06-15', time: '09:00', status: 'Đã xác nhận' },
    { id: 2, user: 'Lê Thị Hoa', consultant: 'ThS. Nguyễn Văn Bình', date: '2024-06-15', time: '14:30', status: 'Chờ xác nhận' },
    { id: 3, user: 'Phạm Minh Tuấn', consultant: 'BS. Võ Thị Lan', date: '2024-06-16', time: '10:15', status: 'Đã xác nhận' }
  ];
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div className="flex min-h-screen">
      <AdminSidebar onLogout={handleLogout} />
      <main className="flex-1 ml-64 bg-gray-50 min-h-screen p-6">
        <div className="relative bg-white rounded-xl shadow-lg mb-8 p-4 flex items-center">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-xl opacity-60 pointer-events-none"></div>
          <div className="relative flex items-center w-full">
            <div className="flex items-center justify-center bg-blue-600 rounded-xl h-14 w-14 shadow-lg mr-5">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <p className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent tracking-tight">
              Dashboard
            </p>
          </div>
        </div>
        <div className='space-y-6'>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Tổng số người dùng"
              value={dashboardStats.totalUsers.toLocaleString()}
              icon={Users}
              color="bg-gradient-to-r from-blue-500 to-blue-600"
              trend="12"
            />
            <StatCard
              title="Buổi tư vấn sắp tới"
              value={dashboardStats.upcomingSessions}
              icon={Calendar}
              color="bg-gradient-to-r from-green-500 to-green-600"
              trend="8"
            />
            <StatCard
              title="Người dùng nguy cơ cao"
              value={dashboardStats.highRiskUsers}
              icon={AlertTriangle}
              color="bg-gradient-to-r from-red-500 to-red-600"
              trend="-5"
            />
            <StatCard
              title="Tỷ lệ tham gia đào tạo"
              value={`${dashboardStats.trainingParticipation}%`}
              icon={GraduationCap}
              color="bg-gradient-to-r from-purple-500 to-purple-600"
              trend="15"
            />
          </div>

          <Charts/>
          <RecentActivity/>
          
        </div>
      </main>
    </div>
  );
}
