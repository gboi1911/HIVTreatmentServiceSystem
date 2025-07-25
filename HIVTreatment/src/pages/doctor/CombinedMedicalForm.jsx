import React, { useEffect, useState } from 'react';
import { Form, Input, Button, DatePicker, message, Select, Divider, Typography, Card, Row, Col, Modal, Result } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import { createMedicalRecord } from '../../api/medicalRecord';
import { createTreatmentPlan } from '../../api/treatmentPlan';
import { updateAppointmentStatus } from '../../api/appointment';
import { UserOutlined, PhoneOutlined, CheckCircleOutlined, ArrowLeftOutlined } from '@ant-design/icons';

const { Option } = Select;
const { Title, Text } = Typography;

const MedicalRecordForm = ({ onSuccess, customerId, doctorId, customerName, customerPhone }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleFinish = async (values) => {
    setLoading(true);
    try {
      console.log('Form values:', values);
      // Chỉ truyền đúng các trường API yêu cầu
      const medicalRecord = await createMedicalRecord({
        customerId: Number(customerId),
        doctorId: Number(doctorId),
        cd4Count: Number(values.cd4Count),
        viralLoad: Number(values.viralLoad),
        treatmentHistory: values.treatmentHistory || ''
      });
      console.log('API response:', medicalRecord);
      message.success('Tạo hồ sơ bệnh án thành công!');
      onSuccess(medicalRecord.medicalRecordId || medicalRecord.id);
    } catch (error) {
      message.error('Có lỗi khi lưu hồ sơ bệnh án!');
      console.error('MedicalRecord API error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card style={{ maxWidth: 650, margin: '0 auto', marginTop: 32, borderRadius: 12, boxShadow: '0 2px 8px #f0f1f2' }}>
      <Title level={3} style={{ textAlign: 'center', marginBottom: 24 }}>Tạo hồ sơ bệnh án</Title>
      <Row justify="center" align="middle" style={{ marginBottom: 24 }} gutter={16}>
        <Col>
          <UserOutlined style={{ fontSize: 32, color: '#1890ff' }} />
        </Col>
        <Col>
          <div style={{ fontSize: 24, fontWeight: 700, color: '#222', lineHeight: 1 }}>{customerName || '---'}</div>
          <div style={{ fontSize: 18, color: '#555', marginTop: 4 }}><PhoneOutlined style={{ marginRight: 6 }} />{customerPhone || '---'}</div>
        </Col>
      </Row>
      <Divider />
      <Form 
        form={form} 
        layout="vertical" 
        onFinish={handleFinish}
        initialValues={{
          cd4Count: '',
          viralLoad: '',
          treatmentHistory: ''
        }}
      >
        <Form.Item 
          name="cd4Count" 
          label="CD4 Count" 
          rules={[{ required: true, message: 'Bắt buộc nhập CD4 Count' }]}
        > 
          <Input type="number" size="large" placeholder="Nhập số lượng CD4" /> 
        </Form.Item>
        
        <Form.Item 
          name="viralLoad" 
          label="Viral Load" 
          rules={[{ required: true, message: 'Bắt buộc nhập Viral Load' }]}
        > 
          <Input type="number" size="large" placeholder="Nhập chỉ số Viral Load" /> 
        </Form.Item>
        
        <Form.Item name="treatmentHistory" label="Tiền sử điều trị"> 
          <Input.TextArea rows={2} size="large" placeholder="Nhập tiền sử điều trị (nếu có)" /> 
        </Form.Item>
        
        <Form.Item>
          <Button 
            type="primary" 
            htmlType="submit" 
            loading={loading} 
            size="large" 
            style={{ marginTop: 16, width: '100%' }}
          >
            Lưu hồ sơ bệnh án
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

const TreatmentPlanForm = ({ medicalRecordId, doctorId, onBack, onComplete, appointmentId }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleFinish = async (values) => {
    setLoading(true);
    try {
      console.log('TreatmentPlan values:', { medicalRecordId, doctorId, ...values });
      const res = await createTreatmentPlan({
        medicalRecordId,
        doctorId,
        arvRegimen: values.arvRegimen,
        applicableGroup: values.applicableGroup,
        startDate: values.startDate.format('YYYY-MM-DD'),
        note: values.treatmentNote,
      });
      console.log('Created treatmentPlan:', res);
      
      // Cập nhật trạng thái cuộc hẹn thành COMPLETED
      if (appointmentId) {
        try {
          await updateAppointmentStatus(appointmentId, 'COMPLETED', 'Đã hoàn thành khám và tạo phác đồ điều trị');
          console.log('Appointment status updated to COMPLETED');
        } catch (err) {
          console.error('Error updating appointment status:', err);
          // Không hiển thị lỗi này cho người dùng vì đã tạo thành công phác đồ điều trị
        }
      }
      
      message.success('Tạo phác đồ điều trị thành công!');
      form.resetFields();
      onComplete && onComplete(res);
    } catch (error) {
      message.error('Có lỗi khi lưu phác đồ điều trị!');
      console.error('TreatmentPlan API error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card style={{ maxWidth: 650, margin: '0 auto', marginTop: 32, borderRadius: 12, boxShadow: '0 2px 8px #f0f1f2' }}>
      <Title level={3} style={{ textAlign: 'center', marginBottom: 24 }}>Tạo phác đồ điều trị</Title>
      <Form 
        form={form} 
        layout="vertical" 
        onFinish={handleFinish}
        initialValues={{
          arvRegimen: undefined,
          applicableGroup: undefined,
          startDate: null,
          treatmentNote: ''
        }}
      >
        <Form.Item 
          name="arvRegimen" 
          label="Phác đồ ARV" 
          rules={[{ required: true, message: 'Vui lòng chọn phác đồ ARV' }]}
        > 
          <Select placeholder="Chọn phác đồ ARV" allowClear showSearch size="large"> 
            <Option value="TDF/3TC/EFV">TDF/3TC/EFV</Option> 
            <Option value="TDF/3TC/DTG">TDF/3TC/DTG</Option> 
            <Option value="AZT/3TC/NVP">AZT/3TC/NVP</Option> 
            <Option value="ABC/3TC/DTG">ABC/3TC/DTG</Option> 
          </Select> 
        </Form.Item>
        
        <Form.Item 
          name="applicableGroup" 
          label="Nhóm áp dụng" 
          rules={[{ required: true, message: 'Vui lòng chọn nhóm áp dụng' }]}
        > 
          <Select placeholder="Chọn nhóm" size="large"> 
            <Option value="adult">Người lớn</Option> 
            <Option value="child">Trẻ em</Option> 
            <Option value="pregnant">Phụ nữ mang thai</Option> 
          </Select> 
        </Form.Item>
        
        <Form.Item 
          name="startDate" 
          label="Ngày bắt đầu" 
          rules={[{ required: true, message: 'Vui lòng chọn ngày bắt đầu' }]}
        > 
          <DatePicker style={{width: '100%'}} size="large" /> 
        </Form.Item>
        
        <Form.Item name="treatmentNote" label="Ghi chú phác đồ"> 
          <Input.TextArea rows={3} size="large" /> 
        </Form.Item>
        
        <Form.Item>
          <Button 
            type="primary" 
            htmlType="submit" 
            loading={loading} 
            size="large"
            style={{ marginTop: 16, width: '100%' }}
          >
            Lưu phác đồ điều trị
          </Button>
          <Button 
            onClick={onBack} 
            size="large" 
            style={{ marginTop: 8, width: '100%' }}
          >
            Quay lại
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

const CombinedMedicalForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const customerId = params.get('customerId');
  const appointmentId = params.get('appointmentId');
  const customerName = decodeURIComponent(params.get('customerName') || '');
  const customerPhone = decodeURIComponent(params.get('customerPhone') || '');
  const doctorId = localStorage.getItem('doctorId') || '1'; // Mặc định là 1 nếu không có

  const [step, setStep] = useState(1);
  const [medicalRecordId, setMedicalRecordId] = useState(null);
  const [completedTreatmentPlan, setCompletedTreatmentPlan] = useState(null);
  const [showCompletionModal, setShowCompletionModal] = useState(false);

  useEffect(() => {
    // Nếu không có customerId, quay lại appointments
    if (!customerId) {
      message.error('Không tìm thấy thông tin bệnh nhân');
      navigate('/doctor/appointments');
    }
    console.log('Form data:', { customerId, customerName, customerPhone, doctorId, appointmentId });
  }, [customerId, customerName, customerPhone, doctorId, appointmentId, navigate]);

  const handleTreatmentPlanComplete = (treatmentPlan) => {
    setCompletedTreatmentPlan(treatmentPlan);
    setShowCompletionModal(true);
  };

  const handleReturnToAppointments = () => {
    navigate('/doctor/appointments');
  };

  return (
    <div style={{padding: 24}}>
      <Row justify="center" style={{ marginBottom: 32 }} gutter={16}>
        <Col>
          <Button
            type={step === 1 ? 'primary' : 'default'}
            size="large"
            style={{ minWidth: 180, fontWeight: 600, fontSize: 18 }}
            onClick={() => setStep(1)}
          >
            Hồ sơ bệnh án
          </Button>
        </Col>
        <Col>
          <Button
            type={step === 2 ? 'primary' : 'default'}
            size="large"
            style={{ minWidth: 180, fontWeight: 600, fontSize: 18 }}
            onClick={() => setStep(2)}
            disabled={!medicalRecordId}
          >
            Phác đồ điều trị
          </Button>
        </Col>
      </Row>
      {step === 1 && (
        <MedicalRecordForm
          onSuccess={(id) => { setMedicalRecordId(id); setStep(2); }}
          customerId={customerId}
          doctorId={doctorId}
          customerName={customerName}
          customerPhone={customerPhone}
        />
      )}
      {step === 2 && (
        <TreatmentPlanForm
          medicalRecordId={medicalRecordId}
          doctorId={doctorId}
          appointmentId={appointmentId}
          onBack={() => setStep(1)}
          onComplete={handleTreatmentPlanComplete}
        />
      )}

      {/* Modal hiển thị khi hoàn thành phác đồ điều trị */}
      <Modal
        visible={showCompletionModal}
        footer={null}
        closable={false}
        width={600}
        centered
      >
        <Result
          status="success"
          icon={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
          title="Đã hoàn thành khám và tạo phác đồ điều trị!"
          subTitle={
            <div>
              <p>Bệnh nhân: <strong>{customerName}</strong></p>
              <p>Phác đồ ARV: <strong>{completedTreatmentPlan?.arvRegimen}</strong></p>
              <p>Đã gửi thông báo cho bệnh nhân về kết quả khám và phác đồ điều trị.</p>
            </div>
          }
          extra={[
            <Button
              type="primary"
              key="appointments"
              icon={<ArrowLeftOutlined />}
              onClick={handleReturnToAppointments}
              size="large"
            >
              Quay lại danh sách lịch hẹn
            </Button>
          ]}
        />
      </Modal>
    </div>
  );
};

export default CombinedMedicalForm; 