import React from 'react';
import { Layout, Row, Col, Typography, Space } from 'antd';
import { TikTokOutlined, FacebookOutlined, YoutubeOutlined } from '@ant-design/icons';

const { Footer } = Layout;
const { Title, Text, Link } = Typography;

const NavFooter = () => {
  return (
    <div className="w-full">
      <div className="bg-gray-50 py-8 text-center">
        <p className="text-lg text-blue-600 italic font-medium">
          "Cùng nhau xây dựng tương lai không ma túy!"
        </p>
        <div className="flex justify-center gap-4 mt-4">
          <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center cursor-pointer hover:opacity-80">
            <TikTokOutlined style={{color:"white", fontSize:"20px"}} />
          </div>
          <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer hover:opacity-80">
            <FacebookOutlined style={{color:"white", fontSize:"20px"}} />
          </div>
          <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center cursor-pointer hover:opacity-80">
            <YoutubeOutlined style={{color:"white", fontSize:"20px"}} />
          </div>
        </div>
      </div>

      <footer className="bg-[#1076BD] text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <Row gutter={[32, 32]}>
            <Col xs={24} md={6}>
              <div className="flex flex-col items-start gap-4">
                <div className="w-16 h-16 bg-blue rounded-full flex items-center justify-center flex-shrink-0">
                  <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
                    <div className="text-white font-bold text-lg">+</div>
                  </div>
                </div>
                <div>
                  <p className="text-white mb-2 text-2xl font-bold">
                    Bệnh viện Từ Dũ
                  </p>
                  <div className="space-y-1 text-sm">
                    <div>264 Cống Quỳnh, P. Phạm Ngũ Lão</div>
                    <div>Quận 1, Tp. Hồ Chí Minh, Việt Nam</div>
                    <div>Tel: (028) 3952 6568</div>
                    <div>Email: web.admin@tudd.com.vn</div>
                    <div>Đăng ký khám: 028 1081 - 1000 2125</div>
                    <div>[Liên kết nội bộ]</div>
                  </div>
                </div>
              </div>
            </Col>
            <Col xs={24} md={6}>
              <p className="text-white mb-4 font-bold text-xl">
                Giới thiệu
              </p>
              <div className="space-y-2 text-sm">
                <div><Link style={{color:"white"}}>Lịch sử hình thành</Link></div>
                <div><Link style={{color:"white"}}>Cơ cấu tổ chức</Link></div>
                <div><Link style={{color:"white"}}>Các chuyên khoa</Link></div>
                <div><Link style={{color:"white"}}>Phòng Đào tạo - Chỉ đạo tuyến</Link></div>
                <div><Link style={{color:"white"}}>Thư viện điện tử</Link></div>
                <div><Link style={{color:"white"}}>Văn bản quy phạm pháp luật</Link></div>
                <div><Link style={{color:"white"}}>Văn bản của bệnh viện</Link></div>
                <div><Link style={{color:"white"}}>Cơ sở Việt - Đức và tình người</Link></div>
              </div>
            </Col>

            <Col xs={24} md={6}>
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <p className="text-white mb-4 font-bold text-xl">
                    Tin tức & sự kiện
                  </p>
                  <div className="space-y-2 text-sm">
                    <div><Link style={{color:"white"}}>Tin tức</Link></div>
                    <div><Link style={{color:"white"}}>Báo tạp chí đăng tải</Link></div>
                    <div><Link style={{color:"white"}}>Tư vấn đăm bảo trại tín</Link></div>
                    <div><Link style={{color:"white"}}>Thông tin dấu thầu</Link></div>
                    <div><Link style={{color:"white"}}>Hội nghị - Hội thảo</Link></div>
                    <div><Link style={{color:"white"}}>Hoạt động Đoàn - Hội</Link></div>
                    <div><Link style={{color:"white"}}>Thư giãn</Link></div>
                    <div><Link style={{color:"white"}}>Những chủ chuyện nghề</Link></div>
                  </div>
                </div>      
              </div>
            </Col>
            <Col xs={24} md={6}>
            <div>
                  <p className="text-white mb-4 font-bold text-xl">
                    Hướng dẫn & dịch vụ
                  </p>
                  <div className="space-y-2 text-sm">
                    <div><Link style={{color:"white"}}>Bảng giá</Link></div>
                    <div><Link style={{color:"white"}}>Khám chữa</Link></div>
                    <div><Link style={{color:"white"}}>Dịch vụ sanh / Mổ</Link></div>
                    <div><Link style={{color:"white"}}>Khám Phụ khoa</Link></div>
                    <div><Link style={{color:"white"}}>Khám Hiếm muộn</Link></div>
                    <div><Link style={{color:"white"}}>Khám Nhi</Link></div>
                    <div><Link style={{color:"white"}}>Khám Kế hoạch gia đình</Link></div>
                    <div><Link style={{color:"white"}}>Thủ tục hành chánh</Link></div>
                    <div><Link style={{color:"white"}}>Tạo hình thẩm mỹ</Link></div>
                    <div><Link style={{color:"white"}}>Khám Đoàn</Link></div>
                  </div>
                </div>
            </Col>
          </Row>
        </div>
      </footer>
    </div>
  );
};

export default NavFooter;