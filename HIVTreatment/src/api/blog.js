const API_BASE = "https://hiv.purepixel.io.vn/api";

// Get all blogs
export const getBlogs = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/blog/getBlogs`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`Get blogs failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Get blogs error:', error);
    // Return fallback data
    return [
      {
        blogId: 1,
        title: "Hiểu về HIV và AIDS",
        content: "HIV là virus gây suy giảm miễn dịch ở người...",
        staffName: "BS. Nguyễn Văn A",
        createDate: "2024-06-01T10:00:00"
      }
    ];
  }
};

// Get blog by ID
export const getBlogById = async (blogId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/blog/${blogId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`Get blog failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Get blog error:', error);
    throw error;
  }
};

// Create blog
export const createBlog = async (blogData) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/blog`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        title: blogData.title,
        content: blogData.content,
        staffId: blogData.staffId
      })
    });

    if (!response.ok) {
      throw new Error(`Create blog failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Create blog error:', error);
    throw error;
  }
};

// Update blog
export const updateBlog = async (blogId, blogData) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/blog/${blogId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        title: blogData.title,
        content: blogData.content,
        staffId: blogData.staffId
      })
    });

    if (!response.ok) {
      throw new Error(`Update blog failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Update blog error:', error);
    throw error;
  }
};

// Delete blog
export const deleteBlog = async (blogId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/blog/${blogId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`Delete blog failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Delete blog error:', error);
    throw error;
  }
};

// Search blogs by title
export const searchBlogsByTitle = async (keyword) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/blog/search/title?keyword=${encodeURIComponent(keyword)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`Search blogs failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Search blogs error:', error);
    throw error;
  }
};

// Search blogs by content
export const searchBlogsByContent = async (keyword) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/blog/search/content?keyword=${encodeURIComponent(keyword)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`Search blogs failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Search blogs error:', error);
    throw error;
  }
};

// Get blogs by staff
export const getBlogsByStaff = async (staffId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/blog/staff/${staffId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`Get blogs by staff failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Get blogs by staff error:', error);
    throw error;
  }
};

// Get blogs by date range
export const getBlogsByDateRange = async (startDate, endDate) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/blog/date-range?startDate=${startDate}&endDate=${endDate}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`Get blogs by date range failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Get blogs by date range error:', error);
    throw error;
  }
};