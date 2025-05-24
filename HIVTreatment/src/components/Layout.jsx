import React from "react";
import Navbar from "./Navbar";
import AppFooter from "./Footer";
import { Outlet } from "react-router-dom";
import NewsSection from "./HomePage/NewsSection";
import TechSection from "./HomePage/TechSection";

const MainLayout = () => {
  return (
    <div>
      <Navbar />
      <main>
        <Outlet />
        <NewsSection/>
        <TechSection/>
      </main>
      <AppFooter />
    </div>
  );
};

export default MainLayout;
