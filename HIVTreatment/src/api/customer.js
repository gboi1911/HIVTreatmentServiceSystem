const API_BASE = "https://hiv.purepixel.io.vn/api";

// Get all customers
export const getAllCustomers = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/customers`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`Get customers failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Get customers error:', error);
    // Return fallback data
    return [
      {
        id: 1,
        fullName: "Nguyễn Văn A",
        email: "nguyenvana@example.com",
        phone: "0912345678",
        gender: "Male",
        accountId: 1
      }
    ];
  }
};

// Update customer
export const updateCustomer = async (customerId, userData) => {
  try {
    const response = await fetch(`${API_BASE}/customers/${customerId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(userData)
    });

    if (!response.ok) {
      throw new Error(`Update failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Update customer error:', error);
    throw error;
  }
};

// Get customer by ID
export const getCustomerById = async (customerId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/customers/${customerId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`Get customer failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Get customer error:', error);
    throw error;
  }
};

// Create customer
export const createCustomer = async (customerData) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/customers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        accountId: customerData.accountId
      })
    });

    if (!response.ok) {
      throw new Error(`Create customer failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Create customer error:', error);
    throw error;
  }
};

// Delete customer
export const deleteCustomer = async (customerId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/customers/${customerId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`Delete customer failed: ${response.status}`);
    }

    return await response.text();
  } catch (error) {
    console.error('Delete customer error:', error);
    throw error;
  }
};

// Get customers by account ID
export const getCustomersByAccountId = async (accountId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/customers/account/${accountId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`Get customers by account failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Get customers by account error:', error);
    throw error;
  }
};