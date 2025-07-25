// EducationPage.jsx
import { useEffect, useState } from "react";
import { Card, Col, Row, Typography, Spin, message, Input } from "antd";
import { useNavigate } from "react-router-dom";
import { getEducationContents } from "../api/educationContent";
import { searchEducationContentsByTitle } from "../api/educationContent";

const { Title, Text } = Typography;
const { Search } = Input;

export default function EducationPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getEducationContents(token);
        setCourses(data);
      } catch (err) {
        message.error("Không thể tải nội dung khoá học.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const handleSearch = async (value) => {
    try {
      setLoading(true);
      const results = await searchEducationContentsByTitle(value);
      setCourses(results);
    } catch (err) {
      message.error("Không tìm thấy kết quả phù hợp.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <Title level={2} className="text-center text-rose-600 mb-6">
        Khóa học về HIV/AIDS
      </Title>

      <div className="max-w-xl mx-auto mb-10">
        <Search
          placeholder="Tìm kiếm theo tiêu đề..."
          allowClear
          enterButton="Tìm kiếm"
          size="large"
          onSearch={handleSearch}
        />
      </div>

      {loading ? (
        <div className="text-center py-20">
          <Spin size="large" />
        </div>
      ) : (
        <Row gutter={[24, 24]}>
          {courses.map((course) => (
            <Col xs={24} md={12} lg={8} key={course.postId}>
              <Card
                hoverable
                cover={
                  <img
                    alt={course.title}
                    src="https://foundr.com/wp-content/uploads/2023/04/How-to-create-an-online-course.jpg" // Placeholder image
                    className="h-48 object-cover w-full"
                  />
                }
                onClick={() =>
                  navigate(`/education/${course.postId}`, { state: course })
                }
                className="rounded-xl shadow-md"
              >
                <Title level={4}>{course.title}</Title>
                <Text type="secondary">Đăng bởi: {course.staffName}</Text>
                <br />
                <Text type="secondary">
                  Ngày: {new Date(course.createdAt).toLocaleDateString("vi-VN")}
                </Text>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
}
