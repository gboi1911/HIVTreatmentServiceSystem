import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Button, 
  Steps, 
  Radio, 
  Checkbox, 
  Select, 
  Progress, 
  message, 
  Modal,
  Row,
  Col,
  Alert,
  Spin
} from 'antd';
import {
  QuestionCircleOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  SafetyOutlined,
  MedicineBoxOutlined,
  HeartOutlined
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuthStatus } from '../../hooks/useAuthStatus';
import { getAssessmentQuestions, submitAssessment, calculateRiskScore } from '../../api/assessment';

const { Step } = Steps;
const { Option } = Select;

export const RiskAssessment = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [assessmentResult, setAssessmentResult] = useState(null);
  const [showResultModal, setShowResultModal] = useState(false);

  const navigate = useNavigate();
  const { userInfo, isLoggedIn } = useAuthStatus();

  // Load assessment questions
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        setLoading(true);
        const data = await getAssessmentQuestions('hiv_risk');
        setQuestions(data.questions || []);
      } catch (error) {
        console.error('Error loading questions:', error);
        message.error('Không thể tải câu hỏi đánh giá');
      } finally {
        setLoading(false);
      }
    };

    loadQuestions();
  }, []);

  // Check if user is logged in
  useEffect(() => {
    if (!isLoggedIn) {
      Modal.warning({
        title: 'Yêu cầu đăng nhập',
        content: 'Bạn cần đăng nhập để thực hiện đánh giá rủi ro.',
        onOk: () => navigate('/login')
      });
    }
  }, [isLoggedIn, navigate]);

  const handleAnswerChange = (questionId, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const nextStep = () => {
    // Remove the validation that requires an answer
    // const currentQuestion = questions[currentStep];
    // if (!answers[currentQuestion.id]) {
    //   message.warning('Vui lòng trả lời câu hỏi hiện tại');
    //   return;
    // }
    
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowConfirmModal(true);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const submitAssessmentData = async () => {
    try {
      setSubmitting(true);
      setShowConfirmModal(false);

      // Calculate risk score
      const riskResult = await calculateRiskScore(answers);
      
      // Submit assessment
      const assessmentData = {
        userId: userInfo?.id,
        answers: answers,
        riskScore: riskResult.score,
        riskLevel: riskResult.level,
        recommendations: riskResult.recommendations
      };

      const result = await submitAssessment(assessmentData);
      
      setAssessmentResult({
        ...riskResult,
        assessmentId: result.id
      });
      
      setShowResultModal(true);
      message.success('Đánh giá đã được lưu thành công!');
      
    } catch (error) {
      console.error('Error submitting assessment:', error);
      message.error('Có lỗi xảy ra khi lưu đánh giá');
    } finally {
      setSubmitting(false);
    }
  };

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
      case 'low': case 'thấp': return <SafetyOutlined style={{ color: '#52c41a' }} />;
      case 'medium': case 'trung bình': return <WarningOutlined style={{ color: '#faad14' }} />;
      case 'high': case 'cao': return <MedicineBoxOutlined style={{ color: '#ff4d4f' }} />;
      default: return <HeartOutlined style={{ color: '#1890ff' }} />;
    }
  };

  const renderQuestion = (question) => {
    const answer = answers[question.id];

    switch (question.type) {
      case 'boolean':
        return (
          <Radio.Group 
            value={answer} 
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            className="w-full"
          >
            <div className="space-y-3">
              <Radio value={true} className="text-lg">Có</Radio>
              <Radio value={false} className="text-lg">Không</Radio>
            </div>
          </Radio.Group>
        );

      case 'multiple_choice':
        return (
          <Radio.Group 
            value={answer} 
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            className="w-full"
          >
            <div className="space-y-3">
              {question.options?.map((option, index) => (
                <Radio key={index} value={option.value} className="text-lg">
                  {option.label}
                </Radio>
              ))}
            </div>
          </Radio.Group>
        );

      case 'select':
        return (
          <Select
            value={answer}
            onChange={(value) => handleAnswerChange(question.id, value)}
            placeholder="Chọn câu trả lời"
            className="w-full"
            size="large"
          >
            {question.options?.map((option, index) => (
              <Option key={index} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        );

      default:
        return (
          <Radio.Group 
            value={answer} 
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
          >
            <Radio value={true}>Có</Radio>
            <Radio value={false}>Không</Radio>
          </Radio.Group>
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <Spin size="large" />
          <p className="mt-4 text-gray-600">Đang tải bộ câu hỏi đánh giá...</p>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="max-w-md">
          <div className="text-center">
            <QuestionCircleOutlined className="text-4xl text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Yêu cầu đăng nhập</h3>
            <p className="text-gray-600 mb-4">Bạn cần đăng nhập để thực hiện đánh giá rủi ro.</p>
            <Button type="primary" onClick={() => navigate('/login')}>
              Đăng nhập ngay
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Đánh Giá Mức Độ Rủi Ro HIV
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Hãy trả lời thành thật các câu hỏi dưới đây để chúng tôi có thể đánh giá mức độ rủi ro 
            và đưa ra những khuyến nghị phù hợp nhất cho bạn.
          </p>
        </motion.div>

        {/* Progress */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <Progress 
            percent={Math.round(((currentStep + 1) / questions.length) * 100)}
            strokeColor={{
              '0%': '#108ee9',
              '100%': '#87d068',
            }}
            className="mb-4"
          />
          <div className="text-center text-gray-600">
            Câu hỏi {currentStep + 1} / {questions.length}
          </div>
        </motion.div>

        {/* Question Card */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="shadow-lg">
            {questions[currentStep] && (
              <div className="p-6">
                <div className="flex items-start space-x-4 mb-6">
                  <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold">{currentStep + 1}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">
                      {questions[currentStep].question}
                    </h3>
                    <div className="space-y-4">
                      {renderQuestion(questions[currentStep])}
                    </div>
                  </div>
                </div>

                {/* Category Badge */}
                <div className="mb-6">
                  <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                    {questions[currentStep].category === 'injection_risk' && 'Rủi ro từ kim tiêm'}
                    {questions[currentStep].category === 'sexual_risk' && 'Rủi ro tình dục'}
                    {questions[currentStep].category === 'substance_use' && 'Sử dụng chất kích thích'}
                    {questions[currentStep].category === 'general_health' && 'Sức khỏe tổng quát'}
                  </span>
                </div>

                {/* Navigation Buttons */}
                <div className="flex justify-between">
                  <Button 
                    onClick={prevStep} 
                    disabled={currentStep === 0}
                    size="large"
                  >
                    Câu trước
                  </Button>
                  
                  <Button 
                    type="primary" 
                    onClick={nextStep}
                    // Remove the disabled condition
                    // disabled={!answers[questions[currentStep].id]}
                    size="large"
                  >
                    {currentStep === questions.length - 1 ? 'Hoàn thành' : 'Câu tiếp theo'}
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </motion.div>

        {/* Confirmation Modal */}
        <Modal
          title="Xác nhận hoàn thành đánh giá"
          open={showConfirmModal}
          onOk={submitAssessmentData}
          onCancel={() => setShowConfirmModal(false)}
          confirmLoading={submitting}
          okText="Xác nhận"
          cancelText="Hủy"
        >
          <p>Bạn đã trả lời đầy đủ {questions.length} câu hỏi.</p>
          <p>Hệ thống sẽ phân tích và đưa ra kết quả đánh giá mức độ rủi ro cùng với các khuyến nghị phù hợp.</p>
          <Alert
            message="Lưu ý"
            description="Kết quả đánh giá chỉ mang tính chất tham khảo. Hãy tham khảo ý kiến bác sĩ chuyên khoa để có lời khuyên chính xác nhất."
            type="info"
            showIcon
            className="mt-4"
          />
        </Modal>

        {/* Result Modal */}
        <Modal
          title="Kết quả đánh giá rủi ro"
          open={showResultModal}
          onOk={() => {
            setShowResultModal(false);
            navigate('/user/assessment-history');
          }}
          onCancel={() => setShowResultModal(false)}
          okText="Xem lịch sử đánh giá"
          cancelText="Đóng"
          width={600}
        >
          {assessmentResult && (
            <div className="space-y-4">
              {/* Risk Level */}
              <div className="text-center p-6 bg-gray-50 rounded-lg">
                <div className="text-6xl mb-4">
                  {getRiskLevelIcon(assessmentResult.level)}
                </div>
                <h3 className="text-2xl font-bold mb-2" style={{ color: getRiskLevelColor(assessmentResult.level) }}>
                  Mức độ rủi ro: {assessmentResult.level}
                </h3>
                <div className="text-lg text-gray-600">
                  Điểm số: {assessmentResult.score}/{assessmentResult.maxScore}
                </div>
              </div>

              {/* Recommendations */}
              <div>
                <h4 className="text-lg font-semibold mb-3">Khuyến nghị:</h4>
                <ul className="space-y-2">
                  {assessmentResult.recommendations?.map((rec, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <CheckCircleOutlined className="text-green-600 mt-1" />
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Next Steps */}
              <Alert
                message="Bước tiếp theo"
                description={
                  assessmentResult.level === 'Cao' 
                    ? "Chúng tôi khuyến nghị bạn nên đặt lịch tư vấn với bác sĩ chuyên khoa để được hỗ trợ tốt nhất."
                    : "Hãy tiếp tục duy trì lối sống lành mạnh và thực hiện đánh giá định kỳ."
                }
                type={assessmentResult.level === 'Cao' ? 'warning' : 'info'}
                showIcon
                action={
                  assessmentResult.level === 'Cao' && (
                    <Button size="small" type="primary" onClick={() => navigate('/consultation-booking')}>
                      Đặt lịch tư vấn
                    </Button>
                  )
                }
              />
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default RiskAssessment;
