
const API_BASE = "https://hiv.purepixel.io.vn/api";

// Create lab result
export const createLabResult = async (labResultData) => {
  try {
    const token = localStorage.getItem('token');
    // Validate required fields
    if (!labResultData.medicalRecordId || !labResultData.doctorId || !labResultData.result || !labResultData.testDate) {
      throw new Error('Missing required lab result data');
    }
    const requestData = {
      medicalRecordId: labResultData.medicalRecordId,
      doctorId: 1,
      result: labResultData.result,
      cd4Count: labResultData.cd4Count,
      testDate: labResultData.testDate,
      note: labResultData.note || ''
    };
    const response = await fetch(`${API_BASE}/lab-result`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(requestData)
    });
    if (!response.ok) {
      let errorMessage = `Create lab result failed: ${response.status}`;
      try {
        const errorText = await response.text();
        if (errorText.includes('400')) {
          errorMessage = 'Thông tin kết quả xét nghiệm không hợp lệ';
        } else if (errorText.includes('401')) {
          errorMessage = 'Phiên đăng nhập đã hết hạn';
        }
      } catch {}
      throw new Error(errorMessage);
    }
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('❌ Create lab result error:', error);
    throw error;
  }
};

// Get all lab results
export const getAllLabResults = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/lab-result/getLabResults`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) {
      throw new Error(`Get lab results failed: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Get lab results error:', error);
    // Return fallback data
    return [];
  }
};

// Get lab results by medical record
export const getLabResultsByMedicalRecord = async (medicalRecordId) => {
  try {
    const token = localStorage.getItem('token');
    if (!medicalRecordId) throw new Error('Medical record ID is required');
    const response = await fetch(`${API_BASE}/lab-result/medical-record/${medicalRecordId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) {
      throw new Error(`Get lab results by medical record failed: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Get lab results by medical record error:', error);
    throw error;
  }
};

// Get lab results by doctor
export const getLabResultsByDoctor = async (doctorId) => {
  try {
    const token = localStorage.getItem('token');
    if (!doctorId) throw new Error('Doctor ID is required');
    const response = await fetch(`${API_BASE}/lab-result/doctor/${doctorId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) {
      throw new Error(`Get lab results by doctor failed: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Get lab results by doctor error:', error);
    throw error;
  }
};

// Get lab results by date range
export const getLabResultsByDateRange = async (startDate, endDate) => {
  try {
    const token = localStorage.getItem('token');
    if (!startDate || !endDate) throw new Error('Start date and end date are required');
    const response = await fetch(`${API_BASE}/lab-result/date-range?startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(endDate)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) {
      throw new Error(`Get lab results by date range failed: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Get lab results by date range error:', error);
    throw error;
  }
};

// Update lab result
export const updateLabResult = async (labResultId, labResultData) => {
  try {
    const token = localStorage.getItem('token');
    if (!labResultId) throw new Error('Lab result ID is required');
    const response = await fetch(`${API_BASE}/lab-result/${labResultId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(labResultData)
    });
    if (!response.ok) {
      throw new Error(`Update lab result failed: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Update lab result error:', error);
    throw error;
  }
};

// Delete lab result (optional)
export const deleteLabResult = async (labResultId) => {
  try {
    const token = localStorage.getItem('token');
    if (!labResultId) throw new Error('Lab result ID is required');
    const response = await fetch(`${API_BASE}/lab-result/${labResultId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) {
      throw new Error(`Delete lab result failed: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Delete lab result error:', error);
    throw error;
  }
};
