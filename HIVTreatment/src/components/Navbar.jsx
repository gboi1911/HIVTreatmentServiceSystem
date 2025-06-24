import React, { useState, useEffect } from "react";
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
  LogoutOutlined,
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStatus } from "../hooks/useAuthStatus";
const { Header } = Layout;

const quickLinks = [
  {path: "/consultation-booking", label: "Đặt lịch tư vấn"},
  {path: "/guides", label: "Tin tức & Sự kiện"},
  {path: "/success", label: "Thành công & Kỹ thuật mới"},
  {path: "/healthcare", label: "Nhân viên y tế"},
  {path: "/tender", label: "Đấu thầu"},
  {path: "/science", label: "Khoa học"},
];

const menuItems = [
  { path: "/about", label: "Giới thiệu" },
  { path: "/guides", label: "Hướng dẫn & Bảng giá" },
  { path: "/health-and-life", label: "Sức khoẻ & đời sống" },
  { path: "/faq", label: "Hỏi & Đáp" },
];

export default function Navbar() {
  const { isLoggedIn } = useAuthStatus();
  const [current, setCurrent] = useState("about");
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();

  const onClick = (e) => {
    setCurrent(e.key);
  };

  // Get user info from localStorage or token
  useEffect(() => {
    if (isLoggedIn) {
      // Try to get user info from localStorage
      const savedUserInfo = localStorage.getItem('userInfo');
      console.log("Saved User Info:", savedUserInfo);
      if (savedUserInfo) {
        setUserInfo(JSON.parse(savedUserInfo));
      } else {
        // If no saved user info, try to decode from token (if it's JWT)
        const token = localStorage.getItem('token');
        if (token) {
          try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            setUserInfo({
              username: payload.username || payload.email || payload.sub || 'User',
              email: payload.email
            });
          } catch (error) {
            // If token is not JWT or can't decode, set default
            setUserInfo({ username: 'User' });
          }
        }
      }
    } else {
      setUserInfo(null);
    }
  }, [isLoggedIn]);

  const handleLogout = () => {
    
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
    setUserInfo(null);
    navigate('/login', {
      state: {
        message: 'Đăng xuất thành công!',
        type: 'success'
      }});
  };

  // User dropdown menu items
  const userMenuItems = [
    {
      key: 'profile',
      label: 'Thông tin cá nhân',
      icon: <UserOutlined />,
      onClick: () => navigate('/profile')
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      label: 'Đăng xuất',
      icon: <LogoutOutlined />,
      onClick: handleLogout
    }
  ];

  return (
    <div style={{ width: "100%", boxShadow: "0 2px 8px #f0f1f2" }}>
      {/* Top blue bar */}
      <div className="bg-gradient-to-r from-sky-500 via-blue-700 to-blue-800 text-white text-sm flex items-center justify-between px-10 h-12 backdrop-blur-sm shadow-sm">
        <div style={{ display: "flex", gap: 24 }}>
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
          
          {/* Conditional rendering based on login status */}
          {isLoggedIn && userInfo ? (
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <Dropdown
                menu={{ items: userMenuItems }}
                placement="bottomRight"
                trigger={['click']}
              >
                <div style={{ 
                  cursor: "pointer", 
                  display: "flex", 
                  alignItems: "center", 
                  gap: 8,
                  padding: "6px 12px",
                  borderRadius: "20px",
                  transition: "all 0.3s ease",
                  background: "rgba(255,255,255,0.1)"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.2)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.1)";
                }}
                >
                  <UserOutlined />
                  <span style={{ fontWeight: 500, fontSize: "14px" }}>
                    {userInfo.username || 'User'}
                  </span>
                </div>
              </Dropdown>
            </div>
          ) : (
            <button
              className="bg-gradient-to-r from-red-600 to-red-800 text-white border-none rounded-full font-semibold px-6 h-9 shadow-lg shadow-red-600/30 transition-all duration-300 hover:shadow-red-600/40"
              onClick={() => navigate("/login")}
            >
              Đăng nhập
            </button>
          )}
          
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