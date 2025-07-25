import React, { useEffect, useState } from 'react';
import { Card, Descriptions, Spin, Alert } from 'antd';
import { getMedicalRecordsByCustomer } from '../../api/medicalRecord';
import { useAuthStatus } from '../../hooks/useAuthStatus';
import moment from 'moment';

const UserMedicalRecord = () => {
  const { userInfo, isLoggedIn, loading: authLoading } = useAuthStatus();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecords = async () => {
      const customerId = userInfo?.customerId || userInfo?.id;
      console.log('UserMedicalRecord customerId:', customerId, userInfo);
      if (authLoading || !isLoggedIn || !customerId) return;
      setLoading(true);
      setError(null);
      try {
        const data = await getMedicalRecordsByCustomer(customerId);
        console.log('UserMedicalRecord data:', data);
        setRecords(Array.isArray(data) ? data : []);
      } catch (err) {
        setError('Không thể tải hồ sơ bệnh án.');
      } finally {
        setLoading(false);
      }
    };
    fetchRecords();
  }, [authLoading, isLoggedIn, userInfo]);

  if (authLoading || loading) return <Spin tip="Đang tải hồ sơ bệnh án..." style={{ width: '100%', marginTop: 40 }} />;
  if (error) return <Alert type="error" message={error} showIcon style={{ marginTop: 40 }} />;
  if (!records.length) return <Alert type="info" message="Bạn chưa có hồ sơ bệnh án." showIcon style={{ marginTop: 40 }} />;

  return (
    <Card title="Hồ sơ bệnh án của tôi" style={{ maxWidth: 900, margin: '40px auto' }}>
      {records.map(record => (
        <Descriptions key={record.medicalRecordId} column={1} bordered size="middle" style={{ marginBottom: 32 }}>
          <Descriptions.Item label="Mã hồ sơ">{record.medicalRecordId}</Descriptions.Item>
          <Descriptions.Item label="Mã khách hàng">{record.customerId}</Descriptions.Item>
          <Descriptions.Item label="Tên khách hàng">{record.customerName}</Descriptions.Item>
          <Descriptions.Item label="Mã bác sĩ">{record.doctorId}</Descriptions.Item>
          <Descriptions.Item label="Tên bác sĩ">{record.doctorName}</Descriptions.Item>
          <Descriptions.Item label="Số lượng CD4">{record.cd4Count}</Descriptions.Item>
          <Descriptions.Item label="Tải lượng virus">{record.viralLoad}</Descriptions.Item>
          <Descriptions.Item label="Lịch sử điều trị">{record.treatmentHistory}</Descriptions.Item>
          <Descriptions.Item label="Trạng thái CD4">{record.cd4Status}</Descriptions.Item>
          <Descriptions.Item label="Trạng thái tải lượng virus">{record.viralLoadStatus}</Descriptions.Item>
          <Descriptions.Item label="Cập nhật lần cuối">{record.lastUpdated ? moment(record.lastUpdated).format('DD/MM/YYYY HH:mm') : ''}</Descriptions.Item>
        </Descriptions>
      ))}
    </Card>
  );
};

export default UserMedicalRecord;
