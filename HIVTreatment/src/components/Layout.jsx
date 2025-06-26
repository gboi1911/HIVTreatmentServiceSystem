import React from "react";
import Navbar from "./Navbar";
import AppFooter from "./Footer";
import { Outlet } from "react-router-dom";
import NavFooter from "./HomePage/NavFooter";

const MainLayout = () => {
  return (
    <div>
      <Navbar />
      <main>
        <Outlet />
      </main>
      <NavFooter />
      <AppFooter />
    </div>
  );
};

export default MainLayout;
