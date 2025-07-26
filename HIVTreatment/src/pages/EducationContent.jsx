// EducationPage.jsx
import { useEffect, useState } from "react";
import { Card, Col, Row, Typography, Spin, message, Input, Tag, Avatar, Space, Button } from "antd";
import { useNavigate } from "react-router-dom";
import { getEducationContents, searchEducationContentsByTitle } from "../api/educationContent";
import { CalendarOutlined, UserOutlined, FileTextOutlined, SearchOutlined, BookOutlined, ReloadOutlined } from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;
const { Search } = Input;

export default function EducationPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchData();
  }, [token]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await getEducationContents(token);
      console.log('Education content data:', data); // Debug log
      setCourses(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching education content:', err);
      message.error("Không thể tải nội dung khoá học.");
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (value) => {
    if (!value.trim()) {
      fetchData();
      return;
    }

    try {
      setLoading(true);
      const results = await searchEducationContentsByTitle(value);
      setCourses(Array.isArray(results) ? results : []);
    } catch (err) {
      console.error('Error searching education content:', err);
      message.error("Không tìm thấy kết quả phù hợp.");
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCourseClick = (course) => {
    console.log('Course clicked:', course); // Debug log
    
    // Check if course has an ID field
    const courseId = course.postId || course.id || course.post_id;
    
    if (courseId) {
      navigate(`/education/${courseId}`, { state: course });
    } else {
      console.error('Course has no ID:', course);
      message.error('Không thể mở khóa học này');
    }
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
        <div className="text-center mb-12">
          <Title level={2} className="text-rose-600 mb-4">
            Khóa học về HIV/AIDS
          </Title>
          <Text type="secondary" className="text-lg">
            Tài liệu giáo dục và hướng dẫn chuyên sâu về HIV/AIDS
          </Text>
        </div>

        {/* Search Section */}
        <div className="max-w-2xl mx-auto mb-10">
          <Search
            placeholder="Tìm kiếm khóa học theo tiêu đề..."
            allowClear
            enterButton={
              <Button type="primary" icon={<SearchOutlined />}>
                Tìm kiếm
              </Button>
            }
            size="large"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onSearch={handleSearch}
            onPressEnter={() => handleSearch(searchValue)}
          />
        </div>

        {/* Stats Section */}
        <div className="mb-8">
          <Row gutter={16} justify="center">
            <Col>
              <Card size="small" className="text-center">
                <BookOutlined style={{ fontSize: 24, color: '#1890ff' }} />
                <div className="mt-2">
                  <Text strong>{courses.length}</Text>
                  <br />
                  <Text type="secondary">Khóa học</Text>
                </div>
              </Card>
            </Col>
          </Row>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <Spin size="large" />
            <Text className="block mt-4">Đang tải khóa học...</Text>
          </div>
        ) : (
          <>
            {courses.length > 0 ? (
              <Row gutter={[24, 24]}>
                {courses.map((course, index) => {
                  const courseId = course.postId || course.id || course.post_id;
                  return (
                    <Col xs={24} md={12} lg={8} key={courseId || index}>
                      <Card
                        hoverable
                        className="h-full shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100"
                        bodyStyle={{ padding: 0 }}
                        onClick={() => handleCourseClick(course)}
                      >
                        <div className="relative">
                          <img
                            alt={course.title}
                            src={course.image || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=250&fit=crop"}
                            className="h-48 object-cover w-full rounded-t-lg"
                          />
                          <div className="absolute top-3 left-3">
                            <Tag color="blue" className="font-medium">KHÓA HỌC</Tag>
                          </div>
                        </div>
                        
                        <div className="p-6">
                          <Title level={4} className="mb-3 line-clamp-2" style={{ 
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden'
                          }}>
                            {course.title}
                          </Title>
                          
                          <Paragraph 
                            type="secondary" 
                            className="mb-4 line-clamp-3"
                            style={{ 
                              display: '-webkit-box',
                              WebkitLineClamp: 3,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                              lineHeight: '1.5'
                            }}
                          >
                            {getFirstSentence(course.content)}
                          </Paragraph>
                          
                          <div className="flex items-center justify-between text-sm text-gray-500">
                            <div className="flex items-center gap-2">
                              <Avatar size="small" icon={<UserOutlined />} className="bg-green-100 text-green-600" />
                              <span>{course.staffName || 'Staff'}</span>
                            </div>
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
                        </div>
                      </Card>
                    </Col>
                  );
                })}
              </Row>
            ) : (
              <div className="text-center py-20">
                <BookOutlined style={{ fontSize: 64, color: '#d1d5db' }} />
                <Title level={4} style={{ marginTop: 16, color: '#6b7280' }}>
                  {searchValue ? 'Không tìm thấy khóa học phù hợp' : 'Chưa có khóa học nào'}
                </Title>
                <Text type="secondary" className="block mb-4">
                  {searchValue 
                    ? 'Hãy thử tìm kiếm với từ khóa khác'
                    : 'Hãy quay lại sau để xem các khóa học mới'
                  }
                </Text>
                {searchValue && (
                  <Button 
                    type="primary" 
                    icon={<ReloadOutlined />}
                    onClick={() => {
                      setSearchValue("");
                      fetchData();
                    }}
                  >
                    Xem tất cả khóa học
                  </Button>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
