import React, { useState, useEffect } from 'react';
import { Button, Card, Tag, Typography } from 'antd';
import { LeftOutlined, CalendarOutlined, RightOutlined, MedicineBoxOutlined, ExperimentOutlined, HeartOutlined, EyeOutlined, StarOutlined, ArrowUpOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const techData = [
    {
        id: 1,
        image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=500&fit=crop&q=60",
        title: "Nhật thức ma tuý",
        date: "2025-01-20"
    },
    {
        id: 2,
        image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=500&fit=crop&q=60",
        title: "Câu chuyện thành công",
        date: "2025-01-20"
    },
    {
        id: 3,
        image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=500&fit=crop&q=60",
        title: "Kỹ năng phòng tránh",
        date: "2025-01-20"
    },
    {
        id: 4,
        image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=500&fit=crop&q=60",
        title: "Chương trình cộng đồng",
        date: "2025-01-20"
    },
    {
        id: 5,
        image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=500&fit=crop&q=60",
        title: "Ứng dụng AI trong chẩn đoán hình ảnh y khoa",
        date: "2025-01-20"
    },
    {
        id: 6,
        image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=500&fit=crop&q=60",
        title: "Robot phẫu thuật thế hệ mới: Chính xác và an toàn hơn",
        date: "2025-01-20"
    }
];

export default function CategorySection() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(3);
    const [isAnimating, setIsAnimating] = useState(false);
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };
    useEffect(() => {
        const updateItemsPerPage = () => {
            const width = window.innerWidth;
            if (width < 640) setItemsPerPage(1);
            else if (width < 768) setItemsPerPage(2);
            else if (width < 1024) setItemsPerPage(3);
            else setItemsPerPage(4);
        };

        updateItemsPerPage();
        window.addEventListener('resize', updateItemsPerPage);
        return () => window.removeEventListener('resize', updateItemsPerPage);
    }, []);

    const maxIndex = Math.max(0, techData.length - itemsPerPage);

    const handleSlide = (direction) => {
        if (isAnimating) return;

        setIsAnimating(true);

        if (direction === 'prev') {
            setCurrentIndex(prev => Math.max(0, prev - 1));
        } else {
            setCurrentIndex(prev => Math.min(maxIndex, prev + 1));
        }

        setTimeout(() => setIsAnimating(false), 500);
    };

    const getCategoryColor = (category) => {
        const colors = {
            'Phẫu thuật': 'blue',
            'Tim mạch': 'red',
            'Công nghệ': 'purple',
            'Nghiên cứu': 'orange',
            'Robot': 'cyan',
            'Chẩn đoán': 'green'
        };
        return colors[category] || 'blue';
    };

    const getMedicalIcon = (department) => {
        const icons = {
            'Ngoại khoa': <MedicineBoxOutlined />,
            'Tim mạch': <HeartOutlined />,
            'Sản khoa': <StarOutlined />,
            'Nhi khoa': <StarOutlined />,
            'Chẩn đoán': <EyeOutlined />,
            'Phẫu thuật': <ExperimentOutlined />
        };
        return icons[department] || <MedicineBoxOutlined />;
    };

    return (
        <div className="w-full max-w-7xl mx-auto p-8 bg-gradient-to-br from-slate-50 to-purple-50 min-h-screen">
            {/* Header Section */}
            <div className="text-center mb-16">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-600 rounded-xl mb-6 shadow-lg">
                    <MedicineBoxOutlined className="text-2xl" style={{
                        color: "white"
                    }} />
                </div>
                <Title
                    level={1}
                    className="!text-4xl !font-bold !bg-gradient-to-r !from-purple-600 !to-blue-400 !bg-clip-text !text-transparent !mb-4"
                >
                    Chuyên mục
                </Title>
                <Text className="!text-lg !text-gray-600 max-w-2xl mx-auto block">
                    Khám phá các bài viết chuyên sâu, tin tức mới nhất và kiến thức chuyên ngành từ các chuyên gia y tế hàng đầu
                </Text>
            </div>

            {/* Medical Tech Cards Container */}
            <div className="relative mb-12 overflow-hidden rounded-3xl">
                <div
                    className="flex transition-transform duration-500 ease-out gap-6"
                    style={{
                        transform: `translateX(-${currentIndex * (100 / itemsPerPage)}%)`,
                        width: `${(techData.length / itemsPerPage) * 100}%`
                    }}
                >
                    {techData.map((item) => (
                        <div
                            key={item.id}
                            className="flex-shrink-0 px-3"
                            style={{ width: `${100 / techData.length}%` }}
                        >
                            <Card
                                hoverable
                                className="group h-full !shadow-lg hover:!shadow-2xl !transition-all !duration-500 !border-gray-100 !rounded-2xl overflow-hidden"
                                cover={
                                    <div className="relative overflow-hidden bg-gradient-to-br from-emerald-100 to-teal-100">
                                        <img
                                            alt={item.title}
                                            src={item.image}
                                            className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                        {/* Gradient Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                                        {/* Hover Icon */}
                                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                                            <Button
                                                type="text"
                                                shape="circle"
                                                size="small"
                                                icon={<ArrowUpOutlined className="text-emerald-600" />}
                                                className="!bg-white/90 !backdrop-blur-sm !border-0 !shadow-sm"
                                            />
                                        </div>
                                    </div>
                                }
                                bodyStyle={{ padding: '24px' }}
                            >

                                <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                                    <CalendarOutlined />
                                    <Text type="secondary">{formatDate(item.date)}</Text>
                                </div>
                                <Title
                                    level={4}
                                    className="!text-lg !font-semibold !text-gray-800 !leading-snug group-hover:!text-purple-600 !transition-colors !duration-300 !mb-4"
                                    ellipsis={{ rows: 3 }}
                                >
                                    {item.title}
                                </Title>
                                <div className="pt-4 border-t border-gray-100">
                                    <Button
                                        type="link"
                                        className="!p-0 !h-auto !text-purple-600 hover:!text-purple-700 !font-medium group/btn"
                                        icon={<EyeOutlined/>}
                                        onClick={() => console.log("Xem chi tiết:", item.id)}
                                    >
                                        Xem chi tiết
                                    </Button>
                                </div>
                            </Card>
                        </div>
                    ))}
                </div>
            </div>

            {/* Navigation Controls */}
            <div className="flex items-center justify-between">
                {/* Pagination Dots */}
                <div className="flex items-center gap-2">
                    {Array.from({ length: maxIndex + 1 }, (_, i) => (
                        <Button
                            key={i}
                            type="text"
                            size="small"
                            onClick={() => !isAnimating && setCurrentIndex(i)}
                            className={`!w-2 !h-2 !min-w-0 !p-0 !rounded-full !transition-all !duration-300 !border-0 ${i === currentIndex
                                    ? '!bg-purple-600 !w-8'
                                    : '!bg-gray-300 hover:!bg-gray-400'
                                }`}
                        />
                    ))}
                </div>

                {/* Arrow Controls */}
                <div className="flex items-center gap-3">
                    <Button
                        type="default"
                        shape="circle"
                        size="large"
                        icon={<LeftOutlined />}
                        onClick={() => handleSlide('prev')}
                        disabled={currentIndex === 0 || isAnimating}
                        className="!w-12 !h-12 !shadow-lg hover:!shadow-xl !border-gray-200 hover:!border-purple-300 !transition-all !duration-300 disabled:!opacity-40 group/arrow"
                    />

                    <Button
                        type="default"
                        shape="circle"
                        size="large"
                        icon={<RightOutlined />}
                        onClick={() => handleSlide('next')}
                        disabled={currentIndex >= maxIndex || isAnimating}
                        className="!w-12 !h-12 !shadow-lg hover:!shadow-xl !border-gray-200 hover:!border-purple-300 !transition-all !duration-300 disabled:!opacity-40 group/arrow"
                    />
                </div>
            </div>
        </div>
    );
}