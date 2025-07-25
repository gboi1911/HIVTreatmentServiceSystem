import axios from 'axios';

// Sửa URL để phù hợp với cấu trúc API của backend
const API_URL = 'https://hiv.purepixel.io.vn/api/treatment-plan';

export const getTreatmentPlans = async () => {
  const token = localStorage.getItem('token');
  console.log('Getting treatment plans with token:', token ? 'Token exists' : 'No token');
  
  const res = await axios.get(API_URL, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return res.data;
};

export const createTreatmentPlan = async (data) => {
  const token = localStorage.getItem('token');
  console.log('Creating treatment plan with token:', token ? 'Token exists' : 'No token');
  console.log('Request data:', data);
  
  const res = await axios.post(API_URL, data, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  return res.data;
};

export const updateTreatmentPlan = async (id, data) => {
  const token = localStorage.getItem('token');
  const res = await axios.put(`${API_URL}/${id}`, data, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return res.data;
};

export const deleteTreatmentPlan = async (id) => {
  const token = localStorage.getItem('token');
  const res = await axios.delete(`${API_URL}/${id}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return res.data;
};

export const getTreatmentPlansByMedicalRecord = async (medicalRecordId) => {
  const token = localStorage.getItem('token');
  const res = await axios.get(`${API_URL}/medical-record/${medicalRecordId}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return res.data;
};

export const getTreatmentPlansByDoctor = async (doctorId) => {
  const token = localStorage.getItem('token');
  const res = await axios.get(`${API_URL}/doctor/${doctorId}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return res.data;
};

// ARV Regimen templates for HIV treatment
export const getARVRegimenTemplates = () => {
  return [
    {
      regimenName: "TDF/FTC/EFV",
      fullName: "Tenofovir/Emtricitabine/Efavirenz",
      applicableGroup: "Người lớn mới bắt đầu điều trị",
      dosage: "1 viên/ngày",
      description: "Uống vào buổi tối, tránh thức ăn nhiều chất béo"
    },
    {
      regimenName: "ABC/3TC/DTG",
      fullName: "Abacavir/Lamivudine/Dolutegravir",
      applicableGroup: "Người lớn, thay thế TDF",
      dosage: "1 viên/ngày",
      description: "Có thể uống với hoặc không với thức ăn"
    },
    {
      regimenName: "TAF/FTC/BIC",
      fullName: "Tenofovir Alafenamide/Emtricitabine/Bictegravir",
      applicableGroup: "Người lớn, có vấn đề về thận",
      dosage: "1 viên/ngày",
      description: "Uống với thức ăn"
    },
    {
      name: "AZT/3TC/LPV/r",
      fullName: "Zidovudine/Lamivudine/Lopinavir/ritonavir",
      applicableGroup: "Phụ nữ mang thai",
      dosage: "AZT/3TC: 2 lần/ngày, LPV/r: 2 lần/ngày",
      notes: "Theo dõi chặt chẽ tác dụng phụ"
    },
    {
      name: "ABC/3TC + RAL",
      fullName: "Abacavir/Lamivudine + Raltegravir",
      applicableGroup: "Trẻ em và thanh thiếu niên",
      dosage: "Theo cân nặng",
      notes: "Điều chỉnh liều theo cân nặng và tuổi"
    }
  ];
};

// Treatment plan statuses
export const getTreatmentPlanStatuses = () => {
  return [
    { value: 'ACTIVE', label: 'Đang điều trị', color: 'success' },
    { value: 'PAUSED', label: 'Tạm ngưng', color: 'warning' },
    { value: 'COMPLETED', label: 'Hoàn thành', color: 'default' },
    { value: 'DISCONTINUED', label: 'Ngừng điều trị', color: 'error' }
  ];
};
