import React, { useEffect, useState } from 'react';
import { Card, Descriptions, Spin, Alert, notification, Badge, Button, Divider, Typography } from 'antd';
import { getMedicalRecordsByCustomer } from '../../api/medicalRecord';
import { useAuthStatus } from '../../hooks/useAuthStatus';
import moment from 'moment';
import { MedicineBoxOutlined, NotificationOutlined, CheckCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const UserMedicalRecord = () => {
  const { userInfo, isLoggedIn, loading: authLoading } = useAuthStatus();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newRecords, setNewRecords] = useState([]);

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
        
        // Sắp xếp theo thời gian tạo mới nhất
        const sortedRecords = Array.isArray(data) 
          ? [...data].sort((a, b) => new Date(b.createdAt || b.lastUpdated || 0) - new Date(a.createdAt || a.lastUpdated || 0))
          : [];
        
        setRecords(sortedRecords);
        
        // Xác định hồ sơ mới (trong vòng 24 giờ)
        const now = new Date();
        const recentRecords = sortedRecords.filter(record => {
          const recordDate = new Date(record.createdAt || record.lastUpdated || 0);
          const hoursDiff = (now - recordDate) / (1000 * 60 * 60);
          return hoursDiff <= 24;
        });
        
        setNewRecords(recentRecords);
        
        // Hiển thị thông báo nếu có hồ sơ mới
        if (recentRecords.length > 0) {
          notification.info({
            message: 'Bạn có hồ sơ bệnh án mới',
            description: 'Bác sĩ đã cập nhật hồ sơ bệnh án và phác đồ điều trị mới cho bạn. Vui lòng kiểm tra chi tiết bên dưới.',
            icon: <MedicineBoxOutlined style={{ color: '#1890ff' }} />,
            duration: 0,
            placement: 'topRight',
          });
        }
      } catch (error) {
        console.error('Error fetching medical records:', error);
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
    <div style={{ maxWidth: 900, margin: '40px auto' }}>
      <Title level={2}>Hồ sơ bệnh án của tôi</Title>
      
      {newRecords.length > 0 && (
        <Alert
          message="Thông báo mới"
          description={
            <div>
              <p>Bác sĩ đã cập nhật hồ sơ bệnh án và phác đồ điều trị mới cho bạn. Vui lòng xem chi tiết bên dưới.</p>
              <p>Lưu ý: Tuân thủ đúng phác đồ điều trị và đến tái khám theo lịch hẹn.</p>
            </div>
          }
          type="info"
          showIcon
          icon={<NotificationOutlined />}
          style={{ marginBottom: 24 }}
          action={
            <Button size="small" type="primary">
              Đã đọc
            </Button>
          }
        />
      )}
      
      {records.map((record, index) => {
        const isNew = newRecords.some(newRecord => newRecord.medicalRecordId === record.medicalRecordId);
        
        return (
          <Card 
            key={record.medicalRecordId} 
            style={{ marginBottom: 32 }}
            title={
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span>Hồ sơ bệnh án #{record.medicalRecordId}</span>
                {isNew && (
                  <Badge 
                    count="Mới" 
                    style={{ 
                      backgroundColor: '#52c41a', 
                      marginLeft: 12 
                    }} 
                  />
                )}
              </div>
            }
            extra={record.lastUpdated ? moment(record.lastUpdated).format('DD/MM/YYYY HH:mm') : ''}
          >
            <Descriptions column={1} bordered size="middle">
              <Descriptions.Item label="Mã hồ sơ">{record.medicalRecordId}</Descriptions.Item>
              <Descriptions.Item label="Bác sĩ phụ trách">{record.doctorName}</Descriptions.Item>
              <Descriptions.Item label="Số lượng CD4">
                <Text strong>{record.cd4Count}</Text>
                <Text type={record.cd4Status === 'NORMAL' ? 'success' : 'danger'} style={{ marginLeft: 8 }}>
                  ({record.cd4Status || 'Chưa xác định'})
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label="Tải lượng virus">
                <Text strong>{record.viralLoad}</Text>
                <Text type={record.viralLoadStatus === 'NORMAL' ? 'success' : 'danger'} style={{ marginLeft: 8 }}>
                  ({record.viralLoadStatus || 'Chưa xác định'})
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label="Tiền sử điều trị">{record.treatmentHistory || 'Không có'}</Descriptions.Item>
            </Descriptions>
            
            {isNew && (
              <div style={{ marginTop: 16, padding: 16, backgroundColor: '#f6ffed', border: '1px solid #b7eb8f', borderRadius: 4 }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                  <CheckCircleOutlined style={{ color: '#52c41a', fontSize: 18, marginRight: 8 }} />
                  <Text strong style={{ color: '#52c41a' }}>Thông báo từ bác sĩ</Text>
                </div>
                <Text>
                  Bác sĩ đã cập nhật hồ sơ bệnh án của bạn. Vui lòng kiểm tra phác đồ điều trị mới và tuân thủ đúng hướng dẫn.
                  Nếu có thắc mắc, vui lòng liên hệ với bác sĩ hoặc nhân viên y tế.
                </Text>
                <div style={{ marginTop: 12 }}>
                  <Button type="primary" size="small" href="/user/treatment-plans">
                    Xem phác đồ điều trị
                  </Button>
                </div>
              </div>
            )}
            
            {index < records.length - 1 && <Divider />}
          </Card>
        );
      })}
    </div>
  );
};

export default UserMedicalRecord;
