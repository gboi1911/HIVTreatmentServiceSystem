import React, { useState } from "react";
import { Layout, Menu, Button, Dropdown } from "antd";
import logo from "../assets/logo.png";
import {
  HomeOutlined,
  FileTextOutlined,
  InfoCircleOutlined,
  BookOutlined,
  ReadOutlined,
  TeamOutlined,
  UserOutlined,
  GlobalOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { p, path } from "framer-motion/client";

const { Header } = Layout;

const quickLinks = [
  { path: "/news", label: "Tin tức & Sự kiện" },
  { path: "/success", label: "Thành công & Kỹ thuật mới" },
  { path: "/healthcare", label: "Nhân viên y tế" },
  { path: "/tender", label: "Đấu thầu" },
  { path: "/science", label: "Khoa học" },
  { path: "/consulting", label: "Tư vấn" },
];

const menuItems = [
  { path: "/about", label: "Giới thiệu" },
  { path: "/guides", label: "Hướng dẫn & Bảng giá" },
  { path: "/health-and-life", label: "Sức khoẻ & đời sống" },
  { path: "/announcements", label: "Hỏi & Đáp" },
];

export default function Navbar() {
  const [current, setCurrent] = useState("about");
  const navigate = useNavigate();

  const onClick = (e) => {
    setCurrent(e.key);
  };

  return (
    <div style={{ width: "100%", boxShadow: "0 2px 8px #f0f1f2" }}>
      {/* Top blue bar */}
      <div className="bg-gradient-to-r from-sky-500 via-blue-700 to-blue-800 text-white text-sm flex items-center justify-between px-10 h-12 backdrop-blur-sm shadow-sm">
        <div style={{ display: "flex", gap: 24 }}>
          {/* {quickLinks.map((item) => (
            <span key={item} style={{ cursor: "pointer", opacity: 0.9 }}>
              {item}
            </span>
          ))} */}
          {quickLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              style={{
                color: "white",
                textDecoration: "none",
                padding: "8px 16px",
                borderRadius: "20px",
                transition: "all 0.3s ease",
                fontSize: "13px",
                fontWeight: 500,
              }}
              onMouseEnter={(e) => {
                e.target.style.background = "rgba(255,255,255,0.15)";
                e.target.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "transparent";
                e.target.style.transform = "translateY(0)";
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <SearchOutlined style={{ fontSize: 16, cursor: "pointer" }} />
          <button
            size="small"
            className="bg-gradient-to-r from-red-600 to-red-800 text-white border-none rounded-full font-semibold px-6 h-9 shadow-lg shadow-red-600/30 transition-all duration-300 hover:shadow-red-600/40"
            onClick={() => navigate("/login")}
          >
            Đăng nhập
          </button>
          <Dropdown
            menu={{
              items: [
                { key: "vi", label: "VI" },
                { key: "en", label: "EN" },
              ],
            }}
            placement="bottomRight"
          >
            <span style={{ cursor: "pointer", fontWeight: 500 }}>
              EN <GlobalOutlined />
            </span>
          </Dropdown>
        </div>
      </div>
      {/* Main navbar */}
      <Header
        style={{
          background: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 40px",
          height: 80,
          borderBottom: "1px solid #f0f1f2",
        }}
      >
        <div
          style={{
            flex: "0 0 auto",
            marginRight: 40,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
          }}
          onClick={() => navigate("/")}
        >
          <img src={logo} alt="Logo" style={{ height: 56 }} />
        </div>
        <div className="flex gap-12">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              style={{
                color: current === item.path ? "#B80000" : "#333",
                fontWeight: current === item.path ? 700 : 500,
                fontSize: 16,
                textDecoration: "none",
                padding: "8px 16px",
                borderRadius: "20px",
                transition: "all 0.3s ease",
              }}
              onClick={() => setCurrent(item.path)}
            >
              {item.label}
            </Link>
          ))}
        </div>
        {/* <Menu
          mode="horizontal"
          selectedKeys={[current]}
          onClick={onClick}
          items={menuItems}
          style={{
            flex: 1,
            fontWeight: 500,
            fontSize: 16,
            borderBottom: "none",
            justifyContent: "center",
            background: "transparent",
          }}
        /> */}
        <div style={{ minWidth: 220, textAlign: "right", fontSize: 15 }}>
          ĐẶT LỊCH KHÁM:{" "}
          <span style={{ color: "#B80000", fontWeight: 700 }}>
            028.1081 - 1900.2125
          </span>
        </div>
      </Header>
    </div>
  );
}
