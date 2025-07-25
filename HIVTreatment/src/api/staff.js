const API_BASE = "https://hiv.purepixel.io.vn/api";

// Get all staff
export const getAllStaff = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/staff`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`Get staff failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Get staff error:', error);
    // Return fallback data
    return [
      {
        staffId: 1,
        name: "Nguyễn Thị B",
        email: "staff@example.com",
        phone: "0987654321",
        gender: "Female",
        isDeleted: false
      }
    ];
  }
};

// Get staff by ID
export const getStaffById = async (staffId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/staff/${staffId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`Get staff failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Get staff error:', error);
    throw error;
  }
};

// Create staff
export const createStaff = async (staffData) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/staff`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        name: staffData.name,
        email: staffData.email,
        phone: staffData.phone,
        gender: staffData.gender, // Male, Female, Other
        password: staffData.password
      })
    });

    if (!response.ok) {
      throw new Error(`Create staff failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Create staff error:', error);
    throw error;
  }
};

// Update staff
export const updateStaff = async (staffId, staffData) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/staff/${staffId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        name: staffData.name,
        email: staffData.email,
        phone: staffData.phone,
        gender: staffData.gender,
        password: staffData.password
      })
    });

    if (!response.ok) {
      throw new Error(`Update staff failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Update staff error:', error);
    throw error;
  }
};

// Delete staff
export const deleteStaff = async (staffId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/staff/${staffId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`Delete staff failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Delete staff error:', error);
    throw error;
  }
};

// Get active staff
export const getActiveStaff = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/staff/active`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`Get active staff failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Get active staff error:', error);
    throw error;
  }
};

// Search staff by name
export const searchStaffByName = async (name) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/staff/search?name=${encodeURIComponent(name)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`Search staff failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Search staff error:', error);
    throw error;
  }
};

// Get staff by email
export const getStaffByEmail = async (email) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/staff/email/${encodeURIComponent(email)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`Get staff by email failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Get staff by email error:', error);
    throw error;
  }
};

// Get staff by gender
export const getStaffByGender = async (gender) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/staff/gender/${gender}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`Get staff by gender failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Get staff by gender error:', error);
    throw error;
  }
};