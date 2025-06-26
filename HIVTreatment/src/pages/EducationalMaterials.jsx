import React, { useState } from 'react';
import { Card, Row, Col, Tabs, Input, Button, Tag, Typography, Space, Avatar } from 'antd';
import { 
  SearchOutlined, 
  DownloadOutlined, 
  EyeOutlined, 
  BookOutlined,
  VideoCameraOutlined,
  FileTextOutlined
} from '@ant-design/icons';

const { Search } = Input;
const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

const educationalMaterials = [
  {
    id: 1,
    title: "Tác hại của ma túy đối với sức khỏe",
    type: "PDF",
    category: "Giáo dục cơ bản",
    downloads: 1250,
    views: 3500,
    author: "TS. Nguyễn Văn A",
    description: "Tài liệu chi tiết về các tác hại của ma túy đối với hệ thần kinh, tim mạch và các cơ quan khác"
  },
  {
    id: 2,
    title: "Kỹ năng từ chối ma túy",
    type: "Video",
    category: "Kỹ năng sống",
    downloads: 890,
    views: 2100,
    author: "ThS. Trần Thị B",
    description: "Video hướng dẫn các kỹ năng từ chối khi bị rủ rê sử dụng ma túy"
  },
  {
    id: 3,
    title: "Câu chuyện thực tế từ người đã cai nghiện",
    type: "Audio",
    category: "Kinh nghiệm thực tế",
    downloads: 670,
    views: 1800,
    author: "Người từng trải",
    description: "Những chia sẻ chân thực từ những người đã vượt qua nghiện ma túy"
  }
];

export default function EducationalMaterials() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const getTypeColor = (type) => {
    switch (type) {
      case 'PDF': return 'blue';
      case 'Video': return 'red';
      case 'Audio': return 'green';
      default: return 'default';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'PDF': return <FileTextOutlined />;
      case 'Video': return <VideoCameraOutlined />;
      case 'Audio': return <BookOutlined />;
      default: return <FileTextOutlined />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <Title level={1} className="text-blue-600">Tài liệu giáo dục</Title>
          <Paragraph className="text-lg text-gray-600">
            Khám phá thư viện tài liệu phong phú về phòng ngừa và tác hại của ma túy
          </Paragraph>
        </div>

        {/* Search and Filter */}
        <Card className="mb-8">
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} md={12}>
              <Search
                placeholder="Tìm kiếm tài liệu..."
                allowClear
                enterButton={<SearchOutlined />}
                size="large"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </Col>
            <Col xs={24} md={12}>
              <Space wrap>
                <Button 
                  type={activeCategory === 'all' ? 'primary' : 'default'}
                  onClick={() => setActiveCategory('all')}
                >
                  Tất cả
                </Button>
                <Button 
                  type={activeCategory === 'basic' ? 'primary' : 'default'}
                  onClick={() => setActiveCategory('basic')}
                >
                  Giáo dục cơ bản
                </Button>
                <Button 
                  type={activeCategory === 'skills' ? 'primary' : 'default'}
                  onClick={() => setActiveCategory('skills')}
                >
                  Kỹ năng sống
                </Button>
                <Button 
                  type={activeCategory === 'experience' ? 'primary' : 'default'}
                  onClick={() => setActiveCategory('experience')}
                >
                  Kinh nghiệm
                </Button>
              </Space>
            </Col>
          </Row>
        </Card>

        {/* Materials Grid */}
        <Row gutter={[24, 24]}>
          {educationalMaterials.map((material) => (
            <Col xs={24} md={12} lg={8} key={material.id}>
              <Card
                hoverable
                className="h-full"
                actions={[
                  <Button type="text" icon={<EyeOutlined />}>
                    Xem ({material.views})
                  </Button>,
                  <Button type="text" icon={<DownloadOutlined />}>
                    Tải ({material.downloads})
                  </Button>
                ]}
              >
                <Card.Meta
                  avatar={
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white text-xl">
                      {getTypeIcon(material.type)}
                    </div>
                  }
                  title={
                    <div>
                      <Title level={4} className="mb-2">{material.title}</Title>
                      <Space>
                        <Tag color={getTypeColor(material.type)}>{material.type}</Tag>
                        <Tag>{material.category}</Tag>
                      </Space>
                    </div>
                  }
                  description={
                    <div className="mt-4">
                      <Paragraph ellipsis={{ rows: 2 }} className="text-gray-600 mb-3">
                        {material.description}
                      </Paragraph>
                      <Space>
                        <Avatar size="small" icon={<BookOutlined />} />
                        <Text type="secondary">{material.author}</Text>
                      </Space>
                    </div>
                  }
                />
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
}