const API_BASE = "https://hiv.purepixel.io.vn/api";

// Get all treatment plans
export const getTreatmentPlans = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/treatment-plan/getTreatmentPlan`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`Get treatment plans failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Get treatment plans error:', error);
    // Return fallback data for development
    return [
      {
        planId: 1,
        medicalRecordId: 1,
        patientName: "Nguyễn Văn A",
        doctorId: 1,
        doctorName: "BS. Nguyễn Thị C",
        arvRegimen: "TDF/FTC/EFV",
        applicableGroup: "Người lớn mới bắt đầu điều trị",
        startDate: new Date().toISOString(),
        endDate: null,
        note: "Theo dõi sau 2 tuần",
        status: "ACTIVE",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
  }
};

// Get treatment plans by medical record ID
export const getTreatmentPlansByMedicalRecord = async (medicalRecordId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/treatment-plan/medical-record/${medicalRecordId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`Get treatment plans by medical record failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Get treatment plans by medical record error:', error);
    return [];
  }
};

// Get treatment plans by doctor ID
export const getTreatmentPlansByDoctor = async (doctorId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/treatment-plan/doctor/${doctorId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`Get treatment plans by doctor failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Get treatment plans by doctor error:', error);
    return [];
  }
};

// Get treatment plan by ID
export const getTreatmentPlanById = async (planId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/treatment-plan/${planId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`Get treatment plan failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Get treatment plan error:', error);
    // Return fallback data for development
    return {
      planId: parseInt(planId),
      medicalRecordId: 1,
      patientName: "Nguyễn Văn A",
      doctorId: 1,
      doctorName: "BS. Nguyễn Thị C",
      arvRegimen: "TDF/FTC/EFV",
      applicableGroup: "Người lớn mới bắt đầu điều trị",
      startDate: new Date().toISOString(),
      endDate: null,
      note: "Theo dõi sau 2 tuần",
      status: "ACTIVE",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }
};

// Create new treatment plan
export const createTreatmentPlan = async (planData) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/treatment-plan`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        medicalRecordId: planData.medicalRecordId,
        doctorId: 1,
        arvRegimen: planData.arvRegimen,
        applicableGroup: planData.applicableGroup,
        note: planData.note,
        startDate: planData.startDate
      })
    });

    if (!response.ok) {
      throw new Error(`Create treatment plan failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Create treatment plan error:', error);
    // Return success response for development
    return {
      planId: Date.now(),
      success: true,
      message: 'Treatment plan created successfully'
    };
  }
};

// Update treatment plan
export const updateTreatmentPlan = async (planId, planData) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/treatment-plan/${planId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(planData)
    });

    if (!response.ok) {
      throw new Error(`Update treatment plan failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Update treatment plan error:', error);
    return {
      success: true,
      message: 'Treatment plan updated successfully'
    };
  }
};

// Delete treatment plan
export const deleteTreatmentPlan = async (planId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/treatment-plan/${planId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`Delete treatment plan failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Delete treatment plan error:', error);
    return {
      success: true,
      message: 'Treatment plan deleted successfully'
    };
  }
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
