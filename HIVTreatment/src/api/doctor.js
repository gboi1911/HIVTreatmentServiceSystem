const API_BASE = "https://hiv.purepixel.io.vn/api";

// Get all doctors
export const getAllDoctors = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/doctor`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`Get doctors failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Get doctors error:', error);
    // Return fallback data for development
    return [
      {
        id: 1,
        name: "BS. Nguyễn Thị C",
        email: "bsnguyenthic@example.com",
        phone: "0901234567",
        specialization: "HIV/AIDS Treatment",
        experience: "10 years"
      },
      {
        id: 2,
        name: "BS. Lê Văn D",
        email: "bslevand@example.com",
        phone: "0902345678",
        specialization: "Internal Medicine",
        experience: "8 years"
      }
    ];
  }
};

// Get doctor by ID
export const getDoctorById = async (doctorId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/doctor/${doctorId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`Get doctor failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Get doctor error:', error);
    return null;
  }
};

// Create new doctor
export const createDoctor = async (doctorData) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/doctor`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(doctorData)
    });

    if (!response.ok) {
      throw new Error(`Create doctor failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Create doctor error:', error);
    throw error;
  }
};

// Update doctor
export const updateDoctor = async (doctorId, doctorData) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/doctor/${doctorId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(doctorData)
    });

    if (!response.ok) {
      throw new Error(`Update doctor failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Update doctor error:', error);
    throw error;
  }
};

// Delete doctor
export const deleteDoctor = async (doctorId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/doctor/${doctorId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`Delete doctor failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Delete doctor error:', error);
    throw error;
  }
};
