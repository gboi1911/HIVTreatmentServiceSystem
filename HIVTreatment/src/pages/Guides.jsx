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
  Tabs,
  Tooltip
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
  StarFilled,
  FireOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import { motion, AnimatePresence } from 'framer-motion';

const { Title, Text } = Typography;
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
    const [hoveredCard, setHoveredCard] = useState(null);

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
            description: 'Chi phí dịch vụ minh bạch và cạnh tranh',
            color: 'bg-blue-50 text-blue-600 border-blue-200'
        },
        { 
            key: '2',
            name: 'Khám thai', 
            icon: <SmileOutlined />, 
            description: 'Chăm sóc thai kỳ chuyên nghiệp với công nghệ hiện đại',
            color: 'bg-pink-50 text-pink-600 border-pink-200'
        },
        { 
            key: '3',
            name: 'Dịch vụ sanh/mổ', 
            icon: <HeartOutlined />, 
            description: 'Dịch vụ sinh nở an toàn với tiêu chuẩn quốc tế',
            color: 'bg-red-50 text-red-600 border-red-200'
        },
        { 
            key: '4',
            name: 'Khám Phụ Khoa', 
            icon: <MedicineBoxOutlined />, 
            description: 'Chuyên khoa phụ nữ với đội ngũ bác sĩ giàu kinh nghiệm',
            color: 'bg-purple-50 text-purple-600 border-purple-200'
        },
        { 
            key: '5',
            name: 'Khám Hiếm muộn', 
            icon: <HeartOutlined />, 
            description: 'Hỗ trợ sinh sản và điều trị hiếm muộn hiệu quả',
            color: 'bg-green-50 text-green-600 border-green-200'
        },
        { 
            key: '6',
            name: 'Khám Nhi', 
            icon: <UserOutlined />, 
            description: 'Chăm sóc sức khỏe toàn diện cho trẻ em',
            color: 'bg-orange-50 text-orange-600 border-orange-200'
        }
    ];

    const handleNext = () => {
        setCurrentIndex((prev) => 
            prev >= newsData.length - itemsPerPage ? 0 : prev + 1
        );
    };

    const handlePrev = () => {
        setCurrentIndex((prev) => 
            prev <= 0 ? newsData.length - itemsPerPage : prev - 1
        );
    };

    const getCurrentNews = () => {
        return newsData.slice(currentIndex, currentIndex + itemsPerPage);
    };

    const renderNewsCard = (item, index) => (
        <motion.div 
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group"
            onMouseEnter={() => setHoveredCard(item.id)}
            onMouseLeave={() => setHoveredCard(null)}
        >
            <div className="relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden border border-gray-100">
                {/* Featured Badge */}
                {item.featured && (
                    <div className="absolute top-4 left-4 z-10">
                        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow-lg">
                            <FireOutlined className="text-xs" />
                            Nổi bật
                        </div>
                    </div>
                )}

                {/* Image Section */}
                <div className="relative h-52 overflow-hidden">
                    <img
                        alt={item.title}
                        src={item.image}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Category Tag */}
                    <div className="absolute top-4 right-4">
                        <Tag 
                            color={getCategoryColor(item.category)} 
                            className="border-0 shadow-md font-medium"
                        >
                            {item.category}
                        </Tag>
                    </div>

                    {/* Views Counter */}
                    <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm text-gray-700 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                        <EyeOutlined />
                        {item.views.toLocaleString()}
                    </div>
                </div>

                {/* Content Section */}
                <div className="p-6">
                    {/* Meta Information */}
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                        <div className="flex items-center gap-1">
                            <CalendarOutlined className="text-xs" />
                            {formatDate(item.date)}
                        </div>
                        <div className="flex items-center gap-1">
                            <ClockCircleOutlined className="text-xs" />
                            {item.readTime}
                        </div>
                        <div className="flex items-center gap-1">
                            <TeamOutlined className="text-xs" />
                            {item.participants}
                        </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors duration-300">
                        {item.title}
                    </h3>

                    {/* Bottom Section */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-2">
                            <div className="flex text-yellow-400">
                                <StarFilled />
                            </div>
                            <span className="text-sm font-semibold text-gray-700">{item.rating}</span>
                        </div>
                        
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-md hover:shadow-lg"
                        >
                            Xem chi tiết
                            <ArrowRightOutlined className="text-xs" />
                        </motion.button>
                    </div>
                </div>
            </div>
        </motion.div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
            {/* Enhanced Header */}
            <div className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50 backdrop-blur-sm bg-white/95">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between py-6">
                        <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center space-x-4"
                        >
                            <div className="relative">
                                <Avatar 
                                    size={56} 
                                    className="bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg"
                                    icon={<MedicineBoxOutlined className="text-2xl" />}
                                />
                                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                            </div>
                            <div>
                                <Title level={2} className="!mb-1 !text-gray-900 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                    Bệnh viện Từ Dũ
                                </Title>
                                <Text className="text-gray-600 font-medium">
                                    Chăm sóc sức khỏe chuyên nghiệp • Tin cậy hàng đầu
                                </Text>
                            </div>
                        </motion.div>
                        
                        <div className="hidden md:flex items-center space-x-6">
                            <motion.div 
                                whileHover={{ scale: 1.05 }}
                                className="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-lg border border-green-200"
                            >
                                <CheckCircleOutlined />
                                <span className="font-medium">Chứng nhận ISO 9001</span>
                            </motion.div>
                            <motion.div 
                                whileHover={{ scale: 1.05 }}
                                className="flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-lg border border-blue-200"
                            >
                                <TrophyOutlined />
                                <span className="font-medium">Tiêu chuẩn Châu Âu</span>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Enhanced Navigation */}
            <div className="bg-white border-b border-gray-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex space-x-1 overflow-x-auto py-4 scrollbar-hide">
                        {sections.map((section, index) => (
                            <motion.button
                                key={section.key}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                    duration: 0.3,
                                    delay: index * 0.1
                                }}
                                onClick={() => setActiveTab(section.key)}
                                className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300
                                ${activeTab === section.key ? section.color : 'text-gray-700 hover:bg-gray-100'}`}
                            >
                                <span className="text-xl">{section.icon}</span>
                                <span className="hidden sm:inline">{section.name}</span>
                            </motion.button>
                        ))}
                    </div>
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
                            <div className="font-medium">{sections.find(s => s.key === activeTab)?.name}</div>
                            <div className="text-xs text-gray-500 hidden lg:block">
                                {sections.find(s => s.key === activeTab)?.description}
                            </div>
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

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {getCurrentNews().map(renderNewsCard)}
                    </div>
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