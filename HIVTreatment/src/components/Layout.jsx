import React from "react";
import Navbar from "./Navbar";
import AppFooter from "./Footer";
import { Outlet } from "react-router-dom";
import NewsSection from "./HomePage/NewsSection";
import TechSection from "./HomePage/TechSection";
import NewTechSection from "./HomePage/NewTechSection";
import CategorySection from "./HomePage/CategorySection";
import NavFooter from "./HomePage/NavFooter";
const MainLayout = () => {
  return (
    <div>
      <Navbar />
      <main>
        <Outlet />
        <NewsSection/>
        <NewTechSection/>
        <TechSection/>
        <CategorySection/>
        <NavFooter/>
      </main>
      <AppFooter />
    </div>
  );
};

export default MainLayout;
