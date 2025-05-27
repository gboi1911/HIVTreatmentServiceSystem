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
          className="w-[320px] flex-shrink-0 overflow-hidden relative hover:cursor-none" // w-[320px] is more explicit than w-80
          bodyStyle={{ padding: 0 }}
        >
          <div
            className="relative h-96 bg-cover bg-center brightness-90"
            style={{ backgroundImage: `url("${card.image}")` }}
          >
            <div
              className="
    absolute bottom-0 left-0 right-0 m-4
    rounded-xl border border-gray-300 shadow-lg
    bg-opacity-20 backdrop-blur-md
    flex flex-col justify-between h-48
    p-6
  "
            >
              <div>
                <h3 className="text-xl font-semibold mb-3 leading-tight text-black drop-shadow-md">
                  {card.title}
                </h3>
                <p className="text-sm opacity-90 mb-4 leading-relaxed text-black drop-shadow">
                  {card.description}
                </p>
              </div>
              <button
                className="
      self-start px-6 py-5 border border-white rounded
      text-sm font-medium
      hover:bg-white hover:bg-opacity-30 transition-all duration-200
      drop-shadow
    "
              >
                {card.buttonText}
              </button>
            </div>
          </div>
        </Card>
      ))}
    </section>
  );
}
