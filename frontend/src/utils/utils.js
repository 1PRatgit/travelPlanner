/**
 * Ultimate fix for the hyphen issue. It forces the combined string to be 
 * interpreted in the user's timezone, then formats it.
 * @param {string} dateStr - The date part, e.g., "2025-10-27" (from day.date)
 * @param {string} timeStr - The time part, e.g., "09:19:13.922000"
 * @returns {string} The formatted time, e.g., "9:19 AM" or a placeholder.
 */
// export const formatActivityTime = (dateStr, timeStr) => {
//     if (!dateStr || !timeStr) return "";
    
//     // 1. CLEANUP: Ensure time has only three milliseconds digits (or none)
//     let cleanedTime = timeStr;
//     if (timeStr.includes('.')) {
//         const dotIndex = timeStr.indexOf('.');
//         const secondsPart = timeStr.substring(0, dotIndex);
//         // Only grab up to 3 digits for milliseconds
//         const millisecondsPart = timeStr.substring(dotIndex + 1, dotIndex + 4); 
//         cleanedTime = `${secondsPart}.${millisecondsPart}`;
//     } else {
//         // If no milliseconds, ensure it's at least 'HH:MM:SS'
//         cleanedTime = timeStr;
//     }
    
//     // 2. CRITICAL FIX: Use the full timestamp string.
//     // We do NOT append 'Z' or rely on local-time parsing.
//     const fullDateTimeStr = `${dateStr}T${cleanedTime}`;

//     // 3. FORCE DATE PARSING: Use a method that is less prone to timezone errors.
//     // The Date constructor is notoriously inconsistent, but this format is the best bet.
//     const date = new Date(fullDateTimeStr);
    
//     // 4. Validation
//     if (isNaN(date.getTime())) {
//         console.error(`Final time parsing failed for: ${fullDateTimeStr}`);
//         return "N/A (Parse Error)"; 
//     }
    
//     // 5. Formatting options (kept the same)
//     const options = {
//         hour: 'numeric',
//         minute: 'numeric',
//         hour12: true 
//     };
    
//     // 6. Return the local time
//     return date.toLocaleTimeString(undefined, options);
// };

export const formatTime = (timeStr) => {
    // 1. Basic check for null/empty string
    if (!timeStr) return "";
    
    // Attempt to create a Date object
    const date = new Date(timeStr);
    
    // 2. CRITICAL VALIDATION: Check if the date object is valid (i.e., not 'Invalid Date')
    // new Date().getTime() returns NaN for an 'Invalid Date' object.
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