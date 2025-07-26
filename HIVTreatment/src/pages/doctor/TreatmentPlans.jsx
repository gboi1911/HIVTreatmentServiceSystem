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
  Badge,
  Form,
  Descriptions,
  Typography,
  Tabs,
  Alert,
  Statistic
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
  CalendarOutlined,
  UserOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { 
  getTreatmentPlans, 
  getTreatmentPlansByDoctor,
  getTreatmentPlansByMedicalRecord,
  deleteTreatmentPlan,
  getTreatmentPlanStatuses,
  updateTreatmentPlan,
  createTreatmentPlan
} from '../../api/treatmentPlan';
import { getMedicalRecordsByDoctor, getMedicalRecords } from '../../api/medicalRecord';
import { useAuthStatus } from '../../hooks/useAuthStatus';
import { formatDate } from '../../utils/formatDate';
import moment from 'moment';
import dayjs from 'dayjs';

const { Option } = Select;
const { RangePicker } = DatePicker;
const { Title, Text } = Typography;
const { TabPane } = Tabs;

const ARV_REGIMEN_OPTIONS = [
  'TDF/FTC/EFV',
  'ABC/3TC/DTG',
  'TAF/FTC/BIC',
  'AZT/3TC/LPV/r',
  'ABC/3TC + RAL',
  'TDF/3TC/EFV',
  'TDF/3TC/DTG',
  'AZT/3TC/NVP',
];

const APPLICABLE_GROUP_OPTIONS = [
  'Người lớn mới bắt đầu điều trị',
  'Người lớn, thay thế TDF',
  'Người lớn, có vấn đề về thận',
  'Phụ nữ nhiễm HIV',
  'Trẻ em và thanh thiếu niên',
  'Bệnh nhân có kháng thuốc',
  'Bệnh nhân có bệnh lý kèm theo',
];

const TreatmentPlans = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [dateRange, setDateRange] = useState([null, null]);
  const navigate = useNavigate();
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [editForm] = Form.useForm();
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [addForm] = Form.useForm();
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [activeTab, setActiveTab] = useState('1');
  const { userInfo } = useAuthStatus();

  const statuses = getTreatmentPlanStatuses();

  // Statistics state
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    completed: 0,
    thisMonth: 0
  });

  // Load treatment plans
  const loadTreatmentPlans = async () => {
    setLoading(true);
    try {
      const data = await getTreatmentPlans();
      console.log('Treatment plans data:', data);
      
      const plansList = Array.isArray(data) ? data : [];
      setPlans(plansList);
      
      // Calculate statistics
      const now = new Date();
      const thisMonth = plansList.filter(plan => {
        const planDate = new Date(plan.startDate || plan.createdAt);
        return planDate.getMonth() === now.getMonth() && 
               planDate.getFullYear() === now.getFullYear();
      });
      
      setStats({
        total: plansList.length,
        active: plansList.filter(p => p.status === 'ACTIVE').length,
        completed: plansList.filter(p => p.status === 'COMPLETED').length,
        thisMonth: thisMonth.length
      });
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

  // Fetch medical records for current doctor
  const fetchMedicalRecords = async () => {
    if (!userInfo?.id) return;
    try {
      const data = await getMedicalRecords();
      setMedicalRecords(Array.isArray(data) ? data : (data.data || []));
    } catch (error) {
      setMedicalRecords([]);
    }
  };

  useEffect(() => {
    if (addModalVisible) fetchMedicalRecords();
  }, [addModalVisible, userInfo?.id]);

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

  // Show detail modal
  const showDetailModal = (plan) => {
    setSelectedPlan(plan);
    setDetailModalVisible(true);
  };

  // Show edit modal
  const showEditModal = async (plan) => {
    setEditingPlan(plan);
    setEditModalVisible(true);
    await fetchMedicalRecords();
    editForm.setFieldsValue({
      ...plan,
      startDate: plan.startDate ? moment(plan.startDate) : null,
    });
  };

  // Handle edit submit
  const handleEditSubmit = async (values) => {
    try {
      setLoading(true);
      const payload = {
        medicalRecordId: values.medicalRecordId,
        doctorId: userInfo.id,
        arvRegimen: values.arvRegimen,
        applicableGroup: values.applicableGroup,
        note: values.note || '',
        startDate: values.startDate && moment.isMoment(values.startDate)
          ? values.startDate.format('YYYY-MM-DD')
          : values.startDate || null,
      };
      
      await updateTreatmentPlan(editingPlan.planId, payload);
      message.success('Cập nhật kế hoạch điều trị thành công');
      setEditModalVisible(false);
      setEditingPlan(null);
      await loadTreatmentPlans();
    } catch (error) {
      message.error('Cập nhật kế hoạch điều trị thất bại');
    } finally {
      setLoading(false);
    }
  };

  // Handle add submit
  const handleAddSubmit = async (values) => {
    try {
      setLoading(true);
      const payload = {
        medicalRecordId: values.medicalRecordId,
        doctorId: userInfo.id,
        arvRegimen: values.arvRegimen,
        applicableGroup: values.applicableGroup,
        note: values.note || '',
        startDate: values.startDate && moment.isMoment(values.startDate)
          ? values.startDate.format('YYYY-MM-DD')
          : values.startDate || null,
      };
      
      await createTreatmentPlan(payload);
      message.success('Tạo kế hoạch điều trị thành công');
      setAddModalVisible(false);
      addForm.resetFields();
      await loadTreatmentPlans();
    } catch (error) {
      message.error('Tạo kế hoạch điều trị thất bại');
    } finally {
      setLoading(false);
    }
  };

  // Filter plans based on search and filters
  const getFilteredPlans = () => {
    return plans.filter(plan => {
      // Filter by search text
      const searchMatch = !searchText || 
        plan.customerName?.toLowerCase().includes(searchText.toLowerCase()) ||
        plan.arvRegimen?.toLowerCase().includes(searchText.toLowerCase()) ||
        plan.planId?.toString().includes(searchText);
      
      // Filter by status
      const statusMatch = filterStatus === 'all' || plan.status === filterStatus;
      
      // Filter by date range
      let dateMatch = true;
      if (dateRange && dateRange[0] && dateRange[1]) {
        const planDate = dayjs(plan.startDate || plan.createdAt);
        dateMatch = planDate.isAfter(dateRange[0]) && planDate.isBefore(dateRange[1]);
      }
      
      return searchMatch && statusMatch && dateMatch;
    });
  };

  // Table columns
  const columns = [
    {
      title: 'Mã kế hoạch',
      dataIndex: 'planId',
      key: 'planId',
      width: 100,
    },
    {
      title: 'Bệnh nhân',
      dataIndex: 'customerName',
      key: 'customerName',
      render: (text, record) => (
        <Space direction="vertical" size={0}>
          <Text strong>{text || 'Không có tên'}</Text>
          <Text type="secondary">{record.customerPhone || 'Không có SĐT'}</Text>
        </Space>
      )
    },
    {
      title: 'Phác đồ ARV',
      dataIndex: 'arvRegimen',
      key: 'arvRegimen',
      render: (text) => (
        <Tag color="blue" icon={<MedicineBoxOutlined />}>
          {text}
        </Tag>
      )
    },
    {
      title: 'Nhóm áp dụng',
      dataIndex: 'applicableGroup',
      key: 'applicableGroup',
      ellipsis: true,
    },
    {
      title: 'Ngày bắt đầu',
      dataIndex: 'startDate',
      key: 'startDate',
      render: (text) => text ? dayjs(text).format('DD/MM/YYYY') : 'Chưa có'
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        let color = 'default';
        let icon = null;
        
        switch(status) {
          case 'ACTIVE':
            color = 'green';
            icon = <CheckCircleOutlined />;
            break;
          case 'COMPLETED':
            color = 'blue';
            icon = <CheckCircleOutlined />;
            break;
          case 'PENDING':
            color = 'orange';
            icon = <ClockCircleOutlined />;
            break;
          default:
            color = 'default';
        }
        
        return (
          <Tag color={color}>
            {icon} {status}
          </Tag>
        );
      }
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Space size="small">
          <Button 
            type="primary" 
            size="small" 
            icon={<EyeOutlined />} 
            onClick={() => showDetailModal(record)}
          >
            Chi tiết
          </Button>
          <Button 
            type="default" 
            size="small" 
            icon={<EditOutlined />} 
            onClick={() => showEditModal(record)}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa kế hoạch điều trị này?"
            onConfirm={() => handleDelete(record.planId)}
            okText="Có"
            cancelText="Không"
          >
            <Button 
              type="default" 
              danger 
              size="small" 
              icon={<DeleteOutlined />}
            >
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Title level={3}>Quản lý kế hoạch điều trị</Title>
      <Text type="secondary" style={{ marginBottom: 20, display: 'block' }}>
        Quản lý các phác đồ điều trị ARV cho bệnh nhân
      </Text>
      
      {/* Statistics Cards */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic 
              title="Tổng số kế hoạch" 
              value={stats.total} 
              prefix={<MedicineBoxOutlined />} 
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic 
              title="Đang điều trị" 
              value={stats.active} 
              prefix={<CheckCircleOutlined />} 
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic 
              title="Đã hoàn thành" 
              value={stats.completed} 
              prefix={<CheckCircleOutlined />} 
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic 
              title="Tháng này" 
              value={stats.thisMonth} 
              prefix={<CalendarOutlined />} 
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Search and Filter */}
      <Card style={{ marginBottom: 24 }}>
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col span={8}>
            <Input 
              placeholder="Tìm theo tên bệnh nhân, phác đồ ARV, mã kế hoạch" 
              prefix={<SearchOutlined />} 
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              allowClear
            />
          </Col>
          <Col span={4}>
            <Select 
              placeholder="Trạng thái" 
              value={filterStatus}
              onChange={setFilterStatus}
              allowClear
            >
              <Option value="all">Tất cả</Option>
              <Option value="ACTIVE">Đang điều trị</Option>
              <Option value="COMPLETED">Đã hoàn thành</Option>
              <Option value="PENDING">Chờ xử lý</Option>
            </Select>
          </Col>
          <Col span={6}>
            <RangePicker 
              placeholder={['Từ ngày', 'Đến ngày']}
              onChange={(dates) => setDateRange(dates)}
            />
          </Col>
          <Col span={6}>
            <Space>
              <Button 
                type="primary" 
                icon={<PlusOutlined />}
                onClick={() => {
                  setAddModalVisible(true);
                  fetchMedicalRecords();
                }}
              >
                Tạo mới
              </Button>
              <Button 
                icon={<ReloadOutlined />} 
                onClick={loadTreatmentPlans}
                loading={loading}
              >
                Làm mới
              </Button>
            </Space>
          </Col>
        </Row>
        
        <Table
          columns={columns}
          dataSource={getFilteredPlans()}
          rowKey="planId"
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Card>

      {/* Detail Modal */}
      <Modal
        title={
          <Space>
            <MedicineBoxOutlined />
            <span>Chi tiết kế hoạch điều trị #{selectedPlan?.planId}</span>
          </Space>
        }
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        width={800}
        footer={[
          <Button key="close" onClick={() => setDetailModalVisible(false)}>
            Đóng
          </Button>,
          <Button 
            key="edit" 
            type="primary"
            icon={<EditOutlined />}
            onClick={() => {
              setDetailModalVisible(false);
              showEditModal(selectedPlan);
            }}
          >
            Chỉnh sửa
          </Button>
        ]}
      >
        {selectedPlan && (
          <Tabs activeKey={activeTab} onChange={setActiveTab}>
            <TabPane tab="Thông tin kế hoạch" key="1">
              <Descriptions bordered column={1}>
                <Descriptions.Item label="Mã kế hoạch">{selectedPlan.planId}</Descriptions.Item>
                <Descriptions.Item label="Bệnh nhân">{selectedPlan.customerName}</Descriptions.Item>
                <Descriptions.Item label="Bác sĩ phụ trách">{selectedPlan.doctorName}</Descriptions.Item>
                <Descriptions.Item label="Phác đồ ARV">
                  <Tag color="blue">{selectedPlan.arvRegimen}</Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Nhóm áp dụng">{selectedPlan.applicableGroup}</Descriptions.Item>
                <Descriptions.Item label="Ngày bắt đầu">
                  {selectedPlan.startDate ? dayjs(selectedPlan.startDate).format('DD/MM/YYYY') : 'Chưa có'}
                </Descriptions.Item>
                <Descriptions.Item label="Trạng thái">
                  <Tag color={selectedPlan.status === 'ACTIVE' ? 'green' : 'blue'}>
                    {selectedPlan.status}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Ghi chú">{selectedPlan.note || 'Không có'}</Descriptions.Item>
              </Descriptions>
            </TabPane>
            <TabPane tab="Hướng dẫn điều trị" key="2">
              <Alert
                message="Hướng dẫn sử dụng thuốc"
                description={
                  <div>
                    <p><strong>Phác đồ:</strong> {selectedPlan.arvRegimen}</p>
                    <p><strong>Liều lượng:</strong> Theo chỉ định của bác sĩ</p>
                    <p><strong>Thời gian uống:</strong> Hàng ngày, đúng giờ</p>
                    <p><strong>Lưu ý:</strong> Không được bỏ liều, cần tái khám định kỳ</p>
                  </div>
                }
                type="info"
                showIcon
                style={{ marginBottom: 16 }}
              />
              <Alert
                message="Lịch tái khám"
                description="Bệnh nhân cần tái khám sau 2 tuần kể từ khi bắt đầu điều trị để đánh giá hiệu quả và tác dụng phụ."
                type="warning"
                showIcon
              />
            </TabPane>
          </Tabs>
        )}
      </Modal>

      {/* Edit Modal */}
      <Modal
        title={
          <Space>
            <EditOutlined />
            <span>Chỉnh sửa kế hoạch điều trị #{editingPlan?.planId}</span>
          </Space>
        }
        open={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form
          form={editForm}
          layout="vertical"
          onFinish={handleEditSubmit}
        >
          <Form.Item 
            name="medicalRecordId" 
            label="Hồ sơ bệnh án" 
            rules={[{ required: true, message: 'Vui lòng chọn hồ sơ bệnh án' }]}
          >
            <Select placeholder="Chọn hồ sơ bệnh án">
              {medicalRecords.map(record => (
                <Option key={record.medicalRecordId} value={record.medicalRecordId}>
                  {record.customerName} - {record.medicalRecordId}
                </Option>
              ))}
            </Select>
          </Form.Item>
          
          <Form.Item 
            name="arvRegimen" 
            label="Phác đồ ARV" 
            rules={[{ required: true, message: 'Vui lòng chọn phác đồ ARV' }]}
          >
            <Select placeholder="Chọn phác đồ ARV" allowClear showSearch>
              {ARV_REGIMEN_OPTIONS.map(regimen => (
                <Option key={regimen} value={regimen}>{regimen}</Option>
              ))}
            </Select>
          </Form.Item>
          
          <Form.Item 
            name="applicableGroup" 
            label="Nhóm áp dụng" 
            rules={[{ required: true, message: 'Vui lòng chọn nhóm áp dụng' }]}
          >
            <Select placeholder="Chọn nhóm áp dụng" allowClear showSearch>
              {APPLICABLE_GROUP_OPTIONS.map(group => (
                <Option key={group} value={group}>{group}</Option>
              ))}
            </Select>
          </Form.Item>
          
          <Form.Item name="startDate" label="Ngày bắt đầu">
            <DatePicker placeholder="Chọn ngày bắt đầu" style={{ width: '100%' }} />
          </Form.Item>
          
          <Form.Item name="note" label="Ghi chú">
            <Input.TextArea rows={4} placeholder="Nhập ghi chú cho kế hoạch điều trị" />
          </Form.Item>
          
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" icon={<EditOutlined />}>
                Cập nhật
              </Button>
              <Button onClick={() => setEditModalVisible(false)}>
                Hủy
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Add Modal */}
      <Modal
        title={
          <Space>
            <PlusOutlined />
            <span>Tạo kế hoạch điều trị mới</span>
          </Space>
        }
        open={addModalVisible}
        onCancel={() => setAddModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form
          form={addForm}
          layout="vertical"
          onFinish={handleAddSubmit}
        >
          <Form.Item 
            name="medicalRecordId" 
            label="Hồ sơ bệnh án" 
            rules={[{ required: true, message: 'Vui lòng chọn hồ sơ bệnh án' }]}
          >
            <Select placeholder="Chọn hồ sơ bệnh án">
              {medicalRecords.map(record => (
                <Option key={record.medicalRecordId} value={record.medicalRecordId}>
                  {record.customerName} - {record.medicalRecordId}
                </Option>
              ))}
            </Select>
          </Form.Item>
          
          <Form.Item 
            name="arvRegimen" 
            label="Phác đồ ARV" 
            rules={[{ required: true, message: 'Vui lòng chọn phác đồ ARV' }]}
          >
            <Select placeholder="Chọn phác đồ ARV" allowClear showSearch>
              {ARV_REGIMEN_OPTIONS.map(regimen => (
                <Option key={regimen} value={regimen}>{regimen}</Option>
              ))}
            </Select>
          </Form.Item>
          
          <Form.Item 
            name="applicableGroup" 
            label="Nhóm áp dụng" 
            rules={[{ required: true, message: 'Vui lòng chọn nhóm áp dụng' }]}
          >
            <Select placeholder="Chọn nhóm áp dụng" allowClear showSearch>
              {APPLICABLE_GROUP_OPTIONS.map(group => (
                <Option key={group} value={group}>{group}</Option>
              ))}
            </Select>
          </Form.Item>
          
          <Form.Item name="startDate" label="Ngày bắt đầu">
            <DatePicker placeholder="Chọn ngày bắt đầu" style={{ width: '100%' }} />
          </Form.Item>
          
          <Form.Item name="note" label="Ghi chú">
            <Input.TextArea rows={4} placeholder="Nhập ghi chú cho kế hoạch điều trị" />
          </Form.Item>
          
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" icon={<PlusOutlined />}>
                Tạo kế hoạch
              </Button>
              <Button onClick={() => setAddModalVisible(false)}>
                Hủy
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TreatmentPlans;
