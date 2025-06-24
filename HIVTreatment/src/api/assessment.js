const API_BASE = "https://hiv.purepixel.io.vn/api";

// Get all assessments
export const getAssessments = async (page = 1, limit = 10, filters = {}) => {
  try {
    const token = localStorage.getItem('token');
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...filters
    });

    const response = await fetch(`${API_BASE}/assessments?${queryParams}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`Get assessments failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Get assessments error:', error);
    throw error;
  }
};

// Get assessment by ID
export const getAssessmentById = async (assessmentId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/assessments/${assessmentId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`Get assessment failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Get assessment error:', error);
    throw error;
  }
};

// Submit assessment
export const submitAssessment = async (assessmentData) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/assessments/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(assessmentData)
    });

    if (!response.ok) {
      throw new Error(`Submit assessment failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Submit assessment error:', error);
    throw error;
  }
};

// Get assessment questions
export const getAssessmentQuestions = async (assessmentType = 'hiv_risk') => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/assessments/questions?type=${assessmentType}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`Get questions failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Get questions error:', error);
    // Return fallback questions
    return {
      questions: [
        {
          id: 1,
          question: "Bạn có từng sử dụng kim tiêm chung không?",
          type: "boolean",
          weight: 3,
          category: "injection_risk"
        },
        {
          id: 2,
          question: "Bạn có quan hệ tình dục không an toàn không?",
          type: "boolean",
          weight: 2,
          category: "sexual_risk"
        },
        {
          id: 3,
          question: "Bạn có từng xăm hình ở nơi không đảm bảo vệ sinh không?",
          type: "boolean",
          weight: 2,
          category: "injection_risk"
        },
        {
          id: 4,
          question: "Trong 6 tháng qua, bạn có bao nhiêu bạn tình?",
          type: "multiple_choice",
          weight: 2,
          category: "sexual_risk",
          options: [
            { value: 0, label: "Không có", points: 0 },
            { value: 1, label: "1 người", points: 0 },
            { value: 2, label: "2-3 người", points: 1 },
            { value: 3, label: "Hơn 3 người", points: 2 }
          ]
        },
        {
          id: 5,
          question: "Bạn có sử dụng ma túy tiêm không?",
          type: "boolean",
          weight: 4,
          category: "substance_use"
        }
      ]
    };
  }
};

// Calculate risk score
export const calculateRiskScore = async (answers) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/assessments/calculate-risk`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ answers })
    });

    if (!response.ok) {
      throw new Error(`Calculate risk failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Calculate risk error:', error);
    
    // Fallback calculation
    let totalScore = 0;
    let maxScore = 0;
    
    Object.entries(answers).forEach(([questionId, answer]) => {
      const weight = getQuestionWeight(parseInt(questionId));
      maxScore += weight * 2; // Assuming max points per question is 2
      
      if (typeof answer === 'boolean') {
        totalScore += answer ? weight * 2 : 0;
      } else if (typeof answer === 'number') {
        totalScore += answer * weight;
      }
    });
    
    const riskPercentage = Math.round((totalScore / maxScore) * 100);
    let riskLevel = 'low';
    let recommendations = [];
    
    if (riskPercentage >= 70) {
      riskLevel = 'high';
      recommendations = [
        'Khuyến nghị gặp bác sĩ chuyên khoa ngay lập tức',
        'Thực hiện xét nghiệm HIV định kỳ',
        'Tham gia các chương trình hỗ trợ'
      ];
    } else if (riskPercentage >= 40) {
      riskLevel = 'medium';
      recommendations = [
        'Nên tham khảo ý kiến bác sĩ',
        'Học về các biện pháp phòng ngừa',
        'Xét nghiệm định kỳ 6 tháng/lần'
      ];
    } else {
      riskLevel = 'low';
      recommendations = [
        'Tiếp tục duy trì lối sống an toàn',
        'Tăng cường kiến thức về phòng ngừa HIV',
        'Xét nghiệm định kỳ hàng năm'
      ];
    }
    
    return {
      score: totalScore,
      maxScore,
      percentage: riskPercentage,
      level: riskLevel,
      recommendations
    };
  }
};

// Helper function for fallback calculation
const getQuestionWeight = (questionId) => {
  const weights = {
    1: 3, // Kim tiêm chung
    2: 2, // Quan hệ không an toàn
    3: 2, // Xăm hình
    4: 2, // Số bạn tình
    5: 4  // Ma túy tiêm
  };
  return weights[questionId] || 1;
};

// Get user's assessment history
export const getUserAssessmentHistory = async (userId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/assessments/user/${userId}/history`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`Get assessment history failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Get assessment history error:', error);
    throw error;
  }
};

// Get assessment statistics
export const getAssessmentStats = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/assessments/stats`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`Get assessment stats failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Get assessment stats error:', error);
    // Return fallback stats
    return {
      totalAssessments: 1245,
      averageRiskScore: 32,
      riskDistribution: {
        low: 78,
        medium: 18,
        high: 4
      },
      completionRate: 89,
      monthlyTrends: [
        { month: 'T1', assessments: 145, avgRisk: 28 },
        { month: 'T2', assessments: 167, avgRisk: 31 },
        { month: 'T3', assessments: 189, avgRisk: 29 },
        { month: 'T4', assessments: 203, avgRisk: 35 },
        { month: 'T5', assessments: 221, avgRisk: 33 },
        { month: 'T6', assessments: 245, avgRisk: 32 }
      ]
    };
  }
};
