import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Input,
  Select,
  Space,
  Tag,
  Avatar,
  Form,
  message,
  Card,
  Row,
  Col,
  Modal,
  InputNumber
} from 'antd';
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ReloadOutlined,
  ExportOutlined,
  UserOutlined
} from '@ant-design/icons';
import AdminSidebar from '../../components/AdminDashboard/AdminSidebar';
import { getAllDoctors, createDoctor, updateDoctor, deleteDoctor } from '../../api/doctor';
import { useNavigate } from 'react-router-dom';

const { Option } = Select;
const { TextArea } = Input;

const DOCTOR_SPECIALIZATIONS = [
  { value: 'HIV/AIDS', label: 'HIV/AIDS' },
  { value: 'Nội khoa', label: 'Nội khoa' },
  { value: 'Truyền nhiễm', label: 'Truyền nhiễm' },
  { value: 'Tâm lý', label: 'Tâm lý' },
  { value: 'Khác', label: 'Khác' }
];

export default function DoctorManagement() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [form] = Form.useForm();
  const [filters, setFilters] = useState({ search: '', specialization: undefined });
  const navigate = useNavigate();

  // Fetch all doctors
  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const res = await getAllDoctors();
      setDoctors(res || []);
    } catch (err) {
      message.error("Không thể tải danh sách bác sĩ");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  // Filtered doctors
  const filteredDoctors = doctors.filter(d => {
    const matchSearch = filters.search ? (
      d.name?.toLowerCase().includes(filters.search.toLowerCase())
    ) : true;
    const matchSpec = filters.specialization ? d.specialization === filters.specialization : true;
    return matchSearch && matchSpec;
  });

  // Add or edit doctor
  const handleSubmit = async (values) => {
    try {
      if (editMode && selectedDoctor) {
        await updateDoctor(selectedDoctor.id, values);
        message.success("Cập nhật thông tin bác sĩ thành công!");
      } else {
        await createDoctor(values);
        message.success("Thêm bác sĩ mới thành công!");
      }
      setModalVisible(false);
      form.resetFields();
      fetchDoctors();
    } catch (err) {
      message.error("Lưu thông tin bác sĩ thất bại");
    }
  };

  // Delete doctor
  const handleDelete = async (doctor) => {
    Modal.confirm({
      title: "Xác nhận xoá bác sĩ",
      content: `Bạn có chắc muốn xoá bác sĩ ${doctor.fullName || doctor.name}?`,
      okType: "danger",
      onOk: async () => {
        try {
          await deleteDoctor(doctor.id);
          message.success("Xoá bác sĩ thành công!");
          fetchDoctors();
        } catch {
          message.error("Xoá bác sĩ thất bại");
        }
      }
    });
  };

  // Open modal for add/edit
  const openModal = (doctor = null) => {
    setEditMode(!!doctor);
    setSelectedDoctor(doctor);
    setModalVisible(true);
    if (doctor) {
      form.setFieldsValue(doctor);
    } else {
      form.resetFields();
    }
  };

  // Filters
  const handleSearchChange = (e) => {
    setFilters(f => ({ ...f, search: e.target.value }));
  };
  const handleSpecializationChange = (value) => {
    setFilters(f => ({ ...f, specialization: value }));
  };

  // Table columns
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 60,
      sorter: (a, b) => a.id - b.id,
      render: (id) => <span>{id}</span>
    },
    {
      title: 'Tên bác sĩ',
      dataIndex: 'name',
      key: 'name',
      render: (text) => (
        <Space>
          <Avatar icon={<UserOutlined />} size="default" />
          <span className="font-medium">{text}</span>
        </Space>
      ),
    },
    {
      title: 'Mã khách hàng',
      dataIndex: 'customerId',
      key: 'customerId',
      render: (id) => id || 'N/A',
    },
    {
      title: 'Trình độ chuyên môn',
      dataIndex: 'qualifications',
      key: 'qualifications',
      render: (qual) => qual || 'N/A',
    },
    {
      title: 'Chuyên khoa',
      dataIndex: 'specialization',
      key: 'specialization',
      render: (spec) => <Tag color="blue">{spec}</Tag>
    },
    {
      title: 'Lịch làm việc',
      dataIndex: 'workSchedule',
      key: 'workSchedule',
      render: (ws) => ws || 'N/A',
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 120,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Button type="text" icon={<EditOutlined />} onClick={() => openModal(record)} />
          <Button type="text" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record)} />
        </Space>
      ),
    },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 ml-64 p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Quản lý bác sĩ</h1>
          <p className="text-gray-600">Quản lý tất cả bác sĩ trong hệ thống</p>
        </div>

        {/* Filters and Actions */}
        <Card className="mb-6">
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} sm={12} lg={8}>
              <Input.Search
                placeholder="Tìm kiếm theo tên, email..."
                onChange={handleSearchChange}
                allowClear
                value={filters.search}
                enterButton={<SearchOutlined />}
              />
            </Col>
            <Col xs={24} sm={6} lg={4}>
              <Select
                placeholder="Chuyên khoa"
                onChange={handleSpecializationChange}
                allowClear
                style={{ width: '100%' }}
                value={filters.specialization}
              >
                {DOCTOR_SPECIALIZATIONS.map(spec => (
                  <Option key={spec.value} value={spec.value}>{spec.label}</Option>
                ))}
              </Select>
            </Col>
            <Col xs={24} sm={12} lg={8}>
              <Space>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => openModal()}>
                  Thêm bác sĩ
                </Button>
                <Button icon={<ReloadOutlined />} onClick={fetchDoctors}>
                  Làm mới
                </Button>
                <Button icon={<ExportOutlined />}>Xuất Excel</Button>
              </Space>
            </Col>
          </Row>
        </Card>

        {/* Doctor Table */}
        <Card>
          <Table
            columns={columns}
            dataSource={filteredDoctors}
            rowKey="id"
            loading={loading}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} bác sĩ`,
            }}
            scroll={{ x: 1200 }}
          />
        </Card>

        {/* Create/Edit Doctor Modal */}
        <Modal
          title={editMode ? "Chỉnh sửa bác sĩ" : "Thêm bác sĩ mới"}
          open={modalVisible}
          onCancel={() => {
            setModalVisible(false);
            form.resetFields();
          }}
          footer={null}
          width={600}
        >
          <Form form={form} layout="vertical" onFinish={handleSubmit}>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item 
                  name="name" 
                  label="Tên bác sĩ" 
                  rules={[{ required: true, message: "Vui lòng nhập tên bác sĩ" }]}
                >
                  <Input placeholder="Nhập tên bác sĩ" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item 
                  name="customerId" 
                  label="Mã khách hàng"
                  rules={[{ required: true, message: "Vui lòng nhập mã khách hàng" }]}
                >
                  <InputNumber style={{ width: '100%' }} min={1} placeholder="Nhập mã khách hàng" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item 
                  name="specialization" 
                  label="Chuyên khoa" 
                  rules={[{ required: true, message: "Vui lòng chọn chuyên khoa" }]}
                >
                  <Select placeholder="Chọn chuyên khoa" allowClear>
                    {DOCTOR_SPECIALIZATIONS.map(spec => (
                      <Option key={spec.value} value={spec.value}>{spec.label}</Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item 
                  name="qualifications" 
                  label="Trình độ chuyên môn"
                >
                  <TextArea rows={2} placeholder="Mô tả trình độ chuyên môn..." />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item 
              name="workSchedule" 
              label="Lịch làm việc"
            >
              <TextArea rows={2} placeholder="Mô tả lịch làm việc của bác sĩ..." />
            </Form.Item>
            <div className="flex justify-end gap-3 mt-6">
              <Button onClick={() => {
                setModalVisible(false);
                form.resetFields();
              }}>
                Huỷ
              </Button>
              <Button type="primary" htmlType="submit">
                {editMode ? "Cập nhật" : "Thêm mới"}
              </Button>
            </div>
          </Form>
        </Modal>
      </div>
    </div>
  );
}