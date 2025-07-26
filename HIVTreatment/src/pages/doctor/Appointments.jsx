import React, { useEffect, useState } from 'react';
import { Table, Tag, Button, Space, Select, DatePicker, message, Modal, Input, Card, Tooltip } from 'antd';
import { 
  updateAppointmentStatus,
  getAllAppointments,
  cleanAppointmentNotes
} from '../../api/appointment';
import { useAuthStatus } from '../../hooks/useAuthStatus';
import moment from 'moment';
import 'moment/locale/vi';
import { SearchOutlined, PhoneOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Option } = Select;
const { RangePicker } = DatePicker;

const statusOptions = [
  { value: 'PENDING', label: 'Chờ xác nhận', color: 'orange' },
  { value: 'CONFIRMED', label: 'Đã xác nhận', color: 'blue' },
  { value: 'IN_PROGRESS', label: 'Đang khám', color: 'purple' },
  { value: 'COMPLETED', label: 'Đã hoàn thành', color: 'green' },
  { value: 'CANCELLED', label: 'Đã hủy', color: 'red' },
];

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterPhone, setFilterPhone] = useState('');

  const { userInfo } = useAuthStatus();
  const navigate = useNavigate();

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      let response;
      
      // Use getAllAppointments to fetch all appointments
      response = await getAllAppointments();
      console.log('API response:', response);
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
      
      // Ensure all appointments have datetime as a moment object and id
      appointmentsList = appointmentsList.map(appt => ({
        ...appt,
        id: appt.id || appt.appointmentId, // Đảm bảo luôn có id
        datetime: moment(appt.datetime || appt.appointmentTime || new Date()),
        customerName: appt.customerName || 'Bệnh nhân', // Đảm bảo luôn có tên
        customerPhone: appt.customerPhone || '---' // Đảm bảo luôn có số điện thoại
      }));
      
      appointmentsList = appointmentsList.filter(appt => appt.status === "CONFIRMED");
      console.log('Filtered appointments:', appointmentsList);

      setAppointments(appointmentsList);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      message.error(`Không thể tải danh sách lịch hẹn: ${error.message || 'Lỗi không xác định'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (appointmentId, newStatus, record) => {
    console.log('Handling status update:', { appointmentId, newStatus, record });
    
    if (newStatus === 'IN_PROGRESS' && record) {
      // Đảm bảo có đủ thông tin trước khi chuyển trang
      const customerName = record.customerName || 'Bệnh nhân';
      const customerPhone = record.customerPhone || '---';
      const customerId = record.customerId;
      
      if (!customerId) {
        message.error('Không tìm thấy thông tin ID của bệnh nhân');
        return;
      }
      
      console.log('Navigating to medical form with:', { 
        customerId, 
        appointmentId: record.id, 
        customerName, 
        customerPhone 
      });
      
      navigate(`/doctor/medical-form?customerId=${customerId}&appointmentId=${record.id}&customerName=${encodeURIComponent(customerName)}&customerPhone=${encodeURIComponent(customerPhone)}`);
      return;
    }
    
    try {
      // Chỉ truyền id và status, không truyền note để tránh lưu JWT token
      await updateAppointmentStatus(appointmentId, newStatus, '');
      message.success('Cập nhật trạng thái thành công');
      fetchAppointments();
    } catch (error) {
      console.error('Error updating appointment status:', error);
      message.error('Có lỗi xảy ra khi cập nhật trạng thái');
    }
  };

  const handleCleanNotes = async () => {
    try {
      await cleanAppointmentNotes();
      message.success('Đã dọn dẹp ghi chú chứa JWT token thành công');
      fetchAppointments();
    } catch (error) {
      console.error('Error cleaning notes:', error);
      message.error('Có lỗi xảy ra khi dọn dẹp ghi chú');
    }
  };



  useEffect(() => {
    if (userInfo?.id) {
      fetchAppointments();
    }
  }, [userInfo]);

  // Đưa columns vào trong component để dùng đúng handleStatusUpdate
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
              onClick={() => handleStatusUpdate(record.id, 'IN_PROGRESS', record)}
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

  return (
    <div style={{ padding: 24 }}>
      <h2 className="text-xl font-semibold" style={{ marginBottom: 16 }}>Quản lý lịch hẹn</h2>
      <Card style={{ marginBottom: 24, maxWidth: 500 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Tooltip title="Nhập số điện thoại bệnh nhân để lọc">
            <Input
              prefix={<PhoneOutlined />}
              placeholder="Lọc theo số điện thoại"
              value={filterPhone}
              allowClear
              onChange={e => setFilterPhone(e.target.value)}
              style={{ width: 250 }}
            />
          </Tooltip>
          <Button
            type="primary"
            icon={<SearchOutlined />}
            onClick={fetchAppointments}
            loading={loading}
          >
            Làm mới
          </Button>
          <Button
            type="default"
            onClick={handleCleanNotes}
            loading={loading}
          >
            Dọn dẹp ghi chú
          </Button>
        </div>
      </Card>
      {/* Old filter UI removed and replaced by Card above */}
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