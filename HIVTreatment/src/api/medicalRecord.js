import axios from 'axios';

// Sửa URL để phù hợp với cấu trúc API của backend
const API_URL = 'https://hiv.purepixel.io.vn/api/medical-record'; // Đã bỏ 's' ở cuối

export const getMedicalRecords = async () => {
  const token = localStorage.getItem('token');
  console.log('Getting medical records with token:', token ? 'Token exists' : 'No token');
  
  try {
    const res = await axios.get(`${API_URL}/getMedicalRecord`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.log('Medical records response:', res.data);
    return res.data;
  } catch (error) {
    console.error('Error fetching medical records:', error);
    if (error.response) {
      console.error('Error response:', error.response.data);
      console.error('Error status:', error.response.status);
    }
    throw error;
  }
};

export const getAllMedicalRecords = async () => {
  const token = localStorage.getItem('token');
  console.log('Getting all medical records with token:', token ? 'Token exists' : 'No token');
  
  const res = await axios.get(`${API_URL}/all`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return res.data;
};

export const createMedicalRecord = async (data) => {
  const token = localStorage.getItem('token');
  console.log('Creating medical record with token:', token ? 'Token exists' : 'No token');
  console.log('Request data:', data);
  
  const res = await axios.post(API_URL, data, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  return res.data;
};

export const updateMedicalRecord = async (id, data) => {
  const token = localStorage.getItem('token');
  const res = await axios.put(`${API_URL}/${id}`, data, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return res.data;
};

export const deleteMedicalRecord = async (id) => {
  const token = localStorage.getItem('token');
  const res = await axios.delete(`${API_URL}/${id}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return res.data;
};

export const getMedicalRecordsByCustomer = async (customerId) => {
  const token = localStorage.getItem('token');
  const res = await axios.get(`${API_URL}/customer/${customerId}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return res.data;
};

export const getMedicalRecordsByDoctor = async (doctorId) => {
  const token = localStorage.getItem('token');
  const res = await axios.get(`${API_URL}/doctor/${doctorId}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return res.data;
};

export const getMedicalRecordsByCd4Range = async (minCd4, maxCd4) => {
  const token = localStorage.getItem('token');
  const res = await axios.get(`${API_URL}/cd4-range`, { 
    params: { minCd4, maxCd4 },
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return res.data;
};

export const getMedicalRecordsByViralLoadRange = async (minViralLoad, maxViralLoad) => {
  const token = localStorage.getItem('token');
  const res = await axios.get(`${API_URL}/viral-load-range`, { 
    params: { minViralLoad, maxViralLoad },
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return res.data;
};
