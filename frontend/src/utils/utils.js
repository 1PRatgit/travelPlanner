/**
 * @param {string} dateStr - The date part, e.g., "2025-10-27" (from day.date)
 * @param {string} timeStr - The time part, e.g., "09:19:13.922000"
 * @returns {string} The formatted time, e.g., "9:19 AM" or a placeholder.
 */

export const formatTime = (timeStr) => {
    if (!timeStr) return "";
    
    // Attempt to create a Date object
    const date = new Date(timeStr);
    if (isNaN(date.getTime())) {
        // Return a clear indicator that the data was bad
        return "Time Data Error"; 
    }
    
    // 3. Formatting options (kept the same)
    const options = {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true // Uses AM/PM notation
    };
    
    // Return the correctly formatted time
    return date.toLocaleTimeString(undefined, options);
};

export const formatDate = (dateStr) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateStr).toLocaleDateString(undefined, options);
  };