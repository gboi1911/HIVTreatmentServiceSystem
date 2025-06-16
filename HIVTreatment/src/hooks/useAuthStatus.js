import { useMemo } from 'react';

export function useAuthStatus() {
  const authStatus = useMemo(() => {
    const token = localStorage.getItem('token');
    if (!token) return { isLoggedIn: false, token: null };
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      
      if (payload.exp && payload.exp < currentTime) {
        localStorage.removeItem('token');
        return { isLoggedIn: false, token: null };
      }
      
      return { isLoggedIn: true, token };
    } catch (error) {
      return { isLoggedIn: !!token, token };
    }
  }, []); // Empty dependency array - only runs once

  return authStatus;
}

// Usage:
// const { isLoggedIn, token } = useAuthStatus();
// console.log('User logged in:', isLoggedIn);