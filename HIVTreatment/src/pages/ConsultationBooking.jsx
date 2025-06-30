import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Button, Form, Input, DatePicker, TimePicker, Select, Typography, Avatar, Tag, Rate, Space, Divider, Badge, message, Spin } from 'antd';
import { UserOutlined, CalendarOutlined, ClockCircleOutlined, PhoneOutlined, VideoCameraOutlined, StarFilled, CheckCircleOutlined, LoadingOutlined, TeamOutlined, MailOutlined } from '@ant-design/icons';
import { bookAppointment } from '../api/appointment';
import { getAllDoctors } from '../api/doctor';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const consultants = [
  {
    id: 1,
    name: "TS. Nguyễn Văn A",
    specialty: "Tâm lý học lâm sàng",
    experience: "15 năm kinh nghiệm",
    rating: 4.8,
    reviews: 120,
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
    available: ["Thứ 2", "Thứ 4", "Thứ 6"],
    consultationType: ["Video call", "Điện thoại", "Trực tiếp"],
    status: "online"
  },
  {
    id: 2,
    name: "ThS. Trần Thị B",
    specialty: "Công tác xã hội",
    experience: "10 năm kinh nghiệm",
    rating: 4.9,
    reviews: 85,
    avatar: "https://randomuser.me/api/portraits/women/2.jpg",
    available: ["Thứ 3", "Thứ 5", "Thứ 7"],
    consultationType: ["Video call", "Điện thoại"],
    status: "busy"
  }
];

export default function ConsultationBooking() {
  const [selectedConsultant, setSelectedConsultant] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  // Load doctors from API
  useEffect(() => {
    loadDoctors();
  }, []);

  const loadDoctors = async () => {
    try {
      setLoading(true);
      const response = await getAllDoctors();
      // Transform API data to match UI structure
      const doctorsData = response.data?.map(doctor => ({
        id: doctor.id,
        name: doctor.name || doctor.fullName,
        specialty: doctor.specialty || "Chuyên khoa HIV/AIDS",
        experience: doctor.experience || "5+ năm kinh nghiệm",
        rating: doctor.rating || 4.5,
        reviews: doctor.reviews || Math.floor(Math.random() * 100) + 20,
        avatar: doctor.avatar || `https://randomuser.me/api/portraits/${doctor.gender === 'female' ? 'women' : 'men'}/${doctor.id || 1}.jpg`,
        available: doctor.availableDays || ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6"],
        consultationType: doctor.consultationTypes || ["Video call", "Điện thoại", "Trực tiếp"],
        status: doctor.status || "online",
        department: doctor.department,
        phone: doctor.phone,
        email: doctor.email
      })) || consultants; // Fallback to static data
      
      setDoctors(doctorsData);
    } catch (error) {
      console.error('Failed to load doctors:', error);
      // Use fallback static data
      setDoctors(consultants);
      message.warning('Không thể tải danh sách bác sĩ từ server, sử dụng dữ liệu mẫu');
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async (values) => {
    if (!selectedConsultant) {
      message.error('Vui lòng chọn bác sĩ tư vấn');
      return;
    }

    try {
      setBookingLoading(true);
      
      // Combine date and time
      const appointmentDateTime = dayjs(values.date)
        .hour(values.time.hour())
        .minute(values.time.minute())
        .format('YYYY-MM-DD HH:mm:ss');

      const bookingData = {
        doctorId: selectedConsultant.id,
        type: values.consultationType,
        note: values.reason || '',
        datetime: appointmentDateTime,
        // Add customer info if needed
        customerInfo: {
          name: values.name,
          phone: values.phone,
          email: values.email
        }
      };

      const response = await bookAppointment(bookingData);
      
      // Navigate to success page with booking data
      navigate('/booking-success', {
        state: {
          bookingData: {
            doctorName: selectedConsultant.name,
            datetime: dayjs(values.date).format('DD/MM/YYYY') + ' ' + values.time.format('HH:mm'),
            consultationType: values.consultationType,
            customerName: values.name,
            phone: values.phone,
            email: values.email,
            note: values.reason
          }
        }
      });
      
    } catch (error) {
      console.error('Booking error:', error);
      message.error('Đặt lịch thất bại. Vui lòng thử lại sau.');
    } finally {
      setBookingLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return '#52c41a';
      case 'busy': return '#faad14';
      default: return '#d9d9d9';
    }
  };

  const getConsultationIcon = (type) => {
    switch (type) {
      case 'Video call': return <VideoCameraOutlined className="text-blue-500" />;
      case 'Điện thoại': return <PhoneOutlined className="text-green-500" />;
      case 'Trực tiếp': return <UserOutlined className="text-purple-500" />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <Title level={1} className="!text-3xl !font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent !mb-4">
              Đặt lịch tư vấn chuyên nghiệp
            </Title>
            <Paragraph className="text-lg text-gray-600 max-w-2xl mx-auto">
              Kết nối với các chuyên gia tâm lý và công tác xã hội có kinh nghiệm về HIV/AIDS. 
              Tất cả thông tin được bảo mật tuyệt đối.
            </Paragraph>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Row gutter={[24, 24]}>
          {/* Consultants List */}
          <Col xs={24} lg={14}>
            <div className="mb-8">
              <Title level={2} className="flex items-center gap-2 !mb-6">
                <TeamOutlined className="text-blue-600" />
                Chọn chuyên gia tư vấn
                {loading && <Spin indicator={<LoadingOutlined style={{ fontSize: 16 }} spin />} />}
              </Title>
              
              {loading ? (
                <div className="text-center py-12">
                  <Spin size="large" />
                  <p className="mt-4 text-gray-500">Đang tải danh sách bác sĩ...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {doctors.map((consultant) => (
                    <Card
                      key={consultant.id}
                      className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                        selectedConsultant?.id === consultant.id 
                          ? 'ring-2 ring-blue-500 shadow-lg' 
                          : 'hover:shadow-md'
                      }`}
                      onClick={() => setSelectedConsultant(consultant)}
                    >
                      <div className="flex items-start gap-4">
                        <div className="relative">
                          <Avatar 
                            size={80} 
                            src={consultant.avatar} 
                            icon={<UserOutlined />}
                            className="border-2 border-white shadow-md"
                          />
                          <Badge 
                            color={getStatusColor(consultant.status)} 
                            className="absolute -bottom-1 -right-1"
                          />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <Title level={4} className="!mb-1 flex items-center gap-2">
                                {consultant.name}
                                {selectedConsultant?.id === consultant.id && (
                                  <CheckCircleOutlined className="text-blue-500" />
                                )}
                              </Title>
                              <Text type="secondary" className="text-sm">
                                {consultant.specialty}
                              </Text>
                              <div className="flex items-center gap-1 mt-1">
                                <Rate disabled defaultValue={consultant.rating} size="small" />
                                <Text type="secondary" className="text-xs">
                                  {consultant.rating} ({consultant.reviews} đánh giá)
                                </Text>
                              </div>
                            </div>
                            
                            <Tag color={consultant.status === 'online' ? 'green' : 'orange'}>
                              {consultant.status === 'online' ? 'Sẵn sàng' : 'Bận'}
                            </Tag>
                          </div>
                          
                          <div className="mt-3">
                            <Text className="text-sm text-gray-600 block mb-2">
                              <StarFilled className="text-yellow-500 mr-1" />
                              {consultant.experience}
                            </Text>
                            
                            <div className="flex flex-wrap gap-1 mb-2">
                              <Text className="text-xs text-gray-500">Có mặt:</Text>
                              {consultant.available.map((day, index) => (
                                <Tag key={index} size="small" color="blue">{day}</Tag>
                              ))}
                            </div>
                            
                            <div className="flex flex-wrap gap-2">
                              {consultant.consultationType.map((type, index) => (
                                <div key={index} className="flex items-center gap-1 text-xs">
                                  {getConsultationIcon(type)}
                                  <Text className="text-xs">{type}</Text>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </Col>

          {/* Booking Form */}
          <Col xs={24} lg={10}>
            <Card className="sticky top-6 shadow-lg">
              <Title level={3} className="!mb-6">
                <CalendarOutlined className="text-blue-600 mr-2" />
                Thông tin đặt lịch
              </Title>
              
              {!selectedConsultant ? (
                <div className="text-center py-12 text-gray-500">
                  <UserOutlined className="text-4xl mb-4 text-gray-300" />
                  <p>Vui lòng chọn chuyên gia tư vấn để tiếp tục</p>
                </div>
              ) : (
                <>
                  {/* Selected Consultant Info */}
                  <div className="bg-blue-50 rounded-lg p-4 mb-6">
                    <div className="flex items-center gap-3">
                      <Avatar src={selectedConsultant.avatar} size={48} />
                      <div>
                        <Text strong className="block">{selectedConsultant.name}</Text>
                        <Text type="secondary" className="text-sm">{selectedConsultant.specialty}</Text>
                      </div>
                    </div>
                  </div>

                  <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleBooking}
                    className="space-y-4"
                  >
                    {/* Personal Information */}
                    <div className="mb-6">
                      <Title level={5} className="!mb-4 text-gray-700">Thông tin cá nhân</Title>
                      
                      <Form.Item
                        name="name"
                        label="Họ và tên"
                        rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
                      >
                        <Input 
                          placeholder="Nhập họ và tên của bạn"
                          prefix={<UserOutlined className="text-gray-400" />}
                        />
                      </Form.Item>

                      <Form.Item
                        name="phone"
                        label="Số điện thoại"
                        rules={[
                          { required: true, message: 'Vui lòng nhập số điện thoại!' },
                          { pattern: /^[0-9]{10,11}$/, message: 'Số điện thoại không hợp lệ!' }
                        ]}
                      >
                        <Input 
                          placeholder="Nhập số điện thoại"
                          prefix={<PhoneOutlined className="text-gray-400" />}
                        />
                      </Form.Item>

                      <Form.Item
                        name="email"
                        label="Email (tùy chọn)"
                        rules={[{ type: 'email', message: 'Email không hợp lệ!' }]}
                      >
                        <Input 
                          placeholder="Nhập email của bạn"
                          prefix={<MailOutlined className="text-gray-400" />}
                        />
                      </Form.Item>
                    </div>

                    {/* Appointment Details */}
                    <div className="mb-6">
                      <Title level={5} className="!mb-4 text-gray-700">Thông tin cuộc hẹn</Title>
                      
                      <Form.Item
                        name="date"
                        label="Ngày hẹn"
                        rules={[{ required: true, message: 'Vui lòng chọn ngày!' }]}
                      >
                        <DatePicker
                          className="w-full"
                          placeholder="Chọn ngày"
                          disabledDate={(current) => current && current < dayjs().startOf('day')}
                          format="DD/MM/YYYY"
                        />
                      </Form.Item>

                      <Form.Item
                        name="time"
                        label="Giờ hẹn"
                        rules={[{ required: true, message: 'Vui lòng chọn giờ!' }]}
                      >
                        <TimePicker
                          className="w-full"
                          placeholder="Chọn giờ"
                          format="HH:mm"
                          minuteStep={15}
                          disabledHours={() => {
                            const hours = [];
                            for (let i = 0; i < 8; i++) hours.push(i); // Before 8 AM
                            for (let i = 18; i < 24; i++) hours.push(i); // After 6 PM
                            return hours;
                          }}
                        />
                      </Form.Item>

                      <Form.Item
                        name="consultationType"
                        label="Hình thức tư vấn"
                        rules={[{ required: true, message: 'Vui lòng chọn hình thức tư vấn!' }]}
                      >
                        <Select placeholder="Chọn hình thức tư vấn">
                          {selectedConsultant.consultationType.map((type) => (
                            <Option key={type} value={type}>
                              <div className="flex items-center gap-2">
                                {getConsultationIcon(type)}
                                {type}
                              </div>
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>

                      <Form.Item
                        name="reason"
                        label="Lý do tư vấn / Ghi chú"
                      >
                        <TextArea
                          rows={4}
                          placeholder="Mô tả ngắn gọn lý do bạn muốn tư vấn (tùy chọn)"
                          showCount
                          maxLength={500}
                        />
                      </Form.Item>
                    </div>

                    <Divider />

                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                      <Text className="text-sm text-yellow-800">
                        <strong>Lưu ý:</strong> Tất cả thông tin của bạn được bảo mật tuyệt đối. 
                        Chúng tôi sẽ liên hệ xác nhận lịch hẹn trong vòng 24h.
                      </Text>
                    </div>

                    <Button
                      type="primary"
                      htmlType="submit"
                      size="large"
                      loading={bookingLoading}
                      className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-blue-500 to-purple-500 border-none"
                    >
                      {bookingLoading ? 'Đang xử lý...' : 'Đặt lịch tư vấn'}
                    </Button>
                  </Form>
                </>
              )}
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
}