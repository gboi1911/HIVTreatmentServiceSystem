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
  Form,
  Descriptions,
  Typography,
  Tabs,
  Alert,
  Statistic,
  Badge,
  Progress,
  Spin
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
  MedicineBoxOutlined
} from '@ant-design/icons';

import { 
  getMedicalRecords, 
  deleteMedicalRecord,
  createMedicalRecord,
  updateMedicalRecord
} from '../../api/medicalRecord';
import { getTreatmentPlansByMedicalRecord } from '../../api/treatmentPlan';
import { getAppointmentsByCustomer } from '../../api/appointment';
import dayjs from 'dayjs';

const { Option } = Select;
const { RangePicker } = DatePicker;
const { Title, Text } = Typography;
const { TabPane } = Tabs;

const MedicalRecords = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [cd4Range, setCd4Range] = useState([null, null]);
  const [viralLoadRange, setViralLoadRange] = useState([null, null]);

  // Modal state and form
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [form] = Form.useForm();
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [treatmentPlans, setTreatmentPlans] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [activeTab, setActiveTab] = useState('1');
  const [detailsLoading, setDetailsLoading] = useState(false);

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
      
      const recordsList = Array.isArray(data) ? data : [];
      setRecords(recordsList);
      
      // Calculate statistics
      const now = new Date();
      const thisMonth = recordsList.filter(record => {
        const recordDate = new Date(record.lastUpdated || record.createdAt);
        return recordDate.getMonth() === now.getMonth() && 
               recordDate.getFullYear() === now.getFullYear();
      });
      
      setStats({
        total: recordsList.length,
        thisMonth: thisMonth.length,
        normalCd4: recordsList.filter(r => r.cd4Status === 'NORMAL').length,
        normalViralLoad: recordsList.filter(r => r.viralLoadStatus === 'NORMAL').length
      });
    } catch (error) {
      console.error('Error loading medical records:', error);
      message.error('Không thể tải danh sách hồ sơ bệnh án');
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
        // doctorId: values.doctorId,
        doctorId: 1,
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
      // doctorId: record.doctorId,
      doctorId: 1,
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
    } catch (error) {
      console.error('Error fetching record details:', error);
    } finally {
      setDetailsLoading(false);
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
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa hồ sơ bệnh án này?"
            onConfirm={() => handleDelete(record.medicalRecordId)}
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
      <Title level={3}>Quản lý hồ sơ bệnh án</Title>
      <Text type="secondary" style={{ marginBottom: 20, display: 'block' }}>
        Quản lý hồ sơ bệnh án và theo dõi tình trạng sức khỏe của bệnh nhân
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
              showEditModal(selectedRecord);
            }}
          >
            Chỉnh sửa
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
              <TabPane tab="Lịch sử cuộc hẹn" key="3">
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
            <Input.TextArea rows={4} placeholder="Nhập tiền sử điều trị (nếu có)" />
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
    </div>
  );
};

export default MedicalRecords;
