const API_BASE = "https://hiv.purepixel.io.vn/api";

export async function login(username, password) {
  try {
    const response = await fetch(`${API_BASE}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    
    if (!response.ok) {
      const errorData = await response.text();
      console.error('Login error:', response.status, errorData);
      throw new Error(`Login failed: ${response.status} - ${errorData}`);
    }
    
    return response.json();
  } catch (error) {
    console.error('Login request failed:', error);
    throw error;
  }
}

export async function register({ fullName, email, phone, password, role, gender, code }) {
  try {
    const response = await fetch(`${API_BASE}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fullName, email, phone, password, role, gender, code }),
    });
    
    if (!response.ok) {
      const errorData = await response.text();
      console.error('Register error:', response.status, errorData);
      throw new Error(`Register failed: ${response.status} - ${errorData}`);
    }
    
    return response.json();
  } catch (error) {
    console.error('Register request failed:', error);
    throw error;
  }
}

export async function getCustomer(customerId) {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/customer/${customerId}`, {
      method: 'GET',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // Add authorization header if needed
      },
    });
    
    if (!response.ok) {
      const errorData = await response.text();
      console.error('Get customer error:', response.status, errorData);
      throw new Error(`Get customer failed: ${response.status} - ${errorData}`);
    }
    
    return response.json();
  } catch (error) {
    console.error('Get customer request failed:', error);
    throw error;
  }
}