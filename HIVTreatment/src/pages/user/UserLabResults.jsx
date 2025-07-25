import React, { useEffect, useState } from 'react';
import { Table, Modal, Button, Spin, Alert } from 'antd';
import { getLabResultsByMedicalRecord } from '../../api/labResult';
import { getMedicalRecordsByCustomer } from '../../api/medicalRecord';
import { useAuthStatus } from '../../hooks/useAuthStatus';
import moment from 'moment';

const UserLabResults = () => {
  const { userInfo, isLoggedIn, loading: authLoading } = useAuthStatus();
  const [labResults, setLabResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedResult, setSelectedResult] = useState(null);

  useEffect(() => {
    const fetchLabResults = async () => {
      const customerId = userInfo?.customerId || userInfo?.id;
      if (authLoading || !isLoggedIn || !customerId) return;
      setLoading(true);
      setError(null);
      try {
        // Get all medical records for this customer
        const records = await getMedicalRecordsByCustomer(customerId);
        const allResults = [];
        for (const record of Array.isArray(records) ? records : []) {
          const results = await getLabResultsByMedicalRecord(record.medicalRecordId);
          if (Array.isArray(results)) allResults.push(...results);
        }
        setLabResults(allResults);
      } catch (err) {
        setError('Không thể tải kết quả xét nghiệm.');
      } finally {
        setLoading(false);
      }
    };
    fetchLabResults();
  }, [authLoading, isLoggedIn, userInfo]);

  const columns = [
    { title: 'Ngày xét nghiệm', dataIndex: 'testDate', key: 'testDate', render: d => d ? moment(d).format('DD/MM/YYYY') : '' },
    { title: 'Kết quả', dataIndex: 'result', key: 'result' },
    { title: 'CD4', dataIndex: 'cd4Count', key: 'cd4Count' },
    { title: 'Bác sĩ', dataIndex: 'doctorName', key: 'doctorName' },
    { title: 'Ghi chú', dataIndex: 'note', key: 'note', ellipsis: true },
    { title: '', key: 'actions', render: (_, record) => <Button type="link" onClick={() => { setSelectedResult(record); setDetailModalVisible(true); }}>Xem chi tiết</Button> }
  ];

  if (authLoading || loading) return <Spin tip="Đang tải kết quả xét nghiệm..." style={{ width: '100%', marginTop: 40 }} />;
  if (error) return <Alert type="error" message={error} showIcon style={{ marginTop: 40 }} />;
  if (!labResults.length) return <Alert type="info" message="Bạn chưa có kết quả xét nghiệm." showIcon style={{ marginTop: 40 }} />;

  return (
    <div style={{ maxWidth: 1000, margin: '40px auto' }}>
      <h2 style={{ marginBottom: 24 }}>Kết quả xét nghiệm của tôi</h2>
      <Table columns={columns} dataSource={labResults} rowKey="labResultId" pagination={{ pageSize: 10 }} />
      <Modal
        title="Chi tiết kết quả xét nghiệm"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={null}
        width={600}
        destroyOnClose
      >
        {selectedResult && (
          <div>
            <p><b>Ngày xét nghiệm:</b> {selectedResult.testDate ? moment(selectedResult.testDate).format('DD/MM/YYYY') : ''}</p>
            <p><b>Kết quả:</b> {selectedResult.result}</p>
            <p><b>CD4:</b> {selectedResult.cd4Count}</p>
            <p><b>Bác sĩ:</b> {selectedResult.doctorName}</p>
            <p><b>Ghi chú:</b> {selectedResult.note}</p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default UserLabResults; 