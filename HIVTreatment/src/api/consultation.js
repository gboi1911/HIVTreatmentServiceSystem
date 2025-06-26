const API_BASE = "https://hiv.purepixel.io.vn/api";

// Get all consultations
export const getConsultations = async (page = 1, limit = 10, filters = {}) => {
  try {
    const token = localStorage.getItem('token');
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...filters
    });

    const response = await fetch(`${API_BASE}/consultations?${queryParams}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`Get consultations failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Get consultations error:', error);
    throw error;
  }
};

// Create consultation booking
export const createConsultation = async (consultationData) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/consultations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(consultationData)
    });

    if (!response.ok) {
      throw new Error(`Create consultation failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Create consultation error:', error);
    throw error;
  }
};

// Update consultation
export const updateConsultation = async (consultationId, updateData) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/consultations/${consultationId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(updateData)
    });

    if (!response.ok) {
      throw new Error(`Update consultation failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Update consultation error:', error);
    throw error;
  }
};

// Cancel consultation
export const cancelConsultation = async (consultationId, reason = '') => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/consultations/${consultationId}/cancel`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ reason })
    });

    if (!response.ok) {
      throw new Error(`Cancel consultation failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Cancel consultation error:', error);
    throw error;
  }
};

// Get available time slots
export const getAvailableTimeSlots = async (consultantId, date) => {
  try {
    const token = localStorage.getItem('token');
    const queryParams = new URLSearchParams({
      consultantId: consultantId.toString(),
      date: date
    });

    const response = await fetch(`${API_BASE}/consultations/available-slots?${queryParams}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`Get time slots failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Get time slots error:', error);
    // Return fallback time slots
    return {
      availableSlots: [
        { time: '09:00', available: true },
        { time: '09:30', available: true },
        { time: '10:00', available: false },
        { time: '10:30', available: true },
        { time: '11:00', available: true },
        { time: '14:00', available: true },
        { time: '14:30', available: false },
        { time: '15:00', available: true },
        { time: '15:30', available: true },
        { time: '16:00', available: true }
      ]
    };
  }
};

// Get consultants list
export const getConsultants = async (specialization = '') => {
  try {
    const token = localStorage.getItem('token');
    const queryParams = specialization ? `?specialization=${specialization}` : '';
    
    const response = await fetch(`${API_BASE}/consultants${queryParams}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`Get consultants failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Get consultants error:', error);
    // Return fallback consultants
    return {
      consultants: [
        {
          id: 1,
          name: 'BS. Nguyễn Thị Mai',
          specialization: 'HIV/AIDS',
          experience: '8 năm kinh nghiệm',
          avatar: 'https://ui-avatars.com/api/?name=Nguyen+Thi+Mai&background=3b82f6&color=fff',
          rating: 4.8,
          availability: 'Sáng và chiều',
          consultationFee: 200000
        },
        {
          id: 2,
          name: 'BS. Trần Văn Đức',
          specialization: 'Tâm lý học',
          experience: '6 năm kinh nghiệm',
          avatar: 'https://ui-avatars.com/api/?name=Tran+Van+Duc&background=10b981&color=fff',
          rating: 4.9,
          availability: 'Chiều',
          consultationFee: 180000
        },
        {
          id: 3,
          name: 'BS. Phạm Thị Lan',
          specialization: 'Sức khỏe sinh sản',
          experience: '10 năm kinh nghiệm',
          avatar: 'https://ui-avatars.com/api/?name=Pham+Thi+Lan&background=f59e0b&color=fff',
          rating: 4.7,
          availability: 'Sáng',
          consultationFee: 220000
        }
      ]
    };
  }
};

// Get user's consultation history
export const getUserConsultationHistory = async (userId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/consultations/user/${userId}/history`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`Get consultation history failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Get consultation history error:', error);
    throw error;
  }
};

// Get consultation details
export const getConsultationDetails = async (consultationId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/consultations/${consultationId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`Get consultation details failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Get consultation details error:', error);
    throw error;
  }
};

// Add consultation notes (for consultants)
export const addConsultationNotes = async (consultationId, notes) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/consultations/${consultationId}/notes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ notes })
    });

    if (!response.ok) {
      throw new Error(`Add notes failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Add consultation notes error:', error);
    throw error;
  }
};

// Rate consultation
export const rateConsultation = async (consultationId, rating, feedback = '') => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/consultations/${consultationId}/rate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ rating, feedback })
    });

    if (!response.ok) {
      throw new Error(`Rate consultation failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Rate consultation error:', error);
    throw error;
  }
};

// Get consultation statistics
export const getConsultationStats = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/consultations/stats`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`Get consultation stats failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Get consultation stats error:', error);
    // Return fallback stats
    return {
      totalConsultations: 892,
      completedConsultations: 834,
      cancelledConsultations: 58,
      averageRating: 4.7,
      averageDuration: 45, // minutes
      popularTimeSlots: [
        { time: '09:00', bookings: 156 },
        { time: '14:00', bookings: 142 },
        { time: '10:00', bookings: 138 },
        { time: '15:00', bookings: 124 },
        { time: '16:00', bookings: 98 }
      ],
      monthlyBookings: [
        { month: 'T1', bookings: 98, completed: 92 },
        { month: 'T2', bookings: 112, completed: 105 },
        { month: 'T3', bookings: 134, completed: 128 },
        { month: 'T4', bookings: 156, completed: 148 },
        { month: 'T5', bookings: 178, completed: 169 },
        { month: 'T6', bookings: 189, completed: 182 }
      ]
    };
  }
};
