import React, { useState, useEffect } from "react";
import { Layout, Menu, Button, Dropdown, Badge, Avatar } from "antd";
import logo from "../assets/logo.png";
import {
  HomeOutlined,
  FileTextOutlined,
  InfoCircleOutlined,
  BookOutlined,
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
  BellOutlined,
  DashboardOutlined,
  ClockCircleOutlined,
  EnvironmentOutlined,
  MailOutlined,
  StarOutlined
} from "@ant-design/icons";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuthStatus } from "../hooks/useAuthStatus";

const { Header } = Layout;

// Function to get quick links - now always shows useful links
const getQuickLinks = (userRole, isLoggedIn) => {
  const baseLinks = [
    { path: "/assessment/risk-assessment", label: "Đánh giá rủi ro", icon: <SafetyOutlined />, hot: true },
    { path: "/consultation-booking", label: "Đặt lịch tư vấn", icon: <CalendarOutlined /> },
    { path: "/guides", label: "Hướng dẫn", icon: <BookOutlined /> },
    { path: "/contact", label: "Liên hệ", icon: <PhoneOutlined /> }
  ];

  // Add dashboard link for admin and staff
  if (userRole && ['ADMIN', 'MANAGER', 'STAFF', 'DOCTOR'].includes(userRole.toUpperCase())) {
    baseLinks.unshift({ path: "/admin/dashboard", label: "Dashboard", icon: <DashboardOutlined /> });
  }

  // Add user-specific links for logged-in users
  if (isLoggedIn) {
    baseLinks.push({ path: "/user/appointment-history", label: "Lịch sử cuộc hẹn", icon: <CalendarOutlined /> });
  }

  return baseLinks;
};

// Organize menu items into categories
const getOrganizedMenuItems = (canAccessMedicalRecords, userRole) => {
  const servicesMenuItems = userRole !== 'DOCTOR' ? [
    { path: "/assessment/risk-assessment", label: "Đánh giá rủi ro", icon: <SafetyOutlined />, description: "Kiểm tra nguy cơ phơi nhiễm HIV", hot: true },
    { path: "/consultation-booking", label: "Đặt lịch tư vấn", icon: <CalendarOutlined />, description: "Đặt lịch gặp bác sĩ tư vấn" },
    { path: "/guides", label: "Hướng dẫn & Bảng giá", icon: <BookOutlined />, description: "Quy trình khám và bảng giá dịch vụ" },
    { path: "/health-and-life", label: "Sức khoẻ & đời sống", icon: <HeartOutlined />, description: "Thông tin chăm sóc sức khỏe hàng ngày" },
  ] : [];

  const medicalMenuItems = canAccessMedicalRecords && userRole !== 'DOCTOR' ? [
    { path: "/medical-records", label: "Hồ sơ bệnh án", icon: <FileTextOutlined />, description: "Quản lý hồ sơ bệnh án" },
    { path: "/treatment-plans", label: "Kế hoạch điều trị", icon: <MedicineBoxOutlined />, description: "Quản lý kế hoạch điều trị ARV" },
    { path: "/appointment-management", label: "Quản lý cuộc hẹn", icon: <CalendarOutlined />, description: "Quản lý lịch hẹn bệnh nhân" },
  ] : [];

  const supportMenuItems = [
    { path: "/ask-and-answer", label: "Hỏi & Đáp", icon: <QuestionCircleOutlined />, description: "Các câu hỏi thường gặp" },
    { path: "/contact", label: "Liên hệ", icon: <PhoneOutlined />, description: "Thông tin liên hệ hỗ trợ" },
  ];

  const doctorMenuItems = [
    { path: "/doctor/dashboard", label: "Dashboard", icon: <DashboardOutlined /> },
    { path: "/doctor/appointments", label: "Quản lý cuộc hẹn", icon: <CalendarOutlined /> },
    { path: "/doctor/medical-records", label: "Quản lý hồ sơ bệnh án", icon: <FileTextOutlined /> },
    { path: "/doctor/lab-results", label: "Quản lý kết quả xét nghiệm", icon: <ExperimentOutlined /> },
    { path: "/doctor/treatment-plans", label: "Quản lý kế hoạch điều trị", icon: <MedicineBoxOutlined /> },

  ]
  return {
    services: servicesMenuItems,
    medical: medicalMenuItems,
    support: supportMenuItems,
    doctor: userRole === 'DOCTOR' ? doctorMenuItems : []
  };
};

export default function Navbar() {
  const { isLoggedIn, userRole } = useAuthStatus();
  const location = useLocation();
  const [current, setCurrent] = useState(location.pathname);
  const [userInfo, setUserInfo] = useState(null);
  const [hoveredDropdown, setHoveredDropdown] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const navigate = useNavigate();

  // Get dynamic quick links based on user role and login status
  const quickLinks = getQuickLinks(userRole, isLoggedIn);

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Set current path when location changes
  useEffect(() => {
    setCurrent(location.pathname);
  }, [location.pathname]);

  // Check if user can access medical records
  const canAccessMedicalRecords = userRole && 
    ['STAFF', 'CONSULTANT', 'MANAGER', 'ADMIN', 'DOCTOR'].includes(userRole.toUpperCase());

  const organizedMenuItems = getOrganizedMenuItems(canAccessMedicalRecords, userRole);

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
        key: 'appointment-history',
        label: (
          <div className="flex items-center gap-2 py-1">
            <CalendarOutlined className="text-orange-500" />
            <span>Lịch sử cuộc hẹn</span>
          </div>
        ),
        onClick: () => navigate('/user/appointment-history')
      },
      // Add this for user/patient only
      ...(userRole === 'user' || userRole === 'patient' || userRole === 'CUSTOMER'? [{
        key: 'user-medical-record',
        label: (
          <div className="flex items-center gap-2 py-1">
            <FileTextOutlined className="text-purple-500" />
            <span>Hồ sơ bệnh án của tôi</span>
          </div>
        ),
        onClick: () => navigate('/user/medical-record')
      }, {
        key: 'user-lab-results',
        label: (
          <div className="flex items-center gap-2 py-1">
            <FileTextOutlined className="text-green-500" />
            <span>Kết quả xét nghiệm của tôi</span>
          </div>
        ),
        onClick: () => navigate('/user/lab-results')
      }, {
        key: 'user-treatment-plans',
        label: (
          <div className="flex items-center gap-2 py-1">
            <FileTextOutlined className="text-blue-500" />
            <span>Kế hoạch điều trị của tôi</span>
          </div>
        ),
        onClick: () => navigate('/user/treatment-plans')
      }] : []),
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
      {/* Enhanced Top blue bar - Always visible with useful information */}
      <div className="bg-gradient-to-r from-sky-500 via-blue-600 to-blue-700 text-white text-sm flex items-center justify-between px-10 h-14 backdrop-blur-sm shadow-sm relative overflow-hidden">
        {/* Background decoration elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-32 right-1/3 w-64 h-64 bg-blue-400 opacity-10 rounded-full blur-3xl"></div>
        </div>
        
        {/* Left side - Quick access links */}
        <div className="flex items-center gap-6 relative z-10">
          {/* Operating hours */}
          <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full backdrop-blur-sm">
            <ClockCircleOutlined className="text-green-300" />
            <span className="font-medium text-sm">24/7 Hỗ trợ</span>
          </div>
          
          {/* Current time */}
          <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full backdrop-blur-sm">
            <ClockCircleOutlined className="text-yellow-300" />
            <span className="font-medium text-sm">
              {currentTime.toLocaleTimeString('vi-VN', { 
                hour: '2-digit', 
                minute: '2-digit',
                hour12: false 
              })}
            </span>
          </div>
        </div>
        
        {/* Center - Quick navigation links */}
        <div className="flex gap-3 relative z-10 overflow-x-auto no-scrollbar">
          {quickLinks.slice(0, 4).map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className="whitespace-nowrap no-underline py-2 px-4 rounded-full transition-all duration-200 text-sm font-medium hover:bg-white/15 flex items-center gap-2 border border-white/20"
              style={{ color: "#fff" }}
            >
              {link.icon}
              {link.label}
              {link.hot && (
                <span className="ml-1 px-1.5 py-0.5 bg-red-500 text-white text-xs rounded-full animate-pulse">
                  Hot
                </span>
              )}
            </Link>
          ))}
        </div>
        
        {/* Right side controls */}
        <div className="flex items-center gap-4 relative z-10">
          {/* Search */}
          <div className="p-2 hover:bg-white/15 rounded-full cursor-pointer transition-all duration-200">
            <SearchOutlined style={{ fontSize: 16 }} />
          </div>
          
          {/* Notifications */}
          <div className="p-2 hover:bg-white/15 rounded-full cursor-pointer transition-all duration-200 relative">
            <BellOutlined style={{ fontSize: 16 }} />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-xs text-white font-bold">3</span>
            </div>
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
              <div className="flex items-center gap-2 py-1.5 px-3 hover:bg-white/15 rounded-full cursor-pointer transition-all duration-200 border border-white/20">
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
                { key: "vi", label: "🇻🇳 Tiếng Việt" },
                { key: "en", label: "🇺🇸 English" },
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
          
          {/* Giới thiệu */}
          <Link
            to="/about"
            style={navItemStyle(current === "/about")}
            onClick={() => setCurrent("/about")}
          >
            <InfoCircleOutlined />
            Giới thiệu
          </Link>

          {/* Doctor-specific navigation */}
          {userRole === 'DOCTOR' && organizedMenuItems.doctor.length > 0 && (
            <Dropdown
              menu={createDropdownContent(organizedMenuItems.doctor)}
              placement="bottomCenter"
              trigger={['hover']}
              onOpenChange={(open) => {
                if (open) setHoveredDropdown('doctor');
                else if (hoveredDropdown === 'doctor') setHoveredDropdown(null);
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
                  hoveredDropdown === 'doctor',
                  current.includes('/doctor/')
                )}
                onMouseEnter={() => setHoveredDropdown('doctor')}
                onMouseLeave={() => setHoveredDropdown(null)}
              >
                <UserOutlined className={current.includes('/doctor/') ? 'text-blue-500' : ''} />
                Bác sĩ
                <DownOutlined style={{ fontSize: '10px', transition: 'transform 0.2s ease' }} 
                  className={hoveredDropdown === 'doctor' ? 'rotate-180' : ''} />
              </div>
            </Dropdown>
          )}

          {/* Regular user navigation (non-doctor) */}
          {userRole !== 'DOCTOR' && (
            <>
              {/* Dịch vụ */}
              {organizedMenuItems.services.length > 0 && (
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
              )}

              {/* Y tế */}
              {canAccessMedicalRecords && organizedMenuItems.medical.length > 0 && (
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
                      current.includes('/appointment-management')
                    )}
                    onMouseEnter={() => setHoveredDropdown('medical')}
                    onMouseLeave={() => setHoveredDropdown(null)}
                  >
                    <MedicineBoxOutlined className={current.includes('/medical-records') || 
                      current.includes('/treatment-plans') || 
                      current.includes('/appointment-management') ? 'text-blue-500' : ''} />
                    Y tế
                    <DownOutlined style={{ fontSize: '10px', transition: 'transform 0.2s ease' }} 
                      className={hoveredDropdown === 'medical' ? 'rotate-180' : ''} />
                  </div>
                </Dropdown>
              )}
            </>
          )}

          {/* Hỗ trợ */}
          {organizedMenuItems.support.length > 0 && (
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
                  current.includes('/ask-and-answer') || current.includes('/contact')
                )}
                onMouseEnter={() => setHoveredDropdown('support')}
                onMouseLeave={() => setHoveredDropdown(null)}
              >
                <QuestionCircleOutlined className={current.includes('/ask-and-answer') || current.includes('/contact') ? 'text-blue-500' : ''} />
                Hỗ trợ
                <DownOutlined style={{ fontSize: '10px', transition: 'transform 0.2s ease' }} 
                  className={hoveredDropdown === 'support' ? 'rotate-180' : ''} />
              </div>
            </Dropdown>
          )}
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
        
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: .5;
          }
        }
        
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
}