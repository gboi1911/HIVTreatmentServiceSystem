import { Row, Col, Card, Typography } from "antd";

const { Title, Paragraph } = Typography;

const announcements = [
  {
    date: "08",
    month: "06/2025",
    title: "Hội thảo nâng cao nhận thức phòng ngừa HIV/AIDS",
    img: "https://vaac.gov.vn/upload/t8-2023/a-son-1.png?v=1.0.0",
  },
  {
    date: "05",
    month: "06/2025",
    title: "Lớp học cộng đồng về phòng chống lây nhiễm HIV",
    img: "https://vaac.gov.vn/upload/t8-2023/a-son-1.png?v=1.0.0",
  },
  {
    date: "01",
    month: "06/2025",
    title: "Chiến dịch truyền thông HIV tại khu dân cư",
    img: "https://vaac.gov.vn/upload/t8-2023/a-son-1.png?v=1.0.0",
  },
  {
    date: "25",
    month: "05/2025",
    title: "Tập huấn kỹ năng tư vấn HIV cho tình nguyện viên",
    img: "https://vaac.gov.vn/upload/t8-2023/a-son-1.png?v=1.0.0",
  },
  {
    date: "22",
    month: "05/2025",
    title: "Tọa đàm thanh niên về trách nhiệm phòng HIV",
    img: "https://vaac.gov.vn/upload/t8-2023/a-son-1.png?v=1.0.0",
  },
  {
    date: "18",
    month: "05/2025",
    title: "Chiếu phim tài liệu tuyên truyền về HIV/AIDS",
    img: "https://vaac.gov.vn/upload/t8-2023/a-son-1.png?v=1.0.0",
  },
  {
    date: "14",
    month: "05/2025",
    title: "Hướng dẫn sử dụng bao cao su và phòng tránh HIV",
    img: "https://vaac.gov.vn/upload/t8-2023/a-son-1.png?v=1.0.0",
  },
  {
    date: "10",
    month: "05/2025",
    title: "Khám sức khỏe miễn phí và tư vấn HIV",
    img: "https://vaac.gov.vn/upload/t8-2023/a-son-1.png?v=1.0.0",
  },
  {
    date: "06",
    month: "05/2025",
    title: "Sự kiện phát động tháng hành động vì HIV/AIDS",
    img: "https://vaac.gov.vn/upload/t8-2023/a-son-1.png?v=1.0.0",
  },
  {
    date: "03",
    month: "05/2025",
    title: "Chia sẻ câu chuyện người sống chung với HIV",
    img: "https://vaac.gov.vn/upload/t8-2023/a-son-1.png?v=1.0.0",
  },
  {
    date: "28",
    month: "04/2025",
    title: "Triển lãm ảnh: Hành trình phòng, chống HIV",
    img: "https://vaac.gov.vn/upload/t8-2023/a-son-1.png?v=1.0.0",
  },
  {
    date: "24",
    month: "04/2025",
    title: "Hội nghị chuyên đề về điều trị HIV hiện nay",
    img: "https://vaac.gov.vn/upload/t8-2023/a-son-1.png?v=1.0.0",
  },
];

export default function AnnouncementsPage() {
  return (
    <div className="px-6 py-12 bg-white min-h-screen">
      {/* Banner */}
      <div className="w-full mb-8">
        <img
          src="https://png.pngtree.com/background/20210711/original/pngtree-aids-red-ribbon-banner-poster-background-picture-image_1070889.jpg" // Replace with actual path or hosted image URL
          alt="HIV Awareness Banner"
          className="w-full h-40 object-cover shadow-md"
        />
      </div>

      <Title level={2} className="text-center text-sky-600 mb-12">
        Thông báo
      </Title>

      <Row gutter={[24, 24]}>
        {announcements.map((item, index) => (
          <Col key={index} xs={24} sm={12} md={8} lg={6}>
            <Card
              hoverable
              className="rounded-lg shadow-sm h-full flex flex-col"
              bodyStyle={{
                padding: 16,
                display: "flex",
                flexDirection: "column",
                height: "100%",
              }}
            >
              <div className="flex items-center gap-4 mb-2">
                <div className="text-center bg-sky-100 text-sky-600 font-semibold rounded p-2 w-14">
                  <div className="text-xl">{item.date}</div>
                  <div className="text-xs">{item.month}</div>
                </div>
                <Paragraph className="font-medium mb-0">{item.title}</Paragraph>
              </div>
              {item.img && (
                <img
                  src={item.img}
                  alt={item.title}
                  className="rounded-md mt-auto object-cover max-h-40 w-full"
                />
              )}
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}
