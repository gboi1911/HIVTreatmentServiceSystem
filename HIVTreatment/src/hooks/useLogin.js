import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
      newErrors.username = 'Hãy nhập tên đăng nhập hoặc số điện thoại!';
    }
    if (!formData.password) {
      newErrors.password = 'Hãy nhập mật khẩu của bạn!';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password
        })
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify({
          id: data.id,
          fullName: data.fullName,
          email: data.email,
          phone: data.phone,
          gender: data.gender
        }));
        if (formData.remember) {
          localStorage.setItem('rememberMe', 'true');
        }
        alert('Đăng nhập thành công!');
        navigate('/dashboard');
      } else {
        const errorData = await response.json();
        setErrors({ 
          general: errorData.message || 'Tên đăng nhập hoặc mật khẩu không đúng!' 
        });
      }
    } catch (error) {
      setErrors({ 
        general: 'Không thể kết nối đến server. Vui lòng thử lại sau!' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = '/api/oauth2/authorization/google';
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