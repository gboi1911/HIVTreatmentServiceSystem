import { useState, useEffect, useCallback, useRef } from 'react';
import { message, notification } from 'antd';
import {
  getAllStaff,
  getStaffById,
  createStaff,
  updateStaff,
  deleteStaff,
  getActiveStaff,
  searchStaffByName,
  getStaffByGender
} from '../api/staff';

export const useStaffManagement = () => {
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [filters, setFilters] = useState({
    search: '',
    gender: '',
    isActive: ''
  });
  const [staffStats, setStaffStats] = useState({
    total: 0,
    active: 0,
    male: 0,
    female: 0
  });

  // Debounce timer ref
  const debounceTimer = useRef(null);

  // Load staff data
  const loadStaff = async () => {
    setLoading(true);
    try {
      let response;
      
      if (filters.search) {
        response = await searchStaffByName(filters.search);
      } else if (filters.gender) {
        response = await getStaffByGender(filters.gender);
      } else if (filters.isActive === 'true') {
        response = await getActiveStaff();
      } else {
        response = await getAllStaff();
      }

      const staffData = Array.isArray(response) ? response : [];
      setStaffList(staffData);
      
      // Calculate stats
      const stats = {
        total: staffData.length,
        active: staffData.filter(staff => !staff.isDeleted).length,
        male: staffData.filter(staff => staff.gender === 'Male').length,
        female: staffData.filter(staff => staff.gender === 'Female').length
      };
      setStaffStats(stats);
      
      setPagination(prev => ({
        ...prev,
        total: staffData.length
      }));
    } catch (error) {
      console.error('Load staff error:', error);
      message.error('Không thể tải danh sách nhân viên: ' + error.message);
      setStaffList([]);
    } finally {
      setLoading(false);
    }
  };

  // Create staff
  const handleCreateStaff = async (staffData) => {
    try {
      setLoading(true);
      await createStaff(staffData);
      message.success('Tạo nhân viên thành công');
      await loadStaff(); // Reload data
      return true;
    } catch (error) {
      console.error('Create staff error:', error);
      message.error('Tạo nhân viên thất bại: ' + error.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Update staff
  const handleUpdateStaff = async (staffId, staffData) => {
    try {
      setLoading(true);
      await updateStaff(staffId, staffData);
      message.success('Cập nhật nhân viên thành công');
      await loadStaff(); // Reload data
      return true;
    } catch (error) {
      console.error('Update staff error:', error);
      message.error('Cập nhật nhân viên thất bại: ' + error.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Delete staff with notification
  const handleDeleteStaff = async (staffId) => {
    try {
      setLoading(true);
      await deleteStaff(staffId);
      
      // Show success notification instead of message
      notification.success({
        message: 'Xóa nhân viên thành công',
        description: 'Nhân viên đã được xóa khỏi hệ thống.',
        placement: 'topRight',
      });
      
      await loadStaff(); // Reload data
      return true;
    } catch (error) {
      console.error('Delete staff error:', error);
      
      // Show error notification
      notification.error({
        message: 'Xóa nhân viên thất bại',
        description: error.message,
        placement: 'topRight',
      });
      
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Get staff detail
  const handleGetStaffDetail = async (staffId) => {
    try {
      setLoading(true);
      const staffDetail = await getStaffById(staffId);
      return staffDetail;
    } catch (error) {
      console.error('Get staff detail error:', error);
      message.error('Không thể tải thông tin chi tiết: ' + error.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Update filters with debounce for search
  const updateFilters = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setPagination(prev => ({ ...prev, current: 1 }));
  }, []);

  // Update pagination
  const updatePagination = (newPagination) => {
    setPagination(prev => ({ ...prev, ...newPagination }));
  };

  // Load initial data
  useEffect(() => {
    loadStaff();
  }, []);

  // Handle filter changes with debounce for search
  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    // If there's a search term, debounce it
    if (filters.search !== undefined) {
      debounceTimer.current = setTimeout(() => {
        loadStaff();
      }, 500);
    } else {
      // For other filters, load immediately
      loadStaff();
    }

    // Cleanup
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [filters]);

  return {
    // State
    staffList,
    loading,
    pagination,
    filters,
    staffStats,
    
    // Actions
    loadStaff,
    handleCreateStaff,
    handleUpdateStaff,
    handleDeleteStaff,
    handleGetStaffDetail,
    updateFilters,
    updatePagination
  };
};
