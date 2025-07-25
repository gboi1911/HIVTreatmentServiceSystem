import React from "react";
import { Row, Col, Card, Typography, Spin } from "antd";
import { getBlogs } from "../api/blog";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const { Title, Paragraph, Text } = Typography;

const articles = [
  {
    title: "Cập nhật phác đồ điều trị HIV mới nhất năm 2025",
    desc: "Phác đồ điều trị ARV mới giúp cải thiện chất lượng sống, giảm thiểu tác dụng phụ và nâng cao hiệu quả điều trị.",
    img: "https://dieutrihivaids.com/wp-content/uploads/2023/02/FDAMedTimeline_FB-1.jpg",
  },
  {
    title: "Lợi ích của điều trị ARV sớm cho người nhiễm HIV",
    desc: "Phát hiện sớm và điều trị kịp thời giúp giảm nguy cơ lây truyền, bảo vệ sức khỏe lâu dài.",
    img: "https://cdccantho.vn/uploads/news/2022_08/3.jpg",
  },
  {
    title: "HIV và phụ nữ mang thai: Những điều cần biết",
    desc: "Tư vấn và chăm sóc đặc biệt cho phụ nữ mang thai nhiễm HIV nhằm ngăn ngừa lây truyền sang con.",
    img: "https://suckhoedoisong.qltns.mediacdn.vn/thumb_w/1200/324455921873985536/2021/7/25/avatar-16272215725091292170369-0-126-348-682-crop-1627221585272736087137.jpg",
  },
  {
    title: "Vai trò của cộng đồng trong phòng, chống HIV/AIDS",
    desc: "Tổ chức cộng đồng đóng vai trò quan trọng trong nâng cao nhận thức và hỗ trợ điều trị cho người sống chung với HIV.",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSvjmzKnkXNy-V1EFgjM6CyTbGEmFp1BcWHkQ&s",
  },
];

const sideNews = [
  {
    title: "Phát hiện sớm HIV qua xét nghiệm miễn phí",
    desc: "Các điểm xét nghiệm cộng đồng triển khai rộng rãi giúp người dân tiếp cận dễ dàng hơn.",
    img: "https://cdn.nhathuoclongchau.com.vn/unsafe/800x0/https://cms-prod.s3-sgn09.fptcloud.com/xet_nghiem_hiv_mien_phi_o_dau_se_thuan_tien_nhat_2_27a5e3e748.png",
  },
  {
    title: "Chiến dịch phòng chống HIV trong giới trẻ",
    desc: "Nâng cao nhận thức trong trường học, phát bao cao su và hỗ trợ tư vấn miễn phí.",
    img: "https://cdnphoto.dantri.com.vn/M_TpeSeCS9eO_jnYe2wAvMeqUyU=/thumb_w/960/2020/01/03/durex-dan-tridocx-1578018156184.png",
  },
  {
    title: "PrEP – Biện pháp dự phòng HIV hiệu quả",
    desc: "PrEP đang được cung cấp miễn phí tại nhiều cơ sở y tế cho các nhóm nguy cơ cao.",
    img: "https://dieutrihiv.com/wp-content/uploads/2022/04/Anh-2-Hieu-qua-du-phong-phoi-nhiem-cua-PrEP-len-den-hon-90-1024x768.png",
  },
  {
    title: "Trẻ em sống chung với HIV vẫn có thể sống khỏe mạnh",
    desc: "Nhờ điều trị sớm và chăm sóc đúng cách, trẻ em có thể sống khỏe mạnh như bao đứa trẻ khác.",
    img: "https://laichau.gov.vn/upload/2000066/20200214/8a0c20f6ff4aa992462551cb008a867atrec1882018.jpg",
  },
];

const preventionArticles = [
  {
    title: "Sử dụng bao cao su đúng cách",
    desc: "Bao cao su là biện pháp bảo vệ hiệu quả chống lại HIV và các bệnh lây truyền qua đường tình dục.",
    img: "https://data-service.pharmacity.io/pmc-upload-media/production/pmc-ecm-asm/blog/nhung-luu-y-can-biet-khi-su-dung-bao-cao-su-nam.webp",
  },
  {
    title: "Xét nghiệm HIV định kỳ",
    desc: "Xét nghiệm thường xuyên giúp phát hiện sớm và điều trị kịp thời, ngăn ngừa lây lan.",
    img: "https://www.vinmec.com/static/uploads/20190620_035316_951179_HIV_max_1800x1800_jpg_915c9ac906.jpg",
  },
  {
    title: "Tư vấn và hỗ trợ tâm lý",
    desc: "Tư vấn tâm lý giúp người nhiễm HIV vượt qua khó khăn và sống tích cực hơn.",
    img: "https://www.mindalife.vn/wp-content/uploads/2020/04/Tu-van-tam-ly-Giup-ban-hanh-phuc-va-thanh-cong-trong-cuoc-song.jpg",
  },
  {
    title: "Giáo dục cộng đồng",
    desc: "Tổ chức các buổi tuyên truyền tại trường học, cộng đồng nhằm nâng cao nhận thức phòng chống HIV.",
    img: "https://media.baoquangninh.vn/upload/image/202312/medium/2160341_2138320_kham_tu_van_suc_khoe_cap_phat_thuoc_mien_phi_cho_nu_cnld_cac_cong_ty_thuoc_khu_cong_nghiep_cang_bien_hai_ha_16012317_22152017.jpg",
  },
];

export default function HealthAndLife() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getBlogs(token);
        setBlogs(data);
      } catch (err) {
        message.error("Không thể tải blog");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const getFirstSentence = (text) => {
    const match = text.match(/^(.*?\.)\s/);
    return match ? match[1] : text;
  };

  return (
    <div className="px-8 py-12 bg-gray-50 min-h-screen">
      <Title level={2} className="text-center mb-10 text-rose-600">
        Sức khỏe & Đời sống với HIV/AIDS
      </Title>

      {loading ? (
        <div className="text-center py-20">
          <Spin size="large" />
        </div>
      ) : (
        <Row gutter={[32, 32]}>
          {/* Left: HIV Articles */}
          <Col xs={24} lg={16}>
            <Title level={4} className="mb-4">
              Bài viết nổi bật
            </Title>
            <Row gutter={[0, 24]}>
              {blogs.map((blog, index) => (
                <Col span={24} key={index}>
                  <Card
                    hoverable
                    className="shadow-md rounded-lg"
                    bodyStyle={{
                      display: "flex",
                      gap: 16,
                      alignItems: "center",
                    }}
                    onClick={() =>
                      navigate(`/blog/${blog.blogId}`, { state: blog })
                    }
                  >
                    <img
                      src="https://images.ctfassets.net/rufp5n9kfzfi/RhEwTxojbTvmh9HAskBIg/5508933c4f10fcb057e614b6fc28b41b/Queer_Liberation_March_2023-3000x2000.jpg?fm=webp&fit=thumb&q=65&w=1728&h=1152"
                      alt={blog.title}
                      className="w-40 h-28 object-cover rounded"
                    />
                    <div>
                      <Title level={4}>{blog.title}</Title>
                      <Paragraph type="secondary">
                        {getFirstSentence(blog.content)}
                      </Paragraph>
                      <Text type="secondary">Đăng bởi: {blog.staffName}</Text>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          </Col>

          {/* Right: HIV News and Prevention */}
          <Col xs={24} lg={8}>
            <Title level={4} className="mb-4">
              Tin tức HIV
            </Title>
            <Row gutter={[0, 24]}>
              {sideNews.map((news, index) => (
                <Col span={24} key={index}>
                  <Card
                    hoverable
                    className="shadow-sm"
                    bodyStyle={{
                      display: "flex",
                      gap: 16,
                      alignItems: "center",
                    }}
                  >
                    <img
                      src={news.img}
                      alt={news.title}
                      className="w-24 h-24 object-cover rounded"
                    />
                    <div>
                      <Title level={5}>{news.title}</Title>
                      <Paragraph type="secondary" ellipsis={{ rows: 2 }}>
                        {news.desc}
                      </Paragraph>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>

            <Title level={4} className="mt-8 mb-4">
              Tuyên truyền phòng HIV
            </Title>
            <Row gutter={[0, 24]}>
              {preventionArticles.map((item, idx) => (
                <Col span={24} key={idx}>
                  <Card
                    hoverable
                    className="shadow-sm"
                    bodyStyle={{
                      display: "flex",
                      gap: 16,
                      alignItems: "center",
                    }}
                  >
                    <img
                      src={item.img}
                      alt={item.title}
                      className="w-24 h-24 object-cover rounded"
                    />
                    <div>
                      <Title level={5}>{item.title}</Title>
                      <Paragraph type="secondary">{item.desc}</Paragraph>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          </Col>
        </Row>
      )}
    </div>
  );
}
