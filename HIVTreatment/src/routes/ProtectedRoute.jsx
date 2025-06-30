import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Result, Button } from 'antd';
import { LockOutlined, HomeOutlined } from '@ant-design/icons';
import { useAuthStatus } from '../hooks/useAuthStatus';

// Check if user has required role
const hasRequiredRole = (userRole, requiredRoles) => {
  if (!requiredRoles || requiredRoles.length === 0) return true;
  if (!userRole) return false;
  
  // Convert both to lowercase for comparison
  const normalizedUserRole = userRole.toLowerCase();
  const normalizedRequiredRoles = requiredRoles.map(role => role.toLowerCase());
  
  return normalizedRequiredRoles.includes(normalizedUserRole);
};

// Protected Route Component
export const ProtectedRoute = ({ 
  children, 
  requiredRoles = [], 
  redirectTo = "/login",
  fallbackComponent = null 
}) => {
  // ✅ FIX: Use ONLY useAuthStatus hook, not getUserRole() function
  const { isLoggedIn, userRole, loading } = useAuthStatus();
  const location = useLocation();

  // Debug logging
  console.log('🔐 ProtectedRoute Debug:', {
    isLoggedIn,
    userRole,
    requiredRoles,
    loading,
    pathname: location.pathname
  });

  // ✅ FIX: Show loading while checking auth status
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang kiểm tra quyền truy cập...</p>
        </div>
      </div>
    );
  }

  // If not logged in, redirect to login
  if (!isLoggedIn) {
    console.log('❌ Not logged in, redirecting to login');
    return (
      <Navigate 
        to={redirectTo} 
        state={{ 
          from: location.pathname,
          message: 'Vui lòng đăng nhập để truy cập trang này',
          type: 'warning'
        }} 
        replace 
      />
    );
  }

  // If logged in but doesn't have required role
  if (requiredRoles.length > 0 && !hasRequiredRole(userRole, requiredRoles)) {
    console.log('❌ Access denied - Role mismatch:', { userRole, requiredRoles });
    return fallbackComponent || <UnauthorizedPage userRole={userRole} requiredRoles={requiredRoles} />;
  }

  console.log('✅ Access granted');
  return children;
};

// Admin Only Route
export const AdminRoute = ({ children }) => (
  <ProtectedRoute requiredRoles={['admin', 'manager', 'ADMIN', 'MANAGER']}>
    {children}
  </ProtectedRoute>
);

// User Only Route
export const UserRoute = ({ children }) => {
  const { isLoggedIn, userRole, loading, userInfo } = useAuthStatus();
  const location = useLocation();

  // Enhanced debugging
  const token = localStorage.getItem('token');
  const savedUserInfo = localStorage.getItem('userInfo');
  
  console.log('🔍 UserRoute Debug - DETAILED:', {
    pathname: location.pathname,
    isLoggedIn,
    userRole,
    userInfo,
    loading,
    hasToken: !!token,
    hasSavedUserInfo: !!savedUserInfo,
    tokenLength: token ? token.length : 0,
    savedUserInfoContent: savedUserInfo ? savedUserInfo.substring(0, 100) + '...' : 'null'
  });

  // Show loading while checking auth status
  if (loading) {
    console.log('⏳ UserRoute: Still loading authentication status');
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang kiểm tra quyền truy cập...</p>
        </div>
      </div>
    );
  }

  // If not logged in, redirect to login
  if (!isLoggedIn) {
    console.log('❌ UserRoute: Not logged in, redirecting to login');
    console.log('❌ UserRoute: Auth check details:', {
      token: !!token,
      tokenLength: token ? token.length : 0,
      savedUserInfo: !!savedUserInfo,
      isLoggedIn,
      userRole,
      userInfo
    });
    
    return (
      <Navigate 
        to="/login" 
        state={{ 
          from: location.pathname,
          message: 'Vui lòng đăng nhập để truy cập trang này',
          type: 'warning'
        }} 
        replace 
      />
    );
  }

  // For UserRoute, allow access for any logged-in user
  console.log('✅ UserRoute: Allowing access for user role:', userRole);
  return children;
};

// Staff Route
export const StaffRoute = ({ children }) => (
  <ProtectedRoute requiredRoles={['staff', 'doctor', 'STAFF', 'DOCTOR']}>
    {children}
  </ProtectedRoute>
);

// Enhanced Unauthorized Access Page
const UnauthorizedPage = ({ userRole, requiredRoles }) => (
  <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
    <Result
      status="403"
      title="403"
      subTitle={
        <div className="space-y-2">
          <p>Xin lỗi, bạn không có quyền truy cập trang này.</p>
          <p className="text-sm text-gray-500">
            Vai trò hiện tại: <span className="font-medium text-blue-600">{userRole || 'Không xác định'}</span>
          </p>
          <p className="text-sm text-gray-400">
            Yêu cầu vai trò: <span className="font-medium">{requiredRoles?.join(', ') || 'Không xác định'}</span>
          </p>
        </div>
      }
      icon={<LockOutlined className="text-red-500" />}
      extra={
        <div className="space-x-4">
          <Button 
            type="primary" 
            icon={<HomeOutlined />}
            onClick={() => window.location.href = '/'}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 border-none"
          >
            Về trang chủ
          </Button>
          <Button onClick={() => window.history.back()}>
            Quay lại
          </Button>
        </div>
      }
    />
  </div>
);