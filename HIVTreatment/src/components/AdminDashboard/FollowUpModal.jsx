import React from 'react';
import { Modal, Form, Input, DatePicker, Button, Select } from 'antd';

const { Option } = Select;

const FollowUpModal = ({ visible, onCancel, onSubmit, patient, doctor }) => {
  const [form] = Form.useForm();

  const handleFinish = (values) => {
    onSubmit(values);
    form.resetFields();
  };

  return (
    <Modal
      title="Đặt lịch tái khám"
      visible={visible}
      onCancel={onCancel}
      footer={null}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={{
          patientName: patient?.name,
          patientPhone: patient?.phone,
          doctorName: doctor?.name,
          date: null,
          reason: '',
        }}
      >
        <Form.Item label="Bệnh nhân" name="patientName">
          <Input disabled />
        </Form.Item>
        <Form.Item label="Số điện thoại" name="patientPhone">
          <Input disabled />
        </Form.Item>
        <Form.Item label="Bác sĩ" name="doctorName">
          <Input disabled />
        </Form.Item>
        <Form.Item label="Ngày tái khám" name="date" rules={[{ required: true, message: 'Chọn ngày tái khám' }]}> 
          <DatePicker showTime format="DD/MM/YYYY HH:mm" style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item label="Lý do tái khám" name="reason" rules={[{ required: true, message: 'Nhập lý do tái khám' }]}> 
          <Input.TextArea rows={2} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" style={{ marginRight: 8 }}>Lưu</Button>
          <Button onClick={onCancel}>Hủy</Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default FollowUpModal; 