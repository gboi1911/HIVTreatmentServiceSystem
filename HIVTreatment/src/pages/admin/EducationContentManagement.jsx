import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, message, Popconfirm, Space, Typography, Card, Row, Col } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import AdminSidebar from '../../components/AdminDashboard/AdminSidebar';
import {
  getEducationContents,
  createEducationContent,
  updateEducationContent,
  deleteEducationContent,
  searchEducationContentsByTitle
} from '../../api/educationContent';

const { Title } = Typography;

export default function EducationContentManagement() {
  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingContent, setEditingContent] = useState(null);
  const [form] = Form.useForm();
  const [searchValue, setSearchValue] = useState('');

  const fetchContents = async () => {
    setLoading(true);
    try {
      const data = await getEducationContents();
      setContents(Array.isArray(data) ? data : (data.data || []));
    } catch (err) {
      message.error('Không thể tải nội dung giáo dục.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContents();
  }, []);

  const handleSearch = async () => {
    setLoading(true);
    try {
      if (!searchValue) {
        fetchContents();
        return;
      }
      const results = await searchEducationContentsByTitle(searchValue);
      setContents(Array.isArray(results) ? results : (results.data || []));
    } catch (err) {
      message.error('Không tìm thấy kết quả phù hợp.');
    } finally {
      setLoading(false);
    }
  };

  const openModal = (content = null) => {
    setEditingContent(content);
    setModalVisible(true);
    if (content) {
      form.setFieldsValue({
        title: content.title,
        content: content.content,
        staffId: content.staffId || ''
      });
    } else {
      form.resetFields();
    }
  };

  const handleDelete = async (contentId) => {
    try {
      await deleteEducationContent(contentId);
      message.success('Xóa thành công!');
      fetchContents();
    } catch (err) {
      message.error('Xóa thất bại!');
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingContent) {
        await updateEducationContent(editingContent.postId, values);
        message.success('Cập nhật thành công!');
      } else {
        await createEducationContent(values);
        message.success('Tạo mới thành công!');
      }
      setModalVisible(false);
      fetchContents();
    } catch (err) {
      message.error('Lưu thất bại!');
    }
  };

  const columns = [
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Nội dung',
      dataIndex: 'content',
      key: 'content',
      ellipsis: true,
      render: (text) => <span>{text.length > 50 ? text.slice(0, 50) + '...' : text}</span>
    },
    {
      title: 'Người đăng',
      dataIndex: 'staffName',
      key: 'staffName',
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => date ? new Date(date).toLocaleDateString('vi-VN') : ''
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} size="small" onClick={() => openModal(record)} />
          <Popconfirm title="Xác nhận xóa?" onConfirm={() => handleDelete(record.postId)}>
            <Button icon={<DeleteOutlined />} size="small" danger />
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <div className="flex-1 ml-64 p-8">
        <div style={{ marginBottom: 24 }}>
          <Title level={2} style={{ marginBottom: 0, color: '#1e293b' }}>Quản lý nội dung giáo dục</Title>
          <Typography.Text type="secondary" style={{ fontSize: 16 }}>
            Thêm, chỉnh sửa, tìm kiếm và quản lý các bài viết, tài liệu giáo dục cho hệ thống.
          </Typography.Text>
        </div>
        <Card bordered={false} className="shadow-lg">
          <Row align="middle" justify="space-between" style={{ marginBottom: 24 }}>
            <Col>
              <Title level={3} style={{ margin: 0 }}>Quản lý nội dung giáo dục</Title>
            </Col>
            <Col>
              <Space>
                <Input
                  placeholder="Tìm kiếm theo tiêu đề"
                  value={searchValue}
                  onChange={e => setSearchValue(e.target.value)}
                  onPressEnter={handleSearch}
                  prefix={<SearchOutlined />}
                  allowClear
                  style={{ width: 220 }}
                />
                <Button icon={<ReloadOutlined />} onClick={fetchContents} />
                <Button type="primary" icon={<PlusOutlined />} onClick={() => openModal()}>Thêm mới</Button>
              </Space>
            </Col>
          </Row>
          <Table
            columns={columns}
            dataSource={contents}
            rowKey="postId"
            loading={loading}
            pagination={{ pageSize: 10 }}
          />
        </Card>
        <Modal
          title={editingContent ? 'Cập nhật nội dung' : 'Thêm nội dung mới'}
          open={modalVisible}
          onOk={handleModalOk}
          onCancel={() => setModalVisible(false)}
          okText="Lưu"
          cancelText="Hủy"
        >
          <Form form={form} layout="vertical">
            <Form.Item name="title" label="Tiêu đề" rules={[{ required: true, message: 'Nhập tiêu đề' }]}> 
              <Input />
            </Form.Item>
            <Form.Item name="content" label="Nội dung" rules={[{ required: true, message: 'Nhập nội dung' }]}> 
              <Input.TextArea rows={5} />
            </Form.Item>
            <Form.Item name="staffId" label="ID người đăng" rules={[{ required: true, message: 'Nhập ID người đăng' }]}> 
              <Input />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
} 