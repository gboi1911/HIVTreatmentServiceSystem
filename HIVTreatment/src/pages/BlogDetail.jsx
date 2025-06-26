import React from 'react';
import { Card, Button, Tag, Avatar, Divider, Badge, Image } from 'antd';
import { CalendarOutlined, UserOutlined, EyeOutlined, ShareAltOutlined, ClockCircleOutlined, EnvironmentOutlined, PhoneOutlined, MailOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

const BlogDetail = () => {
    const newsItems = [
        {
            id: 1,
            title: "Bệnh viện Bạch Mai thực hiện ca phẫu thuật tim mở đầu tiên",
            date: "15/05/2024",
            views: "1,234",
            image: "https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=400&h=500&fit=crop&q=60"
        },
        {
            id: 2,
            title: "Kỹ thuật mới trong điều trị bệnh tim mạch",
            date: "12/05/2024",
            views: "987",
            image: "https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=400&h=500&fit=crop&q=60"
        },
        {
            id: 3,
            title: "Hội thảo chuyên đề về phẫu thuật tim",
            date: "10/05/2024",
            views: "756",
            image: "https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=400&h=500&fit=crop&q=60"
        },
        {
            id: 4,
            title: "Thành công trong ca mổ tim phức tạp",
            date: "08/05/2024",
            views: "642",
            image: "https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=400&h=500&fit=crop&q=60"
        }
    ];

    const videoGallery = [
        {
            id: 1,
            title: "Phẫu thuật tim hở",
            duration: "15:30",
            thumbnail: "/api/placeholder/200/150"
        },
        {
            id: 2,
            title: "Kỹ thuật mới",
            duration: "12:45",
            thumbnail: "/api/placeholder/200/150"
        },
        {
            id: 3,
            title: "Ca mổ thành công",
            duration: "18:20",
            thumbnail: "/api/placeholder/200/150"
        },
        {
            id: 4,
            title: "Hướng dẫn phẫu thuật",
            duration: "22:15",
            thumbnail: "/api/placeholder/200/150"
        },
        {
            id: 5,
            title: "Kỹ thuật tiên tiến",
            duration: "14:30",
            thumbnail: "/api/placeholder/200/150"
        },
        {
            id: 6,
            title: "Chăm sóc hậu phẫu",
            duration: "16:45",
            thumbnail: "/api/placeholder/200/150"
        }
    ];

    const categories = [
        "Tim mạch", "Phẫu thuật", "Nội khoa", "Ngoại khoa",
        "Chẩn đoán", "Điều trị", "Hồi sức", "Chăm sóc"
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
                                    <Tag color="red" className="text-sm font-medium">TIN NỔI BẬT</Tag>
                                    <div className="flex items-center space-x-2">
                                        
                                        <Button type="text" size="small" icon={<ShareAltOutlined />} className="text-gray-500 hover:text-blue-600" />
                                    </div>
                                </div>
                                
                                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight mb-6">
                                    TP.HCM được bệnh viện Singapore 'chọn mặt gửi vàng' cho ca thông tim bào thai nguy kịch
                                </h1>
                                
                                <div className="flex items-center space-x-6 text-sm text-gray-600 pb-6 border-b border-gray-100">
                                    <div className="flex items-center space-x-2">
                                        <CalendarOutlined />
                                        <span>28/05/2024</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <EyeOutlined />
                                        <span>2,456 lượt xem</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <ClockCircleOutlined />
                                        <span>5 phút đọc</span>
                                    </div>
                                </div>
                            </div>

                            {/* Article Content */}
                            <div className="p-8">
                                <div className="mb-8">
                                    <img
                                        src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&h=400&fit=crop"
                                        alt="Featured surgery"
                                        className="w-full h-64 md:h-80 object-cover rounded-lg mb-4"
                                    />
                                    <div className="text-center text-sm text-gray-600 bg-gray-50 p-4 rounded-lg">
                                        <p className="italic mb-2">
                                            Ê kíp các chuyên gia can thiệp bào thai của Bệnh viện Từ Dũ và chuyên gia can thiệp tim bẩm sinh của
                                            Bệnh viện Nhi Đồng 1 thực hiện ca thông tim bào thai cho trường hợp người bệnh Singapore
                                        </p>
                                        <p className="text-xs text-gray-500">ẢNH: SỞ Y TẾ TP.HCM</p>
                                    </div>
                                </div>

                                <div className="prose max-w-none">
                                    <p className="text-lg text-gray-800 leading-relaxed mb-6 font-medium">
                                        Một bệnh viện hàng đầu của Singapore chủ động giới thiệu người bệnh sang TP.HCM để can thiệp thông
                                        tim bào thai mắc bệnh tim bẩm sinh nặng, nguy cơ thai chết lưu.
                                    </p>
                                    
                                    <div className="space-y-4 text-gray-700 leading-relaxed">
                                        <p>
                                            Ngày 28/5, các chuyên gia <span className='font-semibold text-blue-700'>can thiệp bào thai</span> của bệnh viện Từ Dũ phối hợp chuyên gia can thiệp tim mạch trẻ em của Bệnh viện Nhi đồng 1 thực hiện <span className='font-semibold text-green-700'>thành công</span> ca thông tim cho thai nhi 22 tuần tuổi bị dị tật bẩm sinh phức tạp của sản phụ người Singapore.
                                        </p>
                                        
                                        <p>
                                            Đây là minh chứng cho sự phát triển vượt bậc của ngành y tế Việt Nam trong lĩnh vực can thiệp tim mạch. Ca phẫu thuật này đòi hỏi sự phối hợp chặt chẽ giữa các chuyên khoa và kỹ thuật cao.
                                        </p>
                                        
                                        <p>
                                            Theo các chuyên gia, việc thực hiện thành công ca can thiệp này không chỉ cứu sống thai nhi mà còn khẳng định vị thế của y học Việt Nam trên trường quốc tế. Bệnh viện Singapore đã tin tưởng và lựa chọn đội ngũ y bác sĩ Việt Nam thực hiện ca phẫu thuật phức tạp này.
                                        </p>
                                        
                                        <p>
                                            Sự hợp tác y tế quốc tế như vậy mở ra nhiều cơ hội để ngành y tế Việt Nam tiếp tục học hỏi, phát triển và nâng cao chất lượng dịch vụ chăm sóc sức khỏe cho người dân.
                                        </p>
                                    </div>
                                </div>

                                <Divider />

                                {/* Source */}
                                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                                    <h4 className="font-semibold text-gray-900 mb-2">Nguồn</h4>
                                    <p className="text-sm text-gray-600 break-all">
                                        <a href="#" className="text-blue-600 hover:text-blue-800 hover:underline">
                                            Báo Thanh Niên - thanhnien.vn
                                        </a>
                                    </p>
                                </div>

                                {/* Comments Section */}
                                <div className="border-t border-gray-100 pt-6">
                                    <h4 className="font-semibold text-gray-900 mb-3">Bình luận (0)</h4>
                                    <p className="text-gray-600 text-sm">
                                        Vui lòng <a href="/login" className="text-blue-600 hover:text-blue-800 hover:underline">đăng nhập</a> để bình luận
                                    </p>
                                </div>
                            </div>
                        </article>

                        {/* Related Articles */}
                        <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                            <h2 className="text-xl font-bold text-gray-900 mb-6">Bài viết liên quan</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {newsItems.map((item) => (
                                    <article key={item.id} className="group cursor-pointer">
                                        <div className="border border-gray-100 rounded-lg p-4 hover:border-gray-200 hover:shadow-sm transition-all duration-200">
                                            <img
                                                src={item.image}
                                                alt={item.title}
                                                className="w-full h-32 object-cover rounded-lg mb-3"
                                            />
                                            <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                                                {item.title}
                                            </h3>
                                            <div className="flex items-center justify-between text-xs text-gray-500">
                                                <span className="flex items-center space-x-1">
                                                    <CalendarOutlined />
                                                    <span>{item.date}</span>
                                                </span>
                                                <span className="flex items-center space-x-1">
                                                    <EyeOutlined />
                                                    <span>{item.views}</span>
                                                </span>
                                            </div>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">

                        {/* Quick Links */}
                        <Card size="small">
                            <Image src="https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.tudu.com.vn%2Fvn%2Fhuong-dan-dich-vu%2Fdich-vu-sanh-mo%2Fdich-vu-mo-lay-thai-tron-goi-tai-benh-vien-tu-du%2F&psig=AOvVaw0e7l5ewOQsjUkGa0boEPcd&ust=1749001870923000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCMjr4-uR1I0DFQAAAAAdAAAAABAU"/>
                        </Card>

                        {/* Categories */}
                        <Card title="Chuyên khoa" size="small">
                            <div className="flex flex-wrap gap-2">
                                {categories.map((category, index) => (
                                    <Tag key={index} color="blue" className="mb-2 cursor-pointer">
                                        {category}
                                    </Tag>
                                ))}
                            </div>
                        </Card>

                        {/* Recent News Sidebar */}
                        <Card title="Bài viết liên quan" size="small">
                            <div className="space-y-4">
                                {newsItems.slice(0, 3).map((item) => (
                                    <div key={item.id} className="flex space-x-3">
                                        <img
                                            src={item.image}
                                            alt={item.title}
                                            className="w-16 h-12 object-cover rounded flex-shrink-0"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-sm font-medium text-gray-900 line-clamp-2 mb-1">
                                                {item.title}
                                            </h4>
                                            <p className="text-xs text-gray-500">{item.date}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>

                        {/* Contact Info */}
                        <Card title="Thông tin liên hệ" size="small">
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