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
  Form,
  Descriptions,
  Typography,
  Tabs,
  Alert,
  Statistic,
  Badge,
  Progress,
  Spin,
  Divider,
  Drawer
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
  FileTextOutlined,
  UserOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  MedicineBoxOutlined,
  ExperimentOutlined,
  SendOutlined,
  FileAddOutlined
} from '@ant-design/icons';
import { 
  getMedicalRecords, 
  deleteMedicalRecord,
  createMedicalRecord,
  updateMedicalRecord
} from '../api/medicalRecord';
import { 
  getTreatmentPlansByMedicalRecord,
  getTreatmentPlans
} from '../api/treatmentPlan';
import { 
  createLabResult,
  getLabResultsByCustomer,
  getLabResultsByMedicalRecord
} from '../api/labResult';
import { getAppointmentsByCustomer } from '../api/appointment';
import { useAuthStatus } from '../hooks/useAuthStatus';
import dayjs from 'dayjs';

const { Option } = Select;
const { RangePicker } = DatePicker;
const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { TextArea } = Input;

const MedicalRecords = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [cd4Range, setCd4Range] = useState([null, null]);
  const [viralLoadRange, setViralLoadRange] = useState([null, null]);
  const [dateRange, setDateRange] = useState([null, null]);
  const { userInfo } = useAuthStatus();

  // Modal state and form
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [form] = Form.useForm();
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [treatmentPlans, setTreatmentPlans] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [labResults, setLabResults] = useState([]);
  const [activeTab, setActiveTab] = useState('1');
  const [detailsLoading, setDetailsLoading] = useState(false);

  // Lab Result creation
  const [labResultModalVisible, setLabResultModalVisible] = useState(false);
  const [labResultForm] = Form.useForm();
  const [selectedPatient, setSelectedPatient] = useState(null);

  // Statistics state
  const [stats, setStats] = useState({
    total: 0,
    thisMonth: 0,
    normalCd4: 0,
    normalViralLoad: 0
  });

  const handleModalClose = () => {
    setModalVisible(false);
    setEditingRecord(null);
    form.resetFields();
  };

  // Load medical records
  const loadMedicalRecords = async () => {
    setLoading(true);
    try {
      const data = await getMedicalRecords();
      console.log('Medical records data:', data);
      
      // Handle different response formats
      let recordsList = [];
      if (Array.isArray(data)) {
        recordsList = data;
      } else if (data && Array.isArray(data.data)) {
        recordsList = data.data;
      } else if (data && typeof data === 'object') {
        // If data is an object, try to extract array from it
        recordsList = Object.values(data).find(val => Array.isArray(val)) || [];
      }
      
      console.log('Processed records list:', recordsList);
      setRecords(recordsList);
      
      // Calculate statistics
      const now = new Date();
      const thisMonth = recordsList.filter(record => {
        const recordDate = new Date(record.lastUpdated || record.createdAt);
        return recordDate.getMonth() === now.getMonth() && 
               recordDate.getFullYear() === now.getFullYear();
      });
      
      // Calculate CD4 and Viral Load status
      const normalCd4 = recordsList.filter(r => {
        const cd4 = r.cd4Count;
        return cd4 && cd4 >= 500;
      }).length;
      
      const normalViralLoad = recordsList.filter(r => {
        const viralLoad = r.viralLoad;
        return viralLoad && viralLoad < 50;
      }).length;
      
      setStats({
        total: recordsList.length,
        thisMonth: thisMonth.length,
        normalCd4: normalCd4,
        normalViralLoad: normalViralLoad
      });
    } catch (error) {
      console.error('Error loading medical records:', error);
      message.error(`Không thể tải danh sách hồ sơ bệnh án: ${error.message || 'Lỗi không xác định'}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMedicalRecords();
  }, []);

  // Handle create/update medical record
  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const payload = {
        customerId: values.customerId,
        doctorId: userInfo.id,
        cd4Count: Number(values.cd4Count),
        viralLoad: Number(values.viralLoad),
        treatmentHistory: values.treatmentHistory || ''
      };

      if (editingRecord) {
        await updateMedicalRecord(editingRecord.medicalRecordId, payload);
        message.success('Cập nhật hồ sơ bệnh án thành công');
      } else {
        await createMedicalRecord(payload);
        message.success('Tạo hồ sơ bệnh án thành công');
      }
      
      handleModalClose();
      loadMedicalRecords();
    } catch (error) {
      message.error(editingRecord ? 'Cập nhật hồ sơ bệnh án thất bại' : 'Tạo hồ sơ bệnh án thất bại');
    } finally {
      setLoading(false);
    }
  };

  // Handle delete medical record
  const handleDelete = async (recordId) => {
    try {
      await deleteMedicalRecord(recordId);
      message.success('Xóa hồ sơ bệnh án thành công');
      loadMedicalRecords();
    } catch (error) {
      message.error('Không thể xóa hồ sơ bệnh án');
    }
  };

  // Show edit modal
  const showEditModal = (record) => {
    setEditingRecord(record);
    setModalVisible(true);
    form.setFieldsValue({
      ...record,
      customerId: record.customerId,
      doctorId: record.doctorId,
      cd4Count: record.cd4Count,
      viralLoad: record.viralLoad,
      treatmentHistory: record.treatmentHistory
    });
  };

  // Show detail modal
  const showDetailModal = async (record) => {
    setSelectedRecord(record);
    setDetailModalVisible(true);
    setDetailsLoading(true);
    
    try {
      // Fetch treatment plans for this medical record
      const plans = await getTreatmentPlansByMedicalRecord(record.medicalRecordId);
      setTreatmentPlans(Array.isArray(plans) ? plans : []);
      
      // Fetch appointments for this customer
      const appointmentsData = await getAppointmentsByCustomer(record.customerId);
      setAppointments(appointmentsData?.data || []);
      
      // Fetch lab results for this medical record
      const labResultsData = await getLabResultsByMedicalRecord(record.medicalRecordId);
      setLabResults(Array.isArray(labResultsData) ? labResultsData : []);
    } catch (error) {
      console.error('Error fetching record details:', error);
    } finally {
      setDetailsLoading(false);
    }
  };

  // Handle create lab result
  const handleCreateLabResult = async (values) => {
    try {
      setLoading(true);
      
      // Find medical record for this patient
      const patientMedicalRecord = records.find(record => record.customerId === selectedPatient.customerId);
      if (!patientMedicalRecord) {
        message.error('Không tìm thấy hồ sơ bệnh án cho bệnh nhân này');
        return;
      }
      
      const payload = {
        medicalRecordId: patientMedicalRecord.medicalRecordId,
        doctorId: userInfo.id,
        result: `${values.testType}: ${values.result} ${values.unit} (Bình thường: ${values.normalRange})`,
        cd4Count: values.testType === 'CD4_COUNT' ? parseInt(values.result) : 0,
        testDate: values.testDate.format('YYYY-MM-DD'),
        note: `Diễn giải: ${values.interpretation || 'Không có'}. Khuyến nghị: ${values.recommendations || 'Không có'}`
      };

      await createLabResult(payload);
      message.success('Tạo kết quả xét nghiệm thành công và đã gửi cho bệnh nhân');
      setLabResultModalVisible(false);
      labResultForm.resetFields();
      setSelectedPatient(null);
      
      // Refresh lab results in detail modal if open
      if (selectedRecord) {
        const labResultsData = await getLabResultsByMedicalRecord(selectedRecord.medicalRecordId);
        setLabResults(Array.isArray(labResultsData) ? labResultsData : []);
      }
    } catch (error) {
      console.error('Error creating lab result:', error);
      message.error(`Tạo kết quả xét nghiệm thất bại: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Show lab result creation modal
  const showLabResultModal = (patient) => {
    setSelectedPatient(patient);
    setLabResultModalVisible(true);
    labResultForm.resetFields();
  };

  // Create sample data for testing
  const createSampleData = () => {
    const sampleRecords = [
      {
        medicalRecordId: 1,
        customerId: 1,
        customerName: "Nguyễn Văn A",
        customerPhone: "0123456789",
        doctorId: 1,
        doctorName: "Bác sĩ Trần Thị B",
        cd4Count: 650,
        viralLoad: 25,
        treatmentHistory: "Điều trị ARV từ 2023",
        lastUpdated: new Date().toISOString()
      },
      {
        medicalRecordId: 2,
        customerId: 2,
        customerName: "Lê Văn C",
        customerPhone: "0987654321",
        doctorId: 1,
        doctorName: "Bác sĩ Trần Thị B",
        cd4Count: 350,
        viralLoad: 1200,
        treatmentHistory: "Mới bắt đầu điều trị",
        lastUpdated: new Date().toISOString()
      },
      {
        medicalRecordId: 3,
        customerId: 3,
        customerName: "Phạm Thị D",
        customerPhone: "0369852147",
        doctorId: 2,
        doctorName: "Bác sĩ Nguyễn Văn E",
        cd4Count: 450,
        viralLoad: 75,
        treatmentHistory: "Điều trị ổn định",
        lastUpdated: new Date().toISOString()
      }
    ];
    
    setRecords(sampleRecords);
    setStats({
      total: sampleRecords.length,
      thisMonth: sampleRecords.length,
      normalCd4: sampleRecords.filter(r => r.cd4Count >= 500).length,
      normalViralLoad: sampleRecords.filter(r => r.viralLoad < 50).length
    });
    message.success('Đã tạo dữ liệu mẫu để test');
  };

  // Test lab result creation with simple data
  const testLabResultCreation = async () => {
    try {
      setLoading(true);
      
      // Use first record as test
      const testRecord = records[0];
      if (!testRecord) {
        message.error('Không có dữ liệu để test');
        return;
      }
      
      const testPayload = {
        medicalRecordId: testRecord.medicalRecordId,
        doctorId: testRecord.doctorId,
        result: "Test Result: 500",
        cd4Count: 500,
        testDate: "2024-01-15",
        note: "Test lab result"
      };
      
      console.log('Testing with payload:', testPayload);
      await createLabResult(testPayload);
      message.success('Test lab result creation thành công!');
    } catch (error) {
      console.error('Test lab result error:', error);
      message.error(`Test thất bại: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Create real medical record for testing
  const createRealMedicalRecord = async () => {
    try {
      setLoading(true);
      
      const medicalRecordPayload = {
        customerId: 1,
        doctorId: userInfo?.id || 1,
        cd4Count: 600,
        viralLoad: 50,
        treatmentHistory: "Test treatment history"
      };
      
      console.log('Creating medical record with payload:', medicalRecordPayload);
      const newRecord = await createMedicalRecord(medicalRecordPayload);
      console.log('Created medical record:', newRecord);
      
      message.success('Tạo hồ sơ bệnh án thành công!');
      loadMedicalRecords(); // Reload to get the new record
    } catch (error) {
      console.error('Create medical record error:', error);
      message.error(`Tạo hồ sơ bệnh án thất bại: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Filter records based on search and filters
  const getFilteredRecords = () => {
    return records.filter(record => {
      // Filter by search text
      const searchMatch = !searchText || 
        record.customerName?.toLowerCase().includes(searchText.toLowerCase()) ||
        record.doctorName?.toLowerCase().includes(searchText.toLowerCase()) ||
        record.medicalRecordId?.toString().includes(searchText);
      
      // Filter by type
      const typeMatch = filterType === 'all' || record.type === filterType;
      
      // Filter by CD4 range
      let cd4Match = true;
      if (cd4Range && cd4Range[0] && cd4Range[1]) {
        cd4Match = record.cd4Count >= cd4Range[0] && record.cd4Count <= cd4Range[1];
      }
      
      // Filter by viral load range
      let viralLoadMatch = true;
      if (viralLoadRange && viralLoadRange[0] && viralLoadRange[1]) {
        viralLoadMatch = record.viralLoad >= viralLoadRange[0] && record.viralLoad <= viralLoadRange[1];
      }
      
      return searchMatch && typeMatch && cd4Match && viralLoadMatch;
    });
  };

  // Get CD4 status color
  const getCd4StatusColor = (cd4Count) => {
    if (cd4Count >= 500) return 'green';
    if (cd4Count >= 200) return 'orange';
    return 'red';
  };

  // Get viral load status color
  const getViralLoadStatusColor = (viralLoad) => {
    if (viralLoad < 50) return 'green';
    if (viralLoad < 1000) return 'orange';
    return 'red';
  };

  // Table columns
  const columns = [
    {
      title: 'Mã hồ sơ',
      dataIndex: 'medicalRecordId',
      key: 'medicalRecordId',
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
      title: 'Bác sĩ',
      dataIndex: 'doctorName',
      key: 'doctorName',
    },
    {
      title: 'CD4 Count',
      dataIndex: 'cd4Count',
      key: 'cd4Count',
      render: (cd4Count) => (
        <Space>
          <Text strong>{cd4Count}</Text>
          <Tag color={getCd4StatusColor(cd4Count)}>
            {cd4Count >= 500 ? 'Bình thường' : cd4Count >= 200 ? 'Thấp' : 'Rất thấp'}
          </Tag>
        </Space>
      )
    },
    {
      title: 'Viral Load',
      dataIndex: 'viralLoad',
      key: 'viralLoad',
      render: (viralLoad) => (
        <Space>
          <Text strong>{viralLoad}</Text>
          <Tag color={getViralLoadStatusColor(viralLoad)}>
            {viralLoad < 50 ? 'Không phát hiện' : viralLoad < 1000 ? 'Thấp' : 'Cao'}
          </Tag>
        </Space>
      )
    },
    {
      title: 'Ngày cập nhật',
      dataIndex: 'lastUpdated',
      key: 'lastUpdated',
      render: (text) => text ? dayjs(text).format('DD/MM/YYYY HH:mm') : 'Không có'
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
          <Button 
            type="default" 
            size="small" 
            icon={<ExperimentOutlined />} 
            onClick={() => showLabResultModal(record)}
          >
            Tạo xét nghiệm
          </Button>
          <Button 
            type="default" 
            danger 
            size="small" 
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.medicalRecordId)}
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Title level={3}>Quản lý hồ sơ bệnh án</Title>
      <Text type="secondary" style={{ marginBottom: 20, display: 'block' }}>
        Quản lý hồ sơ bệnh án và tạo kết quả xét nghiệm cho bệnh nhân
      </Text>
      
      {/* Statistics Cards */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic 
              title="Tổng số hồ sơ" 
              value={stats.total} 
              prefix={<FileTextOutlined />} 
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic 
              title="Hồ sơ tháng này" 
              value={stats.thisMonth} 
              prefix={<CalendarOutlined />} 
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic 
              title="CD4 bình thường" 
              value={stats.normalCd4} 
              prefix={<CheckCircleOutlined />} 
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic 
              title="Viral load bình thường" 
              value={stats.normalViralLoad} 
              prefix={<CheckCircleOutlined />} 
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Search and Filter */}
      <Card style={{ marginBottom: 24 }}>
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col span={6}>
            <Input 
              placeholder="Tìm theo tên bệnh nhân, bác sĩ, mã hồ sơ" 
              prefix={<SearchOutlined />} 
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              allowClear
            />
          </Col>
          <Col span={4}>
            <Select 
              placeholder="Loại hồ sơ" 
              value={filterType}
              onChange={setFilterType}
              allowClear
            >
              <Option value="all">Tất cả</Option>
              <Option value="INITIAL">Khám lần đầu</Option>
              <Option value="FOLLOW_UP">Tái khám</Option>
              <Option value="EMERGENCY">Cấp cứu</Option>
            </Select>
          </Col>
          <Col span={4}>
            <Input.Group compact>
              <Input 
                placeholder="CD4 từ" 
                style={{ width: '50%' }}
                onChange={e => setCd4Range([e.target.value ? Number(e.target.value) : null, cd4Range[1]])}
              />
              <Input 
                placeholder="CD4 đến" 
                style={{ width: '50%' }}
                onChange={e => setCd4Range([cd4Range[0], e.target.value ? Number(e.target.value) : null])}
              />
            </Input.Group>
          </Col>
          <Col span={4}>
            <Input.Group compact>
              <Input 
                placeholder="Viral load từ" 
                style={{ width: '50%' }}
                onChange={e => setViralLoadRange([e.target.value ? Number(e.target.value) : null, viralLoadRange[1]])}
              />
              <Input 
                placeholder="Viral load đến" 
                style={{ width: '50%' }}
                onChange={e => setViralLoadRange([viralLoadRange[0], e.target.value ? Number(e.target.value) : null])}
              />
            </Input.Group>
          </Col>
          <Col span={6}>
            <Space>
              <Button 
                type="primary" 
                icon={<PlusOutlined />}
                onClick={() => {
                  setEditingRecord(null);
                  setModalVisible(true);
                  form.resetFields();
                }}
              >
                Tạo mới
              </Button>
              <Button 
                icon={<ReloadOutlined />} 
                onClick={loadMedicalRecords}
                loading={loading}
              >
                Làm mới
              </Button>
              <Button 
                type="dashed"
                onClick={createSampleData}
              >
                Tạo dữ liệu mẫu
              </Button>
              <Button 
                type="dashed"
                onClick={testLabResultCreation}
                disabled={records.length === 0}
              >
                Test Lab Result
              </Button>
              <Button 
                type="dashed"
                onClick={createRealMedicalRecord}
              >
                Tạo Medical Record
              </Button>
            </Space>
          </Col>
        </Row>
        
        <Table
          columns={columns}
          dataSource={getFilteredRecords()}
          rowKey="medicalRecordId"
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Card>

      {/* Detail Modal */}
      <Modal
        title={
          <Space>
            <FileTextOutlined />
            <span>Chi tiết hồ sơ bệnh án #{selectedRecord?.medicalRecordId}</span>
          </Space>
        }
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        width={1000}
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
              showEditModal(selectedRecord);
            }}
          >
            Chỉnh sửa
          </Button>,
          <Button 
            key="lab" 
            type="default"
            icon={<ExperimentOutlined />}
            onClick={() => {
              setDetailModalVisible(false);
              showLabResultModal(selectedRecord);
            }}
          >
            Tạo xét nghiệm
          </Button>
        ]}
      >
        <Spin spinning={detailsLoading}>
          {selectedRecord && (
            <Tabs activeKey={activeTab} onChange={setActiveTab}>
              <TabPane tab="Thông tin hồ sơ" key="1">
                <Descriptions bordered column={1}>
                  <Descriptions.Item label="Mã hồ sơ">{selectedRecord.medicalRecordId}</Descriptions.Item>
                  <Descriptions.Item label="Bệnh nhân">{selectedRecord.customerName}</Descriptions.Item>
                  <Descriptions.Item label="Bác sĩ phụ trách">{selectedRecord.doctorName}</Descriptions.Item>
                  <Descriptions.Item label="Ngày cập nhật">
                    {selectedRecord.lastUpdated ? dayjs(selectedRecord.lastUpdated).format('DD/MM/YYYY HH:mm') : 'Không có'}
                  </Descriptions.Item>
                  <Descriptions.Item label="Số lượng CD4">
                    <Space>
                      <Text strong>{selectedRecord.cd4Count}</Text>
                      <Tag color={getCd4StatusColor(selectedRecord.cd4Count)}>
                        {selectedRecord.cd4Count >= 500 ? 'Bình thường' : selectedRecord.cd4Count >= 200 ? 'Thấp' : 'Rất thấp'}
                      </Tag>
                    </Space>
                  </Descriptions.Item>
                  <Descriptions.Item label="Tải lượng virus">
                    <Space>
                      <Text strong>{selectedRecord.viralLoad}</Text>
                      <Tag color={getViralLoadStatusColor(selectedRecord.viralLoad)}>
                        {selectedRecord.viralLoad < 50 ? 'Không phát hiện' : selectedRecord.viralLoad < 1000 ? 'Thấp' : 'Cao'}
                      </Tag>
                    </Space>
                  </Descriptions.Item>
                  <Descriptions.Item label="Tiền sử điều trị">{selectedRecord.treatmentHistory || 'Không có'}</Descriptions.Item>
                </Descriptions>
                
                {/* Health Status Indicators */}
                <Card title="Chỉ số sức khỏe" style={{ marginTop: 16 }}>
                  <Row gutter={16}>
                    <Col span={12}>
                      <div style={{ textAlign: 'center' }}>
                        <Text strong>CD4 Count</Text>
                        <Progress 
                          type="circle" 
                          percent={Math.min((selectedRecord.cd4Count / 1000) * 100, 100)} 
                          format={() => selectedRecord.cd4Count}
                          strokeColor={getCd4StatusColor(selectedRecord.cd4Count)}
                        />
                      </div>
                    </Col>
                    <Col span={12}>
                      <div style={{ textAlign: 'center' }}>
                        <Text strong>Viral Load</Text>
                        <Progress 
                          type="circle" 
                          percent={Math.min((selectedRecord.viralLoad / 10000) * 100, 100)} 
                          format={() => selectedRecord.viralLoad}
                          strokeColor={getViralLoadStatusColor(selectedRecord.viralLoad)}
                        />
                      </div>
                    </Col>
                  </Row>
                </Card>
              </TabPane>
              <TabPane tab="Phác đồ điều trị" key="2">
                {treatmentPlans.length > 0 ? (
                  treatmentPlans.map(plan => (
                    <Card 
                      key={plan.planId} 
                      title={`Phác đồ điều trị #${plan.planId}`}
                      style={{ marginBottom: '16px' }}
                      extra={
                        <Badge 
                          status={dayjs(plan.startDate).isAfter(dayjs().subtract(30, 'day')) ? 'success' : 'default'} 
                          text={dayjs(plan.startDate).isAfter(dayjs().subtract(30, 'day')) ? 'Mới' : 'Cũ'} 
                        />
                      }
                    >
                      <Descriptions bordered column={1} size="small">
                        <Descriptions.Item label="Phác đồ ARV">{plan.arvRegimen}</Descriptions.Item>
                        <Descriptions.Item label="Nhóm áp dụng">{plan.applicableGroup}</Descriptions.Item>
                        <Descriptions.Item label="Ngày bắt đầu">
                          {plan.startDate ? dayjs(plan.startDate).format('DD/MM/YYYY') : ''}
                        </Descriptions.Item>
                        <Descriptions.Item label="Ghi chú">{plan.note || 'Không có'}</Descriptions.Item>
                      </Descriptions>
                    </Card>
                  ))
                ) : (
                  <Alert message="Không có phác đồ điều trị" type="info" showIcon />
                )}
              </TabPane>
              <TabPane tab="Kết quả xét nghiệm" key="3">
                <div style={{ marginBottom: 16 }}>
                  <Button 
                    type="primary" 
                    icon={<ExperimentOutlined />}
                    onClick={() => {
                      setDetailModalVisible(false);
                      showLabResultModal(selectedRecord);
                    }}
                  >
                    Tạo kết quả xét nghiệm mới
                  </Button>
                </div>
                                 {labResults.length > 0 ? (
                   labResults.map(result => (
                     <Card 
                       key={result.labResultId} 
                       title={`Kết quả xét nghiệm #${result.labResultId}`}
                       style={{ marginBottom: '16px' }}
                       extra={
                         <Tag color={result.cd4Count > 0 ? 'green' : 'blue'}>
                           {result.cd4Count > 0 ? 'CD4 Test' : 'Other Test'}
                         </Tag>
                       }
                     >
                       <Descriptions bordered column={2} size="small">
                         <Descriptions.Item label="Kết quả">{result.result}</Descriptions.Item>
                         <Descriptions.Item label="Ngày xét nghiệm">
                           {result.testDate ? dayjs(result.testDate).format('DD/MM/YYYY') : ''}
                         </Descriptions.Item>
                         {result.cd4Count > 0 && (
                           <Descriptions.Item label="CD4 Count">{result.cd4Count}</Descriptions.Item>
                         )}
                         <Descriptions.Item label="Ghi chú">{result.note || 'Không có'}</Descriptions.Item>
                       </Descriptions>
                     </Card>
                   ))
                 ) : (
                   <Alert message="Không có kết quả xét nghiệm" type="info" showIcon />
                 )}
              </TabPane>
              <TabPane tab="Lịch sử cuộc hẹn" key="4">
                {appointments.length > 0 ? (
                  <Table
                    dataSource={appointments}
                    rowKey="appointmentId"
                    pagination={false}
                    columns={[
                      {
                        title: 'Ngày giờ',
                        dataIndex: 'datetime',
                        key: 'datetime',
                        render: (text) => dayjs(text).format('DD/MM/YYYY HH:mm')
                      },
                      {
                        title: 'Bác sĩ',
                        dataIndex: 'doctorName',
                        key: 'doctorName',
                      },
                      {
                        title: 'Hình thức',
                        dataIndex: 'type',
                        key: 'type',
                      },
                      {
                        title: 'Trạng thái',
                        dataIndex: 'status',
                        key: 'status',
                        render: (status) => {
                          let color = 'default';
                          let icon = null;
                          
                          switch(status) {
                            case 'COMPLETED':
                              color = 'green';
                              icon = <CheckCircleOutlined />;
                              break;
                            case 'CONFIRMED':
                              color = 'blue';
                              icon = <CheckCircleOutlined />;
                              break;
                            case 'PENDING':
                              color = 'orange';
                              icon = <ClockCircleOutlined />;
                              break;
                            case 'CANCELLED':
                              color = 'red';
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
                        title: 'Ghi chú',
                        dataIndex: 'note',
                        key: 'note',
                        ellipsis: true,
                      }
                    ]}
                  />
                ) : (
                  <Alert message="Không có lịch sử cuộc hẹn" type="info" showIcon />
                )}
              </TabPane>
            </Tabs>
          )}
        </Spin>
      </Modal>

      {/* Create/Edit Modal */}
      <Modal
        title={
          <Space>
            {editingRecord ? <EditOutlined /> : <PlusOutlined />}
            <span>{editingRecord ? 'Chỉnh sửa hồ sơ bệnh án' : 'Tạo hồ sơ bệnh án mới'}</span>
          </Space>
        }
        open={modalVisible}
        onCancel={handleModalClose}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item 
            name="customerId" 
            label="ID Bệnh nhân" 
            rules={[{ required: true, message: 'Vui lòng nhập ID bệnh nhân' }]}
          >
            <Input placeholder="Nhập ID bệnh nhân" />
          </Form.Item>
          
          <Form.Item 
            name="doctorId" 
            label="ID Bác sĩ" 
            rules={[{ required: true, message: 'Vui lòng nhập ID bác sĩ' }]}
            initialValue={userInfo?.id}
          >
            <Input placeholder="Nhập ID bác sĩ" />
          </Form.Item>
          
          <Form.Item 
            name="cd4Count" 
            label="Số lượng CD4" 
            rules={[{ required: true, message: 'Vui lòng nhập số lượng CD4' }]}
          >
            <Input type="number" placeholder="Nhập số lượng CD4" />
          </Form.Item>
          
          <Form.Item 
            name="viralLoad" 
            label="Tải lượng virus" 
            rules={[{ required: true, message: 'Vui lòng nhập tải lượng virus' }]}
          >
            <Input type="number" placeholder="Nhập tải lượng virus" />
          </Form.Item>
          
          <Form.Item name="treatmentHistory" label="Tiền sử điều trị">
            <TextArea rows={4} placeholder="Nhập tiền sử điều trị (nếu có)" />
          </Form.Item>
          
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" icon={editingRecord ? <EditOutlined /> : <PlusOutlined />}>
                {editingRecord ? 'Cập nhật' : 'Tạo hồ sơ'}
              </Button>
              <Button onClick={handleModalClose}>
                Hủy
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Lab Result Creation Modal */}
      <Modal
        title={
          <Space>
            <ExperimentOutlined />
            <span>Tạo kết quả xét nghiệm cho {selectedPatient?.customerName}</span>
          </Space>
        }
        open={labResultModalVisible}
        onCancel={() => {
          setLabResultModalVisible(false);
          setSelectedPatient(null);
          labResultForm.resetFields();
        }}
        footer={null}
        width={700}
      >
        <Form
          form={labResultForm}
          layout="vertical"
          onFinish={handleCreateLabResult}
        >
          <Form.Item 
            name="testType" 
            label="Loại xét nghiệm" 
            rules={[{ required: true, message: 'Vui lòng chọn loại xét nghiệm' }]}
          >
            <Select placeholder="Chọn loại xét nghiệm">
              <Option value="CD4_COUNT">CD4 Count</Option>
              <Option value="VIRAL_LOAD">Viral Load</Option>
              <Option value="COMPLETE_BLOOD_COUNT">Tổng phân tích tế bào máu</Option>
              <Option value="LIVER_FUNCTION">Chức năng gan</Option>
              <Option value="KIDNEY_FUNCTION">Chức năng thận</Option>
              <Option value="LIPID_PROFILE">Chỉ số lipid</Option>
              <Option value="GLUCOSE">Đường huyết</Option>
              <Option value="OTHER">Khác</Option>
            </Select>
          </Form.Item>
          
          <Form.Item 
            name="testDate" 
            label="Ngày xét nghiệm" 
            rules={[{ required: true, message: 'Vui lòng chọn ngày xét nghiệm' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item 
                name="result" 
                label="Kết quả" 
                rules={[{ required: true, message: 'Vui lòng nhập kết quả' }]}
              >
                <Input placeholder="Nhập kết quả" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item 
                name="unit" 
                label="Đơn vị" 
                rules={[{ required: true, message: 'Vui lòng nhập đơn vị' }]}
              >
                <Input placeholder="Đơn vị" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item 
                name="normalRange" 
                label="Khoảng bình thường" 
                rules={[{ required: true, message: 'Vui lòng nhập khoảng bình thường' }]}
              >
                <Input placeholder="VD: 500-1500" />
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item name="interpretation" label="Diễn giải">
            <TextArea rows={3} placeholder="Giải thích kết quả xét nghiệm" />
          </Form.Item>
          
          <Form.Item name="recommendations" label="Khuyến nghị">
            <TextArea rows={3} placeholder="Đưa ra khuyến nghị dựa trên kết quả" />
          </Form.Item>
          
          <Alert
            message="Thông báo"
            description="Kết quả xét nghiệm sẽ được gửi tự động cho bệnh nhân qua email/SMS sau khi tạo."
            type="info"
            showIcon
            style={{ marginBottom: 16 }}
          />
          
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" icon={<SendOutlined />}>
                Tạo và gửi kết quả
              </Button>
              <Button onClick={() => {
                setLabResultModalVisible(false);
                setSelectedPatient(null);
                labResultForm.resetFields();
              }}>
                Hủy
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default MedicalRecords; 