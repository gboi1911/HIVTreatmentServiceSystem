import React, { useState, useEffect } from "react";
import {
  HeartHandshake,
  Shield,
  Users,
  Clock,
  Activity,
  Stethoscope,
  MessageCircle,
  ChevronRight,
  Star,
  MapPin
} from "lucide-react";
import { Link } from "react-router-dom";
import { Collapse } from "antd";
import { useLocation } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import NewsSection from "../components/HomePage/NewsSection";
import TechSection from "../components/HomePage/TechSection";
import NewTechSection from "../components/HomePage/NewTechSection";
import CategorySection from "../components/HomePage/CategorySection";

const useScrollAnimation = () => {
  const [isVisible, setIsVisible] = useState({});
  const location = useLocation();
  useEffect(() => {
    if (location.state?.message) {
          toast.success(location.state.message, {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
        }
      }, [location.state]);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(prev => ({
              ...prev,
              [entry.target.id]: true
            }));
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll('[data-animate]');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return isVisible;
};

// Dummy data for testimonials and partners
const testimonials = [
  {
    name: "Nguyễn Văn A",
    feedback: "Nhờ hệ thống này, tôi đã nhận được sự hỗ trợ kịp thời và tận tâm. Cảm ơn đội ngũ rất nhiều!",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    rating: 5,
    location: "Hà Nội"
  },
  {
    name: "Trần Thị B",
    feedback: "Thông tin trên trang rất hữu ích, giúp tôi hiểu rõ hơn về phòng ngừa và điều trị HIV.",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    rating: 5,
    location: "TP. Hồ Chí Minh"
  },
  {
    name: "Lê Minh C",
    feedback: "Dịch vụ tư vấn nhanh chóng, chuyên nghiệp. Tôi cảm thấy an tâm hơn rất nhiều.",
    avatar: "https://randomuser.me/api/portraits/men/65.jpg",
    rating: 5,
    location: "Đà Nẵng"
  }
];

const partners = [
  { name: "Bộ Y tế", logo: "https://upload.wikimedia.org/wikipedia/commons/2/2e/Ministry_of_Health_Vietnam_Logo.png" },
  { name: "UNAIDS", logo: "https://upload.wikimedia.org/wikipedia/commons/6/6e/UNAIDS_Logo.svg" },
  { name: "WHO", logo: "https://upload.wikimedia.org/wikipedia/commons/6/6e/WHO_logo.svg" },
  { name: "CDC", logo: "https://upload.wikimedia.org/wikipedia/commons/6/6a/US_CDC_logo.svg" }
];

const faqs = [
  {
    question: "Tôi có thể đăng ký tài khoản miễn phí không?",
    answer: "Có, bạn hoàn toàn có thể đăng ký tài khoản miễn phí để sử dụng các dịch vụ cơ bản của hệ thống."
  },
  {
    question: "Thông tin cá nhân của tôi có được bảo mật không?",
    answer: "Chúng tôi cam kết bảo mật tuyệt đối thông tin cá nhân của bạn theo quy định của pháp luật."
  },
  {
    question: "Làm thế nào để đặt lịch tư vấn?",
    answer: "Sau khi đăng nhập, bạn có thể vào mục 'Đặt lịch' để chọn thời gian và chuyên gia phù hợp."
  },
  {
    question: "Có dịch vụ tư vấn trực tuyến không?",
    answer: "Có, chúng tôi cung cấp dịch vụ tư vấn trực tuyến 24/7 qua video call, chat và điện thoại."
  }
];

const services = [
  {
    icon: <Stethoscope className="w-8 h-8" />,
    title: "Tư vấn chuyên khoa",
    description: "Đội ngũ bác sĩ chuyên khoa HIV/AIDS giàu kinh nghiệm",
    color: "from-blue-500 to-blue-600"
  },
  {
    icon: <Shield className="w-8 h-8" />,
    title: "Bảo mật tuyệt đối",
    description: "Thông tin cá nhân được bảo vệ với công nghệ mã hóa cao cấp",
    color: "from-emerald-500 to-emerald-600"
  },
  {
    icon: <Activity className="w-8 h-8" />,
    title: "Theo dõi sức khỏe",
    description: "Hệ thống theo dõi và nhắc nhở uống thuốc thông minh",
    color: "from-purple-500 to-purple-600"
  },
  {
    icon: <HeartHandshake className="w-8 h-8" />,
    title: "Hỗ trợ tâm lý",
    description: "Dịch vụ tư vấn tâm lý và hỗ trợ tinh thần chuyên nghiệp",
    color: "from-pink-500 to-pink-600"
  }
];

export default function Home() {
  const [activeTab, setActiveTab] = useState(0);
  const [expandedFaq, setExpandedFaq] = useState(null);
  const animations = useScrollAnimation();

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTab((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Hero Section with Enhanced Design */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800">
          <div className="absolute inset-0 bg-black/20"></div>
          {/* Floating Elements */}
          <div className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-48 h-48 bg-blue-300/20 rounded-full blur-2xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-indigo-300/20 rounded-full blur-xl animate-bounce"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 text-center text-white">
          <div className="animate-fade-in-up">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Hỗ trợ điều trị
              <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent block">
                HIV/AIDS
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Nơi bạn có thể tìm thấy thông tin, dịch vụ và sự hỗ trợ tận tâm về phòng ngừa,
              điều trị HIV và chăm sóc sức khỏe toàn diện.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={() => window.location.href = '/register'}
                className="group relative bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-8 py-4 rounded-full font-bold shadow-2xl hover:shadow-yellow-500/25 transition-all duration-300 transform flex items-center gap-2"
              >
                Đăng ký ngay
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => window.location.href = '/consultation-booking'}
                className="group border-2 border-white px-8 py-4 rounded-full font-semibold hover:bg-white text-indigo-700 transition-all duration-300 flex items-center gap-2"
              >
                <MessageCircle className="w-5 h-5" />
                <p>Tư vấn miễn phí</p>
              </button>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Quick Services Section */}
      <section
        id="services"
        data-animate
        className={`py-20 transform transition-all duration-1000 ${animations.services ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Dịch vụ chăm sóc
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"> toàn diện</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Chúng tôi cung cấp các dịch vụ chuyên nghiệp và tận tâm để hỗ trợ bạn trong hành trình điều trị
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, idx) => (
              <div
                key={idx}
                className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${service.color} rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${service.color} text-white rounded-xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">{service.title}</h3>
                <p className="text-gray-600 leading-relaxed">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section with Enhanced Design */}
      <section
        id="stats"
        data-animate
        className={`py-20 bg-gradient-to-r from-blue-600 via-indigo-700 to-purple-800 relative overflow-hidden transform transition-all duration-1000 ${animations.stats ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
      >
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-48 h-48 bg-blue-300/20 rounded-full blur-2xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Thành tựu của chúng tôi
            </h2>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Những con số ấn tượng thể hiện sự tin tưởng của cộng đồng
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: "10,000+", label: "Người dùng đã đăng ký", icon: <Users className="w-8 h-8" style={{color:"white"}}/> },
              { number: "500+", label: "Chuyên gia & Bác sĩ", icon: <Stethoscope className="w-8 h-8" style={{color:"white"}}/> },
              { number: "24/7", label: "Hỗ trợ trực tuyến", icon: <Clock className="w-8 h-8" style={{color:"white"}}/> },
              { number: "100%", label: "Bảo mật thông tin", icon: <Shield className="w-8 h-8" style={{color:"white"}}/> }
            ].map((stat, idx) => (
              <div
                key={idx}
                className="text-center group transform hover:scale-105 transition-all duration-300"
                style={{ animationDelay: `${idx * 150}ms` }}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4 group-hover:bg-white/30 transition-colors duration-300">
                  {stat.icon}
                </div>
                <div className="text-4xl md:text-5xl font-bold text-white mb-2 group-hover:text-yellow-300 transition-colors duration-300">
                  {stat.number}
                </div>
                <div className="text-blue-100 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section>
        <NewsSection />
        <NewTechSection />
        <TechSection />
        <CategorySection />
      </section>
      {/* Enhanced Testimonials Section */}
      <section
        id="testimonials"
        data-animate
        className={`py-20 bg-gradient-to-br from-gray-50 to-blue-50 transform transition-all duration-1000 ${animations.testimonials ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Cảm nhận từ
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"> người dùng</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Lắng nghe những chia sẻ chân thành từ những người đã tin tưởng sử dụng dịch vụ của chúng tôi
            </p>
          </div>

          <div className="relative">
            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, idx) => (
                <div
                  key={idx}
                  className={`bg-white rounded-2xl shadow-lg p-8 transform transition-all duration-500 hover:scale-105 border border-gray-100 ${idx === activeTab ? 'ring-2 ring-blue-500 shadow-2xl' : ''
                    }`}
                >
                  <div className="flex items-center mb-6">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-16 h-16 rounded-full border-4 border-blue-100 object-cover mr-4"
                    />
                    <div>
                      <h4 className="font-bold text-gray-800">{testimonial.name}</h4>
                      <p className="text-gray-500 text-sm flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {testimonial.location}
                      </p>
                    </div>
                  </div>

                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>

                  <p className="text-gray-700 italic leading-relaxed">
                    "{testimonial.feedback}"
                  </p>
                </div>
              ))}
            </div>

            {/* Testimonial Indicators */}
            <div className="flex justify-center mt-8 space-x-2">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveTab(idx)}
                  className={`w-3 h-3 rounded-full transition-colors duration-300 ${idx === activeTab ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>


      {/* FAQ Section with Accordion */}
      <section
        id="faq"
        data-animate
        className={`py-20 bg-gradient-to-br from-blue-50 to-indigo-50 transform transition-all duration-1000 ${animations.faq ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
      >
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Câu hỏi
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"> thường gặp</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Tìm hiểu những thông tin quan trọng về dịch vụ của chúng tôi
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100"
              >
                <button
                  onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                  className="w-full text-left p-6 flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
                >
                  <span className="font-bold text-gray-800 pr-4">{faq.question}</span>
                  <ChevronRight
                    className={`w-5 h-5 text-blue-600 transform transition-transform duration-200 ${expandedFaq === idx ? 'rotate-90' : ''
                      }`}
                  />
                </button>
                <div
                  className={`px-6 overflow-hidden transition-all duration-300 ${expandedFaq === idx ? 'max-h-96 pb-6' : 'max-h-0'
                    }`}
                >
                  <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="faq"
        data-animate
        className={`py-20 bg-gradient-to-br from-blue-50 to-indigo-50 transform transition-all duration-1000 ${animations.faq ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
      >


      </section>
      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out;
        }
      `}</style>
      <ToastContainer/>
    </div>
  );
}