import React from 'react'
import {
  Users,
  Calendar,
  AlertTriangle,
  GraduationCap,
  UserPlus,
} from 'lucide-react';
export const RecentActivity = () => {
    
  const appointments = [
    { id: 1, user: 'Nguyễn Văn An', consultant: 'BS. Trần Thị Mai', date: '2024-06-15', time: '09:00', status: 'Đã xác nhận' },
    { id: 2, user: 'Lê Thị Hoa', consultant: 'ThS. Nguyễn Văn Bình', date: '2024-06-15', time: '14:30', status: 'Chờ xác nhận' },
    { id: 3, user: 'Phạm Minh Tuấn', consultant: 'BS. Võ Thị Lan', date: '2024-06-16', time: '10:15', status: 'Đã xác nhận' }
  ];
  return (
    <div>
        {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold mb-4">Hoạt động gần đây</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                  <UserPlus className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium">Người dùng mới đăng ký</p>
                    <p className="text-xs text-gray-500">Nguyễn Văn Minh - 5 phút trước</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                  <Calendar className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-sm font-medium">Cuộc hẹn tư vấn mới</p>
                    <p className="text-xs text-gray-500">Trần Thị Lan - 15 phút trước</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                  <div>
                    <p className="text-sm font-medium">Cảnh báo mức độ rủi ro cao</p>
                    <p className="text-xs text-gray-500">Lê Văn Tùng - 30 phút trước</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold mb-4">Lịch hẹn hôm nay</h3>
              <div className="space-y-3">
                {appointments.slice(0, 3).map((appointment) => (
                  <div key={appointment.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div>
                      <p className="text-sm font-medium">{appointment.user}</p>
                      <p className="text-xs text-gray-500">{appointment.consultant}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{appointment.time}</p>
                      <span className={`text-xs px-2 py-1 rounded-full ${appointment.status === 'Đã xác nhận'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                        }`}>
                        {appointment.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
    </div>
  )
}
