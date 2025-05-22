import React from "react";
import theme1 from "../assets/theme1.jpg";

export default function Hero() {
  return (
    <section className="w-full bg-white py-4 px-8">
      <div className="flex justify-end">
        <p className="text-sm text-gray-500">
          <span className="mr-1">ĐẶT LỊCH KHÁM:</span>
          <span className="text-red-700 font-bold">028.1081 - 1900.2125</span>
        </p>
      </div>

      <div className="w-full flex justify-center">
        <img
          src={theme1}
          alt="Nói không với ma túy"
          className="max-w-full h-auto"
          style={{ maxHeight: 800, objectFit: "fill" }}
        />
      </div>
    </section>
  );
}
