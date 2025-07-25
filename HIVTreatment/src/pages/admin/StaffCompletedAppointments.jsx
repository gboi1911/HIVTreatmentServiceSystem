import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Descriptions, Card, Typography, message, Spin } from 'antd';
import { getAllAppointments } from '../../api/appointment';
import { getMedicalRecordByAppointment } from '../../api/medicalRecord';
import { getTreatmentPlanByMedicalRecord } from '../../api/treatmentPlan';
import FollowUpAppointmentModal from '../../components/AdminDashboard/FollowUpAppointmentModal';

const { Title } = Typography;

const StaffCompletedAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [medicalRecord, setMedicalRecord] = useState(null);
  const [treatmentPlan, setTreatmentPlan] = useState(null);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [followUpModalVisible, setFollowUpModalVisible] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);

  useEffect(() => {
    fetchCompletedAppointments();
  }, []);

  const fetchCompletedAppointments = async () => {
    setLoading(true);
    try {
      const data = await getAllAppointments();
      // Filter for COMPLETED status
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

  const handleViewDetails = async (record) => {
    setSelectedAppointment(record);
    setDetailsLoading(true);
    setDetailsModalVisible(true);
    try {
      // Lấy medical record theo appointmentId
      const medRecord = await getMedicalRecordByAppointment(record.id || record.appointmentId);
      setMedicalRecord(medRecord);
      // Lấy treatment plan theo medicalRecordId
      if (medRecord && medRecord.medicalRecordId) {
        const treatPlan = await getTreatmentPlanByMedicalRecord(medRecord.medicalRecordId);
        setTreatmentPlan(treatPlan);
      } else {
        setTreatmentPlan(null);
      }
    } catch (err) {
      message.error('Không thể tải chi tiết hồ sơ bệnh án hoặc phác đồ điều trị');
      setMedicalRecord(null);
      setTreatmentPlan(null);
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleScheduleFollowUp = (record) => {
    setSelectedAppointment(record);
    setFollowUpModalVisible(true);
  };

  const columns = [
    { title: 'Mã cuộc hẹn', dataIndex: 'id', key: 'id' },
    { title: 'Tên bệnh nhân', dataIndex: 'customerName', key: 'customerName' },
    { title: 'SĐT', dataIndex: 'customerPhone', key: 'customerPhone' },
    { title: 'Bác sĩ', dataIndex: 'doctorName', key: 'doctorName' },
    { title: 'Ngày khám', dataIndex: 'appointmentDate', key: 'appointmentDate' },
    { title: 'Trạng thái', dataIndex: 'status', key: 'status' },
    {
      title: 'Hành động',
      key: 'actions',
      render: (_, record) => (
        <>
          <Button onClick={() => handleViewDetails(record)} style={{ marginRight: 8 }}>Xem chi tiết</Button>
          <Button type="primary" onClick={() => handleScheduleFollowUp(record)}>Đặt lịch tái khám</Button>
        </>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>Danh sách cuộc hẹn đã hoàn thành</Title>
      <Table
        dataSource={appointments}
        columns={columns}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 8 }}
      />

      {/* Modal xem chi tiết hồ sơ bệnh án và phác đồ điều trị */}
      <Modal
        visible={detailsModalVisible}
        onCancel={() => setDetailsModalVisible(false)}
        footer={null}
        width={700}
        title="Chi tiết hồ sơ bệnh án & phác đồ điều trị"
      >
        {detailsLoading ? <Spin /> : (
          <>
            {medicalRecord ? (
              <Card title="Hồ sơ bệnh án" style={{ marginBottom: 16 }}>
                <Descriptions column={1} bordered size="middle">
                  <Descriptions.Item label="Mã hồ sơ">{medicalRecord.medicalRecordId}</Descriptions.Item>
                  <Descriptions.Item label="Bác sĩ phụ trách">{medicalRecord.doctorName}</Descriptions.Item>
                  <Descriptions.Item label="Số lượng CD4">{medicalRecord.cd4Count}</Descriptions.Item>
                  <Descriptions.Item label="Tải lượng virus">{medicalRecord.viralLoad}</Descriptions.Item>
                  <Descriptions.Item label="Tiền sử điều trị">{medicalRecord.treatmentHistory}</Descriptions.Item>
                </Descriptions>
              </Card>
            ) : <p>Không có hồ sơ bệnh án.</p>}
            {treatmentPlan ? (
              <Card title="Phác đồ điều trị">
                <Descriptions column={1} bordered size="middle">
                  <Descriptions.Item label="Phác đồ ARV">{treatmentPlan.arvRegimen}</Descriptions.Item>
                  <Descriptions.Item label="Nhóm áp dụng">{treatmentPlan.applicableGroup}</Descriptions.Item>
                  <Descriptions.Item label="Ngày bắt đầu">{treatmentPlan.startDate}</Descriptions.Item>
                  <Descriptions.Item label="Ghi chú">{treatmentPlan.note}</Descriptions.Item>
                </Descriptions>
              </Card>
            ) : <p>Không có phác đồ điều trị.</p>}
          </>
        )}
      </Modal>

      {/* Modal đặt lịch tái khám */}
      <FollowUpAppointmentModal
        visible={followUpModalVisible}
        onCancel={() => setFollowUpModalVisible(false)}
        appointment={selectedAppointment}
        onSuccess={() => {
          setFollowUpModalVisible(false);
          fetchCompletedAppointments();
        }}
      />
    </div>
  );
};

export default StaffCompletedAppointments; 