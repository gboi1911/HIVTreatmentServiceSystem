import React, { useState, useEffect } from "react";
import { Form, Input, Button, Upload, message, List, Card, Modal } from "antd";
import {
  UploadOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import {
  createBlog,
  updateBlog,
  deleteBlog,
  getBlogsByStaff,
} from "../api/blog";

const { TextArea } = Input;

export default function StaffBlogPage() {
  const [form] = Form.useForm();
  const [blogs, setBlogs] = useState([]);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);
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
  };

  const handleDelete = async (id) => {
    Modal.confirm({
      title: "Bạn có chắc muốn xóa blog này?",
      onOk: async () => {
        try {
          await deleteBlog(id, token);
          message.success("Đã xóa");
          fetchBlogs();
        } catch {
          message.error("Không thể xóa");
        }
      },
    });
  };

  return (
    <div className="px-8 py-12 bg-gray-50 min-h-screen">
      <h2 className="text-2xl text-black font-semibold mb-6">Quản lý Blog</h2>
      <Form
        layout="vertical"
        form={form}
        onFinish={handleSubmit}
        className="bg-white p-8 rounded shadow-md"
      >
        <Form.Item
          label="Tiêu đề"
          name="title"
          rules={[{ required: true, message: "Vui lòng nhập tiêu đề" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Nội dung"
          name="content"
          rules={[{ required: true, message: "Vui lòng nhập nội dung" }]}
        >
          <TextArea rows={5} />
        </Form.Item>
        <Form.Item label="Hình ảnh" name="image">
          <Upload listType="picture" maxCount={1} beforeUpload={() => false}>
            <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
          </Upload>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            {editing ? "Cập nhật blog" : "Tạo blog"}
          </Button>
        </Form.Item>
      </Form>

      <List
        itemLayout="vertical"
        dataSource={blogs}
        className="mt-8"
        renderItem={(item) => (
          <Card
            className="mb-4"
            title={item.title}
            extra={
              <>
                <Button
                  size="small"
                  type="link"
                  icon={<EditOutlined />}
                  onClick={() => handleEdit(item)}
                ></Button>
                <Button
                  size="small"
                  danger
                  type="link"
                  icon={<DeleteOutlined />}
                  onClick={() => handleDelete(item.blogId)}
                ></Button>
              </>
            }
          >
            <p>{item.content.slice(0, 150)}...</p>
            {item.image && (
              <img
                src={
                  item.image ||
                  "https://foundr.com/wp-content/uploads/2023/04/How-to-create-an-online-course.jpg"
                }
                alt="Hình blog"
                className="mt-2 rounded w-40 h-28 object-cover"
              />
            )}
            <p className="text-sm text-gray-500 mt-2">
              Ngày tạo: {new Date(item.createDate).toLocaleDateString("vi-VN")}
            </p>
          </Card>
        )}
      />
    </div>
  );
}
