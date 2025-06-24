import React, { useState, useEffect } from 'react'
import { message, Spin } from 'antd';
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
import { useNavigate } from 'react-router-dom';
import { useAuthStatus } from '../../hooks/useAuthStatus';
import { getDashboardStats, getRecentActivities } from '../../api/dashboard';

export default function AdminDashboard() {
  const [dashboardStats, setDashboardStats] = useState({
    totalUsers: 0,
    upcomingSessions: 0,
    highRiskUsers: 0,
    trainingParticipation: 0
  });
  const [chartData, setChartData] = useState({
    monthlyTrends: [],
    riskLevels: [],
    participationData: []
  });
  const [recentData, setRecentData] = useState({
    activities: [],
    appointments: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const { userInfo } = useAuthStatus();

  // ✅ Load dashboard data from API
  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      try {
        console.log('🔄 Loading dashboard data...');
        
        // Load dashboard statistics
        const statsData = await getDashboardStats();
        console.log('✅ Dashboard stats loaded:', statsData);
        
        setDashboardStats({
          totalUsers: statsData.totalUsers || 0,
          upcomingSessions: statsData.upcomingSessions || 0,
          highRiskUsers: statsData.highRiskUsers || 0,
          trainingParticipation: statsData.trainingParticipation || 0
        });

        setChartData({
          monthlyTrends: statsData.monthlyTrends || [],
          riskLevels: statsData.riskLevels || [],
          participationData: statsData.participationData || []
        });

        // Load recent activities
        const activitiesData = await getRecentActivities();
        console.log('✅ Recent activities loaded:', activitiesData);
        
        setRecentData({
          activities: activitiesData.activities || [],
          appointments: activitiesData.appointments || []
        });

        setError(null);
      } catch (error) {
        console.error('❌ Dashboard loading error:', error);
        setError('Không thể tải dữ liệu dashboard');
        message.error('Không thể tải dữ liệu dashboard');
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();

    // Auto-refresh every 5 minutes
    const interval = setInterval(loadDashboardData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
    navigate('/login', {
      state: {
        message: 'Đăng xuất thành công!',
        type: 'success'
      }
    });
  };

  const handleRefresh = async () => {
    setLoading(true);
    try {
      const [statsData, activitiesData] = await Promise.all([
        getDashboardStats(),
        getRecentActivities()
      ]);

      setDashboardStats({
        totalUsers: statsData.totalUsers || 0,
        upcomingSessions: statsData.upcomingSessions || 0,
        highRiskUsers: statsData.highRiskUsers || 0,
        trainingParticipation: statsData.trainingParticipation || 0
      });

      setChartData({
        monthlyTrends: statsData.monthlyTrends || [],
        riskLevels: statsData.riskLevels || [],
        participationData: statsData.participationData || []
      });

      setRecentData({
        activities: activitiesData.activities || [],
        appointments: activitiesData.appointments || []
      });

      message.success('Dữ liệu đã được cập nhật!');
    } catch (error) {
      message.error('Không thể cập nhật dữ liệu');
    } finally {
      setLoading(false);
    }
  };
  if (loading && !dashboardStats.totalUsers) {
    return (
      <div className="flex min-h-screen">
        <AdminSidebar onLogout={handleLogout} />
        <main className="flex-1 ml-64 bg-gray-50 min-h-screen p-6 flex items-center justify-center">
          <div className="text-center">
            <Spin size="large" />
            <p className="mt-4 text-gray-600">Đang tải dữ liệu dashboard...</p>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen">
        <AdminSidebar onLogout={handleLogout} />
        <main className="flex-1 ml-64 bg-gray-50 min-h-screen p-6 flex items-center justify-center">
          <div className="text-center">
            <div className="text-red-600 mb-4">{error}</div>
            <button 
              onClick={handleRefresh}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Thử lại
            </button>
          </div>
        </main>
      </div>
    );
  }

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
            <div className="flex-1 flex justify-between items-center">
              <p className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent tracking-tight">
                Dashboard
              </p>
              <button 
                onClick={handleRefresh}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                disabled={loading}
              >
                {loading ? 'Đang tải...' : 'Làm mới'}
              </button>
            </div>
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

          <Charts data={chartData} />
          <RecentActivity data={recentData} />
          
        </div>
      </main>
    </div>
  );
}