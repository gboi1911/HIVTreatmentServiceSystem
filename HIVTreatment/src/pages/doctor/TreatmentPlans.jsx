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
  Form
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
  getTreatmentPlanStatuses,
  updateTreatmentPlan,
  createTreatmentPlan
} from '../../api/treatmentPlan';
import { getMedicalRecordsByDoctor, getMedicalRecords } from '../../api/medicalRecord';
import { useAuthStatus } from '../../hooks/useAuthStatus';
import { formatDate } from '../../utils/formatDate';
import moment from 'moment';

const { Option } = Select;
const { RangePicker } = DatePicker;

const ARV_REGIMEN_OPTIONS = [
  'TDF/FTC/EFV',
  'ABC/3TC/DTG',
  'TAF/FTC/BIC',
  'AZT/3TC/LPV/r',
  'ABC/3TC + RAL',
];
const APPLICABLE_GROUP_OPTIONS = [
  'Người lớn mới bắt đầu điều trị',
  'Người lớn, thay thế TDF',
  'Người lớn, có vấn đề về thận',
  'Phụ nữ mang thai',
  'Trẻ em và thanh thiếu niên',
];

const TreatmentPlans = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDoctor, setFilterDoctor] = useState('all');
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
  const { userInfo } = useAuthStatus();

  const statuses = getTreatmentPlanStatuses();

  // Load treatment plans
  const loadTreatmentPlans = async () => {
    setLoading(true);
    try {
      const data = await getTreatmentPlans();
      console.log(data);
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
    // Fetch latest medical records for dropdown
    await fetchMedicalRecords();
    // Always set fields from the selected plan
    editForm.setFieldsValue({
      ...plan,
      startDate: plan.startDate ? moment(plan.startDate) : null,
      endDate: plan.endDate ? moment(plan.endDate) : null,
    });
  };

  // Handle edit submit
  const handleEditSubmit = async (values) => {
    try {
      setLoading(true);
      const payload = {
        ...values,
        startDate: values.startDate && moment.isMoment(values.startDate)
          ? values.startDate.format('YYYY-MM-DD')
          : values.startDate || null,
        endDate: values.endDate && moment.isMoment(values.endDate)
          ? values.endDate.format('YYYY-MM-DD')
          : values.endDate || null,
      };
      console.log("payload", payload)
      console.log("editingPlan", editingPlan)
      await updateTreatmentPlan(editingPlan.planId, payload);
      message.success('Cập nhật kế hoạch điều trị thành công');
      setEditModalVisible(false);
      setEditingPlan(null);
      await loadTreatmentPlans(); // Ensure data is reloaded after update
    } catch (error) {
      message.error('Cập nhật kế hoạch điều trị thất bại');
    } finally {
      setLoading(false);
    }
  };

  // Ensure data reloads when modal closes (cancel)
  const handleEditModalClose = () => {
    setEditModalVisible(false);
    setEditingPlan(null);
    editForm.resetFields();
    loadTreatmentPlans();
  };
  const handleAddModalClose = () => {
    setAddModalVisible(false);
    addForm.resetFields();
  };

  // Show add modal
  const showAddModal = () => {
    setAddModalVisible(true);
    addForm.resetFields();
  };

  // Handle add submit
  const handleAddSubmit = async (values) => {
    try {
      setLoading(true);
      const payload = {
        ...values,
        // doctorId: userInfo.id,
        doctorId: 1,
        startDate: values.startDate && moment.isMoment(values.startDate)
          ? values.startDate.format('YYYY-MM-DD')
          : values.startDate || null,
        endDate: values.endDate && moment.isMoment(values.endDate)
          ? values.endDate.format('YYYY-MM-DD')
          : values.endDate || null,
      };
      await createTreatmentPlan(payload);
      message.success('Tạo kế hoạch điều trị thành công');
      setAddModalVisible(false);
      await loadTreatmentPlans();
    } catch (error) {
      message.error('Tạo kế hoạch điều trị thất bại');
    } finally {
      setLoading(false);
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
    // {
    //   title: 'Trạng thái',
    //   dataIndex: 'status',
    //   key: 'status',
    //   width: 120,
    //   render: (status) => {
    //     const config = getStatusConfig(status);
    //     return <Tag color={config.color}>{config.label}</Tag>;
    //   },
    // },
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
              onClick={() => showDetailModal(record)}
            />
          </Tooltip>
          <Tooltip title="Chỉnh sửa">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => showEditModal(record)}
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
                  onClick={showAddModal}
                >
                  Tạo kế hoạch mới
                </Button>
              </Space>
            </Col>
          </Row>
        </div>

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
      {/* Detail Modal */}
      <Modal
        title="Chi tiết kế hoạch điều trị"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={null}
        width={600}
      >
        {selectedPlan && (
          <div style={{ lineHeight: 2 }}>
            <div><b>Mã kế hoạch:</b> #{selectedPlan.planId}</div>
            <div><b>Bệnh nhân:</b> {selectedPlan.patientName}</div>
            <div><b>Bác sĩ phụ trách:</b> {selectedPlan.doctorName}</div>
            <div><b>Phác đồ ARV:</b> {selectedPlan.arvRegimen}</div>
            <div><b>Nhóm áp dụng:</b> {selectedPlan.applicableGroup}</div>
            <div><b>Ngày bắt đầu:</b> {formatDate(selectedPlan.startDate)}</div>
            <div><b>Ngày kết thúc:</b> {selectedPlan.endDate ? formatDate(selectedPlan.endDate) : '-'}</div>
            <div><b>Ghi chú:</b> {selectedPlan.note || '-'}</div>
          </div>
        )}
      </Modal>
      {/* Edit Modal (same as Add Modal, but prefilled) */}
      <Modal
        title="Chỉnh sửa kế hoạch điều trị"
        open={editModalVisible}
        onCancel={handleEditModalClose}
        footer={null}
        width={700}
        destroyOnClose
      >
        {editingPlan && (
          <Form
            form={editForm}
            layout="vertical"
            onFinish={handleEditSubmit}
            initialValues={{
              ...editingPlan,
              startDate: editingPlan.startDate ? moment(editingPlan.startDate) : null,
              endDate: editingPlan.endDate ? moment(editingPlan.endDate) : null,
            }}
          >
            <Form.Item
              name="medicalRecordId"
              label="Hồ sơ bệnh án"
              rules={[{ required: true, message: 'Vui lòng chọn hồ sơ bệnh án' }]}
            >
              <Select placeholder="Chọn hồ sơ bệnh án">
                {medicalRecords.map(r => (
                  <Option key={r.id || r.medicalRecordId} value={r.id || r.medicalRecordId}>
                    {r.id || r.medicalRecordId} - {r.customerName || r.patientName} (Bác sĩ: {r.doctorName})
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name="arvRegimen"
              label="Phác đồ ARV"
              rules={[{ required: true, message: 'Vui lòng chọn phác đồ ARV' }]}
            >
              <Select placeholder="Chọn phác đồ ARV">
                {ARV_REGIMEN_OPTIONS.map(opt => (
                  <Option key={opt} value={opt}>{opt}</Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name="applicableGroup"
              label="Nhóm áp dụng"
              rules={[{ required: true, message: 'Vui lòng chọn nhóm áp dụng' }]}
            >
              <Select placeholder="Chọn nhóm áp dụng">
                {APPLICABLE_GROUP_OPTIONS.map(opt => (
                  <Option key={opt} value={opt}>{opt}</Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name="note"
              label="Ghi chú"
            >
              <Input.TextArea rows={2} placeholder="Nhập ghi chú (nếu có)" />
            </Form.Item>
            <Form.Item
              name="startDate"
              label="Ngày bắt đầu"
              rules={[{ required: true, message: 'Vui lòng chọn ngày bắt đầu' }]}
            >
              <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
            </Form.Item>
            <Form.Item
              name="endDate"
              label="Ngày kết thúc"
            >
              <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
            </Form.Item>
            <Form.Item style={{ textAlign: 'right' }}>
              <Button onClick={handleEditModalClose} style={{ marginRight: 8 }}>Hủy</Button>
              <Button type="primary" htmlType="submit" loading={loading}>Lưu thay đổi</Button>
            </Form.Item>
          </Form>
        )}
      </Modal>
      {/* Add Modal */}
      <Modal
        title="Tạo kế hoạch điều trị mới"
        open={addModalVisible}
        onCancel={handleAddModalClose}
        footer={null}
        width={700}
        destroyOnClose
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
              {medicalRecords.map(r => (
                <Option key={r.id || r.medicalRecordId} value={r.id || r.medicalRecordId}>
                  {r.id || r.medicalRecordId} - {r.customerName || r.patientName} (Bác sĩ: {r.doctorName})
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="arvRegimen"
            label="Phác đồ ARV"
            rules={[{ required: true, message: 'Vui lòng chọn phác đồ ARV' }]}
          >
            <Select placeholder="Chọn phác đồ ARV">
              {ARV_REGIMEN_OPTIONS.map(opt => (
                <Option key={opt} value={opt}>{opt}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="applicableGroup"
            label="Nhóm áp dụng"
            rules={[{ required: true, message: 'Vui lòng chọn nhóm áp dụng' }]}
          >
            <Select placeholder="Chọn nhóm áp dụng">
              {APPLICABLE_GROUP_OPTIONS.map(opt => (
                <Option key={opt} value={opt}>{opt}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="note"
            label="Ghi chú"
          >
            <Input.TextArea rows={2} placeholder="Nhập ghi chú (nếu có)" />
          </Form.Item>
          <Form.Item
            name="startDate"
            label="Ngày bắt đầu"
            rules={[{ required: true, message: 'Vui lòng chọn ngày bắt đầu' }]}
          >
            <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
          </Form.Item>
          <Form.Item style={{ textAlign: 'right' }}>
            <Button onClick={handleAddModalClose} style={{ marginRight: 8 }}>Hủy</Button>
            <Button type="primary" htmlType="submit" loading={loading}>Tạo mới</Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TreatmentPlans;
