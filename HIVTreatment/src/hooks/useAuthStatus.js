import { useState, useEffect } from 'react';

export const useAuthStatus = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuthStatus = () => {
      try {
        const token = localStorage.getItem('token');
        const savedUserInfo = localStorage.getItem('userInfo');
        console.log(token, savedUserInfo);
        if (token && savedUserInfo) {
          const parsedUserInfo = JSON.parse(savedUserInfo);
          setIsLoggedIn(true);
          setUserInfo(parsedUserInfo);
          setUserRole(parsedUserInfo.role || parsedUserInfo.userRole);
        } else if (token) {
          // Try to decode role from token
          const payload = JSON.parse(atob(token.split('.')[1]));
          const role = payload.role || payload.userRole || payload.authorities?.[0];
          
          setIsLoggedIn(true);
          setUserRole(role);
          setUserInfo({ 
            username: payload.username || payload.email || 'User',
            role: role 
          });
        } else {
          setIsLoggedIn(false);
          setUserRole(null);
          setUserInfo(null);
        }
      } catch (error) {
        console.error('Auth check error:', error);
        setIsLoggedIn(false);
        setUserRole(null);
        setUserInfo(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();

    // Listen for storage changes (logout from another tab)
    const handleStorageChange = (e) => {
      if (e.key === 'token' || e.key === 'userInfo') {
        checkAuthStatus();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return { 
    isLoggedIn, 
    userRole, 
    userInfo, 
    loading,
    isAdmin: userRole === 'admin' || userRole === 'administrator',
    isUser: userRole === 'user' || userRole === 'patient',
    isStaff: ['staff', 'doctor', 'nurse', 'healthcare'].includes(userRole)
  };
};