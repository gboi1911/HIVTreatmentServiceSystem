import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Form, 
  Input, 
  InputNumber, 
  Select, 
  Button, 
  Space, 
  Row, 
  Col, 
  message,
  Spin,
  Divider,
  Alert
} from 'antd';
import { 
  SaveOutlined, 
  ArrowLeftOutlined,
  UserOutlined,
  MedicineBoxOutlined,
  HeartOutlined,
  FileTextOutlined
} from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { createMedicalRecord, updateMedicalRecord, getMedicalRecords } from '../../api/medicalRecord';
import { getAllCustomers } from '../../api/customer';
import { getAllDoctors } from '../../api/doctor';

const { Option } = Select;
const { TextArea } = Input;

const MedicalRecordForm = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [recordData, setRecordData] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  // Load data on component mount
  useEffect(() => {
    loadInitialData();
    if (isEdit) {
      loadRecordData();
    }
  }, [id]);

  const loadInitialData = async () => {
  setLoading(true);
  try {
    // Load customers and doctors
    const [customersResponse, doctorsResponse] = await Promise.all([
      getAllCustomers(),
      getAllDoctors()
    ]);
    
    setCustomers(Array.isArray(customersResponse) ? customersResponse : []);
    setDoctors(Array.isArray(doctorsResponse) ? doctorsResponse : []);
    
  } catch (error) {
    console.error('Error loading initial data:', error);
    // Fallback data for development
    setCustomers([
      { id: 1, fullName: 'Nguyễn Văn A', email: 'nguyenvana@email.com' },
      { id: 2, fullName: 'Trần Thị B', email: 'tranthib@email.com' },
    ]);
    setDoctors([
      { id: 1, name: 'BS. Nguyễn Thị C', email: 'bsnguyenthic@email.com' },
      { id: 2, name: 'BS. Lê Văn D', email: 'bslevand@email.com' },
    ]);
  } finally {
    setLoading(false);
  }
};

  const loadRecordData = async () => {
    try {
      // Load all records and find the one with matching ID
      const records = await getMedicalRecords();
      const record = Array.isArray(records) ? records.find(r => r.id === parseInt(id)) : null;
      
      if (record) {
        setRecordData(record);
        form.setFieldsValue({
          customerId: record.customerId,
          doctorId: record.doctorId,
          cd4Count: record.cd4Count,
          viralLoad: record.viralLoad,
          treatmentHistory: record.treatmentHistory,
          notes: record.notes,
          diagnosis: record.diagnosis,
          symptoms: record.symptoms,
        });
      } else {
        message.error('Không tìm thấy hồ sơ bệnh án');
        navigate('/medical-records');
      }
    } catch (error) {
      console.error('Error loading record data:', error);
      message.error('Không thể tải thông tin hồ sơ bệnh án');
    }
  };

  const handleSubmit = async (values) => {
    setSaving(true);
    try {
      if (isEdit) {
        await updateMedicalRecord(id, values);
        message.success('Cập nhật hồ sơ bệnh án thành công');
      } else {
        await createMedicalRecord(values);
        message.success('Tạo hồ sơ bệnh án thành công');
      }
      navigate('/medical-records');
    } catch (error) {
      console.error('Error saving medical record:', error);
      message.error(isEdit ? 'Không thể cập nhật hồ sơ bệnh án' : 'Không thể tạo hồ sơ bệnh án');
    } finally {
      setSaving(false);
    }
  };

  const getCD4Status = (cd4Count) => {
    if (!cd4Count) return null;
    if (cd4Count < 200) return { text: 'Nguy hiểm - Cần can thiệp ngay', color: 'error' };
    if (cd4Count < 350) return { text: 'Thấp - Cần theo dõi chặt chẽ', color: 'warning' };
    if (cd4Count < 500) return { text: 'Bình thường thấp', color: 'info' };
    return { text: 'Bình thường', color: 'success' };
  };

  const getViralLoadStatus = (viralLoad) => {
    if (!viralLoad) return null;
    if (viralLoad < 50) return { text: 'Không phát hiện - Rất tốt', color: 'success' };
    if (viralLoad < 1000) return { text: 'Thấp - Tốt', color: 'info' };
    if (viralLoad < 10000) return { text: 'Trung bình - Cần theo dõi', color: 'warning' };
    return { text: 'Cao - Cần điều chỉnh điều trị', color: 'error' };
  };

  if (loading) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <Spin size="large" />
        <div style={{ marginTop: '16px' }}>Đang tải dữ liệu...</div>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <div style={{ marginBottom: '24px' }}>
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate('/medical-records')}
            style={{ marginBottom: '16px' }}
          >
            Quay lại danh sách
          </Button>
          <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 600 }}>
            {isEdit ? 'Chỉnh sửa Hồ sơ Bệnh án' : 'Tạo Hồ sơ Bệnh án Mới'}
          </h2>
          <p style={{ margin: '8px 0 0 0', color: '#666' }}>
            {isEdit 
              ? `Cập nhật thông tin hồ sơ bệnh án #${id}`
              : 'Nhập thông tin hồ sơ bệnh án mới cho bệnh nhân'
            }
          </p>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          autoComplete="off"
        >
          <Row gutter={[24, 0]}>
            {/* Patient Information */}
            <Col xs={24} lg={12}>
              <Card 
                size="small" 
                title={
                  <Space>
                    <UserOutlined />
                    Thông tin Bệnh nhân
                  </Space>
                }
                style={{ height: '100%' }}
              >
                <Form.Item
                  name="customerId"
                  label="Bệnh nhân"
                  rules={[{ required: true, message: 'Vui lòng chọn bệnh nhân' }]}
                >
                  <Select
                    placeholder="Chọn bệnh nhân"
                    showSearch
                    filterOption={(input, option) =>
                      option.children.toLowerCase().includes(input.toLowerCase())
                    }
                  >
                    {customers.map(customer => (
                      <Option key={customer.id} value={customer.id}>
                        {customer.fullName} ({customer.email})
                      </Option>
                    ))}
                  </Select>
                </Form.Item>

                <Form.Item
                  name="doctorId"
                  label="Bác sĩ phụ trách"
                  rules={[{ required: true, message: 'Vui lòng chọn bác sĩ' }]}
                >
                  <Select
                    placeholder="Chọn bác sĩ"
                    showSearch
                    filterOption={(input, option) =>
                      option.children.toLowerCase().includes(input.toLowerCase())
                    }
                  >
                    {doctors.map(doctor => (
                      <Option key={doctor.id} value={doctor.id}>
                        {doctor.name} ({doctor.email})
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Card>
            </Col>

            {/* Lab Results */}
            <Col xs={24} lg={12}>
              <Card 
                size="small" 
                title={
                  <Space>
                    <HeartOutlined />
                    Kết quả Xét nghiệm
                  </Space>
                }
                style={{ height: '100%' }}
              >
                <Form.Item label="CD4 Count (cells/μL)">
                  <Form.Item
                    name="cd4Count"
                    noStyle
                    rules={[
                      { required: true, message: 'Vui lòng nhập CD4 Count' },
                      { type: 'number', min: 0, max: 2000, message: 'CD4 Count phải từ 0-2000' }
                    ]}
                  >
                    <InputNumber
                      style={{ width: '100%' }}
                      placeholder="Nhập CD4 Count"
                      min={0}
                      max={2000}
                    />
                  </Form.Item>
                  <Form.Item dependencies={['cd4Count']} noStyle>
                    {({ getFieldValue }) => {
                      const cd4Status = getCD4Status(getFieldValue('cd4Count'));
                      return cd4Status ? (
                        <Alert
                          message={cd4Status.text}
                          type={cd4Status.color}
                          showIcon
                          style={{ marginTop: '8px' }}
                        />
                      ) : null;
                    }}
                  </Form.Item>
                </Form.Item>

                <Form.Item label="Viral Load (copies/mL)">
                  <Form.Item
                    name="viralLoad"
                    noStyle
                    rules={[
                      { required: true, message: 'Vui lòng nhập Viral Load' },
                      { type: 'number', min: 0, message: 'Viral Load phải lớn hơn 0' }
                    ]}
                  >
                    <InputNumber
                      style={{ width: '100%' }}
                      placeholder="Nhập Viral Load"
                      min={0}
                    />
                  </Form.Item>
                  <Form.Item dependencies={['viralLoad']} noStyle>
                    {({ getFieldValue }) => {
                      const vlStatus = getViralLoadStatus(getFieldValue('viralLoad'));
                      return vlStatus ? (
                        <Alert
                          message={vlStatus.text}
                          type={vlStatus.color}
                          showIcon
                          style={{ marginTop: '8px' }}
                        />
                      ) : null;
                    }}
                  </Form.Item>
                </Form.Item>
              </Card>
            </Col>
          </Row>

          <Divider />

          {/* Medical Information */}
          <Row gutter={[24, 0]}>
            <Col xs={24} lg={12}>
              <Card 
                size="small" 
                title={
                  <Space>
                    <MedicineBoxOutlined />
                    Thông tin Y khoa
                  </Space>
                }
              >
                <Form.Item
                  name="diagnosis"
                  label="Chẩn đoán"
                  rules={[{ required: true, message: 'Vui lòng nhập chẩn đoán' }]}
                >
                  <TextArea
                    rows={3}
                    placeholder="Nhập chẩn đoán chi tiết..."
                  />
                </Form.Item>

                <Form.Item
                  name="symptoms"
                  label="Triệu chứng"
                >
                  <TextArea
                    rows={3}
                    placeholder="Nhập các triệu chứng quan sát được..."
                  />
                </Form.Item>
              </Card>
            </Col>

            <Col xs={24} lg={12}>
              <Card 
                size="small" 
                title={
                  <Space>
                    <FileTextOutlined />
                    Lịch sử và Ghi chú
                  </Space>
                }
              >
                <Form.Item
                  name="treatmentHistory"
                  label="Lịch sử điều trị"
                  rules={[{ required: true, message: 'Vui lòng nhập lịch sử điều trị' }]}
                >
                  <TextArea
                    rows={3}
                    placeholder="Nhập lịch sử điều trị..."
                  />
                </Form.Item>

                <Form.Item
                  name="notes"
                  label="Ghi chú thêm"
                >
                  <TextArea
                    rows={3}
                    placeholder="Nhập ghi chú thêm..."
                  />
                </Form.Item>
              </Card>
            </Col>
          </Row>

          {/* Action Buttons */}
          <div style={{ textAlign: 'right', marginTop: '32px' }}>
            <Space size="middle">
              <Button 
                size="large"
                onClick={() => navigate('/medical-records')}
              >
                Hủy
              </Button>
              <Button
                type="primary"
                size="large"
                htmlType="submit"
                loading={saving}
                icon={<SaveOutlined />}
              >
                {isEdit ? 'Cập nhật' : 'Tạo mới'}
              </Button>
            </Space>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default MedicalRecordForm;
