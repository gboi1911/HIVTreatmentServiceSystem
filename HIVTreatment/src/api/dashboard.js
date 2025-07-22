const API_BASE = "https://hiv.purepixel.io.vn/api";


// Dashboard Reports API (Swagger: /api/report/getReports)
export const getDashboardReports = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/report/getReports`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`Dashboard reports failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Dashboard reports error:', error);
    return [];
  }
};
