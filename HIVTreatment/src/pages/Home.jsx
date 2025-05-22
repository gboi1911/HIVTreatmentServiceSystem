import React from "react";
import Hero from "../components/HeroSection";
import CardSection from "../components/Cards";

export default function Home() {
  return (
    <>
      <Hero />
      <div className="w-full flex justify-center px-4 overflow-x-auto">
        <CardSection />
      </div>
    </>
  );
}
