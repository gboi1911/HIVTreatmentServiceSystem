import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Table,
  Button,
  Input,
  Select,
  Space,
  Tag,
  Avatar,
  Form,
  message,
  Popconfirm,
  Card,
  Row,
  Col,
  Badge,
  Tooltip,
  Spin,
  notification
} from 'antd';
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  UserOutlined,
  ReloadOutlined,
  ExportOutlined
} from '@ant-design/icons';
import AdminSidebar from '../../components/AdminDashboard/AdminSidebar';
import { StaffModal } from '../../components/AdminDashboard/StaffModal';
import { StaffDetailDrawer } from '../../components/AdminDashboard/StaffDetailDrawer';
import { StaffStatsCards } from '../../components/AdminDashboard/StaffStatsCards';
import { useStaffManagement } from '../../hooks/useStaffManagement';
import { useNavigate } from 'react-router-dom';
import { useAuthStatus } from '../../hooks/useAuthStatus';

const { Option } = Select;

export const StaffManagement = () => {
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [modalType, setModalType] = useState('create'); // 'create', 'edit', 'view'
  
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { userInfo } = useAuthStatus();

  // Use the custom hook
  const {
    staffList,
    loading,
    filters,
    staffStats,
    loadStaff,
    handleCreateStaff,
    handleUpdateStaff,
    handleDeleteStaff,
    handleGetStaffDetail,
    updateFilters
  } = useStaffManagement();

  // Staff genders configuration
  const STAFF_GENDERS = [
    { value: 'Male', label: 'Nam', color: 'blue' },
    { value: 'Female', label: 'Nữ', color: 'pink' },
    { value: 'Other', label: 'Khác', color: 'default' }
  ];

  // Check admin access
  useEffect(() => {
    if (userInfo && !['admin', 'ADMIN', 'manager', 'MANAGER'].includes(userInfo.role)) {
      message.error('Bạn không có quyền truy cập trang này');
      navigate('/');
      return;
    }
  }, [userInfo, navigate]);

  // Handle search with debounce
  const handleSearch = (value) => {
    updateFilters({ search: value });
  };

  // Handle search change (for debounced search)
  const handleSearchChange = (e) => {
    updateFilters({ search: e.target.value });
  };

  // Handle filter change
  const handleFilterChange = (key, value) => {
    updateFilters({ [key]: value });
  };

  // Handle form submission for create/edit
  const handleFormSubmit = async (values) => {
    console.log('📝 StaffManagement - Form values received:', values);
    
    // Remove confirmPassword from the data sent to API
    const { confirmPassword, ...staffData } = values;
    console.log('📤 StaffManagement - Data to be sent to API:', staffData);
    
    const success = modalType === 'create' 
      ? await handleCreateStaff(staffData)
      : await handleUpdateStaff(selectedStaff.staffId, staffData);
    
    if (success) {
      setModalVisible(false);
      form.resetFields();
      setSelectedStaff(null);
    }
  };

  // Handle staff deletion with enhanced confirmation
  const handleStaffDeletion = async (staffId, staffName) => {
    return new Promise((resolve) => {
      notification.warning({
        message: 'Xác nhận xóa nhân viên',
        description: `Bạn có chắc chắn muốn xóa nhân viên "${staffName}"? Hành động này không thể hoàn tác.`,
        placement: 'topRight',
        duration: 0, // Don't auto-close
        btn: (
          <Space>
            <Button size="small" onClick={() => {
              notification.destroy();
              resolve(false);
            }}>
              Hủy
            </Button>
            <Button 
              type="primary" 
              danger 
              size="small" 
              onClick={async () => {
                notification.destroy();
                const success = await handleDeleteStaff(staffId);
                resolve(success);
              }}
            >
              Xóa
            </Button>
          </Space>
        ),
        onClose: () => resolve(false),
      });
    });
  };

  // Handle modal cancel
  const handleModalCancel = () => {
    setModalVisible(false);
    form.resetFields();
    setSelectedStaff(null);
  };

  // Open staff modal with proper form reset
  const openStaffModal = (type, staff = null) => {
    setModalType(type);
    setSelectedStaff(staff);
    setModalVisible(true);
    
    // Always reset form first to clear any previous data
    form.resetFields();
    
    // Only set values for edit mode, never for create mode
    if (staff && type === 'edit') {
      // Use setTimeout to ensure form is reset before setting values
      setTimeout(() => {
        form.setFieldsValue({
          name: staff.name,
          email: staff.email,
          phone: staff.phone,
          gender: staff.gender
        });
      }, 0);
    }
  };

  // Open staff detail drawer
  const openStaffDetail = async (staff) => {
    try {
      const staffDetail = await handleGetStaffDetail(staff.staffId);
      if (staffDetail) {
        setSelectedStaff(staffDetail);
        setDrawerVisible(true);
      }
    } catch (error) {
      message.error('Không thể tải thông tin chi tiết');
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
    message.success('Đăng xuất thành công');
    navigate('/login');
  };

  // Table columns
  const columns = [
    {
      title: 'Nhân viên',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <Space>
          <Avatar 
            icon={<UserOutlined />}
            size="default"
          />
          <div>
            <div className="font-medium">{text || 'N/A'}</div>
            <div className="text-sm text-gray-500">{record.email}</div>
          </div>
        </Space>
      ),
    },
    {
      title: 'Giới tính',
      dataIndex: 'gender',
      key: 'gender',
      render: (gender) => {
        const genderConfig = STAFF_GENDERS.find(g => g.value === gender);
        return (
          <Tag color={genderConfig?.color || 'default'}>
            {genderConfig?.label || gender}
          </Tag>
        );
      },
    },
    {
      title: 'Trạng thái',
      dataIndex: 'isDeleted',
      key: 'isDeleted',
      render: (isDeleted) => (
        <Badge 
          status={!isDeleted ? 'success' : 'error'} 
          text={!isDeleted ? 'Hoạt động' : 'Bị xóa'} 
        />
      ),
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
      key: 'phone',
      render: (phone) => phone || 'N/A',
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 200,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Xem chi tiết">
            <Button 
              type="text" 
              icon={<EyeOutlined />} 
              onClick={() => openStaffDetail(record)}
            />
          </Tooltip>
          <Tooltip title="Chỉnh sửa">
            <Button 
              type="text" 
              icon={<EditOutlined />} 
              onClick={() => openStaffModal('edit', record)}
            />
          </Tooltip>
          {!record.isDeleted && (
            <Tooltip title="Xóa">
              <Button 
                type="text" 
                danger 
                icon={<DeleteOutlined />}
                onClick={() => handleStaffDeletion(record.staffId, record.name)}
              />
            </Tooltip>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar onLogout={handleLogout} />
      
      <div className="flex-1 ml-64 p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Quản lý nhân viên</h1>
          <p className="text-gray-600">Quản lý tất cả nhân viên trong hệ thống</p>
        </div>

        {/* Statistics Cards */}
        <StaffStatsCards staffStats={staffStats} />

        {/* Filters and Actions */}
        <Card className="mb-6">
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} sm={12} lg={8}>
              <Input.Search
                placeholder="Tìm kiếm theo tên..."
                onChange={handleSearchChange}
                onSearch={handleSearch}
                allowClear
                value={filters.search}
                enterButton={<SearchOutlined />}
              />
            </Col>
            <Col xs={24} sm={6} lg={4}>
              <Select
                placeholder="Giới tính"
                onChange={(value) => handleFilterChange('gender', value)}
                allowClear
                style={{ width: '100%' }}
              >
                {STAFF_GENDERS.map(gender => (
                  <Option key={gender.value} value={gender.value}>
                    {gender.label}
                  </Option>
                ))}
              </Select>
            </Col>
            <Col xs={24} sm={6} lg={4}>
              <Select
                placeholder="Trạng thái"
                onChange={(value) => handleFilterChange('isActive', value)}
                allowClear
                style={{ width: '100%' }}
              >
                <Option value="true">Hoạt động</Option>
                <Option value="false">Bị xóa</Option>
              </Select>
            </Col>
            <Col xs={24} sm={12} lg={8}>
              <Space>
                <Button 
                  type="primary" 
                  icon={<PlusOutlined />}
                  onClick={() => openStaffModal('create')}
                >
                  Thêm nhân viên
                </Button>
                <Button 
                  icon={<ReloadOutlined />} 
                  onClick={loadStaff}
                >
                  Làm mới
                </Button>
                <Button icon={<ExportOutlined />}>
                  Xuất Excel
                </Button>
              </Space>
            </Col>
          </Row>
        </Card>

        {/* Staff Table */}
        <Card>
          <Table
            columns={columns}
            dataSource={staffList}
            rowKey="staffId"
            loading={loading}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => 
                `${range[0]}-${range[1]} của ${total} nhân viên`,
            }}
            scroll={{ x: 800 }}
          />
        </Card>

        {/* Create/Edit Staff Modal */}
        <StaffModal
          visible={modalVisible}
          modalType={modalType}
          selectedStaff={selectedStaff}
          onCancel={handleModalCancel}
          onSubmit={handleFormSubmit}
          loading={loading}
          form={form}
        />

        {/* Staff Detail Drawer */}
        <StaffDetailDrawer
          visible={drawerVisible}
          selectedStaff={selectedStaff}
          onClose={() => setDrawerVisible(false)}
          onEdit={(staff) => openStaffModal('edit', staff)}
        />
      </div>
    </div>
  );
};
