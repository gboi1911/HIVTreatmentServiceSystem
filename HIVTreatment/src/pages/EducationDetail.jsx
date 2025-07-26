import React, { useState, useEffect } from 'react';
import { Card, Button, Tag, Avatar, Divider, Typography, Space, Row, Col, Spin, message } from 'antd';
import { CalendarOutlined, UserOutlined, BookOutlined, ShareAltOutlined, ClockCircleOutlined, ArrowLeftOutlined, FileTextOutlined } from '@ant-design/icons';
import { Link, useParams, useNavigate, useLocation } from 'react-router-dom';
import { getEducationContentById, getEducationContents } from '../api/educationContent';

const { Title, Text, Paragraph } = Typography;

const EducationDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [course, setCourse] = useState(location.state?.course || null);
    const [relatedCourses, setRelatedCourses] = useState([]);
    const [loading, setLoading] = useState(!location.state?.course);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCourseData = async () => {
            // If we already have course data from navigation state, use it
            if (location.state?.course) {
                console.log('Using course data from navigation state:', location.state.course);
                setCourse(location.state.course);
                setLoading(false);
                return;
            }

            // If no ID, show error
            if (!id) {
                console.error('No course ID provided');
                setError('Không có ID khóa học');
                setLoading(false);
                return;
            }

            try {
                console.log('Fetching course data for ID:', id);
                setLoading(true);
                setError(null);
                
                const courseData = await getEducationContentById(id);
                console.log('Course data received:', courseData);
                setCourse(courseData);
                
                // Fetch related courses (excluding current course)
                console.log('Fetching related courses...');
                const allCourses = await getEducationContents();
                console.log('All courses received:', allCourses);
                
                const filteredCourses = Array.isArray(allCourses) 
                    ? allCourses.filter(c => c.postId !== parseInt(id)) 
                    : [];
                setRelatedCourses(filteredCourses.slice(0, 4));
                
            } catch (err) {
                console.error('Error fetching course:', err);
                setError('Không thể tải thông tin khóa học');
                message.error('Không thể tải thông tin khóa học');
            } finally {
                setLoading(false);
            }
        };

        fetchCourseData();
    }, [id]); // Remove location.state from dependency array to prevent infinite loops

    // Debug logging
    useEffect(() => {
        console.log('EducationDetail state:', {
            id,
            course,
            loading,
            error,
            hasLocationState: !!location.state?.course
        });
    }, [id, course, loading, error, location.state]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <Spin size="large" />
                    <Text className="block mt-4">Đang tải khóa học...</Text>
                    <Text type="secondary" className="block mt-2">ID: {id}</Text>
                </div>
            </div>
        );
    }

    if (error || !course) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <Title level={3} style={{ color: '#ef4444' }}>Không tìm thấy khóa học</Title>
                    <Text type="secondary">
                        {error || 'Khóa học này có thể đã bị xóa hoặc không tồn tại'}
                    </Text>
                    <div className="mt-4">
                        <Button type="primary" onClick={() => navigate('/education')}>
                            Về danh sách khóa học
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    const categories = [
        "HIV/AIDS", "Phòng bệnh", "Điều trị", "Tư vấn",
        "Giáo dục", "Cộng đồng", "Y tế", "Chăm sóc"
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-3">
                        <article className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-8">
                            {/* Article Header */}
                            <div className="p-8 pb-0">
                                <div className="flex items-center justify-between mb-6">
                                    <Button 
                                        type="text" 
                                        icon={<ArrowLeftOutlined />} 
                                        onClick={() => navigate(-1)}
                                        className="text-gray-600 hover:text-blue-600"
                                    >
                                        Quay lại
                                    </Button>
                                    <div className="flex items-center space-x-2">
                                        <Button type="text" size="small" icon={<ShareAltOutlined />} className="text-gray-500 hover:text-blue-600" />
                                    </div>
                                </div>
                                
                                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight mb-6">
                                    {course.title}
                                </h1>
                                
                                <div className="flex items-center space-x-6 text-sm text-gray-600 pb-6 border-b border-gray-100">
                                    <div className="flex items-center space-x-2">
                                        <Avatar size="small" icon={<UserOutlined />} className="bg-green-100 text-green-600" />
                                        <span>{course.staffName || 'Staff'}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <CalendarOutlined />
                                        <span>{new Date(course.createdAt).toLocaleDateString("vi-VN")}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <ClockCircleOutlined />
                                        <span>{Math.ceil(course.content?.length / 200)} phút đọc</span>
                                    </div>
                                </div>
                            </div>

                            {/* Article Content */}
                            <div className="p-8">
                                {course.image && (
                                    <div className="mb-8">
                                        <img
                                            src={course.image}
                                            alt={course.title}
                                            className="w-full h-64 md:h-80 object-cover rounded-lg mb-4"
                                        />
                                    </div>
                                )}

                                <div className="prose max-w-none">
                                    <Paragraph className="text-lg text-gray-800 leading-relaxed mb-6 font-medium">
                                        {course.content}
                                    </Paragraph>
                                </div>

                                <Divider />

                                {/* Course Info */}
                                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                                    <h4 className="font-semibold text-gray-900 mb-2">Thông tin khóa học</h4>
                                    <div className="text-sm text-gray-600">
                                        <p><strong>Tác giả:</strong> {course.staffName || 'Staff'}</p>
                                        <p><strong>Ngày đăng:</strong> {new Date(course.createdAt).toLocaleDateString("vi-VN")}</p>
                                        <p><strong>ID khóa học:</strong> {course.postId}</p>
                                    </div>
                                </div>

                                {/* Comments Section */}
                                <div className="border-t border-gray-100 pt-6">
                                    <h4 className="font-semibold text-gray-900 mb-3">Bình luận (0)</h4>
                                    <p className="text-gray-600 text-sm">
                                        Vui lòng <Link to="/login" className="text-blue-600 hover:text-blue-800 hover:underline">đăng nhập</Link> để bình luận
                                    </p>
                                </div>
                            </div>
                        </article>

                        {/* Related Courses */}
                        {relatedCourses.length > 0 && (
                            <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                                <Title level={3} className="mb-6">Khóa học liên quan</Title>
                                <Row gutter={[16, 16]}>
                                    {relatedCourses.map((item) => (
                                        <Col xs={24} sm={12} key={item.postId}>
                                            <Card 
                                                hoverable 
                                                className="h-full"
                                                cover={
                                                    item.image ? (
                                                        <img
                                                            alt={item.title}
                                                            src={item.image}
                                                            className="h-48 object-cover"
                                                        />
                                                    ) : (
                                                        <div className="h-48 bg-gray-100 flex items-center justify-center">
                                                            <BookOutlined style={{ fontSize: 48, color: '#d1d5db' }} />
                                                        </div>
                                                    )
                                                }
                                                onClick={() => navigate(`/education/${item.postId}`)}
                                            >
                                                <Card.Meta
                                                    title={
                                                        <Link to={`/education/${item.postId}`} className="text-gray-900 hover:text-blue-600">
                                                            {item.title}
                                                        </Link>
                                                    }
                                                    description={
                                                        <div className="mt-2">
                                                            <Text type="secondary" className="text-sm">
                                                                {item.content?.length > 100 
                                                                    ? item.content.slice(0, 100) + '...' 
                                                                    : item.content
                                                                }
                                                            </Text>
                                                            <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
                                                                <span className="flex items-center gap-1">
                                                                    <UserOutlined />
                                                                    {item.staffName || 'Staff'}
                                                                </span>
                                                                <span className="flex items-center gap-1">
                                                                    <CalendarOutlined />
                                                                    {new Date(item.createdAt).toLocaleDateString("vi-VN")}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    }
                                                />
                                            </Card>
                                        </Col>
                                    ))}
                                </Row>
                            </section>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Quick Links */}
                        <Card size="small" className="shadow-sm">
                            <div className="text-center">
                                <Title level={4} className="mb-4">Tài liệu liên quan</Title>
                                <Space direction="vertical" size="middle" className="w-full">
                                    <Button type="primary" block icon={<BookOutlined />}>
                                        Tài liệu PDF
                                    </Button>
                                    <Button block icon={<FileTextOutlined />}>
                                        Video hướng dẫn
                                    </Button>
                                </Space>
                            </div>
                        </Card>

                        {/* Categories */}
                        <Card title="Chuyên mục" size="small" className="shadow-sm">
                            <div className="flex flex-wrap gap-2">
                                {categories.map((category, index) => (
                                    <Tag key={index} color="green" className="mb-2 cursor-pointer hover:bg-green-50">
                                        {category}
                                    </Tag>
                                ))}
                            </div>
                        </Card>

                        {/* Recent Courses Sidebar */}
                        {relatedCourses.length > 0 && (
                            <Card title="Khóa học gần đây" size="small" className="shadow-sm">
                                <div className="space-y-4">
                                    {relatedCourses.slice(0, 3).map((item) => (
                                        <div key={item.postId} className="flex space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded" onClick={() => navigate(`/education/${item.postId}`)}>
                                            {item.image ? (
                                                <img
                                                    src={item.image}
                                                    alt={item.title}
                                                    className="w-16 h-12 object-cover rounded flex-shrink-0"
                                                />
                                            ) : (
                                                <div className="w-16 h-12 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
                                                    <BookOutlined style={{ color: '#d1d5db' }} />
                                                </div>
                                            )}
                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-sm font-medium text-gray-900 line-clamp-2 mb-1">
                                                    {item.title}
                                                </h4>
                                                <p className="text-xs text-gray-500">{new Date(item.createdAt).toLocaleDateString("vi-VN")}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        )}

                        {/* Contact Info */}
                        <Card title="Thông tin liên hệ" size="small" className="shadow-sm">
                            <div className="space-y-3 text-sm">
                                <div>
                                    <strong>Địa chỉ:</strong>
                                    <p className="text-gray-600">123 Đường ABC, Quận 1, TP.HCM</p>
                                </div>
                                <div>
                                    <strong>Điện thoại:</strong>
                                    <p className="text-gray-600">(028) 1234-5678</p>
                                </div>
                                <div>
                                    <strong>Email:</strong>
                                    <p className="text-gray-600">info@benhvien.com</p>
                                </div>
                                <div>
                                    <strong>Giờ làm việc:</strong>
                                    <p className="text-gray-600">7:00 - 17:00 (T2-T7)</p>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EducationDetail;
