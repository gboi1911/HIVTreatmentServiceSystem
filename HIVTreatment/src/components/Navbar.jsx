import React, { useState, useEffect } from "react";
import { Layout, Menu, Button, Dropdown, Badge, Avatar } from "antd";
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
  MedicineBoxOutlined,
  CalendarOutlined,
  QuestionCircleOutlined,
  HeartOutlined,
  DownOutlined,
  SafetyOutlined,
  ExperimentOutlined,
  PhoneOutlined,
  BellOutlined
} from "@ant-design/icons";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuthStatus } from "../hooks/useAuthStatus";
const { Header } = Layout;

// Function to get quick links based on user role
const getQuickLinks = (userRole) => {
  const baseLinks = [
    { path: "/news", label: "Tin tức & Sự kiện" },
    { path: "/success", label: "Thành công & Kỹ thuật mới" },
    { path: "/healthcare", label: "Nhân viên y tế" },
    { path: "/education", label: "Khoa học" },
    { path: "/consultation-booking", label: "Đặt lịch tư vấn" },
  ];

  // Add dashboard link only for admin and manager
  if (userRole && ['ADMIN', 'MANAGER'].includes(userRole.toUpperCase())) {
    baseLinks.push({ path: "/admin/dashboard", label: "Dashboard" });
  }

  return baseLinks;
};

// Organize menu items into categories
const getOrganizedMenuItems = (canAccessMedicalRecords) => {
  const publicMenuItems = [
    { path: "/about", label: "Giới thiệu", icon: <InfoCircleOutlined /> },
  ];

  const servicesMenuItems = [
    { path: "/guides", label: "Hướng dẫn & Bảng giá", icon: <BookOutlined />, description: "Quy trình khám và bảng giá dịch vụ" },
    { path: "/health-and-life", label: "Sức khoẻ & đời sống", icon: <HeartOutlined />, description: "Thông tin chăm sóc sức khỏe hàng ngày" },
    { path: "/assessment/risk-assessment", label: "Đánh giá rủi ro", icon: <SafetyOutlined />, description: "Kiểm tra nguy cơ phơi nhiễm HIV", hot: true },
    { path: "/consultation-booking", label: "Đặt lịch tư vấn", icon: <CalendarOutlined />, description: "Đặt lịch gặp bác sĩ tư vấn" },
  ];

  const medicalMenuItems = canAccessMedicalRecords ? [
    { path: "/medical-records", label: "Hồ sơ bệnh án", icon: <FileTextOutlined />, description: "Quản lý hồ sơ bệnh án" },
    { path: "/treatment-plans", label: "Kế hoạch điều trị", icon: <MedicineBoxOutlined />, description: "Quản lý kế hoạch điều trị ARV" },
    { path: "/lab-results", label: "Kết quả xét nghiệm", icon: <ExperimentOutlined />, description: "Theo dõi kết quả xét nghiệm" },
  ] : [];

  const supportMenuItems = [
    { path: "/faq", label: "Hỏi & Đáp", icon: <QuestionCircleOutlined />, description: "Các câu hỏi thường gặp" },
    { path: "/contact", label: "Liên hệ", icon: <PhoneOutlined />, description: "Thông tin liên hệ hỗ trợ" },
  ];

  return {
    public: publicMenuItems,
    services: servicesMenuItems,
    medical: medicalMenuItems,
    support: supportMenuItems
  };
};

export default function Navbar() {
  const { isLoggedIn, userRole } = useAuthStatus();
  const location = useLocation();
  const [current, setCurrent] = useState(location.pathname);
  const [userInfo, setUserInfo] = useState(null);
  const [hoveredDropdown, setHoveredDropdown] = useState(null);
  const navigate = useNavigate();

  // Get dynamic quick links based on user role
  const quickLinks = getQuickLinks(userRole);

  // Set current path when location changes
  useEffect(() => {
    setCurrent(location.pathname);
  }, [location.pathname]);

  // Check if user can access medical records
  const canAccessMedicalRecords = userRole && 
    ['STAFF', 'CONSULTANT', 'MANAGER', 'ADMIN', 'DOCTOR'].includes(userRole.toUpperCase());

  const organizedMenuItems = getOrganizedMenuItems(canAccessMedicalRecords);

  // Get user info from localStorage or token
  useEffect(() => {
    if (isLoggedIn) {
      const savedUserInfo = localStorage.getItem('userInfo');
      if (savedUserInfo) {
        setUserInfo(JSON.parse(savedUserInfo));
      } else {
        const token = localStorage.getItem('token');
        if (token) {
          try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            setUserInfo({
              username: payload.username || payload.email || payload.sub || 'User',
              email: payload.email
            });
          } catch (error) {
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
      }
    });
  };

  // User dropdown menu items with enhanced styling
  const userMenuItems = {
    items: [
      {
        key: 'user-info',
        label: (
          <div className="py-2 px-1">
            <div className="text-gray-900 font-medium">{userInfo?.username || 'User'}</div>
            <div className="text-gray-500 text-xs">{userInfo?.email || ''}</div>
            <div className="mt-1 py-1 px-2 bg-blue-50 text-blue-700 rounded-full text-xs inline-block">
              {userRole || 'Người dùng'}
            </div>
          </div>
        ),
        type: 'group',
      },
      {
        type: 'divider',
      },
      {
        key: 'profile',
        label: (
          <div className="flex items-center gap-2 py-1">
            <UserOutlined className="text-blue-500" />
            <span>Thông tin cá nhân</span>
          </div>
        ),
        onClick: () => navigate('/profile')
      },
      {
        key: 'assessment-history',
        label: (
          <div className="flex items-center gap-2 py-1">
            <FileTextOutlined className="text-green-500" />
            <span>Lịch sử đánh giá</span>
          </div>
        ),
        onClick: () => navigate('/user/assessment-history')
      },
      {
        key: 'appointment-history',
        label: (
          <div className="flex items-center gap-2 py-1">
            <CalendarOutlined className="text-orange-500" />
            <span>Lịch sử cuộc hẹn</span>
          </div>
        ),
        onClick: () => navigate('/user/appointment-history')
      },
      ...(canAccessMedicalRecords ? [{
        key: 'medical-records',
        label: (
          <div className="flex items-center gap-2 py-1">
            <FileTextOutlined className="text-purple-500" />
            <span>Hồ sơ bệnh án</span>
          </div>
        ),
        onClick: () => navigate('/medical-records')
      }, {
        key: 'treatment-plans',
        label: (
          <div className="flex items-center gap-2 py-1">
            <MedicineBoxOutlined className="text-red-500" />
            <span>Kế hoạch điều trị</span>
          </div>
        ),
        onClick: () => navigate('/treatment-plans')
      }] : []),
      {
        type: 'divider',
      },
      {
        key: 'logout',
        danger: true,
        label: (
          <div className="flex items-center gap-2 py-1">
            <LogoutOutlined />
            <span>Đăng xuất</span>
          </div>
        ),
        onClick: handleLogout
      }
    ]
  };

  // Enhanced dropdown content with descriptions and icons
  const createDropdownContent = (menuItems) => {
    return {
      items: menuItems.map(item => ({
        key: item.path,
        label: (
          <Link 
            to={item.path} 
            style={{ textDecoration: 'none', color: 'inherit' }}
            onClick={() => setCurrent(item.path)}
          >
            <div className="py-2 px-1 min-w-[200px]">
              <div className="flex items-center gap-2 text-gray-800 font-medium">
                <span className={`text-lg ${item.path === current ? 'text-blue-600' : ''}`}>{item.icon}</span>
                <span className={item.path === current ? 'text-blue-600' : ''}>
                  {item.label}
                  {item.hot && (
                    <span className="ml-2 px-1.5 py-0.5 bg-red-500 text-white text-xs rounded-full">
                      Hot
                    </span>
                  )}
                </span>
              </div>
              {item.description && (
                <div className="text-gray-500 text-xs pl-6 mt-1 pr-4">{item.description}</div>
              )}
            </div>
          </Link>
        ),
      }))
    };
  };

  // Services dropdown items
  const servicesDropdownItems = createDropdownContent(organizedMenuItems.services);

  // Medical dropdown items (only show if user has access)
  const medicalDropdownItems = canAccessMedicalRecords ? 
    createDropdownContent(organizedMenuItems.medical) : null;

  // Support dropdown items
  const supportDropdownItems = createDropdownContent(organizedMenuItems.support);

  // Navigation item style
  const navItemStyle = (isActive = false) => ({
    color: isActive ? "#1677ff" : "#333",
    fontWeight: isActive ? 600 : 500,
    fontSize: 16,
    textDecoration: "none",
    padding: "8px 12px",
    borderRadius: "12px",
    transition: "all 0.2s ease",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    cursor: "pointer",
    ...(isActive && {
      background: "#f0f7ff"
    })
  });

  const dropdownStyle = (isHovered = false, isActive = false) => ({
    color: isActive ? "#1677ff" : "#333",
    fontWeight: isActive ? 600 : 500,
    fontSize: 16,
    padding: "8px 12px",
    borderRadius: "12px",
    transition: "all 0.2s ease",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    cursor: "pointer",
    border: "none",
    background: isHovered || isActive ? "#f0f7ff" : "transparent",
  });

  return (
    <div style={{ width: "100%", boxShadow: "0 2px 15px rgba(0,0,0,0.05)" }}>
      {/* Top blue bar with glassmorphism effect */}
      <div className="bg-gradient-to-r from-sky-500 via-blue-600 to-blue-700 text-white text-sm flex items-center justify-between px-10 h-12 backdrop-blur-sm shadow-sm relative overflow-hidden">
        {/* Background decoration elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-32 right-1/3 w-64 h-64 bg-blue-400 opacity-10 rounded-full blur-3xl"></div>
        </div>
        
        {/* Quick links */}
        <div className="flex gap-4 relative z-10 overflow-x-auto no-scrollbar">
          {quickLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className="whitespace-nowrap no-underline py-1.5 px-3 rounded-full transition-all duration-200 text-sm font-medium hover:bg-white/15"
              style={{
                color: "#fff",
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>
        
        {/* Right side controls */}
        <div className="flex items-center gap-4 relative z-10">
          <div className="p-2 hover:bg-white/15 rounded-full cursor-pointer transition-all duration-200">
            <SearchOutlined style={{ fontSize: 16 }} />
          </div>
          
          {/* User dropdown or login button */}
          {isLoggedIn && userInfo ? (
            <Dropdown
              menu={userMenuItems}
              placement="bottomRight"
              trigger={['click']}
              overlayClassName="user-dropdown-menu"
              dropdownRender={(menu) => (
                <div className="bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden p-2 min-w-[240px]">
                  {menu}
                </div>
              )}
            >
              <div className="flex items-center gap-2 py-1.5 px-3 hover:bg-white/15 rounded-full cursor-pointer transition-all duration-200">
                <Avatar 
                  size="small" 
                  className="bg-blue-100 flex items-center justify-center"
                  style={{ color: '#1677ff' }}
                >
                  {userInfo.username?.charAt(0).toUpperCase() || 'U'}
                </Avatar>
                <span className="font-medium">{userInfo.username?.split(' ')[0] || 'User'}</span>
                <DownOutlined style={{ fontSize: 10 }} />
              </div>
            </Dropdown>
          ) : (
            <button
              className="bg-white hover:bg-gray-50 text-blue-600 border border-white/30 rounded-full font-semibold px-5 h-9 transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
              onClick={() => navigate("/login")}
            >
              <UserOutlined style={{ fontSize: 14 }} />
              Đăng nhập
            </button>
          )}
          
          {/* Language selector */}
          <Dropdown
            menu={{
              items: [
                { key: "vi", label: "Tiếng Việt" },
                { key: "en", label: "English" },
              ],
            }}
            placement="bottomRight"
            dropdownRender={(menu) => (
              <div className="bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden p-1 min-w-[120px]">
                {menu}
              </div>
            )}
          >
            <div className="p-2 hover:bg-white/15 rounded-full cursor-pointer transition-all duration-200">
              <GlobalOutlined style={{ fontSize: 16 }} />
            </div>
          </Dropdown>
        </div>
      </div>
      
      {/* Main navbar with dropdown menus */}
      <Header
        style={{
          background: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 40px",
          height: 72,
          borderBottom: "1px solid #f0f1f2",
        }}
      >
        {/* Logo */}
        <div
          className="mr-10 cursor-pointer flex items-center hover:opacity-90 transition-opacity"
          onClick={() => navigate("/")}
        >
          <img src={logo} alt="Logo" style={{ height: 50 }} />
        </div>
        
        {/* Main navigation with beautiful dropdowns */}
        <div className="flex gap-4 items-center">
          {/* Home link */}
          <Link
            to="/"
            style={navItemStyle(current === "/")}
            onClick={() => setCurrent("/")}
          >
            <HomeOutlined />
            Trang chủ
          </Link>
          
          {/* Giới thiệu - Direct link */}
          <Link
            to="/about"
            style={navItemStyle(current === "/about")}
            onClick={() => setCurrent("/about")}
          >
            <InfoCircleOutlined />
            Giới thiệu
          </Link>

          {/* Dịch vụ - Dropdown */}
          <Dropdown
            menu={servicesDropdownItems}
            placement="bottomCenter"
            trigger={['hover']}
            onOpenChange={(open) => {
              if (open) setHoveredDropdown('services');
              else if (hoveredDropdown === 'services') setHoveredDropdown(null);
            }}
            overlayClassName="custom-dropdown"
            dropdownRender={(menu) => (
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden p-2 mt-2 min-w-[280px]">
                {menu}
              </div>
            )}
          >
            <div 
              style={dropdownStyle(
                hoveredDropdown === 'services', 
                current.includes('/guides') || 
                current.includes('/health-and-life') || 
                current.includes('/assessment') || 
                current.includes('/consultation-booking')
              )}
              onMouseEnter={() => setHoveredDropdown('services')}
              onMouseLeave={() => setHoveredDropdown(null)}
            >
              <HeartOutlined className={current.includes('/guides') || 
                current.includes('/health-and-life') || 
                current.includes('/assessment') || 
                current.includes('/consultation-booking') ? 'text-blue-500' : ''} />
              Dịch vụ
              <DownOutlined style={{ fontSize: '10px', transition: 'transform 0.2s ease' }} 
                className={hoveredDropdown === 'services' ? 'rotate-180' : ''} />
            </div>
          </Dropdown>

          {/* Y tế - Dropdown (only show if user has access) */}
          {canAccessMedicalRecords && medicalDropdownItems && (
            <Dropdown
              menu={medicalDropdownItems}
              placement="bottomCenter"
              trigger={['hover']}
              onOpenChange={(open) => {
                if (open) setHoveredDropdown('medical');
                else if (hoveredDropdown === 'medical') setHoveredDropdown(null);
              }}
              overlayClassName="custom-dropdown"
              dropdownRender={(menu) => (
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden p-2 mt-2 min-w-[280px]">
                  {menu}
                </div>
              )}
            >
              <div 
                style={dropdownStyle(
                  hoveredDropdown === 'medical', 
                  current.includes('/medical-records') || 
                  current.includes('/treatment-plans') || 
                  current.includes('/lab-results')
                )}
                onMouseEnter={() => setHoveredDropdown('medical')}
                onMouseLeave={() => setHoveredDropdown(null)}
              >
                <MedicineBoxOutlined className={current.includes('/medical-records') || 
                  current.includes('/treatment-plans') || 
                  current.includes('/lab-results') ? 'text-blue-500' : ''} />
                Y tế
                <DownOutlined style={{ fontSize: '10px', transition: 'transform 0.2s ease' }} 
                  className={hoveredDropdown === 'medical' ? 'rotate-180' : ''} />
              </div>
            </Dropdown>
          )}

          {/* Hỗ trợ - Dropdown */}
          <Dropdown
            menu={supportDropdownItems}
            placement="bottomCenter"
            trigger={['hover']}
            onOpenChange={(open) => {
              if (open) setHoveredDropdown('support');
              else if (hoveredDropdown === 'support') setHoveredDropdown(null);
            }}
            overlayClassName="custom-dropdown"
            dropdownRender={(menu) => (
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden p-2 mt-2 min-w-[280px]">
                {menu}
              </div>
            )}
          >
            <div 
              style={dropdownStyle(
                hoveredDropdown === 'support', 
                current.includes('/faq')
              )}
              onMouseEnter={() => setHoveredDropdown('support')}
              onMouseLeave={() => setHoveredDropdown(null)}
            >
              <QuestionCircleOutlined className={current.includes('/faq') ? 'text-blue-500' : ''} />
              Hỗ trợ
              <DownOutlined style={{ fontSize: '10px', transition: 'transform 0.2s ease' }} 
                className={hoveredDropdown === 'support' ? 'rotate-180' : ''} />
            </div>
          </Dropdown>
        </div>

        {/* Call to action */}
        <div className="flex items-center gap-4">
          
          {/* Appointment phone number */}
          <div className="flex items-center gap-2 bg-gradient-to-r from-blue-50 to-blue-100 py-2 px-4 rounded-full">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center shadow-sm">
              <PhoneOutlined style={{ color: 'white', fontSize: 14 }} />
            </div>
            <div>
              <div className="text-xs text-gray-500 font-medium">ĐẶT LỊCH KHÁM</div>
              <div className="text-base font-bold text-red-600">028.1081 - 1900.2125</div>
            </div>
          </div>
        </div>
      </Header>
      
      {/* Custom CSS for enhanced styling */}
      <style jsx global>{`
        .custom-dropdown .ant-dropdown-menu {
          background: transparent;
          box-shadow: none;
          border: none;
        }
        
        .custom-dropdown .ant-dropdown-menu-item {
          padding: 4px 0;
          margin: 2px 0;
          border-radius: 8px;
        }
        
        .custom-dropdown .ant-dropdown-menu-item:hover {
          background: #f0f7ff;
        }
        
        .user-dropdown-menu .ant-dropdown-menu {
          background: transparent;
          box-shadow: none;
          border: none;
        }
        
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}