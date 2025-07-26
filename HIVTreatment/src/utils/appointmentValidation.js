import dayjs from 'dayjs';
import { formatDateTimeForBackend, getDateTimeFormats } from './formatDate.js';

/**
 * Validate appointment data before booking
 * @param {Object} appointmentData - The appointment data to validate
 * @returns {Object} Validation result with isValid and errors
 */
export const validateAppointment = (appointmentData) => {
  const errors = [];
  
  // Check required fields
  if (!appointmentData.doctorId) {
    errors.push('Vui lòng chọn bác sĩ');
  }
  
  if (!appointmentData.customerId) {
    errors.push('Thông tin khách hàng không hợp lệ');
  }
  
  if (!appointmentData.datetime) {
    errors.push('Vui lòng chọn ngày và giờ hẹn');
  }
  
  if (!appointmentData.type) {
    errors.push('Vui lòng chọn hình thức tư vấn');
  }
  
  // Validate appointment time
  if (appointmentData.datetime) {
    const appointmentTime = dayjs(appointmentData.datetime);
    const now = dayjs();
    
    // Check if appointment is in the future
    if (appointmentTime.isBefore(now)) {
      errors.push('Thời gian hẹn phải sau thời điểm hiện tại');
    }
    
    // Check if appointment is during working hours (8 AM - 6 PM)
    const hour = appointmentTime.hour();
    if (hour < 8 || hour >= 18) {
      errors.push('Vui lòng chọn thời gian trong khung giờ làm việc (8:00 - 18:00)');
    }
    
    // Check if appointment is not on Sunday
    if (appointmentTime.day() === 0) {
      errors.push('Không thể đặt lịch vào Chủ nhật');
    }
    
    // Check if appointment is not too far in the future (max 3 months)
    const maxDate = now.add(3, 'month');
    if (appointmentTime.isAfter(maxDate)) {
      errors.push('Không thể đặt lịch quá 3 tháng trong tương lai');
    }
  }
  
  // Validate contact information
  if (appointmentData.customerPhone) {
    const phoneRegex = /^[0-9]{10,11}$/;
    if (!phoneRegex.test(appointmentData.customerPhone)) {
      errors.push('Số điện thoại không hợp lệ');
    }
  }
  
  if (appointmentData.customerEmail) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(appointmentData.customerEmail)) {
      errors.push('Email không hợp lệ');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Format appointment data for API submission
 * @param {Object} formData - Form data from the booking form
 * @param {Object} user - Current user data
 * @param {Object} doctor - Selected doctor data
 * @returns {Object} Formatted appointment data
 */
export const formatAppointmentData = (formData, user, doctor) => {
  console.log('🔄 Formatting appointment data...');
  console.log('👤 User object received:', user);
  console.log('👨‍⚕️ Doctor object received:', doctor);
  console.log('📅 Form data received:', formData);
  
  // Determine the correct customer ID
  const customerId = user.customerId || user.id;
  console.log('🆔 Using customer ID:', customerId);
  console.log('🆔 Available IDs in user object:', {
    id: user.id,
    customerId: user.customerId,
    accountId: user.accountId
  });
  
  // Get all possible date formats for debugging
  const allFormats = getDateTimeFormats(formData.date, formData.time);
  console.log('🕐 All date formats:', allFormats);
  
  // Use the backend format that matches your server's expectation
  const formattedDateTime = formatDateTimeForBackend(formData.date, formData.time, 'backend');
  console.log('📅 Selected format (backend):', formattedDateTime);
  console.log('📅 Original date object:', formData.date);
  console.log('📅 Original time object:', formData.time);
  console.log('📅 Combined datetime (local):', dayjs(formData.date).hour(formData.time.hour()).minute(formData.time.minute()).format('YYYY-MM-DD HH:mm:ss'));
  
  // Test: Verify that the formatted datetime matches what the user selected
  const userSelectedDate = dayjs(formData.date).format('YYYY-MM-DD');
  const userSelectedTime = formData.time.format('HH:mm');
  const expectedDateTime = `${userSelectedDate}T${userSelectedTime}:00`;
  console.log('🧪 Test - User selected date:', userSelectedDate);
  console.log('🧪 Test - User selected time:', userSelectedTime);
  console.log('🧪 Test - Expected datetime:', expectedDateTime);
  console.log('🧪 Test - Actual formatted datetime:', formattedDateTime);
  console.log('🧪 Test - Match:', expectedDateTime === formattedDateTime ? '✅ YES' : '❌ NO');
  
  const appointmentData = {
    customerId: customerId,
    doctorId: doctor.id,
    type: formData.consultationType,
    note: formData.reason || '',
    datetime: formattedDateTime,
    customerName: formData.name,
    customerPhone: formData.phone,
    customerEmail: formData.email || ''
  };
  
  console.log('📝 Final appointment data:', appointmentData);
  console.log('🔍 Customer ID in final data:', appointmentData.customerId);
  
  return appointmentData;
};

/**
 * Get available time slots for a specific date
 * @param {string} date - Date in YYYY-MM-DD format
 * @returns {Array} Array of available time slots
 */
export const getAvailableTimeSlots = (date) => {
  const timeSlots = [];
  const startHour = 8;
  const endHour = 18;
  const interval = 30; // 30 minutes
  
  for (let hour = startHour; hour < endHour; hour++) {
    for (let minute = 0; minute < 60; minute += interval) {
      const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      timeSlots.push({
        value: timeString,
        label: timeString,
        time: dayjs().hour(hour).minute(minute)
      });
    }
  }
  
  return timeSlots;
};

/**
 * Check if a specific time slot is available
 * @param {string} datetime - DateTime string
 * @param {Array} existingAppointments - Array of existing appointments
 * @returns {boolean} Whether the time slot is available
 */
export const isTimeSlotAvailable = (datetime, existingAppointments = []) => {
  const appointmentTime = dayjs(datetime);
  
  return !existingAppointments.some(appointment => {
    const existingTime = dayjs(appointment.datetime);
    return Math.abs(appointmentTime.diff(existingTime, 'minute')) < 30;
  });
};

/**
 * Validate appointment data before booking (new version)
 * @param {Object} appointmentData - The appointment data to validate
 * @returns {Object} Validation result with isValid and errors
 */
export const validateAppointmentData = (formData) => {
  const errors = {};
  
  // Validate required fields
  if (!formData.name?.trim()) {
    errors.name = 'Vui lòng nhập họ tên';
  }
  
  if (!formData.phone?.trim()) {
    errors.phone = 'Vui lòng nhập số điện thoại';
  } else if (!/^[0-9]{10,11}$/.test(formData.phone)) {
    errors.phone = 'Số điện thoại không hợp lệ';
  }
  
  if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    errors.email = 'Email không hợp lệ';
  }
  
  if (!formData.date) {
    errors.date = 'Vui lòng chọn ngày';
  }
  
  if (!formData.time) {
    errors.time = 'Vui lòng chọn giờ';
  }
  
  if (!formData.consultationType) {
    errors.consultationType = 'Vui lòng chọn hình thức tư vấn';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
