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
    if (validateForm()) {
      setLoading(true);
      try {
        const data = await login(formData.email, formData.password);
        localStorage.setItem('token', data.token); // Save token
        setLoading(false);
        navigate('/'); // Redirect after login
      } catch (err) {
        setErrors({ password: 'Sai email hoặc mật khẩu!' });
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