import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Typography, 
  Tabs, 
  Table, 
  Tag, 
  Space, 
  Descriptions, 
  Alert, 
  Spin, 
  Statistic, 
  Progress, 
  Badge, 
  Button,
  Timeline,
  Divider,
  message
} from 'antd';
import { 
  FileTextOutlined, 
  MedicineBoxOutlined, 
  ExperimentOutlined, 
  UserOutlined, 
  CalendarOutlined, 
  CheckCircleOutlined, 
  ClockCircleOutlined, 
  ExclamationCircleOutlined,
  HeartOutlined,
  TrendingUpOutlined,
  BellOutlined,
  DownloadOutlined,
  EyeOutlined
} from '@ant-design/icons';
import { 
  getMedicalRecordsByCustomer 
} from '../api/medicalRecord';
import { 
  getTreatmentPlansByCustomer 
} from '../api/treatmentPlan';
import { 
  getLabResultsByCustomer 
} from '../api/labResult';
import { 
  getAppointmentsByCustomer 
} from '../api/appointment';
import { useAuthStatus } from '../hooks/useAuthStatus';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const UserDashboard = () => {
  const { userInfo } = useAuthStatus();
  const [loading, setLoading] = useState(true);
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [treatmentPlans, setTreatmentPlans] = useState([]);
  const [labResults, setLabResults] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [stats, setStats] = useState({
    totalRecords: 0,
    activePlans: 0,
    totalTests: 0,
    upcomingAppointments: 0
  });

  // Load all user data
  const loadUserData = async () => {
    if (!userInfo?.id && !userInfo?.customerId) {
      message.error('Không tìm thấy thông tin người dùng');
      return;
    }

    setLoading(true);
    try {
      const customerId = userInfo.customerId || userInfo.id;
      
      // Load medical records
      const recordsData = await getMedicalRecordsByCustomer(customerId);
      const records = Array.isArray(recordsData) ? recordsData : [];
      setMedicalRecords(records);

      // Load treatment plans
      const plansData = await getTreatmentPlansByCustomer(customerId);
      const plans = Array.isArray(plansData) ? plansData : [];
      setTreatmentPlans(plans);

      // Load lab results
      const labData = await getLabResultsByCustomer(customerId);
      const labs = Array.isArray(labData) ? labData : [];
      setLabResults(labs);

      // Load appointments
      const appointmentsData = await getAppointmentsByCustomer(customerId);
      const appointmentsList = appointmentsData?.data || [];
      setAppointments(appointmentsList);

      // Calculate statistics
      const now = new Date();
      const upcomingAppointments = appointmentsList.filter(apt => 
        new Date(apt.datetime) > now && apt.status === 'CONFIRMED'
      );

      setStats({
        totalRecords: records.length,
        activePlans: plans.filter(plan => plan.status === 'ACTIVE').length,
        totalTests: labs.length,
        upcomingAppointments: upcomingAppointments.length
      });

    } catch (error) {
      console.error('Error loading user data:', error);
      message.error('Không thể tải dữ liệu người dùng');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUserData();
  }, [userInfo]);

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

  // Get appointment status color
  const getAppointmentStatusColor = (status) => {
    switch(status) {
      case 'COMPLETED': return 'green';
      case 'CONFIRMED': return 'blue';
      case 'PENDING': return 'orange';
      case 'CANCELLED': return 'red';
      default: return 'default';
    }
  };

  // Medical Records Table Columns
  const medicalRecordColumns = [
    {
      title: 'Ngày cập nhật',
      dataIndex: 'lastUpdated',
      key: 'lastUpdated',
      render: (text) => text ? dayjs(text).format('DD/MM/YYYY HH:mm') : 'Không có'
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
      title: 'Tiền sử điều trị',
      dataIndex: 'treatmentHistory',
      key: 'treatmentHistory',
      ellipsis: true,
      render: (text) => text || 'Không có'
    }
  ];

  // Treatment Plans Table Columns
  const treatmentPlanColumns = [
    {
      title: 'Phác đồ ARV',
      dataIndex: 'arvRegimen',
      key: 'arvRegimen',
      render: (text) => <Tag color="blue">{text}</Tag>
    },
    {
      title: 'Nhóm áp dụng',
      dataIndex: 'applicableGroup',
      key: 'applicableGroup',
    },
    {
      title: 'Ngày bắt đầu',
      dataIndex: 'startDate',
      key: 'startDate',
      render: (text) => text ? dayjs(text).format('DD/MM/YYYY') : 'Không có'
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const color = status === 'ACTIVE' ? 'green' : status === 'COMPLETED' ? 'blue' : 'orange';
        return <Tag color={color}>{status}</Tag>;
      }
    },
    {
      title: 'Ghi chú',
      dataIndex: 'note',
      key: 'note',
      ellipsis: true,
      render: (text) => text || 'Không có'
    }
  ];

  // Lab Results Table Columns
  const labResultColumns = [
    {
      title: 'Ngày xét nghiệm',
      dataIndex: 'testDate',
      key: 'testDate',
      render: (text) => text ? dayjs(text).format('DD/MM/YYYY') : 'Không có'
    },
    {
      title: 'Kết quả',
      dataIndex: 'result',
      key: 'result',
      ellipsis: true
    },
    {
      title: 'CD4 Count',
      dataIndex: 'cd4Count',
      key: 'cd4Count',
      render: (cd4Count) => cd4Count > 0 ? (
        <Tag color={getCd4StatusColor(cd4Count)}>{cd4Count}</Tag>
      ) : 'Không có'
    },
    {
      title: 'Ghi chú',
      dataIndex: 'note',
      key: 'note',
      ellipsis: true,
      render: (text) => text || 'Không có'
    }
  ];

  // Appointments Table Columns
  const appointmentColumns = [
    {
      title: 'Ngày giờ',
      dataIndex: 'datetime',
      key: 'datetime',
      render: (text) => text ? dayjs(text).format('DD/MM/YYYY HH:mm') : 'Không có'
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
      render: (type) => <Tag color="purple">{type}</Tag>
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => <Tag color={getAppointmentStatusColor(status)}>{status}</Tag>
    },
    {
      title: 'Ghi chú',
      dataIndex: 'note',
      key: 'note',
      ellipsis: true,
      render: (text) => text || 'Không có'
    }
  ];

  // Get latest medical record
  const getLatestMedicalRecord = () => {
    if (medicalRecords.length === 0) return null;
    return medicalRecords.sort((a, b) => 
      new Date(b.lastUpdated || 0) - new Date(a.lastUpdated || 0)
    )[0];
  };

  // Get active treatment plan
  const getActiveTreatmentPlan = () => {
    return treatmentPlans.find(plan => plan.status === 'ACTIVE');
  };

  // Get latest lab result
  const getLatestLabResult = () => {
    if (labResults.length === 0) return null;
    return labResults.sort((a, b) => 
      new Date(b.testDate || 0) - new Date(a.testDate || 0)
    )[0];
  };

  const latestRecord = getLatestMedicalRecord();
  const activePlan = getActiveTreatmentPlan();
  const latestLab = getLatestLabResult();

  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>Dashboard của tôi</Title>
      <Text type="secondary" style={{ marginBottom: 20, display: 'block' }}>
        Tổng quan về sức khỏe và quá trình điều trị của bạn
      </Text>

      <Spin spinning={loading}>
        {/* Statistics Cards */}
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col span={6}>
            <Card>
              <Statistic 
                title="Hồ sơ bệnh án" 
                value={stats.totalRecords} 
                prefix={<FileTextOutlined />} 
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic 
                title="Phác đồ đang điều trị" 
                value={stats.activePlans} 
                prefix={<MedicineBoxOutlined />} 
                valueStyle={{ color: '#3f8600' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic 
                title="Kết quả xét nghiệm" 
                value={stats.totalTests} 
                prefix={<ExperimentOutlined />} 
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic 
                title="Lịch hẹn sắp tới" 
                value={stats.upcomingAppointments} 
                prefix={<CalendarOutlined />} 
                valueStyle={{ color: '#722ed1' }}
              />
            </Card>
          </Col>
        </Row>

        {/* Quick Overview */}
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col span={8}>
            <Card title="Hồ sơ bệnh án mới nhất" extra={<FileTextOutlined />}>
              {latestRecord ? (
                <div>
                  <Descriptions column={1} size="small">
                    <Descriptions.Item label="CD4 Count">
                      <Space>
                        <Text strong>{latestRecord.cd4Count}</Text>
                        <Tag color={getCd4StatusColor(latestRecord.cd4Count)}>
                          {latestRecord.cd4Count >= 500 ? 'Bình thường' : latestRecord.cd4Count >= 200 ? 'Thấp' : 'Rất thấp'}
                        </Tag>
                      </Space>
                    </Descriptions.Item>
                    <Descriptions.Item label="Viral Load">
                      <Space>
                        <Text strong>{latestRecord.viralLoad}</Text>
                        <Tag color={getViralLoadStatusColor(latestRecord.viralLoad)}>
                          {latestRecord.viralLoad < 50 ? 'Không phát hiện' : latestRecord.viralLoad < 1000 ? 'Thấp' : 'Cao'}
                        </Tag>
                      </Space>
                    </Descriptions.Item>
                    <Descriptions.Item label="Cập nhật lần cuối">
                      {dayjs(latestRecord.lastUpdated).format('DD/MM/YYYY HH:mm')}
                    </Descriptions.Item>
                  </Descriptions>
                  
                  {/* Health Progress */}
                  <Divider />
                  <div style={{ textAlign: 'center' }}>
                    <Text strong>Chỉ số sức khỏe</Text>
                    <Row gutter={16} style={{ marginTop: 8 }}>
                      <Col span={12}>
                        <Progress 
                          type="circle" 
                          percent={Math.min((latestRecord.cd4Count / 1000) * 100, 100)} 
                          format={() => latestRecord.cd4Count}
                          strokeColor={getCd4StatusColor(latestRecord.cd4Count)}
                          size={60}
                        />
                        <div style={{ fontSize: '12px', marginTop: 4 }}>CD4</div>
                      </Col>
                      <Col span={12}>
                        <Progress 
                          type="circle" 
                          percent={Math.min((latestRecord.viralLoad / 10000) * 100, 100)} 
                          format={() => latestRecord.viralLoad}
                          strokeColor={getViralLoadStatusColor(latestRecord.viralLoad)}
                          size={60}
                        />
                        <div style={{ fontSize: '12px', marginTop: 4 }}>Viral Load</div>
                      </Col>
                    </Row>
                  </div>
                </div>
              ) : (
                <Alert message="Chưa có hồ sơ bệnh án" type="info" showIcon />
              )}
            </Card>
          </Col>
          
          <Col span={8}>
            <Card title="Phác đồ điều trị hiện tại" extra={<MedicineBoxOutlined />}>
              {activePlan ? (
                <div>
                  <Descriptions column={1} size="small">
                    <Descriptions.Item label="Phác đồ ARV">
                      <Tag color="blue">{activePlan.arvRegimen}</Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label="Nhóm áp dụng">
                      {activePlan.applicableGroup}
                    </Descriptions.Item>
                    <Descriptions.Item label="Ngày bắt đầu">
                      {dayjs(activePlan.startDate).format('DD/MM/YYYY')}
                    </Descriptions.Item>
                    <Descriptions.Item label="Trạng thái">
                      <Badge status="processing" text="Đang điều trị" />
                    </Descriptions.Item>
                  </Descriptions>
                  
                  {activePlan.note && (
                    <>
                      <Divider />
                      <Text type="secondary">Ghi chú: {activePlan.note}</Text>
                    </>
                  )}
                </div>
              ) : (
                <Alert message="Chưa có phác đồ điều trị đang hoạt động" type="info" showIcon />
              )}
            </Card>
          </Col>
          
          <Col span={8}>
            <Card title="Kết quả xét nghiệm gần nhất" extra={<ExperimentOutlined />}>
              {latestLab ? (
                <div>
                  <Descriptions column={1} size="small">
                    <Descriptions.Item label="Ngày xét nghiệm">
                      {dayjs(latestLab.testDate).format('DD/MM/YYYY')}
                    </Descriptions.Item>
                    <Descriptions.Item label="Kết quả">
                      {latestLab.result}
                    </Descriptions.Item>
                    {latestLab.cd4Count > 0 && (
                      <Descriptions.Item label="CD4 Count">
                        <Tag color={getCd4StatusColor(latestLab.cd4Count)}>
                          {latestLab.cd4Count}
                        </Tag>
                      </Descriptions.Item>
                    )}
                  </Descriptions>
                  
                  {latestLab.note && (
                    <>
                      <Divider />
                      <Text type="secondary">Ghi chú: {latestLab.note}</Text>
                    </>
                  )}
                </div>
              ) : (
                <Alert message="Chưa có kết quả xét nghiệm" type="info" showIcon />
              )}
            </Card>
          </Col>
        </Row>

        {/* Detailed Information Tabs */}
        <Card>
          <Tabs defaultActiveKey="1">
            <TabPane 
              tab={
                <span>
                  <FileTextOutlined />
                  Hồ sơ bệnh án
                </span>
              } 
              key="1"
            >
              <Table
                columns={medicalRecordColumns}
                dataSource={medicalRecords}
                rowKey="medicalRecordId"
                pagination={{ pageSize: 5 }}
                locale={{ emptyText: 'Chưa có hồ sơ bệnh án' }}
              />
            </TabPane>
            
            <TabPane 
              tab={
                <span>
                  <MedicineBoxOutlined />
                  Phác đồ điều trị
                </span>
              } 
              key="2"
            >
              <Table
                columns={treatmentPlanColumns}
                dataSource={treatmentPlans}
                rowKey="planId"
                pagination={{ pageSize: 5 }}
                locale={{ emptyText: 'Chưa có phác đồ điều trị' }}
              />
            </TabPane>
            
            <TabPane 
              tab={
                <span>
                  <ExperimentOutlined />
                  Kết quả xét nghiệm
                </span>
              } 
              key="3"
            >
              <Table
                columns={labResultColumns}
                dataSource={labResults}
                rowKey="labResultId"
                pagination={{ pageSize: 5 }}
                locale={{ emptyText: 'Chưa có kết quả xét nghiệm' }}
              />
            </TabPane>
            
            <TabPane 
              tab={
                <span>
                  <CalendarOutlined />
                  Lịch sử cuộc hẹn
                </span>
              } 
              key="4"
            >
              <Table
                columns={appointmentColumns}
                dataSource={appointments}
                rowKey="appointmentId"
                pagination={{ pageSize: 5 }}
                locale={{ emptyText: 'Chưa có lịch sử cuộc hẹn' }}
              />
            </TabPane>
          </Tabs>
        </Card>

        {/* Timeline of Health Events */}
        {medicalRecords.length > 0 || treatmentPlans.length > 0 || labResults.length > 0 ? (
          <Card title="Timeline sự kiện sức khỏe" style={{ marginTop: 24 }}>
            <Timeline>
              {[
                ...medicalRecords.map(record => ({
                  type: 'medical',
                  date: record.lastUpdated,
                  title: 'Cập nhật hồ sơ bệnh án',
                  description: `CD4: ${record.cd4Count}, Viral Load: ${record.viralLoad}`,
                  color: 'blue'
                })),
                ...treatmentPlans.map(plan => ({
                  type: 'treatment',
                  date: plan.startDate,
                  title: 'Bắt đầu phác đồ điều trị',
                  description: plan.arvRegimen,
                  color: 'green'
                })),
                ...labResults.map(lab => ({
                  type: 'lab',
                  date: lab.testDate,
                  title: 'Kết quả xét nghiệm',
                  description: lab.result,
                  color: 'purple'
                }))
              ]
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .slice(0, 10)
                .map((event, index) => (
                  <Timeline.Item 
                    key={index} 
                    color={event.color}
                    dot={event.type === 'medical' ? <FileTextOutlined /> : 
                         event.type === 'treatment' ? <MedicineBoxOutlined /> : 
                         <ExperimentOutlined />}
                  >
                    <div>
                      <Text strong>{event.title}</Text>
                      <br />
                      <Text type="secondary">{event.description}</Text>
                      <br />
                      <Text type="secondary" style={{ fontSize: '12px' }}>
                        {dayjs(event.date).format('DD/MM/YYYY HH:mm')}
                      </Text>
                    </div>
                  </Timeline.Item>
                ))}
            </Timeline>
          </Card>
        ) : null}
      </Spin>
    </div>
  );
};

export default UserDashboard; 