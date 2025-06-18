import React from 'react'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
export const Charts = () => {
    
      const riskLevelData = [
        { name: 'Thấp', value: 850, color: '#10B981' },
        { name: 'Trung bình', value: 381, color: '#F59E0B' },
        { name: 'Cao', value: 17, color: '#EF4444' }
      ];
    
      const participationData = [
        { ageGroup: '13-17', participants: 245 },
        { ageGroup: '18-25', participants: 432 },
        { ageGroup: '26-35', participants: 356 },
        { ageGroup: '36-45', participants: 215 }
      ];
    
      const monthlyTrends = [
        { month: 'T1', users: 65, sessions: 24 },
        { month: 'T2', users: 78, sessions: 31 },
        { month: 'T3', users: 90, sessions: 28 },
        { month: 'T4', users: 108, sessions: 35 },
        { month: 'T5', users: 125, sessions: 42 },
        { month: 'T6', users: 142, sessions: 38 }
      ];
    
    return (
        <div>
            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h3 className="text-lg font-semibold mb-4">Phân bố mức độ rủi ro</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={riskLevelData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {riskLevelData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h3 className="text-lg font-semibold mb-4">Tham gia theo nhóm tuổi</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={participationData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="ageGroup" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="participants" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Trend Chart - Full Row Below */}
            <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold mb-4">Xu hướng theo tháng</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={monthlyTrends}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="users" stroke="#3B82F6" strokeWidth={2} name="Người dùng mới" />
                        <Line type="monotone" dataKey="sessions" stroke="#10B981" strokeWidth={2} name="Buổi tư vấn" />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}
