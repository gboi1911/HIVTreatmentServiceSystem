import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, message, Popconfirm, Space, Typography, Card, Row, Col } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import AdminSidebar from '../../components/AdminDashboard/AdminSidebar';
import {
  getBlogs,
  createBlog,
  updateBlog,
  deleteBlog,
  searchBlogsByTitle
} from '../../api/blog';

const { Title } = Typography;

export default function BlogManagement() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [form] = Form.useForm();
  const [searchValue, setSearchValue] = useState('');

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const data = await getBlogs();
      setBlogs(Array.isArray(data) ? data : (data.data || []));
    } catch (err) {
      message.error('Không thể tải danh sách blog.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleSearch = async () => {
    setLoading(true);
    try {
      if (!searchValue) {
        fetchBlogs();
        return;
      }
      const results = await searchBlogsByTitle(searchValue);
      setBlogs(Array.isArray(results) ? results : (results.data || []));
    } catch (err) {
      message.error('Không tìm thấy kết quả phù hợp.');
    } finally {
      setLoading(false);
    }
  };

  const openModal = (blog = null) => {
    setEditingBlog(blog);
    setModalVisible(true);
    if (blog) {
      form.setFieldsValue({
        title: blog.title,
        content: blog.content,
        staffId: blog.staffId || ''
      });
    } else {
      form.resetFields();
    }
  };

  const handleDelete = async (blogId) => {
    try {
      await deleteBlog(blogId);
      message.success('Xóa thành công!');
      fetchBlogs();
    } catch (err) {
      message.error('Xóa thất bại!');
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingBlog) {
        await updateBlog(editingBlog.blogId, values);
        message.success('Cập nhật thành công!');
      } else {
        await createBlog(values);
        message.success('Tạo mới thành công!');
      }
      setModalVisible(false);
      fetchBlogs();
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
      dataIndex: 'createDate',
      key: 'createDate',
      render: (date) => date ? new Date(date).toLocaleDateString('vi-VN') : ''
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} size="small" onClick={() => openModal(record)} />
          <Popconfirm title="Xác nhận xóa?" onConfirm={() => handleDelete(record.blogId)}>
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
          <Title level={2} style={{ marginBottom: 0, color: '#1e293b' }}>Quản lý Blog/Tin tức</Title>
          <Typography.Text type="secondary" style={{ fontSize: 16 }}>
            Thêm, chỉnh sửa, tìm kiếm và quản lý các bài viết blog, tin tức cho hệ thống.
          </Typography.Text>
        </div>
        <Card bordered={false} className="shadow-lg">
          <Row align="middle" justify="space-between" style={{ marginBottom: 24 }}>
            <Col>
              <Title level={3} style={{ margin: 0 }}>Danh sách Blog/Tin tức</Title>
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
                <Button icon={<ReloadOutlined />} onClick={fetchBlogs} />
                <Button type="primary" icon={<PlusOutlined />} onClick={() => openModal()}>Thêm mới</Button>
              </Space>
            </Col>
          </Row>
          <Table
            columns={columns}
            dataSource={blogs}
            rowKey="blogId"
            loading={loading}
            pagination={{ pageSize: 10 }}
          />
        </Card>
        <Modal
          title={editingBlog ? 'Cập nhật Blog/Tin tức' : 'Thêm Blog/Tin tức mới'}
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