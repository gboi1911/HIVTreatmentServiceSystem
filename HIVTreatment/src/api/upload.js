const API_BASE = "https://hiv.purepixel.io.vn/api";

// Upload avatar
export const uploadAvatar = async (file) => {
  try {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('avatar', file);

    const response = await fetch(`${API_BASE}/upload/avatar`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    if (!response.ok) {
      throw new Error(`Upload avatar failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Upload avatar error:', error);
    throw error;
  }
};

// Upload document (medical records, test results, etc.)
export const uploadDocument = async (file, documentType = 'medical_record') => {
  try {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('document', file);
    formData.append('type', documentType);

    const response = await fetch(`${API_BASE}/upload/document`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    if (!response.ok) {
      throw new Error(`Upload document failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Upload document error:', error);
    throw error;
  }
};

// Upload multiple files
export const uploadMultipleFiles = async (files, fileType = 'document') => {
  try {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    
    files.forEach((file, index) => {
      formData.append(`files`, file);
    });
    formData.append('type', fileType);

    const response = await fetch(`${API_BASE}/upload/multiple`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    if (!response.ok) {
      throw new Error(`Upload multiple files failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Upload multiple files error:', error);
    throw error;
  }
};

// Delete uploaded file
export const deleteFile = async (fileId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/upload/files/${fileId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`Delete file failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Delete file error:', error);
    throw error;
  }
};

// Get user's uploaded files
export const getUserFiles = async (fileType = '') => {
  try {
    const token = localStorage.getItem('token');
    const queryParams = fileType ? `?type=${fileType}` : '';
    
    const response = await fetch(`${API_BASE}/upload/files${queryParams}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`Get user files failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Get user files error:', error);
    throw error;
  }
};

// Download file
export const downloadFile = async (fileId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/upload/files/${fileId}/download`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`Download file failed: ${response.status}`);
    }

    return await response.blob();
  } catch (error) {
    console.error('Download file error:', error);
    throw error;
  }
};
