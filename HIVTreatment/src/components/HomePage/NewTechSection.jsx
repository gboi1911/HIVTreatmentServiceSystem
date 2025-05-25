import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { Button, Card } from 'antd';
import React, { useState, useEffect } from 'react'
const techData = [
    {
        id: 1,
        image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=500&fit=crop&q=60",
        title: "Khít hàm sau chấn thương – Một thách thức trong phẫu thuật cắn phối hợp liên chuyên...",
    },
    {
        id: 2,
        image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=500&fit=crop&q=60",
        title: "Cứu sống thai nhi bị suy tim bào thai nặng do tổn thương dẫn truyền nhĩ thất (Block...",
    },
    {
        id: 3,
        image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=500&fit=crop&q=60",
        title: "Can thiệp tim bào thai – Giấc mơ lớn thành hiện thực",
    },
    {
        id: 4,
        image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=500&fit=crop&q=60",
        title: "Bước tiến đáng tự hào trong Can thiệp tim bào thai. Chào đón 2025 với niềm hy vọng...",
    },
    {
        id: 5,
        image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=500&fit=crop&q=60",
        title: "Ứng dụng AI trong chẩn đoán hình ảnh y khoa",
    },
    {
        id: 6,
        image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=500&fit=crop&q=60",
        title: "Robot phẫu thuật thế hệ mới: Chính xác và an toàn hơn",
    }
];

export default function NewTechSection() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(4);

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

    const handlePrevious = () => {
        setCurrentIndex(prev => Math.max(0, prev - 1));
    };

    const handleNext = () => {
        setCurrentIndex(prev => Math.min(maxIndex, prev + 1));
    };

    const visibleItems = techData.slice(currentIndex, currentIndex + itemsPerPage);

    return (
        <div className="w-full max-w-7xl mx-auto p-6 bg-gray-50">
            <div className='mb-8'>
                <h2 className='text-2xl font-bold text-blue-700 text-center mb-6'>
                    Thành công và Kỹ thuật mới
                </h2>
            </div>
            <div className="relative mb-6">
                <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5`}>
                    {visibleItems.map((item) => (
                        <div key={item.id}
                             className="relative h-80 rounded-lg overflow-hidden shadow-lg group cursor-pointer">
                            <img
                                src={item.image}
                                alt={item.title}
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black/50    transition-opacity duration-300 group-hover:bg-opacity-60"></div>
                            
                            <div className="absolute inset-0 p-5 flex flex-col justify-end text-white">
                                <p className="text-base font-semibold leading-tight mb-3 line-clamp-4">
                                    {item.title}
                                </p>
                                <Button
                                    className="mt-auto self-start px-4 py-2 border border-white text-white text-xs font-medium rounded-md hover:bg-white hover:text-blue-700 transition-colors duration-300"
                                    onClick={() => console.log("Xem them:", item.id)}
                                >
                                    Xem thêm
                                </Button>
                            </div>
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
                    className="w-10 h-10 flex items-center justify-center border-gray-400 hover:border-blue-500 hover:text-blue-600 disabled:opacity-50 bg-white"
                />
                <Button
                    type="default"
                    shape="circle"
                    icon={<RightOutlined />}
                    onClick={handleNext}
                    disabled={currentIndex >= maxIndex}
                    className="w-10 h-10 flex items-center justify-center border-gray-400 hover:border-blue-500 hover:text-blue-600 disabled:opacity-50 bg-white"
                />
            </div>
        </div>
    );
}