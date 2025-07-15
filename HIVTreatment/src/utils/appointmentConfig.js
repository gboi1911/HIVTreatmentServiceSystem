// Appointment configuration constants
export const APPOINTMENT_CONFIG = {
  // Working hours
  WORKING_HOURS: {
    START: 8,
    END: 18
  },
  
  // Time slot interval in minutes
  TIME_SLOT_INTERVAL: 30,
  
  // Maximum booking advance time (in months)
  MAX_ADVANCE_BOOKING: 3,
  
  // Minimum booking advance time (in hours)
  MIN_ADVANCE_BOOKING: 2,
  
  // Consultation types
  CONSULTATION_TYPES: {
    VIDEO_CALL: 'Video call',
    PHONE: 'Điện thoại',
    IN_PERSON: 'Trực tiếp'
  },
  
  // Appointment statuses
  STATUSES: {
    PENDING: 'PENDING',
    CONFIRMED: 'CONFIRMED',
    COMPLETED: 'COMPLETED',
    CANCELLED: 'CANCELLED',
    NO_SHOW: 'NO_SHOW'
  },
  
  // Status labels in Vietnamese
  STATUS_LABELS: {
    PENDING: 'Chờ xác nhận',
    CONFIRMED: 'Đã xác nhận',
    COMPLETED: 'Hoàn thành',
    CANCELLED: 'Đã hủy',
    NO_SHOW: 'Không đến'
  },
  
  // Blocked days (0 = Sunday, 1 = Monday, etc.)
  BLOCKED_DAYS: [0], // Sunday
  
  // Default consultation duration in minutes
  DEFAULT_DURATION: 60,
  
  // Contact validation patterns
  VALIDATION: {
    PHONE: /^[0-9]{10,11}$/,
    EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  }
};

// Get formatted consultation types for Select options
export const getConsultationTypeOptions = () => {
  return Object.values(APPOINTMENT_CONFIG.CONSULTATION_TYPES).map(type => ({
    label: type,
    value: type
  }));
};

// Get status color for UI display
export const getStatusColor = (status) => {
  const colorMap = {
    [APPOINTMENT_CONFIG.STATUSES.PENDING]: 'orange',
    [APPOINTMENT_CONFIG.STATUSES.CONFIRMED]: 'blue',
    [APPOINTMENT_CONFIG.STATUSES.COMPLETED]: 'green',
    [APPOINTMENT_CONFIG.STATUSES.CANCELLED]: 'red',
    [APPOINTMENT_CONFIG.STATUSES.NO_SHOW]: 'gray'
  };
  
  return colorMap[status] || 'default';
};

// Get status label in Vietnamese
export const getStatusLabel = (status) => {
  return APPOINTMENT_CONFIG.STATUS_LABELS[status] || status;
};
