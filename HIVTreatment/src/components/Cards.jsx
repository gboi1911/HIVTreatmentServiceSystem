import React from "react";
import { Card } from "antd"; // Keep Ant Card for its styling and hover
import card1 from "../assets/card1.jpg";
import card2 from "../assets/card2.jpg";
import card3 from "../assets/card3.jpg";

export default function CardSection() {
  const cardData = [
    {
      image: card1,
      title: "Chương Trình Truyền Thông",
      description: (
        <>
          Tổng hợp những giá trị sinh thành & <br />
          lấy thật dịch vụ tại bệnh viện TỪ DŨ
        </>
      ),
      buttonText: "Xem thêm",
    },
    {
      image: card2,
      title: "HƯỚNG DẪN & DỊCH VỤ",
      description: (
        <>
          Bản đồ đường đi <br />
          Khám tiền sản, Khám Nhi <br />
          Thủ tục nhập viện, xuất viện
        </>
      ),
      buttonText: "Xem thêm",
    },
    {
      image: card3,
      title: "Hỏi & Đáp",
      description: (
        <>
          Sinh thường hay sinh mổ chủ động <br />
          Nên cho trẻ dùng nấm và sinh trong <br />
          bao lâu thì đủ?
        </>
      ),
      buttonText: "Xem thêm",
    },
  ];

  return (
    // Outer container for overall section
    // Use 'xl' breakpoint to explicitly keep them in one row on very large screens
    // Otherwise, allow wrapping for responsiveness
    <section className="mx-auto flex flex-wrap lg:flex-nowrap justify-center gap-6 py-10 w-full max-w-screen-xl">
      {cardData.map((card, index) => (
        <Card
          key={index}
          hoverable
          // Force card width using flex-shrink-0 to prevent shrinking
          // and a fixed width
          className="w-[320px] flex-shrink-0 overflow-hidden relative" // w-[320px] is more explicit than w-80
          bodyStyle={{ padding: 0 }}
        >
          <div
            className="relative h-64 bg-cover bg-center"
            style={{ backgroundImage: `url(${card.image})` }}
          >
            <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-end p-6 text-white">
              <h3 className="text-xl font-bold mb-2 leading-tight">
                {card.title}
              </h3>
              <p className="text-sm opacity-90 mb-4 leading-relaxed">
                {card.description}
              </p>
              <button className="self-start px-5 py-2 border border-white rounded text-white text-sm hover:bg-white hover:bg-opacity-20 transition-all duration-200">
                {card.buttonText}
              </button>
            </div>
          </div>
        </Card>
      ))}
    </section>
  );
}
