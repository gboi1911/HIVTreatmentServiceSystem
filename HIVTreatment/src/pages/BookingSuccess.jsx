import React, { useEffect } from 'react';
import { Result, Button, Card, Typography, Timeline, Space } from 'antd';
import { CheckCircleOutlined, CalendarOutlined, PhoneOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import dayjs from 'dayjs';

const { Title, Text, Paragraph } = Typography;

export default function BookingSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const bookingData = location.state?.bookingData;

  useEffect(() => {
    // If no booking data, redirect to booking page
    if (!bookingData) {
      navigate('/consultation-booking');
    }
  }, [bookingData, navigate]);

  if (!bookingData) {
    return null;
  }

  // 🔍 Add debugging to see what data we have
  console.log('📋 BookingSuccess - Received booking data:', bookingData);

  const nextSteps = [
    {
      title: 'Xác nhận đặt lịch',
      description: 'Chúng tôi sẽ liên hệ với bạn trong vòng 2-4 giờ để xác nhận lịch hẹn',
      icon: <CheckCircleOutlined className="text-green-500" />
    },
    {
      title: 'Chuẩn bị cuộc hẹn',
      description: 'Chuẩn bị các câu hỏi và thông tin cần thiết cho buổi tư vấn',
      icon: <CalendarOutlined className="text-blue-500" />
    },
    {
      title: 'Tham gia tư vấn',
      description: 'Tham gia cuộc hẹn đúng giờ theo hình thức đã chọn',
      icon: <ClockCircleOutlined className="text-purple-500" />
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Result
          status="success"
          title="Đặt lịch tư vấn thành công!"
          subTitle="Cảm ơn bạn đã tin tưởng dịch vụ của chúng tôi. Thông tin chi tiết về cuộc hẹn đã được ghi nhận."
          className="mb-8"
        />

        <div className="grid md:grid-cols-2 gap-8">
          {/* Booking Details */}
          <Card title="Thông tin cuộc hẹn" className="shadow-lg">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Text type="secondary">Bác sĩ tư vấn:</Text>
                <Text strong>
                  {bookingData.consultant?.name || 'Chưa xác định'}
                </Text>
              </div>
              
              <div className="flex justify-between items-center">
                <Text type="secondary">Ngày giờ:</Text>
                <Text strong>
                  {bookingData.datetime ? 
                    (() => {
                      console.log('📅 BookingSuccess - Raw datetime:', bookingData.datetime);
                      console.log('📅 BookingSuccess - Parsed datetime:', dayjs(bookingData.datetime).format('YYYY-MM-DD HH:mm:ss'));
                      console.log('📅 BookingSuccess - Display format:', dayjs(bookingData.datetime).format('DD/MM/YYYY HH:mm'));
                      return dayjs(bookingData.datetime).format('DD/MM/YYYY HH:mm');
                    })() : 
                    'Chưa xác định'
                  }
                </Text>
              </div>
              
              <div className="flex justify-between items-center">
                <Text type="secondary">Hình thức:</Text>
                <Text strong>
                  {bookingData.type || bookingData.consultationType || 'Chưa xác định'}
                </Text>
              </div>
              
              <div className="flex justify-between items-center">
                <Text type="secondary">Họ tên:</Text>
                <Text strong>
                  {bookingData.customerName || 'Chưa xác định'}
                </Text>
              </div>
              
              <div className="flex justify-between items-center">
                <Text type="secondary">Số điện thoại:</Text>
                <Text strong>
                  {bookingData.customerPhone || 'Chưa xác định'}
                </Text>
              </div>
              
              {bookingData.customerEmail && (
                <div className="flex justify-between items-center">
                  <Text type="secondary">Email:</Text>
                  <Text strong>{bookingData.customerEmail}</Text>
                </div>
              )}
              
              {bookingData.note && (
                <div>
                  <Text type="secondary" className="block mb-2">Ghi chú:</Text>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <Text>{bookingData.note}</Text>
                  </div>
                </div>
              )}
              
              <div className="flex justify-between items-center">
                <Text type="secondary">Mã cuộc hẹn:</Text>
                <Text strong className="text-blue-600">
                  #{bookingData.appointmentId || bookingData.id || 'Đang xử lý'}
                </Text>
              </div>
              
              <div className="flex justify-between items-center">
                <Text type="secondary">Trạng thái:</Text>
                <Text strong className="text-orange-600">
                  {bookingData.status === 'PENDING' ? 'Chờ xác nhận' : bookingData.status}
                </Text>
              </div>
            </div>
          </Card>

          {/* Next Steps */}
          <Card title="Các bước tiếp theo" className="shadow-lg">
            <Timeline
              items={nextSteps.map((step, index) => ({
                dot: step.icon,
                children: (
                  <div>
                    <Title level={5} className="!mb-1">{step.title}</Title>
                    <Paragraph className="text-gray-600 !mb-0">
                      {step.description}
                    </Paragraph>
                  </div>
                )
              }))}
            />
          </Card>
        </div>

        {/* Important Notes */}
        <Card className="mt-8 border-yellow-200 bg-yellow-50">
          <Title level={4} className="!text-yellow-800 !mb-4">
            Lưu ý quan trọng
          </Title>
          <div className="space-y-2 text-yellow-800">
            <Paragraph className="!mb-2 !text-yellow-800">
              • Vui lòng giữ điện thoại để chúng tôi có thể liên hệ xác nhận
            </Paragraph>
            <Paragraph className="!mb-2 !text-yellow-800">
              • Nếu cần thay đổi lịch hẹn, vui lòng liên hệ trước 24 giờ
            </Paragraph>
            <Paragraph className="!mb-2 !text-yellow-800">
              • Tất cả thông tin tư vấn được bảo mật tuyệt đối
            </Paragraph>
            <Paragraph className="!mb-0 !text-yellow-800">
              • Hotline hỗ trợ: <strong>1900-xxxx</strong> (24/7)
            </Paragraph>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Button
            type="primary"
            size="large"
            icon={<CalendarOutlined />}
            onClick={() => navigate('/user/appointment-history')}
            className="min-w-[200px]"
          >
            Xem lịch sử cuộc hẹn
          </Button>
          
          <Button
            size="large"
            onClick={() => navigate('/consultation-booking')}
            className="min-w-[200px]"
          >
            Đặt lịch khác
          </Button>
          
          <Button
            size="large"
            onClick={() => navigate('/')}
            className="min-w-[200px]"
          >
            Về trang chủ
          </Button>
        </div>

        {/* Emergency Contact */}
        <Card className="mt-8 bg-red-50 border-red-200">
          <div className="text-center">
            <Title level={4} className="!text-red-800 !mb-2">
              Trường hợp khẩn cấp
            </Title>
            <Paragraph className="!text-red-700 !mb-4">
              Nếu bạn cần hỗ trợ y tế khẩn cấp, vui lòng liên hệ ngay:
            </Paragraph>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                danger
                size="large"
                icon={<PhoneOutlined />}
                className="min-w-[200px]"
              >
                Hotline khẩn cấp: 115
              </Button>
              <Button
                type="primary"
                danger
                size="large"
                icon={<PhoneOutlined />}
                className="min-w-[200px]"
              >
                Tư vấn nhanh: 1900-xxxx
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
