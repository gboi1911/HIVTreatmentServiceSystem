import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { Button, Card } from 'antd';
import React, { useState, useEffect } from 'react'
const newsData = [
    {
        id: 1,
        image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=300&h=200&fit=crop",
        title: "Thông tin thuốc tháng 4/2025",
        date: "2025-01-15"
    },
    {
        id: 2,
        image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300&h=200&fit=crop",
        title: "Lần đầu Việt Nam có trung tâm can thiệp bào thai chuẩn Châu Âu (Báo Pháp Luật)",
        date: "2025-01-20"
    },
    {
        id: 3,
        image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300&h=200&fit=crop",
        title: "Khai mạc hội nghị Sản Phụ Khoa Việt - Pháp - Châu Á Thái Bình Dương 2025 lần thứ 25 (Truyền hình HTV)",
        date: "2025-01-25"
    },
    {
        id: 4,
        image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=300&h=200&fit=crop",
        title: "Cơ hội tiếp cận tiến bộ y học thế giới cho ngành sản phụ khoa Việt Nam (Báo Sức Khoẻ 24h)",
        date: "2025-02-01"
    },
    {
        id: 5,
        image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=300&h=200&fit=crop",
        title: "14 chuyên gia đầu ngành chia sẻ kiến thức mới nhất về Sản phụ khoa (Báo Giáo dục thời đại)",
        date: "2025-02-05"
    },
    {
        id: 6,
        image: "https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=300&h=200&fit=crop",
        title: "Hội thảo khoa học về công nghệ mới trong điều trị bệnh phụ khoa",
        date: "2025-02-10"
    }
];
function TechSection() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const itemsPerPage = 5;
    // const [itemsPerPage, setItemsPerPage] = useState(5);

    // // Update items per page based on screen size to match your responsive classes
    // useEffect(() => {
    //     const updateItemsPerPage = () => {
    //         const width = window.innerWidth;
    //         if (width < 640) setItemsPerPage(1);        // w-full (mobile)
    //         else if (width < 768) setItemsPerPage(2);   // sm:w-1/2
    //         else if (width < 1024) setItemsPerPage(3);  // md:w-1/3
    //         else if (width < 1280) setItemsPerPage(4);  // lg:w-1/4
    //         else setItemsPerPage(5);                    // xl:w-1/5
    //     };

    //     updateItemsPerPage();
    //     window.addEventListener('resize', updateItemsPerPage);
    //     return () => window.removeEventListener('resize', updateItemsPerPage);
    // }, []);
    const maxIndex = Math.max(0, newsData.length - itemsPerPage);

    const handlePrevious = () => {
        setCurrentIndex(prev => Math.max(0, prev - 1));
    };

    const handleNext = () => {
        setCurrentIndex(prev => Math.min(maxIndex, prev + 1));
    };

    const visibleItems = newsData.slice(currentIndex, currentIndex + itemsPerPage);
    
    return (
        <div className="w-full max-w-7xl mx-auto p-6 bg-white">
            <div className='mb-8'>
                <h2 className='text-2xl font-bold text-blue-600 text-center mb-6'>
                    Sức khoẻ và đời sống
                </h2>
            </div>
            <div className="relative mb-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {visibleItems.map((item, index) => (
                        <div key={item.id} className="">
                            <Card
                                hoverable
                                className="h-full shadow-md hover:shadow-lg transition-shadow duration-300"
                                cover={
                                    <div className="overflow-hidden">
                                        <img
                                            alt={item.title}
                                            src={item.image}
                                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                        />
                                    </div>
                                }
                                bodyStyle={{ padding: '12px' }}
                            >
                                <div className="h-20 flex items-start">
                                    <p className="text-sm text-gray-700 line-clamp-4 leading-tight">
                                        {item.title}
                                    </p>
                                </div>
                            </Card>
                        </div>
                    ))}
                </div>
            </div>
            <div className="flex justify-end mt-6 gap-2">
                <Button
                    type="default"
                    shape="circle"
                    icon={<LeftOutlined />}
                    onClick={handlePrevious}
                    disabled={currentIndex === 0}
                    className="w-10 h-10 flex items-center justify-center border-gray-300 hover:border-blue-400 hover:text-blue-500 disabled:opacity-50"
                />
                <Button
                    type="default"
                    shape="circle"
                    icon={<RightOutlined />}
                    onClick={handleNext}
                    disabled={currentIndex >= maxIndex}
                    className="w-10 h-10 flex items-center justify-center border-gray-300 hover:border-blue-400 hover:text-blue-500 disabled:opacity-50"
                />
            </div>
        </div>

    )
}

export default TechSection