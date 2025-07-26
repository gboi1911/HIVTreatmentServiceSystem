import React, { useState, useEffect } from "react";
import { Form, Input, Button, Upload, message, List, Card, Modal, Typography, Space, Row, Col, Tag, Avatar } from "antd";
import {
  UploadOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  FileTextOutlined,
  CalendarOutlined,
  UserOutlined,
  EyeOutlined
} from "@ant-design/icons";
import {
  createBlog,
  updateBlog,
  deleteBlog,
  getBlogsByStaff,
} from "../api/blog";

const { Title, Text } = Typography;
const { TextArea } = Input;

export default function StaffBlogPage() {
  const [form] = Form.useForm();
  const [blogs, setBlogs] = useState([]);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const staffId = parseInt(localStorage.getItem("staffId"));
  const token = localStorage.getItem("token");

  const fetchBlogs = async () => {
    try {
      const data = await getBlogsByStaff(1, token);
      setBlogs(data);
    } catch {
      message.error("Không thể tải danh sách blog");
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, [token]);

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const payload = {
        ...values,
        staffId: 1,
        image: values.image?.file?.thumbUrl || "",
      };
      if (editing) {
        await updateBlog(editing.blogId, payload, token);
        message.success("Cập nhật thành công");
      } else {
        await createBlog(payload, token);
        message.success("Tạo mới thành công");
      }
      form.resetFields();
      setEditing(null);
      setModalVisible(false);
      fetchBlogs();
    } catch (err) {
      message.error("Lỗi khi lưu blog");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (blog) => {
    setEditing(blog);
    form.setFieldsValue({
      title: blog.title,
      content: blog.content,
    });
    setModalVisible(true);
  };

  const handleDelete = async (id) => {
    Modal.confirm({
      title: "Bạn có chắc muốn xóa blog này?",
      content: "Hành động này không thể hoàn tác.",
      okText: "Xóa",
      cancelText: "Hủy",
      okType: "danger",
      onOk: async () => {
        try {
          await deleteBlog(id, token);
          message.success("Đã xóa thành công");
          fetchBlogs();
        } catch {
          message.error("Không thể xóa");
        }
      },
    });
  };

  const openCreateModal = () => {
    setEditing(null);
    form.resetFields();
    setModalVisible(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <Title level={2} style={{ margin: 0, color: '#1e293b' }}>
                Quản lý Blog & Tin tức
              </Title>
              <Text type="secondary" style={{ fontSize: 16 }}>
                Tạo và quản lý các bài viết blog, tin tức cho cộng đồng
              </Text>
            </div>
            <Button 
              type="primary" 
              size="large" 
              icon={<PlusOutlined />}
              onClick={openCreateModal}
              className="bg-gradient-to-r from-blue-600 to-purple-600 border-none shadow-lg hover:shadow-xl"
            >
              Tạo Blog Mới
            </Button>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <Row gutter={[24, 24]}>
          {/* Blog List */}
          <Col xs={24} lg={16}>
            <Card 
              title={
                <div className="flex items-center gap-2">
                  <FileTextOutlined className="text-blue-600" />
                  <span>Danh sách Blog ({blogs.length})</span>
                </div>
              }
              className="shadow-lg border-0 rounded-xl"
            >
              {blogs.length === 0 ? (
                <div className="text-center py-12">
                  <FileTextOutlined style={{ fontSize: 48, color: '#d1d5db' }} />
                  <Title level={4} style={{ marginTop: 16, color: '#6b7280' }}>
                    Chưa có blog nào
                  </Title>
                  <Text type="secondary">
                    Bắt đầu tạo blog đầu tiên của bạn
                  </Text>
                </div>
              ) : (
                <List
                  itemLayout="vertical"
                  dataSource={blogs}
                  renderItem={(item) => (
                    <Card
                      className="mb-4 hover:shadow-md transition-all duration-200 border border-gray-100"
                      bodyStyle={{ padding: 20 }}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <Avatar 
                              size="small" 
                              icon={<UserOutlined />}
                              className="bg-blue-100 text-blue-600"
                            />
                            <Text type="secondary" style={{ fontSize: 14 }}>
                              {item.staffName || 'Staff'}
                            </Text>
                            <Tag color="blue" style={{ margin: 0 }}>
                              <CalendarOutlined style={{ marginRight: 4 }} />
                              {new Date(item.createDate).toLocaleDateString("vi-VN")}
                            </Tag>
                          </div>
                          
                          <Title level={4} style={{ marginBottom: 8, color: '#1e293b' }}>
                            {item.title}
                          </Title>
                          
                          <Text type="secondary" style={{ lineHeight: 1.6 }}>
                            {item.content.length > 200 
                              ? item.content.slice(0, 200) + '...' 
                              : item.content
                            }
                          </Text>
                          
                          {item.image && (
                            <div className="mt-4">
                              <img
                                src={item.image || "https://via.placeholder.com/300x200"}
                                alt="Blog thumbnail"
                                className="rounded-lg w-full max-w-xs h-32 object-cover"
                              />
                            </div>
                          )}
                        </div>
                        
                        <Space direction="vertical" size="small">
                          <Button 
                            type="text" 
                            icon={<EditOutlined />} 
                            onClick={() => handleEdit(item)}
                            className="text-blue-600 hover:text-blue-700"
                          />
                          <Button 
                            type="text" 
                            danger
                            icon={<DeleteOutlined />} 
                            onClick={() => handleDelete(item.blogId)}
                            className="text-red-600 hover:text-red-700"
                          />
                        </Space>
                      </div>
                    </Card>
                  )}
                />
              )}
            </Card>
          </Col>

          {/* Stats Card */}
          <Col xs={24} lg={8}>
            <Card className="shadow-lg border-0 rounded-xl">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileTextOutlined style={{ fontSize: 24, color: 'white' }} />
                </div>
                <Title level={3} style={{ marginBottom: 8 }}>
                  {blogs.length}
                </Title>
                <Text type="secondary">Blog đã tạo</Text>
              </div>
              
              <div className="mt-6 space-y-3">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <Text>Blog mới nhất</Text>
                  <Text strong>
                    {blogs.length > 0 
                      ? new Date(blogs[0]?.createDate).toLocaleDateString("vi-VN")
                      : 'Chưa có'
                    }
                  </Text>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <Text>Trạng thái</Text>
                  <Tag color="green">Hoạt động</Tag>
                </div>
              </div>
            </Card>
          </Col>
        </Row>
      </div>

      {/* Create/Edit Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <FileTextOutlined className="text-blue-600" />
            {editing ? "Chỉnh sửa Blog" : "Tạo Blog Mới"}
          </div>
        }
        open={modalVisible}
        onOk={() => form.submit()}
        onCancel={() => {
          setModalVisible(false);
          setEditing(null);
          form.resetFields();
        }}
        okText={editing ? "Cập nhật" : "Tạo mới"}
        cancelText="Hủy"
        width={600}
        confirmLoading={loading}
      >
        <Form 
          form={form} 
          layout="vertical" 
          onFinish={handleSubmit}
          className="mt-4"
        >
          <Form.Item
            label="Tiêu đề"
            name="title"
            rules={[{ required: true, message: "Vui lòng nhập tiêu đề" }]}
          >
            <Input 
              placeholder="Nhập tiêu đề blog..."
              size="large"
            />
          </Form.Item>
          
          <Form.Item
            label="Nội dung"
            name="content"
            rules={[{ required: true, message: "Vui lòng nhập nội dung" }]}
          >
            <TextArea 
              rows={6} 
              placeholder="Nhập nội dung blog..."
              showCount
              maxLength={2000}
            />
          </Form.Item>
          
          <Form.Item label="Hình ảnh" name="image">
            <Upload 
              listType="picture-card" 
              maxCount={1} 
              beforeUpload={() => false}
              className="w-full"
            >
              <div>
                <UploadOutlined />
                <div style={{ marginTop: 8 }}>Tải ảnh</div>
              </div>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
