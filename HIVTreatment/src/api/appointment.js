const API_BASE = "https://hiv.purepixel.io.vn/api";

// Book appointment
export const bookAppointment = async (appointmentData) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/appointment/book`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        customerId: appointmentData.customerId,
        doctorId: appointmentData.doctorId,
        type: appointmentData.type,
        note: appointmentData.note,
        datetime: appointmentData.datetime
      })
    });

    if (!response.ok) {
      throw new Error(`Book appointment failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Book appointment error:', error);
    throw error;
  }
};

// Get all appointments
export const getAllAppointments = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/appointment/getAllAppointment`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`Get appointments failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Get appointments error:', error);
    // Return fallback data
    return {
      appointments: [
        {
          id: 1,
          customerName: "Nguyễn Văn A",
          doctorName: "BS. Trần Thị B",
          type: "Tư vấn HIV",
          datetime: "2024-06-20T10:00:00",
          status: "CONFIRMED",
          note: "Tư vấn về phòng ngừa HIV"
        }
      ]
    };
  }
};

// Get appointment by ID
export const getAppointmentById = async (appointmentId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/appointment/${appointmentId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`Get appointment failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Get appointment error:', error);
    throw error;
  }
};

// Get appointments by customer
export const getAppointmentsByCustomer = async (customerId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/appointment/customer/${customerId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`Get appointments by customer failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Get appointments by customer error:', error);
    throw error;
  }
};

// Get appointments by doctor
export const getAppointmentsByDoctor = async (doctorId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/appointment/doctor/${doctorId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`Get appointments by doctor failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Get appointments by doctor error:', error);
    throw error;
  }
};

// Get appointments by status
export const getAppointmentsByStatus = async (status) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/appointment/status/${status}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`Get appointments by status failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Get appointments by status error:', error);
    throw error;
  }
};

// Get appointments by doctor and status
export const getAppointmentsByDoctorAndStatus = async (doctorId, status) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/appointment/doctor/${doctorId}/status/${status}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`Get appointments by doctor and status failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Get appointments by doctor and status error:', error);
    throw error;
  }
};

// Count appointments by doctor
export const countAppointmentsByDoctor = async (doctorId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/appointment/doctor/${doctorId}/count`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`Count appointments failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Count appointments error:', error);
    throw error;
  }
};