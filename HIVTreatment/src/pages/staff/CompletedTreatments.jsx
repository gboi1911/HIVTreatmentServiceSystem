import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Card, 
  Button, 
  Space, 
  Tag, 
  Modal, 
  Tabs, 
  Descriptions, 
  Typography, 
  Spin, 
  Alert, 
  Input, 
  DatePicker,
  Statistic,
  Row,
  Col,
  Tooltip,
  Badge
} from 'antd';
import { 
  FileSearchOutlined, 
  MedicineBoxOutlined, 
  UserOutlined, 
  CalendarOutlined, 
  SearchOutlined,
  CheckCircleOutlined,
  SyncOutlined,
  ClockCircleOutlined,
  FileTextOutlined
} from '@ant-design/icons';
import { getMedicalRecordsByCustomer, getAllMedicalRecords } from '../../api/medicalRecord';
import { getTreatmentPlansByMedicalRecord } from '../../api/treatmentPlan';
import { getAppointmentsByCustomer } from '../../api/appointment';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

const CompletedTreatments = () => {
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [treatmentPlans, setTreatmentPlans] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('1');
  const [searchText, setSearchText] = useState('');
  const [dateRange, setDateRange] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    thisMonth: 0,
    withTreatmentPlan: 0,
    withFollowUp: 0
  });

  // Fetch all medical records
  const fetchMedicalRecords = async () => {
    try {
      setLoading(true);
      const records = await getAllMedicalRecords();
      console.log('Fetched medical records:', records);
      
      // Sort by last updated date (newest first)
      const sortedRecords = Array.isArray(records) 
        ? [...records].sort((a, b) => new Date(b.lastUpdated || 0) - new Date(a.lastUpdated || 0))
        : [];
      
      setMedicalRecords(sortedRecords);
      
      // Calculate statistics
      const now = new Date();
      const thisMonth = sortedRecords.filter(record => {
        const recordDate = new Date(record.lastUpdated || record.createdAt);
        return recordDate.getMonth() === now.getMonth() && 
               recordDate.getFullYear() === now.getFullYear();
      });
      
      setStats({
        total: sortedRecords.length,
        thisMonth: thisMonth.length,
        withTreatmentPlan: sortedRecords.filter(r => r.hasTreatmentPlan).length,
        withFollowUp: 0 // Will be updated when we implement follow-up tracking
      });
    } catch (error) {
      console.error('Error fetching medical records:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch details for a specific medical record
  const fetchRecordDetails = async (record) => {
    try {
      setDetailsLoading(true);
      setSelectedRecord(record);
      
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

  // Handle opening the detail modal
  const handleViewDetails = (record) => {
    fetchRecordDetails(record);
    setDetailModalVisible(true);
  };

  // Filter records based on search text and date range
  const getFilteredRecords = () => {
    return medicalRecords.filter(record => {
      // Filter by search text
      const searchMatch = !searchText || 
        record.customerName?.toLowerCase().includes(searchText.toLowerCase()) ||
        record.doctorName?.toLowerCase().includes(searchText.toLowerCase()) ||
        record.medicalRecordId?.toString().includes(searchText);
      
      // Filter by date range
      let dateMatch = true;
      if (dateRange && dateRange[0] && dateRange[1]) {
        const recordDate = dayjs(record.lastUpdated || record.createdAt);
        dateMatch = recordDate.isAfter(dateRange[0]) && recordDate.isBefore(dateRange[1]);
      }
      
      return searchMatch && dateMatch;
    });
  };

  // Load data on component mount
  useEffect(() => {
    fetchMedicalRecords();
  }, []);

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
      title: 'Ngày cập nhật',
      dataIndex: 'lastUpdated',
      key: 'lastUpdated',
      render: (text) => text ? dayjs(text).format('DD/MM/YYYY HH:mm') : 'Không có'
    },
    {
      title: 'Phác đồ điều trị',
      key: 'hasTreatmentPlan',
      dataIndex: 'hasTreatmentPlan',
      render: (hasPlan) => (
        hasPlan ? 
          <Tag color="green"><CheckCircleOutlined /> Đã có</Tag> : 
          <Tag color="orange"><ClockCircleOutlined /> Chưa có</Tag>
      )
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Button 
          type="primary" 
          icon={<FileSearchOutlined />} 
          onClick={() => handleViewDetails(record)}
        >
          Xem chi tiết
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Title level={3}>Quản lý hồ sơ điều trị đã hoàn thành</Title>
      
      {/* Statistics Cards */}
      <Row gutter={16} style={{ marginBottom: '24px' }}>
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
              title="Có phác đồ điều trị" 
              value={stats.withTreatmentPlan} 
              prefix={<MedicineBoxOutlined />} 
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic 
              title="Đã lên lịch tái khám" 
              value={stats.withFollowUp} 
              prefix={<CheckCircleOutlined />} 
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
      </Row>
      
      {/* Search and Filter */}
      <Card style={{ marginBottom: '24px' }}>
        <Space style={{ marginBottom: '16px' }}>
          <Input 
            placeholder="Tìm theo tên bệnh nhân, bác sĩ, mã hồ sơ" 
            prefix={<SearchOutlined />} 
            style={{ width: 300 }}
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            allowClear
          />
          <RangePicker 
            placeholder={['Từ ngày', 'Đến ngày']}
            onChange={(dates) => setDateRange(dates)}
          />
          <Button 
            type="primary" 
            icon={<SyncOutlined />} 
            onClick={fetchMedicalRecords}
          >
            Làm mới
          </Button>
        </Space>
        
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
          </Button>
        ]}
      >
        <Spin spinning={detailsLoading}>
          <Tabs activeKey={activeTab} onChange={setActiveTab}>
            <TabPane tab="Thông tin hồ sơ" key="1">
              {selectedRecord && (
                <Descriptions bordered column={1}>
                  <Descriptions.Item label="Mã hồ sơ">{selectedRecord.medicalRecordId}</Descriptions.Item>
                  <Descriptions.Item label="Bệnh nhân">{selectedRecord.customerName}</Descriptions.Item>
                  <Descriptions.Item label="Bác sĩ phụ trách">{selectedRecord.doctorName}</Descriptions.Item>
                  <Descriptions.Item label="Ngày cập nhật">
                    {selectedRecord.lastUpdated ? dayjs(selectedRecord.lastUpdated).format('DD/MM/YYYY HH:mm') : 'Không có'}
                  </Descriptions.Item>
                  <Descriptions.Item label="Số lượng CD4">
                    <Text strong>{selectedRecord.cd4Count}</Text>
                    <Text type={selectedRecord.cd4Status === 'NORMAL' ? 'success' : 'danger'} style={{ marginLeft: 8 }}>
                      ({selectedRecord.cd4Status || 'Chưa xác định'})
                    </Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="Tải lượng virus">
                    <Text strong>{selectedRecord.viralLoad}</Text>
                    <Text type={selectedRecord.viralLoadStatus === 'NORMAL' ? 'success' : 'danger'} style={{ marginLeft: 8 }}>
                      ({selectedRecord.viralLoadStatus || 'Chưa xác định'})
                    </Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="Tiền sử điều trị">{selectedRecord.treatmentHistory || 'Không có'}</Descriptions.Item>
                </Descriptions>
              )}
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
        </Spin>
      </Modal>
    </div>
  );
};

export default CompletedTreatments; 