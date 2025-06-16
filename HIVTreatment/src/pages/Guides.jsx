import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Button, 
  Tag, 
  Typography, 
  Avatar, 
  Divider, 
  Space, 
  Badge,
  Row,
  Col,
  Statistic,
  Carousel,
  Tabs
} from 'antd';
import {
  LeftOutlined,
  RightOutlined,
  CalendarOutlined,
  ArrowRightOutlined,
  SafetyCertificateOutlined,
  TeamOutlined,
  TrophyOutlined,
  ClockCircleOutlined,
  MedicineBoxOutlined,
  HeartOutlined,
  SmileOutlined,
  UserOutlined,
  EyeOutlined,
  StarFilled
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

const newsData = [
    {
        id: 1,
        image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=400&h=250&fit=crop",
        title: "Hội nghị Sản Phụ Khoa Việt – Pháp 2025: chuyển sâu – chuyển giá – chuyển giao tri thức",
        date: "2025-01-15",
        category: "Hội nghị",
        readTime: "5 phút",
        participants: "200+",
        featured: true,
        rating: 4.9,
        views: 1250
    },
    {
        id: 2,
        image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=250&fit=crop",
        title: "Cập nhật kiến thức – kết nối thế hệ tại hội nghị Sản Phụ Khoa Việt – Pháp 2025",
        date: "2025-01-20",
        category: "Sự kiện",
        readTime: "3 phút",
        participants: "150+",
        rating: 4.8,
        views: 980
    },
    {
        id: 3,
        image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=250&fit=crop",
        title: "Hội nghị Sản Phụ Khoa Việt – Pháp 2025: cập nhật toàn diện tri thức chăm sóc tuyến và, nội soi để hiểm muộn",
        date: "2025-01-25",
        category: "Nghiên cứu",
        readTime: "7 phút",
        participants: "300+",
        rating: 4.9,
        views: 1580
    },
    {
        id: 4,
        image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=250&fit=crop",
        title: "Hội nghị Sản Phụ Khoa Việt – Pháp 2025: chuổi phiên khoa học sáng 8/5: cập nhật sâu sắng – hội nhập toàn diện",
        date: "2025-02-01",
        category: "Khoa học",
        readTime: "4 phút",
        participants: "180+",
        rating: 4.7,
        views: 1120
    },
    {
        id: 5,
        image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=250&fit=crop",
        title: "Bệnh viện Từ Dũ vinh dự đón nhận chứng nhận Trung tâm can thiệp báo thai chuẩn Châu Âu đầu tiên tại Việt Nam",
        date: "2025-02-05",
        category: "Tin tức",
        readTime: "6 phút",
        participants: "500+",
        featured: true,
        rating: 5.0,
        views: 2340
    },
    {
        id: 6,
        image: "https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=400&h=250&fit=crop",
        title: "Hội thảo khoa học về công nghệ mới trong điều trị bệnh phụ khoa",
        date: "2025-02-10",
        category: "Công nghệ",
        readTime: "8 phút",
        participants: "250+",
        rating: 4.8,
        views: 1450
    }
];

const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
};

const getCategoryColor = (category) => {
    const colors = {
        'Hội nghị': 'blue',
        'Sự kiện': 'green',
        'Nghiên cứu': 'purple',
        'Khoa học': 'orange',
        'Tin tức': 'red',
        'Công nghệ': 'cyan'
    };
    return colors[category] || 'blue';
};

export default function Guides() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(3);
    const [activeTab, setActiveTab] = useState('1');
    const carouselRef = React.useRef();

    useEffect(() => {
        const updateItemsPerPage = () => {
            const width = window.innerWidth;
            if (width < 640) setItemsPerPage(1);
            else if (width < 1024) setItemsPerPage(2);
            else setItemsPerPage(3);
        };

        updateItemsPerPage();
        window.addEventListener('resize', updateItemsPerPage);
        return () => window.removeEventListener('resize', updateItemsPerPage);
    }, []);

    const sections = [
        { 
            key: '1',
            name: 'Bảng giá', 
            icon: <SafetyCertificateOutlined />, 
            description: 'Chi phí dịch vụ minh bạch và cạnh tranh'
        },
        { 
            key: '2',
            name: 'Khám thai', 
            icon: <SmileOutlined />, 
            description: 'Chăm sóc thai kỳ chuyên nghiệp với công nghệ hiện đại'
        },
        { 
            key: '3',
            name: 'Dịch vụ sanh/mổ', 
            icon: <HeartOutlined />, 
            description: 'Dịch vụ sinh nở an toàn với tiêu chuẩn quốc tế'
        },
        { 
            key: '4',
            name: 'Khám Phụ Khoa', 
            icon: <MedicineBoxOutlined />, 
            description: 'Chuyên khoa phụ nữ với đội ngũ bác sĩ giàu kinh nghiệm'
        },
        { 
            key: '5',
            name: 'Khám Hiếm muộn', 
            icon: <HeartOutlined />, 
            description: 'Hỗ trợ sinh sản và điều trị hiếm muộn hiệu quả'
        },
        { 
            key: '6',
            name: 'Khám Nhi', 
            icon: <UserOutlined />, 
            description: 'Chăm sóc sức khỏe toàn diện cho trẻ em'
        }
    ];

    const handleNext = () => {
        carouselRef.current?.next();
    };

    const handlePrev = () => {
        carouselRef.current?.prev();
    };

    const renderNewsCard = (item) => (
        <div key={item.id} className="px-3">
            <Badge.Ribbon 
                text={item.featured ? "Nổi bật" : ""} 
                color="gold"
                className={!item.featured ? "hidden" : ""}
            >
                <Card
                    hoverable
                    className="h-full shadow-md hover:shadow-xl transition-all duration-300 border-0"
                    cover={
                        <div className="relative overflow-hidden">
                            <img
                                alt={item.title}
                                src={item.image}
                                className="h-48 w-full object-cover transition-transform duration-300 hover:scale-105"
                            />
                            <div className="absolute top-3 left-3">
                                <Tag color={getCategoryColor(item.category)} className="font-medium">
                                    {item.category}
                                </Tag>
                            </div>
                            <div className="absolute bottom-3 right-3 bg-black bg-opacity-60 text-white px-2 py-1 rounded text-xs">
                                <Space size={4}>
                                    <EyeOutlined />
                                    {item.views}
                                </Space>
                            </div>
                        </div>
                    }
                    bodyStyle={{ padding: '20px' }}
                >
                    <div className="mb-4">
                        <Space className="text-gray-500 text-sm mb-3" split={<Divider type="vertical" />}>
                            <Space size={4}>
                                <CalendarOutlined />
                                {formatDate(item.date)}
                            </Space>
                            <Space size={4}>
                                <TeamOutlined />
                                {item.participants}
                            </Space>
                            <Space size={4}>
                                <ClockCircleOutlined />
                                {item.readTime}
                            </Space>
                        </Space>
                        
                        <Title level={4} className="!mb-3 !text-gray-800 leading-tight" ellipsis={{ rows: 2 }}>
                            {item.title}
                        </Title>
                        
                        <div className="flex items-center justify-between">
                            <Space size={4}>
                                <StarFilled className="text-yellow-500" />
                                <Text strong className="text-gray-700">{item.rating}</Text>
                            </Space>
                            
                            <Button 
                                type="link" 
                                className="!p-0 !text-blue-600 hover:!text-blue-700 font-medium"
                                icon={<ArrowRightOutlined />}
                            >
                                Xem chi tiết
                            </Button>
                        </div>
                    </div>
                </Card>
            </Badge.Ribbon>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Professional Header */}
            <div className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between py-6">
                        <div className="flex items-center space-x-4">
                            <Avatar 
                                size={48} 
                                className="bg-blue-600 flex items-center justify-center"
                                icon={<MedicineBoxOutlined className="text-xl" />}
                            />
                            <div>
                                <Title level={3} className="!mb-0 !text-gray-900">
                                    Bệnh viện Từ Dũ
                                </Title>
                                <Text className="text-gray-600">
                                    Chăm sóc sức khỏe chuyên nghiệp
                                </Text>
                            </div>
                        </div>
                        
                        <div className="hidden md:flex items-center space-x-8">
                            <Space size={16} className="text-sm">
                                <Space size={4} className="text-green-600">
                                    <SafetyCertificateOutlined />
                                    <Text>Chứng nhận ISO 9001</Text>
                                </Space>
                                <Space size={4} className="text-blue-600">
                                    <TrophyOutlined />
                                    <Text>Tiêu chuẩn Châu Âu</Text>
                                </Space>
                            </Space>
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Tabs 
                        activeKey={activeTab} 
                        onChange={setActiveTab}
                        size="large"
                        className="professional-tabs"
                    >
                        {sections.map((section) => (
                            <TabPane
                                tab={
                                    <div className="flex items-center space-x-2 py-2">
                                        <span className="text-lg">{section.icon}</span>
                                        <div className="text-left">
                                            <div className="font-medium">{section.name}</div>
                                            <div className="text-xs text-gray-500 hidden lg:block">
                                                {section.description}
                                            </div>
                                        </div>
                                    </div>
                                }
                                key={section.key}
                            />
                        ))}
                    </Tabs>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center space-x-3 px-6 py-4 bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
                        <div className="text-blue-600 text-2xl">
                            {sections.find(s => s.key === activeTab)?.icon}
                        </div>
                        <div className="text-left">
                            <Title level={2} className="!mb-1 !text-gray-900">
                                {sections.find(s => s.key === activeTab)?.name}
                            </Title>
                            <Text className="text-gray-600">
                                {sections.find(s => s.key === activeTab)?.description}
                            </Text>
                        </div>
                    </div>
                </div>

                {/* News Carousel */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <Title level={3} className="!mb-0">
                            Tin tức & Sự kiện
                        </Title>
                        <Space>
                            <Button
                                shape="circle"
                                icon={<LeftOutlined />}
                                onClick={handlePrev}
                                className="shadow-sm"
                            />
                            <Button
                                shape="circle"
                                icon={<RightOutlined />}
                                onClick={handleNext}
                                className="shadow-sm"
                            />
                        </Space>
                    </div>

                    <Carousel
                        ref={carouselRef}
                        dots={true}
                        slidesToShow={itemsPerPage}
                        slidesToScroll={1}
                        responsive={[
                            {
                                breakpoint: 1024,
                                settings: {
                                    slidesToShow: 2,
                                }
                            },
                            {
                                breakpoint: 640,
                                settings: {
                                    slidesToShow: 1,
                                }
                            }
                        ]}
                        className="professional-carousel"
                    >
                        {newsData.map(renderNewsCard)}
                    </Carousel>
                </div>

                {/* Additional Info */}
                <div className="text-center">
                    <Text type="secondary">
                        Hiển thị {newsData.length} bài viết • Cập nhật lần cuối: {formatDate(new Date().toISOString())}
                    </Text>
                </div>
            </div>

            {/* Custom Styles */}
            <style jsx global>{`
                .professional-tabs .ant-tabs-nav {
                    margin-bottom: 0;
                }
                
                .professional-tabs .ant-tabs-tab {
                    padding: 16px 20px;
                    border-radius: 8px 8px 0 0;
                    margin-right: 4px;
                }
                
                .professional-tabs .ant-tabs-tab-active {
                    background: #f0f9ff;
                    border-color: #3b82f6;
                }
                
                .professional-carousel .ant-carousel .slick-dots {
                    bottom: -40px;
                }
                
                .professional-carousel .ant-carousel .slick-dots li button {
                    background: #d1d5db;
                    border-radius: 4px;
                    width: 24px;
                    height: 4px;
                }
                
                .professional-carousel .ant-carousel .slick-dots li.slick-active button {
                    background: #3b82f6;
                }
                
                .ant-statistic-content {
                    text-align: center;
                }
            `}</style>
        </div>
    );
}