import React from "react";
import Navbar from "./Navbar";
import AppFooter from "./Footer";
import { Outlet } from "react-router-dom";
import { Layout, Row, Col } from "antd";
import StaffNavigation from "./StaffNavigation";
import { useAuthStatus } from "../hooks/useAuthStatus";

const { Content, Sider } = Layout;

const StaffLayout = () => {
  const { userInfo, isLoggedIn } = useAuthStatus();
  const isStaff = userInfo?.role === "STAFF";

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Navbar />
      <Layout>
        {isLoggedIn && isStaff && (
          <Sider 
            width={250} 
            theme="light"
            style={{ 
              background: "#fff", 
              borderRight: "1px solid #f0f0f0",
              overflow: 'auto',
              position: 'fixed',
              left: 0,
              top: 64, // Navbar height
              bottom: 0,
            }}
          >
            <StaffNavigation />
          </Sider>
        )}
        <Layout style={{ marginLeft: isLoggedIn && isStaff ? 250 : 0 }}>
          <Content style={{ padding: "24px", minHeight: "calc(100vh - 64px - 69px)" }}>
            <Outlet />
          </Content>
          <AppFooter />
        </Layout>
      </Layout>
    </Layout>
  );
};

export default StaffLayout; 