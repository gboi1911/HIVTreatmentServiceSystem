import { useState, useEffect } from 'react';
import { getCustomerById } from '../api/customer';

export const useAuthStatus = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const token = localStorage.getItem('token');
        const savedUserInfo = localStorage.getItem('userInfo');
        console.log(token, savedUserInfo);
        let parsedUserInfo = null;
        let role = null;
        if (token && savedUserInfo) {
          parsedUserInfo = JSON.parse(savedUserInfo);
          role = parsedUserInfo.role || parsedUserInfo.userRole;
        } else if (token) {
          // Try to decode role from token
          const payload = JSON.parse(atob(token.split('.')[1]));
          role = payload.role || payload.userRole || payload.authorities?.[0];
          parsedUserInfo = {
            username: payload.username || payload.email || 'User',
            role: role,
            id: payload.sub || payload.userId || payload.id
          };
        }
        if (parsedUserInfo) {
          // If user is a patient/user and customerId is missing, fetch it
          if ((role === 'user' || role === 'patient' || role === 'CUSTOMER') && !parsedUserInfo.customerId && parsedUserInfo.id) {
            try {
              const customerProfile = await getCustomerById(parsedUserInfo.id);
              if (customerProfile && customerProfile.id) {
                parsedUserInfo = { ...parsedUserInfo, ...customerProfile, customerId: customerProfile.id };
              }
            } catch (e) {
              console.warn('Could not fetch customer profile:', e);
            }
          }
          setIsLoggedIn(true);
          setUserInfo(parsedUserInfo);
          setUserRole(role);
          console.log('AuthStatus merged userInfo:', parsedUserInfo);
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