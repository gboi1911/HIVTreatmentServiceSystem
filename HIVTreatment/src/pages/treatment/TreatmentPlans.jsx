import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Button, 
  Space, 
  Tag, 
  Card, 
  Tooltip, 
  Input, 
  Select, 
  DatePicker, 
  Row, 
  Col, 
  message,
  Modal,
  Popconfirm,
  Badge
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  EyeOutlined, 
  SearchOutlined,
  FilterOutlined,
  DownloadOutlined,
  ReloadOutlined,
  MedicineBoxOutlined,
  CalendarOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { 
  getTreatmentPlans, 
  getTreatmentPlansByDoctor,
  getTreatmentPlansByMedicalRecord,
  deleteTreatmentPlan,
  getTreatmentPlanStatuses
} from '../../api/treatmentPlan';
import { formatDate } from '../../utils/formatDate';

const { Option } = Select;
const { RangePicker } = DatePicker;

const TreatmentPlans = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDoctor, setFilterDoctor] = useState('all');
  const [dateRange, setDateRange] = useState([null, null]);
  const navigate = useNavigate();

  const statuses = getTreatmentPlanStatuses();

  // Load treatment plans
  const loadTreatmentPlans = async () => {
    setLoading(true);
    try {
      const data = await getTreatmentPlans();
      setPlans(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error loading treatment plans:', error);
      message.error('Không thể tải danh sách kế hoạch điều trị');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTreatmentPlans();
  }, []);

  // Delete treatment plan
  const handleDelete = async (planId) => {
    try {
      await deleteTreatmentPlan(planId);
      message.success('Xóa kế hoạch điều trị thành công');
      loadTreatmentPlans();
    } catch (error) {
      message.error('Không thể xóa kế hoạch điều trị');
    }
  };

  // Get status configuration
  const getStatusConfig = (status) => {
    const config = statuses.find(s => s.value === status);
    return config || { label: status, color: 'default' };
  };

  // Calculate treatment duration
  const getTreatmentDuration = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : new Date();
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 30) {
      return `${diffDays} ngày`;
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `${months} tháng`;
    } else {
      const years = Math.floor(diffDays / 365);
      const months = Math.floor((diffDays % 365) / 30);
      return `${years} năm ${months > 0 ? months + ' tháng' : ''}`;
    }
  };

  // Filter plans based on search text and filters
  const filteredPlans = plans.filter(plan => {
    const searchLower = searchText.toLowerCase();
    const matchesSearch = 
      plan.patientName?.toLowerCase().includes(searchLower) ||
      plan.doctorName?.toLowerCase().includes(searchLower) ||
      plan.arvRegimen?.toLowerCase().includes(searchLower) ||
      plan.applicableGroup?.toLowerCase().includes(searchLower);

    const matchesStatus = filterStatus === 'all' || plan.status === filterStatus;
    const matchesDoctor = filterDoctor === 'all' || plan.doctorId.toString() === filterDoctor;

    return matchesSearch && matchesStatus && matchesDoctor;
  });

  const columns = [
    {
      title: 'Mã kế hoạch',
      dataIndex: 'planId',
      key: 'planId',
      width: 120,
      render: (id) => `#${id}`,
    },
    {
      title: 'Bệnh nhân',
      dataIndex: 'patientName',
      key: 'patientName',
      ellipsis: true,
      render: (name, record) => (
        <div>
          <div style={{ fontWeight: 500 }}>{name}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            Hồ sơ: #{record.medicalRecordId}
          </div>
        </div>
      ),
    },
    {
      title: 'Bác sĩ phụ trách',
      dataIndex: 'doctorName',
      key: 'doctorName',
      ellipsis: true,
      render: (name, record) => (
        <div>
          <div>{name}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            ID: {record.doctorId}
          </div>
        </div>
      ),
    },
    {
      title: 'Phác đồ ARV',
      dataIndex: 'arvRegimen',
      key: 'arvRegimen',
      width: 150,
      render: (regimen) => (
        <div>
          <div style={{ fontWeight: 500, color: '#1890ff' }}>{regimen}</div>
        </div>
      ),
    },
    {
      title: 'Nhóm áp dụng',
      dataIndex: 'applicableGroup',
      key: 'applicableGroup',
      ellipsis: true,
      render: (group) => (
        <Tooltip title={group}>
          <span style={{ fontSize: '12px' }}>{group}</span>
        </Tooltip>
      ),
    },
    {
      title: 'Thời gian điều trị',
      key: 'duration',
      width: 140,
      render: (_, record) => (
        <div>
          <div style={{ fontSize: '12px' }}>
            Bắt đầu: {formatDate(record.startDate)}
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            Thời gian: {getTreatmentDuration(record.startDate, record.endDate)}
          </div>
        </div>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status) => {
        const config = getStatusConfig(status);
        return <Tag color={config.color}>{config.label}</Tag>;
      },
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 150,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Xem chi tiết">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => navigate(`/treatment-plans/${record.planId}`)}
            />
          </Tooltip>
          <Tooltip title="Chỉnh sửa">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => navigate(`/treatment-plans/edit/${record.planId}`)}
            />
          </Tooltip>
          <Popconfirm
            title="Xóa kế hoạch điều trị"
            description="Bạn có chắc chắn muốn xóa kế hoạch điều trị này không?"
            onConfirm={() => handleDelete(record.planId)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Tooltip title="Xóa">
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <div style={{ marginBottom: '24px' }}>
          <Row gutter={[16, 16]} align="middle">
            <Col flex="auto">
              <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 600 }}>
                <MedicineBoxOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
                Quản lý Kế hoạch Điều trị
              </h2>
              <p style={{ margin: '8px 0 0 0', color: '#666' }}>
                Quản lý phác đồ ARV và kế hoạch điều trị HIV cho bệnh nhân
              </p>
            </Col>
            <Col>
              <Space>
                <Button
                  icon={<ReloadOutlined />}
                  onClick={loadTreatmentPlans}
                  loading={loading}
                >
                  Tải lại
                </Button>
                <Button
                  icon={<DownloadOutlined />}
                  onClick={() => message.info('Chức năng xuất dữ liệu đang phát triển')}
                >
                  Xuất Excel
                </Button>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => navigate('/treatment-plans/new')}
                >
                  Tạo kế hoạch mới
                </Button>
              </Space>
            </Col>
          </Row>
        </div>

        {/* Statistics Cards */}
        <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
          <Col xs={24} sm={6}>
            <Card size="small">
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#52c41a' }}>
                  {filteredPlans.filter(p => p.status === 'ACTIVE').length}
                </div>
                <div style={{ color: '#666' }}>Đang điều trị</div>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={6}>
            <Card size="small">
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#faad14' }}>
                  {filteredPlans.filter(p => p.status === 'PAUSED').length}
                </div>
                <div style={{ color: '#666' }}>Tạm ngưng</div>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={6}>
            <Card size="small">
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1890ff' }}>
                  {filteredPlans.filter(p => p.status === 'COMPLETED').length}
                </div>
                <div style={{ color: '#666' }}>Hoàn thành</div>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={6}>
            <Card size="small">
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ff4d4f' }}>
                  {filteredPlans.filter(p => p.status === 'DISCONTINUED').length}
                </div>
                <div style={{ color: '#666' }}>Ngừng điều trị</div>
              </div>
            </Card>
          </Col>
        </Row>

        {/* Filters */}
        <Card size="small" style={{ marginBottom: '16px' }}>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={8}>
              <Input
                placeholder="Tìm kiếm bệnh nhân, bác sĩ, phác đồ..."
                prefix={<SearchOutlined />}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                allowClear
              />
            </Col>
            <Col xs={24} sm={12} md={4}>
              <Select
                placeholder="Trạng thái"
                value={filterStatus}
                onChange={setFilterStatus}
                style={{ width: '100%' }}
              >
                <Option value="all">Tất cả trạng thái</Option>
                {statuses.map(status => (
                  <Option key={status.value} value={status.value}>
                    {status.label}
                  </Option>
                ))}
              </Select>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <RangePicker
                placeholder={['Ngày bắt đầu', 'Ngày kết thúc']}
                value={dateRange}
                onChange={setDateRange}
                style={{ width: '100%' }}
              />
            </Col>
          </Row>
        </Card>

        {/* Table */}
        <Table
          columns={columns}
          dataSource={filteredPlans}
          rowKey="planId"
          loading={loading}
          pagination={{
            total: filteredPlans.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `${range[0]}-${range[1]} của ${total} kế hoạch điều trị`,
          }}
          scroll={{ x: 1400 }}
        />
      </Card>
    </div>
  );
};

export default TreatmentPlans;
