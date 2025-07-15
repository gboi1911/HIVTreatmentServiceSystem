import React from 'react';
import {
  Modal,
  Form,
  Input,
  Select,
  Row,
  Col,
  Button,
  Space,
  DatePicker,
  Switch
} from 'antd';
import { 
  UserOutlined, 
  MailOutlined, 
  PhoneOutlined, 
  LockOutlined 
} from '@ant-design/icons';

const { Option } = Select;
const { TextArea } = Input;

export const UserModal = ({ 
  visible, 
  onCancel, 
  onSubmit, 
  type, 
  initialValues, 
  loading 
}) => {
  const [form] = Form.useForm();

  const USER_ROLES = [
    { value: 'admin', label: 'Quản trị viên' },
    { value: 'doctor', label: 'Bác sĩ' },
    { value: 'staff', label: 'Nhân viên' },
    { value: 'user', label: 'Người dùng' }
  ];

  React.useEffect(() => {
    if (visible && initialValues) {
      form.setFieldsValue(initialValues);
    } else if (visible) {
      form.resetFields();
    }
  }, [visible, initialValues, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      await onSubmit(values);
      form.resetFields();
    } catch (error) {
      console.error('Form validation failed:', error);
    }
  };

  const isEdit = type === 'edit';
  const isView = type === 'view';

  return (
    <Modal
      title={
        isEdit ? 'Chỉnh sửa người dùng' : 
        isView ? 'Chi tiết người dùng' : 
        'Thêm người dùng mới'
      }
      open={visible}
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
      width={700}
      footer={
        isView ? (
          <Button onClick={onCancel}>Đóng</Button>
        ) : (
          <Space>
            <Button onClick={onCancel}>Hủy</Button>
            <Button 
              type="primary" 
              onClick={handleSubmit}
              loading={loading}
            >
              {isEdit ? 'Cập nhật' : 'Tạo mới'}
            </Button>
          </Space>
        )
      }
    >
      <Form
        form={form}
        layout="vertical"
        disabled={isView}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="fullName"
              label="Họ và tên"
              rules={[{ required: true, message: 'Vui lòng nhập họ và tên' }]}
            >
              <Input 
                prefix={<UserOutlined />}
                placeholder="Nhập họ và tên" 
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: 'Vui lòng nhập email' },
                { type: 'email', message: 'Email không hợp lệ' }
              ]}
            >
              <Input 
                prefix={<MailOutlined />}
                placeholder="Nhập email" 
                disabled={isEdit} // Email should not be editable
              />
            </Form.Item>
          </Col>
        </Row>
        
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="phone"
              label="Số điện thoại"
              rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
            >
              <Input 
                prefix={<PhoneOutlined />}
                placeholder="Nhập số điện thoại" 
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="role"
              label="Vai trò"
              rules={[{ required: true, message: 'Vui lòng chọn vai trò' }]}
            >
              <Select placeholder="Chọn vai trò">
                {USER_ROLES.map(role => (
                  <Option key={role.value} value={role.value}>
                    {role.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="dateOfBirth"
              label="Ngày sinh"
            >
              <DatePicker 
                style={{ width: '100%' }}
                placeholder="Chọn ngày sinh"
                format="DD/MM/YYYY"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="gender"
              label="Giới tính"
            >
              <Select placeholder="Chọn giới tính">
                <Option value="male">Nam</Option>
                <Option value="female">Nữ</Option>
                <Option value="other">Khác</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="address"
              label="Địa chỉ"
            >
              <TextArea 
                rows={2}
                placeholder="Nhập địa chỉ" 
              />
            </Form.Item>
          </Col>
        </Row>

        {!isEdit && (
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="password"
                label="Mật khẩu"
                rules={[
                  { required: true, message: 'Vui lòng nhập mật khẩu' },
                  { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự' }
                ]}
              >
                <Input.Password 
                  prefix={<LockOutlined />}
                  placeholder="Nhập mật khẩu" 
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="confirmPassword"
                label="Xác nhận mật khẩu"
                dependencies={['password']}
                rules={[
                  { required: true, message: 'Vui lòng xác nhận mật khẩu' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('Mật khẩu xác nhận không khớp'));
                    },
                  }),
                ]}
              >
                <Input.Password 
                  prefix={<LockOutlined />}
                  placeholder="Xác nhận mật khẩu" 
                />
              </Form.Item>
            </Col>
          </Row>
        )}

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="isActive"
              label="Trạng thái tài khoản"
              valuePropName="checked"
              initialValue={true}
            >
              <Switch 
                checkedChildren="Hoạt động" 
                unCheckedChildren="Bị khóa" 
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="emailVerified"
              label="Email đã xác minh"
              valuePropName="checked"
              initialValue={false}
            >
              <Switch 
                checkedChildren="Đã xác minh" 
                unCheckedChildren="Chưa xác minh" 
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="notes"
          label="Ghi chú"
        >
          <TextArea 
            rows={3}
            placeholder="Ghi chú về người dùng (tuỳ chọn)" 
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UserModal;
