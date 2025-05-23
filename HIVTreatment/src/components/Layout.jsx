import React from "react";
import Navbar from "./Navbar";
import AppFooter from "./Footer";
import { Outlet } from "react-router-dom";
import NewsSection from "./HomePage/NewsSection";

const MainLayout = () => {
  return (
    <div>
      <Navbar />
      <main>
        <Outlet />
        <NewsSection/>
      </main>
      <AppFooter />
    </div>
  );
};

export default MainLayout;
