import React from "react";
import { Typography, Card, Row, Col, Button } from "antd";
import { motion } from "framer-motion";
import { MailOutlined } from "@ant-design/icons";

const { Title, Paragraph } = Typography;

const logos = [
  {
    name: "WHO",
    src: "https://www.cdnlogo.com/logos/w/30/who.svg",
    alt: "World Health Organization",
  },
  {
    name: "UNAIDS",
    src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT6CKxseD4_xzkJqEoi8kZOJCsV1zyvG_sE3w&s",
    alt: "UNAIDS",
  },
  {
    name: "CDC",
    src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdxbPsqwqGtuoCcxiEuOgZAlrLg_ueYg1Zcw&s",
    alt: "Centers for Disease Control and Prevention",
  },
  {
    name: "Red Cross",
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Flag_of_the_Red_Cross.svg/1024px-Flag_of_the_Red_Cross.svg.png",
    alt: "International Red Cross",
  },
  {
    name: "MSF",
    src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTacBP4_g1oNLcZHAKYWev8xc-zFh8yhm52oQ&s",
    alt: "Médecins Sans Frontières",
  },
];

export default function AboutUs() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-20">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-20"
      >
        <div
          className="rounded-2xl shadow-lg overflow-hidden w-full"
          style={{ height: "560px" }}
        >
          <motion.img
            src="https://techmoss.vn/wp-content/uploads/2022/03/Top-6-benh-vien-tot-nhat-tai-Viet-Nam-nam-2022.jpg"
            alt="Clinic"
            className="w-full h-full object-cover"
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6 }}
          />
        </div>

        <Title className="text-xl text-gray-700 max-w-3xl mx-auto mt-14 leading-relaxed text-center italic">
          Chúng tôi cam kết mang đến dịch vụ điều trị HIV uy tín, tận tâm và
          chăm sóc y tế toàn diện, đồng hành cùng bạn trên mọi bước đường sức
          khỏe.
        </Title>
      </motion.div>

      {/* Images and Mission */}
      {/* Mission: Image Left, Text Right */}
      <Row gutter={[32, 32]} align="middle" className="mb-24">
        <Col xs={24} md={12}>
          <motion.img
            src="https://suckhoedoisong.qltns.mediacdn.vn/324455921873985536/2023/9/1/photo-1693586550389-1693586550632232681470.jpg"
            alt="Clinic"
            className="rounded-2xl shadow-lg w-full h-80 object-cover"
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6 }}
          />
        </Col>
        <Col xs={24} md={12}>
          <Card bordered={false} className="shadow-md bg-white rounded-2xl p-6">
            <Title level={3}>Sứ mệnh của chúng tôi</Title>
            <Paragraph>
              Cung cấp dịch vụ chăm sóc cá nhân hóa và tôn trọng, hỗ trợ cộng
              đồng bị ảnh hưởng bởi HIV, nâng cao cuộc sống bằng sự đổi mới y tế
              và lòng tận tâm không ngừng.
            </Paragraph>
          </Card>
        </Col>
      </Row>

      {/* Vision: Text Left, Image Right */}
      <Row gutter={[32, 32]} align="middle" className="mb-24">
        <Col xs={24} md={12}>
          <Card bordered={false} className="shadow-md bg-white rounded-2xl p-6">
            <Title level={3}>Tầm nhìn của chúng tôi</Title>
            <Paragraph>
              Chúng tôi hướng đến tương lai nơi chăm sóc sức khỏe dễ tiếp cận,
              không kỳ thị và trao quyềnv bất kể tình trạng HIV hay nền tảng của
              mỗi người.
            </Paragraph>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <motion.img
            src="https://tc.cdnchinhphu.vn/346625049939054592/2025/2/14/14-17395243286941918524488.jpg"
            alt="Hope"
            className="rounded-2xl shadow-lg w-full h-80 object-cover"
            initial={{ x: 100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
          />
        </Col>
      </Row>

      <Row gutter={[32, 32]} align="middle" className="mb-24">
        <Col xs={24} md={12}>
          <motion.img
            src="https://image.tienphong.vn/w890/Uploaded/2025/Osgmky/3/8c5/38c5d990fb653faa40df9cf22657ffa5.jpg"
            alt="Core Values"
            className="rounded-2xl shadow-lg w-full h-80 object-cover"
            initial={{ x: 100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
          />
        </Col>
        <Col xs={24} md={12}>
          <Card bordered={false} className="shadow-md bg-white rounded-2xl p-6">
            <Title level={3}>Giá trị cốt lõi</Title>
            <Paragraph>
              Chúng tôi tin tưởng vào sự tôn trọng, trung thực và hợp tác chặt
              chẽ với cộng đồng, nhằm xây dựng môi trường chăm sóc sức khỏe an
              toàn, hiệu quả và đầy cảm thông.
            </Paragraph>
            <ul className="list-disc list-inside mt-4 space-y-2 text-gray-700">
              <li>Tôn trọng và bảo mật thông tin cá nhân</li>
              <li>Cung cấp dịch vụ y tế chất lượng cao</li>
              <li>Hỗ trợ tâm lý và xã hội cho bệnh nhân</li>
              <li>Liên tục đổi mới và nâng cao kiến thức chuyên môn</li>
            </ul>
          </Card>
        </Col>
      </Row>

      <section className="mt-40 text-center">
        <Title level={3}>Đối tác và các tổ chức quốc tế</Title>
        <Row
          justify="center"
          align="middle"
          gutter={[32, 32]}
          className="mt-12"
        >
          {logos.map(({ src, alt, name }) => (
            <Col key={name} xs={8} sm={6} md={4} lg={3}>
              <img
                src={src}
                alt={alt}
                className="mx-auto max-h-20 object-contain filter grayscale hover:filter-none transition-all duration-300"
                title={name}
              />
            </Col>
          ))}
        </Row>
      </section>

      {/* Call to Action */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="text-center mt-40"
      >
        <Title level={2} className="text-xl text-gray-800 mb-6">
          Hãy cùng chúng tôi tạo ra một thế giới lành mạnh và nhân ái hơn.
        </Title>
        <Button
          size="large"
          type="primary"
          href="/contact"
          className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-pink-600 hover:to-red-700 border-none rounded-full px-10 py-3 mt-5 shadow-lg flex items-center justify-center gap-2 transition-transform duration-200 hover:scale-105"
          icon={<MailOutlined style={{ fontSize: 20 }} />}
        >
          Liên hệ ngay với chúng tôi
        </Button>
      </motion.div>
    </div>
  );
}
