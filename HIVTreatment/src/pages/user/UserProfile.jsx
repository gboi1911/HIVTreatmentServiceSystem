import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Avatar, 
  Button, 
  Tabs, 
  Form, 
  Input, 
  Select, 
  DatePicker, 
  Upload, 
  message, 
  Row, 
  Col, 
  Statistic, 
  Timeline, 
  Tag, 
  Divider, 
  Space,
  Modal,
  Progress
} from 'antd';
import {
  UserOutlined,
  EditOutlined,
  SaveOutlined,
  CameraOutlined,
  CalendarOutlined,
  MedicineBoxOutlined,
  HeartOutlined,
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined,
  SafetyOutlined,
  ClockCircleOutlined,
  FileTextOutlined,
  SettingOutlined,
  BellOutlined,
  LockOutlined,
  EyeOutlined,
  DownloadOutlined
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import dayjs from 'dayjs';

const { TabPane } = Tabs;
const { Option } = Select;
const { TextArea } = Input;

export const UserProfile = () => {
  const [activeTab, setActiveTab] = useState('1');
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();
  const [userInfo, setUserInfo] = useState({
    fullName: 'Nguyễn Văn An',
    email: 'nguyenvanan@email.com',
    phone: '0123456789',
    dateOfBirth: '1990-05-15',
    gender: 'Nam',
    address: '123 Đường ABC, Quận 1, TP.HCM',
    emergencyContact: '0987654321',
    bloodType: 'O+',
    allergies: 'Không có',
    avatar: null,
    memberSince: '2023-01-15'
  });

  const [healthStats] = useState({
    totalAppointments: 12,
    completedTests: 8,
    upcomingAppointments: 2,
    healthScore: 85
  });

  const [appointments] = useState([
    {
      id: 1,
      date: '2024-01-20',
      time: '09:00',
      doctor: 'BS. Nguyễn Thị Lan',
      type: 'Tư vấn định kỳ',
      status: 'Hoàn thành',
      notes: 'Kết quả tốt, tiếp tục theo dõi'
    },
    {
      id: 2,
      date: '2024-01-15',
      time: '14:30',
      doctor: 'BS. Trần Văn Minh',
      type: 'Xét nghiệm máu',
      status: 'Hoàn thành',
      notes: 'Các chỉ số bình thường'
    },
    {
      id: 3,
      date: '2024-02-05',
      time: '10:00',
      doctor: 'BS. Nguyễn Thị Lan',
      type: 'Tái khám',
      status: 'Sắp tới',
      notes: 'Kiểm tra tiến triển điều trị'
    }
  ]);

  const [testResults] = useState([
    {
      id: 1,
      testName: 'Xét nghiệm HIV',
      date: '2024-01-15',
      result: 'Âm tính',
      status: 'Bình thường',
      doctor: 'BS. Trần Văn Minh'
    },
    {
      id: 2,
      testName: 'Xét nghiệm máu tổng quát',
      date: '2024-01-10',
      result: 'Bình thường',
      status: 'Tốt',
      doctor: 'BS. Nguyễn Thị Lan'
    }
  ]);

  useEffect(() => {
    // Load user data from localStorage or API
    const savedUserInfo = localStorage.getItem('userInfo');
    if (savedUserInfo) {
      try {
        const parsed = JSON.parse(savedUserInfo);
        setUserInfo(prev => ({ ...prev, ...parsed }));
      } catch (error) {
        console.error('Error parsing user info:', error);
      }
    }
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
    form.setFieldsValue({
      ...userInfo,
      dateOfBirth: userInfo.dateOfBirth ? dayjs(userInfo.dateOfBirth) : null
    });
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const updatedInfo = {
        ...userInfo,
        ...values,
        dateOfBirth: values.dateOfBirth ? values.dateOfBirth.format('YYYY-MM-DD') : userInfo.dateOfBirth
      };
      setUserInfo(updatedInfo);
      localStorage.setItem('userInfo', JSON.stringify(updatedInfo));
      setIsEditing(false);
      message.success('Cập nhật thông tin thành công!');
    } catch (error) {
      message.error('Vui lòng kiểm tra lại thông tin!');
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    form.resetFields();
  };

  const handleAvatarUpload = (info) => {
    if (info.file.status === 'done') {
      message.success('Cập nhật ảnh đại diện thành công!');
      // Handle avatar upload logic here
    } else if (info.file.status === 'error') {
      message.error('Tải ảnh thất bại!');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Hoàn thành': return 'green';
      case 'Sắp tới': return 'blue';
      case 'Đã hủy': return 'red';
      default: return 'default';
    }
  };

  const getTestStatusColor = (status) => {
    switch (status) {
      case 'Bình thường': return 'green';
      case 'Tốt': return 'blue';
      case 'Cần theo dõi': return 'orange';
      case 'Bất thường': return 'red';
      default: return 'default';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <Card className="bg-gradient-to-r from-blue-600 to-indigo-700 border-0 shadow-2xl">
            <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
              <div className="relative">
                <Avatar
                  size={120}
                  src={userInfo.avatar}
                  icon={<UserOutlined />}
                  className="border-4 border-white shadow-lg"
                />
                <Upload
                  showUploadList={false}
                  onChange={handleAvatarUpload}
                  accept="image/*"
                >
                  <Button
                    type="primary"
                    shape="circle"
                    icon={<CameraOutlined />}
                    className="absolute -bottom-2 -right-2 bg-white text-blue-600 border-2 border-blue-600 hover:bg-blue-50"
                    size="small"
                  />
                </Upload>
              </div>
              
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl font-bold text-black mb-2">{userInfo.fullName}</h1>
                <p className="text-blue-500 text-lg mb-4">Tạo tài khoản từ {dayjs(userInfo.memberSince).format('DD/MM/YYYY')}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                    <div className="flex items-center space-x-2">
                      <MailOutlined className="text-black" />
                      <span className="text-black text-sm">{userInfo.email}</span>
                    </div>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                    <div className="flex items-center space-x-2">
                      <PhoneOutlined className="text-black" />
                      <span className="text-black text-sm">{userInfo.phone}</span>
                    </div>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                    <div className="flex items-center space-x-2">
                      <EnvironmentOutlined className="text-black" />
                      <span className="text-black text-sm">TP.HCM</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Health Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} lg={6}>
              <Card className="text-center hover:shadow-lg transition-all duration-300">
                <Statistic
                  title="Tổng số lần khám"
                  value={healthStats.totalAppointments}
                  prefix={<CalendarOutlined className="text-blue-600" />}
                  valueStyle={{ color: '#1890ff' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card className="text-center hover:shadow-lg transition-all duration-300">
                <Statistic
                  title="Xét nghiệm hoàn thành"
                  value={healthStats.completedTests}
                  prefix={<MedicineBoxOutlined className="text-green-600" />}
                  valueStyle={{ color: '#52c41a' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card className="text-center hover:shadow-lg transition-all duration-300">
                <Statistic
                  title="Lịch hẹn sắp tới"
                  value={healthStats.upcomingAppointments}
                  prefix={<ClockCircleOutlined className="text-orange-600" />}
                  valueStyle={{ color: '#fa8c16' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card className="text-center hover:shadow-lg transition-all duration-300">
                <div className="mb-2">
                  <HeartOutlined className="text-red-600 text-2xl" />
                </div>
                <div className="text-gray-600 text-sm mb-2">Chỉ số sức khỏe</div>
                <Progress
                  type="circle"
                  percent={healthStats.healthScore}
                  size={60}
                  strokeColor={{
                    '0%': '#108ee9',
                    '100%': '#87d068',
                  }}
                />
              </Card>
            </Col>
          </Row>
        </motion.div>

        {/* Main Content Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card className="shadow-xl">
            <Tabs
              activeKey={activeTab}
              onChange={setActiveTab}
              size="large"
              className="profile-tabs"
            >
              {/* Personal Information Tab */}
              <TabPane
                tab={
                  <span>
                    <UserOutlined />
                    Thông tin cá nhân
                  </span>
                }
                key="1"
              >
                <div className="flex justify-center">
                  <div className="w-full max-w-4xl">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xl font-semibold text-gray-800">Thông tin cá nhân</h3>
                      {!isEditing ? (
                        <Button
                          type="primary"
                          icon={<EditOutlined />}
                          onClick={handleEdit}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          Chỉnh sửa
                        </Button>
                      ) : (
                        <Space>
                          <Button onClick={handleCancel}>Hủy</Button>
                          <Button
                            type="primary"
                            icon={<SaveOutlined />}
                            onClick={handleSave}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            Lưu
                          </Button>
                        </Space>
                      )}
                    </div>

                    {!isEditing ? (
                      <Row gutter={[24, 24]}>
                        <Col xs={24} md={12}>
                          <div className="space-y-4">
                            <div className="border-b border-gray-200 pb-3">
                              <label className="text-sm font-medium text-gray-600">Họ và tên</label>
                              <p className="text-lg text-gray-900">{userInfo.fullName}</p>
                            </div>
                            <div className="border-b border-gray-200 pb-3">
                              <label className="text-sm font-medium text-gray-600">Email</label>
                              <p className="text-lg text-gray-900">{userInfo.email}</p>
                            </div>
                            <div className="border-b border-gray-200 pb-3">
                              <label className="text-sm font-medium text-gray-600">Số điện thoại</label>
                              <p className="text-lg text-gray-900">{userInfo.phone}</p>
                            </div>
                            <div className="border-b border-gray-200 pb-3">
                              <label className="text-sm font-medium text-gray-600">Ngày sinh</label>
                              <p className="text-lg text-gray-900">
                                {userInfo.dateOfBirth ? dayjs(userInfo.dateOfBirth).format('DD/MM/YYYY') : 'Chưa cập nhật'}
                              </p>
                            </div>
                          </div>
                        </Col>
                        <Col xs={24} md={12}>
                          <div className="space-y-4">
                            <div className="border-b border-gray-200 pb-3">
                              <label className="text-sm font-medium text-gray-600">Giới tính</label>
                              <p className="text-lg text-gray-900">{userInfo.gender}</p>
                            </div>
                            <div className="border-b border-gray-200 pb-3">
                              <label className="text-sm font-medium text-gray-600">Địa chỉ</label>
                              <p className="text-lg text-gray-900">{userInfo.address}</p>
                            </div>
                            <div className="border-b border-gray-200 pb-3">
                              <label className="text-sm font-medium text-gray-600">Liên hệ khẩn cấp</label>
                              <p className="text-lg text-gray-900">{userInfo.emergencyContact}</p>
                            </div>
                            <div className="border-b border-gray-200 pb-3">
                              <label className="text-sm font-medium text-gray-600">Nhóm máu</label>
                              <p className="text-lg text-gray-900">{userInfo.bloodType}</p>
                            </div>
                          </div>
                        </Col>
                      </Row>
                    ) : (
                      <Form form={form} layout="vertical">
                        <Row gutter={[24, 24]}>
                          <Col xs={24} md={12}>
                            <Form.Item
                              name="fullName"
                              label="Họ và tên"
                              rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
                            >
                              <Input size="large" />
                            </Form.Item>
                            <Form.Item
                              name="email"
                              label="Email"
                              rules={[
                                { required: true, message: 'Vui lòng nhập email!' },
                                { type: 'email', message: 'Email không hợp lệ!' }
                              ]}
                            >
                              <Input size="large" />
                            </Form.Item>
                            <Form.Item
                              name="phone"
                              label="Số điện thoại"
                              rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
                            >
                              <Input size="large" />
                            </Form.Item>
                            <Form.Item name="dateOfBirth" label="Ngày sinh">
                              <DatePicker size="large" className="w-full" format="DD/MM/YYYY" />
                            </Form.Item>
                          </Col>
                          <Col xs={24} md={12}>
                            <Form.Item name="gender" label="Giới tính">
                              <Select size="large">
                                <Option value="Nam">Nam</Option>
                                <Option value="Nữ">Nữ</Option>
                                <Option value="Khác">Khác</Option>
                              </Select>
                            </Form.Item>
                            <Form.Item name="address" label="Địa chỉ">
                              <TextArea rows={3} />
                            </Form.Item>
                            <Form.Item name="emergencyContact" label="Liên hệ khẩn cấp">
                              <Input size="large" />
                            </Form.Item>
                            <Form.Item name="bloodType" label="Nhóm máu">
                              <Select size="large">
                                <Option value="A+">A+</Option>
                                <Option value="A-">A-</Option>
                                <Option value="B+">B+</Option>
                                <Option value="B-">B-</Option>
                                <Option value="AB+">AB+</Option>
                                <Option value="AB-">AB-</Option>
                                <Option value="O+">O+</Option>
                                <Option value="O-">O-</Option>
                              </Select>
                            </Form.Item>
                          </Col>
                        </Row>
                      </Form>
                    )}
                  </div>
                </div>
              </TabPane>

              {/* Medical History Tab */}
              <TabPane
                tab={
                  <span>
                    <MedicineBoxOutlined />
                    Lịch sử khám bệnh
                  </span>
                }
                key="2"
              >
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-semibold text-gray-800">Lịch sử khám bệnh</h3>
                    <Button type="primary" icon={<CalendarOutlined />} className="bg-blue-600 hover:bg-blue-700">
                      Đặt lịch khám mới
                    </Button>
                  </div>

                  <Timeline>
                    {appointments.map((appointment) => (
                      <Timeline.Item
                        key={appointment.id}
                        color={appointment.status === 'Hoàn thành' ? 'green' : 'blue'}
                        dot={
                          appointment.status === 'Hoàn thành' ? 
                            <ClockCircleOutlined style={{ fontSize: '16px' }} /> : 
                            <CalendarOutlined style={{ fontSize: '16px' }} />
                        }
                      >
                        <Card className="ml-4 hover:shadow-md transition-all duration-300">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h4 className="font-semibold text-lg text-gray-800">{appointment.type}</h4>
                              <p className="text-gray-600">Bác sĩ: {appointment.doctor}</p>
                            </div>
                            <Tag color={getStatusColor(appointment.status)}>{appointment.status}</Tag>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                            <div>
                              <CalendarOutlined className="mr-2" />
                              {dayjs(appointment.date).format('DD/MM/YYYY')} - {appointment.time}
                            </div>
                            <div>
                              <FileTextOutlined className="mr-2" />
                              {appointment.notes}
                            </div>
                          </div>
                        </Card>
                      </Timeline.Item>
                    ))}
                  </Timeline>
                </div>
              </TabPane>

              {/* Test Results Tab */}
              <TabPane
                tab={
                  <span>
                    <FileTextOutlined />
                    Kết quả xét nghiệm
                  </span>
                }
                key="3"
              >
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-semibold text-gray-800">Kết quả xét nghiệm</h3>
                    <Button type="primary" icon={<DownloadOutlined />} className="bg-blue-600 hover:bg-blue-700">
                      Tải tất cả kết quả
                    </Button>
                  </div>

                  <Row gutter={[16, 16]}>
                    {testResults.map((test) => (
                      <Col xs={24} lg={12} key={test.id}>
                        <Card 
                          className="hover:shadow-lg transition-all duration-300"
                          actions={[
                            <Button type="link" icon={<EyeOutlined />}>Xem chi tiết</Button>,
                            <Button type="link" icon={<DownloadOutlined />}>Tải xuống</Button>
                          ]}
                        >
                          <div className="space-y-3">
                            <div className="flex justify-between items-start">
                              <h4 className="font-semibold text-lg text-gray-800">{test.testName}</h4>
                              <Tag color={getTestStatusColor(test.status)}>{test.status}</Tag>
                            </div>
                            <div className="text-gray-600">
                              <p><CalendarOutlined className="mr-2" />{dayjs(test.date).format('DD/MM/YYYY')}</p>
                              <p><UserOutlined className="mr-2" />{test.doctor}</p>
                              <p className="font-medium text-gray-800 mt-2">Kết quả: {test.result}</p>
                            </div>
                          </div>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                </div>
              </TabPane>

              {/* Settings Tab */}
              <TabPane
                tab={
                  <span>
                    <SettingOutlined />
                    Cài đặt
                  </span>
                }
                key="4"
              >
                <div className="flex justify-center">
                  <div className="w-full max-w-2xl space-y-6">
                    <h3 className="text-xl font-semibold text-gray-800">Cài đặt tài khoản</h3>
                    
                    <Card title="Thông báo" className="mb-4">
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-medium">Thông báo email</h4>
                            <p className="text-gray-600 text-sm">Nhận thông báo về lịch hẹn và kết quả xét nghiệm</p>
                          </div>
                          <Button type="primary" size="small">Bật</Button>
                        </div>
                        <Divider />
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-medium">Thông báo SMS</h4>
                            <p className="text-gray-600 text-sm">Nhận tin nhắn nhắc nhở về lịch hẹn</p>
                          </div>
                          <Button size="small">Tắt</Button>
                        </div>
                      </div>
                    </Card>

                    <Card title="Bảo mật" className="mb-4">
                      <div className="space-y-4">
                        <Button 
                          type="primary" 
                          icon={<LockOutlined />} 
                          className="bg-blue-600 hover:bg-blue-700 w-full"
                        >
                          Đổi mật khẩu
                        </Button>
                        <Button 
                          icon={<SafetyOutlined />} 
                          className="w-full"
                        >
                          Xác thực hai yếu tố
                        </Button>
                      </div>
                    </Card>

                    <Card title="Quyền riêng tư" className="mb-4">
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-medium">Chia sẻ dữ liệu y tế</h4>
                            <p className="text-gray-600 text-sm">Cho phép chia sẻ dữ liệu với các bác sĩ</p>
                          </div>
                          <Button type="primary" size="small">Bật</Button>
                        </div>
                        <Divider />
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-medium">Hiển thị hồ sơ công khai</h4>
                            <p className="text-gray-600 text-sm">Cho phép bác sĩ tìm kiếm hồ sơ của bạn</p>
                          </div>
                          <Button size="small">Tắt</Button>
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>
              </TabPane>
            </Tabs>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default UserProfile;