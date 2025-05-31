import React from "react";
import Hero from "../components/HeroSection";
import CardSection from "../components/Cards";
import NewsSection from "../components/HomePage/NewsSection";
import TechSection from "../components/HomePage/TechSection";
import NewTechSection from "../components/HomePage/NewTechSection";
import CategorySection from "../components/HomePage/CategorySection";
import NavFooter from "../components/HomePage/NavFooter";
export default function Home() {
  return (
    <>
      <Hero />
      <div className="w-full flex justify-center px-4 overflow-x-auto">
        <CardSection />

      </div>
              <NewsSection/>
                <NewTechSection/>
                <TechSection/>
                <CategorySection/>
                <NavFooter/>
    </>
  );
}
