import React, { useState, useEffect } from 'react';
import { Card, Button, Tag, Avatar, Divider, Badge, Image, Typography, Space, Row, Col, Spin, message } from 'antd';
import { CalendarOutlined, UserOutlined, EyeOutlined, ShareAltOutlined, ClockCircleOutlined, EnvironmentOutlined, PhoneOutlined, MailOutlined, ArrowLeftOutlined, FileTextOutlined } from '@ant-design/icons';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { getBlogById, getBlogs } from '../api/blog';

const { Title, Text, Paragraph } = Typography;

const BlogDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [blog, setBlog] = useState(null);
    const [relatedBlogs, setRelatedBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBlogData = async () => {
            try {
                setLoading(true);
                const blogData = await getBlogById(id);
                setBlog(blogData);
                
                // Fetch related blogs (excluding current blog)
                const allBlogs = await getBlogs();
                const filteredBlogs = Array.isArray(allBlogs) ? allBlogs.filter(b => b.blogId !== parseInt(id)) : [];
                setRelatedBlogs(filteredBlogs.slice(0, 4));
            } catch (err) {
                console.error('Error fetching blog:', err);
                setError('Không thể tải thông tin blog');
                message.error('Không thể tải thông tin blog');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchBlogData();
        }
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <Spin size="large" />
                    <Text className="block mt-4">Đang tải...</Text>
                </div>
            </div>
        );
    }

    if (error || !blog) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <Title level={3} style={{ color: '#ef4444' }}>Không tìm thấy blog</Title>
                    <Text type="secondary">Blog này có thể đã bị xóa hoặc không tồn tại</Text>
                    <div className="mt-4">
                        <Button type="primary" onClick={() => navigate('/')}>
                            Về trang chủ
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    const categories = [
        "Tin tức", "Sức khỏe", "Y tế", "Cộng đồng",
        "Giáo dục", "Phòng bệnh", "Điều trị", "Chăm sóc"
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
                                    {blog.title}
                                </h1>
                                
                                <div className="flex items-center space-x-6 text-sm text-gray-600 pb-6 border-b border-gray-100">
                                    <div className="flex items-center space-x-2">
                                        <Avatar size="small" icon={<UserOutlined />} className="bg-blue-100 text-blue-600" />
                                        <span>{blog.staffName || 'Staff'}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <CalendarOutlined />
                                        <span>{new Date(blog.createDate).toLocaleDateString("vi-VN")}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <ClockCircleOutlined />
                                        <span>{Math.ceil(blog.content?.length / 200)} phút đọc</span>
                                    </div>
                                </div>
                            </div>

                            {/* Article Content */}
                            <div className="p-8">
                                {blog.image && (
                                <div className="mb-8">
                                    <img
                                            src={blog.image}
                                            alt={blog.title}
                                        className="w-full h-64 md:h-80 object-cover rounded-lg mb-4"
                                    />
                                    </div>
                                )}

                                <div className="prose max-w-none">
                                    <Paragraph className="text-lg text-gray-800 leading-relaxed mb-6 font-medium">
                                        {blog.content}
                                    </Paragraph>
                                </div>

                                <Divider />

                                {/* Source */}
                                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                                    <h4 className="font-semibold text-gray-900 mb-2">Thông tin bài viết</h4>
                                    <div className="text-sm text-gray-600">
                                        <p><strong>Tác giả:</strong> {blog.staffName || 'Staff'}</p>
                                        <p><strong>Ngày đăng:</strong> {new Date(blog.createDate).toLocaleDateString("vi-VN")}</p>
                                        <p><strong>Blog ID:</strong> {blog.blogId}</p>
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

                        {/* Related Articles */}
                        {relatedBlogs.length > 0 && (
                        <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                                <Title level={3} className="mb-6">Bài viết liên quan</Title>
                                <Row gutter={[16, 16]}>
                                    {relatedBlogs.map((item) => (
                                        <Col xs={24} sm={12} key={item.blogId}>
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
                                                            <FileTextOutlined style={{ fontSize: 48, color: '#d1d5db' }} />
                                                        </div>
                                                    )
                                                }
                                                onClick={() => navigate(`/blog/${item.blogId}`)}
                                            >
                                                <Card.Meta
                                                    title={
                                                        <Link to={`/blog/${item.blogId}`} className="text-gray-900 hover:text-blue-600">
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
                                                                    {new Date(item.createDate).toLocaleDateString("vi-VN")}
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
                                <Title level={4} className="mb-4">Liên hệ tư vấn</Title>
                                <Space direction="vertical" size="middle" className="w-full">
                                    <Button type="primary" block icon={<PhoneOutlined />}>
                                        Đặt lịch tư vấn
                                    </Button>
                                    <Button block icon={<MailOutlined />}>
                                        Gửi email
                                    </Button>
                                </Space>
                            </div>
                        </Card>

                        {/* Categories */}
                        <Card title="Chuyên mục" size="small" className="shadow-sm">
                            <div className="flex flex-wrap gap-2">
                                {categories.map((category, index) => (
                                    <Tag key={index} color="blue" className="mb-2 cursor-pointer hover:bg-blue-50">
                                        {category}
                                    </Tag>
                                ))}
                            </div>
                        </Card>

                        {/* Recent News Sidebar */}
                        {relatedBlogs.length > 0 && (
                            <Card title="Bài viết gần đây" size="small" className="shadow-sm">
                            <div className="space-y-4">
                                    {relatedBlogs.slice(0, 3).map((item) => (
                                        <div key={item.blogId} className="flex space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded" onClick={() => navigate(`/blog/${item.blogId}`)}>
                                            {item.image ? (
                                        <img
                                            src={item.image}
                                            alt={item.title}
                                            className="w-16 h-12 object-cover rounded flex-shrink-0"
                                        />
                                            ) : (
                                                <div className="w-16 h-12 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
                                                    <FileTextOutlined style={{ color: '#d1d5db' }} />
                                                </div>
                                            )}
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-sm font-medium text-gray-900 line-clamp-2 mb-1">
                                                {item.title}
                                            </h4>
                                                <p className="text-xs text-gray-500">{new Date(item.createDate).toLocaleDateString("vi-VN")}</p>
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

export default BlogDetail;