import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, Row, Col, Button, Space } from 'antd';

const { Option } = Select;

const STAFF_GENDERS = [
  { value: 'Male', label: 'Nam', color: 'blue' },
  { value: 'Female', label: 'Nữ', color: 'pink' },
  { value: 'Other', label: 'Khác', color: 'default' }
];

export const StaffModal = ({
  visible,
  modalType,
  selectedStaff,
  onCancel,
  onSubmit,
  loading,
  form
}) => {
  const isCreate = modalType === 'create';
  const title = isCreate ? 'Thêm nhân viên mới' : 'Chỉnh sửa nhân viên';

  // Reset form when modal opens in create mode
  useEffect(() => {
    if (visible) {
      if (isCreate) {
        // Always reset form for create mode
        form.resetFields();
      } else if (selectedStaff) {
        // Set form values for edit mode
        form.setFieldsValue({
          name: selectedStaff.name,
          email: selectedStaff.email,
          phone: selectedStaff.phone,
          gender: selectedStaff.gender
        });
      }
    }
  }, [visible, isCreate, selectedStaff, form]);

  return (
    <Modal
      title={title}
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={600}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onSubmit}
        preserve={false}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="name"
              label="Họ và tên"
              rules={[{ required: true, message: 'Vui lòng nhập họ và tên' }]}
            >
              <Input placeholder="Nhập họ và tên" />
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
              <Input placeholder="Nhập email" />
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
              <Input placeholder="Nhập số điện thoại" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="gender"
              label="Giới tính"
              rules={[{ required: true, message: 'Vui lòng chọn giới tính' }]}
            >
              <Select placeholder="Chọn giới tính">
                {STAFF_GENDERS.map(gender => (
                  <Option key={gender.value} value={gender.value}>
                    {gender.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        {isCreate && (
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
                <Input.Password placeholder="Nhập mật khẩu" />
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
                <Input.Password placeholder="Xác nhận mật khẩu" />
              </Form.Item>
            </Col>
          </Row>
        )}

        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit" loading={loading}>
              {isCreate ? 'Tạo nhân viên' : 'Cập nhật'}
            </Button>
            <Button onClick={onCancel}>
              Hủy
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};
