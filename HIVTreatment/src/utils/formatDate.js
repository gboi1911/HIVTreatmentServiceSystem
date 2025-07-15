import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

export function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

/**
 * Format date for different backend requirements
 * @param {Object} date - dayjs date object
 * @param {Object} time - dayjs time object
 * @param {string} format - desired format ('iso', 'local', 'mysql', 'backend')
 * @returns {string} Formatted date string
 */
export const formatDateTimeForBackend = (date, time, format = 'backend') => {
  const combinedDateTime = dayjs(date)
    .hour(time.hour())
    .minute(time.minute())
    .second(0)
    .millisecond(0);

  switch (format) {
    case 'backend':
      // Format like "2025-07-15T01:54:27.411Z" - what your backend expects
      return combinedDateTime.utc().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
    
    case 'iso':
      return combinedDateTime.toISOString();
    
    case 'mysql':
      return combinedDateTime.format('YYYY-MM-DD HH:mm:ss');
    
    case 'local':
    default:
      // Format as local datetime without timezone
      const d = combinedDateTime.toDate();
      return d.getFullYear() + '-' + 
        String(d.getMonth() + 1).padStart(2, '0') + '-' + 
        String(d.getDate()).padStart(2, '0') + ' ' + 
        String(d.getHours()).padStart(2, '0') + ':' + 
        String(d.getMinutes()).padStart(2, '0') + ':' + 
        String(d.getSeconds()).padStart(2, '0');
  }
};

/**
 * Try multiple date formats for backend compatibility
 * @param {Object} date - dayjs date object
 * @param {Object} time - dayjs time object
 * @returns {Object} Object with different format options
 */
export const getDateTimeFormats = (date, time) => {
  return {
    backend: formatDateTimeForBackend(date, time, 'backend'),
    iso: formatDateTimeForBackend(date, time, 'iso'),
    local: formatDateTimeForBackend(date, time, 'local'),
    mysql: formatDateTimeForBackend(date, time, 'mysql'),
    timestamp: dayjs(date).hour(time.hour()).minute(time.minute()).valueOf()
  };
};

/**
 * Format date for display purposes
 * @param {string|Date|dayjs} datetime - The datetime to format
 * @param {string} format - Display format
 * @returns {string} Formatted date string
 */
export const formatDateForDisplay = (datetime, format = 'DD/MM/YYYY HH:mm') => {
  return dayjs(datetime).format(format);
};