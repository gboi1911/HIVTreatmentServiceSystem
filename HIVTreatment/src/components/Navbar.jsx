import React, { useState } from "react";
import { Layout, Menu, Button } from "antd";
import logo from "../assets/logo.png";
import {
  HomeOutlined,
  FileTextOutlined,
  BarChartOutlined,
  InfoCircleOutlined,
  BookOutlined,
  ReadOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Header } = Layout;

const menuItems = [
  { key: "home", icon: <HomeOutlined />, label: "Trang chủ" },
  { key: "report", icon: <FileTextOutlined />, label: "Báo cáo" },
  { key: "about", icon: <InfoCircleOutlined />, label: "Giới thiệu" },
  { key: "course", icon: <BookOutlined />, label: "Khóa học" },
  { key: "blog", icon: <ReadOutlined />, label: "Blog" },
  { key: "consult", icon: <TeamOutlined />, label: "Tư vấn" },
];

export default function Navbar() {
  const [current, setCurrent] = useState("home");
  const navigate = useNavigate();
  const onClick = (e) => {
    setCurrent(e.key);
    // Define routes for each key
    switch (e.key) {
      case "home":
        navigate("/");
        break;
      case "report":
        navigate("/report");
        break;
      case "about":
        navigate("/about");
        break;
      case "course":
        navigate("/course");
        break;
      case "blog":
        navigate("/blog");
        break;
      case "consult":
        navigate("/consult");
        break;
      default:
        // Fallback: scroll to section by ID if exists
        const el = document.getElementById(e.key);
        if (el) el.scrollIntoView({ behavior: "smooth" });
        break;
    }
  };

  return (
    <Header
      style={{
        display: "flex",
        alignItems: "center",
        backgroundColor: "#fff",
        padding: "0 40px",
        boxShadow: "0 2px 8px #f0f1f2",
      }}
    >
      <div
        style={{ cursor: "pointer", flex: "0 0 auto", marginRight: 40 }}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        role="button"
        tabIndex={0}
        onKeyDown={(e) =>
          e.key === "Enter" && window.scrollTo({ top: 0, behavior: "smooth" })
        }
      >
        <img
          src={logo}
          alt="Phòng Ma Tuý Logo"
          style={{ height: 72, objectFit: "fill" }}
        />
      </div>
      <Menu
        theme="light"
        mode="horizontal"
        selectedKeys={[current]}
        onClick={onClick}
        items={menuItems}
        style={{ flex: 1 }}
      />
      <Button
        type="primary"
        style={{ backgroundColor: "#1076BD", borderColor: "#1076BD" }}
        onClick={() => {
          navigate("/login");
        }}
      >
        Đăng nhập
      </Button>
    </Header>
  );
}
