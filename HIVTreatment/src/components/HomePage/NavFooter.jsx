import React, { useState, useEffect } from 'react';
import { 
  HeartHandshake, 
  Shield, 
  Phone, 
  Mail, 
  MapPin, 
  Clock,
  Facebook,
  Youtube,
  Twitter,
  Instagram,
  ChevronRight,
  Activity,
  Users,
  Stethoscope,
  Award,
  Globe,
  ArrowUp
} from 'lucide-react';

const NavFooter = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const quickLinks = [
    { title: "Trang chủ", href: "/" },
    { title: "Về chúng tôi", href: "/about" },
    { title: "Dịch vụ", href: "/services" },
    { title: "Đặt lịch khám", href: "/appointment" },
    { title: "Tin tức", href: "/news" },
    { title: "Liên hệ", href: "/contact" }
  ];

  const services = [
    { title: "Tư vấn HIV/AIDS", href: "/hiv-counseling" },
    { title: "Xét nghiệm HIV", href: "/hiv-testing" },
    { title: "Điều trị ARV", href: "/arv-treatment" },
    { title: "Chăm sóc sức khỏe", href: "/healthcare" },
    { title: "Hỗ trợ tâm lý", href: "/psychological-support" },
    { title: "Dự phòng PrEP", href: "/prep-treatment" }
  ];

  const resources = [
    { title: "Thông tin HIV", href: "/hiv-info" },
    { title: "Hướng dẫn phòng ngừa", href: "/prevention-guide" },
    { title: "Câu hỏi thường gặp", href: "/faq" },
    { title: "Tài liệu y khoa", href: "/medical-docs" },
    { title: "Video giáo dục", href: "/educational-videos" },
    { title: "Cộng đồng hỗ trợ", href: "/community" }
  ];

  const socialLinks = [
    { icon: <Facebook className="w-5 h-5" />, href: "#", color: "hover:bg-blue-600", label: "Facebook" },
    { icon: <Youtube className="w-5 h-5" />, href: "#", color: "hover:bg-red-600", label: "YouTube" },
    { icon: <Twitter className="w-5 h-5" />, href: "#", color: "hover:bg-blue-400", label: "Twitter" },
    { icon: <Instagram className="w-5 h-5" />, href: "#", color: "hover:bg-pink-600", label: "Instagram" }
  ];

  return (
    <div className="w-full relative">
      {/* Inspirational Quote Section */}
      <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 py-12 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-100/20 via-indigo-100/20 to-purple-100/20"></div>
        <div className="absolute top-0 left-0 w-32 h-32 bg-blue-300/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-40 h-40 bg-purple-300/20 rounded-full blur-xl animate-pulse delay-1000"></div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-4">
          <div className="flex items-center justify-center mb-4">
            <HeartHandshake className="w-8 h-8 text-blue-600 mr-3" />
            <h3 className="text-2xl font-bold text-gray-800">Thông điệp của chúng tôi</h3>
          </div>
          <p className="text-xl text-gray-700 italic font-medium mb-6 leading-relaxed">
            "Cùng nhau vượt qua thử thách, xây dựng tương lai khỏe mạnh và tràn đầy hy vọng!"
          </p>
          
          {/* Social Media Links */}
          <div className="flex justify-center gap-4">
            {socialLinks.map((social, idx) => (
              <a
                key={idx}
                href={social.href}
                aria-label={social.label}
                className={`w-12 h-12 bg-white rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 transform hover:scale-110 shadow-lg hover:shadow-xl ${social.color} hover:text-white group border border-gray-200`}
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <footer className="bg-gradient-to-br from-slate-800 via-blue-900 to-indigo-900 text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 bg-blue-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-indigo-500 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/4 w-48 h-48 bg-purple-500 rounded-full blur-2xl"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Organization Info */}
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Stethoscope className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">
                    HIV Care Center
                  </h3>
                  <p className="text-blue-200 text-sm">Chăm sóc tận tâm</p>
                </div>
              </div>
              
              <div className="space-y-3 text-sm text-gray-300">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p>264 Cống Quỳnh, P. Phạm Ngũ Lão</p>
                    <p>Quận 1, TP. Hồ Chí Minh, Việt Nam</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-blue-400" />
                  <div>
                    <p className="hover:text-blue-300 transition-colors cursor-pointer">
                      (028) 3952 6568
                    </p>
                    <p className="text-xs text-gray-400">Đăng ký khám: 1900-1234</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-blue-400" />
                  <p className="hover:text-blue-300 transition-colors cursor-pointer">
                    support@hivcare.vn
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-blue-400" />
                  <p>Hỗ trợ 24/7 - Luôn bên bạn</p>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-6">
              <h4 className="text-xl font-bold text-white flex items-center">
                <Globe className="w-5 h-5 mr-2 text-blue-400" />
                Liên kết nhanh
              </h4>
              <div className="space-y-3">
                {quickLinks.map((link, idx) => (
                  <a
                    key={idx}
                    href={link.href}
                    className="flex items-center text-gray-300 hover:text-blue-300 transition-all duration-200 group"
                  >
                    <ChevronRight className="w-4 h-4 mr-2 text-blue-400 group-hover:translate-x-1 transition-transform" />
                    {link.title}
                  </a>
                ))}
              </div>
            </div>

            {/* Services */}
            <div className="space-y-6">
              <h4 className="text-xl font-bold text-white flex items-center">
                <Activity className="w-5 h-5 mr-2 text-blue-400" />
                Dịch vụ chăm sóc
              </h4>
              <div className="space-y-3">
                {services.map((service, idx) => (
                  <a
                    key={idx}
                    href={service.href}
                    className="flex items-center text-gray-300 hover:text-blue-300 transition-all duration-200 group"
                  >
                    <ChevronRight className="w-4 h-4 mr-2 text-blue-400 group-hover:translate-x-1 transition-transform" />
                    {service.title}
                  </a>
                ))}
              </div>
            </div>

            {/* Resources */}
            <div className="space-y-6">
              <h4 className="text-xl font-bold text-white flex items-center">
                <Shield className="w-5 h-5 mr-2 text-blue-400" />
                Tài nguyên hỗ trợ
              </h4>
              <div className="space-y-3">
                {resources.map((resource, idx) => (
                  <a
                    key={idx}
                    href={resource.href}
                    className="flex items-center text-gray-300 hover:text-blue-300 transition-all duration-200 group"
                  >
                    <ChevronRight className="w-4 h-4 mr-2 text-blue-400 group-hover:translate-x-1 transition-transform" />
                    {resource.title}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-110 flex items-center justify-center z-50 animate-bounce"
          aria-label="Scroll to top"
        >
          <ArrowUp size={40} />
        </button>
      )}
    </div>
  );
};

export default NavFooter;