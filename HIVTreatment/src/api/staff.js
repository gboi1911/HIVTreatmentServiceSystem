import { registerUser } from './auth';

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
    console.log('🔄 Creating staff with data:', staffData);
    const token = localStorage.getItem('token');
    
    // Validate required fields according to StaffRequest schema
    const requiredFields = ['email', 'gender', 'name', 'password', 'phone'];
    const missingFields = requiredFields.filter(field => !staffData[field]);
    
    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }
    
    // Validate phone number pattern: (84|0[3|5|7|8|9])+(\d{8})
    const phonePattern = /^(84|0[3|5|7|8|9])+(\d{8})$/;
    if (!phonePattern.test(staffData.phone)) {
      throw new Error('Số điện thoại không hợp lệ. Phải bắt đầu bằng 84 hoặc 03, 05, 07, 08, 09 và có 10-11 số');
    }
    
    // Validate gender pattern: ^(Male|Female|Other)$
    const validGenders = ['Male', 'Female', 'Other'];
    if (!validGenders.includes(staffData.gender)) {
      throw new Error('Giới tính không hợp lệ. Phải là Male, Female hoặc Other');
    }
    
    // Validate email format
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(staffData.email)) {
      throw new Error('Email không hợp lệ');
    }
    
    // Validate password length
    if (staffData.password.length < 6) {
      throw new Error('Mật khẩu phải có ít nhất 6 ký tự');
    }
    
    // Step 1: Register the account with STAFF role
    console.log('📝 Step 1: Registering account with STAFF role...');
    const registrationData = {
      fullName: staffData.name,
      email: staffData.email,
      phone: staffData.phone,
      password: staffData.password,
      role: 'STAFF', // Set role to STAFF
      gender: staffData.gender
    };
    
    console.log('📤 Registration data:', registrationData);
    
    try {
      const registrationResult = await registerUser(registrationData);
      console.log('✅ Account registration successful:', registrationResult);
    } catch (registrationError) {
      console.error('❌ Account registration failed:', registrationError);
      throw new Error(`Không thể đăng ký tài khoản: ${registrationError.message}`);
    }
    
    // Step 2: Create staff record
    console.log('📝 Step 2: Creating staff record...');
    const requestBody = {
      name: staffData.name,
      email: staffData.email,
      phone: staffData.phone,
      gender: staffData.gender,
      password: staffData.password
    };
    
    console.log('📤 Sending staff creation request:', requestBody);
    
    const response = await fetch(`${API_BASE}/staff`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(requestBody)
    });

    console.log('📥 Response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ API Error Response:', errorText);
      
      // Try to parse error response
      let errorMessage = `Create staff failed: ${response.status}`;
      try {
        const errorData = JSON.parse(errorText);
        if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.error) {
          errorMessage = errorData.error;
        }
      } catch (e) {
        // If not JSON, use the raw text
        if (errorText) {
          errorMessage = errorText;
        }
      }
      
      throw new Error(errorMessage);
    }

    const result = await response.json();
    console.log('✅ Staff created successfully:', result);
    return result;
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