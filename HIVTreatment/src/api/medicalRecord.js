import axios from 'axios';

const API_URL = 'http://localhost:8080/api/medical-records'; // Đổi lại đúng port/backend nếu cần

export const getMedicalRecords = async () => {
  const res = await axios.get(API_URL);
  return res.data;
};

export const createMedicalRecord = async (data) => {
  const res = await axios.post(API_URL, data);
  return res.data;
};

export const updateMedicalRecord = async (id, data) => {
  const res = await axios.put(`${API_URL}/${id}`, data);
  return res.data;
};

export const deleteMedicalRecord = async (id) => {
  const res = await axios.delete(`${API_URL}/${id}`);
  return res.data;
};
