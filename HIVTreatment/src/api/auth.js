const API_BASE = "https://hiv.purepixel.io.vn/api";

// Login user
export const login = async (username, password) => {
  try {
    console.log('🔄 Attempting login with:', { username, password: '***' });
    
    const response = await fetch(`${API_BASE}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username,
        password: password
      })
    });

    console.log('📡 Login response status:', response.status);
    console.log('📡 Login response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Login error response:', errorText);
      throw new Error(`Login failed: ${response.status} - ${errorText}`);
    }

    // Check if response is JSON or plain text
    const contentType = response.headers.get('content-type');
    let data;
    
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
      console.log('✅ Login success (JSON):', data);
    } else {
      // API returns token as plain text
      const token = await response.text();
      data = { token: token.trim() };
      console.log('✅ Login success (Text):', { token: data.token });
    }

    return data;
  } catch (error) {
    console.error('💥 Login error:', error.message);
    throw error;
  }
};

// Get current user info using token
export const getCurrentUser = async (token) => {
  try {
    console.log('🔄 Fetching current user info...');
    const customersResponse = await fetch(`${API_BASE}/customers`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('📡 Customers endpoint response status:', customersResponse.status);
    
    if (customersResponse.ok) {
      const customers = await customersResponse.json();
      console.log('✅ Customers response:', customers);
      
      if (Array.isArray(customers) && customers.length > 0) {
        // Return the first customer (should be current user)
        const user = customers[0];
        console.log('✅ User info from customers:', user);
        
        const processedUser = {
          id: user.id,
          fullName: user.fullName || user.name || 'Người dùng',
          email: user.email,
          phone: user.phone,
          gender: user.gender,
          username: user.fullName || user.name || user.email || 'Người dùng',
          role: user.role || 'STAFF'
        };
        
        console.log('✅ Processed user info:', processedUser);
        return processedUser;
      } else {
        console.warn('⚠️ No customers found in response');
      }
    } else {
      console.error('❌ Customers endpoint failed:', customersResponse.status, customersResponse.statusText);
    }
    
    // If customers endpoint fails, try to decode user info from JWT token
    console.log('🔄 Attempting to decode user info from JWT token...');
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      console.log('🔍 JWT payload:', payload);
      
      const role = payload.role || payload.authorities?.[0] || 'CUSTOMER';
      const fallbackUser = {
        id: payload.sub || payload.userId || Date.now(),
        fullName: payload.fullName || payload.name || payload.username || 'Người dùng',
        email: payload.email || 'user@example.com',
        phone: payload.phone || '0123456789',
        username: payload.username || payload.email || 'Người dùng',
        role: role
      };
      
      console.log('✅ User info from JWT token:', fallbackUser);
      return fallbackUser;
    } catch (jwtError) {
      console.error('❌ Failed to decode JWT token:', jwtError);
    }
    
    // Final fallback
    console.log('⚠️ Using final fallback user info');
    return {
      id: Date.now(),
      fullName: 'Người dùng',
      email: 'user@example.com',
      phone: '0123456789',
      username: 'Người dùng',
      role: 'CUSTOMER'
    };

  } catch (error) {
    console.error('💥 Get current user error:', error);
    
    // Try to decode from token as last resort
    try {
      console.log('🔄 Last resort: decoding from token...');
      const payload = JSON.parse(atob(token.split('.')[1]));
      const role = payload.role || payload.authorities?.[0] || 'CUSTOMER';
      
      const fallbackUser = {
        id: payload.sub || payload.userId || Date.now(),
        fullName: payload.fullName || payload.name || payload.username || 'Người dùng',
        email: payload.email || 'user@example.com',
        phone: payload.phone || '0123456789',
        username: payload.username || payload.email || 'Người dùng',
        role: role
      };
      
      console.log('✅ Fallback user info from token:', fallbackUser);
      return fallbackUser;
    } catch (tokenError) {
      console.error('❌ Token decode also failed:', tokenError);
    }
    
    // Absolute final fallback
    console.log('⚠️ Using absolute final fallback user info');
    return {
      id: Date.now(),
      fullName: 'Người dùng',
      email: 'user@example.com',  
      phone: '0123456789',
      username: 'Người dùng',
      role: 'CUSTOMER'
    };
  }
};

// Register user
export const registerUser = async (userData) => {
  try {
    const response = await fetch(`${API_BASE}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fullName: userData.fullName,
        email: userData.email,
        phone: userData.phone,
        password: userData.password,
        role: userData.role || 'CUSTOMER', // CUSTOMER, STAFF, MANAGER, DOCTOR
        gender: userData.gender
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Registration failed: ${response.status} - ${errorText}`);
    }

    const result = await response.text();
    return { message: result };
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};