import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import Layout from '../../components/Layout';
import { Table, Tag } from 'antd';
// import { getDoctorAppointments } from '../../api/appointment';

const mockAppointments = [
  { id: 1, patient: 'Nguyễn Thị B', type: 'Khám định kỳ', status: 'Đã xác nhận', datetime: '2024-06-10 09:00' },
  { id: 2, patient: 'Trần Văn C', type: 'Tư vấn điều trị', status: 'Chờ xác nhận', datetime: '2024-06-12 14:00' },
];

const columns = [
  { title: 'Bệnh nhân', dataIndex: 'patient', key: 'patient' },
  { title: 'Loại lịch hẹn', dataIndex: 'type', key: 'type' },
  { title: 'Thời gian', dataIndex: 'datetime', key: 'datetime' },
  { title: 'Trạng thái', dataIndex: 'status', key: 'status', render: (status) => <Tag color={status === 'Đã xác nhận' ? 'green' : 'orange'}>{status}</Tag> },
];

export default function Appointments() {
  // const [appointments, setAppointments] = useState([]);
  // useEffect(() => {
  //   getDoctorAppointments().then(setAppointments);
  // }, []);
  return (
    <Layout>
      <Navbar />
      <div style={{ padding: 24 }}>
        <h2>Quản lý lịch hẹn</h2>
        <Table columns={columns} dataSource={mockAppointments} rowKey="id" />
      </div>
    </Layout>
  );
} 