import React from 'react';
import Navbar from '../../components/Navbar';
import Layout from '../../components/Layout';
import { Table } from 'antd';

const mockPatients = [
  { id: 201, name: 'Nguyễn Thị B', gender: 'Nữ', age: 32 },
  { id: 202, name: 'Trần Văn C', gender: 'Nam', age: 40 },
];

const columns = [
  { title: 'Tên bệnh nhân', dataIndex: 'name', key: 'name' },
  { title: 'Giới tính', dataIndex: 'gender', key: 'gender' },
  { title: 'Tuổi', dataIndex: 'age', key: 'age' },
];

export default function Patients() {
  return (
      <div style={{ padding: 24 }}>
        <h2>Danh sách bệnh nhân</h2>
        <Table columns={columns} dataSource={mockPatients} rowKey="id" />
      </div>
  );
} 