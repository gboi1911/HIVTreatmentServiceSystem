import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import Layout from '../../components/Layout';
import { Card, Form, Input, Button } from 'antd';

const mockDoctor = {
  name: 'BS. Nguyễn Văn A',
  qualifications: 'Bác sĩ CKI, Đại học Y Hà Nội',
  specialization: 'Truyền nhiễm, HIV/AIDS',
  workSchedule: 'Thứ 2-6: 8h-17h',
};

export default function DoctorProfile() {
  const [form] = Form.useForm();
  const [doctor, setDoctor] = useState(mockDoctor);

  const onFinish = (values) => {
    setDoctor(values);
    // TODO: Gọi API cập nhật thông tin
  };

  return (
    <Layout>
      <Navbar />
      <div style={{ padding: 24, maxWidth: 600, margin: '0 auto' }}>
        <Card title="Hồ sơ cá nhân bác sĩ">
          <Form
            form={form}
            layout="vertical"
            initialValues={doctor}
            onFinish={onFinish}
          >
            <Form.Item label="Họ tên" name="name">
              <Input />
            </Form.Item>
            <Form.Item label="Bằng cấp" name="qualifications">
              <Input />
            </Form.Item>
            <Form.Item label="Chuyên môn" name="specialization">
              <Input />
            </Form.Item>
            <Form.Item label="Lịch làm việc" name="workSchedule">
              <Input />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">Cập nhật</Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </Layout>
  );
}

