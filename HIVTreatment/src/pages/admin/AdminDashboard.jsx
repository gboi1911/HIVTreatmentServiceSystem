import React, { useState, useEffect } from 'react'
import { message, Spin } from 'antd';
import {
  Users,
  Calendar,
  AlertTriangle,
  GraduationCap,
  UserPlus,
  Activity,
  TrendingUp,
  BarChart3,
  PieChart,
} from 'lucide-react';
import { StatCard } from '../../components/AdminDashboard/StatCard';
import AdminSidebar from "../../components/AdminDashboard/AdminSidebar";
import { Charts } from '../../components/AdminDashboard/Charts';
import { RecentActivity } from '../../components/AdminDashboard/RecentActivity';
import { useNavigate } from 'react-router-dom';
import { useAuthStatus } from '../../hooks/useAuthStatus';
import { getDashboardReports } from '../../api/dashboard';
import { getAssessmentStats } from '../../api/assessment';
import { getAllDoctors } from '../../api/doctor';
import { getAllStaff } from '../../api/staff';
import { getAllCustomers } from '../../api/customer';
import { getAllAppointments } from '../../api/appointment';

export default function AdminDashboard() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({});
  const [chartData, setChartData] = useState({});

  const navigate = useNavigate();
  const { userInfo } = useAuthStatus();

  // Helper function to safely extract data from API responses
  const safeExtractData = (data, fallback = []) => {
    console.log('🔍 Extracting data:', data);
    
    if (Array.isArray(data)) {
      return data;
    }
    
    if (data && typeof data === 'object') {
      // Check for common data wrapper patterns
      if (data.data && Array.isArray(data.data)) {
        return data.data;
      }
      if (data.content && Array.isArray(data.content)) {
        return data.content;
      }
      if (data.items && Array.isArray(data.items)) {
        return data.items;
      }
      if (data.results && Array.isArray(data.results)) {
        return data.results;
      }
      
      // If it's an object with numeric keys, convert to array
      const keys = Object.keys(data);
      if (keys.length > 0 && keys.every(key => !isNaN(key))) {
        return Object.values(data);
      }
      
      // If it's a single object, wrap in array
      if (keys.length > 0) {
        return [data];
      }
    }
    
    return fallback;
  };

  // Helper function to process appointment data from API
  const processAppointmentData = (appointments) => {
    console.log('🔍 Processing appointments:', appointments);
    
    const extractedAppointments = safeExtractData(appointments, []);
    console.log('📊 Extracted appointments:', extractedAppointments);
    
    let appointmentCount = extractedAppointments.length;
    let appointmentsByStatus = { PENDING: 0, CONFIRMED: 0, COMPLETED: 0, CANCELLED: 0 };
    let appointmentsByType = { 'Video call': 0, 'Điện thoại': 0, 'Trực tiếp': 0 };
    let monthlyAppointments = {};
    
    extractedAppointments.forEach(appointment => {
      if (appointment && typeof appointment === 'object') {
        // Count by status
        const status = appointment.status || 'PENDING';
        appointmentsByStatus[status] = (appointmentsByStatus[status] || 0) + 1;
        
        // Count by type
        const type = appointment.type || appointment.consultationType || 'Trực tiếp';
        appointmentsByType[type] = (appointmentsByType[type] || 0) + 1;
        
        // Count by month
        if (appointment.datetime || appointment.date || appointment.createdAt) {
          const dateStr = appointment.datetime || appointment.date || appointment.createdAt;
          try {
            const date = new Date(dateStr);
            if (!isNaN(date.getTime())) {
              const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
              monthlyAppointments[monthKey] = (monthlyAppointments[monthKey] || 0) + 1;
            }
          } catch (e) {
            console.warn('Invalid date format:', dateStr);
          }
        }
      }
    });
    
    console.log('📊 Processed appointment data:', {
      count: appointmentCount,
      byStatus: appointmentsByStatus,
      byType: appointmentsByType,
      monthly: monthlyAppointments
    });
    
    return {
      count: appointmentCount,
      byStatus: appointmentsByStatus,
      byType: appointmentsByType,
      monthly: monthlyAppointments
    };
  };

  // Helper function to process staff data for analytics
  const processStaffData = (staff) => {
    const extractedStaff = safeExtractData(staff, []);
    console.log('📊 Extracted staff:', extractedStaff);
    
    const byGender = { Male: 0, Female: 0, Other: 0 };
    let activeCount = 0;
    
    extractedStaff.forEach(member => {
      if (member && typeof member === 'object') {
        const gender = member.gender || 'Other';
        byGender[gender] = (byGender[gender] || 0) + 1;
        
        if (!member.isDeleted && member.isDeleted !== true) {
          activeCount++;
        }
      }
    });
    
    return {
      count: extractedStaff.length,
      byGender,
      active: activeCount
    };
  };

  // Helper function to process doctor data for analytics
  const processDoctorData = (doctors) => {
    const extractedDoctors = safeExtractData(doctors, []);
    console.log('📊 Extracted doctors:', extractedDoctors);
    
    const bySpecialization = {};
    
    extractedDoctors.forEach(doctor => {
      if (doctor && typeof doctor === 'object') {
        const specialization = doctor.specialization || doctor.specialty || 'General';
        bySpecialization[specialization] = (bySpecialization[specialization] || 0) + 1;
      }
    });
    
    return {
      count: extractedDoctors.length,
      bySpecialization
    };
  };

  // Helper function to process customer data
  const processCustomerData = (customers) => {
    const extractedCustomers = safeExtractData(customers, []);
    console.log('📊 Extracted customers:', extractedCustomers);
    
    return {
      count: extractedCustomers.length
    };
  };

  // Generate chart data based on processed statistics
  const generateChartData = (stats, appointmentData, staffData, doctorData) => {
    console.log('🎯 Generating chart data with:', { stats, appointmentData, staffData, doctorData });
    
    // Risk distribution pie chart - ensure we have valid data
    const riskLevels = [
      { name: 'Thấp', value: Math.max(0, stats.riskDistribution?.low || 0), color: '#10B981' },
      { name: 'Trung bình', value: Math.max(0, stats.riskDistribution?.medium || 0), color: '#F59E0B' },
      { name: 'Cao', value: Math.max(0, stats.riskDistribution?.high || 0), color: '#EF4444' }
    ];

    // Appointment status distribution - ensure we have valid data
    const appointmentStatusData = Object.entries(appointmentData.byStatus || {})
      .filter(([status, count]) => count > 0) // Only include statuses with data
      .map(([status, count]) => ({
        name: status === 'PENDING' ? 'Chờ xác nhận' : 
              status === 'CONFIRMED' ? 'Đã xác nhận' :
              status === 'COMPLETED' ? 'Hoàn thành' :
              status === 'CANCELLED' ? 'Đã hủy' : status,
        value: count,
        color: status === 'PENDING' ? '#F59E0B' : 
               status === 'CONFIRMED' ? '#3B82F6' :
               status === 'COMPLETED' ? '#10B981' :
               status === 'CANCELLED' ? '#EF4444' : '#6B7280'
      }));

    // System overview bar chart - ensure we have valid data
    // Fixed: Use participationData instead of systemOverview to match Charts component
    const participationData = [
      { ageGroup: 'Bác sĩ', participants: Math.max(0, doctorData.count || 0) },
      { ageGroup: 'Nhân viên', participants: Math.max(0, staffData.count || 0) },
      { ageGroup: 'Khách hàng', participants: Math.max(0, stats.totalCustomers || 0) },
      { ageGroup: 'Đánh giá rủi ro', participants: Math.max(0, stats.totalAssessments || 0) }
    ].filter(item => item.participants > 0); // Only include items with data

    // Monthly trends - convert monthly appointments to array format
    const monthlyEntries = Object.entries(appointmentData.monthly || {});
    let monthlyTrends = [];
    
    if (monthlyEntries.length > 0) {
      monthlyTrends = monthlyEntries
        .sort(([a], [b]) => a.localeCompare(b))
        .slice(-6) // Last 6 months
        .map(([month, count]) => ({
          month: `T${month.substring(5)}`, // Get MM part and add T prefix
          appointments: count,
          assessments: Math.floor(count * 0.7), // Estimated assessments based on appointments
        }));
    } else {
      // Create sample data for current year if no data available
      const currentDate = new Date();
      for (let i = 5; i >= 0; i--) {
        const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
        monthlyTrends.push({
          month: `T${String(date.getMonth() + 1).padStart(2, '0')}`,
          appointments: Math.floor(Math.random() * 20) + 5,
          assessments: Math.floor(Math.random() * 15) + 3,
        });
      }
    }

    // Consultation type distribution - ensure we have valid data
    const consultationTypeData = Object.entries(appointmentData.byType || {})
      .filter(([type, count]) => count > 0) // Only include types with data
      .map(([type, count]) => ({
        type: type,
        count: count
      }));

    const result = {
      riskLevels,
      appointmentStatus: appointmentStatusData,
      participationData, // Fixed: Use participationData instead of systemOverview
      monthlyTrends,
      consultationType: consultationTypeData
    };

    console.log('📊 Generated chart data:', result);
    return result;
  };

  // ✅ Load dashboard data from API using correct Swagger endpoints
  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      try {
        console.log('🚀 Starting dashboard data load...');
        
        // Fetch reports using correct endpoint: /api/report/getReports
        const reportsData = await getDashboardReports();
        const extractedReports = safeExtractData(reportsData, []);
        setReports(extractedReports);
        console.log('📋 Reports loaded:', extractedReports);

        // Fetch stats in parallel using correct Swagger endpoints
        console.log('🔄 Fetching stats in parallel...');
        const [assessmentStats, doctors, staff, customers, appointments] = await Promise.all([
          getAssessmentStats().catch((error) => {
            console.error('❌ Assessment stats error:', error);
            return { totalAssessments: 0, riskDistribution: { low: 0, medium: 0, high: 0 }, averageScore: 0 };
          }),
          getAllDoctors().catch((error) => {
            console.error('❌ Doctors error:', error);
            return [];
          }),
          getAllStaff().catch((error) => {
            console.error('❌ Staff error:', error);
            return [];
          }),
          getAllCustomers().catch((error) => {
            console.error('❌ Customers error:', error);
            return [];
          }),
          getAllAppointments().catch((error) => {
            console.error('❌ Appointments error:', error);
            return [];
          })
        ]);

        console.log('📊 Raw API responses:');
        console.log('- Assessment stats:', assessmentStats);
        console.log('- Doctors:', doctors);
        console.log('- Staff:', staff);
        console.log('- Customers:', customers);
        console.log('- Appointments:', appointments);

        // Process all data with detailed analytics
        const appointmentData = processAppointmentData(appointments);
        const staffData = processStaffData(staff);
        const doctorData = processDoctorData(doctors);
        const customerData = processCustomerData(customers);

        const newStats = {
          totalAssessments: assessmentStats?.totalAssessments || 0,
          riskDistribution: assessmentStats?.riskDistribution || { low: 0, medium: 0, high: 0 },
          averageAssessmentScore: assessmentStats?.averageScore || 0,
          lastAssessmentDate: assessmentStats?.lastAssessmentDate || '',
          totalDoctors: doctorData.count,
          totalStaff: staffData.count,
          totalCustomers: customerData.count,
          totalAppointments: appointmentData.count,
          activeStaff: staffData.active,
          appointmentsByStatus: appointmentData.byStatus,
          appointmentsByType: appointmentData.byType
        };

        // Generate comprehensive chart data
        const newChartData = generateChartData(newStats, appointmentData, staffData, doctorData);

        setStats(newStats);
        setChartData(newChartData);

        console.log('✅ Final dashboard stats:', newStats);
        console.log('✅ Final chart data:', newChartData);
        setError(null);
      } catch (error) {
        console.error('❌ Dashboard data loading error:', error);
        setError('Không thể tải dữ liệu báo cáo');
        message.error('Không thể tải dữ liệu báo cáo');
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
      console.log('🔄 Manual refresh triggered...');
      
      // Fetch reports using correct endpoint
      const reportsData = await getDashboardReports();
      const extractedReports = safeExtractData(reportsData, []);
      setReports(extractedReports);

      // Fetch stats in parallel using correct Swagger endpoints
      const [assessmentStats, doctors, staff, customers, appointments] = await Promise.all([
        getAssessmentStats().catch((error) => {
          console.error('❌ Assessment stats refresh error:', error);
          return { totalAssessments: 0, riskDistribution: { low: 0, medium: 0, high: 0 }, averageScore: 0 };
        }),
        getAllDoctors().catch((error) => {
          console.error('❌ Doctors refresh error:', error);
          return [];
        }),
        getAllStaff().catch((error) => {
          console.error('❌ Staff refresh error:', error);
          return [];
        }),
        getAllCustomers().catch((error) => {
          console.error('❌ Customers refresh error:', error);
          return [];
        }),
        getAllAppointments().catch((error) => {
          console.error('❌ Appointments refresh error:', error);
          return [];
        })
      ]);

      // Process all data with detailed analytics
      const appointmentData = processAppointmentData(appointments);
      const staffData = processStaffData(staff);
      const doctorData = processDoctorData(doctors);
      const customerData = processCustomerData(customers);

      const newStats = {
        totalAssessments: assessmentStats?.totalAssessments || 0,
        riskDistribution: assessmentStats?.riskDistribution || { low: 0, medium: 0, high: 0 },
        averageAssessmentScore: assessmentStats?.averageScore || 0,
        lastAssessmentDate: assessmentStats?.lastAssessmentDate || '',
        totalDoctors: doctorData.count,
        totalStaff: staffData.count,
        totalCustomers: customerData.count,
        totalAppointments: appointmentData.count,
        activeStaff: staffData.active,
        appointmentsByStatus: appointmentData.byStatus,
        appointmentsByType: appointmentData.byType
      };

      // Generate comprehensive chart data
      const newChartData = generateChartData(newStats, appointmentData, staffData, doctorData);

      setStats(newStats);
      setChartData(newChartData);

      message.success('Dữ liệu đã được cập nhật!');
      setError(null);
      console.log('✅ Manual refresh completed:', newStats);
    } catch (error) {
      console.error('❌ Refresh error:', error);
      message.error('Không thể cập nhật dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  // Helper function to safely format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Chưa xác định';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Ngày không hợp lệ';
      return date.toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return 'Ngày không hợp lệ';
    }
  };

  // Helper function to safely get report field
  const getReportField = (report, field, fallback = 'Chưa xác định') => {
    if (!report || typeof report !== 'object') return fallback;
    return report[field] || fallback;
  };

  if (loading) {
    return (
      <div className="flex min-h-screen">
        <AdminSidebar onLogout={handleLogout} />
        <main className="flex-1 ml-64 bg-gray-50 min-h-screen p-6 flex items-center justify-center">
          <div className="text-center">
            <Spin size="large" />
            <p className="mt-4 text-gray-600">Đang tải dữ liệu báo cáo...</p>
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
              <BarChart3 className="h-8 w-8 text-white" />
            </div>
            <div className="flex-1 flex justify-between items-center">
              <p className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent tracking-tight">
                Dashboard HIV Treatment Service
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

        {/* Enhanced statistics cards with more relevant metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard 
            title="Tổng đánh giá rủi ro" 
            value={stats.totalAssessments || 0} 
            icon={AlertTriangle} 
            color="bg-yellow-500"
          />
          <StatCard 
            title="Tổng cuộc hẹn" 
            value={stats.totalAppointments || 0} 
            icon={Calendar} 
            color="bg-cyan-500"
          />
          <StatCard 
            title="Đội ngũ y tế" 
            value={(stats.totalDoctors || 0) + (stats.totalStaff || 0)} 
            icon={UserPlus} 
            color="bg-blue-500"
          />
          <StatCard 
            title="Tổng khách hàng" 
            value={stats.totalCustomers || 0} 
            icon={Users} 
            color="bg-green-500"
          />
        </div>

        {/* Enhanced charts with proper data representation */}
        <div className="mb-8">
          {console.log('🎯 Passing chart data to Charts component:', chartData)}
          <Charts data={chartData} />
        </div>

        {/* Enhanced recent activity with appointment data */}
        <div className="mb-8">
          <RecentActivity 
            data={{
              activities: [
                {
                  id: 1,
                  type: 'high_risk_alert',
                  user: 'Hệ thống',
                  timestamp: new Date().toISOString(),
                  description: `${stats.riskDistribution?.high || 0} đánh giá rủi ro cao cần theo dõi`
                },
                {
                  id: 2,
                  type: 'appointment_booked',
                  user: 'Khách hàng',
                  timestamp: new Date(Date.now() - 3600000).toISOString(),
                  description: `${stats.appointmentsByStatus?.PENDING || 0} cuộc hẹn chờ xác nhận`
                },
                {
                  id: 3,
                  type: 'user_registration',
                  user: 'Hệ thống',
                  timestamp: new Date(Date.now() - 7200000).toISOString(),
                  description: `${stats.totalCustomers || 0} khách hàng đã đăng ký`
                }
              ],
              appointments: [
                {
                  id: 1,
                  user: 'Khách hàng A',
                  consultant: 'TS. Nguyễn Văn B',
                  date: new Date().toLocaleDateString('vi-VN'),
                  time: '09:00',
                  status: 'Đã xác nhận'
                },
                {
                  id: 2,
                  user: 'Khách hàng C',
                  consultant: 'ThS. Trần Thị D',
                  date: new Date(Date.now() + 86400000).toLocaleDateString('vi-VN'),
                  time: '14:30',
                  status: 'Chờ xác nhận'
                }
              ]
            }}
          />
        </div>
      </main>
    </div>
  );
}