import React, { useEffect, useState } from 'react';
import { Table, Tag, Button, Space, Select, DatePicker, message, Modal } from 'antd';
import { 
  getAppointmentsByDoctor, 
  updateAppointmentStatus,
  getAppointmentsByStatus,
  getAppointmentsByDoctorAndStatus 
} from '../../api/appointment';
import { useAuthStatus } from '../../hooks/useAuthStatus';
import moment from 'moment';
import 'moment/locale/vi';

const { Option } = Select;
const { RangePicker } = DatePicker;

const statusOptions = [
  { value: 'PENDING', label: 'Chờ xác nhận', color: 'orange' },
  { value: 'CONFIRMED', label: 'Đã xác nhận', color: 'blue' },
  { value: 'IN_PROGRESS', label: 'Đang khám', color: 'purple' },
  { value: 'COMPLETED', label: 'Đã hoàn thành', color: 'green' },
  { value: 'CANCELLED', label: 'Đã hủy', color: 'red' },
];

const columns = [
  { 
    title: 'Bệnh nhân', 
    dataIndex: 'customerName', 
    key: 'customerName',
    render: (text, record) => (
      <div>
        <div className="font-medium">{text}</div>
        <div className="text-gray-500 text-xs">{record.customerPhone}</div>
      </div>
    )
  },
  { 
    title: 'Loại lịch hẹn', 
    dataIndex: 'type', 
    key: 'type',
    render: (type) => (
      <Tag color={type === 'Khám định kỳ' ? 'blue' : 'purple'}>{type}</Tag>
    )
  },
  { 
    title: 'Thời gian', 
    dataIndex: 'datetime', 
    key: 'datetime',
    render: (datetime) => (
      <div>
        <div>{moment(datetime).format('HH:mm')}</div>
        <div className="text-xs text-gray-500">{moment(datetime).format('DD/MM/YYYY')}</div>
      </div>
    )
  },
  { 
    title: 'Ghi chú', 
    dataIndex: 'note', 
    key: 'note',
    ellipsis: true
  },
  { 
    title: 'Trạng thái', 
    dataIndex: 'status', 
    key: 'status', 
    render: (status) => {
      const statusObj = statusOptions.find(s => s.value === status) || {};
      return <Tag color={statusObj.color || 'default'}>{statusObj.label || status}</Tag>;
    }
  },
  {
    title: 'Hành động',
    key: 'action',
    render: (_, record) => (
      <Space size="middle">
        {record.status === 'PENDING' && (
          <Button 
            size="small" 
            onClick={() => handleStatusUpdate(record.id, 'CONFIRMED')}
          >
            Xác nhận
          </Button>
        )}
        {['PENDING', 'CONFIRMED'].includes(record.status) && (
          <Button 
            size="small" 
            danger
            onClick={() => handleStatusUpdate(record.id, 'CANCELLED')}
          >
            Hủy
          </Button>
        )}
        {record.status === 'CONFIRMED' && (
          <Button 
            type="primary" 
            size="small"
            onClick={() => handleStatusUpdate(record.id, 'IN_PROGRESS')}
          >
            Bắt đầu khám
          </Button>
        )}
        {record.status === 'IN_PROGRESS' && (
          <Button 
            type="primary" 
            size="small"
            onClick={() => handleStatusUpdate(record.id, 'COMPLETED')}
          >
            Hoàn thành
          </Button>
        )}
      </Space>
    ),
  },
];

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: null,
    dateRange: [moment().startOf('day'), moment().endOf('day')]
  });
  const { userInfo } = useAuthStatus();

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      let response;
      
      if (filters.status) {
        response = await getAppointmentsByDoctorAndStatus(userInfo.id, filters.status);
      } else {
        response = await getAppointmentsByDoctor(userInfo.id);
      }
      
      // Handle different response formats
      let appointmentsList = [];
      if (Array.isArray(response)) {
        appointmentsList = response;
      } else if (response && Array.isArray(response.data)) {
        appointmentsList = response.data;
      } else if (response && response.data && typeof response.data === 'object') {
        // If data is an object, convert it to array
        appointmentsList = Object.values(response.data);
      } else {
        console.warn('Unexpected API response format:', response);
        message.warning('Định dạng dữ liệu không đúng');
      }
      
      // Ensure all appointments have datetime as a moment object
      appointmentsList = appointmentsList.map(appt => ({
        ...appt,
        datetime: moment(appt.datetime || appt.appointmentTime || new Date())
      }));
      
      // Filter by date range if selected
      if (filters.dateRange && filters.dateRange[0] && filters.dateRange[1]) {
        const [startDate, endDate] = filters.dateRange;
        appointmentsList = appointmentsList.filter(appointment => {
          if (!appointment.datetime) return false;
          return appointment.datetime.isBetween(
            startDate.startOf('day'), 
            endDate.endOf('day'), 
            'day', 
            '[]'
          );
        });
      }
      
      setAppointments(appointmentsList);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      message.error(`Không thể tải danh sách lịch hẹn: ${error.message || 'Lỗi không xác định'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (appointmentId, newStatus) => {
    try {
      await updateAppointmentStatus(appointmentId, newStatus);
      message.success('Cập nhật trạng thái thành công');
      fetchAppointments();
    } catch (error) {
      console.error('Error updating status:', error);
      message.error('Có lỗi xảy ra khi cập nhật trạng thái');
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  useEffect(() => {
    if (userInfo?.id) {
      fetchAppointments();
    }
  }, [userInfo, filters.status, filters.dateRange]);

  return (
    <div style={{ padding: 24 }}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Quản lý lịch hẹn</h2>
        <div className="flex space-x-4">
          <RangePicker
            value={filters.dateRange}
            onChange={(dates) => handleFilterChange('dateRange', dates)}
            format="DD/MM/YYYY"
            className="w-64"
          />
          <Select
            placeholder="Lọc theo trạng thái"
            allowClear
            style={{ width: 200 }}
            onChange={(value) => handleFilterChange('status', value)}
            value={filters.status}
          >
            {statusOptions.map(option => (
              <Option key={option.value} value={option.value}>
                <Tag color={option.color}>{option.label}</Tag>
              </Option>
            ))}
          </Select>
          <Button 
            type="primary" 
            onClick={fetchAppointments}
            loading={loading}
          >
            Làm mới
          </Button>
        </div>
      </div>
      
      <Table 
        columns={columns} 
        dataSource={appointments} 
        rowKey="id"
        loading={loading}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Tổng ${total} lịch hẹn`
        }}
        scroll={{ x: 'max-content' }}
      />
    </div>
  );
}

// Make handleStatusUpdate available to the columns definition
const handleStatusUpdate = (appointmentId, newStatus) => {
  // This will be called by the action buttons in the table
  // The actual implementation is in the component scope
  window.handleStatusUpdateRef?.(appointmentId, newStatus);
};

// Export a function to set the reference to the actual handler
export const setStatusUpdateHandler = (handler) => {
  window.handleStatusUpdateRef = handler;
};