import React, { useState } from 'react';
import { Card, Row, Col, Button, Form, Input, DatePicker, TimePicker, Select, Typography, Avatar, Tag, Rate, Space, Divider, Badge } from 'antd';
import { UserOutlined, CalendarOutlined, ClockCircleOutlined, PhoneOutlined, VideoCameraOutlined, StarFilled, CheckCircleOutlined } from '@ant-design/icons';

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
  const [form] = Form.useForm();

  const handleBooking = (values) => {
    console.log('Booking data:', { ...values, consultantId: selectedConsultant.id });
    // Handle booking logic here
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
              Kết nối với các chuyên gia hàng đầu để được tư vấn, hỗ trợ một cách chuyên nghiệp và bảo mật tuyệt đối
            </Paragraph>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Row gutter={[32, 32]}>
          {/* Consultant Selection */}
          <Col xs={24} lg={14}>
            <Card 
              className="shadow-lg border-0 rounded-2xl overflow-hidden"
              bodyStyle={{ padding: '24px' }}
            >
              <div className="flex items-center justify-between mb-6">
                <Title level={3} className="!mb-0 !text-gray-800">
                  Chọn chuyên gia tư vấn
                </Title>
                <Text type="secondary" className="text-sm">
                  {consultants.length} chuyên gia có sẵn
                </Text>
              </div>
              
              <div className="space-y-4">
                {consultants.map((consultant) => (
                  <Card
                    key={consultant.id}
                    hoverable
                    className={`!border-2 !rounded-xl transition-all duration-300 hover:shadow-md cursor-pointer ${
                      selectedConsultant?.id === consultant.id 
                        ? '!border-blue-400 !bg-blue-50 shadow-lg transform scale-[1.02]' 
                        : '!border-gray-200 hover:!border-blue-300'
                    }`}
                    bodyStyle={{ padding: '20px' }}
                    onClick={() => setSelectedConsultant(consultant)}
                  >
                    <div className="flex items-start space-x-4">
                      <div className="relative">
                        <Avatar size={72} src={consultant.avatar} className="shadow-md" />
                        <Badge 
                          status="processing" 
                          color={getStatusColor(consultant.status)}
                          className="absolute -bottom-1 -right-1"
                        />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div>
                            <Title level={4} className="!mb-1 !text-gray-800">
                              {consultant.name}
                            </Title>
                            <Text className="text-blue-600 font-medium block mb-1">
                              {consultant.specialty}
                            </Text>
                            <Text type="secondary" className="text-sm">
                              {consultant.experience}
                            </Text>
                          </div>
                          
                          {selectedConsultant?.id === consultant.id && (
                            <CheckCircleOutlined className="text-blue-500 text-xl" />
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-2 mt-3 mb-4">
                          <Rate 
                            disabled 
                            defaultValue={consultant.rating} 
                            allowHalf 
                            className="text-sm"
                          />
                          <Text className="text-yellow-600 font-medium">
                            {consultant.rating}
                          </Text>
                          <Text type="secondary" className="text-sm">
                            ({consultant.reviews} đánh giá)
                          </Text>
                        </div>

                        <div className="space-y-3">
                          <div>
                            <Text strong className="text-gray-700 text-sm block mb-2">
                              📅 Lịch làm việc:
                            </Text>
                            <div className="flex flex-wrap gap-1">
                              {consultant.available.map((day) => (
                                <Tag key={day} color="green" className="rounded-full px-3 py-1">
                                  {day}
                                </Tag>
                              ))}
                            </div>
                          </div>

                          <div>
                            <Text strong className="text-gray-700 text-sm block mb-2">
                              💬 Hình thức tư vấn:
                            </Text>
                            <div className="flex flex-wrap gap-1">
                              {consultant.consultationType.map((type) => (
                                <Tag 
                                  key={type} 
                                  color="blue" 
                                  className="rounded-full px-3 py-1 flex items-center gap-1"
                                >
                                  {getConsultationIcon(type)}
                                  {type}
                                </Tag>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>
          </Col>

          {/* Booking Form */}
          <Col xs={24} lg={10}>
            <Card 
              className="shadow-lg border-0 rounded-2xl overflow-hidden sticky top-4"
              bodyStyle={{ padding: '24px' }}
            >
              <Title level={3} className="!mb-6 !text-gray-800">
                Thông tin đặt lịch
              </Title>
              
              {selectedConsultant ? (
                <div>
                  {/* Selected Consultant Info */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl mb-6 border border-blue-100">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <Avatar size={48} src={selectedConsultant.avatar} />
                        <Badge 
                          status="processing" 
                          color={getStatusColor(selectedConsultant.status)}
                          className="absolute -bottom-1 -right-1"
                        />
                      </div>
                      <div>
                        <Text strong className="text-gray-800 block">
                          {selectedConsultant.name}
                        </Text>
                        <Text type="secondary" className="text-sm">
                          {selectedConsultant.specialty}
                        </Text>
                        <div className="flex items-center mt-1">
                          <StarFilled className="text-yellow-500 text-xs mr-1" />
                          <Text className="text-xs text-gray-600">
                            {selectedConsultant.rating} ({selectedConsultant.reviews} đánh giá)
                          </Text>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleBooking}
                    className="space-y-4"
                  >
                    <Form.Item
                      name="consultationType"
                      label={<Text strong>Hình thức tư vấn</Text>}
                      rules={[{ required: true, message: 'Vui lòng chọn hình thức tư vấn' }]}
                    >
                      <Select 
                        placeholder="Chọn hình thức tư vấn" 
                        size="large"
                        className="rounded-lg"
                      >
                        {selectedConsultant.consultationType.map((type) => (
                          <Option key={type} value={type}>
                            <div className="flex items-center gap-2">
                              {getConsultationIcon(type)}
                              <span>{type}</span>
                            </div>
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>

                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item
                          name="date"
                          label={<Text strong>Ngày tư vấn</Text>}
                          rules={[{ required: true, message: 'Vui lòng chọn ngày' }]}
                        >
                          <DatePicker 
                            className="w-full rounded-lg" 
                            placeholder="Chọn ngày"
                            format="DD/MM/YYYY"
                            size="large"
                          />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          name="time"
                          label={<Text strong>Giờ tư vấn</Text>}
                          rules={[{ required: true, message: 'Vui lòng chọn giờ' }]}
                        >
                          <TimePicker 
                            className="w-full rounded-lg" 
                            placeholder="Chọn giờ"
                            format="HH:mm"
                            size="large"
                          />
                        </Form.Item>
                      </Col>
                    </Row>

                    <Form.Item
                      name="topic"
                      label={<Text strong>Chủ đề tư vấn</Text>}
                      rules={[{ required: true, message: 'Vui lòng chọn chủ đề' }]}
                    >
                      <Select placeholder="Chọn chủ đề tư vấn" size="large" className="rounded-lg">
                        <Option value="prevention">Phòng ngừa ma túy</Option>
                        <Option value="quit">Cách cai nghiện</Option>
                        <Option value="family">Hỗ trợ gia đình</Option>
                        <Option value="psychology">Tâm lý học</Option>
                        <Option value="other">Khác</Option>
                      </Select>
                    </Form.Item>

                    <Form.Item
                      name="description"
                      label="Mô tả vấn đề (tùy chọn)"
                    >
                      <TextArea 
                        rows={4} 
                        placeholder="Mô tả chi tiết vấn đề bạn muốn tư vấn..."
                      />
                    </Form.Item>

                    <Form.Item
                      name="phone"
                      label="Số điện thoại liên hệ"
                      rules={[
                        { required: true, message: 'Vui lòng nhập số điện thoại' },
                        { pattern: /^[0-9]{10}$/, message: 'Số điện thoại không hợp lệ' }
                      ]}
                    >
                      <Input placeholder="Nhập số điện thoại" />
                    </Form.Item>

                    <Form.Item>
                      <Button type="primary" htmlType="submit" size="large" block>
                        Đặt lịch tư vấn
                      </Button>
                    </Form.Item>
                  </Form>
                </div>
              ) : (
                <div className="text-center py-12">
                  <CalendarOutlined className="text-4xl text-gray-400 mb-4" />
                  <Paragraph type="secondary">
                    Vui lòng chọn chuyên gia tư vấn để tiếp tục đặt lịch
                  </Paragraph>
                </div>
              )}
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
}