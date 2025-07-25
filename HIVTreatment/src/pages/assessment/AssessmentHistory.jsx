import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Table, 
  Button, 
  Tag, 
  Progress, 
  Modal, 
  Row, 
  Col, 
  Statistic,
  Empty,
  Spin,
  message,
  Tooltip,
  DatePicker
} from 'antd';
import {
  EyeOutlined,
  DeleteOutlined,
  DownloadOutlined,
  ReloadOutlined,
  LineChartOutlined,
  SafetyOutlined,
  WarningOutlined,
  MedicineBoxOutlined,
  CalendarOutlined
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuthStatus } from '../../hooks/useAuthStatus';
import { getUserAssessments, deleteAssessment } from '../../api/assessment';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

export const AssessmentHistory = () => {
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [selectedDateRange, setSelectedDateRange] = useState([]);
  const [filteredAssessments, setFilteredAssessments] = useState([]);

  const navigate = useNavigate();
  const { userInfo, isLoggedIn } = useAuthStatus();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    loadAssessments();
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    // Filter assessments by date range
    if (selectedDateRange.length === 2) {
      const [startDate, endDate] = selectedDateRange;
      const filtered = assessments.filter(assessment => {
        const assessmentDate = dayjs(assessment.createdAt);
        return assessmentDate.isAfter(startDate) && assessmentDate.isBefore(endDate.add(1, 'day'));
      });
      setFilteredAssessments(filtered);
    } else {
      setFilteredAssessments(assessments);
    }
  }, [assessments, selectedDateRange]);

  const loadAssessments = async () => {
    try {
      setLoading(true);
      const data = await getUserAssessments(userInfo?.id);
      setAssessments(data.assessments || []);
    } catch (error) {
      console.error('Error loading assessments:', error);
      message.error('Không thể tải lịch sử đánh giá');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAssessment = async (assessmentId) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: 'Bạn có chắc chắn muốn xóa kết quả đánh giá này? Hành động này không thể hoàn tác.',
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          setDeleteLoading(assessmentId);
          await deleteAssessment(assessmentId);
          message.success('Đã xóa kết quả đánh giá');
          loadAssessments(); // Reload data
        } catch (error) {
          console.error('Error deleting assessment:', error);
          message.error('Không thể xóa kết quả đánh giá');
        } finally {
          setDeleteLoading(null);
        }
      }
    });
  };

  const getRiskLevelColor = (level) => {
    switch (level?.toLowerCase()) {
      case 'low': case 'thấp': return 'green';
      case 'medium': case 'trung bình': return 'orange';
      case 'high': case 'cao': return 'red';
      default: return 'blue';
    }
  };

  const getRiskLevelIcon = (level) => {
    switch (level?.toLowerCase()) {
      case 'low': case 'thấp': return <SafetyOutlined />;
      case 'medium': case 'trung bình': return <WarningOutlined />;
      case 'high': case 'cao': return <MedicineBoxOutlined />;
      default: return <SafetyOutlined />;
    }
  };

  const getStatistics = () => {
    if (filteredAssessments.length === 0) return null;

    const riskCounts = filteredAssessments.reduce((acc, assessment) => {
      const level = assessment.riskLevel?.toLowerCase();
      acc[level] = (acc[level] || 0) + 1;
      return acc;
    }, {});

    const latestAssessment = filteredAssessments.sort((a, b) => 
      dayjs(b.createdAt).unix() - dayjs(a.createdAt).unix()
    )[0];

    const averageScore = filteredAssessments.reduce((sum, assessment) => 
      sum + (assessment.riskScore || 0), 0
    ) / filteredAssessments.length;

    return {
      total: filteredAssessments.length,
      low: riskCounts.thấp || riskCounts.low || 0,
      medium: riskCounts['trung bình'] || riskCounts.medium || 0,
      high: riskCounts.cao || riskCounts.high || 0,
      latestRisk: latestAssessment?.riskLevel,
      averageScore: Math.round(averageScore)
    };
  };

  const columns = [
    {
      title: 'Ngày đánh giá',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => dayjs(date).format('DD/MM/YYYY HH:mm'),
      sorter: (a, b) => dayjs(a.createdAt).unix() - dayjs(b.createdAt).unix(),
      defaultSortOrder: 'descend'
    },
    {
      title: 'Mức độ rủi ro',
      dataIndex: 'riskLevel',
      key: 'riskLevel',
      render: (level) => (
        <Tag 
          color={getRiskLevelColor(level)} 
          icon={getRiskLevelIcon(level)}
          className="px-3 py-1"
        >
          {level}
        </Tag>
      ),
      filters: [
        { text: 'Thấp', value: 'Thấp' },
        { text: 'Trung bình', value: 'Trung bình' },
        { text: 'Cao', value: 'Cao' },
      ],
      onFilter: (value, record) => record.riskLevel === value,
    },
    {
      title: 'Điểm số',
      dataIndex: 'riskScore',
      key: 'riskScore',
      render: (score, record) => (
        <div>
          <div className="font-semibold">{score}/{record.maxScore || 100}</div>
          <Progress 
            percent={Math.round((score / (record.maxScore || 100)) * 100)}
            size="small"
            strokeColor={getRiskLevelColor(record.riskLevel) === 'green' ? '#52c41a' : 
                        getRiskLevelColor(record.riskLevel) === 'orange' ? '#faad14' : '#ff4d4f'}
          />
        </div>
      ),
      sorter: (a, b) => a.riskScore - b.riskScore,
    },
    {
      title: 'Số câu hỏi',
      dataIndex: 'answers',
      key: 'questionCount',
      render: (answers) => Object.keys(answers || {}).length + ' câu',
    },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (_, record) => (
        <div className="space-x-2">
          <Tooltip title="Xem chi tiết">
            <Button 
              type="primary" 
              size="small" 
              icon={<EyeOutlined />}
              onClick={() => navigate(`/assessment/results/${record.id}`)}
            />
          </Tooltip>
          
          <Tooltip title="Tải xuống">
            <Button 
              size="small" 
              icon={<DownloadOutlined />}
              onClick={() => {
                // TODO: Implement download functionality
                message.info('Tính năng tải xuống sẽ được cập nhật sớm');
              }}
            />
          </Tooltip>
          
          <Tooltip title="Xóa">
            <Button 
              danger 
              size="small" 
              icon={<DeleteOutlined />}
              loading={deleteLoading === record.id}
              onClick={() => handleDeleteAssessment(record.id)}
            />
          </Tooltip>
        </div>
      ),
    },
  ];

  const statistics = getStatistics();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <Spin size="large" />
          <p className="mt-4 text-gray-600">Đang tải lịch sử đánh giá...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Lịch Sử Đánh Giá Rủi Ro
          </h1>
          <p className="text-gray-600">
            Theo dõi tiến trình và kết quả các lần đánh giá của bạn
          </p>
        </motion.div>

        {/* Statistics Cards */}
        {statistics && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} lg={6}>
                <Card className="text-center">
                  <Statistic
                    title="Tổng số đánh giá"
                    value={statistics.total}
                    prefix={<LineChartOutlined />}
                    valueStyle={{ color: '#1890ff' }}
                  />
                </Card>
              </Col>
              
              <Col xs={24} sm={12} lg={6}>
                <Card className="text-center">
                  <Statistic
                    title="Rủi ro thấp"
                    value={statistics.low}
                    prefix={<SafetyOutlined />}
                    valueStyle={{ color: '#52c41a' }}
                  />
                </Card>
              </Col>
              
              <Col xs={24} sm={12} lg={6}>
                <Card className="text-center">
                  <Statistic
                    title="Rủi ro trung bình"
                    value={statistics.medium}
                    prefix={<WarningOutlined />}
                    valueStyle={{ color: '#faad14' }}
                  />
                </Card>
              </Col>
              
              <Col xs={24} sm={12} lg={6}>
                <Card className="text-center">
                  <Statistic
                    title="Rủi ro cao"
                    value={statistics.high}
                    prefix={<MedicineBoxOutlined />}
                    valueStyle={{ color: '#ff4d4f' }}
                  />
                </Card>
              </Col>
            </Row>
          </motion.div>
        )}

        {/* Filters and Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <Card>
            <Row gutter={[16, 16]} align="middle">
              <Col xs={24} sm={12} lg={8}>
                <div className="flex items-center space-x-2">
                  <CalendarOutlined />
                  <span>Lọc theo thời gian:</span>
                  <RangePicker
                    value={selectedDateRange}
                    onChange={setSelectedDateRange}
                    format="DD/MM/YYYY"
                    placeholder={['Từ ngày', 'Đến ngày']}
                  />
                </div>
              </Col>
              
              <Col xs={24} sm={12} lg={8}>
                <Button 
                  icon={<ReloadOutlined />} 
                  onClick={loadAssessments}
                  loading={loading}
                >
                  Làm mới
                </Button>
              </Col>
              
              <Col xs={24} lg={8} className="text-right">
                <Button 
                  type="primary" 
                  size="large"
                  onClick={() => navigate('/assessment/risk-assessment')}
                >
                  Thực hiện đánh giá mới
                </Button>
              </Col>
            </Row>
          </Card>
        </motion.div>

        {/* Assessment Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="shadow-lg">
            {filteredAssessments.length === 0 ? (
              <Empty
                description="Chưa có kết quả đánh giá nào"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              >
                <Button 
                  type="primary" 
                  onClick={() => navigate('/assessment/risk-assessment')}
                >
                  Thực hiện đánh giá đầu tiên
                </Button>
              </Empty>
            ) : (
              <Table
                columns={columns}
                dataSource={filteredAssessments}
                rowKey="id"
                pagination={{
                  pageSize: 10,
                  showSizeChanger: true,
                  showQuickJumper: true,
                  showTotal: (total, range) => 
                    `${range[0]}-${range[1]} của ${total} kết quả`,
                }}
                scroll={{ x: 800 }}
              />
            )}
          </Card>
        </motion.div>

        {/* Latest Assessment Alert */}
        {statistics && statistics.latestRisk === 'Cao' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-6"
          >
            <Card>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <MedicineBoxOutlined className="text-red-600 text-xl" />
                  <div className="flex-1">
                    <h4 className="text-red-800 font-semibold">Cảnh báo quan trọng</h4>
                    <p className="text-red-700">
                      Kết quả đánh giá gần nhất cho thấy mức độ rủi ro cao. 
                      Chúng tôi khuyến nghị bạn nên đặt lịch tư vấn với bác sĩ chuyên khoa.
                    </p>
                  </div>
                  <Button 
                    type="primary" 
                    danger
                    onClick={() => navigate('/consultation-booking')}
                  >
                    Đặt lịch tư vấn ngay
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AssessmentHistory;
