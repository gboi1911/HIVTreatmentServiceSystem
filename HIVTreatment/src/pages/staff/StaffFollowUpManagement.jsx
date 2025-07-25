import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Card, 
  Button, 
  Space, 
  Tag, 
  Modal, 
  Form, 
  DatePicker, 
  TimePicker, 
  Input, 
  Select, 
  message, 
  Typography, 
  Tabs, 
  Descriptions, 
  Spin, 
  Badge, 
  Alert,
  Tooltip,
  Divider
} from 'antd';
import { 
  CalendarOutlined, 
  CheckCircleOutlined, 
  ClockCircleOutlined, 
  FileTextOutlined, 
  MedicineBoxOutlined, 
  PhoneOutlined, 
  UserOutlined,
  SendOutlined,
  BellOutlined,
  PlusOutlined,
  InfoCircleOutlined
} from '@ant-design/icons';
import { 
  getAllAppointments, 
  getAppointmentsByStatus, 
  updateAppointmentStatus, 
  bookAppointment 
} from '../../api/appointment';
import { getMedicalRecordsByCustomer } from '../../api/medicalRecord';
import { getTreatmentPlansByMedicalRecord } from '../../api/treatmentPlan';
import moment from 'moment';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;
const { TextArea } = Input;

const StaffFollowUpManagement = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [treatmentPlans, setTreatmentPlans] = useState([]);
  const [recordsLoading, setRecordsLoading] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [followUpModalVisible, setFollowUpModalVisible] = useState(false);
  const [reminderModalVisible, setReminderModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('1');
  const [form] = Form.useForm();
  const [reminderForm] = Form.useForm();

  // Fetch completed appointments
  const fetchCompletedAppointments = async () => {
    try {
      setLoading(true);
      const response = await getAppointmentsByStatus('COMPLETED');
      if (response && response.data) {
        setAppointments(response.data);
      }
    } catch (error) {
      console.error('Error fetching completed appointments:', error);
      message.error('Không thể tải danh sách cuộc hẹn đã hoàn thành');
    } finally {
      setLoading(false);
    }
  };

  // Fetch patient records when an appointment is selected
  const fetchPatientRecords = async (customerId) => {
    try {
      setRecordsLoading(true);
      // Fetch medical records
      const medicalRecordsData = await getMedicalRecordsByCustomer(customerId);
      setMedicalRecords(Array.isArray(medicalRecordsData) ? medicalRecordsData : []);
      
      // Fetch treatment plans for each medical record
      const allPlans = [];
      for (const record of Array.isArray(medicalRecordsData) ? medicalRecordsData : []) {
        const plans = await getTreatmentPlansByMedicalRecord(record.medicalRecordId);
        if (Array.isArray(plans)) allPlans.push(...plans);
      }
      setTreatmentPlans(allPlans);
    } catch (error) {
      console.error('Error fetching patient records:', error);
      message.error('Không thể tải hồ sơ bệnh nhân');
    } finally {
      setRecordsLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchCompletedAppointments();
  }, []);

  // Handle opening the detail modal
  const handleViewDetails = (record) => {
    setSelectedAppointment(record);
    fetchPatientRecords(record.customerId);
    setDetailModalVisible(true);
  };

  // Handle opening the follow-up modal
  const handleScheduleFollowUp = (record) => {
    setSelectedAppointment(record);
    setFollowUpModalVisible(true);
    form.resetFields();
    
    // Set default values for the form
    const twoWeeksLater = dayjs().add(14, 'day');
    form.setFieldsValue({
      customerId: record.customerId,
      doctorId: record.doctorId,
      type: record.type,
      date: twoWeeksLater,
      time: dayjs('09:00:00', 'HH:mm:ss'),
      note: `Tái khám theo dõi sau khi hoàn thành khám ngày ${dayjs(record.datetime).format('DD/MM/YYYY')}`
    });
  };

  // Handle creating a follow-up appointment
  const handleCreateFollowUp = async (values) => {
    try {
      const dateTime = values.date.format('YYYY-MM-DD') + 'T' + values.time.format('HH:mm:ss') + '.000Z';
      
      const appointmentData = {
        customerId: values.customerId,
        doctorId: values.doctorId,
        type: values.type,
        note: values.note,
        datetime: dateTime,
        customerName: selectedAppointment.customerName,
        customerPhone: selectedAppointment.customerPhone,
        customerEmail: selectedAppointment.customerEmail
      };
      
      const response = await bookAppointment(appointmentData);
      
      if (response && response.success !== false) {
        message.success('Đặt lịch tái khám thành công');
        setFollowUpModalVisible(false);
        fetchCompletedAppointments();
      } else {
        message.error('Đặt lịch tái khám thất bại');
      }
    } catch (error) {
      console.error('Error creating follow-up appointment:', error);
      message.error('Đặt lịch tái khám thất bại: ' + error.message);
    }
  };

  // Handle sending reminder
  const handleSendReminder = (record) => {
    setSelectedAppointment(record);
    setReminderModalVisible(true);
    reminderForm.resetFields();
    
    // Set default values for the reminder form
    reminderForm.setFieldsValue({
      message: `Xin chào ${record.customerName}, đây là lời nhắc về lịch tái khám của bạn. Vui lòng đặt lịch tái khám để tiếp tục theo dõi điều trị.`,
      channel: 'sms'
    });
  };

  // Handle submitting reminder
  const handleSubmitReminder = async (values) => {
    try {
      // In a real application, this would call an API to send the reminder
      // For now, we'll just simulate success
      message.success(`Đã gửi lời nhắc đến ${selectedAppointment.customerName} qua ${values.channel === 'sms' ? 'SMS' : 'Email'}`);
      setReminderModalVisible(false);
    } catch (error) {
      console.error('Error sending reminder:', error);
      message.error('Gửi lời nhắc thất bại');
    }
  };

  // Table columns
  const columns = [
    {
      title: 'Mã cuộc hẹn',
      dataIndex: 'appointmentId',
      key: 'appointmentId',
      width: 100,
    },
    {
      title: 'Bệnh nhân',
      dataIndex: 'customerName',
      key: 'customerName',
      render: (text, record) => (
        <Space direction="vertical" size={0}>
          <Text strong>{text}</Text>
          <Text type="secondary">{record.customerPhone}</Text>
        </Space>
      )
    },
    {
      title: 'Bác sĩ',
      dataIndex: 'doctorName',
      key: 'doctorName',
    },
    {
      title: 'Ngày khám',
      dataIndex: 'datetime',
      key: 'datetime',
      render: (text) => dayjs(text).format('DD/MM/YYYY HH:mm')
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color="green">
          <CheckCircleOutlined /> {status}
        </Tag>
      )
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Space size="small">
          <Button 
            type="primary" 
            size="small" 
            icon={<FileTextOutlined />} 
            onClick={() => handleViewDetails(record)}
          >
            Chi tiết
          </Button>
          <Button 
            type="default" 
            size="small" 
            icon={<CalendarOutlined />} 
            onClick={() => handleScheduleFollowUp(record)}
          >
            Đặt tái khám
          </Button>
          <Button 
            type="default" 
            size="small" 
            icon={<BellOutlined />} 
            onClick={() => handleSendReminder(record)}
          >
            Nhắc nhở
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <Title level={3}>Quản lý tái khám sau điều trị</Title>
        <Text type="secondary" style={{ marginBottom: '20px', display: 'block' }}>
          Quản lý các cuộc hẹn đã hoàn thành và lên lịch tái khám cho bệnh nhân
        </Text>
        
        <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between' }}>
          <Button 
            type="primary" 
            icon={<CheckCircleOutlined />} 
            onClick={fetchCompletedAppointments}
            loading={loading}
          >
            Tải danh sách cuộc hẹn đã hoàn thành
          </Button>
        </div>
        
        <Table
          columns={columns}
          dataSource={appointments}
          rowKey="appointmentId"
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Card>

      {/* Patient Detail Modal */}
      <Modal
        title={
          <Space>
            <UserOutlined />
            <span>Chi tiết bệnh nhân: {selectedAppointment?.customerName}</span>
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
            key="schedule" 
            type="primary" 
            icon={<CalendarOutlined />}
            onClick={() => {
              setDetailModalVisible(false);
              handleScheduleFollowUp(selectedAppointment);
            }}
          >
            Đặt lịch tái khám
          </Button>
        ]}
      >
        <Spin spinning={recordsLoading}>
          <Tabs activeKey={activeTab} onChange={setActiveTab}>
            <TabPane tab="Thông tin cuộc hẹn" key="1">
              {selectedAppointment && (
                <Descriptions bordered column={1}>
                  <Descriptions.Item label="Bệnh nhân">{selectedAppointment.customerName}</Descriptions.Item>
                  <Descriptions.Item label="Số điện thoại">{selectedAppointment.customerPhone}</Descriptions.Item>
                  <Descriptions.Item label="Email">{selectedAppointment.customerEmail}</Descriptions.Item>
                  <Descriptions.Item label="Bác sĩ">{selectedAppointment.doctorName}</Descriptions.Item>
                  <Descriptions.Item label="Chuyên khoa">{selectedAppointment.doctorSpecialty}</Descriptions.Item>
                  <Descriptions.Item label="Ngày giờ khám">
                    {dayjs(selectedAppointment.datetime).format('DD/MM/YYYY HH:mm')}
                  </Descriptions.Item>
                  <Descriptions.Item label="Hình thức">{selectedAppointment.type}</Descriptions.Item>
                  <Descriptions.Item label="Ghi chú">{selectedAppointment.note}</Descriptions.Item>
                </Descriptions>
              )}
            </TabPane>
            <TabPane tab="Hồ sơ bệnh án" key="2">
              {medicalRecords.length > 0 ? (
                medicalRecords.map(record => (
                  <Card 
                    key={record.medicalRecordId} 
                    title={`Hồ sơ bệnh án #${record.medicalRecordId}`}
                    style={{ marginBottom: '16px' }}
                    extra={record.lastUpdated ? dayjs(record.lastUpdated).format('DD/MM/YYYY HH:mm') : ''}
                  >
                    <Descriptions bordered column={1} size="small">
                      <Descriptions.Item label="Bác sĩ phụ trách">{record.doctorName}</Descriptions.Item>
                      <Descriptions.Item label="Số lượng CD4">{record.cd4Count}</Descriptions.Item>
                      <Descriptions.Item label="Tải lượng virus">{record.viralLoad}</Descriptions.Item>
                      <Descriptions.Item label="Tiền sử điều trị">{record.treatmentHistory || 'Không có'}</Descriptions.Item>
                    </Descriptions>
                  </Card>
                ))
              ) : (
                <Alert message="Không có hồ sơ bệnh án" type="info" showIcon />
              )}
            </TabPane>
            <TabPane tab="Phác đồ điều trị" key="3">
              {treatmentPlans.length > 0 ? (
                treatmentPlans.map(plan => (
                  <Card 
                    key={plan.planId} 
                    title={`Phác đồ điều trị #${plan.planId}`}
                    style={{ marginBottom: '16px' }}
                  >
                    <Descriptions bordered column={1} size="small">
                      <Descriptions.Item label="Phác đồ ARV">{plan.arvRegimen}</Descriptions.Item>
                      <Descriptions.Item label="Nhóm áp dụng">{plan.applicableGroup}</Descriptions.Item>
                      <Descriptions.Item label="Ngày bắt đầu">
                        {plan.startDate ? dayjs(plan.startDate).format('DD/MM/YYYY') : ''}
                      </Descriptions.Item>
                      <Descriptions.Item label="Ghi chú">{plan.note || 'Không có'}</Descriptions.Item>
                    </Descriptions>
                    
                    <Alert 
                      message="Cần hẹn tái khám" 
                      description={
                        <div>
                          <p>Bệnh nhân cần được tái khám sau 2 tuần kể từ khi bắt đầu phác đồ điều trị.</p>
                          <Button 
                            type="primary" 
                            size="small" 
                            icon={<CalendarOutlined />}
                            onClick={() => {
                              setDetailModalVisible(false);
                              handleScheduleFollowUp(selectedAppointment);
                            }}
                          >
                            Đặt lịch tái khám ngay
                          </Button>
                        </div>
                      }
                      type="warning" 
                      showIcon 
                      style={{ marginTop: '16px' }}
                    />
                  </Card>
                ))
              ) : (
                <Alert message="Không có phác đồ điều trị" type="info" showIcon />
              )}
            </TabPane>
          </Tabs>
        </Spin>
      </Modal>

      {/* Follow-up Appointment Modal */}
      <Modal
        title={
          <Space>
            <CalendarOutlined />
            <span>Đặt lịch tái khám cho bệnh nhân: {selectedAppointment?.customerName}</span>
          </Space>
        }
        open={followUpModalVisible}
        onCancel={() => setFollowUpModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCreateFollowUp}
        >
          <Form.Item name="customerId" hidden>
            <Input />
          </Form.Item>
          
          <Form.Item name="doctorId" label="Bác sĩ" rules={[{ required: true, message: 'Vui lòng chọn bác sĩ' }]}>
            <Select placeholder="Chọn bác sĩ">
              {/* Normally would fetch from API */}
              <Option value={selectedAppointment?.doctorId}>{selectedAppointment?.doctorName}</Option>
            </Select>
          </Form.Item>
          
          <Form.Item name="type" label="Hình thức khám" rules={[{ required: true, message: 'Vui lòng chọn hình thức khám' }]}>
            <Select placeholder="Chọn hình thức khám">
              <Option value="ONLINE">Trực tuyến</Option>
              <Option value="OFFLINE">Trực tiếp</Option>
            </Select>
          </Form.Item>
          
          <Form.Item label="Ngày giờ khám" style={{ marginBottom: 0 }}>
            <Form.Item
              name="date"
              rules={[{ required: true, message: 'Vui lòng chọn ngày khám' }]}
              style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}
            >
              <DatePicker placeholder="Chọn ngày" style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item
              name="time"
              rules={[{ required: true, message: 'Vui lòng chọn giờ khám' }]}
              style={{ display: 'inline-block', width: 'calc(50% - 8px)', margin: '0 0 0 16px' }}
            >
              <TimePicker placeholder="Chọn giờ" format="HH:mm" style={{ width: '100%' }} />
            </Form.Item>
          </Form.Item>
          
          <Form.Item name="note" label="Ghi chú">
            <TextArea rows={4} placeholder="Nhập ghi chú cho cuộc hẹn" />
          </Form.Item>
          
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" icon={<CalendarOutlined />}>
                Đặt lịch tái khám
              </Button>
              <Button onClick={() => setFollowUpModalVisible(false)}>
                Hủy
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Reminder Modal */}
      <Modal
        title={
          <Space>
            <BellOutlined />
            <span>Gửi lời nhắc tái khám cho: {selectedAppointment?.customerName}</span>
          </Space>
        }
        open={reminderModalVisible}
        onCancel={() => setReminderModalVisible(false)}
        footer={null}
        width={500}
      >
        <Form
          form={reminderForm}
          layout="vertical"
          onFinish={handleSubmitReminder}
        >
          <Form.Item name="channel" label="Phương thức gửi" rules={[{ required: true, message: 'Vui lòng chọn phương thức gửi' }]}>
            <Select placeholder="Chọn phương thức gửi">
              <Option value="sms">SMS ({selectedAppointment?.customerPhone})</Option>
              <Option value="email">Email ({selectedAppointment?.customerEmail})</Option>
            </Select>
          </Form.Item>
          
          <Form.Item name="message" label="Nội dung" rules={[{ required: true, message: 'Vui lòng nhập nội dung' }]}>
            <TextArea rows={4} placeholder="Nhập nội dung lời nhắc" />
          </Form.Item>
          
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" icon={<SendOutlined />}>
                Gửi lời nhắc
              </Button>
              <Button onClick={() => setReminderModalVisible(false)}>
                Hủy
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default StaffFollowUpManagement; 