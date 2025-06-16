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
        localStorage.setItem('token', data.token); // Save token
        setLoading(false);
      
        navigate('/', {
          state: { 
          message: 'Đăng nhập thành công!',
          type: 'success'
        } 
        });
      } catch (err) {
        console.log(err)
        setErrors({ password: 'Sai số điện thoại hoặc mật khẩu!' });
        setLoading(false);
      }
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