import React from 'react';
import Navbar from '../../components/Navbar';
import Layout from '../../components/Layout';
import { Table } from 'antd';

const mockLabResults = [
  { id: 1, patient: 'Nguyễn Thị B', result: 'Âm tính', cd4Count: 350, testDate: '2024-05-25', note: 'Kết quả tốt' },
];

const columns = [
  { title: 'Bệnh nhân', dataIndex: 'patient', key: 'patient' },
  { title: 'Kết quả', dataIndex: 'result', key: 'result' },
  { title: 'CD4', dataIndex: 'cd4Count', key: 'cd4Count' },
  { title: 'Ngày xét nghiệm', dataIndex: 'testDate', key: 'testDate' },
  { title: 'Ghi chú', dataIndex: 'note', key: 'note' },
];

export default function LabResults() {
  return (
    <Layout>
      <Navbar />
      <div style={{ padding: 24 }}>
        <h2>Kết quả xét nghiệm</h2>
        <Table columns={columns} dataSource={mockLabResults} rowKey="id" />
      </div>
    </Layout>
  );
} 