import React, { useEffect, useState } from "react";
import { Form, Input, Button, Upload, message, List, Card, Modal, Typography, Row, Col, Tag, Avatar, Space, Divider } from "antd";
import {
  UploadOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  BookOutlined,
  CalendarOutlined,
  UserOutlined,
  FileTextOutlined,
  ReloadOutlined
} from "@ant-design/icons";
import {
  createEducationContent,
  getEducationContentsByStaff,
  updateEducationContent,
  deleteEducationContent,
} from "../api/educationContent";

const { TextArea } = Input;
const { Title, Text, Paragraph } = Typography;

export default function StaffEducationPage() {
  const [form] = Form.useForm();
  const [courses, setCourses] = useState([]);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const staffId = parseInt(localStorage.getItem("staffId"));
  const token = localStorage.getItem("token");

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const data = await getEducationContentsByStaff(3, token);
      console.log('Education courses data:', data); // Debug log
      setCourses(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching education courses:', err);
      message.error("Không thể tải danh sách khóa học");
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [token]);

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const payload = {
        ...values,
        staffId: 3,
        image: values.image?.file?.thumbUrl || "",
      };
      if (editing) {
        await updateEducationContent(editing.postId, payload, token);
        message.success("Cập nhật thành công");
      } else {
        await createEducationContent(payload, token);
        message.success("Tạo mới thành công");
      }
      form.resetFields();
      setEditing(null);
      setModalVisible(false);
      fetchCourses();
    } catch (err) {
      console.error('Error saving education content:', err);
      message.error("Lỗi khi lưu khóa học");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (course) => {
    setEditing(course);
    form.setFieldsValue({
      title: course.title,
      content: course.content,
    });
    setModalVisible(true);
  };

  const handleDelete = async (id) => {
    Modal.confirm({
      title: "Bạn có chắc muốn xóa khóa học này?",
      content: "Hành động này không thể hoàn tác.",
      okText: "Xóa",
      cancelText: "Hủy",
      okType: "danger",
      onOk: async () => {
        try {
          await deleteEducationContent(id, token);
          message.success("Đã xóa khóa học");
          fetchCourses();
        } catch (err) {
          console.error('Error deleting education content:', err);
          message.error("Không thể xóa khóa học");
        }
      },
    });
  };

  const openModal = () => {
    setEditing(null);
    form.resetFields();
    setModalVisible(true);
  };

  const getFirstSentence = (text) => {
    if (!text) return '';
    const match = text.match(/^(.*?\.)\s/);
    return match ? match[1] : text;
  };

  return (
    <div className="px-8 py-12 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <Title level={2} className="text-gray-800 mb-2">
                Quản lý khóa học
              </Title>
              <Text type="secondary" className="text-lg">
                Tạo và quản lý các khóa học giáo dục về HIV/AIDS
              </Text>
            </div>
            <Button 
              type="primary" 
              size="large" 
              icon={<PlusOutlined />}
              onClick={openModal}
              className="bg-gradient-to-r from-blue-500 to-blue-600 border-0 shadow-lg hover:shadow-xl"
            >
              Tạo khóa học mới
            </Button>
          </div>
        </div>

        {/* Stats Section */}
        <Row gutter={[16, 16]} className="mb-8">
          <Col xs={24} sm={8}>
            <Card className="text-center shadow-sm">
              <BookOutlined style={{ fontSize: 32, color: '#1890ff' }} />
              <div className="mt-4">
                <Title level={3} style={{ margin: 0 }}>{courses.length}</Title>
                <Text type="secondary">Tổng khóa học</Text>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card className="text-center shadow-sm">
              <CalendarOutlined style={{ fontSize: 32, color: '#52c41a' }} />
              <div className="mt-4">
                <Title level={3} style={{ margin: 0 }}>
                  {courses.length > 0 
                    ? new Date(courses[0]?.createdAt).toLocaleDateString("vi-VN")
                    : 'Chưa có'
                  }
                </Title>
                <Text type="secondary">Khóa học mới nhất</Text>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card className="text-center shadow-sm">
              <UserOutlined style={{ fontSize: 32, color: '#faad14' }} />
              <div className="mt-4">
                <Title level={3} style={{ margin: 0 }}>Staff</Title>
                <Text type="secondary">Tác giả</Text>
              </div>
            </Card>
          </Col>
        </Row>

        {/* Courses List */}
        <Row gutter={[24, 24]}>
          <Col xs={24} lg={16}>
            <Card 
              title={
                <div className="flex items-center justify-between">
                  <span>Danh sách khóa học</span>
                  <Button 
                    icon={<ReloadOutlined />} 
                    onClick={fetchCourses}
                    loading={loading}
                  >
                    Làm mới
                  </Button>
                </div>
              }
              className="shadow-sm"
            >
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                  <Text className="block mt-4">Đang tải...</Text>
                </div>
              ) : courses.length > 0 ? (
                <Row gutter={[16, 16]}>
                  {courses.map((course) => (
                    <Col xs={24} md={12} key={course.postId}>
                      <Card
                        hoverable
                        className="h-full shadow-sm hover:shadow-md transition-all duration-200"
                        bodyStyle={{ padding: 0 }}
                      >
                        <div className="relative">
                          <img
                            src={course.image || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=200&fit=crop"}
                            alt={course.title}
                            className="w-full h-40 object-cover rounded-t-lg"
                          />
                          <div className="absolute top-3 left-3">
                            <Tag color="blue" className="font-medium">KHÓA HỌC</Tag>
                          </div>
                        </div>
                        
                        <div className="p-4">
                          <Title level={4} className="mb-2 line-clamp-2" style={{ 
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden'
                          }}>
                            {course.title}
                          </Title>
                          
                          <Paragraph 
                            type="secondary" 
                            className="mb-3 line-clamp-2"
                            style={{ 
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden'
                            }}
                          >
                            {getFirstSentence(course.content)}
                          </Paragraph>
                          
                          <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                            <div className="flex items-center gap-1">
                              <CalendarOutlined />
                              <span>
                                {course.createdAt 
                                  ? new Date(course.createdAt).toLocaleDateString("vi-VN")
                                  : 'Chưa có ngày'
                                }
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex gap-2">
                            <Button 
                              type="primary" 
                              size="small" 
                              icon={<EditOutlined />}
                              onClick={() => handleEdit(course)}
                            >
                              Chỉnh sửa
                            </Button>
                            <Button 
                              danger 
                              size="small" 
                              icon={<DeleteOutlined />}
                              onClick={() => handleDelete(course.postId)}
                            >
                              Xóa
                            </Button>
                          </div>
                        </div>
                      </Card>
                    </Col>
                  ))}
                </Row>
              ) : (
                <div className="text-center py-12">
                  <BookOutlined style={{ fontSize: 64, color: '#d1d5db' }} />
                  <Title level={4} style={{ marginTop: 16, color: '#6b7280' }}>
                    Chưa có khóa học nào
                  </Title>
                  <Text type="secondary" className="block mb-4">
                    Bắt đầu tạo khóa học đầu tiên của bạn
                  </Text>
                  <Button 
                    type="primary" 
                    icon={<PlusOutlined />}
                    onClick={openModal}
                  >
                    Tạo khóa học mới
                  </Button>
                </div>
              )}
            </Card>
          </Col>

          {/* Quick Actions Sidebar */}
          <Col xs={24} lg={8}>
            <Card title="Thao tác nhanh" className="shadow-sm">
              <Space direction="vertical" size="middle" className="w-full">
                <Button 
                  type="primary" 
                  block 
                  icon={<PlusOutlined />}
                  onClick={openModal}
                >
                  Tạo khóa học mới
                </Button>
                <Button 
                  block 
                  icon={<FileTextOutlined />}
                  onClick={() => window.open('/education', '_blank')}
                >
                  Xem trang công khai
                </Button>
                <Button 
                  block 
                  icon={<ReloadOutlined />}
                  onClick={fetchCourses}
                  loading={loading}
                >
                  Làm mới danh sách
                </Button>
              </Space>
            </Card>
          </Col>
        </Row>

        {/* Create/Edit Modal */}
        <Modal
          title={editing ? "Chỉnh sửa khóa học" : "Tạo khóa học mới"}
          open={modalVisible}
          onCancel={() => setModalVisible(false)}
          footer={null}
          width={800}
        >
          <Form
            layout="vertical"
            form={form}
            onFinish={handleSubmit}
          >
            <Form.Item
              label="Tiêu đề khóa học"
              name="title"
              rules={[{ required: true, message: "Vui lòng nhập tiêu đề" }]}
            >
              <Input placeholder="Nhập tiêu đề khóa học" size="large" />
            </Form.Item>

            <Form.Item
              label="Nội dung"
              name="content"
              rules={[{ required: true, message: "Vui lòng nhập nội dung" }]}
            >
              <TextArea 
                rows={8} 
                placeholder="Nhập nội dung khóa học chi tiết..."
                showCount
                maxLength={5000}
              />
            </Form.Item>

            <Form.Item
              label="Hình ảnh"
              name="image"
            >
              <Upload
                listType="picture-card"
                maxCount={1}
                beforeUpload={() => false}
              >
                <div>
                  <UploadOutlined />
                  <div style={{ marginTop: 8 }}>Tải lên</div>
                </div>
              </Upload>
            </Form.Item>

            <Form.Item className="mb-0">
              <Space>
                <Button type="primary" htmlType="submit" loading={loading}>
                  {editing ? "Cập nhật" : "Tạo mới"}
                </Button>
                <Button onClick={() => setModalVisible(false)}>
                  Hủy
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
}
