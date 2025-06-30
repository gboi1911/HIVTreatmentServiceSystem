import React, { useState, useEffect } from 'react';
import { 
  Form, 
  Card, 
  Input, 
  Select, 
  DatePicker, 
  Button, 
  Space, 
  Row, 
  Col, 
  message, 
  Spin,
  Tag,
  Descriptions,
  Divider,
  Alert
} from 'antd';
import { 
  SaveOutlined, 
  CloseOutlined, 
  MedicineBoxOutlined,
  UserOutlined,
  CalendarOutlined,
  FileTextOutlined
} from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  createTreatmentPlan, 
  getTreatmentPlanById, 
  updateTreatmentPlan,
  getARVRegimenTemplates 
} from '../../api/treatmentPlan';
import { getAllMedicalRecords } from '../../api/medicalRecord';
import { getAllDoctors } from '../../api/doctor';
import { formatDate } from '../../utils/formatDate';
import dayjs from 'dayjs';

const { Option } = Select;
const { TextArea } = Input;

const TreatmentPlanForm = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [arvTemplates, setArvTemplates] = useState([]);
  const [selectedMedicalRecord, setSelectedMedicalRecord] = useState(null);
  const [selectedARVTemplate, setSelectedARVTemplate] = useState(null);

  useEffect(() => {
    loadInitialData();
    if (isEdit) {
      loadTreatmentPlan();
    }
  }, [id, isEdit]);

  const loadInitialData = async () => {
    setPageLoading(true);
    try {
      const [medicalRecordsData, doctorsData, templatesData] = await Promise.all([
        getAllMedicalRecords(),
        getAllDoctors(),
        getARVRegimenTemplates()
      ]);
      
      setMedicalRecords(medicalRecordsData || []);
      setDoctors(doctorsData || []);
      setArvTemplates(templatesData || []);
    } catch (error) {
      console.error('Error loading initial data:', error);
      message.error('Không thể tải dữ liệu. Vui lòng thử lại.');
    } finally {
      setPageLoading(false);
    }
  };

  const loadTreatmentPlan = async () => {
    try {
      const planData = await getTreatmentPlanById(id);
      if (planData) {
        form.setFieldsValue({
          medicalRecordId: planData.medicalRecordId,
          doctorId: planData.doctorId,
          arvRegimen: planData.arvRegimen,
          applicableGroup: planData.applicableGroup,
          startDate: planData.startDate ? dayjs(planData.startDate) : null,
          endDate: planData.endDate ? dayjs(planData.endDate) : null,
          note: planData.note,
          status: planData.status
        });
        
        // Find and set selected medical record
        const medRecord = medicalRecords.find(mr => mr.medicalRecordId === planData.medicalRecordId);
        setSelectedMedicalRecord(medRecord);
      }
    } catch (error) {
      console.error('Error loading treatment plan:', error);
      message.error('Không thể tải thông tin kế hoạch điều trị.');
      navigate('/treatment-plans');
    }
  };

  const handleMedicalRecordChange = (value) => {
    const record = medicalRecords.find(mr => mr.medicalRecordId === value);
    setSelectedMedicalRecord(record);
    
    // Auto-fill doctor if medical record has assigned doctor
    if (record && record.doctorId) {
      form.setFieldValue('doctorId', record.doctorId);
    }
  };

  const handleARVTemplateChange = (value) => {
    const template = arvTemplates.find(t => t.regimenName === value);
    setSelectedARVTemplate(template);
    
    if (template) {
      form.setFieldsValue({
        arvRegimen: template.regimenName,
        applicableGroup: template.applicableGroup
      });
    }
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const submitData = {
        ...values,
        startDate: values.startDate ? values.startDate.toISOString() : null,
        endDate: values.endDate ? values.endDate.toISOString() : null
      };

      if (isEdit) {
        await updateTreatmentPlan(id, submitData);
        message.success('Cập nhật kế hoạch điều trị thành công!');
      } else {
        await createTreatmentPlan(submitData);
        message.success('Tạo kế hoạch điều trị thành công!');
      }
      
      navigate('/treatment-plans');
    } catch (error) {
      console.error('Error submitting treatment plan:', error);
      message.error(isEdit ? 'Cập nhật kế hoạch điều trị thất bại!' : 'Tạo kế hoạch điều trị thất bại!');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/treatment-plans');
  };

  if (pageLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
        <p style={{ marginTop: '16px' }}>Đang tải dữ liệu...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      <Card
        title={
          <Space>
            <MedicineBoxOutlined />
            {isEdit ? 'Chỉnh sửa kế hoạch điều trị' : 'Tạo kế hoạch điều trị mới'}
          </Space>
        }
        extra={
          <Space>
            <Button onClick={handleCancel}>
              <CloseOutlined /> Hủy
            </Button>
            <Button 
              type="primary" 
              loading={loading}
              onClick={() => form.submit()}
            >
              <SaveOutlined /> {isEdit ? 'Cập nhật' : 'Tạo mới'}
            </Button>
          </Space>
        }
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            status: 'ACTIVE'
          }}
        >
          <Row gutter={24}>
            <Col xs={24} lg={12}>
              <Card 
                title={<><UserOutlined /> Thông tin bệnh nhân</>} 
                size="small"
                style={{ marginBottom: '16px' }}
              >
                <Form.Item
                  label="Hồ sơ bệnh án"
                  name="medicalRecordId"
                  rules={[{ required: true, message: 'Vui lòng chọn hồ sơ bệnh án!' }]}
                >
                  <Select
                    placeholder="Chọn hồ sơ bệnh án"
                    showSearch
                    filterOption={(input, option) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                    onChange={handleMedicalRecordChange}
                  >
                    {medicalRecords.map(record => (
                      <Option key={record.medicalRecordId} value={record.medicalRecordId}>
                        {record.customerName} - {formatDate(record.createdAt)}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>

                {selectedMedicalRecord && (
                  <Descriptions size="small" column={1} bordered>
                    <Descriptions.Item label="Tên bệnh nhân">
                      {selectedMedicalRecord.customerName}
                    </Descriptions.Item>
                    <Descriptions.Item label="Ngày tạo hồ sơ">
                      {formatDate(selectedMedicalRecord.createdAt)}
                    </Descriptions.Item>
                    <Descriptions.Item label="Trạng thái">
                      <Tag color={selectedMedicalRecord.status === 'ACTIVE' ? 'green' : 'orange'}>
                        {selectedMedicalRecord.status}
                      </Tag>
                    </Descriptions.Item>
                  </Descriptions>
                )}
              </Card>
            </Col>

            <Col xs={24} lg={12}>
              <Card 
                title={<><UserOutlined /> Thông tin bác sĩ</>} 
                size="small"
                style={{ marginBottom: '16px' }}
              >
                <Form.Item
                  label="Bác sĩ phụ trách"
                  name="doctorId"
                  rules={[{ required: true, message: 'Vui lòng chọn bác sĩ!' }]}
                >
                  <Select
                    placeholder="Chọn bác sĩ"
                    showSearch
                    filterOption={(input, option) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {doctors.map(doctor => (
                      <Option key={doctor.id} value={doctor.id}>
                        {doctor.name} - {doctor.specialization}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Card>
            </Col>
          </Row>

          <Card 
            title={<><MedicineBoxOutlined /> Thông tin điều trị</>} 
            size="small"
            style={{ marginBottom: '16px' }}
          >
            <Row gutter={24}>
              <Col xs={24} lg={12}>
                <Form.Item
                  label="Template ARV"
                  help="Chọn template để tự động điền thông tin"
                >
                  <Select
                    placeholder="Chọn template ARV (tùy chọn)"
                    allowClear
                    onChange={handleARVTemplateChange}
                  >
                    {arvTemplates.map(template => (
                      <Option key={template.regimenName} value={template.regimenName}>
                        {template.regimenName} - {template.applicableGroup}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>

                {selectedARVTemplate && (
                  <Alert
                    type="info"
                    showIcon
                    message="Thông tin template"
                    description={
                      <div>
                        <p><strong>Phác đồ:</strong> {selectedARVTemplate.regimenName}</p>
                        <p><strong>Nhóm áp dụng:</strong> {selectedARVTemplate.applicableGroup}</p>
                        <p><strong>Mô tả:</strong> {selectedARVTemplate.description}</p>
                      </div>
                    }
                    style={{ marginBottom: '16px' }}
                  />
                )}
              </Col>

              <Col xs={24} lg={12}>
                <Form.Item
                  label="Trạng thái"
                  name="status"
                  rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
                >
                  <Select>
                    <Option value="ACTIVE">Đang hoạt động</Option>
                    <Option value="PAUSED">Tạm dừng</Option>
                    <Option value="COMPLETED">Hoàn thành</Option>
                    <Option value="CANCELLED">Hủy bỏ</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={24}>
              <Col xs={24} lg={12}>
                <Form.Item
                  label="Phác đồ ARV"
                  name="arvRegimen"
                  rules={[{ required: true, message: 'Vui lòng nhập phác đồ ARV!' }]}
                >
                  <Input placeholder="Ví dụ: TDF/FTC/EFV" />
                </Form.Item>
              </Col>

              <Col xs={24} lg={12}>
                <Form.Item
                  label="Nhóm áp dụng"
                  name="applicableGroup"
                  rules={[{ required: true, message: 'Vui lòng nhập nhóm áp dụng!' }]}
                >
                  <Input placeholder="Ví dụ: Người lớn mới bắt đầu điều trị" />
                </Form.Item>
              </Col>
            </Row>
          </Card>

          <Card 
            title={<><CalendarOutlined /> Thời gian điều trị</>} 
            size="small"
            style={{ marginBottom: '16px' }}
          >
            <Row gutter={24}>
              <Col xs={24} lg={12}>
                <Form.Item
                  label="Ngày bắt đầu"
                  name="startDate"
                  rules={[{ required: true, message: 'Vui lòng chọn ngày bắt đầu!' }]}
                >
                  <DatePicker 
                    style={{ width: '100%' }} 
                    placeholder="Chọn ngày bắt đầu"
                  />
                </Form.Item>
              </Col>

              <Col xs={24} lg={12}>
                <Form.Item
                  label="Ngày kết thúc (dự kiến)"
                  name="endDate"
                >
                  <DatePicker 
                    style={{ width: '100%' }} 
                    placeholder="Chọn ngày kết thúc (tùy chọn)"
                  />
                </Form.Item>
              </Col>
            </Row>
          </Card>

          <Card 
            title={<><FileTextOutlined /> Ghi chú</>} 
            size="small"
          >
            <Form.Item
              label="Ghi chú"
              name="note"
            >
              <TextArea 
                rows={4} 
                placeholder="Nhập ghi chú về kế hoạch điều trị..."
              />
            </Form.Item>
          </Card>
        </Form>
      </Card>
    </div>
  );
};

export default TreatmentPlanForm;
