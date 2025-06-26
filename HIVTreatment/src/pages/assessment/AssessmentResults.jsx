import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Button, 
  Progress, 
  Alert, 
  Row, 
  Col, 
  Timeline,
  Tag,
  Statistic,
  Divider,
  Empty,
  Spin
} from 'antd';
import {
  SafetyOutlined,
  WarningOutlined,
  MedicineBoxOutlined,
  HeartOutlined,
  CalendarOutlined,
  FileTextOutlined,
  UserOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuthStatus } from '../../hooks/useAuthStatus';
import { getAssessmentById } from '../../api/assessment';
import dayjs from 'dayjs';

export const AssessmentResults = () => {
  const [assessment, setAssessment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { assessmentId } = useParams();
  const navigate = useNavigate();
  const { userInfo, isLoggedIn } = useAuthStatus();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    const loadAssessment = async () => {
      try {
        setLoading(true);
        const data = await getAssessmentById(assessmentId);
        setAssessment(data);
      } catch (error) {
        console.error('Error loading assessment:', error);
        setError('Không thể tải kết quả đánh giá');
      } finally {
        setLoading(false);
      }
    };

    if (assessmentId) {
      loadAssessment();
    }
  }, [assessmentId, isLoggedIn, navigate]);

  const getRiskLevelColor = (level) => {
    switch (level?.toLowerCase()) {
      case 'low': case 'thấp': return '#52c41a';
      case 'medium': case 'trung bình': return '#faad14';
      case 'high': case 'cao': return '#ff4d4f';
      default: return '#1890ff';
    }
  };

  const getRiskLevelIcon = (level) => {
    switch (level?.toLowerCase()) {
      case 'low': case 'thấp': return <SafetyOutlined />;
      case 'medium': case 'trung bình': return <WarningOutlined />;
      case 'high': case 'cao': return <MedicineBoxOutlined />;
      default: return <HeartOutlined />;
    }
  };

  const getRiskDescription = (level) => {
    switch (level?.toLowerCase()) {
      case 'low': case 'thấp': 
        return 'Mức độ rủi ro thấp. Bạn đang có lối sống tương đối an toàn.';
      case 'medium': case 'trung bình':
        return 'Mức độ rủi ro trung bình. Cần chú ý và cải thiện một số thói quen.';
      case 'high': case 'cao':
        return 'Mức độ rủi ro cao. Cần được tư vấn và hỗ trợ chuyên môn ngay lập tức.';
      default:
        return 'Kết quả đánh giá đã được phân tích.';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <Spin size="large" />
          <p className="mt-4 text-gray-600">Đang tải kết quả đánh giá...</p>
        </div>
      </div>
    );
  }

  if (error || !assessment) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="max-w-md">
          <Empty
            description={error || 'Không tìm thấy kết quả đánh giá'}
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          >
            <Button type="primary" onClick={() => navigate('/user/assessment-history')}>
              Về lịch sử đánh giá
            </Button>
          </Empty>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Kết Quả Đánh Giá Rủi Ro
          </h1>
          <p className="text-gray-600">
            Ngày đánh giá: {dayjs(assessment.createdAt).format('DD/MM/YYYY HH:mm')}
          </p>
        </motion.div>

        <Row gutter={[24, 24]}>
          {/* Risk Level Card */}
          <Col xs={24} lg={12}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="h-full shadow-lg">
                <div className="text-center">
                  <div className="text-8xl mb-4" style={{ color: getRiskLevelColor(assessment.riskLevel) }}>
                    {getRiskLevelIcon(assessment.riskLevel)}
                  </div>
                  <h2 className="text-2xl font-bold mb-2" style={{ color: getRiskLevelColor(assessment.riskLevel) }}>
                    Mức độ rủi ro: {assessment.riskLevel}
                  </h2>
                  <p className="text-gray-600 mb-4">
                    {getRiskDescription(assessment.riskLevel)}
                  </p>
                  
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <Statistic
                      title="Điểm số đánh giá"
                      value={assessment.riskScore}
                      suffix={`/ ${assessment.maxScore || 100}`}
                      valueStyle={{ color: getRiskLevelColor(assessment.riskLevel) }}
                    />
                    <Progress
                      percent={Math.round((assessment.riskScore / (assessment.maxScore || 100)) * 100)}
                      strokeColor={getRiskLevelColor(assessment.riskLevel)}
                      className="mt-2"
                    />
                  </div>

                  <Tag 
                    color={assessment.riskLevel === 'Cao' ? 'red' : assessment.riskLevel === 'Trung bình' ? 'orange' : 'green'}
                    className="px-4 py-2 text-lg"
                  >
                    {assessment.riskLevel === 'Cao' && 'Cần tư vấn ngay'}
                    {assessment.riskLevel === 'Trung bình' && 'Cần chú ý'}
                    {assessment.riskLevel === 'Thấp' && 'An toàn'}
                  </Tag>
                </div>
              </Card>
            </motion.div>
          </Col>

          {/* Recommendations Card */}
          <Col xs={24} lg={12}>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card title="Khuyến nghị" className="h-full shadow-lg">
                <div className="space-y-4">
                  {assessment.recommendations?.map((recommendation, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <CheckCircleOutlined className="text-green-600 mt-1 text-lg" />
                      <p className="text-gray-700">{recommendation}</p>
                    </div>
                  ))}
                </div>

                <Divider />

                <Alert
                  message="Lưu ý quan trọng"
                  description="Kết quả này chỉ mang tính chất tham khảo. Hãy tham khảo ý kiến bác sĩ chuyên khoa để có lời khuyên chính xác và kế hoạch phòng ngừa phù hợp."
                  type="info"
                  showIcon
                  icon={<ExclamationCircleOutlined />}
                />
              </Card>
            </motion.div>
          </Col>
        </Row>

        {/* Assessment Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8"
        >
          <Card title="Chi tiết đánh giá" className="shadow-lg">
            <Row gutter={[24, 24]}>
              <Col xs={24} md={12}>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <UserOutlined className="text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-500">Người thực hiện</p>
                      <p className="font-medium">{userInfo?.fullName || 'Người dùng'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <CalendarOutlined className="text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-500">Thời gian</p>
                      <p className="font-medium">{dayjs(assessment.createdAt).format('DD/MM/YYYY HH:mm')}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <FileTextOutlined className="text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-500">Số câu hỏi</p>
                      <p className="font-medium">{Object.keys(assessment.answers || {}).length} câu</p>
                    </div>
                  </div>
                </div>
              </Col>

              <Col xs={24} md={12}>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold mb-3">Phân tích theo danh mục</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Rủi ro từ kim tiêm</span>
                      <Tag color="blue">Đã đánh giá</Tag>
                    </div>
                    <div className="flex justify-between">
                      <span>Rủi ro tình dục</span>
                      <Tag color="blue">Đã đánh giá</Tag>
                    </div>
                    <div className="flex justify-between">
                      <span>Sử dụng chất kích thích</span>
                      <Tag color="blue">Đã đánh giá</Tag>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </Card>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 text-center space-x-4"
        >
          <Button size="large" onClick={() => navigate('/user/assessment-history')}>
            Xem lịch sử đánh giá
          </Button>
          
          <Button 
            type="primary" 
            size="large" 
            onClick={() => navigate('/assessment/risk-assessment')}
          >
            Thực hiện đánh giá mới
          </Button>
          
          {assessment.riskLevel === 'Cao' && (
            <Button 
              type="primary" 
              danger 
              size="large" 
              onClick={() => navigate('/consultation-booking')}
            >
              Đặt lịch tư vấn ngay
            </Button>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default AssessmentResults;
