import React from "react";
import { Card, Typography, Divider, Row, Col, Button } from "antd";
import { PhoneOutlined, MailOutlined, EnvironmentOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;


export default function Contact() {
  return (
    <div className="min-h-screen flex items-center justify-center py-12 relative bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200">
      {/* Decorative background circles */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-300 opacity-20 rounded-full blur-3xl -z-10" style={{top: '-120px', left: '-120px'}}></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500 opacity-20 rounded-full blur-3xl -z-10" style={{bottom: '-120px', right: '-120px'}}></div>

      <Card className="max-w-2xl w-full shadow-2xl p-10 rounded-3xl border-0 bg-white/90 backdrop-blur-lg">
        <div className="flex items-center gap-4 mb-6">
          <PhoneOutlined style={{fontSize: 36, color: '#1677ff'}} />
          <Title level={2} className="mb-0 text-blue-700">Liên hệ</Title>
        </div>
        <Text className="text-lg text-gray-700 block mb-2">
          Nếu bạn cần hỗ trợ hoặc có bất kỳ thắc mắc nào, hãy liên hệ với chúng tôi qua các kênh dưới đây.
        </Text>
        <Divider className="my-6" />
        <Row gutter={[0, 32]} className="mt-4">
          <Col span={24}>
            <div className="flex items-center gap-4 p-4 rounded-xl bg-blue-50 hover:bg-blue-100 transition-all">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center shadow">
                <PhoneOutlined style={{fontSize: 24, color: '#1677ff'}} />
              </div>
              <div>
                <Text strong className="text-blue-700 text-lg">Điện thoại</Text>
                <div className="text-base text-gray-800 font-semibold">028.1081 - 1900.2125</div>
              </div>
            </div>
          </Col>
          <Col span={24}>
            <div className="flex items-center gap-4 p-4 rounded-xl bg-blue-50 hover:bg-blue-100 transition-all">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center shadow">
                <MailOutlined style={{fontSize: 24, color: '#1677ff'}} />
              </div>
              <div>
                <Text strong className="text-blue-700 text-lg">Email</Text>
                <div className="text-base text-gray-800 font-semibold">hivclinic@hospital.vn</div>
              </div>
            </div>
          </Col>
          <Col span={24}>
            <div className="flex items-center gap-4 p-4 rounded-xl bg-blue-50 hover:bg-blue-100 transition-all">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center shadow">
                <EnvironmentOutlined style={{fontSize: 24, color: '#1677ff'}} />
              </div>
              <div>
                <Text strong className="text-blue-700 text-lg">Địa chỉ</Text>
                <div className="text-base text-gray-800 font-semibold">Số 1 Nguyễn Trãi, Quận 1, TP. Hồ Chí Minh</div>
              </div>
            </div>
          </Col>
        </Row>
        <Divider className="my-6" />
        <div className="flex justify-center">
          <Button type="primary" size="large" icon={<PhoneOutlined />} className="px-8 py-2 text-lg shadow-lg hover:scale-105 transition-transform">
            Gọi ngay
          </Button>
        </div>
      </Card>
    </div>
  );
}
