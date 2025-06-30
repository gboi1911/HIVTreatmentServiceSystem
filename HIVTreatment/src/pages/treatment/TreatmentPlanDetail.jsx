import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Descriptions, 
  Button, 
  Space, 
  Tag, 
  Spin, 
  Row, 
  Col, 
  message,
  Popconfirm,
  Timeline,
  Alert,
  Divider,
  List,
  Badge
} from 'antd';
import { 
  EditOutlined, 
  DeleteOutlined, 
  ArrowLeftOutlined,
  MedicineBoxOutlined,
  UserOutlined,
  CalendarOutlined,
  FileTextOutlined,
  HistoryOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  PauseCircleOutlined,
  StopOutlined
} from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  getTreatmentPlanById, 
  deleteTreatmentPlan,
  getTreatmentPlanStatuses
} from '../../api/treatmentPlan';
import { getMedicalRecordById } from '../../api/medicalRecord';
import { formatDate } from '../../utils/formatDate';

const TreatmentPlanDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [loading, setLoading] = useState(true);
  const [plan, setPlan] = useState(null);
  const [medicalRecord, setMedicalRecord] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    loadTreatmentPlan();
  }, [id]);

  const loadTreatmentPlan = async () => {
    setLoading(true);
    try {
      const planData = await getTreatmentPlanById(id);
      if (planData) {
        setPlan(planData);
        
        // Load related medical record
        if (planData.medicalRecordId) {
          const medicalRecordData = await getMedicalRecordById(planData.medicalRecordId);
          setMedicalRecord(medicalRecordData);
        }
      } else {
        message.error('Không tìm thấy kế hoạch điều trị.');
        navigate('/treatment-plans');
      }
    } catch (error) {
      console.error('Error loading treatment plan:', error);
      message.error('Không thể tải thông tin kế hoạch điều trị.');
      navigate('/treatment-plans');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    navigate(`/treatment-plans/edit/${id}`);
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await deleteTreatmentPlan(id);
      message.success('Xóa kế hoạch điều trị thành công!');
      navigate('/treatment-plans');
    } catch (error) {
      console.error('Error deleting treatment plan:', error);
      message.error('Xóa kế hoạch điều trị thất bại!');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/treatment-plans');
  };

  const getStatusConfig = (status) => {
    const configs = {
      'ACTIVE': { 
        color: 'green', 
        icon: <CheckCircleOutlined />, 
        text: 'Đang hoạt động' 
      },
      'PAUSED': { 
        color: 'orange', 
        icon: <PauseCircleOutlined />, 
        text: 'Tạm dừng' 
      },
      'COMPLETED': { 
        color: 'blue', 
        icon: <CheckCircleOutlined />, 
        text: 'Hoàn thành' 
      },
      'CANCELLED': { 
        color: 'red', 
        icon: <StopOutlined />, 
        text: 'Hủy bỏ' 
      }
    };
    return configs[status] || { color: 'default', icon: <ClockCircleOutlined />, text: status };
  };

  const getDurationInfo = () => {
    if (!plan.startDate) return null;
    
    const startDate = new Date(plan.startDate);
    const endDate = plan.endDate ? new Date(plan.endDate) : new Date();
    const diffTime = Math.abs(endDate - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return {
      days: diffDays,
      weeks: Math.floor(diffDays / 7),
      months: Math.floor(diffDays / 30)
    };
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
        <p style={{ marginTop: '16px' }}>Đang tải thông tin kế hoạch điều trị...</p>
      </div>
    );
  }

  if (!plan) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <p>Không tìm thấy kế hoạch điều trị.</p>
        <Button onClick={handleBack}>Quay lại</Button>
      </div>
    );
  }

  const statusConfig = getStatusConfig(plan.status);
  const duration = getDurationInfo();

  return (
    <div style={{ padding: '24px' }}>
      <Card
        title={
          <Space>
            <MedicineBoxOutlined />
            Chi tiết kế hoạch điều trị #{plan.planId}
            <Tag icon={statusConfig.icon} color={statusConfig.color}>
              {statusConfig.text}
            </Tag>
          </Space>
        }
        extra={
          <Space>
            <Button onClick={handleBack}>
              <ArrowLeftOutlined /> Quay lại
            </Button>
            <Button type="primary" onClick={handleEdit}>
              <EditOutlined /> Chỉnh sửa
            </Button>
            <Popconfirm
              title="Xóa kế hoạch điều trị"
              description="Bạn có chắc chắn muốn xóa kế hoạch điều trị này?"
              onConfirm={handleDelete}
              okText="Xóa"
              cancelText="Hủy"
              okButtonProps={{ danger: true }}
            >
              <Button danger loading={deleteLoading}>
                <DeleteOutlined /> Xóa
              </Button>
            </Popconfirm>
          </Space>
        }
      >
        <Row gutter={24}>
          <Col xs={24} lg={12}>
            <Card 
              title={<><UserOutlined /> Thông tin bệnh nhân</>} 
              size="small"
              style={{ marginBottom: '16px' }}
            >
              <Descriptions column={1} bordered size="small">
                <Descriptions.Item label="Tên bệnh nhân">
                  {plan.patientName || 'N/A'}
                </Descriptions.Item>
                <Descriptions.Item label="Mã hồ sơ bệnh án">
                  #{plan.medicalRecordId}
                </Descriptions.Item>
                {medicalRecord && (
                  <>
                    <Descriptions.Item label="Ngày tạo hồ sơ">
                      {formatDate(medicalRecord.createdAt)}
                    </Descriptions.Item>
                    <Descriptions.Item label="Trạng thái hồ sơ">
                      <Tag color={medicalRecord.status === 'ACTIVE' ? 'green' : 'orange'}>
                        {medicalRecord.status}
                      </Tag>
                    </Descriptions.Item>
                  </>
                )}
              </Descriptions>
            </Card>

            <Card 
              title={<><UserOutlined /> Bác sĩ phụ trách</>} 
              size="small"
              style={{ marginBottom: '16px' }}
            >
              <Descriptions column={1} bordered size="small">
                <Descriptions.Item label="Tên bác sĩ">
                  {plan.doctorName || 'N/A'}
                </Descriptions.Item>
                <Descriptions.Item label="Mã bác sĩ">
                  #{plan.doctorId}
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </Col>

          <Col xs={24} lg={12}>
            <Card 
              title={<><MedicineBoxOutlined /> Thông tin điều trị</>} 
              size="small"
              style={{ marginBottom: '16px' }}
            >
              <Descriptions column={1} bordered size="small">
                <Descriptions.Item label="Phác đồ ARV">
                  <Tag color="blue">{plan.arvRegimen}</Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Nhóm áp dụng">
                  {plan.applicableGroup}
                </Descriptions.Item>
                <Descriptions.Item label="Trạng thái">
                  <Tag icon={statusConfig.icon} color={statusConfig.color}>
                    {statusConfig.text}
                  </Tag>
                </Descriptions.Item>
              </Descriptions>
            </Card>

            <Card 
              title={<><CalendarOutlined /> Thời gian điều trị</>} 
              size="small"
              style={{ marginBottom: '16px' }}
            >
              <Descriptions column={1} bordered size="small">
                <Descriptions.Item label="Ngày bắt đầu">
                  {formatDate(plan.startDate)}
                </Descriptions.Item>
                <Descriptions.Item label="Ngày kết thúc">
                  {plan.endDate ? formatDate(plan.endDate) : 'Chưa xác định'}
                </Descriptions.Item>
                {duration && (
                  <Descriptions.Item label="Thời gian điều trị">
                    <Space direction="vertical" size="small">
                      <Badge count={duration.days} color="blue" text="ngày" />
                      <Badge count={duration.weeks} color="green" text="tuần" />
                      <Badge count={duration.months} color="orange" text="tháng" />
                    </Space>
                  </Descriptions.Item>
                )}
              </Descriptions>
            </Card>
          </Col>
        </Row>

        {plan.note && (
          <Card 
            title={<><FileTextOutlined /> Ghi chú</>} 
            size="small"
            style={{ marginBottom: '16px' }}
          >
            <p style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
              {plan.note}
            </p>
          </Card>
        )}

        <Card 
          title={<><HistoryOutlined /> Lịch sử hoạt động</>} 
          size="small"
        >
          <Timeline
            items={[
              {
                color: 'green',
                children: (
                  <div>
                    <p><strong>Tạo kế hoạch điều trị</strong></p>
                    <p style={{ color: '#666' }}>{formatDate(plan.createdAt)}</p>
                  </div>
                ),
              },
              ...(plan.updatedAt !== plan.createdAt ? [{
                color: 'blue',
                children: (
                  <div>
                    <p><strong>Cập nhật lần cuối</strong></p>
                    <p style={{ color: '#666' }}>{formatDate(plan.updatedAt)}</p>
                  </div>
                ),
              }] : []),
              ...(plan.status === 'COMPLETED' ? [{
                color: 'purple',
                children: (
                  <div>
                    <p><strong>Hoàn thành điều trị</strong></p>
                    <p style={{ color: '#666' }}>
                      {plan.endDate ? formatDate(plan.endDate) : 'Ngày hoàn thành không xác định'}
                    </p>
                  </div>
                ),
              }] : [])
            ]}
          />
        </Card>

        {/* Treatment Progress Section */}
        {plan.status === 'ACTIVE' && (
          <Card 
            title="Tiến độ điều trị" 
            size="small"
            style={{ marginTop: '16px' }}
          >
            <Alert
              type="info"
              showIcon
              message="Kế hoạch điều trị đang hoạt động"
              description="Bệnh nhân đang trong quá trình điều trị theo phác đồ ARV đã định. Theo dõi định kỳ và điều chỉnh khi cần thiết."
            />
          </Card>
        )}

        {plan.status === 'PAUSED' && (
          <Card 
            title="Thông báo" 
            size="small"
            style={{ marginTop: '16px' }}
          >
            <Alert
              type="warning"
              showIcon
              message="Kế hoạch điều trị đang tạm dừng"
              description="Kế hoạch điều trị hiện tại đang được tạm dừng. Vui lòng liên hệ bác sĩ để biết thêm thông tin."
            />
          </Card>
        )}

        {plan.status === 'COMPLETED' && (
          <Card 
            title="Thông báo" 
            size="small"
            style={{ marginTop: '16px' }}
          >
            <Alert
              type="success"
              showIcon
              message="Kế hoạch điều trị đã hoàn thành"
              description="Bệnh nhân đã hoàn thành kế hoạch điều trị theo phác đồ đã định."
            />
          </Card>
        )}
      </Card>
    </div>
  );
};

export default TreatmentPlanDetail;
