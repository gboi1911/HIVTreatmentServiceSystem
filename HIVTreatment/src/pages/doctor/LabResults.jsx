import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, DatePicker, Select, message, Space } from 'antd';
import { PlusOutlined, EditOutlined } from '@ant-design/icons';
import { getLabResultsByDoctor, createLabResult, updateLabResult, deleteLabResult, getAllLabResults } from '../../api/labResult';
import { getMedicalRecordsByDoctor, getMedicalRecords } from '../../api/medicalRecord';
import { useAuthStatus } from '../../hooks/useAuthStatus';
import moment from 'moment';

const { Option } = Select;

export default function LabResults() {
  const { userInfo } = useAuthStatus();
  const [labResults, setLabResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingResult, setEditingResult] = useState(null);
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [form] = Form.useForm();

  // Fetch lab results for current doctor
  const fetchLabResults = async () => {
    if (!userInfo?.id) return;
    setLoading(true);
    try {
      const data = await getAllLabResults();
      console.log(data)
      setLabResults(Array.isArray(data) ? data : (data.data || []));
    } catch (error) {
      message.error('Không thể tải kết quả xét nghiệm');
    } finally {
      setLoading(false);
    }
  };

  // Fetch medical records for current doctor
  const fetchMedicalRecords = async () => {
    if (!userInfo?.id) return;
    try {
      const data = await getMedicalRecords();
      console.log(data)
      setMedicalRecords(Array.isArray(data) ? data : (data.data || []));
    } catch (error) {
      setMedicalRecords([]);
    }
  };

  useEffect(() => {
    fetchLabResults();
    fetchMedicalRecords();
    // eslint-disable-next-line
  }, [userInfo?.id]);

  // Open modal for add/edit
  const openModal = async (record = null) => {
    setEditingResult(record);
    setModalVisible(true);
    await fetchMedicalRecords();
    if (record) {
      form.setFieldsValue({
        ...record,
        testDate: record.testDate ? moment(record.testDate) : null,
        medicalRecordId: record.medicalRecordId || record.medicalRecordID || record.medicalRecord?.id,
      });
    } else {
      form.resetFields();
    }
  };

  // Handle form submit
  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const payload = {
        medicalRecordId: values.medicalRecordId,
        doctorId: 1,
        result: values.result,
        cd4Count: values.cd4Count,
        testDate: values.testDate && moment.isMoment(values.testDate)
          ? values.testDate.format('YYYY-MM-DD')
          : values.testDate || null,
        note: values.note || '',
      };
      if (editingResult) {
        await updateLabResult(editingResult.labResultId || editingResult.id, payload);
        message.success('Cập nhật kết quả xét nghiệm thành công');
      } else {
        await createLabResult(payload);
        message.success('Thêm kết quả xét nghiệm thành công');
      }
      setModalVisible(false);
      fetchLabResults();
    } catch (error) {
      message.error('Lưu kết quả xét nghiệm thất bại');
    } finally {
      setLoading(false);
    }
  };

  // Handle delete
  const handleDelete = async (record) => {
    try {
      setLoading(true);
      await deleteLabResult(record.labResultId || record.id);
      message.success('Xóa kết quả xét nghiệm thành công');
      fetchLabResults();
    } catch (error) {
      message.error('Xóa kết quả xét nghiệm thất bại');
    } finally {
      setLoading(false);
    }
  };

  // Modal close handler
  const handleModalClose = () => {
    setModalVisible(false);
    form.resetFields();
  };

  const columns = [
    { title: 'Mã hồ sơ', dataIndex: 'medicalRecordId', key: 'medicalRecordId',
      render: (val, record) => val || record.medicalRecordId || record.medicalRecord?.id },
    { title: 'Bệnh nhân', dataIndex: 'patientName', key: 'patientName',
      render: (val, record) => val || record.patientName || record.medicalRecord?.patientName },
    { title: 'Kết quả', dataIndex: 'result', key: 'result' },
    { title: 'CD4', dataIndex: 'cd4Count', key: 'cd4Count' },
    { title: 'Ngày xét nghiệm', dataIndex: 'testDate', key: 'testDate',
      render: (date) => date ? moment(date).format('DD/MM/YYYY') : '' },
    { title: 'Ghi chú', dataIndex: 'note', key: 'note' },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => openModal(record)} size="small">Sửa</Button>
          <Button danger size="small" onClick={() => handleDelete(record)}>Xóa</Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <h2>Kết quả xét nghiệm</h2>
      <Button type="primary" icon={<PlusOutlined />} onClick={() => openModal()} style={{ marginBottom: 16 }}>
        Thêm kết quả xét nghiệm
      </Button>
      <Table columns={columns} dataSource={labResults} rowKey={r => r.labResultId || r.id} loading={loading} />

      <Modal
        title={editingResult ? 'Chỉnh sửa kết quả xét nghiệm' : 'Thêm kết quả xét nghiệm'}
        open={modalVisible}
        onCancel={handleModalClose}
        footer={null}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="medicalRecordId"
            label="Hồ sơ bệnh án"
            rules={[{ required: true, message: 'Vui lòng chọn hồ sơ bệnh án' }]}
          >
            <Select placeholder="Chọn hồ sơ bệnh án">
              {medicalRecords.map(r => (
                <Option key={r.medicalRecordId || r.id} value={r.medicalRecordId || r.id}>
                  {r.medicalRecordId || r.id} - {r.patientName || r.customerName}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="result"
            label="Kết quả xét nghiệm"
            rules={[{ required: true, message: 'Vui lòng nhập kết quả' }]}
          >
            <Input placeholder="Nhập kết quả" />
          </Form.Item>
          <Form.Item
            name="cd4Count"
            label="Số lượng tế bào CD4"
            rules={[{ required: true, message: 'Vui lòng nhập số lượng CD4' }]}
          >
            <InputNumber min={0} style={{ width: '100%' }} placeholder="Nhập số lượng CD4" />
          </Form.Item>
          <Form.Item
            name="testDate"
            label="Ngày xét nghiệm"
            rules={[{ required: true, message: 'Vui lòng chọn ngày xét nghiệm' }]}
          >
            <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
          </Form.Item>
          <Form.Item
            name="note"
            label="Ghi chú"
            rules={[{ max: 500, message: 'Ghi chú không được vượt quá 500 ký tự' }]}
          >
            <Input.TextArea rows={2} placeholder="Nhập ghi chú (nếu có)" maxLength={500} />
          </Form.Item>
          <Form.Item style={{ textAlign: 'right' }}>
            <Button onClick={handleModalClose} style={{ marginRight: 8 }}>Hủy</Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              {editingResult ? 'Cập nhật' : 'Thêm mới'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
} 