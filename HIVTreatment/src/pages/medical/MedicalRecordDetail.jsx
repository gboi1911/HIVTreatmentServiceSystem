import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Descriptions, 
  Button, 
  Space, 
  Tag, 
  Alert, 
  Row, 
  Col, 
  Spin,
  Statistic,
  Timeline,
  Divider,
  message
} from 'antd';
import { 
  ArrowLeftOutlined, 
  EditOutlined, 
  PrinterOutlined,
  UserOutlined,
  MedicineBoxOutlined,
  HeartOutlined,
  FileTextOutlined,
  CalendarOutlined,
  DoctorOutlined
} from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { getMedicalRecords } from '../../api/medicalRecord';
import { formatDate } from '../../utils/formatDate';

const MedicalRecordDetail = () => {
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    loadRecordDetail();
  }, [id]);

  const loadRecordDetail = async () => {
    setLoading(true);
    try {
      // Load all records and find the one with matching ID
      const records = await getMedicalRecords();
      const recordData = Array.isArray(records) ? records.find(r => r.id === parseInt(id)) : null;
      
      if (recordData) {
        setRecord(recordData);
      } else {
        message.error('Không tìm thấy hồ sơ bệnh án');
        navigate('/medical-records');
      }
    } catch (error) {
      console.error('Error loading record detail:', error);
      message.error('Không thể tải thông tin hồ sơ bệnh án');
      navigate('/medical-records');
    } finally {
      setLoading(false);
    }
  };

  const getStatusInfo = (cd4Count, viralLoad) => {
    if (cd4Count < 200) {
      return { 
        status: 'Nguy hiểm', 
        color: 'red', 
        description: 'Cần can thiệp y tế ngay lập tức' 
      };
    } else if (cd4Count < 350) {
      return { 
        status: 'Cần theo dõi', 
        color: 'orange', 
        description: 'Theo dõi chặt chẽ và tăng cường điều trị' 
      };
    } else if (viralLoad < 50) {
      return { 
        status: 'Ổn định', 
        color: 'green', 
        description: 'Tình trạng tốt, duy trì điều trị hiện tại' 
      };
    } else {
      return { 
        status: 'Bình thường', 
        color: 'blue', 
        description: 'Tình trạng ổn định' 
      };
    }
  };

  const getCD4Interpretation = (cd4Count) => {
    if (cd4Count >= 500) return { text: 'Bình thường', type: 'success' };
    if (cd4Count >= 350) return { text: 'Bình thường thấp', type: 'info' };
    if (cd4Count >= 200) return { text: 'Thấp - Cần theo dõi', type: 'warning' };
    return { text: 'Rất thấp - Nguy hiểm', type: 'error' };
  };

  const getViralLoadInterpretation = (viralLoad) => {
    if (viralLoad < 50) return { text: 'Không phát hiện', type: 'success' };
    if (viralLoad < 1000) return { text: 'Thấp', type: 'info' };
    if (viralLoad < 10000) return { text: 'Trung bình', type: 'warning' };
    return { text: 'Cao', type: 'error' };
  };

  if (loading) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <Spin size="large" />
        <div style={{ marginTop: '16px' }}>Đang tải thông tin hồ sơ...</div>
      </div>
    );
  }

  if (!record) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <Alert
          message="Không tìm thấy hồ sơ bệnh án"
          description="Hồ sơ bệnh án không tồn tại hoặc đã bị xóa."
          type="warning"
          showIcon
        />
        <Button 
          style={{ marginTop: '16px' }}
          onClick={() => navigate('/medical-records')}
        >
          Quay lại danh sách
        </Button>
      </div>
    );
  }

  const statusInfo = getStatusInfo(record.cd4Count, record.viralLoad);
  const cd4Info = getCD4Interpretation(record.cd4Count);
  const vlInfo = getViralLoadInterpretation(record.viralLoad);

  return (
    <div style={{ padding: '24px' }}>
      {/* Header */}
      <Card style={{ marginBottom: '24px' }}>
        <div style={{ marginBottom: '16px' }}>
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate('/medical-records')}
            style={{ marginBottom: '16px' }}
          >
            Quay lại danh sách
          </Button>
          
          <Row justify="space-between" align="middle">
            <Col>
              <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 600 }}>
                Hồ sơ Bệnh án #{record.id}
              </h2>
              <p style={{ margin: '8px 0 0 0', color: '#666' }}>
                Chi tiết thông tin hồ sơ bệnh án
              </p>
            </Col>
            <Col>
              <Space>
                <Button
                  icon={<PrinterOutlined />}
                  onClick={() => window.print()}
                >
                  In hồ sơ
                </Button>
                <Button
                  type="primary"
                  icon={<EditOutlined />}
                  onClick={() => navigate(`/medical-records/edit/${record.id}`)}
                >
                  Chỉnh sửa
                </Button>
              </Space>
            </Col>
          </Row>
        </div>

        {/* Status Alert */}
        <Alert
          message={`Trạng thái: ${statusInfo.status}`}
          description={statusInfo.description}
          type={statusInfo.color === 'red' ? 'error' : statusInfo.color === 'orange' ? 'warning' : statusInfo.color === 'green' ? 'success' : 'info'}
          showIcon
          style={{ marginBottom: '16px' }}
        />
      </Card>

      {/* Main Content */}
      <Row gutter={[24, 24]}>
        {/* Patient Information */}
        <Col xs={24} lg={12}>
          <Card 
            title={
              <Space>
                <UserOutlined />
                Thông tin Bệnh nhân
              </Space>
            }
            style={{ height: '100%' }}
          >
            <Descriptions column={1} size="small">
              <Descriptions.Item label="Tên bệnh nhân">
                <strong>{record.customerName}</strong>
              </Descriptions.Item>
              <Descriptions.Item label="Mã bệnh nhân">
                #{record.customerId}
              </Descriptions.Item>
              <Descriptions.Item label="Bác sĩ phụ trách">
                <Space>
                  <DoctorOutlined />
                  <strong>{record.doctorName}</strong>
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="Mã bác sĩ">
                #{record.doctorId}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>

        {/* Lab Results */}
        <Col xs={24} lg={12}>
          <Card 
            title={
              <Space>
                <HeartOutlined />
                Kết quả Xét nghiệm
              </Space>
            }
            style={{ height: '100%' }}
          >
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Statistic
                  title="CD4 Count"
                  value={record.cd4Count}
                  suffix="cells/μL"
                  valueStyle={{ 
                    color: cd4Info.type === 'success' ? '#52c41a' : 
                           cd4Info.type === 'warning' ? '#faad14' : 
                           cd4Info.type === 'error' ? '#ff4d4f' : '#1890ff'
                  }}
                />
                <Tag color={cd4Info.type === 'success' ? 'green' : cd4Info.type === 'warning' ? 'orange' : cd4Info.type === 'error' ? 'red' : 'blue'}>
                  {cd4Info.text}
                </Tag>
              </Col>
              <Col span={12}>
                <Statistic
                  title="Viral Load"
                  value={record.viralLoad}
                  suffix="copies/mL"
                  valueStyle={{ 
                    color: vlInfo.type === 'success' ? '#52c41a' : 
                           vlInfo.type === 'warning' ? '#faad14' : 
                           vlInfo.type === 'error' ? '#ff4d4f' : '#1890ff'
                  }}
                />
                <Tag color={vlInfo.type === 'success' ? 'green' : vlInfo.type === 'warning' ? 'orange' : vlInfo.type === 'error' ? 'red' : 'blue'}>
                  {vlInfo.text}
                </Tag>
              </Col>
            </Row>
          </Card>
        </Col>

        {/* Medical Information */}
        <Col xs={24} lg={12}>
          <Card 
            title={
              <Space>
                <MedicineBoxOutlined />
                Thông tin Y khoa
              </Space>
            }
            style={{ height: '100%' }}
          >
            <Descriptions column={1} size="small">
              <Descriptions.Item label="Chẩn đoán">
                <div style={{ whiteSpace: 'pre-wrap' }}>
                  {record.diagnosis || 'Chưa có thông tin'}
                </div>
              </Descriptions.Item>
              <Descriptions.Item label="Triệu chứng">
                <div style={{ whiteSpace: 'pre-wrap' }}>
                  {record.symptoms || 'Chưa có thông tin'}
                </div>
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>

        {/* Treatment History & Notes */}
        <Col xs={24} lg={12}>
          <Card 
            title={
              <Space>
                <FileTextOutlined />
                Lịch sử & Ghi chú
              </Space>
            }
            style={{ height: '100%' }}
          >
            <Descriptions column={1} size="small">
              <Descriptions.Item label="Lịch sử điều trị">
                <div style={{ whiteSpace: 'pre-wrap' }}>
                  {record.treatmentHistory || 'Chưa có thông tin'}
                </div>
              </Descriptions.Item>
              <Descriptions.Item label="Ghi chú">
                <div style={{ whiteSpace: 'pre-wrap' }}>
                  {record.notes || 'Chưa có ghi chú'}
                </div>
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>

        {/* Timeline */}
        <Col xs={24}>
          <Card 
            title={
              <Space>
                <CalendarOutlined />
                Lịch sử cập nhật
              </Space>
            }
          >
            <Timeline
              items={[
                {
                  color: 'blue',
                  children: (
                    <div>
                      <p><strong>Tạo hồ sơ</strong></p>
                      <p style={{ color: '#666', margin: 0 }}>
                        {formatDate(record.createdAt)}
                      </p>
                    </div>
                  ),
                },
                ...(record.updatedAt && record.updatedAt !== record.createdAt ? [{
                  color: 'green',
                  children: (
                    <div>
                      <p><strong>Cập nhật lần cuối</strong></p>
                      <p style={{ color: '#666', margin: 0 }}>
                        {formatDate(record.updatedAt)}
                      </p>
                    </div>
                  ),
                }] : [])
              ]}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default MedicalRecordDetail;
