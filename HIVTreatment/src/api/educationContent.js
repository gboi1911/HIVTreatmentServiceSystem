const API_BASE = "https://hiv.purepixel.io.vn/api";

// Get all education contents
export const getEducationContents = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/education-content/getEducationContents`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`Get education contents failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Get education contents error:', error);
    // Return fallback data
    return [
      {
        postId: 1,
        title: "Phòng ngừa HIV hiệu quả",
        content: "Hướng dẫn chi tiết về các biện pháp phòng ngừa HIV...",
        staffName: "BS. Nguyễn Thị C",
        createdAt: "2024-06-01T10:00:00"
      }
    ];
  }
};

// Get education content by ID
export const getEducationContentById = async (contentId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/education-content/${contentId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`Get education content failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Get education content error:', error);
    throw error;
  }
};

// Create education content
export const createEducationContent = async (contentData) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/education-content`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        title: contentData.title,
        content: contentData.content,
        staffId: contentData.staffId
      })
    });

    if (!response.ok) {
      throw new Error(`Create education content failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Create education content error:', error);
    throw error;
  }
};

// Update education content
export const updateEducationContent = async (contentId, contentData) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/education-content/${contentId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        title: contentData.title,
        content: contentData.content,
        staffId: contentData.staffId
      })
    });

    if (!response.ok) {
      throw new Error(`Update education content failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Update education content error:', error);
    throw error;
  }
};

// Delete education content
export const deleteEducationContent = async (contentId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/education-content/${contentId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`Delete education content failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Delete education content error:', error);
    throw error;
  }
};

// Search education contents by title
export const searchEducationContentsByTitle = async (keyword) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/education-content/search/title?keyword=${encodeURIComponent(keyword)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`Search education contents failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Search education contents error:', error);
    throw error;
  }
};

// Search education contents by content
export const searchEducationContentsByContent = async (keyword) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/education-content/search/content?keyword=${encodeURIComponent(keyword)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`Search education contents failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Search education contents error:', error);
    throw error;
  }
};

// Get education contents by staff
export const getEducationContentsByStaff = async (staffId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/education-content/staff/${staffId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`Get education contents by staff failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Get education contents by staff error:', error);
    throw error;
  }
};

// Get education contents by date range
export const getEducationContentsByDateRange = async (startDate, endDate) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/education-content/date-range?startDate=${startDate}&endDate=${endDate}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`Get education contents by date range failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Get education contents by date range error:', error);
    throw error;
  }
};