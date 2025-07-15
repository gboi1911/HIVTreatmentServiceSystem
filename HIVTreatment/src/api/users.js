const API_BASE = "https://hiv.purepixel.io.vn/api";

// Get Users with pagination and filters
export const getUsers = async (page = 1, limit = 10, filters = {}) => {
  try {
    const token = localStorage.getItem('token');
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...filters
    });

    const response = await fetch(`${API_BASE}/admin/users?${queryParams}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`Get users failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Get users error:', error);
    throw error;
  }
};

// Get single user by ID
export const getUserById = async (userId) => {
  try {
    const token = localStorage.getItem('token');
    
    const response = await fetch(`${API_BASE}/admin/users/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`Get user failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Get user error:', error);
    throw error;
  }
};

// Update user information
export const updateUser = async (userId, userData) => {
  try {
    const token = localStorage.getItem('token');
    
    const response = await fetch(`${API_BASE}/admin/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(userData)
    });

    if (!response.ok) {
      throw new Error(`Update user failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Update user error:', error);
    throw error;
  }
};

// Update user role
export const updateUserRole = async (userId, role) => {
  try {
    const token = localStorage.getItem('token');
    
    const response = await fetch(`${API_BASE}/admin/users/${userId}/role`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ role })
    });

    if (!response.ok) {
      throw new Error(`Update user role failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Update user role error:', error);
    throw error;
  }
};

// Update user status (activate/deactivate)
export const updateUserStatus = async (userId, isActive) => {
  try {
    const token = localStorage.getItem('token');
    
    const response = await fetch(`${API_BASE}/admin/users/${userId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ isActive })
    });

    if (!response.ok) {
      throw new Error(`Update user status failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Update user status error:', error);
    throw error;
  }
};

// Create new user
export const createUser = async (userData) => {
  try {
    const token = localStorage.getItem('token');
    
    const response = await fetch(`${API_BASE}/admin/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(userData)
    });

    if (!response.ok) {
      throw new Error(`Create user failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Create user error:', error);
    throw error;
  }
};

// Delete user
export const deleteUser = async (userId) => {
  try {
    const token = localStorage.getItem('token');
    
    const response = await fetch(`${API_BASE}/admin/users/${userId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`Delete user failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Delete user error:', error);
    throw error;
  }
};

// Get user statistics
export const getUserStats = async () => {
  try {
    const token = localStorage.getItem('token');
    
    const response = await fetch(`${API_BASE}/admin/users/stats`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`Get user stats failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Get user stats error:', error);
    throw error;
  }
};

