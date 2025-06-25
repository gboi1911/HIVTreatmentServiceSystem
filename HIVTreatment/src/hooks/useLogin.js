import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { login } from '../api/auth';
import { ToastContainer, toast } from 'react-toastify';

export function useLogin() {
  const [formData, setFormData] = useState({ username: '', password: '', remember: false });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username) {
      newErrors.username = 'Hãy nhập số điện thoại của bạn!';
    } else if (!/^(84|0[3|5|7|8|9])(\d{8})$/.test(formData.username)) {
      newErrors.username = 'Số điện thoại không đúng định dạng! (VD: 0912345678)';
    }
    if (!formData.password) {
      newErrors.password = 'Hãy nhập mật khẩu của bạn!';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setLoading(true);
      try {
        const data = await login(formData.username, formData.password);
        
        console.log("Full API Response:", data);
        
        // Save token
        if (data.token) {
          localStorage.setItem('token', data.token);
        } else {
          throw new Error("No token received from server");
        }

        // Construct user info from login response and token
        let userInfo;
        
        // Try to get user info from login response first
        if (data.id || data.email || data.fullName) {
          userInfo = {
            id: data.id,
            email: data.email,
            phone: data.phone,
            fullName: data.fullName,
            username: data.fullName || data.email || formData.username,
            role: data.role || 'CUSTOMER'
          };
        } else {
          // If no user data in response, try to decode from JWT token
          try {
            const payload = JSON.parse(atob(data.token.split('.')[1]));
            userInfo = {
              id: payload.sub || payload.userId || Date.now(),
              email: payload.email || formData.username,
              phone: payload.phone || formData.username,
              fullName: payload.fullName || payload.name || payload.username || 'Người dùng',
              username: payload.username || payload.email || formData.username,
              role: payload.role || payload.authorities?.[0] || 'CUSTOMER'
            };
          } catch (tokenError) {
            // Final fallback
            userInfo = {
              id: Date.now(),
              email: formData.username,
              phone: formData.username,
              fullName: 'Người dùng',
              username: formData.username,
              role: 'CUSTOMER'
            };
          }
        }

        // Save user info
        localStorage.setItem("userInfo", JSON.stringify(userInfo));
        
        console.log("User Info saved:", userInfo);
        console.log("Token saved:", data.token);
        
        setLoading(false);
      
        navigate('/', {
          state: { 
            message: 'Đăng nhập thành công!',
            type: 'success'
          } 
        });
        
      } catch (err) {
        console.error("Login error:", err);
        setErrors({ password: 'Sai số điện thoại hoặc mật khẩu!' });
        setLoading(false);
      }
    }
  };

  const handleGoogleLogin = () => {
    // Update with your actual backend URL if different
    window.location.href = `${process.env.REACT_APP_API_URL || 'https://hiv.purepixel.io.vn'}/api/oauth2/authorization/google`;
  };

  return {
    formData,
    loading,
    errors,
    showPassword,
    setShowPassword,
    focusedField,
    setFocusedField,
    handleInputChange,
    handleSubmit,
    handleGoogleLogin,
  };
}