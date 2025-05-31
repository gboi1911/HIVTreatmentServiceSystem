import React, { useState } from 'react';
import { UserOutlined, LockOutlined, GoogleOutlined, HeartOutlined, MedicineBoxOutlined, SafetyOutlined, EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

const MedicalLoginPage = () => {
  const [formData, setFormData] = useState({ username: '', password: '', remember: false });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState('');

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = 'Hãy nhâp địa chỉ email của bạn!';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email!';
    }
    if (!formData.password) {
      newErrors.password = 'Hãy nhập mật khẩu của bạn!';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setLoading(true);
      setTimeout(() => {
        console.log('Login values:', formData);
        setLoading(false);
      }, 1500);
    }
  };

  const handleGoogleLogin = () => {
    console.log('Google login clicked');
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="flex-1 flex items-center justify-center px-8 py-12 relative">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-20 w-32 h-32 bg-blue-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-32 right-16 w-24 h-24 bg-indigo-500 rounded-full blur-3xl"></div>
        </div>
        
        <div className="w-full max-w-md relative z-10">
          <div className="mb-10">
            <div className="flex items-center mb-8 group">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mr-4 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                  <MedicineBoxOutlined className="text-white text-xl" style={{
                    color:"white"
                  }}/>
                </div>
              </div>
              <span className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                Phần mềm hỗ trợ phòng ngừa sử dụng ma tuý
              </span>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-3 leading-tight">
              Đăng nhập
            </h1>
            <p className="text-gray-500 text-lg">Đăng nhập vào tài khoản của bạn</p>
          </div>

          {/* Login Form */}
          <div className="space-y-6">
            <div className="group">
              <label className="block text-gray-700 font-semibold mb-3 text-sm uppercase tracking-wide">
                Địa chỉ email
              </label>
              <div className="relative">
                <div className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-colors duration-300 ${
                  focusedField === 'email' ? 'text-blue-500' : 'text-gray-400'
                }`}>
                  <UserOutlined className="text-lg" />
                </div>
                <input
                  type="email"
                  placeholder="Nhập địa chỉ email của bạn"
                  autoComplete='email'
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField('')}
                  className={`w-full pl-12 pr-4 py-4 bg-white/80 backdrop-blur-sm border-2 rounded-2xl focus:outline-none transition-all duration-300 text-gray-800 placeholder-gray-400 ${
                    errors.email 
                      ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100' 
                      : focusedField === 'email'
                        ? 'border-blue-500 focus:ring-4 focus:ring-blue-100 shadow-lg'
                        : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                  }`}
                />
                {focusedField === 'email' && (
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/10 to-indigo-500/10 pointer-events-none"></div>
                )}
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm mt-2 animate-pulse flex items-center">
                  <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password Input */}
            <div className="group">
              <label className="block text-gray-700 font-semibold mb-3 text-sm uppercase tracking-wide">
                Mật khẩu
              </label>
              <div className="relative">
                <div className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-colors duration-300 ${
                  focusedField === 'password' ? 'text-blue-500' : 'text-gray-400'
                }`}>
                  <LockOutlined className="text-lg" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Nhập mật khẩu của bạn"
                  autoComplete='current-password'
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField('')}
                  className={`w-full pl-12 pr-12 py-4 bg-white/80 backdrop-blur-sm border-2 rounded-2xl focus:outline-none transition-all duration-300 text-gray-800 placeholder-gray-400 ${
                    errors.password 
                      ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100' 
                      : focusedField === 'password'
                        ? 'border-blue-500 focus:ring-4 focus:ring-blue-100 shadow-lg'
                        : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  {showPassword ? <EyeInvisibleOutlined className="text-lg" /> : <EyeOutlined className="text-lg" />}
                </button>
                {focusedField === 'password' && (
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/10 to-indigo-500/10 pointer-events-none"></div>
                )}
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-2 animate-pulse flex items-center">
                  <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                  {errors.password}
                </p>
              )}
            </div>

            {/* forgot */}
            <div className="flex items-center justify-between py-1">
              <label className="flex items-center cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={formData.remember}
                    onChange={(e) => handleInputChange('remember', e.target.checked)}
                    className="sr-only"
                  />
                </div>
              </label>
              <a href="#" className="text-blue-600 hover:text-blue-700 font-semibold text-sm hover:underline transition-all duration-200">
                Quên mật khẩu?
              </a>
            </div>

            
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none disabled:hover:shadow-lg"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                  Đang đăng nhập...
                </div>
              ) : (
                <span className="flex items-center">
                  Đăng nhập
                  <svg className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              )}
            </button>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-gradient-to-r from-slate-50 to-blue-50 text-gray-500 font-medium">
                  Hoặc đăng nhập bằng
                </span>
              </div>
            </div>

            {/* Google Sign In */}
            <button
              onClick={handleGoogleLogin}
              className="w-full bg-white/80 backdrop-blur-sm border-2 border-gray-200 hover:border-gray-300 text-gray-700 font-semibold py-4 px-6 rounded-2xl transition-all duration-300 flex items-center justify-center shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              <GoogleOutlined className="text-xl mr-3 text-red-500" />
              Đăng nhập với Google
            </button>

            <div className="text-center pt-6">
              <span className="text-gray-500">Bạn không có tài khoản? </span>
              <Link to="/register" className="text-blue-600 hover:text-blue-700 font-semibold hover:underline transition-all duration-200">
                Tạo tài khoản mới ở đây
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-32 right-16 w-48 h-48 bg-white/5 rounded-full blur-2xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-white/15 rounded-full blur-2xl animate-pulse delay-500"></div>
        </div>


        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-24 left-16 animate-float">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <HeartOutlined className="text-white text-2xl animate-pulse" />
            </div>
          </div>
          <div className="absolute top-1/3 right-20 animate-float delay-1000">
            <div className="w-12 h-12 bg-white/15 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <SafetyOutlined className="text-white text-lg" />
            </div>
          </div>
          <div className="absolute bottom-1/3 left-12 animate-float delay-500">
            <div className="w-14 h-14 bg-white/25 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <MedicineBoxOutlined className="text-white text-xl" />
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex items-center justify-center h-full relative z-10">
          <div className="text-center text-white max-w-lg px-8">
            {/* Hero illustration */}
            <div className="mb-12 relative">
              <div className="w-64 h-64 mx-auto bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center shadow-2xl border border-white/30 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
                <div className="w-40 h-40 bg-white rounded-full flex items-center justify-center shadow-inner relative z-10">
                  {/* Modern stethoscope design */}
                  <div className="relative">
                    <div className="w-24 h-24 border-4 border-blue-600 rounded-full relative shadow-lg">
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <div className="w-2 h-16 bg-gradient-to-b from-blue-600 to-blue-800 rounded-full shadow-sm"></div>
                        <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-blue-600 rounded-full shadow-lg"></div>
                      </div>
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <HeartOutlined className="text-blue-600 text-3xl animate-pulse" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="absolute top-8 right-8 w-4 h-4 bg-emerald-400 rounded-full animate-ping"></div>
              <div className="absolute bottom-12 left-4 w-3 h-3 bg-yellow-300 rounded-full animate-bounce"></div>
            </div>
            
            <h2 className="text-4xl font-bold mb-6 leading-tight">
              Chăm sóc 
              <span className="block bg-gradient-to-r from-emerald-300 to-blue-300 bg-clip-text text-transparent">
               là yêu thương bản thân
              </span>
            </h2>
            <p className="text-blue-100 text-xl leading-relaxed mb-10 font-light">
              Trải nghiệm chăm sóc sức khỏe với quyền truy cập an toàn vào những 
              thông tin chi tiết được hỗ trợ bởi đội ngũ chăm sóc của bạn.
            </p>
            
            {/* Feature highlights */}
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center group">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-all duration-300 border border-white/30">
                  <SafetyOutlined className="text-white text-2xl" />
                </div>
                <h3 className="font-semibold text-white mb-2">Tôn trọng quyền riêng tư</h3>
                <p className="text-sm text-blue-200 leading-relaxed">Tài khoản ẩn danh, dữ liệu bảo mật</p>
              </div>
              <div className="text-center group">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-all duration-300 border border-white/30">
                  <HeartOutlined className="text-white text-2xl animate-pulse" />
                </div>
                <h3 className="font-semibold text-white mb-2">Đặt lịch nhanh chóng</h3>
                <p className="text-sm text-blue-200 leading-relaxed">Chủ động đặt và nhắc hẹn khám</p>
              </div>
              <div className="text-center group">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-all duration-300 border border-white/30">
                  <MedicineBoxOutlined className="text-white text-2xl" />
                </div>
                <h3 className="font-semibold text-white mb-2">Truy cập 24/7</h3>
                <p className="text-sm text-blue-200 leading-relaxed">Sẵn sàng mọi lúc, mọi nơi</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom wave effect */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-16 fill-white/10">
            <path d="M0,0V60c0,0,200,40,400,20s400-40,800,0v40H0V0z"></path>
          </svg>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .delay-500 {
          animation-delay: 0.5s;
        }
        .delay-1000 {
          animation-delay: 1s;
        }
      `}</style>
    </div>
  );
};

export default MedicalLoginPage;