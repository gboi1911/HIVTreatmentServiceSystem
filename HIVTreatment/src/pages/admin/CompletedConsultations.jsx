import React, { useEffect, useState } from 'react';
import { Table, Button, Drawer, Modal, message, Spin, Tag } from 'antd';
import { getAllAppointments } from '../../api/appointment';
import { getMedicalRecordByAppointment } from '../../api/medicalRecord';
import { getTreatmentPlanByMedicalRecord } from '../../api/treatmentPlan';
import FollowUpAppointmentModal from '../../components/AdminDashboard/FollowUpAppointmentModal';
import CompletedConsultationDrawer from '../../components/AdminDashboard/CompletedConsultationDrawer';

const CompletedConsultations = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [followUpModalVisible, setFollowUpModalVisible] = useState(false);

  useEffect(() => {
    fetchCompletedAppointments();
  }, []);

  const fetchCompletedAppointments = async () => {
    setLoading(true);
    try {
      const data = await getAllAppointments();
      // Lọc các cuộc hẹn đã hoàn thành
      const completed = Array.isArray(data)
        ? data.filter(appt => appt.status === 'COMPLETED')
        : [];
      setAppointments(completed);
    } catch (err) {
      message.error('Không thể tải danh sách cuộc hẹn đã hoàn thành');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (record) => {
    setSelectedAppointment(record);
    setDrawerVisible(true);
  };

  const handleScheduleFollowUp = (record) => {
    setSelectedAppointment(record);
    setFollowUpModalVisible(true);
  };

  const columns = [
    { title: 'Mã cuộc hẹn', dataIndex: 'id', key: 'id' },
    { title: 'Bệnh nhân', dataIndex: 'customerName', key: 'customerName' },
    { title: 'Bác sĩ', dataIndex: 'doctorName', key: 'doctorName' },
    { title: 'Ngày khám', dataIndex: 'appointmentDate', key: 'appointmentDate' },
    { title: 'Trạng thái', dataIndex: 'status', key: 'status', render: (status) => <Tag color="green">{status}</Tag> },
    {
      title: 'Hành động',
      key: 'actions',
      render: (_, record) => (
        <>
          <Button type="link" onClick={() => handleViewDetails(record)}>Xem chi tiết</Button>
          <Button type="link" onClick={() => handleScheduleFollowUp(record)}>Đặt lịch tái khám</Button>
        </>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <h2>Danh sách cuộc hẹn đã hoàn thành</h2>
      <Spin spinning={loading}>
        <Table
          dataSource={appointments}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </Spin>
      <CompletedConsultationDrawer
        visible={drawerVisible}
        appointment={selectedAppointment}
        onClose={() => setDrawerVisible(false)}
      />
      <FollowUpAppointmentModal
        visible={followUpModalVisible}
        appointment={selectedAppointment}
        onClose={() => setFollowUpModalVisible(false)}
        onSuccess={fetchCompletedAppointments}
      />
    </div>
  );
};

export default CompletedConsultations; 