import React from 'react';
import { Spin } from 'antd';
import { 
  MedicineBoxOutlined, 
  HeartOutlined, 
  SafetyCertificateOutlined,
  LoadingOutlined
} from '@ant-design/icons';

// Enhanced Page Loader with animations
export const EnhancedPageLoader = () => (
  <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center relative overflow-hidden">
    {/* Background Animation */}
    <div className="absolute inset-0 opacity-10">
      <div className="absolute top-20 left-20 w-32 h-32 bg-blue-400 rounded-full animate-pulse"></div>
      <div className="absolute top-40 right-32 w-24 h-24 bg-indigo-400 rounded-full animate-pulse delay-300"></div>
      <div className="absolute bottom-32 left-1/3 w-20 h-20 bg-purple-400 rounded-full animate-pulse delay-700"></div>
      <div className="absolute bottom-20 right-20 w-28 h-28 bg-pink-400 rounded-full animate-pulse delay-500"></div>
    </div>

    <div className="text-center z-10 relative">
      {/* Main Logo Animation */}
      <div className="relative mb-8">
        {/* Outer Ring */}
        <div className="w-32 h-32 rounded-full border-4 border-blue-200 absolute animate-spin"></div>
        
        {/* Middle Ring */}
        <div className="w-24 h-24 rounded-full border-4 border-indigo-300 absolute top-4 left-4 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '2s' }}></div>
        
        {/* Inner Logo */}
        <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto relative top-6 shadow-2xl">
          <MedicineBoxOutlined className="text-3xl animate-pulse" style={{color:"white"}}/>
        </div>
        
        {/* Pulsing Effect */}
        <div className="absolute inset-0 w-32 h-32 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full opacity-20 animate-ping"></div>
      </div>

      {/* Hospital Name */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
          Trung tâm Điều trị HIV/AIDS
        </h2>
        <p className="text-gray-600 font-medium">Chăm sóc và điều trị HIV/AIDS chuyên nghiệp</p>
      </div>

      {/* Loading Text with Animation */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-3 animate-pulse">
          Đang tải trang...
        </h3>
        <div className="flex justify-center items-center space-x-2 text-gray-600">
          <span>Vui lòng đợi trong giây lát</span>
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce delay-100"></div>
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce delay-200"></div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-64 mx-auto mb-6">
        <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full rounded-full animate-pulse"></div>
        </div>
      </div>

      {/* Features Icons */}
      <div className="flex justify-center space-x-8 text-gray-400">
        <div className="flex flex-col items-center animate-pulse">
          <SafetyCertificateOutlined className="text-2xl mb-1" />
          <span className="text-xs">Chứng nhận</span>
        </div>
        <div className="flex flex-col items-center animate-pulse delay-300">
          <HeartOutlined className="text-2xl mb-1" />
          <span className="text-xs">Chăm sóc</span>
        </div>
        <div className="flex flex-col items-center animate-pulse delay-600">
          <MedicineBoxOutlined className="text-2xl mb-1" />
          <span className="text-xs">Chuyên nghiệp</span>
        </div>
      </div>
    </div>
  </div>
);

// Minimal Loader for components
export const ComponentLoader = ({ message = "Đang tải..." }) => (
  <div className="flex items-center justify-center py-16">
    <div className="text-center">
      <div className="relative mb-6">
        <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
        <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-indigo-600 rounded-full animate-spin mx-auto" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
      </div>
      <p className="text-gray-600 font-medium">{message}</p>
    </div>
  </div>
);

// Card Skeleton Loader
export const CardLoader = ({ count = 3 }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {Array.from({ length: count }, (_, index) => (
      <div key={index} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden animate-pulse">
        <div className="h-48 bg-gradient-to-r from-gray-200 to-gray-300"></div>
        <div className="p-6">
          <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded mb-3"></div>
          <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-3/4 mb-4"></div>
          <div className="flex justify-between items-center">
            <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-1/2"></div>
            <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-20"></div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

// Spinner with custom icon
export const CustomSpinner = () => {
  const antIcon = <LoadingOutlined style={{ fontSize: 48, color: '#3b82f6' }} spin />;
  
  return (
    <div className="flex items-center justify-center py-12">
      <div className="text-center">
        <Spin indicator={antIcon} />
        <div className="mt-4 text-gray-600 font-medium">Đang xử lý...</div>
      </div>
    </div>
  );
};

// Full Screen Loading Overlay
export const LoadingOverlay = ({ isVisible, message = "Đang tải..." }) => {
  if (!isVisible) return null;
  
  return (
    <div className="fixed inset-0 bg-white bg-opacity-90 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="text-center">
        <div className="relative mb-6">
          <div className="w-20 h-20 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
          <MedicineBoxOutlined className="absolute inset-0 m-auto text-blue-600 text-2xl" />
        </div>
        <p className="text-gray-700 font-semibold text-lg">{message}</p>
      </div>
    </div>
  );
};