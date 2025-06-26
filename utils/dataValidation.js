/**
 * Utility functions for safe data validation and display
 */

/**
 * Safely checks if a value is valid for display (not empty, null, undefined, or zero)
 * @param {any} value - The value to check
 * @param {boolean} allowZero - Whether to allow zero as a valid value
 * @returns {boolean}
 */
export const isValidValue = (value, allowZero = false) => {
  if (value === null || value === undefined) return false;
  if (value === '' || (typeof value === 'string' && value.trim() === '')) return false;
  if (!allowZero && (value === 0 || value === '0')) return false;
  return true;
};

/**
 * Safely converts any value to string for display
 * @param {any} value - The value to convert
 * @param {string} fallback - Fallback value if conversion fails
 * @returns {string}
 */
export const safeToString = (value, fallback = '') => {
  try {
    if (value === null || value === undefined) return fallback;
    return String(value);
  } catch (error) {
    console.warn('Error converting value to string:', error);
    return fallback;
  }
};

/**
 * Safely converts value to number
 * @param {any} value - The value to convert
 * @param {number} fallback - Fallback value if conversion fails
 * @returns {number}
 */
export const safeToNumber = (value, fallback = 0) => {
  try {
    if (value === null || value === undefined || value === '') return fallback;
    const num = Number(value);
    return isNaN(num) ? fallback : num;
  } catch (error) {
    console.warn('Error converting value to number:', error);
    return fallback;
  }
};

/**
 * Validates and formats numeric values for display
 * @param {any} value - The value to process
 * @param {string} unit - Unit to append (e.g., 'طابق', 'م²')
 * @param {boolean} allowZero - Whether to allow zero values
 * @returns {string|null} - Formatted string or null if invalid
 */
export const formatNumericValue = (value, unit = '', allowZero = false) => {
  if (!isValidValue(value, allowZero)) return null;
  const numericValue = safeToNumber(value);
  if (!allowZero && numericValue === 0) return null;
  return `${numericValue}${unit ? ' ' + unit : ''}`;
};

/**
 * Safely renders a component only if the value is valid
 * @param {any} value - The value to check
 * @param {Function} renderComponent - Function that returns the component
 * @param {boolean} allowZero - Whether to allow zero values
 * @returns {JSX.Element|null}
 */
export const renderIfValid = (value, renderComponent, allowZero = false) => {
  if (!isValidValue(value, allowZero)) return null;
  return renderComponent(value);
}; 