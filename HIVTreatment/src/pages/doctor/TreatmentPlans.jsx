import React from 'react';
import Navbar from '../../components/Navbar';
import Layout from '../../components/Layout';
import { Table } from 'antd';

const mockTreatmentPlans = [
  { id: 1, patient: 'Nguyễn Thị B', arvRegimen: 'TDF/3TC/EFV', startDate: '2024-06-01', note: 'Theo dõi men gan' },
];

const columns = [
  { title: 'Bệnh nhân', dataIndex: 'patient', key: 'patient' },
  { title: 'Phác đồ ARV', dataIndex: 'arvRegimen', key: 'arvRegimen' },
  { title: 'Ngày bắt đầu', dataIndex: 'startDate', key: 'startDate' },
  { title: 'Ghi chú', dataIndex: 'note', key: 'note' },
];

export default function TreatmentPlans() {
  return (
    <Layout>
      <Navbar />
      <div style={{ padding: 24 }}>
        <h2>Phác đồ điều trị</h2>
        <Table columns={columns} dataSource={mockTreatmentPlans} rowKey="id" />
      </div>
    </Layout>
  );
} 