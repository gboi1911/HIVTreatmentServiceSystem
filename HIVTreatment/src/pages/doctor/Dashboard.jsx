import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import Layout from '../../components/Layout';
import { Card, Row, Col, Statistic, List } from 'antd';
import { getAllDoctors } from '../../api/doctor';

// Dữ liệu giả demo
const mockStats = [
  { title: 'Bệnh nhân', value: 24 },
  { title: 'Lịch hẹn hôm nay', value: 5 },
  { title: 'Hồ sơ bệnh án', value: 12 },
  { title: 'Phác đồ điều trị', value: 8 },
];

const mockAppointments = [
  { id: 1, patient: 'Nguyễn Thị B', time: '09:00', type: 'Khám định kỳ' },
  { id: 2, patient: 'Trần Văn C', time: '10:30', type: 'Tư vấn điều trị' },
];

export default function Dashboard() {
  const [doctor, setDoctor] = useState(null);

  useEffect(() => {
    // Gọi API lấy thông tin doctor (hoặc dùng dữ liệu giả)
    getAllDoctors().then(data => {
      setDoctor(data[0]); // demo lấy doctor đầu tiên
    });
  }, []);

  return (
      <div style={{ padding: 24 }}>
        <h2>Dashboard Bác sĩ</h2>
        <Row gutter={16} style={{ marginBottom: 24 }}>
          {mockStats.map((stat, idx) => (
            <Col span={6} key={idx}>
              <Card>
                <Statistic title={stat.title} value={stat.value} />
              </Card>
            </Col>
          ))}
        </Row>
        <Card title="Lịch hẹn sắp tới">
          <List
            dataSource={mockAppointments}
            renderItem={item => (
              <List.Item>
                <b>{item.time}</b> - {item.patient} ({item.type})
              </List.Item>
            )}
          />
        </Card>
      </div>
  );
} 