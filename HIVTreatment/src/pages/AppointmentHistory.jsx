import React, { useState, useEffect } from 'react';
import { Card, Table, Tag, Button, Typography, Space, Divider, message, Spin, Modal, Form, Input, DatePicker, TimePicker, Select } from 'antd';
import { CalendarOutlined, EyeOutlined, EditOutlined, DeleteOutlined, ClockCircleOutlined, UserOutlined, PhoneOutlined, VideoCameraOutlined } from '@ant-design/icons';
import { getAppointmentsByCustomer, updateAppointment, updateAppointmentStatus } from '../api/appointment';
import { getCurrentUser } from '../api/auth';
import { isLoggedIn } from '../utils/auth';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

export default function AppointmentHistory() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [detailVisible, setDetailVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [userLoading, setUserLoading] = useState(true);
  const [form] = Form.useForm();

  const mapStatusToVietnamese = (status) => {
    const statusMap = {
      'SCHEDULED': 'Đã lên lịch',
      'PENDING': 'Chờ xác nhận',
      'CONFIRMED': 'Đã xác nhận',
      'IN_PROGRESS': 'Đang diễn ra',
      'COMPLETED': 'Đã hoàn thành',
      'CANCELLED': 'Đã hủy',
      'NO_SHOW': 'Không đến',
      'RESCHEDULED': 'Đã dời lịch'
    };
    return statusMap[status] || status;
  };

  // Load user info and appointments
  useEffect(() => {
    loadUserAndAppointments();
  }, []);

  const loadUserAndAppointments = async () => {
    try {
      setUserLoading(true);
      
      // Check if user is logged in
      if (!isLoggedIn()) {
        message.error('Vui lòng đăng nhập để xem lịch hẹn');
        return;
      }

      // Get current user with correct customer ID
      const token = localStorage.getItem('token');
      const user = await getCurrentUser(token);
      setCurrentUser(user);
      
      console.log('👤 Current user loaded:', user);
      console.log('🆔 User IDs:', {
        id: user.id,
        customerId: user.customerId,
        accountId: user.accountId
      });

      // Load appointments using the correct customer ID
      await loadAppointments(user);
      
    } catch (error) {
      console.error('Failed to load user and appointments:', error);
      message.error('Không thể tải thông tin người dùng. Vui lòng đăng nhập lại.');
    } finally {
      setUserLoading(false);
    }
  };

  const loadAppointments = async (user = currentUser) => {
    try {
      setLoading(true);
      
      if (!user) {
        console.error('No user provided');
        message.error('Thông tin người dùng không có sẵn');
        return;
      }

      // Use the correct customer ID (prioritize customerId, fallback to id)
      const customerId = user.customerId || user.id;
      
      if (!customerId) {
        console.error('No customer ID found in user object:', user);
        message.error('Không thể xác định ID khách hàng. Vui lòng đăng nhập lại.');
        return;
      }
      
      console.log('🔍 Loading appointments for customer ID:', customerId);
      const response = await getAppointmentsByCustomer(customerId);
      
      console.log('📋 Appointments API response:', response);
      
      // Handle different response structures
      let appointmentsData = [];
      if (response.data && Array.isArray(response.data)) {
        appointmentsData = response.data;
      } else if (Array.isArray(response)) {
        appointmentsData = response;
      } else if (response.appointments && Array.isArray(response.appointments)) {
        appointmentsData = response.appointments;
      }

      console.log('📋 Processed appointments data:', appointmentsData);

      // Transform appointments to match UI expectations
      const transformedAppointments = appointmentsData.map(appointment => {
        console.log('📅 Appointment datetime from API:', appointment.datetime);
        console.log('📅 Datetime type:', typeof appointment.datetime);
        console.log('📅 Raw datetime value:', appointment.datetime);
        
        // Parse the datetime to see what we're working with
        const parsedDate = dayjs(appointment.datetime);
        console.log('📅 Parsed with dayjs:', parsedDate.format('YYYY-MM-DD HH:mm:ss'));
        console.log('📅 Is valid dayjs:', parsedDate.isValid());
        console.log('📅 Display format:', parsedDate.format('DD/MM/YYYY HH:mm'));
        
        return {
          // Fix: Use appointmentId as primary, fallback to id
          id: appointment.appointmentId || appointment.id,
          appointmentId: appointment.appointmentId || appointment.id, // Keep both for compatibility
          doctorName: appointment.doctorName || appointment.doctor?.name || 'Chưa xác định',
          consultationType: appointment.type || appointment.consultationType || 'Chưa xác định',
          datetime: appointment.datetime,
          status: appointment.status,
          note: appointment.note || '',
          createdAt: appointment.createdAt || appointment.created_at,
          customerId: appointment.customerId,
          doctorId: appointment.doctorId,
          customerName: appointment.customerName,
          customerPhone: appointment.customerPhone,
          customerEmail: appointment.customerEmail
        };
      });

      // Add debugging to see the actual appointment IDs
      console.log('🔍 Transformed appointments with IDs:', transformedAppointments.map(apt => ({
        id: apt.id,
        appointmentId: apt.appointmentId,
        originalData: appointmentsData.find(orig => orig.appointmentId === apt.id || orig.id === apt.id)
      })));

      setAppointments(transformedAppointments);
      
      if (transformedAppointments.length === 0) {
        message.info('Bạn chưa có lịch hẹn nào');
      } else {
        console.log(`✅ Loaded ${transformedAppointments.length} appointments`);
      }
      
    } catch (error) {
      console.error('Failed to load appointments:', error);
      message.error('Không thể tải danh sách lịch hẹn. Hiển thị dữ liệu mẫu.');
      
      // Fallback to demo data
      setAppointments([
        {
          id: 1,
          appointmentId: 1,
          doctorName: "TS. Nguyễn Văn A",
          consultationType: "Video call",
          datetime: "2024-07-02 09:00",
          status: "CONFIRMED",
          note: "Tư vấn về kết quả xét nghiệm",
          createdAt: "2024-06-28 14:30"
        },
        {
          id: 2,
          appointmentId: 2,
          doctorName: "ThS. Trần Thị B",
          consultationType: "Điện thoại",
          datetime: "2024-07-05 14:30",
          status: "PENDING",
          note: "Tư vấn tâm lý sau chẩn đoán",
          createdAt: "2024-06-29 10:15"
        },
        {
          id: 3,
          appointmentId: 3,
          doctorName: "TS. Nguyễn Văn A",
          consultationType: "Trực tiếp",
          datetime: "2024-06-25 10:00",
          status: "COMPLETED",
          note: "Tư vấn về chế độ dinh dưỡng",
          createdAt: "2024-06-20 16:45"
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Update the getStatusColor function
  const getStatusColor = (status) => {
    const vietnameseStatus = mapStatusToVietnamese(status);
    
    const statusColors = {
      'Đã lên lịch': 'blue',
      'Chờ xác nhận': 'orange',
      'Đã xác nhận': 'blue',
      'Đang diễn ra': 'processing',
      'Đã hoàn thành': 'green',
      'Đã hủy': 'red',
      'Không đến': 'gray',
      'Đã dời lịch': 'purple'
    };
    
    return statusColors[vietnameseStatus] || 'default';
  };

  const getConsultationIcon = (type) => {
    switch (type) {
      case 'Video call': return <VideoCameraOutlined className="text-blue-500" />;
      case 'Điện thoại': return <PhoneOutlined className="text-green-500" />;
      case 'Trực tiếp': return <UserOutlined className="text-purple-500" />;
      default: return null;
    }
  };

  // Only allow edit/cancel if status is PENDING
  const canEdit = (appointment) => {
    return appointment.status === 'PENDING';
  };

  const canCancel = (appointment) => {
    return appointment.status === 'PENDING';
  };

  const handleViewDetail = (appointment) => {
    setSelectedAppointment(appointment);
    setDetailVisible(true);
  };

  const handleEdit = (appointment) => {
    setSelectedAppointment(appointment);
    form.setFieldsValue({
      datetime: dayjs(appointment.datetime),
      consultationType: appointment.consultationType,
      note: appointment.note
    });
    setEditVisible(true);
  };

  const handleUpdateAppointment = async (values) => {
    try {
      const updateData = {
        datetime: values.datetime.format('YYYY-MM-DD HH:mm:ss'),
        consultationType: values.consultationType,
        note: values.note
      };
      
      await updateAppointment(selectedAppointment.id, updateData);
      message.success('Cập nhật lịch hẹn thành công!');
      setEditVisible(false);
      // Refresh appointments after update
      await loadAppointments();
    } catch (error) {
      console.error('Failed to update appointment:', error);
      message.error('Cập nhật lịch hẹn thất bại');
    }
  };

  const handleCancel = async (appointmentId) => {
    // Add validation to ensure we have a valid ID
    if (!appointmentId) {
      console.error('❌ No appointment ID provided for cancellation');
      message.error('Không thể xác định ID cuộc hẹn để hủy');
      return;
    }

    console.log('🔍 Attempting to cancel appointment with ID:', appointmentId);

    Modal.confirm({
      title: 'Xác nhận hủy lịch hẹn',
      content: 'Bạn có chắc chắn muốn hủy lịch hẹn này? Trạng thái sẽ được thay đổi thành "Đã hủy".',
      okText: 'Hủy lịch hẹn',
      okType: 'danger',
      cancelText: 'Không',
      onOk: async () => {
        try {
          console.log('🚀 Calling updateAppointmentStatus with ID:', appointmentId);
          // Update appointment status to CANCELLED instead of deleting
          await updateAppointmentStatus(appointmentId, 'CANCELLED');
          message.success('Hủy lịch hẹn thành công!');
          await loadAppointments();
        } catch (error) {
          console.error('Failed to cancel appointment:', error);
          message.error('Hủy lịch hẹn thất bại!');
        }
      }
    });
  };

  const columns = [
    {
      title: 'Bác sĩ tư vấn',
      dataIndex: 'doctorName',
      key: 'doctorName',
      render: (text) => <Text strong>{text}</Text>
    },
    {
      title: 'Thời gian',
      dataIndex: 'datetime',
      key: 'datetime',
      render: (datetime) => (
        <div className="flex flex-col">
          <Text strong>
            {dayjs(datetime).format('DD/MM/YYYY')}
          </Text>
          <Text type="secondary" className="text-sm">
            {dayjs(datetime).format('HH:mm')}
          </Text>
        </div>
      )
    },
    {
      title: 'Hình thức',
      dataIndex: 'type',
      key: 'type',
      render: (type, record) => {
        const consultationType = type || record.consultationType;
        return (
          <div className="flex items-center gap-2">
            {getConsultationIcon(consultationType)}
            <span>{consultationType}</span>
          </div>
        );
      }
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const vietnameseStatus = mapStatusToVietnamese(status);
        return (
          <Tag color={getStatusColor(status)}>{vietnameseStatus}</Tag>
        );
      }
    },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => handleViewDetail(record)}
            size="small"
          >
            Xem
          </Button>
          {canEdit(record) && (
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
              size="small"
            >
              Sửa
            </Button>
          )}
          {canCancel(record) && (
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleCancel(record.id)}
              size="small"
            >
              Hủy
            </Button>
          )}
        </Space>
      )
    }
  ];

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Vui lòng đăng nhập</h2>
          <p className="text-gray-600 mb-4">Bạn cần đăng nhập để xem lịch sử cuộc hẹn</p>
          <Button type="primary" onClick={() => window.location.href = '/login'}>
            Đăng nhập
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Show loading screen while loading user or appointments */}
      {userLoading ? (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <Spin size="large" />
            <p className="mt-4 text-gray-600">Đang tải thông tin người dùng...</p>
          </div>
        </div>
      ) : (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <Title level={1} className="flex items-center gap-3 !mb-2">
              <CalendarOutlined className="text-blue-600" />
              Lịch sử cuộc hẹn
            </Title>
            <Text type="secondary" className="text-lg">
              Quản lý và theo dõi các cuộc hẹn tư vấn của bạn
            </Text>
            {currentUser && (
              <div className="mt-4 inline-flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full">
                <UserOutlined className="text-blue-600" />
                <Text className="text-blue-800">
                  Xin chào, {currentUser.fullName || currentUser.username}
                </Text>
              </div>
            )}
          </div>

          <Card className="shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <Title level={4} className="!mb-0">
                Danh sách cuộc hẹn
              </Title>
            </div>
            
            <Table
              columns={columns}
              dataSource={appointments}
              rowKey="id"
              loading={loading}
              pagination={true}
              locale={{}}
            />
          </Card>

          {/* Detail Modal */}
          <Modal
            title="Chi tiết cuộc hẹn"
            open={detailVisible}
            onCancel={() => setDetailVisible(false)}
            footer={null}
            width={600}
            centered
          >
            {selectedAppointment && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Text type="secondary">Bác sĩ tư vấn:</Text>
                    <div className="font-medium">{selectedAppointment.doctorName}</div>
                  </div>
                  <div>
                    <Text type="secondary">Hình thức tư vấn:</Text>
                    <div className="flex items-center gap-2 font-medium">
                      {getConsultationIcon(selectedAppointment.consultationType || selectedAppointment.type)}
                      {selectedAppointment.consultationType || selectedAppointment.type}
                    </div>
                  </div>
                  <div>
                    <Text type="secondary">Ngày giờ:</Text>
                    <div className="font-medium">
                      {dayjs(selectedAppointment.datetime).format('DD/MM/YYYY HH:mm')}
                    </div>
                  </div>
                  <div>
                    <Text type="secondary">Trạng thái:</Text>
                    <div>
                      <Tag color={getStatusColor(selectedAppointment.status)}>
                        {mapStatusToVietnamese(selectedAppointment.status)}
                      </Tag>
                    </div>
                  </div>
                </div>
                
                <Divider />
                
                <div>
                  <Text type="secondary">Ghi chú:</Text>
                  <div className="mt-2 p-3 bg-gray-50 rounded-lg min-h-[60px]">
                    {selectedAppointment.note || 'Không có ghi chú'}
                  </div>
                </div>
                
                <div>
                  <Text type="secondary">Ngày đặt lịch:</Text>
                  <div className="font-medium">
                    {dayjs(selectedAppointment.createdAt).format('DD/MM/YYYY HH:mm')}
                  </div>
                </div>
              </div>
            )}
          </Modal>

          {/* Edit Modal */}
          <Modal
            title="Chỉnh sửa cuộc hẹn"
            open={editVisible}
            onCancel={() => setEditVisible(false)}
            footer={null}
            width={600}
          >
            <Form
              form={form}
              layout="vertical"
              onFinish={handleUpdateAppointment}
            >
              <Form.Item
                name="datetime"
                label="Ngày giờ hẹn"
                rules={[{ required: true, message: 'Vui lòng chọn ngày giờ!' }]}
              >
                <DatePicker
                  showTime={{ format: 'HH:mm' }}
                  format="DD/MM/YYYY HH:mm"
                  className="w-full"
                  disabledDate={(current) => current && current < dayjs().startOf('day')}
                />
              </Form.Item>

              <Form.Item
                name="consultationType"
                label="Hình thức tư vấn"
                rules={[{ required: true, message: 'Vui lòng chọn hình thức!' }]}
              >
                <Select>
                  <Option value="Video call">
                    <div className="flex items-center gap-2">
                      <VideoCameraOutlined className="text-blue-500" />
                      Video call
                    </div>
                  </Option>
                  <Option value="Điện thoại">
                    <div className="flex items-center gap-2">
                      <PhoneOutlined className="text-green-500" />
                      Điện thoại
                    </div>
                  </Option>
                  <Option value="Trực tiếp">
                    <div className="flex items-center gap-2">
                      <UserOutlined className="text-purple-500" />
                      Trực tiếp
                    </div>
                  </Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="note"
                label="Ghi chú"
              >
                <TextArea
                  rows={4}
                  placeholder="Ghi chú về cuộc hẹn"
                  showCount
                  maxLength={500}
                />
              </Form.Item>

              <div className="flex justify-end gap-3">
                <Button onClick={() => setEditVisible(false)}>
                  Hủy
                </Button>
                <Button type="primary" htmlType="submit">
                  Cập nhật
                </Button>
              </div>
            </Form>
          </Modal>
        </div>
      )}
    </div>
  );
}