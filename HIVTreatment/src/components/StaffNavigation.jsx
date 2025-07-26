import React from 'react';
import { Menu, Button, Divider, Typography } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import {
  CalendarOutlined,
  FileTextOutlined,
  MedicineBoxOutlined,
  UserOutlined,
  BellOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';

const { Title } = Typography;

const StaffNavigation = () => {
  const location = useLocation();
  
  const menuItems = [
    {
      key: '/appointment-management',
      icon: <CalendarOutlined />,
      label: <Link to="/appointment-management">Quản lý lịch hẹn</Link>,
    },
    {
      key: '/staff/follow-up-management',
      icon: <BellOutlined />,
      label: <Link to="/staff/follow-up-management">Quản lý tái khám</Link>,
    },
    {
      key: '/staff/completed-treatments',
      icon: <CheckCircleOutlined />,
      label: <Link to="/staff/completed-treatments">Hồ sơ đã hoàn thành</Link>,
    }
  ];
  
  return (
    <div style={{ padding: '16px' }}>
      <Title level={4} style={{ marginBottom: '16px' }}>Quản lý của nhân viên</Title>
      <Menu
        mode="vertical"
        selectedKeys={[location.pathname]}
        items={menuItems}
        style={{ borderRight: 0 }}
      />
      <Divider />
      <div style={{ padding: '8px' }}>
        <Button type="primary" block icon={<CalendarOutlined />}>
          <Link to="/consultation-booking" style={{ color: 'white' }}>
            Đặt lịch mới
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default StaffNavigation; 