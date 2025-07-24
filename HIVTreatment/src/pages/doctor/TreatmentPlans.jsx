import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Button, 
  Space, 
  Modal, 
  Form, 
  Input, 
  Select, 
  DatePicker, 
  message, 
  Card, 
  Popconfirm, 
  Tag, 
  InputNumber,
  Row,
  Col
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  SearchOutlined,
  EyeOutlined,
  FilterOutlined,
  ReloadOutlined,
  MedicineBoxOutlined
} from '@ant-design/icons';
import moment from 'moment';
import 'moment/locale/vi';
import { useAuthStatus } from '../../hooks/useAuthStatus';
import { 
  getTreatmentPlansByDoctor,
  createTreatmentPlan,
  updateTreatmentPlan,
  deleteTreatmentPlan
} from '../../api/treatmentPlan';

const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

// Mock data for development
const mockTreatmentPlans = [
  {
    id: 1, 
    medicalRecordId: 'MR001',
    patientId: 'BN001',
    patientName: 'Nguyễn Thị B', 
    arvRegimen: 'TDF/3TC/EFV', 
    applicableGroup: 'Người lớn mới bắt đầu điều trị',
    startDate: '2024-06-01', 
    endDate: '2024-12-01',
    status: 'ACTIVE',
    note: 'Theo dõi men gan',
    doctorId: 'DR001',
    doctorName: 'BS. Trần Văn A',
    createdAt: '2024-05-20T10:00:00',
    updatedAt: '2024-05-20T10:00:00'
  },
  {
    id: 2, 
    medicalRecordId: 'MR002',
    patientId: 'BN002',
    patientName: 'Lê Văn C', 
    arvRegimen: 'TAF/FTC/BIC', 
    applicableGroup: 'Trẻ em < 25kg',
    startDate: '2024-05-15', 
    endDate: '2024-11-15',
    status: 'ACTIVE',
    note: 'Theo dõi tác dụng phụ',
    doctorId: 'DR001',
    doctorName: 'BS. Trần Văn A',
    createdAt: '2024-05-10T14:30:00',
    updatedAt: '2024-05-10T14:30:00'
  },
];

// ARV Regimen options
const arvRegimenOptions = [
  'TDF/3TC/DTG',
  'TAF/FTC/BIC',
  'ABC/3TC/DTG',
  'TDF/3TC/EFV',
  'TDF/3TC/NVP',
  'AZT/3TC/EFV',
  'AZT/3TC/NVP'
];

// Applicable group options
const applicableGroupOptions = [
  'Người lớn mới bắt đầu điều trị',
  'Trẻ em < 25kg',
  'Trẻ em ≥ 25kg',
  'Phụ nữ có thai',
  'Người nghiện chích ma túy',
  'Người đồng nhiễm viêm gan B',
  'Người đồng nhiễm viêm gan C'
];

// Status options
const statusOptions = [
  { value: 'ACTIVE', label: 'Đang điều trị', color: 'green' },
  { value: 'COMPLETED', label: 'Hoàn thành', color: 'blue' },
  { value: 'CANCELLED', label: 'Đã hủy', color: 'red' },
  { value: 'PENDING', label: 'Chờ xác nhận', color: 'orange' },
];

const TreatmentPlans = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentPlan, setCurrentPlan] = useState(null);
  const [form] = Form.useForm();
  const [filters, setFilters] = useState({
    search: '',
    status: undefined,
    dateRange: [moment().startOf('month'), moment().endOf('month')]
  });
  
  const { userInfo } = useAuthStatus();

  useEffect(() => {
    fetchTreatmentPlans();
  }, [filters]);

  const fetchTreatmentPlans = async () => {
    setLoading(true);
    try {
      // In a real app, you would fetch data from the API
      // const data = await getTreatmentPlansByDoctor(userInfo.id, filters);
      
      // For now, use mock data with filtering
      let filteredData = [...mockTreatmentPlans];
      
      // Apply search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filteredData = filteredData.filter(plan => 
          plan.patientName.toLowerCase().includes(searchLower) ||
          plan.patientId.toLowerCase().includes(searchLower) ||
          plan.arvRegimen.toLowerCase().includes(searchLower)
        );
      }
      
      // Apply status filter
      if (filters.status) {
        filteredData = filteredData.filter(plan => plan.status === filters.status);
      }
      
      // Apply date range filter
      if (filters.dateRange && filters.dateRange[0] && filters.dateRange[1]) {
        const [start, end] = filters.dateRange;
        filteredData = filteredData.filter(plan => {
          const planDate = moment(plan.startDate);
          return planDate.isBetween(start, end, 'day', '[]');
        });
      }
      
      setPlans(filteredData);
    } catch (error) {
      console.error('Error fetching treatment plans:', error);
      message.error('Không thể tải danh sách kế hoạch điều trị');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setFilters(prev => ({ ...prev, search: e.target.value }));
  };

  const handleStatusFilter = (status) => {
    setFilters(prev => ({ ...prev, status: status || undefined }));
  };

  const handleDateRangeChange = (dates) => {
    setFilters(prev => ({ ...prev, dateRange: dates }));
  };

  const resetFilters = () => {
    setFilters({
      search: '',
      status: undefined,
      dateRange: [moment().startOf('month'), moment().endOf('month')]
    });
  };

  const showCreateModal = () => {
    setCurrentPlan(null);
    form.resetFields();
    form.setFieldsValue({
      startDate: moment(),
      status: 'ACTIVE',
      doctorId: userInfo?.id,
      doctorName: userInfo?.name
    });
    setIsModalVisible(true);
  };

  const showEditModal = (plan) => {
    setCurrentPlan(plan);
    form.setFieldsValue({
      medicalRecordId: plan.medicalRecordId,
      patientId: plan.patientId,
      patientName: plan.patientName,
      arvRegimen: plan.arvRegimen,
      applicableGroup: plan.applicableGroup,
      status: plan.status,
      startDate: moment(plan.startDate),
      endDate: plan.endDate ? moment(plan.endDate) : null,
      note: plan.note,
      doctorId: plan.doctorId,
      doctorName: plan.doctorName
    });
    setIsModalVisible(true);
  };

  const showDetailModal = (plan) => {
    setCurrentPlan(plan);
    // In a real app, you might want to show a detailed view in a modal
    message.info(`Xem chi tiết kế hoạch điều trị cho ${plan.patientName}`);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setCurrentPlan(null);
  };

  const handleSubmit = async (values) => {
    try {
      const planData = {
        ...values,
        startDate: values.startDate.format('YYYY-MM-DD'),
        endDate: values.endDate ? values.endDate.format('YYYY-MM-DD') : null,
        doctorId: userInfo?.id,
        doctorName: userInfo?.name
      };

      // In a real app, call the API
      // if (currentPlan) {
      //   await updateTreatmentPlan(currentPlan.id, planData);
      //   message.success('Cập nhật kế hoạch điều trị thành công');
      // } else {
      //   await createTreatmentPlan(planData);
      //   message.success('Tạo kế hoạch điều trị thành công');
      // }
      
      message.success(`Xử lý kế hoạch điều trị ${currentPlan ? 'cập nhật' : 'tạo mới'} thành công`);
      setIsModalVisible(false);
      fetchTreatmentPlans();
    } catch (error) {
      console.error('Error saving treatment plan:', error);
      message.error(`Không thể ${currentPlan ? 'cập nhật' : 'tạo'} kế hoạch điều trị`);
    }
  };

  const handleDelete = async (planId) => {
    try {
      // In a real app, call the API
      // await deleteTreatmentPlan(planId);
      message.success('Xóa kế hoạch điều trị thành công');
      fetchTreatmentPlans();
    } catch (error) {
      console.error('Error deleting treatment plan:', error);
      message.error('Không thể xóa kế hoạch điều trị');
    }
  };

  const getStatusColor = (status) => {
    const statusObj = statusOptions.find(s => s.value === status);
    return statusObj ? statusObj.color : 'default';
  };

  const getStatusLabel = (status) => {
    const statusObj = statusOptions.find(s => s.value === status);
    return statusObj ? statusObj.label : status;
  };

  const columns = [
    {
      title: 'Mã BN',
      dataIndex: 'patientId',
      key: 'patientId',
      width: 100,
    },
    {
      title: 'Tên bệnh nhân',
      dataIndex: 'patientName',
      key: 'patientName',
      render: (text, record) => (
        <Button type="link" onClick={() => showDetailModal(record)}>
          {text}
        </Button>
      ),
    },
    {
      title: 'Phác đồ ARV',
      dataIndex: 'arvRegimen',
      key: 'arvRegimen',
      width: 150,
    },
    {
      title: 'Nhóm áp dụng',
      dataIndex: 'applicableGroup',
      key: 'applicableGroup',
      width: 200,
    },
    {
      title: 'Ngày bắt đầu',
      dataIndex: 'startDate',
      key: 'startDate',
      width: 120,
      render: (date) => moment(date).format('DD/MM/YYYY'),
      sorter: (a, b) => new Date(a.startDate) - new Date(b.startDate),
    },
    {
      title: 'Ngày kết thúc',
      dataIndex: 'endDate',
      key: 'endDate',
      width: 120,
      render: (date) => date ? moment(date).format('DD/MM/YYYY') : '-',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 150,
      render: (status) => (
        <Tag color={getStatusColor(status)}>
          {getStatusLabel(status)}
        </Tag>
      ),
      filters: statusOptions.map(s => ({
        text: s.label,
        value: s.value,
      })),
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Hành động',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Space size="middle">
          <Button 
            type="link" 
            icon={<EyeOutlined />} 
            onClick={() => showDetailModal(record)}
            title="Xem chi tiết"
          />
          <Button 
            type="link" 
            icon={<EditOutlined />} 
            onClick={() => showEditModal(record)}
            title="Chỉnh sửa"
          />
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa?"
            onConfirm={() => handleDelete(record.id)}
            okText="Có"
            cancelText="Không"
            okButtonProps={{ danger: true }}
          >
            <Button 
              type="text" 
              danger 
              icon={<DeleteOutlined />} 
              title="Xóa"
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">
            <MedicineBoxOutlined className="mr-2" />
            Quản lý Kế hoạch Điều trị
          </h2>
          <p className="text-gray-600">
            Quản lý và theo dõi các kế hoạch điều trị ARV cho bệnh nhân
          </p>
        </div>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={showCreateModal}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Tạo kế hoạch mới
        </Button>
      </div>

      <Card className="mb-6" bodyStyle={{ padding: '16px 24px' }}>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[250px]">
            <Input 
              placeholder="Tìm kiếm theo tên bệnh nhân, mã BN, phác đồ..."
              prefix={<SearchOutlined />}
              value={filters.search}
              onChange={handleSearch}
              allowClear
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-600">Trạng thái:</span>
            <Select
              style={{ width: 150 }}
              value={filters.status}
              onChange={handleStatusFilter}
              allowClear
              placeholder="Tất cả"
            >
              {statusOptions.map(status => (
                <Option key={status.value} value={status.value}>
                  {status.label}
                </Option>
              ))}
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-600">Thời gian:</span>
            <RangePicker 
              value={filters.dateRange}
              onChange={handleDateRangeChange}
              format="DD/MM/YYYY"
            />
          </div>
          <Button 
            icon={<ReloadOutlined />} 
            onClick={resetFilters}
          >
            Đặt lại
          </Button>
        </div>
      </Card>

      <Card>
        <Table 
          columns={columns} 
          dataSource={plans} 
          rowKey="id"
          loading={loading}
          pagination={{ 
            pageSize: 10, 
            showSizeChanger: true,
            showTotal: (total) => `Tổng ${total} kế hoạch`
          }}
          scroll={{ x: 1200 }}
        />
      </Card>

      {/* Create/Edit Treatment Plan Modal */}
      <Modal
        title={currentPlan ? 'Cập nhật kế hoạch điều trị' : 'Tạo kế hoạch điều trị mới'}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={800}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="mt-6"
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="medicalRecordId"
                label="Mã hồ sơ bệnh án"
                rules={[{ required: true, message: 'Vui lòng nhập mã hồ sơ' }]}
              >
                <Input placeholder="Nhập mã hồ sơ bệnh án" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="patientName"
                label="Tên bệnh nhân"
                rules={[{ required: true, message: 'Vui lòng nhập tên bệnh nhân' }]}
              >
                <Input placeholder="Nhập tên bệnh nhân" />
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="arvRegimen"
                label="Phác đồ ARV"
                rules={[{ required: true, message: 'Vui lòng chọn phác đồ ARV' }]}
              >
                <Select placeholder="Chọn phác đồ ARV" showSearch>
                  {arvRegimenOptions.map(regimen => (
                    <Option key={regimen} value={regimen}>
                      {regimen}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="applicableGroup"
                label="Nhóm áp dụng"
                rules={[{ required: true, message: 'Vui lòng chọn nhóm áp dụng' }]}
              >
                <Select placeholder="Chọn nhóm áp dụng" showSearch>
                  {applicableGroupOptions.map(group => (
                    <Option key={group} value={group}>
                      {group}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="startDate"
                label="Ngày bắt đầu"
                rules={[{ required: true, message: 'Vui lòng chọn ngày bắt đầu' }]}
              >
                <DatePicker 
                  style={{ width: '100%' }} 
                  format="DD/MM/YYYY"
                  disabledDate={current => current && current < moment().startOf('day')}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="endDate"
                label="Ngày kết thúc (tùy chọn)"
              >
                <DatePicker 
                  style={{ width: '100%' }} 
                  format="DD/MM/YYYY"
                  disabledDate={current => 
                    current && current < form.getFieldValue('startDate')
                  }
                />
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item
            name="status"
            label="Trạng thái"
            initialValue="ACTIVE"
          >
            <Select>
              {statusOptions.map(status => (
                <Option key={status.value} value={status.value}>
                  {status.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
          
          <Form.Item
            name="note"
            label="Ghi chú"
          >
            <TextArea rows={3} placeholder="Nhập ghi chú (nếu có)" />
          </Form.Item>
          
          <div className="flex justify-end space-x-4 mt-6">
            <Button onClick={handleCancel}>
              Hủy
            </Button>
            <Button type="primary" htmlType="submit">
              {currentPlan ? 'Cập nhật' : 'Tạo mới'}
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default TreatmentPlans;