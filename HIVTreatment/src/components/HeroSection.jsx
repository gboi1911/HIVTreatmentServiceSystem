import React from "react";
import theme1 from "../assets/theme1.jpg";

export default function Hero() {
  return (
    <section className="w-full bg-white py-4 px-8">
      <div className="w-full flex justify-center mt-2">
        <img
          src={theme1}
          alt="Nói không với ma túy"
          className="w-[80%] h-auto object-fill"
        />
      </div>
    </section>
  );
}
