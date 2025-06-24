const API_BASE = "https://hiv.purepixel.io.vn/api";

// Dashboard Statistics API
export const getDashboardStats = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/admin/dashboard/stats`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`Dashboard stats failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Dashboard stats error:', error);
    // Return fallback data
    return {
      totalUsers: 1248,
      upcomingSessions: 23,
      highRiskUsers: 17,
      trainingParticipation: 89,
      monthlyTrends: [
        { month: 'T1', users: 65, sessions: 24, assessments: 45 },
        { month: 'T2', users: 78, sessions: 31, assessments: 52 },
        { month: 'T3', users: 90, sessions: 28, assessments: 48 },
        { month: 'T4', users: 108, sessions: 35, assessments: 61 },
        { month: 'T5', users: 125, sessions: 42, assessments: 58 },
        { month: 'T6', users: 142, sessions: 38, assessments: 65 }
      ],
      riskLevels: [
        { name: 'Thấp', value: 850, color: '#10B981' },
        { name: 'Trung bình', value: 381, color: '#F59E0B' },
        { name: 'Cao', value: 17, color: '#EF4444' }
      ],
      participationData: [
        { ageGroup: '13-17', participants: 245 },
        { ageGroup: '18-25', participants: 432 },
        { ageGroup: '26-35', participants: 356 },
        { ageGroup: '36-45', participants: 215 }
      ]
    };
  }
};

// Recent Activities API
export const getRecentActivities = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/admin/activities/recent`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`Recent activities failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Recent activities error:', error);
    // Return fallback data
    return {
      activities: [
        {
          id: 1,
          type: 'user_registration',
          user: 'Nguyễn Văn Minh',
          timestamp: '5 phút trước',
          icon: 'user-plus',
          color: 'blue'
        },
        {
          id: 2,
          type: 'consultation',
          user: 'Trần Thị Lan',
          timestamp: '15 phút trước',
          icon: 'calendar',
          color: 'green'
        },
        {
          id: 3,
          type: 'high_risk',
          user: 'Lê Văn Nam',
          timestamp: '30 phút trước',
          icon: 'alert-triangle',
          color: 'orange'
        },
        {
          id: 4,
          type: 'training',
          user: 'Phạm Thị Hoa',
          timestamp: '1 giờ trước',
          icon: 'graduation-cap',
          color: 'purple'
        }
      ],
      appointments: [
        {
          id: 1,
          user: 'Nguyễn Văn An',
          consultant: 'BS. Trần Thị Mai',
          date: '2024-06-15',
          time: '09:00',
          status: 'Đã xác nhận'
        },
        {
          id: 2,
          user: 'Lê Thị Bình',
          consultant: 'BS. Nguyễn Văn Đức',
          date: '2024-06-15',
          time: '10:30',
          status: 'Chờ xác nhận'
        },
        {
          id: 3,
          user: 'Trần Văn Cường',
          consultant: 'BS. Phạm Thị Lan',
          date: '2024-06-15',
          time: '14:00',
          status: 'Đã xác nhận'
        }
      ]
    };
  }
};

// System Overview API
export const getSystemOverview = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/admin/system/overview`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`System overview failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('System overview error:', error);
    // Return fallback data
    return {
      serverStatus: 'Hoạt động',
      dbConnections: 45,
      activeUsers: 128,
      systemLoad: 67,
      uptime: '15 ngày 8 giờ',
      lastBackup: '2024-06-14 03:00:00'
    };
  }
};
