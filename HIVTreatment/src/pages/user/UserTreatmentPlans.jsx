import React, { useEffect, useState } from 'react';
import { Table, Modal, Button, Spin, Alert } from 'antd';
import { getTreatmentPlansByMedicalRecord } from '../../api/treatmentPlan';
import { getMedicalRecordsByCustomer } from '../../api/medicalRecord';
import { useAuthStatus } from '../../hooks/useAuthStatus';
import moment from 'moment';

const UserTreatmentPlans = () => {
  const { userInfo, isLoggedIn, loading: authLoading } = useAuthStatus();
  console.log('👤 UserTreatmentPlans - userInfo:', userInfo);
  console.log('🆔 UserTreatmentPlans - Available IDs:', {
    id: userInfo?.id,
    customerId: userInfo?.customerId,
    accountId: userInfo?.accountId
  });
  
  const [treatmentPlans, setTreatmentPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  useEffect(() => {
    const fetchPlans = async () => {
      const customerId = userInfo?.customerId || userInfo?.id;
      console.log('🔍 UserTreatmentPlans - Using customerId:', customerId);
      console.log('🔍 UserTreatmentPlans - userInfo.customerId:', userInfo?.customerId);
      console.log('🔍 UserTreatmentPlans - userInfo.id:', userInfo?.id);
      
      if (authLoading || !isLoggedIn || !customerId) {
        console.log('⚠️ UserTreatmentPlans - Skipping fetch:', {
          authLoading,
          isLoggedIn,
          customerId
        });
        return;
      }
      
      setLoading(true);
      setError(null);
      try {
        // Get all medical records for this customer
        console.log('📋 UserTreatmentPlans - Fetching medical records for customerId:', customerId);
        const records = await getMedicalRecordsByCustomer(customerId);
        console.log('📋 UserTreatmentPlans - Medical records received:', records);
        
        const allPlans = [];
        for (const record of Array.isArray(records) ? records : []) {
          console.log('🔍 UserTreatmentPlans - Fetching plans for medical record:', record.medicalRecordId);
          const plans = await getTreatmentPlansByMedicalRecord(record.medicalRecordId);
          console.log('🔍 UserTreatmentPlans - Plans for record:', plans);
          if (Array.isArray(plans)) allPlans.push(...plans);
        }
        console.log('📋 UserTreatmentPlans - All plans collected:', allPlans);
        setTreatmentPlans(allPlans);
      } catch (err) {
        console.error('❌ UserTreatmentPlans - Error fetching plans:', err);
        setError('Không thể tải kế hoạch điều trị.');
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, [authLoading, isLoggedIn, userInfo]);

  const columns = [
    { title: 'Ngày bắt đầu', dataIndex: 'startDate', key: 'startDate', render: d => d ? moment(d).format('DD/MM/YYYY') : '' },
    { title: 'Ngày kết thúc', dataIndex: 'endDate', key: 'endDate', render: d => d ? moment(d).format('DD/MM/YYYY') : '' },
    { title: 'Phác đồ ARV', dataIndex: 'arvRegimen', key: 'arvRegimen' },
    { title: 'Nhóm áp dụng', dataIndex: 'applicableGroup', key: 'applicableGroup' },
    { title: 'Bác sĩ', dataIndex: 'doctorName', key: 'doctorName' },
    { title: 'Ghi chú', dataIndex: 'note', key: 'note', ellipsis: true },
    { title: '', key: 'actions', render: (_, record) => <Button type="link" onClick={() => { setSelectedPlan(record); setDetailModalVisible(true); }}>Xem chi tiết</Button> }
  ];

  if (authLoading || loading) return <Spin tip="Đang tải kế hoạch điều trị..." style={{ width: '100%', marginTop: 40 }} />;
  if (error) return <Alert type="error" message={error} showIcon style={{ marginTop: 40 }} />;
  if (!treatmentPlans.length) return <Alert type="info" message="Bạn chưa có kế hoạch điều trị." showIcon style={{ marginTop: 40 }} />;

  return (
    <div style={{ maxWidth: 1000, margin: '40px auto' }}>
      <h2 style={{ marginBottom: 24 }}>Kế hoạch điều trị của tôi</h2>
      <Table columns={columns} dataSource={treatmentPlans} rowKey="planId" pagination={{ pageSize: 10 }} />
      <Modal
        title="Chi tiết kế hoạch điều trị"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={null}
        width={600}
        destroyOnClose
      >
        {selectedPlan && (
          <div>
            <p><b>Ngày bắt đầu:</b> {selectedPlan.startDate ? moment(selectedPlan.startDate).format('DD/MM/YYYY') : ''}</p>
            <p><b>Ngày kết thúc:</b> {selectedPlan.endDate ? moment(selectedPlan.endDate).format('DD/MM/YYYY') : ''}</p>
            <p><b>Phác đồ ARV:</b> {selectedPlan.arvRegimen}</p>
            <p><b>Nhóm áp dụng:</b> {selectedPlan.applicableGroup}</p>
            <p><b>Bác sĩ:</b> {selectedPlan.doctorName}</p>
            <p><b>Ghi chú:</b> {selectedPlan.note}</p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default UserTreatmentPlans; 