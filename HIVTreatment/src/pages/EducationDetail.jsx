import { useLocation, useNavigate } from "react-router-dom";
import { Typography, Button } from "antd";

const { Title, Text, Paragraph } = Typography;

export default function CourseDetailPage() {
  const { state: course } = useLocation();
  const navigate = useNavigate();

  if (!course) {
    return (
      <div className="p-8 min-h-screen text-center text-red-500">
        Không tìm thấy nội dung khóa học.
        <Button type="link" onClick={() => navigate("/education")}>
          Quay lại danh sách
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full px-8 py-12 bg-white min-h-screen">
      <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-md p-6">
        <img
          src="https://foundr.com/wp-content/uploads/2023/04/How-to-create-an-online-course.jpg"
          alt="Course"
          className="w-full max-h-96 object-cover rounded-lg mb-6"
        />
        <Title level={2}>{course.title}</Title>
        <Text type="secondary">
          Đăng bởi: {course.staffName} | Ngày tạo:{" "}
          {new Date(course.createdAt).toLocaleDateString("vi-VN")}
        </Text>
        <Paragraph className="mt-4 whitespace-pre-line leading-7 text-lg">
          {course.content}
        </Paragraph>
      </div>
    </div>
  );
}
