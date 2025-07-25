import React from 'react'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export const Charts = ({ data }) => {
  console.log('📊 Charts component received data:', data);

  // Helper function to ensure data has valid values
  const ensureValidData = (chartData, fallbackData) => {
    if (!chartData || !Array.isArray(chartData) || chartData.length === 0) {
      return fallbackData;
    }
    return chartData;
  };

  // Use API data or fallback to default data
  const riskLevelData = ensureValidData(data?.riskLevels, [
    { name: 'Thấp', value: 850, color: '#10B981' },
    { name: 'Trung bình', value: 381, color: '#F59E0B' },
    { name: 'Cao', value: 17, color: '#EF4444' }
  ]);

  const participationData = ensureValidData(data?.participationData || data?.systemOverview, [
    { ageGroup: 'Bác sĩ', participants: 12 },
    { ageGroup: 'Nhân viên', participants: 25 },
    { ageGroup: 'Khách hàng', participants: 156 },
    { ageGroup: 'Đánh giá rủi ro', participants: 89 }
  ]);

  const monthlyTrends = ensureValidData(data?.monthlyTrends, [
    { month: 'T1', appointments: 65, assessments: 24 },
    { month: 'T2', appointments: 78, assessments: 31 },
    { month: 'T3', appointments: 90, assessments: 28 },
    { month: 'T4', appointments: 108, assessments: 35 },
    { month: 'T5', appointments: 125, assessments: 42 },
    { month: 'T6', appointments: 142, assessments: 38 }
  ]);

  // Additional chart data for appointment status
  const appointmentStatusData = ensureValidData(data?.appointmentStatus, [
    { name: 'Chờ xác nhận', value: 15, color: '#F59E0B' },
    { name: 'Đã xác nhận', value: 32, color: '#3B82F6' },
    { name: 'Hoàn thành', value: 28, color: '#10B981' },
    { name: 'Đã hủy', value: 5, color: '#EF4444' }
  ]);

  const consultationTypeData = ensureValidData(data?.consultationType, [
    { type: 'Video call', count: 45 },
    { type: 'Điện thoại', count: 23 },
    { type: 'Trực tiếp', count: 12 }
  ]);

  console.log('📊 Processed chart data:', {
    riskLevelData,
    participationData,
    monthlyTrends,
    appointmentStatusData,
    consultationTypeData
  });

  // Custom tooltip for better data display
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-800">{`${label}`}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {`${entry.name || entry.dataKey}: ${entry.value}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Custom label function for pie charts
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }) => {
    if (percent < 0.05) return null; // Don't show label if less than 5%
    
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize="12"
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  // Check if we have any data to display
  const hasRiskData = riskLevelData.some(item => item.value > 0);
  const hasParticipationData = participationData.some(item => item.participants > 0);
  const hasAppointmentStatusData = appointmentStatusData.some(item => item.value > 0);
  const hasConsultationTypeData = consultationTypeData.some(item => item.count > 0);
  const hasMonthlyTrendsData = monthlyTrends.some(item => item.appointments > 0 || item.assessments > 0);

  return (
    <div>
      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Risk Level Distribution Pie Chart */}
        {/* <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Phân bố mức độ rủi ro HIV</h3>
          <ResponsiveContainer width="100%" height={300}>
            {hasRiskData ? (
              <PieChart>
                <Pie
                  data={riskLevelData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {riskLevelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend />
              </PieChart>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                <div className="text-center">
                  <div className="text-4xl mb-2">📊</div>
                  <p>Chưa có dữ liệu đánh giá rủi ro</p>
                </div>
              </div>
            )}
          </ResponsiveContainer>
        </div> */}

        {/* System Overview Bar Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Tổng quan hệ thống</h3>
          <ResponsiveContainer width="100%" height={300}>
            {hasParticipationData ? (
              <BarChart data={participationData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="ageGroup" 
                  tick={{ fontSize: 12 }}
                  stroke="#666"
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  stroke="#666"
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="participants" 
                  fill="#3B82F6" 
                  radius={[4, 4, 0, 0]}
                  name="Số lượng"
                />
              </BarChart>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                <div className="text-center">
                  <div className="text-4xl mb-2">📈</div>
                  <p>Chưa có dữ liệu hệ thống</p>
                </div>
              </div>
            )}
          </ResponsiveContainer>
        </div>

        {/* Appointment Status Pie Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Trạng thái cuộc hẹn</h3>
          <ResponsiveContainer width="100%" height={300}>
            {hasAppointmentStatusData ? (
              <PieChart>
                <Pie
                  data={appointmentStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {appointmentStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend />
              </PieChart>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                <div className="text-center">
                  <div className="text-4xl mb-2">📅</div>
                  <p>Chưa có dữ liệu cuộc hẹn</p>
                </div>
              </div>
            )}
          </ResponsiveContainer>
        </div>

        {/* Consultation Type Bar Chart
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Hình thức tư vấn</h3>
          <ResponsiveContainer width="100%" height={300}>
            {hasConsultationTypeData ? (
              <BarChart data={consultationTypeData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  type="number"
                  tick={{ fontSize: 12 }}
                  stroke="#666"
                />
                <YAxis 
                  type="category"
                  dataKey="type" 
                  tick={{ fontSize: 12 }}
                  stroke="#666"
                  width={80}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="count" 
                  fill="#10B981" 
                  radius={[0, 4, 4, 0]}
                  name="Số lượng"
                />
              </BarChart>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                <div className="text-center">
                  <div className="text-4xl mb-2">💬</div>
                  <p>Chưa có dữ liệu tư vấn</p>
                </div>
              </div>
            )}
          </ResponsiveContainer>
        </div> */}
      </div>

      {/* Monthly Trends Chart - Full Row Below */}
      <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Xu hướng theo tháng</h3>
        <ResponsiveContainer width="100%" height={350}>
          {hasMonthlyTrendsData ? (
            <LineChart data={monthlyTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="month" 
                tick={{ fontSize: 12 }}
                stroke="#666"
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                stroke="#666"
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="appointments" 
                stroke="#3B82F6" 
                strokeWidth={3} 
                name="Cuộc hẹn mới"
                dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#3B82F6', strokeWidth: 2 }}
              />
              <Line 
                type="monotone" 
                dataKey="assessments" 
                stroke="#10B981" 
                strokeWidth={3} 
                name="Đánh giá rủi ro"
                dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#10B981', strokeWidth: 2 }}
              />
            </LineChart>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              <div className="text-center">
                <div className="text-4xl mb-2">📊</div>
                <p>Chưa có dữ liệu xu hướng theo tháng</p>
              </div>
            </div>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  )
}