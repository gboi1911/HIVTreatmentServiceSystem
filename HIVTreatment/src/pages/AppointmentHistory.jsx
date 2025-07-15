import React, { useState, useEffect } from 'react';
import { Card, Table, Tag, Button, Typography, Space, Divider, message, Spin, Modal, Form, Input, DatePicker, TimePicker, Select } from 'antd';
import { CalendarOutlined, EyeOutlined, EditOutlined, DeleteOutlined, ClockCircleOutlined, UserOutlined, PhoneOutlined, VideoCameraOutlined } from '@ant-design/icons';
import { getAppointmentsByCustomer, updateAppointment, cancelAppointment } from '../api/appointment';
import dayjs from 'dayjs';
import { useAuthStatus } from '../hooks/useAuthStatus';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

export default function AppointmentHistory() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [detailVisible, setDetailVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [form] = Form.useForm();
  
  // ✅ Use the auth hook to get current user info
  const { userInfo, isLoggedIn } = useAuthStatus();

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

  const mapStatus = (status) => {
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
  }
  useEffect(() => {
    loadAppointments();
  }, [userInfo]); // Add userInfo as dependency

  const loadAppointments = async () => {
    try {
      setLoading(true);
 
      let customerId;
      
      if (userInfo?.id) {
        customerId = userInfo.id;
      } else {
        // Fallback: try to get from localStorage
        try {
          const savedUserInfo = localStorage.getItem('userInfo');
          if (savedUserInfo) {
            const parsedUserInfo = JSON.parse(savedUserInfo);
            customerId = parsedUserInfo.id || parsedUserInfo.customerId;
          }
        } catch (error) {
          console.error('Failed to parse userInfo from localStorage:', error);
        }
      }
      
      // If still no customerId, show error
      if (!customerId) {
        console.error('No customer ID found');
        message.error('Không thể xác định người dùng. Vui lòng đăng nhập lại.');
        return;
      }
      
      console.log('🔍 Loading appointments for customer ID:', customerId);
      const response = await getAppointmentsByCustomer(customerId);
      setAppointments(response.data || []);
    } catch (error) {
      console.error('Failed to load appointments:', error);
      // Fallback to demo data
      setAppointments([
        {
          id: 1,
          doctorName: "TS. Nguyễn Văn A",
          consultationType: "Video call",
          datetime: "2024-07-02 09:00",
          status: "Đã xác nhận",
          note: "Tư vấn về kết quả xét nghiệm",
          createdAt: "2024-06-28 14:30"
        },
        {
          id: 2,
          doctorName: "ThS. Trần Thị B",
          consultationType: "Điện thoại",
          datetime: "2024-07-05 14:30",
          status: "Chờ xác nhận",
          note: "Tư vấn tâm lý sau chẩn đoán",
          createdAt: "2024-06-29 10:15"
        },
        {
          id: 3,
          doctorName: "TS. Nguyễn Văn A",
          consultationType: "Trực tiếp",
          datetime: "2024-06-25 10:00",
          status: "Đã hoàn thành",
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

  const canEdit = (appointment) => {
    const appointmentTime = dayjs(appointment.datetime);
    const now = dayjs();
    return appointmentTime.isAfter(now) && ['PENDING', 'CONFIRMED', 'SCHEDULED'].includes(appointment.status);
  };

  const canCancel = (appointment) => {
    const appointmentTime = dayjs(appointment.datetime);
    const now = dayjs();
    return appointmentTime.isAfter(now.add(24, 'hour')) && ['PENDING', 'CONFIRMED', 'SCHEDULED'].includes(appointment.status);
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
      loadAppointments();
    } catch (error) {
      message.error('Cập nhật lịch hẹn thất bại!');
    }
  };

  const handleCancel = async (appointmentId) => {
    Modal.confirm({
      title: 'Xác nhận hủy lịch hẹn',
      content: 'Bạn có chắc chắn muốn hủy lịch hẹn này? Hành động này không thể hoàn tác.',
      okText: 'Hủy lịch hẹn',
      okType: 'danger',
      cancelText: 'Không',
      onOk: async () => {
        try {
          await cancelAppointment(appointmentId);
          message.success('Hủy lịch hẹn thành công!');
          loadAppointments();
        } catch (error) {
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
        <div>
          <div>{dayjs(datetime).format('DD/MM/YYYY')}</div>
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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Title level={1} className="flex items-center gap-3 !mb-2">
            <CalendarOutlined className="text-blue-600" />
            Lịch sử cuộc hẹn
          </Title>
          <Text type="secondary" className="text-lg">
            Quản lý và theo dõi các cuộc hẹn tư vấn của bạn
          </Text>
        </div>

        <Card className="shadow-sm">
          <Table
            columns={columns}
            dataSource={appointments}
            rowKey="id"
            loading={loading}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} của ${total} cuộc hẹn`
            }}
            locale={{
              emptyText: 'Chưa có cuộc hẹn nào'
            }}
          />
        </Card>

        {/* Detail Modal */}
        <Modal
          title="Chi tiết cuộc hẹn"
          open={detailVisible}
          onCancel={() => setDetailVisible(false)}
          footer={null} // Remove the custom footer to avoid duplicate close buttons
          width={600}
          centered // Center the modal for better UX
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
    </div>
  );
}
