import React from 'react';
import { 
  Drawer, 
  Avatar, 
  Tag, 
  Descriptions, 
  Badge, 
  Space, 
  Button 
} from 'antd';
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  EditOutlined
} from '@ant-design/icons';

const STAFF_GENDERS = [
  { value: 'Male', label: 'Nam', color: 'blue' },
  { value: 'Female', label: 'Nữ', color: 'pink' },
  { value: 'Other', label: 'Khác', color: 'default' }
];

export const StaffDetailDrawer = ({
  visible,
  selectedStaff,
  onClose,
  onEdit
}) => {
  if (!selectedStaff) return null;

  const genderConfig = STAFF_GENDERS.find(g => g.value === selectedStaff.gender);

  return (
    <Drawer
      title="Chi tiết nhân viên"
      placement="right"
      onClose={onClose}
      open={visible}
      width={480}
    >
      <div>
        <div className="text-center mb-6">
          <Avatar 
            size={80} 
            icon={<UserOutlined />} 
          />
          <h3 className="mt-2 mb-1">{selectedStaff.name}</h3>
          <Tag color={genderConfig?.color}>
            {genderConfig?.label}
          </Tag>
        </div>

        <Descriptions column={1} bordered>
          <Descriptions.Item label="Email">
            <Space>
              <MailOutlined />
              {selectedStaff.email}
            </Space>
          </Descriptions.Item>
          <Descriptions.Item label="Số điện thoại">
            <Space>
              <PhoneOutlined />
              {selectedStaff.phone || 'N/A'}
            </Space>
          </Descriptions.Item>
          <Descriptions.Item label="Giới tính">
            {genderConfig?.label || selectedStaff.gender}
          </Descriptions.Item>
          <Descriptions.Item label="Trạng thái">
            <Badge 
              status={!selectedStaff.isDeleted ? 'success' : 'error'} 
              text={!selectedStaff.isDeleted ? 'Hoạt động' : 'Bị xóa'} 
            />
          </Descriptions.Item>
          <Descriptions.Item label="ID nhân viên">
            {selectedStaff.staffId}
          </Descriptions.Item>
        </Descriptions>

        <div className="mt-6">
          <Space direction="vertical" style={{ width: '100%' }}>
            <Button 
              block 
              type="primary"
              icon={<EditOutlined />}
              onClick={() => {
                onClose();
                onEdit(selectedStaff);
              }}
            >
              Chỉnh sửa thông tin
            </Button>
          </Space>
        </div>
      </div>
    </Drawer>
  );
};
